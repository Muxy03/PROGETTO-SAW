<script lang="ts">
	import { invalidate } from '$app/navigation';
	import * as Avatar from '$lib/components/ui/avatar';
	import { db } from '$lib/firebase';
	import type { DocumentData } from 'firebase-admin/firestore';
	import {
		collection,
		doc,
		query,
		where,
		onSnapshot,
		QuerySnapshot,
		updateDoc
	} from 'firebase/firestore';

	import { ChatBubble, Heart, HeartFilled } from 'radix-icons-svelte';
	import { onMount } from 'svelte';

	let {
		avatar,
		tweet,
		email,
		name,
		id,
		userId,
		img,
		likes
	}: {
		avatar: string;
		tweet: string;
		email: string;
		name: string;
		id: string;
		userId: string;
		img: string | undefined;
		likes: string[];
	} = $props();

	let comments: Comment[] = $state([]);
	const handleLikes = async () => {
		let newLikes;
		const postRef = doc(db, 'posts', id);
		if (likes.includes(userId)) {
			newLikes = likes.filter((id: string) => id !== userId);
		} else {
			newLikes = [...likes, userId];
		}
		likes = newLikes;

		try {
			await updateDoc(postRef, {
				likes: newLikes
			});
		} catch (error) {
			console.error('Failed to update likes:', error);
			invalidate(id);
		}
		invalidate(id);
	};

	let like = $state(handleLikes());

	onMount(() => {
		const q = query(collection(db, 'comments'), where('postId', '==', id));
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

<a href="/post/{id}" class="flex gap-2 border-t p-4 items-center justify-center">
	<div class="w-full">
		<div class="flex flex-row gap-4 items-center">
			<Avatar.Root>
				<Avatar.Image src={avatar} alt="@shadcn" />
				<Avatar.Fallback>JD</Avatar.Fallback>
			</Avatar.Root>
			<div>
				<p class="capitalize font-semibold">{name}</p>
				<p class="text-sm text-gray-400">@{email}</p>
			</div>
		</div>

		<p class="text-md flex flex-wrap break-words mb-2 py-4">
			{tweet}
		</p>

		{#if img}
			<img src={img} class="w-96 rounded-sm mt-2 object-contain" alt="" />
		{/if}

		<div class="flex gap-3 text-sm mt-2">
			{#await like}
				<button
					onclick={() => (like = handleLikes())}
					class="flex transition-all group items-center gap-2 text-gray-600"
				>
					<div class="p-1 rounded-full group-hover:bg-blue-500/20">
						{#if likes.includes(userId)}
							<HeartFilled class=" text-blue-500 " />
						{:else}
							<Heart class=" group-hover:text-blue-500 " />
						{/if}
					</div>
					<span class="group-hover:text-blue-500"> {likes.length} </span>
				</button>
			{:then _}
				<button
					onclick={() => (like = handleLikes())}
					class="flex transition-all group items-center gap-2 text-gray-600"
				>
					<div class="p-1 rounded-full group-hover:bg-blue-500/20">
						{#if likes.includes(userId)}
							<HeartFilled class=" text-blue-500 " />
						{:else}
							<Heart class=" group-hover:text-blue-500 " />
						{/if}
					</div>
					<span class="group-hover:text-blue-500"> {likes.length} </span>
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
</a>
