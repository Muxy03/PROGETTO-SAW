export interface IUser {
	name: string;
	email: string;
	profilePic: string;
}
export interface IPost extends IUser {
	id?: string;
	tweet: string;
	userID: string;
	img?: string;
	likes: string[];
}

export interface Comment extends IPost{
	content:string;
}