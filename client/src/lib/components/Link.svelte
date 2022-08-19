<script lang="ts">
	import { addToast } from '$lib/stores/toasts';
	import FacebookIcon from './icons/FacebookIcon.svelte';
	import QrCodeIcon from './icons/QRCodeIcon.svelte';
	import TwitterIcon from './icons/TwitterIcon.svelte';
	import Modal from './Modal.svelte';
	import QrCode from './QrCode.svelte';
	export let link: any;
	export let maxWidth: string = "50%";
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

	let onTwitter = (event: Event) => {
		event.preventDefault();
		window.open('https://twitter.com/intent/tweet?' + 'url=' + link.shortUrl, '_blank');
	};

	let onFacebook = (event: Event) => {
		event.preventDefault();
		window.open('https://www.facebook.com/sharer/sharer.php?' + 'u=' + link.shortUrl, '_blank');
	};
</script>

<a class="top" href={'/links/' + link.id}>
	<section>
		<div>
			<p>{link.originalUrl}</p>
			<p><a class="text-primary" href={link.shortUrl} target="_blank">{link.shortUrl}</a></p>
		</div>
		<div class="options">
			<button on:click={onShowQR} class="qr-code">
				<QrCodeIcon width="1.5em" />
			</button>
			<button on:click={onCopy}>copy</button>
			<button class="button twitter" on:click={onTwitter}>
				<TwitterIcon /> Twitter
			</button>

			<button class="button facebook" on:click={onFacebook}>
				<FacebookIcon width="1.5em" /> Facebook
			</button>
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
		max-width: var(--maxWidth, 900px);
	}
	div.options {
		display: flex;
		flex-flow: row;
		margin-top: 10px;
		height: 40px;
		width: auto;
		overflow: hidden;
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
		border-radius: 8px;
		width: auto;
		max-width: var(--maxWidth);
	}

	a.top:hover {
		background-color: #eee;
	}

	button.qr-code {
		overflow: hidden;
		margin-left: 0px;
	}

	button {
		background: #111;
		color: var(--primary-color);
		height: 40px;
		margin-left: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 8px 15px;
	}
	button:hover {
		background: #333;
	}
</style>
