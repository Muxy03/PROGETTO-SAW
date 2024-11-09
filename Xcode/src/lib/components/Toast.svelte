<script lang='ts'>
	import { fade, fly } from 'svelte/transition'
	import { removeToast } from '$lib/toastStore.svelte'
	import type { Toast } from '$lib/types';
	import { onMount } from 'svelte';

	let {toast}:{toast:Toast} = $props();
    onMount(()=>{
        setTimeout(()=>{
            toast.visible = false;
        },toast.removeAfter);
    })
</script>

{#if toast.visible}
    <div class={toast.type} in:fly={{ y: 50000 }} out:fade>
    <span role="status">
        {@html toast.msg}
    </span>
    <button onclick={() => removeToast(toast.id)}>
        ❌
    </button>
    </div>
{/if}

<style>
	div {
		padding: 1.2em;
		margin-top: 1em;
		border-radius: 0.5em;
		box-shadow: 0 8px 16px hsla(0, 0%, 0%, 0.2);
	}

	button {
		margin: 0;
		margin-left: 2em;
	}

	.info {
		color: var(--toast-info-color, black);
		background: var(--toast-info-background, white);
	}

	.warn {
		color: var(--toast-warn-color, black);
		background: var(--toast-warn-background, lightpink);
	}
</style>