<script>
  import { createEventDispatcher } from "svelte";
  import { fly } from "svelte/transition";
  import { login } from "../assets/utils";

  const dispatch = createEventDispatcher();
  let password = "";
  let username = "";

  function close() {
    login(password,username);
    dispatch("closeIt");
  }
</script>

<div class="background"/>
<div class="container" transition:fly={{ y: -500 }}>
  <div class="form">
    <label>Username:<input bind:value={username} type="text" /></label><br />
    <label>Password:<input bind:value={password} type="password" /></label><br />
    <button on:click={close}>Login</button>
    <button on:click={close}>Close</button>
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

  .container {
    position: absolute;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    color: white;
    z-index: 5;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .form {
    width: 300px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
  }

  label,
  input {
    display: block;
    margin-bottom: 10px;
  }

  input[type="text"],
  input[type="password"] {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
  }
</style>