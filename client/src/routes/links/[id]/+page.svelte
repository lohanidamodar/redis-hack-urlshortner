<script lang="ts">
	import { page } from '$app/stores';
	import { getUsageData } from '$lib/api';
	import Chart from '$lib/components/Chart.svelte';
	import Link from '$lib/components/Link.svelte';
	import { addToast } from '$lib/stores/toasts';
	import { onMount } from 'svelte';
	let usageData: any = {};

	onMount(async () => {
		try {
			usageData = await getUsageData($page.params.id);
			if(usageData.error) {
				addToast({
					message: usageData.error,
					type: "error",
				})
			}
		} catch(e: any) {
			addToast({
				message: e.toString(),
				type: "error"
			})
		}
	});
</script>

{#if usageData.hits}
<h2>Hits: {usageData.hits}</h2>
{/if}

{#if usageData.usage}
<Chart data={usageData.usage} />
{/if}

{#if usageData.url?.id}
	<Link link={usageData.url} />
{/if}

<style>
    h2 {
        margin-left: 20px;
    }
</style>