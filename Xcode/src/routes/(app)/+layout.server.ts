import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const { userID } = locals;
	if (userID) {
		return { userId: userID };
	} else {
		redirect(303, '/login');
	}
};