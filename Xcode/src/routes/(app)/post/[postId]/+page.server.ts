import { db } from '$lib/firebase';
import type { IPost } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import { doc, getDoc } from 'firebase/firestore';

export const load = async ({ params }) => {
	const { postId } = params;
    
	const getPost = async (uid: string) => {
		const postSnap = await getDoc(doc(db, 'posts', uid));
		if (postSnap.exists()) {
			return { ...postSnap.data() } as IPost;
		}
	};
	if (postId) {
		return { post: await getPost(postId) };
	} else {
		redirect(303, '/');
	}
};
