import assert from "node:assert/strict";
import test from "node:test";
import { createLivePlayerController } from "../lib/live-player-controller.ts";
import { RADIO_PLAYER_CONFIG } from "../lib/radio-player-config.ts";

class FakeLivePlayer {
	activeTrack = null;
	calls = [];

	getActiveMediaItem() {
		return this.activeTrack;
	}

	pause() {
		this.calls.push("pause");
	}

	play() {
		this.calls.push("play");
	}

	setMediaItem(track) {
		this.calls.push("setMediaItem");
		this.activeTrack = track;
	}
}

test("player setup retries media commands dropped before native readiness", async () => {
	let attempts = 0;
	let activeTrack = null;
	const track = { mediaId: "radio", url: "live" };
	const player = {
		getActiveMediaItem: () => activeTrack,
		setMediaItem: (nextTrack) => {
			attempts += 1;
			if (attempts === 2) activeTrack = nextTrack;
		},
	};
	const controller = createLivePlayerController(player, track, {
		prepareRetryMs: 0,
	});

	await controller.prepare();

	assert.equal(attempts, 2);
	assert.equal(activeTrack, track);
});

test("player setup fails instead of waiting indefinitely", async () => {
	const player = {
		getActiveMediaItem: () => null,
		setMediaItem: () => undefined,
	};
	const controller = createLivePlayerController(
		player,
		{ mediaId: "radio" },
		{ prepareAttempts: 2, prepareRetryMs: 0 },
	);

	await assert.rejects(controller.prepare(), /did not become ready/);
});

test("play and pause commands remain serialized", async () => {
	const player = new FakeLivePlayer();
	const controller = createLivePlayerController(player, { mediaId: "radio" });

	await Promise.all([controller.play(), controller.pause()]);

	assert.deepEqual(player.calls, ["play", "pause"]);
});

test("a rejected command does not poison later player commands", async () => {
	const player = new FakeLivePlayer();
	player.pause = function pause() {
		this.calls.push("pause");
		throw new Error("native pause failed");
	};
	const controller = createLivePlayerController(player, { mediaId: "radio" });

	await assert.rejects(controller.pause(), /native pause failed/);
	await controller.play();

	assert.deepEqual(player.calls, ["pause", "play"]);
});

test("native remote controls are configured to resume at the live edge", () => {
	assert.equal(RADIO_PLAYER_CONFIG.liveResumeBehavior, "live-edge");
});
