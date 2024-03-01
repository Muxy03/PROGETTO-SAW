<script lang='ts'>
	export let visibility:boolean;
	export let handler:(k:String)=>void;
	const keys = "QWERTYUIOPASDFGHJKLZXCVBNM";
</script>

{#if visibility}
<div class="keyboard">
    {#each keys as key}
      <button class="kbc-button" on:click={()=>handler(key)}>{key}</button>
    {/each}
    <button id="enter-btn" class="kbc-button" on:click={()=>handler('ENTER')}>ENTER</button>
    <button id="back-btn"  class="kbc-button" on:click={()=>handler("BACKSPACE")}>BACKSPACE</button>
  </div>
{/if}

<style type="text/css">
    .keyboard {
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      bottom: 0;
    }
  
    .keyboard button{
      font-size: 16px;
      cursor: pointer;
      text-align: center;
    }

    #back-btn{
      grid-column: span 2;
    }
    #enter-btn{
      grid-column: span 2;
    }
  
    @media (max-width: 600px) {
      .keyboard button {
        padding: 5px;
        font-size: 14px;
      }
    }
</style>

