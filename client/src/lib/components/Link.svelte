<script lang="ts">
	import { addToast } from '$lib/stores/toasts';
	import Modal from './Modal.svelte';
	import QrCode from './QrCode.svelte';
	export let link: any;
	let showQr = false;
	let onCopy = (event: Event) => {
		console.log('copied to clipboard');
		event.preventDefault();
		navigator.clipboard.writeText(link.shortUrl);
		addToast({
			message: 'Copied to clipboard',
			type: 'success'
		});
	};
	let onShowQR = (event: Event) => {
		event.preventDefault();
		showQr = true;
	};
</script>

<a class="top" href={'/links/' + link.id}>
	<section>
		<div>
			<p>{link.originalUrl}</p>
			<p><a href={link.shortUrl} target="_blank">{link.shortUrl}</a></p>
		</div>
		<div class="options">
			<button on:click={onShowQR} class="qr-code">
				<QrCode size={40} value={link.shortUrl} />
			</button>
			<button on:click={onCopy}>copy</button>
			<p><a class="button" target="_blank" href={'https://www.facebook.com/sharer/sharer.php?' + 'u=' + link.shortUrl}>Facebook</a></p>
		</div>
	</section>
</a>

<Modal bind:show={showQr}>
	<QrCode size={400} value={link.shortUrl} />
</Modal>

<style>
	section {
		display: flex;
		flex-flow: column;
		padding: 20px;
	}
	div.options {
		display: flex;
		flex-flow: row;
		margin-top: 10px;
		height: 40px;
		width: auto;
		overflow: hidden;
	}
	button.qr-code {
		overflow: hidden;
		width: 40px;
		height: 40px;
		margin-left: 0px;
	}
	div.options p {
		margin-left: 20px;
	}

	div.options p a {
		background-color: #069;
		padding: 8px;
		color: #fff;
		border-radius: 8px;
		height: 40px;
		font-size: 0.6em;
	}

	p {
		margin: 0;
		padding: 0;
	}
	a {
		text-decoration: none;
		color: #333;
	}

	a.top {
		display: block;
		background-color: #fff;
		margin-top: 20px;
		margin-left: 20px;
		border-radius: 8px;
		width: auto;
		max-width: 960px;
	}

	a.top:hover {
		background-color: #eeed;
	}

	button {
		background: #edf2fe;
		color: #2a5bd7;
		height: 40px;
		margin-left: 20px;
	}
	button:hover {
		background: #cedafa;
		color: #2a5bd7;
	}
</style>
