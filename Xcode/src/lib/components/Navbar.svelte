<script lang="ts">
	import {Home, Image, MagnifyingGlass, Pencil1, ThickArrowLeft } from 'radix-icons-svelte';
	import Button from './ui/button/button.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Dialog from '$lib/components/ui/dialog';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { signOut } from 'firebase/auth';
	import { auth, db, storage } from '$lib/firebase';
	import { getDownloadURL, ref, uploadString } from 'firebase/storage';
	import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
	import { v4 as uuidv4 } from 'uuid';
	import Card from '$lib/components/Card.svelte';
	import type { IUser } from '$lib/types';
	import Notification from './Notification.svelte';
	import { onMount } from 'svelte';

	let { data } : { data: { userId:string } } = $props()
	
	const onFileSelected = (e: any): void => {
		let image = e.target.files![0];
		let reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = (e) => {
			imgFile = e.target?.result;
		};
	};

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

	const fusers = async (cond: boolean = false) => {
		if (cond) {
			const usersId = [...$page.data.posts].map((post) => post.userID).filter((id) => id !== userId);
			const usersRef: any[] = [];

			usersId.forEach((id) => {
				usersRef.push(doc(db, 'users', id));
			});

			for (const ref of usersRef) {
				const userSnap = await getDoc(ref);
				if (userSnap.exists()) {
					if (
						(userSnap.data() as IUser).name !== userId &&
						usrs.filter((usr) => usr.name === (userSnap.data() as IUser).name).length === 0
					) {
						usrs.push({ ...userSnap.data() as IUser});
					}
				}
			}
		}
	};

	let openModal = $state(false);
	let openlogOut = $state(false);
	let openSearch = $state(false);
	let user:IUser|undefined = $state();
	let userId = $state($page.data.userId);
	let tweet = $state('');
	let imgFile: any = $state();
	let fileinput: any;
	let query = $state('');
	let usrs: IUser[] = $state([]);
	let users = $state(fusers());
	
	const sidebarOptions = [Home, MagnifyingGlass, Pencil1];

	onMount(() => {
		const getUser = async (uid: string) => {
		    try {
		        const docRef = doc(db, 'users', uid);
		        const docSnap = await getDoc(docRef);
		        user = docSnap.data() as IUser;
		    } catch (e) {
		        console.error(e);
			}
		}

		getUser(data.userId);
	});

	$effect(() => {});
</script>

<div class="min-w-full fixed bottom-0 h-50px w-full flex justify-center bg-slate-900">
	<div class="grid h-full max-w-xl grid-cols-5 mx-auto">
		{#each sidebarOptions as Component}
			{#if Component === ThickArrowLeft}
				<button
					onclick={logOut}
					data-tooltip-target="tooltip-home"
					type="button"
					class="inline-flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 group"
				>
					<Component size={30} />
				</button>
			{:else if Component === Pencil1}
				<button
					data-tooltip-target="tooltip-post"
					type="button"
					onclick={() => (openModal = true)}
					class="inline-flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 group rounded-lg"
				>
					<Pencil1 size={30} />
					<span class="sr-only">New post</span>
				</button>
			{:else if Component === MagnifyingGlass}
				<button
					data-tooltip-target="tooltip-post"
					type="button"
					onclick={() => (openSearch = true)}
					class="inline-flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 group rounded-lg"
				>
					<MagnifyingGlass size={30} />
					<span class="sr-only">New post</span>
				</button>
			{:else if Component === Home}
				<button
					data-tooltip-target="tooltip-post"
					type="button"
					onclick={() => goto('/')}
					class="inline-flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 group rounded-lg"
				>
					<Home size={30} />
					<span class="sr-only">New post</span>
				</button>
			{/if}
		{/each}
		<button
			data-tooltip-target="tooltip-home"
			type="button"
			onclick={() => goto(`http://localhost:5173/about/${userId}/notifications/`)}
			class="inline-flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 group rounded-lg"
		>
			<Notification size={30} />
		</button>

		<button
			onclick={() => (openlogOut = true)}
			data-tooltip-target="tooltip-settings"
			type="button"
			class="inline-flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 group rounded-lg"
		>
			<Avatar.Root>
				<Avatar.Image src={user === undefined ? '' : user.profilePic} alt="@shadcn" referrerpolicy="no-referrer" />
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
	<Dialog.Content class=" w-96 h-fit overflow-auto">
		<div class="flex gap-3">
			<Avatar.Root>
				<Avatar.Image src={user === undefined ? '' : user.profilePic} alt="@shadcn" />
				<Avatar.Fallback>JD</Avatar.Fallback>
			</Avatar.Root>
			<div class="flex-1">
				<textarea
					bind:value={tweet}
					class="w-full overflow-auto bg-transparent outline-none text-xl"
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
						const storageRef = ref(storage, `posts/${userId}/${uuidv4()}.png`);
						const result = await uploadString(storageRef, imgFile, 'data_url');
						url = await getDownloadURL(result.ref);
					}

					await addDoc(collection(db, 'posts'), {
						tweet: tweet,
						userID: userId,
						img: url,
						...user,
						likes: [],
						timestamp:Date.now()
					});

					tweet = '';
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
	<Dialog.Content class=" max-w-[300px] max-h-[500px] flex items-center justify-center">
		<Button onclick={logOut} class="w-20">Log Out</Button>
		<Button
			onclick={() => {
				openlogOut = !openlogOut;
				goto(`http://localhost:5173/about/${userId}`);
			}}
			class="w-20">About Me</Button
		>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root
	open={openSearch}
	onOpenChange={(o) => {
		openSearch = !openSearch;
	}}
>
	<Dialog.Content class=" w-1/2 max-h-fit flex flex-col items-center justify-center">
		<div class="rounded-md flex items-center px-2 mt-3 bg-gray-800 w-full">
			<MagnifyingGlass class="h-5 w-5" />
			<input
				placeholder="search"
				type="text"
				class=" w-full h-10 px-2 outline-none bg-transparent flex-1"
				onkeypress={() => (users = fusers(true))}
				bind:value={query}
			/>
		</div>

		{#await users}
			<p>LOADING ...</p>
		{:then _}
			{#if query.length === 0 || usrs.filter((usr) => usr.name == query).length === 0}
				<p class="text-center">NO USERS</p>
			{:else}
				{#each usrs.filter((usr) => usr.name === query) as usr}
					<Card Title={usr.name} action={usr.ID} content={usr.email} />
				{/each}
			{/if}
		{/await}
	</Dialog.Content>
</Dialog.Root>
