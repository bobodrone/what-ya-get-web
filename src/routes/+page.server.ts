import { error } from '@sveltejs/kit';
import { API_URL, randomItem, type WygItem } from '$lib/wyg';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	// Use the global fetch (not the SvelteKit-provided one): this is a
	// server-only load, so there is no CORS restriction talking to the external
	// API, and the response is never replayed to the browser.
	const res = await fetch(API_URL);
	if (!res.ok) {
		throw error(res.status, 'Could not load messages from the API.');
	}
	const items: WygItem[] = await res.json();
	if (!items.length) {
		throw error(502, 'The API returned no messages.');
	}

	// `?wyg=[id]` shows one specific message; otherwise a fresh random one on
	// every (re)load. Accessing url.searchParams makes this load re-run whenever
	// the query changes.
	const wyg = url.searchParams.get('wyg');
	let selected: WygItem | undefined;
	if (wyg !== null) {
		selected = items.find((i) => String(i.Id) === wyg);
		if (!selected) {
			throw error(404, `No message found for wyg=${wyg}.`);
		}
	} else {
		selected = randomItem(items);
	}

	return { selected, total: items.length, pinned: wyg !== null };
};
