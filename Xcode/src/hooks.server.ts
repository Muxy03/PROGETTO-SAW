import { adminAuth } from "$lib/server/firebaseAdmin"
import type { Handle } from "@sveltejs/kit"
export const handle =  (async({event,resolve}) => {
    const sessionCookie = event.cookies.get('__session')
    try {
        const decodeClaims = await adminAuth.verifySessionCookie(sessionCookie!);
        event.locals.userID = decodeClaims.uid
    } catch (e) {
        console.error(e);
        event.locals.userID = null;
        return resolve(event)
    }
    const res = await resolve(event);
    return res;
}) satisfies Handle