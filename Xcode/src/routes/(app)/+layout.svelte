<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Toasts from '$lib/components/Toasts.svelte';
	import { onMount } from 'svelte';
	import { doc, onSnapshot } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { addToast } from '$lib';

	let { data, children } = $props();

	let myFollowers = $state<string[]>([]);
	let cacheFollower = 0;

	onMount(() => {
		const getFollower = async () => {
			const response = await fetch(`http://localhost:5173/api?user=${data.userId}`);
			myFollowers = await response.json();
			cacheFollower = myFollowers.length;
		};

		const unsub = onSnapshot(doc(db, 'users', data.userId), (doc) => {
			myFollowers = doc.data()!.followers;
		});

		getFollower();

		return () => {
			unsub();
		};
	});

	$effect(() => {
		if (cacheFollower < myFollowers.length) {
			addToast('qualcuno ha iniziato a seguirti');
		}
		cacheFollower = myFollowers.length;
	});
</script>

<!-- <div class="min-h-screen flex flex-col items-center justify-between"> -->
	<div class=" min-h-full overflow-y-auto flex flex-col gap-2 items-center justify-between bg-background/70 pt-14 pb-20">
		<Toasts/>
		<div class="max-h-3/6 p-4">
			{@render children()}
		</div>
		<Navbar />
	</div>
<!-- </div> -->