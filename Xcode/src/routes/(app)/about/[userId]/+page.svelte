<script lang="ts">
	import { ArrowBottomLeft, ChatBubble, Heart, HeartFilled } from 'radix-icons-svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		addDoc,
		collection,
		doc,
		getDoc,
		onSnapshot,
		query,
		QuerySnapshot,
		updateDoc,
		deleteDoc,
		where
	} from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { IPost, IUser, Comment } from '$lib/types';
	import type { DocumentData } from 'firebase-admin/firestore';
	import TweetComment from '$lib/components/TweetComment.svelte';
	import Tweet from '$lib/components/Tweet.svelte';
	import type { User } from 'firebase/auth';
	import { connectStorageEmulator } from 'firebase/storage';

	let {
		data
	}: { data: { localId: string; localUser: IUser; user: IUser; userId: string; posts: IPost[] } } =
		$props();

	// const handleLikes = async () => {
	// 	let newLikes;
	// 	const postRef = doc(db, 'posts', $page.params.postId);
	// 	if (data.post.likes.includes(data.userId)) {
	// 		newLikes = data.post.likes.filter((id: string) => id !== data.userId);
	// 	} else {
	// 		newLikes = [...data.post.likes, data.userId];
	// 	}
	// 	data.post.likes = newLikes;

	// 	try {
	// 		await updateDoc(postRef, {
	// 			likes: newLikes
	// 		});
	// 	} catch (error) {
	// 		console.error('Failed to update likes:', error);
	// 		invalidate($page.params.postId);
	// 	}
	// 	invalidate($page.params.postId);
	// };
	const handleFollowers = async () => {
		newFollowers = [];
		if (data.userId !== data.localId) {
			const userRef = doc(db, 'users', data.userId);

			try {
				const userSnap = await getDoc(userRef);
				if (userSnap.exists()) {
					newFollowers = [...userSnap.data().followers];

					if (newFollowers.includes(data.localId)) {
						newFollowers = newFollowers.filter((id) => id !== data.localId);
					} else {
						newFollowers = [...newFollowers, data.localId];
					}

					data.user.followers = [...newFollowers]

					const update = async()=>{
						await updateDoc(userRef, {
							followers: newFollowers
						});
						console.log("aggiornato");
					}

					update();

				}
			} catch (e) {
				console.error('Failed to update followers:', e);
				invalidate(data.userId);
			}

			invalidate(data.userId);
		}
	};

	let newFollowers: string[] = $state([]);
	let follow = $state(handleFollowers());


	// let like = $state(handleLikes());

	// onMount(() => {
	// 	const unsub = onSnapshot(doc(db, 'users', $page.data.userId), (doc) => {
	// 		//console.log('Current data: ', doc.data());
	// 		newFollowers = doc.data()?.followers;
	// 	});

	// 	return () => {
	// 		unsub();
	// 	};
	// });

	$effect(() => {
		console.log("user")
		//console.log("data",data.user.followers)
		//$inspect(newFollowers);
	});
</script>

<div class="py-7">
	<div class="flex flex-col px-4 gap-5">
		<div class="w-full flex flex-row items-center justify-between">
			<div class="flex flex-col items-center gap-3">
				<Avatar.Root>
					<Avatar.Image src={data.user.profilePic} alt="@shadcn" />
					<Avatar.Fallback>JD</Avatar.Fallback>
				</Avatar.Root>

				<p class="capitalize text-sm">{data.user.name}</p>
			</div>

			<div class="flex flex-col items-center">
				<p>{data.posts.length}</p>
				<p>Posts</p>
			</div>

			<div class="flex flex-col items-center">
				<p>{data.user.followers.length}</p>
				<p>Followers</p>
			</div>
			{#await follow}
				{#if data.user.followers.includes(data.localId)}
					<Button onclick={() => (follow = handleFollowers())} variant="secondary">following</Button
					>
				{:else}
					<Button onclick={() => (follow = handleFollowers())}>follow</Button>
				{/if}
			{:then _}
				{#if data.user.followers.includes(data.localId)}
					<Button onclick={() => (follow = handleFollowers())} variant="secondary">following</Button
					>
				{:else}
					<Button onclick={() => (follow = handleFollowers())}>follow</Button>
				{/if}
			{/await}
		</div>

		<p>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae sunt aperiam eum libero
			provident fuga aspernatur deleniti culpa, totam neque ea, facere placeat sapiente praesentium
			cumque eius quo error nam.
		</p>

		{#if data.posts.length > 0}
			<div class="min-h-screen overflow-y-auto">
				{#each data.posts as post}
					<Tweet
						admin={data.userId === data.localId ? data.localId : undefined}
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
