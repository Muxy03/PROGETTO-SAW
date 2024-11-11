<script lang="ts">
	import { addToast } from '$lib';
	import Tweet from '$lib/components/Tweet.svelte';
	import { db } from '$lib/firebase';
	import type { IPost, IUser } from '$lib/types';
	import { doc, getDoc } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import logo from "$lib/assets/pwa-64x64.png"

	let { data }: { data: { userId: string; user: IUser; posts: IPost[] } } = $props();
	let coso: string[] = [];

	const following = async () => {
		const usersId = [...data.posts].map((post) => post.userID).filter((id) => id !== data.userId);
		const usersRef: any[] = [];
		usersId.forEach((id) => {
			usersRef.push(doc(db, 'users', id));
		});

		for (const ref of usersRef) {
			const userSnap = await getDoc(ref);
			if (userSnap.exists()) {
				coso = [
					...coso,
					...(userSnap.data() as IUser).followers.filter((id) => id === data.userId)
				];
			}
		}
	};
	let section = $state(0);
	let f = $state(following());
</script>

<header class="flex items-center justify-center bg-background/70 fixed border z-10 top-0 left-0 w-full backdrop-blur mb-4">
	<img src={logo} alt="Logo">
	<h1 class="text-center capitalize text-2xl font-semibold py-3.5 px-4">
		XCODE
	</h1>
	<!-- <div class="grid grid-cols-3 text-md">
		<button onclick={() => addToast('diocane')}>Add as default info Toast
		</button>
		<button
			onclick={() => (section = 0)}
			class:disable={section == 1}
			class:active={section == 0}
			class="py-4 capitalize hover:bg-white/10"
		>
			for you
		</button>
		<button
			onclick={() => {
				section = 1;
				f = following();
			}}
			class:disable={section == 0}
			class:active={section == 1}
			class="py-4 capitalize hover:bg-white/10"
		>
			following
		</button>
	</div> -->
</header>

{#if data.posts.length > 0}
	<div class="min-w-full flex flex-col items-center justify-between gap-3">
		{#each data.posts.filter((post) => !coso.includes(post.userID)) as post}
			{@const pp = post.profilePic}
			<Tweet
				avatar={pp}
				email={post.email}
				img={post.img}
				name={post.name}
				tweet={post.tweet}
				id={post.id}
				userId={data.userId}
				likes={post.likes}
			/>
		{/each}
	</div>
{:else}
	<div class="flex items-center justify-items-center">
		<p class="w-full text-center text-5xl">NO Posts</p>
	</div>
{/if}

<!-- {#if section == 1}
	{#await f}
		<p>LOADING</p>
	{:then _} -->
<!-- {#if data.posts.length > 0}
	<div class="w-full flex flex-col items-center justify-around">
		{#each data.posts.filter((post) => !coso.includes(post.userID)) as post}
			{@const pp = post.profilePic}
			<Tweet
				avatar={pp}
				email={post.email}
				img={post.img}
				name={post.name}
				tweet={post.tweet}
				id={post.id}
				userId={data.userId}
				likes={post.likes}
			/>
		{/each}
	</div>
{:else}
	<div class="flex items-center justify-items-center">
		<p class="w-full text-center text-5xl">NO Posts</p>
	</div>
{/if} -->

<!-- {/await}
{:else if data.posts.length > 0}
	<div class="flex flex-col gap-5">
		{#each data.posts as post}
			{@const pp = post.profilePic}
			<Tweet
				avatar={pp}
				email={post.email}
				img={post.img}
				name={post.name}
				tweet={post.tweet}
				id={post.id}
				userId={data.userId}
				likes={post.likes}
			/>
		{/each}
	</div>
{:else}
	<div class="min-h-screen flex items-center justify-items-center">
		<p class="w-full text-center text-5xl">NO Posts</p>
	</div>
{/if} -->

<style>
	.active {
		color: rgb(255 255 255);
		font-weight: 700;
	}

	.disable {
		color: rgb(209 213 219);
	}
</style>
