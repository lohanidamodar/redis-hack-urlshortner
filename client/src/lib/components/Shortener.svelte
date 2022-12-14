<script lang="ts">
	import { shorten } from '$lib/api';
	import Link from '$lib/components/Link.svelte';
	import { addToast } from '$lib/stores/toasts';

	let originalUrl: String;
	let shortName: String;
	let urlDetails: any;
	let error: String = '';
	let customName: boolean = true;

	let onShorten = async (event: Event) => {
		event.preventDefault();
		if (!originalUrl) {
			addToast({
				message: 'URL is required',
				type: 'error'
			});
			return;
		}

		if (!(originalUrl.startsWith('http://') || originalUrl.startsWith('https://'))) {
			addToast({
				message: 'URL is invalid',
				type: 'error'
			});
			return;
		}

		let res = await shorten(originalUrl, shortName);
		if (res.error) {
			addToast({
				message: res.error,
				type: 'error'
			});
		} else {
			urlDetails = res;
			originalUrl = '';
			shortName = '';
		}
	};
</script>

<section>
	<div>
		<label for="originalUrl">🔗 Your Original URL</label>
		<input bind:value={originalUrl} type="text" name="originalUrl" placeholder="URL" />
		{#if customName}
			<label for="shortName">🪄 Customize Link (Optional)</label>
			<input class="width-small" placeholder="alias" type="text" bind:value={shortName} />
		{/if}
		<button on:click={onShorten}>Shorten!</button>
	</div>

	{#if error}
		<p class="error">{error}</p>
	{/if}

	{#if urlDetails}
		<Link maxWidth="500px" link={urlDetails} />
	{/if}
</section>

<style>
	section {
		display: flex;
		flex-flow: column;
	}
	div {
		background-color: #fff;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: stretch;
		padding: 40px;
		box-sizing: border-box;
		min-width: 500px;
	}

	label {
		margin-bottom: 10px;
	}

	input {
		padding: 10px 20px;
		flex-grow: 1;
		border-radius: 4px;
		height: 50px;
		background: #fff;
		border: 1px solid #d3d4d7;
		border-radius: 8px;
		margin-right: 20px;
		margin-bottom: 0;
		font-size: 20px;
		color: #36383b;
		padding: 0 20px;
		margin-right: 0;
		display: inline-block;
		margin-bottom: 10px;
	}

	p.error {
		padding: 0 20px;
		color: red;
	}

	input:hover {
		border-color: #b0b1b4;
	}
	input:focus {
		outline: none;
		-webkit-box-shadow: 0 0 0 2px rgb(206 218 250);
		-moz-box-shadow: 0 0 0 2px rgba(206, 218, 250, 1);
		box-shadow: 0 0 0 2px rgb(206 218 250);
	}

	@media (max-width: 900px) {
		div {
			padding: 20px;
			min-width: auto;
		}
	}
</style>
