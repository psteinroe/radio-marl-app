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

test("rapid player commands remain serialized", async () => {
	let releaseSetMediaItem;
	const setMediaItemBlocked = new Promise((resolve) => {
		releaseSetMediaItem = resolve;
	});
	const player = new FakeLivePlayer();
	player.setMediaItem = async function setMediaItem() {
		this.calls.push("setMediaItem");
		await setMediaItemBlocked;
		this.liveEdge += 1;
	};
	const controller = createLivePlayerController(player, { url: "live" });

	const start = controller.startFresh();
	const stop = controller.stop();
	await new Promise((resolve) => setImmediate(resolve));

	assert.deepEqual(player.calls, ["setMediaItem"]);
	releaseSetMediaItem();
	await Promise.all([start, stop]);
	assert.deepEqual(player.calls, ["setMediaItem", "play", "stop"]);
});

test("a rejected command does not poison later player commands", async () => {
	const player = new FakeLivePlayer();
	player.stop = async function stop() {
		this.calls.push("stop");
		throw new Error("native stop failed");
	};
	const controller = createLivePlayerController(player, { url: "live" });

	await assert.rejects(controller.stop(), /native stop failed/);
	await controller.resumeAtLiveEdge();

	assert.deepEqual(player.calls, ["stop", "seekToLiveEdge", "play"]);
});

test("native remote controls are configured to resume at the live edge", () => {
	assert.equal(RADIO_PLAYER_CONFIG.liveResumeBehavior, "live-edge");
});
