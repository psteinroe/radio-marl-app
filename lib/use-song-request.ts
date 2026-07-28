import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const BASE_URL = "https://c32.radioboss.fm";
const STATION_ID = "152";

// Types based on API response
export interface SongSearchResult {
	id: number;
	title: string;
}

interface SongSearchResponse {
	tracks: SongSearchResult[];
	error: boolean;
}

export interface RecentRequest {
	title: string;
	played: boolean;
}

// Hook to search songs with debounce
export const useSongSearch = (query: string) => {
	const [debouncedQuery, setDebouncedQuery] = useState(query);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(query);
		}, 300);

		return () => clearTimeout(timer);
	}, [query]);

	return useQuery({
		queryKey: ["songSearch", debouncedQuery],
		queryFn: async () => {
			if (!debouncedQuery.trim()) return [];

			const res = await fetch(
				`${BASE_URL}/w/songrequestsearch?u=${STATION_ID}&q=${encodeURIComponent(debouncedQuery)}`,
			);
			if (!res.ok) throw new Error("Search failed");
			const response: SongSearchResponse = await res.json();
			return response.tracks || [];
		},
		enabled: debouncedQuery.trim().length > 0,
	});
};

// Hook to submit song request
export const useSongRequestMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (songId: number) => {
			const res = await fetch(
				`${BASE_URL}/w/songrequestmake?u=${STATION_ID}&id=${songId}`,
			);
			if (!res.ok) throw new Error("Request failed");
			return res.json();
		},
		onSuccess: () => {
			// Invalidate recent requests to refresh the list
			queryClient.invalidateQueries({ queryKey: ["recentRequests"] });
		},
	});
};

// Hook to fetch recent song requests
export const useRecentRequests = () => {
	return useQuery({
		queryKey: ["recentRequests"],
		queryFn: async () => {
			const res = await fetch(
				`${BASE_URL}/w/songrequestlist?u=${STATION_ID}&cnt=5`,
			);
			if (!res.ok) throw new Error("Failed to fetch recent requests");
			const results: RecentRequest[] = await res.json();
			return results;
		},
		refetchInterval: 15_000,
		refetchIntervalInBackground: false,
	});
};
