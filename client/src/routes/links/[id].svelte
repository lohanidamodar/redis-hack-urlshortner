<script lang="ts">
import { page } from "$app/stores";
import Chart from "$lib/components/Chart.svelte";
    let id = $page.params.id;
</script>

<Chart id={$page.params.id} />

{id}