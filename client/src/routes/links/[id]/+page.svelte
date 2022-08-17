<script lang="ts">
	import { page } from '$app/stores';
	import { getUsageData, getUsageDataDaily } from '$lib/api';
	import Chart from '$lib/components/Chart.svelte';
	import Link from '$lib/components/Link.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import { addToast } from '$lib/stores/toasts';
	import { onMount } from 'svelte';
	let usageData: any = {};
	let loading: boolean = true;

	let period = '24h';

	onMount(async () => {
		try {
			usageData = await getUsageData($page.params.id);
			if(usageData.error) {
				addToast({
					message: usageData.error,
					type: "error",
				})
			}
			loading = false;
		} catch(e: any) {
			loading = false;
			addToast({
				message: e.toString(),
				type: "error"
			})
		}
	});

	const onClick24 = async (event: Event) => {
		if(period !== '24h') {
			usageData = await getUsageData($page.params.id);
			period = '24h';
		}
	}

	const onClick30d = async (event: Event) => {
		if(period !== '30d') {
			usageData = await getUsageDataDaily($page.params.id);
			period = '30d';
		}
	}
</script>

{#if loading}
	<Loading />
{/if}

{#if usageData.hits}
<h2>Hits: {usageData.hits}</h2>
{/if}

{#if usageData.usage}
<div class="ticks">
	<button disabled={period == '24h'} on:click={onClick24}>24h</button>
	<button disabled={period == '30d'} on:click={onClick30d} >30d</button>
</div>
<Chart bind:data={usageData.usage} />
{/if}

{#if usageData.url?.id}
	<Link link={usageData.url} />
{/if}

<style>
    h2 {
        margin-left: 20px;
		color: #fff;
    }
	div.ticks {
		display: flex;
		flex-flow: row;
		justify-content: flex-end;
		max-width: 960px;
	}
	div button {
		margin-left: 20px;
	}
	button:disabled {
		background-color: #ccc;
		color: #000;
		cursor: default;
	}
</style>