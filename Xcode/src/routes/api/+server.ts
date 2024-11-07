import { db } from '$lib/firebase';
import { error, json } from '@sveltejs/kit';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const cacheF = new Map();
const cacheP = new Map();

export async function GET(event) {
	const user = event.url.searchParams.get('user');
	const post = event.url.searchParams.get('post');

	if (user !== null) {
		const userRef = doc(db, 'users', user);
		const userSnap = await getDoc(userRef);

		if (userSnap.exists()) {
			cacheF.set(user, [...userSnap.data().followers]);
		}

		return json(cacheF.get(user));
	} else if (post !== null) {
		const postRef = doc(db, 'posts', post);
		const postSnap = await getDoc(postRef);
		if (postSnap.exists()) {
			cacheP.set(post, [...postSnap.data().likes]);
		}

		return json(cacheP.get(post));
	}

	error(404, 'NOT FOUND RESOURCE');
}

export async function POST(event) {
	error(401, 'già registrato!');

	return json(event);
}

export async function PUT(event) {
	const user_following = event.url.searchParams.get('user');
	const post = event.url.searchParams.get('post');
	const user_follower = event.locals.userID;
	
	if (user_following !== null) {
		let followers: string[] = [];

		if (user_follower) {
			const userRef = doc(db, 'users', user_following);
			const userSnap = await getDoc(userRef);

			if (userSnap.exists()) {
				followers = [...userSnap.data().followers];

				if (followers.includes(user_follower)) {
					followers = followers.filter((id) => id !== user_follower);
				} else {
					followers = [...followers, user_follower];
				}
			}

			await updateDoc(userRef, {
				followers: followers
			});
		}

		return json([...followers]);
	}else if (post !== null){
		let likes:string[] = [];
		if (user_follower) {
			const postRef = doc(db, 'posts', post);
			const postSnap = await getDoc(postRef);

			if(postSnap.exists()){
				likes = [...postSnap.data().likes];

				if(likes.includes(user_follower)){
					likes = likes.filter(id => id !== user_follower);
				}else{
					likes = [...likes, user_follower];
				}
			}

			await updateDoc(postRef,{
				likes:likes
			});
		}

		return json([...likes]);
	}
}

export async function DELETE(event){
	const comment = event.url.searchParams.get('comment');

	if(comment !== null){
		console.log(comment)
		const commentRef = doc(db,'comments',comment);
		const commentSnap = await getDoc(commentRef);
		if(commentSnap.exists()){
			await deleteDoc(commentRef);
		}
		return json({ status: 'ok' });
	}

}
