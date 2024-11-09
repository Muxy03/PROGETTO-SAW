import { db } from "$lib/firebase"
import type { IPost } from "$lib/types.js"
import { error } from "@sveltejs/kit"
import { collection, getDocs } from "firebase/firestore"

export const load = async({depends}) =>{
    depends('posts')
    const getPosts = async()=>{
        try{
            const querySnapshot = await getDocs(collection(db,'posts'))
            const res:IPost[] = []
            querySnapshot.forEach((doc)=>{
                const post:unknown = {id:doc.id,...doc.data()}
                res.push(post as IPost)
            })
            return res;
        }catch(e){
            console.error(e);
            error(400,'an error occured');
        }
    }
    return {
        posts:await getPosts()
    }
}