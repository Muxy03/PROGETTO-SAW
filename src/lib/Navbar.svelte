<script lang="ts">
  import Login from './Login.svelte';
  import Register from './Register.svelte';
  import Account from './Account.svelte';
  import { createGame } from "../assets/utils";

  let activeRegister = false;
  let activeLogin = false;
  let activeAccount = false;
  let isRegistered = false;
  let isLogged = false;

  function loginBtn(){
    activeLogin = true;
  }

  function registerBtn(){
    activeRegister = true;
  }

 function AccountBtn(){
    activeAccount = true;
  }

  function close(){
    activeAccount = false;
    activeRegister = false;
    activeLogin = false;
  }

</script>

<div class="navbar">
    <div class="navbar-left">
      <!-- TODO: Login/Register un solo bottone -->
      <button  on:click={loginBtn}>Login</button>
      <button on:click={registerBtn}>Register</button>
      <button on:click={createGame}>VS</button>
    </div>
    <h1>MultiWordle</h1>
    <div class="navbar-right">
      <button on:click={AccountBtn}>Account</button>
      <button>Btn2</button>
    </div>
  </div>

  {#if activeLogin}
  <Login on:closeIt={close}/>
  {/if}

  {#if activeRegister}
  <Register on:closeIt={close}/>
  {/if}

  {#if activeAccount}
  <Account on:loginIt={loginBtn} on:closeIt={close}/>
  {/if}

<style type="text/css">
	
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #333;
      color: white;
      width: 100vw;
    }
  
    .navbar-left {
      display: flex;
      align-items: center;
    }
  
    .navbar-right {
      display: flex;
      align-items: center;
    }

	.navbar-left>button,.navbar-right>button{
		margin-right:10px;
	}

  button{
    padding: 2px 6px;
    font-weight: bolder;
    border: none;
    font-size:20px;
    background-color: transparent;
    cursor:pointer;
  }
  

</style>