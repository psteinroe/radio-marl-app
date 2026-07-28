import { useQuery } from "@tanstack/react-query";

export type NowPlayingInfo = {
	autodj_title: string;
	autodj: boolean;
	live: boolean;
	nowplaying: string;
	listeners: number | string;
	nexttrack: string;
	nexttrack_artist: string;
	nexttrack_title: string;
	currenttrack: string;
	currenttrack_artist: string;
	currenttrack_title: string;
};

export const nowPlayingInfoOpts = {
	queryKey: ["nowplayinginfo"],
	refetchInterval: 10_000,
	refetchIntervalInBackground: false,
	staleTime: 5_000,
	queryFn: async () => {
		const res = await fetch("https://c32.radioboss.fm/w/nowplayinginfo?u=152");
		if (!res.ok) throw new Error("Network response was not ok");
		return res.json() as Promise<NowPlayingInfo>;
	},
};

export const useNowPlayingInfo = () => {
	return useQuery(nowPlayingInfoOpts);
};
