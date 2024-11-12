<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from './ui/button/button.svelte';
	import { CrossCircled } from 'radix-icons-svelte';
	import { page } from '$app/stores';

	let { avatar, tweet, name, creator, id}: {
		avatar: string;
		tweet: string;
		name: string;
		creator: string;
		id: string
	} = $props();

	const deleteComment = async (cond: boolean = false) => {
		if (cond) {
			try {
				await fetch(`http://localhost:5173/api?comment=${id}`, { method: 'DELETE' });
			} catch (e) {
				console.error(e);
			}
		}
	};

	let del = $state(deleteComment());
</script>

<div class="flex flex-col gap-4 items-center justify-center border border-white rounded-lg p-3">
	<div class="flex flex-row w-full items-center justify-between">
		<div class="flex flex-col items-center gap-3 justify-center">
			<Avatar.Root>
				<Avatar.Image src={avatar} alt="@shadcn" />
				<Avatar.Fallback>JD</Avatar.Fallback>
			</Avatar.Root>
			<p class="text-md">{name}</p>
		</div>
		<p class="px-4 break-all justify-self-center">{tweet}</p>
		{#if creator === $page.data.userId}
			<Button size="icon" class="bg-red-600 top-0" onclick={() => (del = deleteComment(true))}>
				<CrossCircled size={30}></CrossCircled>
			</Button>
		{/if}
	</div>
</div>
