<script lang="ts">
	import { page } from '$app/stores';
	import { getUrlDetails, getUsageData } from '$lib/api';
	import Chart from '$lib/components/Chart.svelte';
	import Link from '$lib/components/Link.svelte';
	import { onMount } from 'svelte';
	let usageData: any = {};

	onMount(async () => {
		usageData = await getUsageData($page.params.id);
	});
</script>

{#if usageData.hits}
<h2>Hits: {usageData.hits}</h2>
{/if}

{#if usageData.usage}
<Chart data={usageData.usage} />
{/if}

{#if usageData.error}
	{usageData.error}
{/if}

{#if usageData.url?.id}
	<Link link={usageData.url} />
{/if}

<style>
    h2 {
        margin-left: 20px;
    }
</style>