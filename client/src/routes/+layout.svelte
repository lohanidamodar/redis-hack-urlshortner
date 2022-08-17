<script lang="ts">
    import Header from '$lib/components/Header.svelte';
import ToastContainer from '$lib/components/ToastContainer.svelte';
    import '../app.css'
</script>
<svelte:head>
    <title>Best URL Shortner</title>
</svelte:head>
<Header />
<slot></slot>
<ToastContainer />