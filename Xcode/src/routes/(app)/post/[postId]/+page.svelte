<script lang="ts">
	import { ChatBubble, Heart, HeartFilled } from 'radix-icons-svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import Button from '$lib/components/ui/button/button.svelte';
	import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, QuerySnapshot, where } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { IPost, IUser, Comment } from '$lib/types';
	import TweetComment from '$lib/components/TweetComment.svelte';
	import title from '$lib/assets/title.png';

	let { data }: { data: { userId: string, post:IPost } } = $props();

	const handleLikes = async (cond: boolean = false) => {
		if (cond) {
			try {
				likes = await (
					await fetch(`http://localhost:5173/api?post=${$page.params.postId}`, { method: 'PUT' })
				).json();
			} catch (e) {
				console.error('Failed to update followers:', e);
			}
		}
	};

	const handleFollowers = async (cond: boolean = false) => {
		if (cond) {
			if (data.userId !== data.post.userID) {
				try {
					followers = await (
						await fetch(`http://localhost:5173/api?user=${data.post.userID}`, {
							method: 'PUT'
						})
					).json();
				} catch (e) {
					console.error('Failed to update followers:', e);
				}
			}
		}
	};

	let comment = $state('');
	let comments = $state<Comment[]>([]);

	let like = $state(handleLikes());
	let likes = $state<string[]>([]);

	let follow = $state(handleFollowers());
	let followers = $state<string[]>([]);

	let user: IUser | undefined = $state();

	onMount(() => {
		const getFollower = async () => {
			const response = await fetch(`http://localhost:5173/api?user=${data.post.userID}`);
			followers = await response.json();
		};

		const getLikes = async () => {
			const response = await fetch(`http://localhost:5173/api?post=${$page.params.postId}`);
			likes = await response.json();
		};

		const getUser = async (uid: string) => {
			const postSnap = await getDoc(doc(db, 'users', uid));
			if (postSnap.exists()) {
				user = { ...postSnap.data() } as IUser;
			}
		};

		const getComments = async (postId: string) => {
			const q = query(collection(db, 'comments'), where('postId', '==', postId));
			const qSnapshot = await getDocs(q);
			qSnapshot.forEach((doc) => {
				comments.push({ id: doc.id, ...doc.data() } as Comment);
			});
		};

		const q = query(collection(db, 'comments'), where('postId', '==', $page.params.postId));
		const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
			let newComments: Comment[] = [];
			querySnapshot.forEach((doc) => {
				newComments.push({ id: doc.ref.id, ...doc.data() } as Comment);
			});

			comments = [...newComments];
		});

		const Funsub = onSnapshot(doc(db, 'users', data.post.userID), (doc) => {
			followers = [...doc.data()!.followers];
		});
		const Lunsub = onSnapshot(doc(db, 'posts', $page.params.postId), (doc) => {
			likes = [...doc.data()!.likes];
		});

		getUser(data.userId);
		getComments($page.params.postId);
		getFollower();
		getLikes();

		return () => {
			unsubscribe();
			Funsub();
			Lunsub();
		};
	});
</script>

<header
	class="w-full h-42 flex flex-col items-center justify-center bg-background/70 fixed z-10 top-0 left-0 backdrop-blur mb-4"
>
	<img src={title} alt="Title" />
</header>

<div class=" pt-24 mx-10 h-full flex flex-col gap-6">
	<div class="flex flex-col gap-6 border p-4 rounded-lg">
		<div class="flex justify-between border-b p-2">
			<button class="flex flex-row gap-2" onclick={() => goto(`/about/${data.post.userID}`)}>
				<Avatar.Root>
					<Avatar.Image src={data.post.profilePic} alt="@shadcn" />
					<Avatar.Fallback>JD</Avatar.Fallback>
				</Avatar.Root>

				<div>
					<p class="capitalize font-semibold">{data.post.name}</p>
					<p class="text-sm text-gray-800">@{data.post.email}</p>
				</div>
			</button>

			{#if followers.includes(data.userId)}
				<Button onclick={() => (follow = handleFollowers(true))} variant="secondary"
					>following</Button
				>
			{:else}
				<Button onclick={() => (follow = handleFollowers(true))}>follow</Button>
			{/if}
		</div>
		<div class="py-3 border rounded-sm p-4">
			<p>
				{data.post.tweet}
			</p>
			{#if data.post.img}
				<img src={data.post.img} alt="" />
			{/if}
		</div>

		<div class="flex gap-3 text-sm mt-2">
			<button
				onclick={() => (like = handleLikes(true))}
				class="flex transition-all group items-center gap-2 text-gray-600"
			>
				<div class="p-1 rounded-full group-hover:bg-blue-500/20">
					{#if likes.includes(data.userId)}
						<HeartFilled class=" text-blue-500 " />
					{:else}
						<Heart class=" group-hover:text-blue-500 " />
					{/if}
				</div>
				<span class="group-hover:text-blue-500"> {likes.length} </span>
			</button>

			<button class="flex transition-all group items-center gap-2 text-gray-600">
				<div class="p-1 rounded-full group-hover:bg-green-500/20">
					<ChatBubble class=" group-hover:text-green-500 " />
				</div>
				<span class="group-hover:text-green-500"> {comments.length} </span>
			</button>
		</div>
		<div class="flex items-center justify-between gap-2">
			<Avatar.Root>
				<Avatar.Image src={user === undefined ? '' : user.profilePic} alt="@shadcn" />
				<Avatar.Fallback>CN</Avatar.Fallback>
			</Avatar.Root>
			<input
				type="text"
				bind:value={comment}
				class="p-2 border rounded-lg w-full mx-3 bg-transparent flex-1"
				placeholder="Commenta"
				maxlength="1024"
			/>
			<Button
				onclick={async () => {
					const newComment = comment;
					comment = '';
					const c = await addDoc(collection(db, 'comments'), {
						content: newComment,
						name: user === undefined ? '' : user.name,
						email: user === undefined ? '' : user.email,
						profilePic: user === undefined ? '' : user.profilePic,
						postId: $page.params.postId,
						creator: data.userId
					});
				}}
				disabled={comment.length < 1}>comment</Button
			>
		</div>
	</div>
	<div class="w-full border-t flex flex-col gap-5">
		{#each comments as comment}
			<TweetComment
				id={comment.id}
				avatar={comment.profilePic}
				name={comment.name}
				tweet={comment.content}
				creator={comment.creator}
			/>
		{/each}
	</div>
</div>
