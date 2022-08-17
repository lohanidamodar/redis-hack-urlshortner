<script lang="ts">
	import { getUrls } from '$lib/api';
	import Link from '$lib/components/Link.svelte';
	import Loading from '$lib/components/Loading.svelte';
import { addToast } from '$lib/stores/toasts';
	import { onMount } from 'svelte';

	let loading = true;
	let urls: any[] = [];

	onMount(() => {
		loading = true;
		loadLinks();
	});

	const loadLinks = async () => {
		const res = await getUrls();
		if (res instanceof Array) {
			urls = res;
			loading = false;
			return;
		}
		if (res.error) {
			addToast({
				message: res.error,
				type: "error"
			})
		}
		loading = false;
	};
</script>

<div>
	{#if loading}
		<Loading />
	{:else}
		{#if urls.length == 0}
			No URLs found
		{/if}
		{#each urls as url}
			<Link link={url} />
		{/each}
	{/if}
</div>

<style>
	div {
		padding: 20px;
	}
</style>
