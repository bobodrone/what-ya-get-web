<script lang="ts">
	import { page } from '$app/state';
</script>

<main
	class="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-6 px-6 text-center"
>
	<p class="text-7xl font-black">{page.status}</p>
	<p class="text-lg text-gray-600">{page.error?.message ?? 'Something went wrong.'}</p>
	<a
		href="/"
		class="rounded-full bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-700"
	>
		Give me a random one
	</a>
</main>
