<script lang="ts">
	import { page } from '$app/stores';
	import { getUrlDetails } from '$lib/api';
	import Chart from '$lib/components/Chart.svelte';
	import Link from '$lib/components/Link.svelte';
	import { onMount } from 'svelte';
	let urlDetails: any = {};

	onMount(async () => {
		urlDetails = await getUrlDetails($page.params.id);
	});
</script>

<Chart id={$page.params.id} />

{#if urlDetails.error}
	{urlDetails.error}
{/if}

{#if urlDetails.id}
	<Link link={urlDetails} />
{/if}
