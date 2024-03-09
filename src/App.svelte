<!-- App.svelte -->
<script lang='ts'>
  import Board from './lib/Board.svelte';
  import Navbar from './lib/Navbar.svelte';
  const size = 5;
  let visibilityKeyboard = true;
  function isMobile() {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
  }


//console.log(navigator.userAgent);
// if (isMobile()) {
//   visibilityKeyboard = true;
// } else {
//   visibilityKeyboard = false;
// }
</script>

<Navbar/>
<Board dim={size} visibility={true}/>