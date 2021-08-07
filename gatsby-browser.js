import firebase from "firebase/app"

import "./src/style/global.scss"

const firebaseConfig = {
  apiKey: "AIzaSyCFZUQKZrvwbH8txu96lyZf5HIwo8TDZgc",
  authDomain: "attestation-covid-19-79574.firebaseapp.com",
  databaseURL: "https://attestation-covid-19-79574.firebaseio.com",
  projectId: "attestation-covid-19-79574",
  storageBucket: "attestation-covid-19-79574.appspot.com",
  messagingSenderId: "737208548571",
  appId: "1:737208548571:web:adec48d0dd09e263fd20fe",
}

firebase.initializeApp(firebaseConfig)
