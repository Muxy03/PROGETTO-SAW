<script lang="ts">
	let copied = $state(false);
    let showModal = $state(false);
    let dialog:HTMLDialogElement;
	const Crules: string[] = ['{', '}', '.h"', ';'];
	const JSrules: string[] = ['{', ';'];
	const copy = async (text: string) => await navigator.clipboard.writeText(text);

	const reset = () =>
		setTimeout(() => {
			copied = !copied;
		}, 2000);

	// 	const code: string = `
	// #include "stdio.h"
	// int main() {
	//   double first, second, temp;
	//   printf("Enter first number: ");
	//   scanf("%lf", &first);
	//   printf("Enter second number: ");
	//   scanf("%lf", &second);

	//   temp = first;

	//   first = second;

	//   second = temp;

	//   printf("\nAfter swapping, first number = %.2lf\n", first);
	//   printf("After swapping, second number = %.2lf", second);
	//   return 0;
	// }`;

	const code: string = `
if ('clipboard' in navigator) {
		await navigator.clipboard.writeText(text);
	} else {
		const element = document.createElement('input');
		element.type = 'text';
		element.disabled = true;
		element.style.setProperty('position', 'fixed');
		element.style.setProperty('z-index', '-100');
		element.style.setProperty('pointer-events', 'none');
		element.style.setProperty('opacity', '0');
		element.value = text;
		document.body.appendChild(element);
		element.click();
		element.select();
		document.execCommand('copy');
		document.body.removeChild(element);
	}`;
</script>

<a
	href="#home"
	class="flex flex-col gap-2 max-w-80 md:min-w-80 md:max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:border-red-600"
>
	<h5 class="mb-2 md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
		Noteworthy technology acquisitions 2021
	</h5>

	<p class="inline-flex flex-row gap-3 items-center font-normal text-gray-700 dark:text-gray-400">
		<img src="https://flowbite.com/docs/images/logo.svg" class="h-8" alt="Flowbite Logo" />
		@nomeutente
		{code.split('').filter((x) => JSrules.includes(x)).length} LOC
		<button
			onclick={() => {
				copied = !copied;
				copy(code);
				reset();
			}}
			aria-label="Copia"
			data-copy-to-clipboard-target="npm-install-copy-button"
			data-tooltip-target="tooltip-copy-npm-install-copy-button"
			class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 inline-flex items-center justify-center"
		>
			{#if !copied}
				<span id="default-icon" class="items-center flex flex-row gap-1">
					Copia codice
					<svg
						class="w-3.5 h-3.5"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 18 20"
					>
						<path
							d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"
						/>
					</svg>
				</span>
			{:else}
				<span id="success-icon" class="items-center flex flex-row gap-1">
					Copiato con successo
					<svg
						class="w-3.5 h-3.5 text-blue-700 dark:text-blue-500"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 16 12"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M1 5.917 5.724 10.5 15 1.5"
						/>
					</svg>
				</span>
			{/if}
		</button>
	</p>

	<p
		class="text-pretty inline-flex flex-row gap-3 items-center font-normal text-gray-700 dark:text-gray-400"
	>
		{@html code.replaceAll('{', '{<br>').replaceAll(';', ';<br>')}
	</p>
</a>

{#snippet CreaModal(props: unknown)}
	<dialog bind:this={dialog} onclose={() => (showModal = false)}>
		<div>
			{props}
			<button onclick={() => dialog?.close()}>close modal</button>
		</div>
	</dialog>
{/snippet}
