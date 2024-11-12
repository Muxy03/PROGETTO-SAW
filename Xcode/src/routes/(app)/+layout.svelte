<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Toasts from '$lib/components/Toasts.svelte';
	import { onMount } from 'svelte';
	import { doc, getDoc, onSnapshot } from 'firebase/firestore';
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
			const last = myFollowers[myFollowers.length-1];
			(async()=>{
				const snap = await getDoc(doc(db,'users',last));
				if(snap.exists()){ 
					addToast(`${snap.data().name} ha iniziato a seguirti`);
				}
			})();

		}
		cacheFollower = myFollowers.length;
	});
</script>

<div class=" min-h-screen overflow-y-auto flex flex-col gap-2 items-center justify-between bg-background/70 mt-4 pb-20">
	<Toasts/>
	<div class="w-full">
		{@render children()}
	</div>
	<Navbar {data}/>
</div>
