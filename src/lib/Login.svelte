<script>
  import { createEventDispatcher } from "svelte";
  import { fly, fade } from "svelte/transition";

  const dispatch = createEventDispatcher();

  function close() {
    dispatch("closeIt");
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="background" transition:fade on:mousedown={close}/>
<div class="login-box" transition:fly={{ y: -500 }}>
    <div class="container">
        <form action="">
          <label for="username">Username:<input type="text" /></label><br />
          <label for="pasword">Password:<input type="password" /></label><br />
          <button on:click={close}>Login</button>
          <button on:click={close}>Close</button>
        </form>
    </div>
</div>

<style>
  .background {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2;
  }
  .login-box {
    position: absolute;
    background-color: green;
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    height: 200px;
    width: 400px;
    color: white;
    background-color: rgb(42, 42, 187);
    border: solid 5px white;
    z-index: 5;
  }

  .container{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
</style>
