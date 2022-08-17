<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import CloseIcon from './icons/CloseIcon.svelte';
	const dispatch = createEventDispatcher();
	export let show: boolean = false;
	const onDismiss = (event: Event) => {
		event.preventDefault();
		show = false;
	};
</script>

{#if show}
	<div class="wrapper">
		<div class="body">
			<button class="close" on:click={onDismiss}>
				<CloseIcon width="0.8em" />
			</button>
			<slot />
		</div>
	</div>
{/if}

<style>
	div.wrapper {
		display: flex;
		position: fixed;
		top: 0;
		left: 0;
		height: 100vh;
		justify-content: center;
		align-items: center;
		width: 100%;
		padding: 20px;
		box-sizing: border-box;
		background-color: #0009;
	}

	button {
		width: 50px;
		position: absolute;
		right: 20px;
		top: 20px;
		background-color: transparent;
		color: #330;
	}

	button:hover {
		background-color: #0003;
		border-radius: 30px;
	}

	div.body {
		border-radius: 8px;
		display: flex;
		flex-flow: column;
		position: relative;
		background-color: #fff;
		max-width: 600px;
		padding: 20px;
		padding-top: 80px;
	}
</style>
