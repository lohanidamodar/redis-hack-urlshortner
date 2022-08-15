<script lang="ts">
	export let link: any;
	let onCopy = (event: Event) => {
		console.log('copied to clipboard');
		navigator.clipboard.writeText(link.shortUrl);
	};
</script>

<div>
	<span>{link.originalUrl}</span>
    <p>
        <span><a href="{link.shortUrl}" target="_blank">{link.shortUrl}</a></span>
        <button on:click={onCopy}>copy</button>
    </p>
</div>


<style>
    div {
        background-color: #dddddd;
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
        display: flxe;
        margin: 0;
    }

    div span {
        margin-left: 20px;
    }
    button {
        background: #edf2fe;
    color: #2a5bd7;
    height: 35px;
    }
    button:hover {
        background: #cedafa;
    color: #2a5bd7;
    }
</style>