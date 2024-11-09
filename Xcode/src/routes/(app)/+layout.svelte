<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Toasts from '$lib/components/Toasts.svelte';
	let { data, children } = $props();

	import { onMount } from 'svelte';
	import { collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
	import type { IPost } from '$lib/types';
	import { db } from '$lib/firebase';
	import { addToast } from '$lib';

	let myFollowers = $state<string[]>([]);
	let f = 0;

	onMount(() => {
		const getFollower = async () => {
			const response = await fetch(`http://localhost:5173/api?user=${data.userId}`);
			myFollowers = await response.json();
			f = myFollowers.length;
		};

		const unsub = onSnapshot(doc(db, 'users', data.userId), (doc) => {
			myFollowers = doc.data()!.followers;
		});

		getFollower();

		///////////////


		return () => {
			unsub();
		};
	});

	$effect(() => {
		if (f < myFollowers.length) {
			addToast('qualcuno ha iniziato a seguirti');
		}
		f = myFollowers.length;
	});
</script>

<Toasts />

<div class="flex flex-col gap-3 max-w-[700px] mx-auto">
	<main class="min-h-screen scroll-smooth z-10">
		{@render children()}
	</main>

	<Navbar />
</div>
