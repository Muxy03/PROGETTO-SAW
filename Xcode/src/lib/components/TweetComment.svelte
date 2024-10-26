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
		likes
	}: {
		avatar: string;
		tweet: string;
		email: string;
		name: string;
		postId: string;
		userId: string;
		img: string | undefined;
		likes: string[];
	} = $props();

	const deleteComment = async (cond:boolean = false) => {
		if(cond){
            let ddoc = null;
            const querySnapshot = await getDocs(
                query(collection(db, 'comments'), where('postId', '==', postId))
            );
            if(!querySnapshot.empty){
                querySnapshot.forEach((d) => {
                    ddoc = doc(db, 'comments', d.id);
                });
            }
            
            if(ddoc){
                try {
                    await deleteDoc(ddoc);
                } catch (e) {
                    console.error(e);
                    invalidate(postId);
                }
            }
            invalidate(postId);
        }
	};

	let del = $state(deleteComment());
</script>

<div class="flex gap-2 border-t p-4 items-center justify-center">
	<div class="w-full">
		{#await del}
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
		{:then _}
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
			<p class="text-md flex flex-wrap break-words mb-2 py-4">
				{tweet}
			</p>

			{#if img}
				<img src={img} class="w-96 rounded-sm mt-2 object-contain" alt="" />
			{/if}

			<div class="flex gap-3 text-sm mt-2">
				<button class="flex transition-all group items-center gap-2 text-gray-600">
					<div class="p-1 rounded-full group-hover:bg-blue-500/20">
						{#if likes.includes(userId)}
							<HeartFilled class=" text-blue-500 " />
						{:else}
							<Heart class=" group-hover:text-blue-500 " />
						{/if}
					</div>
					<span class="group-hover:text-blue-500"> {likes.length}</span>
				</button>

				<button class="flex transition-all group items-center gap-2 text-gray-600">
					<div class="p-1 rounded-full group-hover:bg-green-500/20">
						<ChatBubble class=" group-hover:text-green-500 " />
					</div>
					<span class="group-hover:text-green-500"> 5 </span>
				</button>
			</div>
		{/await}
	</div>
</div>
