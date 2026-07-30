import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { radioApi } from "./radio-api";

export type { RecentRequest, SongSearchResult } from "./radio-api";

// Hook to search songs with debounce
export const useSongSearch = (query: string) => {
	const [debouncedQuery, setDebouncedQuery] = useState(query);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(query);
		}, 300);

		return () => clearTimeout(timer);
	}, [query]);

	const queryResult = useQuery({
		queryKey: ["songSearch", debouncedQuery],
		queryFn: () => radioApi.searchSongs(debouncedQuery),
		enabled: debouncedQuery.trim().length > 0,
		retry: radioApi.isE2E ? false : undefined,
	});

	return {
		...queryResult,
		isDebouncing: query.trim() !== debouncedQuery.trim(),
	};
};

// Hook to submit song request
export const useSongRequestMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (songId: number) => radioApi.makeSongRequest(songId),
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
		queryFn: () => radioApi.getRecentRequests(),
		retry: radioApi.isE2E ? false : undefined,
		refetchInterval: radioApi.isE2E ? false : 15_000,
		refetchIntervalInBackground: false,
	});
};
