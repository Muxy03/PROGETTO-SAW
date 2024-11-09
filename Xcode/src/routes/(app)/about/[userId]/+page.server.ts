import { db } from '$lib/firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import type { IPost } from '$lib/types';
import { error } from '@sveltejs/kit';

export const load = async ({ depends, locals, params }) => {
	const localId = locals.userID;
	const { userId } = params;
	depends("pro");

	const getUser = async (uid: string) => {
		try {
			const docRef = doc(db, 'users', uid);
			const docSnap = await getDoc(docRef);
			return docSnap.data();
		} catch (e) {
			console.error(e);
			error(400, 'an error occured');
		}
	};

	const getPosts = async () => {
		try {
			const querySnapshot = await getDocs(
				query(collection(db, 'posts'), where('userID', '==', userId))
			);
			const res: IPost[] = [];
			querySnapshot.forEach((doc) => {
				const post: unknown = { id: doc.id, ...doc.data() };
				res.push(post as IPost);
			});
			return res;
		} catch (e) {
			console.error(e);
			error(400, 'an error occured');
		}
	};
	if (localId) {
		return {
			localId,
			localUser: await getUser(localId),
			userId,
			user: await getUser(userId),
			posts: await getPosts()
		};
	}
};
