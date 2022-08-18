<script>
	import Shortener from "$lib/components/Shortener.svelte";

</script>

<section>
	<Shortener />
	<div class="info">
		<h2>Welcome to ULR Shortener</h2>
		<ul>
			<li>Awesome customized links</li>
			<li>Link History</li>
			<li>Link metrics</li>
			<li>QR Code</li>
			<li>Quick share</li>
		</ul>
	</div>
</section>

<style>
	section {
		padding: 140px;
		display: flex;
		flex-flow: row;
		justify-content: stretch;
	}
	ul {
		margin-top: 0;
	}
	div.info {
		padding-top: 20px;
		padding-left: 40px;
		color: white;
		flex-flow: column;
	}
	@media (max-width: 1000px) {
		section {
			flex-flow: column;
		}
		div.info {
			display: none;
		}
	}
</style>