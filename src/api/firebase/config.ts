import config from "../../config"

const {firebase} = config

export const firebaseConfig = {
	apiKey: firebase.FIREBASE_API_KEY,
	authDomain: firebase.FIREBASE_AUTH_DOMAIN,
	projectId: firebase.FIREBASE_PROJECT_ID,
	storageBucket: firebase.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: firebase.FIREBASE_MESSAGING_SENDER_ID,
	appId: firebase.FIREBASE_APP_ID
}
