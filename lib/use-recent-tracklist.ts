import { useQuery } from "@tanstack/react-query";
import { radioApi, type TrackInfo } from "./radio-api";

export type { TrackInfo } from "./radio-api";

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
			const trackInfo: TrackInfo[] = await radioApi.getRecentTrackList();
			return trackInfo.map<TrackInfoParsed>((track) => ({
				...track,
				// RadioBoss returns `YYYY-MM-DD HH:mm:ss`; normalize it to an ISO-like
				// local timestamp so Hermes and JavaScriptCore parse it consistently.
				started: new Date(track.started.replace(" ", "T")),
			}));
		},
		retry: radioApi.isE2E ? false : undefined,
	});
};
