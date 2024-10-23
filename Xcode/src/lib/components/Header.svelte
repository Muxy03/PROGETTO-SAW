<script lang='ts'>
let section = $state(0);
</script>

<header class="bg-background/70 sticky border z-10 top-0 left-0 backdrop-blur">
	<h1 class="text-center capitalize text-lg font-semibold py-3.5 px-4">home</h1>
	<div class="grid grid-cols-2 text-md">
        <button onclick={()=> section = 0} class:disable={section == 1} class:active={section == 0} class="py-4 capitalize hover:bg-white/10"> for you </button>
		<button onclick={()=> section = 1} class:disable={section == 0} class:active={section == 1} class="py-4 capitalize hover:bg-white/10"> following </button>
	</div>
</header>

<style>
	.active{
		color: rgb(255 255 255);
		font-weight: 700;
	}

	.disable{
		color: rgb(209 213 219);
	}
</style>