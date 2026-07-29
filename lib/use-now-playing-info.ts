import { useQuery } from "@tanstack/react-query";
import { radioApi } from "./radio-api";

export type { NowPlayingInfo } from "./radio-api";

export const nowPlayingInfoOpts = {
	queryKey: ["nowplayinginfo"],
	refetchInterval: 10_000,
	refetchIntervalInBackground: false,
	staleTime: 5_000,
	queryFn: () => radioApi.getNowPlayingInfo(),
	retry: radioApi.isE2E ? false : undefined,
};

export const useNowPlayingInfo = () => {
	return useQuery(nowPlayingInfoOpts);
};
