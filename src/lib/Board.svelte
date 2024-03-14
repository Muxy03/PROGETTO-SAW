<script lang="ts">
  import Keyboard from "./Keyboard.svelte";
  export let dim = 3;
  export let visibility: boolean;
  export let guess: string;
  $: gridText = Array.from({ length: dim }, () => Array(dim).fill(""));
  $: i = 0;
  $: j = 0;
  $:descrizione = "";
  $: bgColor = "trasparent";
  function check() {
    let tmp = j;
    let attempt = gridText[i].join("")
    if (attempt == guess) {
      descrizione = "corretta";
      return;
    }
    if(guess.split("").filter((el)=> attempt.includes(el)).length > 0){
      bgColor = "yellow";
      return;
    }else{
      bgColor = "gray";
      return;
    }
  }
  function handleKey(k: String) {
    if (k == "BACKSPACE") {
      gridText[i][--j] = "";
      if (j == 0 && i !== 0) {
        i--;
        j = dim;
      }
      return;
    }

    if ((j == dim && k != "ENTER") || (j != dim && k == "ENTER")) {
      return;
    }

    if (j == dim && k == "ENTER") {
      check();
      i++;
      j = 0;
      return;
    }
    gridText[i][j++] = k;
  }
</script>

<div id="container-grid">
  <div class="grid" style="grid-template-columns: repeat({dim}, 1fr);">
    {#each gridText as row, rowIndex}
      {#each row as cell, columnIndex}
        <div id="grid-item-{rowIndex}-{columnIndex}" class="grid-item" style="background-color: {i === rowIndex && descrizione === "corretta" ? "green":""};">
          {cell}
        </div>
      {/each}
    {/each}
  </div>
</div>
<div id="container-keyboard">
  <Keyboard {visibility} handler={handleKey} />
</div>

<style>
  .grid {
    display: grid;
    grid-gap: 10px;
    max-width: 600px;
  }

  .grid-item {
    line-height: 60px;
    text-align: center;
    cursor: pointer;
    width: 60px;
    height: 60px;
    color: whitesmoke;
    border: 2px solid grey;
  }

  #container-grid {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 72vh;
  }

  #container-keyboard {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100vw;
  }

  /* @media (prefers-color-scheme: light) {
      .grid-item {
        color: black;
      }
    }

    @media (prefers-color-scheme: dark) {
      .grid-item {
        color: whitesmoke;
        background-color: #151515;
      }
    } */
</style>
