<script lang="ts">
import Link from "$lib/components/Link.svelte";

    let originalUrl: String;
    let urlDetails: any;
    let error: '';

    let onShorten = async (event: Event) => {
        event.preventDefault();
        let res = await fetch('https://8000-lohanidamod-redishackur-9nx4sio0v2b.ws-us60.gitpod.io/urls', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                originalUrl: originalUrl,
            })
        });
        let data = await res.json();
        if(res.status == 201) {
            urlDetails = data;
        } else {
            error = data.error;
        }
    }
</script>

<div>
    <input bind:value="{originalUrl}" type="text" name="originalUrl" placeholder="Shorten your url" />
    <button on:click="{onShorten}">Shorten!</button>
</div>
{#if urlDetails}
<Link link={urlDetails} />
{/if}

<style>
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
    }
    input:hover {
        border-color: #b0b1b4;
    }
    input:focus {
        outline: none;
    -webkit-box-shadow: 0 0 0 2px rgb(206 218 250);
    -moz-box-shadow: 0 0 0 2px rgba(206,218,250,1);
    box-shadow: 0 0 0 2px rgb(206 218 250);
    }
    button {
        border: none;
        width: 150px;
        background: #1b3987;
        color: white;
        margin-left: 10px;
        border-radius: 8px;
        cursor: pointer;
        height: 50px;
    }
    button:hover {
        background: #2a5bd7;
    }
    button:focus {
        box-shadow: 0 0 0 2px rgb(206 218 250);
    }
    button.secondary {
        background: #edf2fe;
    color: #2a5bd7;
    height: 35px;
    }
    button.secondary:hover {
        background: #cedafa;
    color: #2a5bd7;
    }
</style>
