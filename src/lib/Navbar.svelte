<script lang="ts">
  import Login from './Login.svelte';
  import Register from './Register.svelte';
  let isLogin = false;
  let isRegister = false;

  function loginBtn(){
    isLogin = true;
  }

  function registerBtn(){
    isRegister = true;
  }

  function close(){
    isLogin = false;
    isRegister = false;
  }
</script>

<div class="navbar">
    <div class="navbar-left">
      <button on:click={loginBtn}>Login</button>
      <button on:click={registerBtn}>Register</button>
      <button>Bottone 3</button>
    </div>
    <h1>MultiWordle</h1>
    <div class="navbar-right">
      <button>Bottone 1</button>
      <button>Bottone 2</button>
      <button>Bottone 3</button>
    </div>
  </div>

  {#if isLogin}
  <Login on:closeIt={close}/>
  {/if}

  {#if isRegister}
  <Register on:closeIt={close}/>
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
  

</style>