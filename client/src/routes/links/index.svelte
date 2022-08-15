<script lang="ts">
	import Link from '$lib/components/Link.svelte';
	import { onMount } from 'svelte';

	let urls: any[] = [];
	let error: string;

	onMount(() => {
		loadLinks();
	});

	const loadLinks = async () => {
		let res = await fetch(
			'https://8000-lohanidamod-redishackur-9nx4sio0v2b.ws-us60.gitpod.io/urls',
			{
				method: 'GET',
				mode: 'cors'
			}
		);
		let data = await res.json();
		if (res.status == 200) {
			urls = data;
		} else {
			error = data.error;
		}
	};
</script>

{#each urls as url}
	<Link link={url} />
{/each}
