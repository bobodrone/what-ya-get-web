<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import Countdown from '$lib/Countdown.svelte';
	import { youtubeEmbedUrl } from '$lib/wyg';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let item = $derived(data.selected);
	let embed = $derived(youtubeEmbedUrl(item.Art));
	let permalink = $derived(`/?wyg=${item.Id}`);

	let shuffling = $state(false);

	// Get a fresh random message. When we're viewing a pinned `?wyg=` link we
	// navigate back to `/`; otherwise we re-run the load to reroll the random.
	async function another() {
		shuffling = true;
		try {
			if (data.pinned) {
				await goto('/', { invalidateAll: true });
			} else {
				await invalidateAll();
			}
		} finally {
			shuffling = false;
		}
	}
</script>

<svelte:head>
	<title>{item.Name}</title>
	<meta name="description" content={`${item.Nth} ${item.Unit}`} />
</svelte:head>

<main
	class="relative mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-8 px-6 py-16 text-center"
>
	<div class="absolute inset-x-0 top-4 flex justify-center px-6">
		<Countdown />
	</div>

	<h1 class="text-sm font-semibold tracking-[0.3em] text-gray-400 uppercase">What Ya Get</h1>

	<article class="flex flex-col items-center gap-4">
		<p class="text-lg text-balance text-gray-500">{item.Name}</p>

		<p class="text-7xl font-black tracking-tight tabular-nums sm:text-8xl">
			{item.Nth.toLocaleString()}
		</p>

		<p class="text-2xl font-medium text-gray-700 sm:text-3xl">{item.Unit}</p>
	</article>

	{#if embed}
		<div class="aspect-video w-full overflow-hidden rounded-xl shadow-lg">
			<iframe
				class="h-full w-full"
				src={embed}
				title={item.Name}
				loading="lazy"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowfullscreen
			></iframe>
		</div>
	{:else}
		<a class="text-indigo-600 underline" href={item.Art} target="_blank" rel="noopener noreferrer">
			Open the art ↗
		</a>
	{/if}

	<div class="flex flex-wrap items-center justify-center gap-3">
		<button
			type="button"
			onclick={another}
			disabled={shuffling}
			class="rounded-full bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-700 disabled:opacity-50"
		>
			{shuffling ? 'Shuffling…' : 'Give me another'}
		</button>

		<a
			href={permalink}
			class="rounded-full border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
		>
			Permalink
		</a>
	</div>

	<p class="text-xs text-gray-400">
		#{item.Id} of {data.total.toLocaleString()} messages
	</p>

	<details class="max-w-md text-left text-sm text-gray-500">
		<summary class="cursor-pointer text-center font-medium text-gray-400 hover:text-gray-600">
			What is this?
		</summary>
		<p class="mt-3 text-balance">
			<strong>What Ya Get</strong> is a little collection of the things I bring to the work place table —
			counted up over time until retirement and I paired it with a song. Each visit shows a random one; reload for
			another, or share a specific one with its permalink. For more info: <a target="_blank" href="https://www.linkedin.com/in/pennache/" class="underline underline-offset-4"><strong>click here</strong>.</a>
		</p>
	</details>
</main>
