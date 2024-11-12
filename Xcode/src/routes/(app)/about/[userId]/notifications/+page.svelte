<script lang="ts">
	import { removeToast, toasts } from '$lib/toastStore.svelte';
</script>

<div class="min-h-screen flex flex-col items-center justify-center w-full">

	{#if toasts.length === 0}
		<p class="font-mono text-2xl">NO NOTIFICATIONS</p>
	{/if}

	{#each toasts as toast (toast.id)}
		<div class="flex justify-between px-3 py-1 bg-slate-900 items-center gap-1 rounded-lg border border-gray-100 my-3">
			<div>
				<span class="font-mono truncate text-sm">{toast.msg}</span>
			</div>
			<button type="button" aria-label="visualized notification" onclick={()=>removeToast(toast.id)}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
					<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
				  </svg>
			</button>
		</div>
	{/each}
</div>