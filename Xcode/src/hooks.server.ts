import { adminAuth } from "$lib/server/firebaseAdmin"
import type { Handle } from "@sveltejs/kit"
export const handle =  (async({event,resolve}) => {
    const sessionCookie = event.cookies.get('__session');

    if(!sessionCookie){
        event.locals.userID = null;
        return resolve(event);
    }
        
    const decodeClaims = await adminAuth.verifySessionCookie(sessionCookie);
    event.locals.userID = decodeClaims.uid;    
    const res = await resolve(event);
    
    return res;
}) satisfies Handle