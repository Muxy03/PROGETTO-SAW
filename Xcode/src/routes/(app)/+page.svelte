<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from '$lib/components/ui/button/button.svelte';
	import Tweet from '$lib/components/Tweet.svelte';
	import { Image } from 'radix-icons-svelte';
	import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
	import { invalidate } from '$app/navigation';
	import { db, storage } from '$lib/firebase.js';
	import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
	import { page } from '$app/stores';
	import type { IPost } from '$lib/types';

	let loading = $state(false);
	let tweet = $state('');
	let imgFile:any;

	let { data }: any = $props();
</script>

<Header />

<div class="px-4 py-2 gap-2 hidden md:flex">
	<Avatar.Root>
		<Avatar.Image src={$page.data.user?.profilePic} alt="@shadcn" />
		<Avatar.Fallback>JD</Avatar.Fallback>
	</Avatar.Root>

	<div class="px-3 w-full border rounded-xl">
		<input
			type="text"
			class="bg-transparent text-lg w-full px-2 outline-none h-10"
			placeholder="what is happening?!"
			bind:value={tweet}
		/>
		<div class="flex border-t py-3 justify-between items-center">
			<div class="flex gap-2 items-center">
				<input type="file" hidden id="img" accept="image/png, image/jpeg, image/gif, image/webp" />
				<label for="">
					<Image class="w-7 h-7 text-primary cursor-pointer" />
				</label>
			</div>
			<Button
				on:click={async () => {
					loading = true;
					let url = '';
					if (imgFile) {
						const storageRef = ref(storage, `posts/${data.userId}/${imgFile.name}`);
						const result = await uploadBytes(storageRef, imgFile);
						url = await getDownloadURL(result.ref);
					}

					await addDoc(collection(db, 'posts'), {
						tweet,
						userID: data.userId,
						img: url,
						...data.user,
						likes: []
					});
					loading = false;
					tweet = '';
					invalidate('posts');
				}}
				disabled={tweet?.length < 5 || loading}
			>
				{#if loading}
					loading...
				{:else}
					Post
				{/if}
			</Button>
		</div>
	</div>
</div>
<div>
	{#if data.posts?.length > 0}
		{#each data.posts as post}
			<Tweet
				avatar={post.profilePic}
				email={post.email}
				img={post.img}
				name={post.name}
				tweet={post.tweet}
				id={post.id!}
				likes={post.likes}
			/>
		{/each}
	{:else}
		no data
	{/if}
</div>
