<script lang="ts">
import QrCode from "./QrCode.svelte";

	export let link: any;
	let onCopy = (event: Event) => {
		console.log('copied to clipboard');
		navigator.clipboard.writeText(link.shortUrl);
	};
</script>

<section>
	<a href={'/links/' + link.id}>
		<div>
			<span>{link.originalUrl}</span>
			<p>
				<span><a href={link.shortUrl} target="_blank">{link.shortUrl}</a></span>
				<button on:click={onCopy}>copy</button>
			</p>
		</div>
	</a>
</section>

<style>
	a {
		text-decoration: none;
	}
	div {
		background-color: #fff;
		border-radius: 8px;
		width: auto;
		margin: 20px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 20px;
		box-sizing: border-box;
	}

	p {
		display: flex;
		margin: 0;
	}

	div span {
		margin-left: 20px;
	}
	button {
		background: #edf2fe;
		color: #2a5bd7;
		height: 35px;
        margin-left: 20px;
	}
	button:hover {
		background: #cedafa;
		color: #2a5bd7;
	}

	@media (max-width: 936px) {
		p {
            margin-top: 10px;
			flex-direction: column;
		}
		div {
			flex-direction: column;
			align-items: stretch;
		}
		div span {
			margin-left: 0;
		}
		button {
			margin-left: 0;
            margin-top: 10px;
			width: auto;
		}
	}
</style>
