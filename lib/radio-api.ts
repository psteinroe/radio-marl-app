const BASE_URL = "https://c32.radioboss.fm";
const STATION_ID = "152";

export interface NowPlayingInfo {
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
}

export interface TrackInfo {
	title: string;
	tracktitle: string;
	trackartist: string;
	started: string;
	artworkid: string;
}

export interface SongSearchResult {
	id: number;
	title: string;
}

interface SongSearchResponse {
	tracks: SongSearchResult[];
	error: boolean;
}

export interface RecentRequest {
	title: string;
	played: boolean;
}

interface RadioApiOptions {
	fetchImpl?: typeof fetch;
	e2e?: boolean;
	fixtureDelayMs?: number;
}

const E2E_NOW_PLAYING: NowPlayingInfo = {
	autodj_title: "",
	autodj: true,
	live: true,
	nowplaying: "Radio Marl Test - Maestro Live Track",
	listeners: 1,
	nexttrack: "",
	nexttrack_artist: "",
	nexttrack_title: "",
	currenttrack: "Radio Marl Test - Maestro Live Track",
	currenttrack_artist: "Radio Marl Test",
	currenttrack_title: "Maestro Live Track",
};

const E2E_TRACKS: TrackInfo[] = [
	{
		title: "Radio Marl Test - Maestro Current Track",
		tracktitle: "Maestro Current Track",
		trackartist: "Radio Marl Test",
		started: "2026-01-02 12:00:00",
		artworkid: "e2e-current",
	},
	{
		title: "Test Artist - Maestro Previous Track",
		tracktitle: "Maestro Previous Track",
		trackartist: "Test Artist",
		started: "2026-01-02 11:55:00",
		artworkid: "e2e-previous",
	},
];

const E2E_RECENT_REQUESTS: RecentRequest[] = [
	{ title: "Maestro Wunsch Eins", played: false },
	{ title: "Maestro Wunsch Zwei", played: true },
];

const E2E_SEARCH_RESULTS: SongSearchResult[] = [
	{ id: 1001, title: "Maestro Erfolg" },
	{ id: 1002, title: "Maestro Fehler" },
];

export function createRadioApi({
	fetchImpl = fetch,
	e2e = process.env.EXPO_PUBLIC_E2E === "true",
	fixtureDelayMs = 1_200,
}: RadioApiOptions = {}) {
	let recentRequestCalls = 0;
	let trackListCalls = 0;

	const waitForFixture = () =>
		fixtureDelayMs > 0
			? new Promise<void>((resolve) => setTimeout(resolve, fixtureDelayMs))
			: Promise.resolve();

	const fixtureFailure = () => new Error("E2E fixture failure");

	return {
		isE2E: e2e,

		async getNowPlayingInfo(): Promise<NowPlayingInfo> {
			if (e2e) {
				await waitForFixture();
				return E2E_NOW_PLAYING;
			}

			const response = await fetchImpl(
				`${BASE_URL}/w/nowplayinginfo?u=${STATION_ID}`,
			);
			if (!response.ok) throw new Error("Network response was not ok");
			return response.json() as Promise<NowPlayingInfo>;
		},

		async getRecentTrackList(): Promise<TrackInfo[]> {
			if (e2e) {
				await waitForFixture();
				trackListCalls += 1;
				if (trackListCalls === 1) throw fixtureFailure();
				if (trackListCalls === 2) return E2E_TRACKS;
				return [];
			}

			const response = await fetchImpl(
				`${BASE_URL}/w/recenttrackslist?u=${STATION_ID}`,
			);
			if (!response.ok) throw new Error("Network response was not ok");
			return response.json() as Promise<TrackInfo[]>;
		},

		async searchSongs(query: string): Promise<SongSearchResult[]> {
			if (!query.trim()) return [];

			if (e2e) {
				await waitForFixture();
				const normalizedQuery = query.trim().toLocaleLowerCase();
				if (normalizedQuery === "maestro leer") return [];
				if (normalizedQuery === "maestro fehler") throw fixtureFailure();
				return E2E_SEARCH_RESULTS;
			}

			const response = await fetchImpl(
				`${BASE_URL}/w/songrequestsearch?u=${STATION_ID}&q=${encodeURIComponent(query)}`,
			);
			if (!response.ok) throw new Error("Search failed");
			const result = (await response.json()) as SongSearchResponse;
			if (result.error) throw new Error("Search failed");
			return result.tracks || [];
		},

		async makeSongRequest(songId: number): Promise<unknown> {
			if (e2e) {
				await waitForFixture();
				if (songId === 1002) throw fixtureFailure();
				return { success: true };
			}

			const response = await fetchImpl(
				`${BASE_URL}/w/songrequestmake?u=${STATION_ID}&id=${songId}`,
			);
			if (!response.ok) throw new Error("Request failed");
			return response.json();
		},

		async getRecentRequests(): Promise<RecentRequest[]> {
			if (e2e) {
				await waitForFixture();
				recentRequestCalls += 1;
				if (recentRequestCalls === 1) throw fixtureFailure();
				if (recentRequestCalls >= 4) return [];
				return E2E_RECENT_REQUESTS;
			}

			const response = await fetchImpl(
				`${BASE_URL}/w/songrequestlist?u=${STATION_ID}&cnt=5`,
			);
			if (!response.ok) throw new Error("Failed to fetch recent requests");
			return response.json() as Promise<RecentRequest[]>;
		},
	};
}

export const radioApi = createRadioApi();
