import assert from "node:assert/strict";
import test from "node:test";
import { createLivePlayerController } from "../lib/live-player-controller.ts";
import { RADIO_PLAYER_CONFIG } from "../lib/radio-player-config.ts";

class FakeLivePlayer {
	calls = [];
	liveEdge = 0;
	playedEdges = [];

	async pause() {
		this.calls.push("pause");
	}

	async play() {
		this.calls.push("play");
		this.playedEdges.push(this.liveEdge);
	}

	async seekToLiveEdge() {
		this.calls.push("seekToLiveEdge");
		this.liveEdge += 1;
	}

	async setMediaItem() {
		this.calls.push("setMediaItem");
		this.liveEdge += 1;
	}

	async stop() {
		this.calls.push("stop");
	}
}

test("a UI start opens a fresh stream before playing", async () => {
	const player = new FakeLivePlayer();
	const controller = createLivePlayerController(player, { url: "live" });

	await controller.startFresh();

	assert.deepEqual(player.calls, ["setMediaItem", "play"]);
	assert.deepEqual(player.playedEdges, [1]);
});

test("a JS resume moves to the live edge before playing", async () => {
	const player = new FakeLivePlayer();
	const controller = createLivePlayerController(player, { url: "live" });

	await controller.stop();
	await controller.resumeAtLiveEdge();

	assert.deepEqual(player.calls, ["stop", "seekToLiveEdge", "play"]);
	assert.deepEqual(player.playedEdges, [1]);
});

test("native remote controls are configured to resume at the live edge", () => {
	assert.equal(RADIO_PLAYER_CONFIG.liveResumeBehavior, "live-edge");
});
