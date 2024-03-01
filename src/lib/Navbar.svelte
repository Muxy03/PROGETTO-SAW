<div class="navbar">
    <div class="navbar-left">
      <button>Bottone 1</button>
      <button>Bottone 2</button>
      <button>Bottone 3</button>
    </div>
    <h1>Titolo</h1>
    <div class="navbar-right">
      <button>Bottone 1</button>
      <button>Bottone 2</button>
      <button>Bottone 3</button>
    </div>
  </div>

<style type="text/css">
	
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #333;
      color: white;
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