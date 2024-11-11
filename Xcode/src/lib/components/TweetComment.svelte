<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { deleteDoc, doc, getDocs, collection, query, where } from 'firebase/firestore';
	import Button from './ui/button/button.svelte';

	import { CrossCircled, ChatBubble, Heart, HeartFilled } from 'radix-icons-svelte';
	import { db } from '$lib/firebase';
	import { invalidate } from '$app/navigation';

	let {
		admin,
		avatar,
		tweet,
		email,
		name,
		postId,
		userId,
		img,
		likes,
		id
	}: {
		admin?: string;
		avatar: string;
		tweet: string;
		email: string;
		name: string;
		postId: string;
		userId: string;
		img: string | undefined;
		likes: string[];
		id: string;
	} = $props();

	const deleteComment = async (cond: boolean = false) => {
		if (cond) {
			try {
				const response = await (
					await fetch(`http://localhost:5173/api?comment=${id}`, { method: 'DELETE' })
				).json();
				//console.log(response)
			} catch (e) {
				console.error(e);
				invalidate('pros');
			}

			invalidate('pros');
		}
	};

	let del = $state(deleteComment());
</script>

<div class="flex flex-col gap-4 items-center justify-center border border-white rounded-lg p-3">
	<div class="flex flex-row w-full items-center justify-between">
		<div class="flex flex-col items-end gap-3 justify-center">
			<Avatar.Root>
				<Avatar.Image src={avatar} alt="@shadcn" />
				<Avatar.Fallback>JD</Avatar.Fallback>
			</Avatar.Root>
			<p class="text-center text-sm">{name}</p>
		</div>
		<p class="px-4 break-all justify-self-center">{tweet}</p>
		{#if admin !== undefined}
			<Button size="icon" class="bg-red-600 top-0" onclick={() => (del = deleteComment(true))}>
				<CrossCircled size={30}></CrossCircled>
			</Button>
		{/if}
	</div>
</div>
