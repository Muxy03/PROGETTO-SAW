<script>
	import { flip } from 'svelte/animate'
	import Toast from '$lib/components/Toast.svelte'
	import { toasts } from '$lib/toastStore.svelte'
</script>

{#if toasts.length}
<ul class="flex-1">
	{#each toasts as toast (toast.id)}
	<li animate:flip>
		<Toast {toast} />
	</li>
	{/each}
</ul>
{/if}

<style>
	ul {
		list-style: none;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		position: fixed;
		bottom: 1em;
	}
</style>