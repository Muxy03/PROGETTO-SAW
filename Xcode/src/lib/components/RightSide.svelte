<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';

	const Title = 'subscribe to premium';
	const action = 'subscribe';
</script>

<div
	class="px-5 flex-[0.4] hidden md:inline-flex md:px-3 md:w-screen md:flex-col md:h-screen md:sticky md:z-10
    md:top-0 border py-3 gap-5"
>
	<SearchBar />
	<Card {Title} {action} content={'Lorem ipsum dolor sit amet consectetur, adipisicing elit.'} />
</div>
