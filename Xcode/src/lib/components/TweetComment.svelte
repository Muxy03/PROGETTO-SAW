<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { deleteDoc, doc, getDocs, collection, query, where } from 'firebase/firestore';
	import Button from './ui/button/button.svelte';

	import { CrossCircled, ChatBubble, Heart, HeartFilled } from 'radix-icons-svelte';
	import { db } from '$lib/firebase';
	import { invalidate } from '$app/navigation';

	let {
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
				const response = await (await fetch(`http://localhost:5173/api?comment=${id}`, { method: 'DELETE' })).json()
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

<div class="flex gap-2 border-t p-4 items-center justify-center">
	<div class="w-full">
			<div class="flex flex-row gap-4 justify-aorund items-center">
				<Avatar.Root>
					<Avatar.Image src={avatar} alt="@shadcn" />
					<Avatar.Fallback>JD</Avatar.Fallback>
				</Avatar.Root>
				<div>
					<p class="capitalize font-semibold">{name}</p>
					<p class="text-sm text-gray-400">@{email}</p>
				</div>
				<Button size="icon" class="bg-red-600 top-0" onclick={() => (del = deleteComment(true))}>
					<CrossCircled></CrossCircled>
				</Button>
			</div>
	</div>
</div>
