import {firebaseConfig} from "./config"
import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/auth"

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export const firestore = firebase.firestore()
