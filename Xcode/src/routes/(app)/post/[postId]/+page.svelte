<script lang="ts">
	import Tweet from '$lib/components/Tweet.svelte';
	import { ArrowBottomLeft, ChatBubble, Heart, HeartFilled } from 'radix-icons-svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		addDoc,
		collection,
		doc,
		onSnapshot,
		query,
		QuerySnapshot,
		updateDoc,
		where
	} from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { IPost, IUser, Comment } from '$lib/types';
	import type { DocumentData } from 'firebase-admin/firestore';
	import TweetComment from '$lib/components/TweetComment.svelte';

	let { data }: { data: { user: IUser; userId: string; comments: Comment[]; post: IPost } } = $props();
	let comment = $state('');
	let comments = $state(data.comments);

	const handleLikes = async () => {
		let newLikes;
		const postRef = doc(db, 'posts', $page.params.postId);
		if (data.post.likes.includes(data.userId)) {
			newLikes = data.post.likes.filter((id: string) => id !== data.userId);
		} else {
			newLikes = [...data.post.likes, data.userId];
		}
		data.post.likes = newLikes;

		try {
			await updateDoc(postRef, {
				likes: newLikes
			});
		} catch (error) {
			console.error('Failed to update likes:', error);
			invalidate($page.params.postId);
		}
		invalidate($page.params.postId);
	};

	let like = $state(handleLikes());

	onMount(() => {
		const q = query(collection(db, 'comments'), where('postId', '==', $page.params.postId));
		const unsubscribe = onSnapshot(
			q,
			(querySnapshot: QuerySnapshot<DocumentData, DocumentData>) => {
				let newComments: Comment[] = [];
				querySnapshot.forEach((doc) => {
					newComments.push(doc.data() as Comment);
				});

				comments = newComments;
			}
		);
		return () => {
			unsubscribe();
		};
	});

</script>

<!-- <header class="p-4 flex items-center gap-3">
	<ArrowBottomLeft />

	<h1 class="capitalize font-semibold text-lg">post</h1>
</header> -->

<div class="py-7">
	<div class="px-4">
		<div class="flex justify-between">
			<div class="flex flex-row gap-2">
				<Avatar.Root>
					<Avatar.Image src={data.post.profilePic as string} alt="@shadcn" />
					<Avatar.Fallback>JD</Avatar.Fallback>
				</Avatar.Root>
				<div>
					<p class="capitalize font-semibold">{data.post.name}</p>
					<p class="text-sm text-gray-800">@{data.post.email}</p>
				</div>
			</div>
			<Button variant="secondary">follow</Button>
		</div>
		<p class="py-3">
			{data.post.tweet}
		</p>
		{#if data.post.img}
			<img src={data.post.img} alt="" />
		{/if}

		<div class="flex gap-3 text-sm mt-2">
			{#await like}
				<button
					onclick={() => (like = handleLikes())}
					class="flex transition-all group items-center gap-2 text-gray-600"
				>
					<div class="p-1 rounded-full group-hover:bg-blue-500/20">
						{#if data.post.likes.includes(data.userId)}
							<HeartFilled class=" text-blue-500 " />
						{:else}
							<Heart class=" group-hover:text-blue-500 " />
						{/if}
					</div>
					<span class="group-hover:text-blue-500"> {data.post.likes.length} </span>
				</button>
			{:then _}
				<button
					onclick={() => (like = handleLikes())}
					class="flex transition-all group items-center gap-2 text-gray-600"
				>
					<div class="p-1 rounded-full group-hover:bg-blue-500/20">
						{#if data.post.likes.includes(data.userId)}
							<HeartFilled class=" text-blue-500 " />
						{:else}
							<Heart class=" group-hover:text-blue-500 " />
						{/if}
					</div>
					<span class="group-hover:text-blue-500"> {data.post.likes.length} </span>
				</button>
			{/await}
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
			placeholder="Post your replay"
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
				likes={new Array<string>()}
				avatar={comment.profilePic}
				name={comment.name}
				tweet={comment.content}
				email={comment.email}
				postId={comment.postId}
				userId = {data.userId}
				img={comment.img}
			/>
		{/each}
	</div>
</div>
