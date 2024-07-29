import { useQuery } from "@tanstack/react-query";

export type TrackInfo = {
	title: string;
	tracktitle: string;
	trackartist: string;
	started: string;
	artworkid: string;
};

export type TrackInfoParsed = {
	title: string;
	tracktitle: string;
	trackartist: string;
	started: Date;
	artworkid: string;
};

export type TrackList = TrackInfoParsed[];

export const useRecentTrackList = () => {
	return useQuery({
		queryKey: ["recenttracklist"],
		queryFn: async () => {
			const res = await fetch(
				"https://c32.radioboss.fm/w/recenttrackslist?u=152",
			);
			if (!res.ok) throw new Error("Network response was not ok");
			const trackInfo: TrackInfo[] = await res.json();
			return trackInfo.map<TrackInfoParsed>((track) => ({
				...track,
				started: new Date(track.started),
			}));
		},
	});
};
