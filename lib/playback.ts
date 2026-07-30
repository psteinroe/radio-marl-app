import type { BackgroundEvent } from "@rntp/player";

/**
 * RNTP requires an Android headless handler to be registered at the app entry
 * point. Remote controls use native handling, so no JS work is needed here.
 */
export async function PlaybackService(_event: BackgroundEvent) {}
