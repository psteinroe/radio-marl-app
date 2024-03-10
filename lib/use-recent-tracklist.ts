import { useQuery } from "@tanstack/react-query";

export type TrackInfo = {
  title: string;
  tracktitle: string;
  trackartist: string;
  started: string;
  artworkid: string;
};

export type TrackList = TrackInfo[];

export const useRecentTrackList = () => {
  return useQuery({
    queryKey: ["recenttracklist"],
    queryFn: async () => {
      const res = await fetch(
        "https://c32.radioboss.fm/w/recenttrackslist?u=152"
      );
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json() as Promise<TrackList>;
    },
  });
};
