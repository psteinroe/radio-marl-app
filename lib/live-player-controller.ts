type Awaitable<T = unknown> = T | Promise<T>;

export interface LivePlayerAdapter<Track> {
	pause(): Awaitable;
	play(): Awaitable;
	seekToLiveEdge(): Awaitable;
	setMediaItem(track: Track): Awaitable;
	stop(): Awaitable;
}

/** Serializes player commands so rapid UI/background actions cannot race. */
export function createLivePlayerController<Track>(
	player: LivePlayerAdapter<Track>,
	track: Track,
) {
	let pending = Promise.resolve();

	const run = (command: () => Awaitable) => {
		const result = pending.then(command, command);
		pending = result.then(
			() => undefined,
			() => undefined,
		);
		return result;
	};

	return {
		startFresh: () =>
			run(async () => {
				await player.setMediaItem(track);
				await player.play();
			}),
		resumeAtLiveEdge: () =>
			run(async () => {
				await player.seekToLiveEdge();
				await player.play();
			}),
		pause: () => run(() => player.pause()),
		stop: () => run(() => player.stop()),
	};
}
