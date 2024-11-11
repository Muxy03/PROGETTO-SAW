<script>
	import { flip } from 'svelte/animate'
	import Toast from '$lib/components/Toast.svelte'
	import { toasts } from '$lib/toastStore.svelte'
</script>

{#if toasts.length}
<section>
	{#each toasts as toast (toast.id)}
		<Toast {toast} />
	{/each}
</section>
{/if}

<style lang="postcss">
  section {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    display: flex;
    margin-top: 1rem;
    justify-content: center;
    flex-direction: column;
    z-index: 1000;
  }
</style>