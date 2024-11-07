<script lang='ts'>
	import Navbar from '$lib/components/Navbar.svelte';
	let { children } = $props();
</script>

<div class="flex flex-col gap-3 max-w-[700px] mx-auto">

	<main class="min-h-screen scroll-smooth z-10">
		{@render children()}
	</main>
	
	<Navbar/>
</div>


