<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from '$lib/components/ui/button/button.svelte';
	import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { IPost, IUser } from '$lib/types';
	import Tweet from '$lib/components/Tweet.svelte';
	import title from '$lib/assets/title.png';

	let { data }: { data: { localId: string;} } =$props();

	const handleFollowers = async (cond: boolean = false) => {
		if (cond) {
			try {
				followers = await (
					await fetch(`http://localhost:5173/api?user=${$page.params.userId}`, { method: 'PUT' })
				).json();
			} catch (e) {
				console.error('Failed to update followers:', e);
			}			
		}
	};
	
	let user: IUser | undefined = $state();
	let posts: IPost[] = $state([]);
	let follow = $state(handleFollowers());
	let followers: string[] = $state([]);

	onMount(() => {
		const getUser = async (uid: string) => {
			const docRef = doc(db, 'users', uid);
			const docSnap = await getDoc(docRef);
			user = docSnap.data() as IUser;
		};

		const getFollower = async () => {
			const response = await fetch(`http://localhost:5173/api?user=${$page.params.userId}`);
			followers = await response.json();
		};

		const q = query(collection(db, 'posts'), where('userID', '==', $page.params.userId));
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			let newPosts: IPost[] = [];
			querySnapshot.forEach((doc) => {
				newPosts.push({ id: doc.ref.id, ...doc.data() } as IPost);
			});

			posts = [...newPosts];
		});

		const unsub = onSnapshot(doc(db, 'users', $page.params.userId), (doc) => {
			followers = doc.data()!.followers;
		});

		getFollower();
		getUser($page.params.userId);

		return () => {
			unsubscribe();
			unsub();
		};
	});
</script>

<header
	class="w-full h-42 flex flex-col items-center justify-center bg-background/70 fixed z-10 top-0 left-0 backdrop-blur mb-4"
>
	<img src={title} alt="Title" />
</header>

<div class="pt-24">
	<div class="flex flex-col px-4 gap-5">
		<div class="w-full flex flex-row items-center justify-center gap-3">
			<div class="flex flex-col items-center gap-3">
				<Avatar.Root>
					<Avatar.Image src={user?.profilePic} alt="@shadcn" />
					<Avatar.Fallback>JD</Avatar.Fallback>
				</Avatar.Root>

				<p class="capitalize text-sm">{user?.name}</p>
			</div>

			<div class="flex flex-col items-center">
				<p>{posts.length}</p>
				<p>Posts</p>
			</div>

			<div class="flex flex-col items-center">
				<p>{followers.length}</p>
				<p>Followers</p>
			</div>
			{#if followers.includes(data.localId)}
				<Button
					onclick={() => (follow = handleFollowers($page.params.userId !== data.localId))}
					variant="secondary">following</Button
				>
			{:else}
				<Button onclick={() => (follow = handleFollowers($page.params.userId !== data.localId))}
					>follow</Button
				>
			{/if}
		</div>
		<p>Description:</p>
		<p class="py-3 border-b-4 border-red-900">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae sunt aperiam eum libero
			provident fuga aspernatur deleniti culpa, totam neque ea, facere placeat sapiente praesentium
			cumque eius quo error nam.
		</p>

		{#if posts.length > 0}
			<div class="min-h-screen overflow-y-auto flex flex-col items-center gap-3">
				{#each posts as post}
					<Tweet
						creator={data.localId === post.userID}
						email={post.email}
						img={post.img}
						name={post.name}
						tweet={post.tweet}
						id={post.id}
						userId={post.userID}
						likes={post.likes}
					/>
				{/each}
			</div>
		{:else}
			<div class="min-h-screen flex items-center justify-items-center">
				<p class="w-full text-center text-5xl">NO Posts</p>
			</div>
		{/if}
	</div>
</div>
