import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, query, where, collection, getDocs, addDoc, deleteDoc, updateDoc,orderBy,limit } from 'firebase/firestore';

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

const max_attempts_waiting = 1000;

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

enum Languages {
  it = "italiano",
  en = "inglese"
}

// Interfaccia per lo stato di un giocatore in un gioco
interface Player {
  player_id: string;
  attempts: number; // Numero di tentativi durante la partita
}

// Interfaccia per un gioco
interface Game {
  players: Player[];
  game_state: GameState;
  winner: Player | null;
  word: string | null;
}

// Funzione per registrare un nuovo utente
export async function register(email: string, password: string, username: string): Promise<void> {
  // Crea l'utente con email e password
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const currentUser = {
    player_id: userCredential.user.uid,
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

export async function login(password: string, username: string): Promise<void> {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username), where("password", "==", password));
  const querySnapshot = await getDocs(q);
  if (querySnapshot) {
    const user = querySnapshot.docs[0].data() as User;
    signInWithEmailAndPassword(auth, user.email, user.password)
      .then((userCredential) => {
        console.log(`Bentornato ${user.username}`);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage, errorCode);
      });
  } else {
    console.log("User not found!");
  }
}

// Funzione per creare un nuovo gioco
export async function createGame(lang:string=Languages.it): Promise<void> {
  try {

    const word = getWord(lang);
    
    if(word === ""){
      throw new Error("ERRORE OTTENIMENTO PAROLA DA ASSOCIARE AL GAME!");
    }

    const currentGame: Game = {
      players: [],
      game_state: GameState.Waiting,
      winner: null,
      word: null
    }

    let attempts_waiting = 0;

    const gameRef = await addDoc(collection(db, 'games'), currentGame);

    console.log("Game created successfully!");

    const user = auth.currentUser;
    if (user) {
      const currentPlayer: Player = {
        player_id: user.uid,
        attempts: 0
      }
      await setDoc(doc(db, "waiting_queue", user.uid), currentPlayer)
      console.log("Player added to waiting queue");
    } else {
      console.log("User not logged in");
    }

    const waitingQueueSnapshot = await getDocs(collection(db, "waiting_queue"));
    const queue = waitingQueueSnapshot.docs;
    const playersCount = waitingQueueSnapshot.size

    while (playersCount < 4 && attempts_waiting < max_attempts_waiting) {
      console.log("waiting players to join");
      attempts_waiting++;
    }

    if (attempts_waiting == max_attempts_waiting) {
      console.log("Non c'è nessuno, riprova + tardi");
      deleteDoc(gameRef);
      let i=0;
      while((queue[i].data() as Player).player_id !==  currentPlayer.player_id){
        ++i;
      }
      await deleteDoc(queue[i].ref);

    } else if (playersCount >= 4) {
      
      const players: Player[] = [];
      for (let i = 0; i < 4; ++i) {
        players.push(queue[i].data() as Player)
      }

      await updateDoc(gameRef, {
        players: players,
        game_state: GameState.Ready,
        word: word
      });

      console.log("Game Ready to play");

      //Rimuovi i giocatori dalla waiting_queue dopo aver creato il gioco
      for (let i = 0; i < 4; ++i) {
        await deleteDoc(queue[i].ref)
      }
      console.log("Players removed from waiting queue");
    }

  } catch (error) {
    console.error("Error creating game:", error);
  }
}


async function getWord(lang:string):string {
  const response = await fetch(`https://random-word-api.herokuapp.com/word/?length=5&lang=${lang}`);
  const word = await response.json();
  return word[0];
}


// Funzione per avviare il gioco
async function updateGame(gameId: string): Promise<void> {
  try {
    const gameRef = doc(db, "games", gameId);

    await updateDoc(gameRef, {
      game_state: GameState.InGame
    });

    console.log("Game started");



  } catch (error) {
    console.error("Error starting game:", error);
  }
}

async function endGame(gameId: string, winnerPlayerId: string): Promise<void> {

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