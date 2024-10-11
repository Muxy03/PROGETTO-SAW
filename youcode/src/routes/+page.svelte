<script lang="ts">
	import Card from '$lib/components/Card.svelte';
</script>

<div
	id="scroll"
	class="overflow-y-scroll container mx-auto flex flex-col justify-between items-center flex-nowrap gap-2"
>
	{#each Array(30) as _}
		<Card />
	{/each}
</div>

<style>
	#scroll {
		scrollbar-width: none; /* Nascondi lo scrollbar su Firefox*/
	}

	#scroll::-webkit-scrollbar {
		display: none; /* Nascondi scrollbar su Safari e Chrome */
	}

	:global(html, body) {
		height: 100%;
		margin: 0;
		padding: 0;
		box-sizing: content-box;
		background-color: #374151;
	}
</style>
