import { useQuery } from "@tanstack/react-query";

export const useRecentTrackList = () => {
  return useQuery({
    queryKey: ["recenttracklist"],
    queryFn: async () => {
      const res = await fetch("https://c32.radioboss.fm/w/recenttrackslist");
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    },
  });
};
