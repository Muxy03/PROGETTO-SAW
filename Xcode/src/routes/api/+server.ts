import { db } from '$lib/firebase';
import { error, json } from '@sveltejs/kit';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const cache = new Map();

export async function GET(event) {
	const user = event.url.searchParams.get('user')!;

	// if (cache.get(user)) {
	// 	return json(cache.get(user));
	// }

	const userRef = doc(db, 'users', user);
	const userSnap = await getDoc(userRef);
	if (userSnap.exists()) {
		cache.set(user, [...userSnap.data().followers]);
	}

	return json(cache.get(user));
}

export async function POST(event) {
	error(401, 'già registrato!');

	return json(event);
}

export async function PUT(event) {
	const user_following = event.url.searchParams.get('user')!;
	const user_follower = event.locals.userID;
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
}
