<script lang="ts">
	import { page } from '$app/stores';
	import Card from '$lib/components/Card.svelte';
	import { db } from '$lib/firebase';
	import type { IUser } from '$lib/types';
	import { doc, getDoc } from 'firebase/firestore';
	import { MagnifyingGlass } from 'radix-icons-svelte';

	const Title = 'subscribe to premium';
	const action = 'subscribe';
	let query = $state('');
	let usrs: IUser[] = $state([]);

	const fusers = async (cond: boolean = false) => {
		if (cond) {
			const usersId = [...$page.data.posts]
				.map((post) => post.userID)
				.filter((id) => id !== $page.data.userId);
			const usersRef: any[] = [];

			usersId.forEach((id) => {
				usersRef.push(doc(db, 'users', id));
			});

			for (const ref of usersRef) {
				const userSnap = await getDoc(ref);
				if (userSnap.exists()) {
					if ((userSnap.data() as IUser).name !== $page.data.userId && usrs.filter((usr)=> usr.name === (userSnap.data() as IUser).name).length === 0) {
						usrs.push(userSnap.data() as IUser);
					}
				}
			}
		}
	};

	let users = $state(fusers());
</script>

<div
	class:hideScroll={true} class="px-5 flex-[0.4] hidden md:items-center md:inline-flex md:px-3 md:w-screen md:flex-col md:h-screen md:sticky md:z-10
    md:top-0 border py-3 gap-5 md:overflow-y-auto"
>
	<div class="rounded-md h-fit flex items-center px-2 bg-gray-800">
		<MagnifyingGlass class="h-5 w-5" />
		<input
			placeholder="search"
			type="text"
			class="h-10 px-2 outline-none bg-transparent flex-1"
			onkeypress={() => (users = fusers(true))}
			bind:value={query}
		/>
	</div>

	{#await users}
		<p>LOADING ...</p>
	{:then _}
		{#if usrs.filter((usr) => usr.name == query).length === 0}
			<p>NO USERS</p>
		{:else}
			{#each usrs.filter((usr) => usr.name === query) as usr}
				<Card Title={usr.name} {action} content={'diocane'} />
			{/each}
		{/if}
	{/await}
</div>

<style>
	.hideScroll::-webkit-scrollbar { display: none; }
	.hideScroll {
  	-ms-overflow-style: none;  /* IE and Edge */
  	scrollbar-width: none;     /* Firefox */
	}
</style>
