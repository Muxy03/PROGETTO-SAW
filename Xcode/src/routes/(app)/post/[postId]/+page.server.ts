import { db } from "$lib/firebase"
import { collection, doc,getDoc, getDocs, query, where } from "firebase/firestore"
import { error} from '@sveltejs/kit'

export const load = async({params}) => {
    const {postId} = params;
    const getPost = async(id:string)=>{
        try {
            const postSnap = await getDoc(doc(db,'posts',id))
            return postSnap.data()
        } catch (e) {
            throw error(400,'an error occured')
        }
    }

    const getComments = async(postId:string) =>{
        const comments:any[] = []
        const q = query(collection(db,'comments'), where('postId','==',postId))
        const qSnapshot = await getDocs(q)
        qSnapshot.forEach((doc)=>{
            comments.push({id:doc.id,...doc.data()})
        })
        return comments;
    }

    return {
        comments: await getComments(postId),
        post:await getPost(postId)
    }
}