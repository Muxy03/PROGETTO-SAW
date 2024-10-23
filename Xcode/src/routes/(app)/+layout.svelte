<script lang='ts'>
	import Navbar from '$lib/components/Navbar.svelte';
	import RightSide from '$lib/components/RightSide.svelte';
	let { children } = $props();
</script>

<div class="flex w-full max-w-full">
	<Navbar/>

	<main class="min-h-screen flex-1">
		{@render children()}
	</main>
	
	<RightSide />
</div>