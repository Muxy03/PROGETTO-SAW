<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';

    const Title = "subscribe to premium"
    const action ="subscribe"
</script>

<div class="px-5 flex-[0.6] hidden md:inline-block border py-2 space-y-4">
	<SearchBar />
    <Card {Title} {action} content={"Lorem ipsum dolor sit amet consectetur, adipisicing elit."}/>
</div>
