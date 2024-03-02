import { useQuery } from "@tanstack/react-query";

export const useNowPlayingInfo = () => {
  return useQuery({
    queryKey: ["nowplayinginfo"],
    queryFn: async () => {
      const res = await fetch("https://c32.radioboss.fm/w/nowplayinginfo");
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    },
  });
};
