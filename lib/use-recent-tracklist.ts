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
		staleTime: 30_000,
		queryFn: async () => {
			const res = await fetch(
				"https://c32.radioboss.fm/w/recenttrackslist?u=152",
			);
			if (!res.ok) throw new Error("Network response was not ok");
			const trackInfo: TrackInfo[] = await res.json();
			return trackInfo.map<TrackInfoParsed>((track) => ({
				...track,
				// RadioBoss returns `YYYY-MM-DD HH:mm:ss`; normalize it to an ISO-like
				// local timestamp so Hermes and JavaScriptCore parse it consistently.
				started: new Date(track.started.replace(" ", "T")),
			}));
		},
	});
};
