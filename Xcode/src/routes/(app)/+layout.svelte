<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Toasts from '$lib/components/Toasts.svelte';
	let { data, children } = $props();

	import { onMount } from 'svelte';
	import { collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
	import type { IPost } from '$lib/types';
	import { db } from '$lib/firebase';
	import { addToast } from '$lib';

	let myFollowers = $state<string[]>([]);
	let cacheFollower = 0;
	
	let myPostsIds = $state<string[]>([]);
	let Comments = $state<{pid:string,count:number}[]>([]);
	let cacheComment:{pid:string,count:number}[] = [];


	onMount(() => {
		const getFollower = async () => {
			const response = await fetch(`http://localhost:5173/api?user=${data.userId}`);
			myFollowers = await response.json();
			cacheFollower = myFollowers.length;
		};

		const unsub = onSnapshot(doc(db, 'users', data.userId), (doc) => {
			myFollowers = doc.data()!.followers;
		});

		getFollower();

		///////////////
		const getPostsIds = async () => {
			const q = query(collection(db, 'posts'), where('userID', '==', data.userId));
			const posts = await getDocs(q);
			if (!posts.empty) {
				posts.forEach((post) => myPostsIds.push(post.ref.id));
			}
		};
		
		getPostsIds();

		myPostsIds.forEach((id) => {
			const q1 = query(collection(db, 'comments'), where('postId', '==', id));
			const snap = onSnapshot(q1, (querySnapshot) => {
				let newComments: Comment[] = [];
				querySnapshot.forEach((doc) => {
					newComments.push({ id: doc.ref.id, ...doc.data() } as unknown as Comment);
				});

				Comments.push({pid:id,count:newComments.length});
				cacheComment.push({pid:id,count:newComments.length});
			});
			snap();
		});

		return () => {
			unsub();
		};
	});

	$effect(() => {
		if (cacheFollower < myFollowers.length) {
			addToast('qualcuno ha iniziato a seguirti');
		}
		cacheFollower = myFollowers.length;
		Comments.forEach((comment,ind)=>{
			if(cacheComment[ind].count < comment.count){
				addToast('qualcuno ha commentato il post ' + `${comment.pid}`)
			}
		})
		cacheComment = [...Comments];
	});
</script>

<Toasts />

<div class="flex flex-col gap-3 max-w-[700px] mx-auto">
	<main class="min-h-screen scroll-smooth z-10">
		{@render children()}
	</main>

	<Navbar />
</div>
