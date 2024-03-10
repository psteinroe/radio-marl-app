import { useQuery } from "@tanstack/react-query";

export type NowPlayingInfo = {
  autodj_title: string;
  autodj: boolean;
  live: boolean;
  nowplaying: string;
  listeners: number;
  nexttrack: string;
  nexttrack_artist: string;
  nexttrack_title: string;
  currenttrack_artist: string;
  currenttrack_title: string;
};

export const useNowPlayingInfo = () => {
  return useQuery({
    queryKey: ["nowplayinginfo"],
    refetchInterval: 1000,
    queryFn: async () => {
      const res = await fetch(
        "https://c32.radioboss.fm/w/nowplayinginfo?u=152"
      );
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json() as Promise<NowPlayingInfo>;
    },
  });
};
