import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const localId = locals.userID;

	if (localId) {
		return {
			localId,
		};
	}else{
		redirect(303,'/');
	}
};
