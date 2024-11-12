<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { db } from '$lib/firebase';
	import { collection, doc, query, where, onSnapshot, QuerySnapshot } from 'firebase/firestore';
	import { CrossCircled, ChatBubble, Heart, HeartFilled } from 'radix-icons-svelte';
	import { onMount } from 'svelte';
	import Button from './ui/button/button.svelte';

	let {
		creator,
		avatar,
		tweet,
		email,
		name,
		id,
		userId,
		img,
		likes
	}: {
		creator: boolean;
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
		if (cond) {
			try {
				likes = [
					...(await (await fetch(`http://localhost:5173/api?post=${id}`, { method: 'PUT' })).json())
				];
			} catch (e) {
				console.error('Failed to update followers:', e);
			}
		}
	};

	const deletePost = async (cond: boolean = false) => {
		if (creator && cond) {
			try {
				const response = await (
					await fetch(`http://localhost:5173/api?post=${id}`, { method: 'DELETE' })
				).json();
			} catch (e) {
				console.error(e);
			}
		}
	};

	let like = $state(handleLikes());
	let del = $state(deletePost());

	onMount(() => {
		const getLikes = async () => {
			const response = await fetch(`http://localhost:5173/api?post=${id}`);
			likes = [...(await response.json())];
		};

		const Lunsub = onSnapshot(doc(db, 'posts', id), (doc) => {
			if (doc.exists()) likes = [...doc.data()!.likes];
		});

		const q = query(collection(db, 'comments'), where('postId', '==', id));
		const unsubscribe = onSnapshot(q,(querySnapshot) => {
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

<div class=" min-w-full flex flex-col justify-between items-center p-5 border border-white rounded-lg">
	<a href={`http://localhost:5173/post/${id}`}>
		<div class="flex flex-col items-center justify-center gap-2">
			{#if avatar}
				<div class="flex flex-row gap-4 items-center">
					<Avatar.Root>
						<Avatar.Image src={avatar} alt="@shadcn" />
						<Avatar.Fallback>JD</Avatar.Fallback>
					</Avatar.Root>
					<div>
						<p class="capitalize font-semibold">{name}</p>
						<p class="text-xs text-gray-400">@{email}</p>
					</div>
				</div>
			{/if}

			<p class="text-md flex flex-wrap break-words p-3">
				{tweet}
			</p>

			{#if img}
				<img src={img} class="w-30 h-auto rounded-sm object-contain" alt="" />
			{/if}
		</div>
	</a>
	<div class="w-full flex items-center justify-center gap-3 text-sm p-3">
		<button onclick={() => (like = handleLikes(true))} class="flex transition-all group items-center gap-2 text-gray-600">
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
	{#if creator}
		<Button size="icon" class="bg-red-600 top-0" onclick={() => (del = deletePost(true))}>
			<CrossCircled size={30}></CrossCircled>
		</Button>
	{/if}
</div>
