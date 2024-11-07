<script lang="ts">
	import { Bell, Home, Image, MagnifyingGlass, Pencil1, ThickArrowLeft } from 'radix-icons-svelte';
	//import Logo from '$lib/images/logo.png';
	import Button from './ui/button/button.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Dialog from '$lib/components/ui/dialog';
	import { page } from '$app/stores';
	import { goto, invalidate } from '$app/navigation';
	import { signOut } from 'firebase/auth';
	import { auth, db, storage } from '$lib/firebase';
	import { getDownloadURL, ref, uploadString } from 'firebase/storage';
	import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
	import { v4 as uuidv4 } from 'uuid';
	import Card from '$lib/components/Card.svelte';
	import type { IUser } from '$lib/types';

	let fileinput: any;
	let imgFile: any = $state();

	const onFileSelected = (e: any): void => {
		let image = e.target.files![0];
		let reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = (e) => {
			imgFile = e.target?.result;
		};
	};

	let openModal = $state(false);
	let openlogOut = $state(false);
	let openSearch = $state(false);
	let tweet = $state('');

	const sidebarOptions = [Home, MagnifyingGlass, Pencil1, Bell];

	const logOut = async () => {
		const response = await fetch('/login', {
			method: 'DELETE'
		});

		const { status } = await response.json();

		if (status === 'signedOut') {
			await signOut(auth);
			goto('/login');
		}
	};

	let query = $state('');
	let usrs: IUser[] = $state([]);

	const fusers = async (cond: boolean = false) => {
		if (cond) {
			const usersId = [...$page.data.posts]
				.map((post) => post.userID)
				.filter((id) => id !== $page.data.userId);
			const usersRef: any[] = [];

			usersId.forEach((id) => {
				usersRef.push(doc(db, 'users', id));
			});

			for (const ref of usersRef) {
				const userSnap = await getDoc(ref);
				if (userSnap.exists()) {
					if (
						(userSnap.data() as IUser).name !== $page.data.userId &&
						usrs.filter((usr) => usr.name === (userSnap.data() as IUser).name).length === 0
					) {
						usrs.push(userSnap.data() as IUser);
					}
				}
			}
		}
	};

	let users = $state(fusers());

	$effect(() => {});
</script>

<div
	class="sticky bottom-0 z-50 w-72 rounded-lg -translate-x-1/2 bg-white border-t border-gray-200 left-1/2 dark:bg-transparent dark:border-gray-600"
