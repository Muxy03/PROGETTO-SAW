import { db } from "$lib/firebase"
import { collection, doc,getDoc, getDocs, query, where } from "firebase/firestore"
import type { Comment } from "$lib/types"
import { redirect} from '@sveltejs/kit'

export const load = async({params}) => {
    const {postId} = params;
    const getPost = async(id:string)=>{
        try {
            const postSnap = await getDoc(doc(db,'posts',id))
            return postSnap.data();
        } catch (e) {
            console.error(e);
            throw redirect(303,'/');
        }
    }

    const getComments = async(postId:string) =>{
        const comments:Comment[] = []
        const q = query(collection(db,'comments'), where('postId','==',postId))
        const qSnapshot = await getDocs(q)
        qSnapshot.forEach((doc)=>{
            comments.push({id:doc.id,...doc.data()} as Comment)
        })
        return comments;
    }

    return {
        comments: await getComments(postId),
        post:await getPost(postId)
    }
}