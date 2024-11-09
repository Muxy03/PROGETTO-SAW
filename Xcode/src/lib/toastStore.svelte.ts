import { v4 as uuidv4 } from 'uuid';
import type { Toast } from '$lib/types';

export const toasts = $state<Toast[]>([]);


export function removeToast(id:string) {
    for(let i=0; i < toasts.length; ++i){
        const toast = toasts.pop()
        if(toast && !(toast.id === id)){
            toasts.push(toast)
        }else{
            break;
        }
    }
}

export function addToast(msg:string, type = 'info', removeAfter = 5000) {
	const id = uuidv4();
    
	toasts.push({
        id,
        msg,
        type,
        removeAfter,
        visible:true
	})

	// setTimeout(() => {
	// 	removeToast(id);
	// }, removeAfter)

	return id
}