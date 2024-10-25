<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from '$lib/components/ui/button/button.svelte';
	import Tweet from '$lib/components/Tweet.svelte';
	import { Image } from 'radix-icons-svelte';
	import { addDoc, collection } from 'firebase/firestore';
	import { invalidate } from '$app/navigation';
	import { db, storage } from '$lib/firebase.js';
	import { getDownloadURL, ref, uploadString } from 'firebase/storage';
	import type {IPost, IUser } from '$lib/types';

	let loading = $state(false);
	let tweet = $state('');
	let fileinput: any;
	let imgFile: any | null = $state(null);

	const onFileSelected = (e: any): void => {
		let image = e.target.files[0];
		let reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = (e) => {
			imgFile = e.target?.result;
		};
	};

	let { data }: { data: { userId: string; user: IUser; posts: IPost[] } } = $props();

	$effect(() => {
		console.log(imgFile);
	});
</script>

<Header />

<div class="px-4 py-2 gap-2 hidden md:flex">
	<Avatar.Root>
		<Avatar.Image src={data.user.profilePic} alt="@shadcn" />
		<Avatar.Fallback>JD</Avatar.Fallback>
	</Avatar.Root>

	<div class="px-3 w-full border rounded-xl">
		<input
			type="text"
			class="bg-transparent text-lg w-full px-2 outline-none h-10"
			placeholder="what is happening?!"
			bind:value={tweet}
		/>
		{#if imgFile}
			<img src={imgFile} alt="" />
		{/if}

		<div class="flex border-t py-3 justify-between items-center">
			<div class="flex gap-2 items-center">
				<input
					onchange={onFileSelected}
					bind:this={fileinput}
					type="file"
					hidden
					id="img"
					accept="image/png, image/jpeg, image/gif, image/webp"
				/>
				<label for="img">
					<Image class="w-7 h-7 text-primary cursor-pointer" />
				</label>
			</div>
			<Button
				on:click={async () => {
					loading = true;
					let url = '';
					if (imgFile) {
						const storageRef = ref(storage, `posts/${data.userId}/IMG.png`);
						const result = await uploadString(storageRef, imgFile, 'data_url');
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
					imgFile = null;
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
	{#if data.posts.length > 0}
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
