import { db } from "$lib/firebase"
import { error, redirect } from "@sveltejs/kit";
import { doc, getDoc } from "firebase/firestore"

export const load = async ({ locals }) => {
    const userId = locals.userID;
    const getUser = async (uid: string) => {
        try {
            const docRef = doc(db, 'users', uid);
            const docSnap = await getDoc(docRef);
            return docSnap.data()
        } catch (e) {
            console.error(e);
            throw error(400, 'an error occured')
        }
    }

    if(userId){
        const data = { userId, user: await getUser(userId) };
        if (!data.user) {
            throw redirect(303, '/login')
        }
        return data
    }
}