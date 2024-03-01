<script lang='ts'>
  import Keyboard from "./Keyboard.svelte";
  export let dim = 3;
  export let visibility:boolean;
  const gridText:String[][] = Array.from({ length: dim }, () => Array(dim).fill(''));
  $:i=0;
	$:j=0;
  function handleKey(k:String) {
      console.log(k);
      if(k == 'BACKSPACE'){
        gridText[i][--j] = '';
        if(j == 0 && i!==0){
          i--;
          j= dim;
        }
        return;
      }

      if(j == dim && k!='ENTER') return;
      
      if(j == dim && k=='ENTER'){
        i++;
        j=0;
        return;
      }
      
      gridText[i][j++] = k; 
    }
  </script>
  
  <div id="container-generale">
    <div class="grid" style="grid-template-columns: repeat({dim}, 1fr);">
      {#each gridText as row, rowIndex}
        {#each row as cell, columnIndex}
          <div id ="grid-item-{rowIndex}-{columnIndex}" class="grid-item">{cell}</div>
        {/each}
      {/each}
    </div>
  
    <Keyboard visibility={visibility} handler={handleKey}/>
  </div>

  <svelte:window on:keypress|preventDefault={(e)=>handleKey(e.key.toUpperCase())} />

  <style>
    .grid {
      display: grid;
      grid-gap: 10px;
      max-width: 600px;
      margin-top: 50px;
    }
  
    .grid-item {
      background-color: #f0f0f0;
      padding: 20px;
      text-align: center;
      cursor: pointer;
    }

    #container-generale{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      height: 90vh;
    }
  
  </style>