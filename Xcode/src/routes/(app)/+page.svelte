<script lang="ts">
    import Header from "$lib/components/Header.svelte";
	import Tweet from "$lib/components/Tweet.svelte";
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from "$lib/components/ui/button/button.svelte";
	import { Image } from "radix-icons-svelte";
	import { page } from "$app/stores";
	import type { IPost } from "$lib/types";

    let loading = false;
	let tweet = '';
	let imgFile;

    let {data} : {data: {posts:IPost[]}} = $props();

</script>

<Header/>

<div class="px-4 py-2 gap-2 hidden md:flex">
    <Avatar.Root>
        <Avatar.Image src={$page.data.user?.profilePic} alt="@shadcn" />
        <Avatar.Fallback>JD</Avatar.Fallback>
    </Avatar.Root>

    <div class="px-3 w-full border rounded-xl">
        <input type="text" class="bg-transparent text-lg w-full px-2 outline-none h-10" placeholder="what is happening?!">
        <div class="flex border-t py-3 justify-between items-center">
            <div class="flex gap-2 items-center">
                <input type="file" hidden id="img" accept="image/png, image/jpeg, image/gif, image/webp">
                <label for="">
                    <Image class="w-7 h-7 text-primary cursor-pointer"/>
                </label>
            </div>
            <Button>post</Button>
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
				id={post.id}
				likes={post.likes}
			/>
		{/each}
	{:else}
		no data
	{/if}
</div>