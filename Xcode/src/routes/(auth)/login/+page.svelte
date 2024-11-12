<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
	import { auth, db } from '$lib/firebase';
	import { goto } from '$app/navigation';
	import { doc, getDoc, setDoc } from 'firebase/firestore';

	const provider = new GoogleAuthProvider();
	const login = async () => {
		try {
			const { user } = await signInWithPopup(auth, provider);
			const idToken = await user.getIdToken();

            await fetch('/login', {
				method: 'POST',
				body: JSON.stringify(idToken)
			});
			
            const userDocRef = doc(db, 'users', user.uid);
			const userDocSnap = await getDoc(userDocRef);
			
			if (!userDocSnap.exists()) {
				await setDoc(
					doc(db, 'users', user.uid),
					{
						ID:user.uid,
						name: user.displayName,
						email: user.email,
						profilePic: user.photoURL,
						followers: []
					},
					{
						merge: true
					}
				);
			}

			goto('/');
		} catch (error) {
			console.log(error);
		}
	};
</script>

<div class="flex flex-col items-center h-screen  w-screen border justify-center">
	<img src="/logo.svg" alt="">
	<Button onclick={login}>login with google</Button>
</div>