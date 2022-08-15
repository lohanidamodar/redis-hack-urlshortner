<script lang="ts">
import Link from "$lib/components/Link.svelte";

    let originalUrl: String;
    let shortName: String;
    let urlDetails: any;
    let error: String = '';
    let customName: boolean = true;

    let onShorten = async (event: Event) => {
        event.preventDefault();
        if(!originalUrl) {
            error = 'URL is required';
            return;
        }

        if(!(originalUrl.startsWith('http://') && originalUrl.startsWith('https://'))) {
            error = 'Not a valid url';
            return;
        }

        let res = await fetch('https://8000-lohanidamod-redishackur-9nx4sio0v2b.ws-us60.gitpod.io/urls', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                originalUrl: originalUrl,
                shortName: shortName
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
    {#if customName}
        <input class="width-small" placeholder="custom short url" type="text" bind:value={shortName} />
    {/if}
    <button on:click="{onShorten}">Shorten!</button>
</div>

{#if error}
    <p class="error">{error}</p>
{/if}

{#if urlDetails}
<Link link={urlDetails} />
{/if}

<style>
    div {
        background-color: #dddddd;
        border-radius: 8px;
        width: auto;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 20px;
        margin: 20px;
        box-sizing: border-box;
        flex: 2;
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
    }
    input.width-small {
        flex: 1;
    }

    button {
        margin-left: 10px;
        width: 150px;
    }

    p.error {
        padding: 0 20px;
        color: red;
    }

    @media (max-width: 936px){
        div {
            flex-direction: column;
            align-items: stretch;
        }
        input {
            margin-right: 0;
            display: inline-block;
            margin-bottom: 10px;
        }
        input.width-small {
            flex: none;
        }
        button {
            margin-left: 0;
            width: auto;
        }
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

</style>
