<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
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
		updateDoc,
		getDocs,
		deleteDoc
	} from 'firebase/firestore';

	import { CrossCircled, ChatBubble, Heart, HeartFilled } from 'radix-icons-svelte';
	import { onMount } from 'svelte';
	import Button from './ui/button/button.svelte';

	let {
		admin,
		avatar,
		tweet,
		email,
		name,
		id,
		userId,
		img,
		likes
	}: {
		admin?: string;
		avatar?: string;
		tweet: string;
		email: string;
		name: string;
		id: string;
		userId: string;
		img?: string;
		likes: string[];
	} = $props();

	let comments: Comment[] = $state([]);

	const handleLikes = async (cond: boolean = false) => {
		if(cond){
			try {
				likes =  [... await (await fetch(`http://localhost:5173/api?post=${id}`, { method: 'PUT' })).json()];
			} catch (e) {
				console.error('Failed to update followers:', e);
				//invalidate('pros');
			}
	
			//invalidate('pros');
		}
	};

	const deletePost = async (cond: boolean = false) => {
		if (admin && cond) {
			try {
					const response = await (await fetch(`http://localhost:5173/api?post=${id}`, { method: 'DELETE' })).json()
			} catch (e) {
				console.error(e);
				invalidate(id);
			}
			invalidate(id);
		}
	};

	let like = $state(handleLikes());
	let del = $state(deletePost());

	onMount(() => {

		const getLikes = async () => {
			const response = await fetch(`http://localhost:5173/api?post=${id}`);
			likes = [...await response.json()];
		};

		const Lunsub = onSnapshot(doc(db, 'posts', id), (doc) => {
			if(doc.exists()) likes = [...doc.data()!.likes];
		});

		const q = query(collection(db, 'comments'), where('postId', '==', id));
		const unsubscribe = onSnapshot(
			q,
			(querySnapshot: QuerySnapshot<DocumentData, DocumentData>) => {
				let newComments: Comment[] = [];
				querySnapshot.forEach((doc) => {
					newComments.push(doc.data() as Comment);
				});

				comments = [...newComments];
			}
		);

		getLikes();
		
		return () => {
			unsubscribe();
			Lunsub();
		};
	});
</script>

<div class="flex gap-1 w-full justify-between">
	
	<a  
		href={`/post/${id}`} 
		class:disable={admin}
		class="flex gap-2 items-center justify-center"
	>
		<div class="w-fit h-fit">
			{#if avatar}
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
			{/if}
	
			<p class="text-md flex flex-wrap break-words p-3">
				{tweet}
			</p>
	
			{#if img}
				<img src={img} class="w-full h-auto rounded-sm object-contain" alt="" />
			{/if}
	
		</div>
	</a>
	<div class="flex gap-3 text-sm p-3">
			<button
				onclick={() => (like = handleLikes(true))}
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
		
		<button class="flex transition-all group items-center gap-2 text-gray-600">
			<div class="p-1 rounded-full group-hover:bg-green-500/20">
				<ChatBubble class=" group-hover:text-green-500 " />
			</div>
			<span class="group-hover:text-green-500"> {comments.length} </span>
		</button>

	</div>
	{#if admin}
		<!-- {#await del} -->
			<Button size="icon" class="bg-red-600 top-0" onclick={() => (del = deletePost(true))}>
				<CrossCircled size={30}></CrossCircled>
			</Button>
		<!-- {:then _}
			<Button size="icon" class="bg-red-600 top-0" onclick={() => (del = deletePost(true))}>
				<CrossCircled size={30}></CrossCircled>
			</Button>
		{/await} -->
	{/if}

</div>

<style>
	.disable{
		pointer-events: none;
	}
</style>