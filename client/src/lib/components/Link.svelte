<script lang="ts">
	export let link: any;
	let onCopy = (event: Event) => {
		console.log('copied to clipboard');
		navigator.clipboard.writeText(link.shortUrl);
	};
</script>

<div>
	<span>{link.originalUrl}</span>
	<span><a href="{link.shortUrl}" target="_blank">{link.shortName}</a></span>
	<button on:click={onCopy} class="secondary">copy</button>
</div>


<style>
    div {
        background-color: #dddddd;
        border-radius: 8px;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 20px;
        box-sizing: border-box;
    }

    div span {
        margin-left: 20px;
    }
</style>