var config = {
    apiKey: "AIzaSyCMkp5114rJyeCk4UqRCetT-oygM5vVsE0",
    authDomain: "postcard-76127.firebaseapp.com",
    databaseURL: "https://postcard-76127.firebaseio.com",
    projectId: "postcard-76127",
    storageBucket: "postcard-76127.appspot.com",
    messagingSenderId: "144116742367"
  };
firebase.initializeApp(config);

export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
export const dbRef = firebase.database().ref('/')
export default firebase;