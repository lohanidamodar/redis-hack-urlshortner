<script lang="ts">
	import { getUrls } from '$lib/api';
	import Link from '$lib/components/Link.svelte';
	import { onMount } from 'svelte';

	let urls: any[] = [];
	let error: string;

	onMount(() => {
		loadLinks();
	});

	const loadLinks = async () => {
		const res = await getUrls();
		if (res instanceof Array) {
			urls = res;
			return;
		}
		if (res.error) {
			error = res.error;
		}
	};
</script>

{#each urls as url}
	<Link link={url} />
{/each}
