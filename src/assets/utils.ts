import { initializeApp } from 'firebase/app';
 import { getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore,doc,setDoc,query,where,collection,getDocs } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const firebaseConfig = {
  apiKey: "AIzaSyA-oGenRgdhTgZfbaz4vunUE634t_y7QAo",
  authDomain: "multiwordle-dc6db.firebaseapp.com",
  projectId: "multiwordle-dc6db",
  storageBucket: "multiwordle-dc6db.appspot.com",
  messagingSenderId: "935958063235",
  appId: "1:935958063235:web:32b17ddb7407e326bc93b6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

interface Statics {
  total_win: number;
  1: number; // Numero di vittorie ottenute facendo 1 tentativo
  2: number; // Analogamente al precedente
  3: number; // Analogamente al precedente
  4: number; // Analogamente al precedente
  5: number; // Analogamente al precedente
}

// Interfaccia per un giocatore
interface User {
  player_id: string;
  email: string;
  username: string;
  password: string;
  friend_list: User[];
  friend_list_queue: User[];
  statics: Statics;
}

// Enum per lo stato di un gioco
enum GameState {
  Waiting = "attesa",
  Ready = "pronto",
  InGame = "inGame",
  Finished = "finito"
}

// Interfaccia per lo stato di un giocatore in un gioco
interface Player{
  player_id: string;
  attempts: number; // Numero di tentativi durante la partita
}

// Interfaccia per un gioco
interface Game {
  players: Player[];
  game_state: GameState;
  winner:Player|null;
}

// Funzione per registrare un nuovo utente
export async function register(email: string, password: string, username: string): Promise<void> {
  // Crea l'utente con email e password
  const uid = uuidv4();
  const userCredential = createUserWithEmailAndPassword(auth, email, password);
  const currentUser = {
    player_id: uid,
    username: username,
    email: email,
    password: password,
    friend_list: [],
    friend_list_queue: [],
    statics: {
      total_win: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    }
  }

await setDoc(doc(db, "users", currentUser.player_id), currentUser);
}

export async function login(password: string, username: string): Promise<void>{
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username), where("password", "==", password));
  const querySnapshot = await getDocs(q);
  const user = querySnapshot.docs[0].data() as User;

  signInWithEmailAndPassword(auth, user.email, password)
  .then((userCredential) => {
    alert(`Bentornato ${user.username}`);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorMessage,errorCode);
  });
} 

// Funzione per creare un nuovo gioco
async function createGame(): Promise<void> {
  try {
    // Aggiungi il giocatore corrente alla waiting_queue

    const currentGame:Game = {
      players: [],
      game_state: GameState.Waiting,
      players_state: [],
      winner:null
    }

    const currentUser = auth.currentUser;
    
    if (currentUser) {
      const userDoc = await firebase.firestore().collection("players").doc(currentUser.uid).get();
      const userData = userDoc.data() as Player;
      await firebase.firestore().collection("waiting_queue").doc(currentUser.uid).set(userData);
      console.log("Player added to waiting queue");
    } else {
      console.log("User not logged in");
      return;
    }

    // Attendi finché non ci sono almeno 4 giocatori nella waiting_queue
    while (true) {
      const waitingQueueSnapshot = await firebase.firestore().collection("waiting_queue").get();
      const queue = waitingQueueSnapshot.docs;
      const playersCount = waitingQueueSnapshot.size;

      if (playersCount >= 4) {

        const players: Player[] = [];
        for(let i=0;i<3;++i){
          players.push(queue[i].data() as Player)
        }

        // Crea un nuovo oggetto game con i giocatori e lo stato del gioco
        const gameId = firebase.firestore().collection("game").doc().id;

        // aggiorno informazioni currentGame
        currentGame.players = players;
        currentGame.game_state = GameState.Ready;
        currentGame.players_state = players.map(player => ({ player_id: player.player_id, attempts: 0 }));
        
        await firebase.firestore().collection("game").doc(gameId).set(currentGame);

        console.log("Game created successfully!");

        // Rimuovi i giocatori dalla waiting_queue dopo aver creato il gioco
        for(let i=0;i<3;++i){
          queue[i].ref.delete();
        }
        console.log("Players removed from waiting queue");
        break;
      }

      console.log("Waiting for more players to join...");
      await new Promise(resolve => setTimeout(resolve, 5000)); // Attendi 5 secondi prima di controllare di nuovo
    }
  } catch (error) {
    console.error("Error creating game:", error);
  }
}

// Funzione per avviare il gioco
async function startGame(gameId: string): Promise<void> {
  try {
    const gameRef = firebase.firestore().collection("game").doc(gameId);

    await gameRef.update({
      game_state: GameState.InGame
    });

    console.log("Game started");

  } catch (error) {
    console.error("Error starting game:", error);
  }
}

async function endGame(gameId: string, winnerPlayerId:string): Promise<void> {

  try {
    const gameRef = firebase.firestore().collection("game").doc(gameId);
    await gameRef.update({
      game_state: GameState.Finished,
      winner_player_id: winnerPlayerId
    });
    console.log("Game finished, winner:", winnerPlayerId);
  } catch (error) {
    console.error("Error starting game:", error);
  }

}