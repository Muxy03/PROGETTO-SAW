import { db } from "$lib/firebase"
import { error } from "@sveltejs/kit"
import { collection, getDocs } from "firebase/firestore"

export const load = async({depends}) =>{
    depends('posts')
    const getPosts = async()=>{
        try{
            const querySnapshot = await getDocs(collection(db,'posts'))
            const res:any[] = []
            querySnapshot.forEach((doc)=>{
                const post = {id:doc.id,...doc.data()}
                res.push(post)
            })
            return res;
        }catch(e){
            throw error(400,'an error occured');
        }
    }
    return {
        posts:await getPosts()
    }
}