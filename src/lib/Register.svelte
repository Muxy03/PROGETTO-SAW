<script>
  import { createEventDispatcher } from "svelte";
  import { fly } from "svelte/transition";
  import { register } from "../../public/utils";
  import App from "../App.svelte";

  const dispatch = createEventDispatcher();
  let email = "";
  let password = "";
  let username = "";

  function close() {
    register(email,password,username);
    dispatch("closeIt");
  }
</script>

<div class="background"/>
<div class="container" transition:fly={{ y: -500 }}>
  <form action="">
    <label for="email">Email:<input bind:value={email} type="text" /></label><br />
    <label for="pasword">Password:<input bind:value={password} type="password" /></label><br />
    <label for="username">Username:<input bind:value={username} type="text" /></label><br />
    <button on:click={close}>Register</button>
    <button on:click={close}>Close</button>
  </form>
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

  form {
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
