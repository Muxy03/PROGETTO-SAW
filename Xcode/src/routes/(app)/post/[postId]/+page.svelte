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
		where
	} from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { page } from '$app/stores';
	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { IPost, IUser, Comment } from '$lib/types';
	import type { DocumentData } from 'firebase-admin/firestore';
	import TweetComment from '$lib/components/TweetComment.svelte';
	import { redirect } from '@sveltejs/kit';
	import { connectStorageEmulator } from 'firebase/storage';

	let { data }: { data: { user: IUser; userId: string; comments: Comment[]; post: IPost } } =
		$props();
	let comment = $state('');
	let comments = $state<Comment[]>([]);

	const handleLikes = async (cond: boolean = false) => {
		if(cond){
			try {
				likes = await (
					await fetch(`http://localhost:5173/api?post=${$page.params.postId}`, { method: 'PUT' })
				).json();
			} catch (e) {
				console.error('Failed to update followers:', e);
				invalidate('pros');
			}
	
			invalidate('pros');
		}
	};

	const handleFollowers = async (cond: boolean = false) => {
		if (cond) {
			if (data.userId !== data.post.userID) {
				try {
					followers = await (
						await fetch(`http://localhost:5173/api?user=${data.post.userID}`, { method: 'PUT' })
					).json();
				} catch (e) {
					console.error('Failed to update followers:', e);
					invalidate('pros');
				}

				invalidate('pros');
			}
		}
	};

	let like = $state(handleLikes());
	let follow = $state(handleFollowers());
	let followers = $state<string[]>([]);
	let likes = $state<string[]>([]);

	onMount(() => {
		const getFollower = async () => {
			const response = await fetch(`http://localhost:5173/api?user=${data.post.userID}`);
			followers = await response.json();
		};

		const getLikes = async () => {
			const response = await fetch(`http://localhost:5173/api?post=${$page.params.postId}`);
			likes = await response.json();
		};

		const q = query(collection(db, 'comments'), where('postId', '==', $page.params.postId));
		const unsubscribe = onSnapshot(
			q,
			(querySnapshot: QuerySnapshot) => {
				let newComments: Comment[] = [];
				querySnapshot.forEach((doc) => {
					newComments.push({id:doc.ref.id, ...doc.data()} as Comment);
				});
				
				comments = [...newComments];
			}
		);
		
		const Funsub = onSnapshot(doc(db, 'users', data.post.userID), (doc) => {
			followers = [...doc.data()!.followers];
		});

		const Lunsub = onSnapshot(doc(db, 'posts', $page.params.postId), (doc) => {
			likes = [...doc.data()!.likes];
		});
		
		getFollower();
		getLikes();
		
		return () => {
			unsubscribe();
			Funsub();
			Lunsub();
		};
	});

	$effect(() => {
		console.log('post');
		$inspect('f', followers);
		$inspect('l', likes);
		$inspect('c', comments);
	});
</script>

<!-- <header class="p-4 flex items-center gap-3">
	<ArrowBottomLeft />

	<h1 class="capitalize font-semibold text-lg">post</h1>
</header> -->

<div class="py-7">
	<div class="px-4">
		<div class="flex justify-between">
			<button class="flex flex-row gap-2" onclick={() => goto(`/about/${data.post.userID}`)}>
				<Avatar.Root>
					<Avatar.Image src={data.post.profilePic} alt="@shadcn" />
					<Avatar.Fallback>JD</Avatar.Fallback>
				</Avatar.Root>
				
				<div>
					<p class="capitalize font-semibold">{data.post.name}</p>
					<p class="text-sm text-gray-800">@{data.post.email}</p>
				</div>
			</button>

			{#if followers.includes(data.userId)}
				<Button onclick={() => (follow = handleFollowers(true))} variant="secondary"
					>following</Button
				>
			{:else}
				<Button onclick={() => (follow = handleFollowers(true))}>follow</Button>
			{/if}

		</div>
		<p class="py-3">
			{data.post.tweet}
		</p>
		{#if data.post.img}
			<img src={data.post.img} alt="" />
		{/if}

		<div class="flex gap-3 text-sm mt-2">
				<button
					onclick={() => (like = handleLikes(true))}
					class="flex transition-all group items-center gap-2 text-gray-600"
				>
					<div class="p-1 rounded-full group-hover:bg-blue-500/20">
						{#if likes.includes(data.userId)}
							<HeartFilled class=" text-blue-500 " />
						{:else}
							<Heart class=" group-hover:text-blue-500 " />
						{/if}
					</div>
					<span class="group-hover:text-blue-500"> {likes.length} </span>
				</button>
			
				<button class="flex transition-all group items-center gap-2 text-gray-600">
				<div class="p-1 rounded-full group-hover:bg-green-500/20">
					<ChatBubble class=" group-hover:text-green-500 " />
				</div>
				<span class="group-hover:text-green-500"> {comments.length} </span>
			</button>
		</div>
	</div>
	<div class="flex gap-2 px-4 py-3">
		<Avatar.Root>
			<Avatar.Image src={data.user.profilePic} alt="@shadcn" />
			<Avatar.Fallback>CN</Avatar.Fallback>
		</Avatar.Root>
		<input
			type="text"
			bind:value={comment}
			class="bg-transparent flex-1"
			placeholder="Post your replay (max 1024 chars)"
			maxlength="1024"
		/>
		<Button
			onclick={async () => {
				const newComment = comment;
				comment = '';
				const c = await addDoc(collection(db, 'comments'), {
					content: newComment,
					name: data.user.name,
					email: data.user.email,
					profilePic: data.user.profilePic,
					postId: $page.params.postId
				});
			}}
			disabled={comment.length < 1}>comment</Button
		>
	</div>
	<div class="w-full">
		{#each comments as comment}
			<TweetComment
				admin={data.post.userID === data.userId ? data.userId : undefined}
				id = {comment.id}
				likes={new Array<string>()}
				avatar={comment.profilePic}
				name={comment.name}
				tweet={comment.content}
				email={comment.email}
				postId={comment.id}
				userId={data.userId}
				img={comment.img}
			/>
		{/each}
	</div>
</div>
