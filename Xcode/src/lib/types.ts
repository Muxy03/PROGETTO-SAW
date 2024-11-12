export interface IUser {
	ID:string;
	name: string;
	email: string;
	profilePic: string;
	followers:string[];
}
export interface IPost extends IUser {
	id:string;
	tweet: string;
	userID: string;
	img?: string;
	likes: string[];
	timestamp:Date;
}

export interface Comment extends IPost{
	content:string;
	creator:string;
}

export interface Toast {
	id:string,
	msg:string,
	type:string,
	removeAfter:number,
	visible:boolean
}