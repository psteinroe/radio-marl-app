import assert from "node:assert/strict";
import test from "node:test";
import { createRadioApi } from "../lib/radio-api.ts";

test("the E2E radio API exposes deterministic metadata and song interactions", async () => {
	const api = createRadioApi({ e2e: true, fixtureDelayMs: 0 });

	const nowPlaying = await api.getNowPlayingInfo();
	assert.equal(nowPlaying.currenttrack_title, "Maestro Live Track");
	assert.equal(nowPlaying.currenttrack_artist, "Radio Marl Test");

	await assert.rejects(api.getRecentRequests(), /fixture failure/);
	const recentRequests = [
		{ title: "Maestro Wunsch Eins", played: false },
		{ title: "Maestro Wunsch Zwei", played: true },
	];
	assert.deepEqual(await api.getRecentRequests(), recentRequests);
	assert.deepEqual(await api.getRecentRequests(), recentRequests);
	assert.deepEqual(await api.getRecentRequests(), []);

	assert.deepEqual(await api.searchSongs("maestro"), [
		{ id: 1001, title: "Maestro Erfolg" },
		{ id: 1002, title: "Maestro Fehler" },
	]);
	assert.deepEqual(await api.searchSongs("maestro leer"), []);
	await assert.rejects(api.searchSongs("maestro fehler"), /fixture failure/);

	await api.makeSongRequest(1001);
	await assert.rejects(api.makeSongRequest(1002), /fixture failure/);
});

test("the E2E tracklist can exercise error, populated, and empty states", async () => {
	const api = createRadioApi({ e2e: true, fixtureDelayMs: 0 });

	await assert.rejects(api.getRecentTrackList(), /fixture failure/);
	const tracks = await api.getRecentTrackList();
	assert.deepEqual(
		tracks.map(({ tracktitle, trackartist }) => ({ tracktitle, trackartist })),
		[
			{ tracktitle: "Maestro Current Track", trackartist: "Radio Marl Test" },
			{ tracktitle: "Maestro Previous Track", trackartist: "Test Artist" },
		],
	);
	assert.deepEqual(await api.getRecentTrackList(), []);
});

test("the production radio API calls and parses every RadioBoss endpoint", async () => {
	const calls = [];
	const responses = [
		{ currenttrack_title: "Live title" },
		[{ tracktitle: "Track" }],
		{ error: false, tracks: [{ id: 42, title: "A & B" }] },
		{ success: true },
		[{ title: "Recent", played: false }],
	];
	const fetchImpl = async (url) => {
		calls.push(String(url));
		return {
			ok: true,
			json: async () => responses.shift(),
		};
	};
	const api = createRadioApi({ e2e: false, fetchImpl });

	assert.equal(
		(await api.getNowPlayingInfo()).currenttrack_title,
		"Live title",
	);
	assert.equal((await api.getRecentTrackList())[0].tracktitle, "Track");
	assert.deepEqual(await api.searchSongs("A & B"), [
		{ id: 42, title: "A & B" },
	]);
	assert.deepEqual(await api.makeSongRequest(42), { success: true });
	assert.deepEqual(await api.getRecentRequests(), [
		{ title: "Recent", played: false },
	]);
	assert.deepEqual(calls, [
		"https://c32.radioboss.fm/w/nowplayinginfo?u=152",
		"https://c32.radioboss.fm/w/recenttrackslist?u=152",
		"https://c32.radioboss.fm/w/songrequestsearch?u=152&q=A%20%26%20B",
		"https://c32.radioboss.fm/w/songrequestmake?u=152&id=42",
		"https://c32.radioboss.fm/w/songrequestlist?u=152&cnt=5",
	]);
});

test("the production radio API rejects HTTP and application errors", async () => {
	const httpFailure = createRadioApi({
		e2e: false,
		fetchImpl: async () => ({ ok: false }),
	});
	await assert.rejects(httpFailure.getNowPlayingInfo(), /not ok/);

	const searchFailure = createRadioApi({
		e2e: false,
		fetchImpl: async () => ({
			ok: true,
			json: async () => ({ error: true, tracks: [] }),
		}),
	});
	await assert.rejects(searchFailure.searchSongs("anything"), /Search failed/);
});
