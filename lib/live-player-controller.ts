type Awaitable<T = unknown> = T | Promise<T>;

type MediaTrack = { mediaId?: string };

export interface LivePlayerAdapter<Track> {
	getActiveMediaItem(): Track | null;
	pause(): Awaitable;
	play(): Awaitable;
	setMediaItem(track: Track): Awaitable;
}

interface LivePlayerControllerOptions {
	prepareAttempts?: number;
	prepareRetryMs?: number;
}

/** Serializes player commands so rapid UI/background actions cannot race. */
export function createLivePlayerController<Track extends MediaTrack>(
	player: LivePlayerAdapter<Track>,
	track: Track,
	{
		prepareAttempts = 200,
		prepareRetryMs = 50,
	}: LivePlayerControllerOptions = {},
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

	const isExpectedTrack = (activeTrack: Track | null) =>
		activeTrack === track ||
		(track.mediaId !== undefined && activeTrack?.mediaId === track.mediaId);

	const prepare = async () => {
		for (let attempt = 0; attempt < prepareAttempts; attempt += 1) {
			await player.setMediaItem(track);
			if (isExpectedTrack(player.getActiveMediaItem())) return;
			if (attempt < prepareAttempts - 1) {
				await new Promise((resolve) => setTimeout(resolve, prepareRetryMs));
			}
		}
		throw new Error("Audio player did not become ready");
	};

	return {
		prepare: () => run(prepare),
		play: () => run(() => player.play()),
		pause: () => run(() => player.pause()),
	};
}
