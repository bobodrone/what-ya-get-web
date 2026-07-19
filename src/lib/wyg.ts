// Types and helpers for the "what-ya-get" (wyg) items loaded from the public API.

export const API_URL = 'https://api.pennache.art/api/items';

export interface WygItem {
	Id: number;
	Name: string;
	Nth: number;
	Unit: string;
	/** A URL to an accompanying piece of "art" — in practice a YouTube link. */
	Art: string;
}

/** Pick a uniformly random element from a non-empty array. */
export function randomItem<T>(items: T[]): T {
	return items[Math.floor(Math.random() * items.length)];
}

/**
 * Extract the 11-character YouTube video id from any of the URL shapes the API
 * uses (watch?v=, youtu.be/, with extra &list / &t / ?si params). Returns null
 * if the URL isn't a recognisable YouTube link.
 */
export function youtubeId(url: string): string | null {
	try {
		const u = new URL(url);
		const host = u.hostname.replace(/^www\./, '');
		if (host === 'youtu.be') {
			const id = u.pathname.slice(1);
			return id || null;
		}
		if (host === 'youtube.com' || host === 'm.youtube.com') {
			return u.searchParams.get('v');
		}
		return null;
	} catch {
		return null;
	}
}

/** Build an embeddable YouTube URL (preserving a start time if present). */
export function youtubeEmbedUrl(url: string): string | null {
	const id = youtubeId(url);
	if (!id) return null;
	let start: string | null = null;
	try {
		const t = new URL(url).searchParams.get('t');
		if (t) start = t.replace(/s$/, '');
	} catch {
		// ignore
	}
	const params = new URLSearchParams({ rel: '0' });
	if (start) params.set('start', start);
	return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}
