<script lang="ts">
    import Button from './ui/button/button.svelte';

	let { Title, content, action }  = $props();
</script>

<div class="w-full mx-auto px-4 py-3 bg-gray-900 space-y-2 rounded-md">
    <h1 class="text-lg font-bold capitalize">
        {Title}
    </h1>
    <p >
        {content}
    </p>
    <Button>{action}</Button>
</div>