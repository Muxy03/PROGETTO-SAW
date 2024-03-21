<script lang="ts">
  import { createEventDispatcher,onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { getUserInfo } from '../assets/utils';
  const dispatch = createEventDispatcher();
  let utente: User | null = {
  player_id: "abc123",
  email: "coolgamer@example.com",
  username: "CoolGamer97",
  password: "securepassword123",
  friend_list: [
  {
      player_id: "ghi789",
      email: "challenger@example.com",
      username: "ChallengerPro",
      password: "challengerpassword",
      friend_list: [],
      friend_list_queue: [],
      statics: {
        total_win: 22,
        1: 6,
        2: 5,
        3: 4,
        4: 5,
        5: 2
      }
    },
    {
      player_id: "ghi789",
      email: "challenger@example.com",
      username: "ChallengerPro",
      password: "challengerpassword",
      friend_list: [],
      friend_list_queue: [],
      statics: {
        total_win: 22,
        1: 6,
        2: 5,
        3: 4,
        4: 5,
        5: 2
      }
    },{
      player_id: "ghi789",
      email: "challenger@example.com",
      username: "ChallengerPro",
      password: "challengerpassword",
      friend_list: [],
      friend_list_queue: [],
      statics: {
        total_win: 22,
        1: 6,
        2: 5,
        3: 4,
        4: 5,
        5: 2
      }
    },
    {
      player_id: "ghi789",
      email: "challenger@example.com",
      username: "ChallengerPro",
      password: "challengerpassword",
      friend_list: [],
      friend_list_queue: [],
      statics: {
        total_win: 22,
        1: 6,
        2: 5,
        3: 4,
        4: 5,
        5: 2
      }
    }
    ],
  friend_list_queue:[
    {
      player_id: "ghi789",
      email: "challenger@example.com",
      username: "ChallengerPro",
      password: "challengerpassword",
      friend_list: [],
      friend_list_queue: [],
      statics: {
        total_win: 22,
        1: 6,
        2: 5,
        3: 4,
        4: 5,
        5: 2
      }
    },
    {
      player_id: "ghi789",
      email: "challenger@example.com",
      username: "ChallengerPro",
      password: "challengerpassword",
      friend_list: [],
      friend_list_queue: [],
      statics: {
        total_win: 22,
        1: 6,
        2: 5,
        3: 4,
        4: 5,
        5: 2
      }
    },{
      player_id: "ghi789",
      email: "challenger@example.com",
      username: "ChallengerPro",
      password: "challengerpassword",
      friend_list: [],
      friend_list_queue: [],
      statics: {
        total_win: 22,
        1: 6,
        2: 5,
        3: 4,
        4: 5,
        5: 2
      }
    },
    {
      player_id: "ghi789",
      email: "challenger@example.com",
      username: "ChallengerPro",
      password: "challengerpassword",
      friend_list: [],
      friend_list_queue: [],
      statics: {
        total_win: 22,
        1: 6,
        2: 5,
        3: 4,
        4: 5,
        5: 2
      }
    }
    ],
  statics: {
    total_win: 50,
    1: 10,
    2: 12,
    3: 8,
    4: 15,
    5: 5
  }
};

//utente = null;

  function Login(){
    dispatch("closeIt");
    dispatch("loginIt");
  }

  function close() {
    dispatch("closeIt");
  }
  
  onMount(async()=>{
    // const res = await getUserInfo();
    // utente = await res;
  })

</script>

<div class="background"/>
<div class="container" transition:fly={{ y: -500 }}>
  <div class="form">
  {#if utente == null}
    <div class="container-btn" style="height: 100%; flex-direction: column;">
      <h1 style="margin-bottom: 40px;">User no Logged in</h1>
      <div>  
      <button style="font-size: 35px; padding:10px 20px;" id="loginBtn"on:click={Login}>Login</button>
      <button style="font-size: 35px;padding:10px 20px;" id="closeBtn"on:click={close}>Close</button>
      </div>
    </div>
  {:else}
    <h1>User Account</h1>
  <div class="user-details">
    {#each Object.entries(utente) as [title, value]}
        {#if title === "statics"}
          <h2>Statics</h2>
          <div class="stats">
            {#each Object.entries(value) as [n, v]}
              <label style="margin-right: 10px;">{n}: <span>{v}</span></label>
            {/each}
          </div>
        {:else if title === "friend_list" || title === "friend_list_queue"}
          {#if value.length === 0}
            <div class="detail">
              <label>{title.replaceAll("_"," ")}:</label>
              <span>Vuota</span>
            </div>
            {:else}
               <h2>{title.replaceAll("_"," ")}</h2>
              <div class="friend-list">
                <ul>  
                  {#each value as Friend}
                    <li>
                      {#if title === "Friend_List_Queue"}
                        <span>{Friend.username}</span>
                        <button>Accetta</button>
                        <button>Rifiuta</button>
                      {:else}
                        <label>{Friend.username}:</label>
                        <span>{Friend.statics.total_win}</span>
                      {/if}
                    </li>
                  {/each}
                </ul>
              </div>
          {/if}
        {:else}
          <div class="detail">
            <label>{title}: </label>
            <span>{value}</span>
          </div>
        {/if}
    {/each}
  </div>
    <div class="container-btn">
      <button id="closeBtnLogged"on:click={close}>X</button>
    </div>
    {/if}
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
    height: 600px;
    width: 400px;
  }

  .container-btn{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .form {
    width: 400px;
    height: 600px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
  }

  h1,h2,p {
    color: #333;
    width:100%;
    text-align: center;
  }

  .user-details {
    margin-top: 20px;
  }

  .detail {
    margin-bottom: 10px;
  }

  .stats{
    margin-bottom: 10px;
    text-align: center;
  }

  label {
    font-weight: bold;
  }

  span{
    font-weight: unset;
  }

  .friend-list {
    max-height: 100px;
    overflow-y: auto;
  }

  .friend-list ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .friend-list li {
    padding: 10px;
    border-bottom: 1px solid #eee;
  }

  .friend-list li:last-child {
    border-bottom: none;
  }
  #loginBtn,#closeBtn {
  --c:  #5a5a5a; /* the color*/
  
  box-shadow: 0 0 0 .1em inset var(--c); 
  --_g: linear-gradient(var(--c) 0 0) no-repeat;
  background: 
    var(--_g) calc(var(--_p,0%) - 100%) 0%,
    var(--_g) calc(200% - var(--_p,0%)) 0%,
    var(--_g) calc(var(--_p,0%) - 100%) 100%,
    var(--_g) calc(200% - var(--_p,0%)) 100%;
  background-size: 50.5% calc(var(--_p,0%)/2 + .5%);
  outline-offset: .1em;
  transition: background-size .4s, background-position 0s .4s;
}
#loginBtn:hover,#closeBtn:hover{
  --_p: 100%;
  transition: background-position .4s, background-size 0s;
}
#loginBtn:active,#closeBtn:active{
  box-shadow: 0 0 9e9q inset #0009; 
  background-color: var(--c);
  color: #fff;
}

#loginBtn,#closeBtn,#closeBtnLogged {
  cursor: pointer;
  font-weight: bold;  
  border: none;
  font-size: 18px;
  padding: 2px 6px;
}

#closeBtnLogged {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  font-size: 20px;
}

</style>
