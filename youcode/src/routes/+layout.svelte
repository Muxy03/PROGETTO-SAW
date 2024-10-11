<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Menu from '$lib/components/Menu.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="w-screen h-screen flex flex-col justify-between">
	
	<Navbar />
	
	{@render children()}
	
	<Menu />

</div>