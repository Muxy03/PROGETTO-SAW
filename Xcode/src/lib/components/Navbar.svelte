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
	import { addDoc, collection } from 'firebase/firestore';

	let fileinput: any;
	let imgFile: any = $state();

	const onFileSelected = (e:any): void => {
		let image = e.target.files![0];
		let reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = (e) => {
			imgFile = e.target?.result;
		};
	};

	let openModal = $state(false);
	let tweet = $state('');

	const sidebarOptions = [
		{
			icons: Home,
			title: 'home',
			href: '/'
		},
		{
			icons: MagnifyingGlass,
			title: 'explorer',
			href: '/'
		},
		{
			icons: Bell,
			title: 'notification',
			href: '/'
		},
		{
			icons: ThickArrowLeft,
			title: 'logout',
			href: '/login'
		}
	];

	const logOut = async () => {
		await signOut(auth);
		await fetch('/login', {
			method: 'DELETE'
		});
		goto('/login');
	};
</script>

<div
	class="fixed bottom-2 shadow-lg
    shadow-gray-500/30 hover:shadow-md left-0
    duration-300 overflow-hidden border-t rounded-xl
    border z-50 w-full h-16 max-w-md inset-x-0
    mx-auto flex justify-between flex-row
    md:px-3 md:flex-[0.4] md:border md:rounded-none
    md:w-screen md:flex-col md:h-screen md:sticky md:z-10
    md:top-0 md:mx-0"
>
	<div
		class="px-3 w-full flex justify-between items-center flex-row md:py-2 md:h-screen md:flex-col md:mt-5"
	>
		{#each sidebarOptions as { href, icons, title }}
			{#if title === 'logout'}
				<button onclick={logOut} class="flex gap-[22px] hover:bg-white/10 p-3 w-fit rounded-full">
					<svelte:component this={icons} class="w-7 h-7" />
					<p class=" text-lg capitalize hidden md:inline-block pr-5">{title}</p>
				</button>
			{:else}
				<a {href} class="flex gap-[22px] hover:bg-white/10 p-3 w-fit rounded-full">
					<svelte:component this={icons} class="w-7 h-7" />
					<p class=" text-lg capitalize hidden md:inline-block pr-5">{title}</p>
				</a>
			{/if}
		{/each}

		<Button size="icon" on:click={() => (openModal = true)} class="md:py-6  md:w-full">
			<Pencil1 class="md:mr-2  h-4 w-4" />
			<span class="hidden md:inline"> Post </span>
		</Button>

		<div class="flex gap-2 items-center justify-center py-3">
			<Avatar.Root>
				<Avatar.Image src={$page.data.user.profilePic} alt="@shadcn" referrerpolicy="no-referrer"/>
				<Avatar.Fallback>JD</Avatar.Fallback>
			</Avatar.Root>
			<div class="hidden md:inline-block">
				<p class="font-medium capitalize">{$page.data.user.name}</p>
				<p class="text-gray-800">{$page.data.user.email}</p>
			</div>
		</div>

		<!-- <img src={Logo} alt="Logo" class="hidden md:inline md:w-full md:h-auto"> -->
	</div>
</div>
<Dialog.Root
	open={openModal}
	onOpenChange={(o) => {
		openModal = !openModal;
	}}
>
	<Dialog.Content class="max-h-[500px]  overflow-auto ">
		<div class="flex gap-2">
			<Avatar.Root>
				<Avatar.Image src={$page.data.user?.profilePic} alt="@shadcn" />
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
				<Image
					class="w-7 h-7 text-primary cursor-pointer"
				/>
			</label>
			<Button
				onclick={async () => {
					let url = '';
					if (imgFile) {
						const storageRef = ref(storage, `posts/${$page.data.userId}/IMG.png`);
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
