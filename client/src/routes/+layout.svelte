<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import ToastContainer from '$lib/components/ToastContainer.svelte';
	import '../app.css';
</script>

<svelte:head>
	<title>Best URL Shortner</title>
</svelte:head>
<Header />
<slot />
<ToastContainer />
<div class="copyright">
	Copyright &copy; <a href="https://dlohani.com.np" target="_blank">Damodar Lohani</a>
</div>

<style>
    .copyright {
        position: fixed;
        background-color: #111;
        color: #fff;
        width: 100%;
        box-sizing: border-box;
        padding: 10px 50px;
        bottom: 0;
    }
    .copyright a {
        color: #fff;
    }
    .copyright a:visited {
        color: #fff;
    }
</style>
