<script lang="ts">
	import { onMount } from 'svelte';

	// Target: 2042-12-12 15:00:00 CET. December is standard time (CET = UTC+1),
	// so this is 14:00:00 UTC.
	const TARGET_MS = Date.UTC(2042, 11, 12, 14, 0, 0);

	// Microseconds remaining. 0 until the first browser frame runs, which keeps
	// the server-rendered and initial client markup identical (no hydration
	// mismatch) — the counter only "lights up" once we're in the browser.
	let microsLeft = $state(0);

	onMount(() => {
		let raf = 0;
		const tick = () => {
			// performance.timeOrigin + performance.now() gives a sub-millisecond
			// wall-clock reading, so we get genuine microsecond resolution.
			const nowMs = performance.timeOrigin + performance.now();
			microsLeft = Math.max(0, Math.round((TARGET_MS - nowMs) * 1000));
			raf = requestAnimationFrame(tick);
		};
		tick();
		return () => cancelAnimationFrame(raf);
	});
</script>

<p class="font-mono text-xs tracking-tight tabular-nums text-gray-300 select-none">
	{#if microsLeft > 0}
		{microsLeft.toLocaleString()} µs until 2042-12-12 15:00 CET
	{:else}
		&nbsp;
	{/if}
</p>
