import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { FB_CLIENT_EMAIL, FB_PRIVATE_KEY, FB_PROGETTO_ID } from '$env/static/private';
import pkg from 'firebase-admin';

try {
	pkg.initializeApp({
		credential: pkg.credential.cert({
			projectId: FB_PROGETTO_ID,
			clientEmail: FB_CLIENT_EMAIL,
			privateKey: FB_PRIVATE_KEY.replace(/\\n/gm, '\n')
		})
	});
} catch (err: unknown) {
	if (!/already exists/u.test((err as Error).message)) {
		console.error('Firebase Admin Error: ', (err as Error).stack);
	}
}

export const adminAuth = getAuth();
export const adminDB = getFirestore();