import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyC3nhF1d-gg6YhhFfNQ50IvMR5tUfXZBqo",
  authDomain: "instaink-cc703.firebaseapp.com",
  databaseURL: "https://instaink-cc703.firebaseio.com",
  projectId: "instaink-cc703",
  storageBucket: "instaink-cc703.appspot.com",
  messagingSenderId: "1091950742435",
  appId: "1:1091950742435:web:89d0fd9b3b8bde5ae1e816"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };

