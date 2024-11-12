<script lang="ts">
	import Tweet from '$lib/components/Tweet.svelte';
	import { db } from '$lib/firebase';
	import type { IPost } from '$lib/types';
	import { collection, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { addToast } from '$lib';
	import title from '$lib/assets/title.png';

	let { data }: { data: { userId: string } } = $props();

	let Following: string[] = $state([]);
	let Posts: IPost[] = $state([]);
	let cacheP: IPost[] = $state([]);
	let section = $state(0);
	const unique: { [key: string]: boolean } = {};

	onMount(() => {
		const notify = async (uid: string) => {
			const snap = await getDoc(doc(db, 'users', uid));
			if (snap.exists()) {
				addToast(`${snap.data().name} ha pubblicato un nuovo post`);
			}
		};

		const getFollowing = async () => {
			const snap = await getDocs(collection(db, 'users'));
			if (!snap.empty) {
				snap.forEach((doc) => {
					if (doc.data().followers.includes(data.userId)) {
						Following.push(doc.id);
					}
				});
			}
		};

		const getPosts = async () => {
			const snap = await getDocs(collection(db, 'posts'));
			if (!snap.empty) {
				snap.forEach((doc) => {
					const post = { id: doc.id, ...doc.data() } as IPost;
					if (!unique[post.id]) {
						unique[post.id] = true;
						Posts = [...[...Posts, post].sort((a, b) => 
						new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())];
					}
				});
				cacheP = [...Posts];
			}
		};

		const Funsub = onSnapshot(collection(db, 'users'), (doc) => {
			const changes = doc.docChanges();
			changes.forEach((Doc) => {
				switch (Doc.type) {
					case 'added':
						if (Doc.doc.data().followers.includes(data.userId)) {
							Following.push(Doc.doc.id);
						}
						break;
					case 'removed':
						Following = [...Following.filter((id) => id !== Doc.doc.id)];
						break;
					case 'modified':
						if (Doc.doc.data().followers.includes(data.userId)) {
							Following.push(Doc.doc.id);
						} else {
							Following = [...Following.filter((id) => id !== Doc.doc.id)];
						}
						break;
					default:
						break;
				}
			});
		});

		const Punsub = onSnapshot(collection(db, 'posts'), (d) => {
			d.docChanges().forEach((Doc) => {
				const post = { id: Doc.doc.id, ...Doc.doc.data() } as IPost;
				switch (Doc.type) {
					case 'added':
						if (!unique[post.id]) {
							unique[post.id] = true;
							Posts = [...[...Posts, post].sort((a, b) => 
							new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())];
						}

						if (cacheP.length > 0 && cacheP.length < Posts.length) {
							const first = Posts[0];
							console.log(first.userID);
							if (Following.includes(first.userID)) {
								notify(first.userID);
							}
							cacheP = [...Posts];
						}
						break;
					case 'removed':
						console.log('removed a post ', Doc.doc.id);
						delete unique[Doc.doc.id];
						Posts = [...Posts.filter((post) => post.id !== Doc.doc.id)];
						cacheP = [...Posts];
						break;
					default:
						break;
				}
			});
		});

		getFollowing();
		getPosts();

		return () => {
			Funsub();
			Punsub();
		};
	});
</script>

<header
	class="w-full h-42 flex flex-col items-center justify-center bg-background/70 fixed z-10 top-0 left-0 backdrop-blur mb-4"
>
	<img src={title} alt="Title" />
	<div class=" h-full w-1/2 grid grid-cols-2 text-lg">
		<button
			onclick={() => (section = 0)}
			class:disable={section == 1}
			class:active={section == 0}
			class="py-4 capitalize hover:bg-white/10"
		>
			for you
		</button>
		<button
			onclick={() => (section = 1)}
			class:disable={section == 0}
			class:active={section == 1}
			class="py-4 capitalize hover:bg-white/10"
		>
			following
		</button>
	</div>
</header>

<div class=" pt-44 min-w-full flex flex-col items-center justify-between gap-3 px-4">
	{#if section === 1}
		{#if Posts.filter((post) => Following.includes(post.userID)).length > 0}
			{#each Posts.filter((post) => Following.includes(post.userID)) as post}
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
		{:else}
			<div class="flex items-center justify-items-center">
				<p class="w-full text-center text-5xl">NO Posts</p>
			</div>
		{/if}
	{:else if Posts.length > 0}
		{#each Posts as post}
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
	{:else}
		<div class="flex items-center justify-items-center">
			<p class="w-full text-center text-5xl">NO Posts</p>
		</div>
	{/if}
</div>

<style>
	.active {
		color: rgb(255 255 255);
		font-weight: 700;
	}

	.disable {
		color: rgb(209 213 219);
	}
</style>