>
	<!-- <div class="w-full">
		<div
			class="grid max-w-xs grid-cols-3 gap-1 p-1 mx-auto my-2 bg-gray-100 rounded-lg dark:bg-gray-600"
			role="group"
		>
			<button
				type="button"
				class="flex items-center justify-center px-2 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700 rounded-lg"
			>
				New
			</button>
			<button
				type="button"
				class="flex items-center justify-center px-2 py-1.5 text-xs font-medium text-white bg-gray-900 dark:bg-gray-300 dark:text-gray-900 rounded-lg"
			>
				Popular
			</button>
			<button
				type="button"
				class="flex items-center justify-center px-2 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700 rounded-lg"
			>
				Following
			</button>
		</div>
	</div> -->
	<div class="grid h-full max-w-lg grid-cols-5 mx-auto">
		{#each sidebarOptions as Component}
			{#if Component === ThickArrowLeft}
				<button
					onclick={logOut}
					data-tooltip-target="tooltip-home"
					type="button"
					class="inline-flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 group"
				>
					<Component size={30} />
				</button>
			{:else if Component === Pencil1}
				<button
					data-tooltip-target="tooltip-post"
					type="button"
					onclick={() => (openModal = true)}
					class="inline-flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 group"
				>
					<Pencil1 size={30} />
					<span class="sr-only">New post</span>
				</button>
			{:else if Component === MagnifyingGlass}
				<button
					data-tooltip-target="tooltip-post"
					type="button"
					onclick={() => (openSearch = true)}
					class="inline-flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 group"
				>
					<MagnifyingGlass size={30} />
					<span class="sr-only">New post</span>
				</button>
			{:else if Component === Home}
				<button
					data-tooltip-target="tooltip-post"
					type="button"
					onclick={() => goto('/')}
					class="inline-flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 group"
				>
					<Home size={30} />
					<span class="sr-only">New post</span>
				</button>
			{:else}
				<button
					data-tooltip-target="tooltip-home"
					type="button"
					class="inline-flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 group"
				>
					<Component size={30} />
				</button>
			{/if}
		{/each}

		<button
			onclick={() => (openlogOut = true)}
			data-tooltip-target="tooltip-settings"
			type="button"
			class="inline-flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 group"
		>
			<Avatar.Root>
				<Avatar.Image src={$page.data.user.profilePic} alt="@shadcn" referrerpolicy="no-referrer" />
				<Avatar.Fallback>JD</Avatar.Fallback>
			</Avatar.Root>
		</button>
	</div>
</div>

<Dialog.Root
	open={openModal}
	onOpenChange={(o) => {
		openModal = !openModal;
	}}
>
	<Dialog.Content class="max-h-[500px] overflow-auto ">
		<div class="flex gap-2">
			<Avatar.Root>
				<Avatar.Image src={$page.data.user.profilePic} alt="@shadcn" />
				<Avatar.Fallback>JD</Avatar.Fallback>
			</Avatar.Root>
			<div class="flex-1">
				<textarea
					bind:value={tweet}
					class="overflow-auto bg-transparent w-full outline-none text-xl"
					placeholder="what is happening"
				>
				</textarea>
				{#if imgFile}
					<img src={imgFile} alt="" />
				{/if}
			</div>
		</div>
		<div class="py-3 border-t flex items-start justify-between">
			<input
				onchange={onFileSelected}
				bind:this={fileinput}
				type="file"
				hidden
				id="img"
				name=""
				accept="image/png, image/jpeg, image/gif, image/webp"
			/>
			<label for="img">
				<Image class="w-7 h-7 text-primary cursor-pointer" />
			</label>
			<Button
				onclick={async () => {
					let url = '';
					if (imgFile) {
						const storageRef = ref(storage, `posts/${$page.data.userId}/${uuidv4()}.png`);
						const result = await uploadString(storageRef, imgFile, 'data_url');
						url = await getDownloadURL(result.ref);
					}

					await addDoc(collection(db, 'posts'), {
						tweet,
						userID: $page.data.userId,
						img: url,
						...$page.data.user,
						likes: []
					});
					tweet = '';
					invalidate('posts');
					imgFile = null;
					openModal = !openModal;
				}}>Post</Button
			>
		</div>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root
	open={openlogOut}
	onOpenChange={(o) => {
		openlogOut = !openlogOut;
	}}
>
	<Dialog.Content class=" max-w-[200px] max-h-[500px] flex items-center justify-center">
		<Button onclick={logOut} class="w-20">Log Out</Button>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root
	open={openSearch}
	onOpenChange={(o) => {
		openSearch = !openSearch;
	}}
>
	<Dialog.Content class=" max-w-[500px] max-h-[500px] flex flex-col items-center justify-center">
		<div class="rounded-md h-fit flex items-center px-2 bg-gray-800 w-96">
			<MagnifyingGlass class="h-5 w-5" />
			<input
				placeholder="search"
				type="text"
				class="h-10 px-2 outline-none bg-transparent flex-1"
				onkeypress={() => (users = fusers(true))}
				bind:value={query}
			/>
		</div>

		{#await users}
			<p>LOADING ...</p>
		{:then _}
			{#if query.length === 0 || usrs.filter((usr) => usr.name == query).length === 0}
				<p>NO USERS</p>
			{:else}
				{#each usrs.filter((usr) => usr.name === query) as usr}
					<Card Title={usr.name} action={'fanculo'} content={'diocane'} />
				{/each}
			{/if}
		{/await}
	</Dialog.Content>
</Dialog.Root>
