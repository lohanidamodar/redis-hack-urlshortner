<script>
	import Shortener from "$lib/components/Shortener.svelte";

</script>

<div>
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
</div>

<style>
	div {
		display: flex;
		flex-flow: row;
	}
	div.info {
		padding-top: 20px;
		color: white;
		flex-flow: column;
	}
</style>