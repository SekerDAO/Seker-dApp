import firebase from "firebase"
import {StrictMode} from "react"
import ReactDOM from "react-dom"
import App from "./App"
import config from "./config"

// import reportWebVitals from './reportWebVitals';

declare global {
	interface Window {
		/* eslint-disable @typescript-eslint/no-explicit-any */
		ethereum: any
		BinanceChain: any
		/* eslint-enable @typescript-eslint/no-explicit-any */
	}
}

firebase.initializeApp({
	apiKey: config.firebase.FIREBASE_API_KEY,
	authDomain: config.firebase.FIREBASE_AUTH_DOMAIN,
	projectId: config.firebase.FIREBASE_PROJECT_ID,
	storageBucket: config.firebase.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: config.firebase.FIREBASE_MESSAGING_SENDER_ID,
	appId: config.firebase.FIREBASE_APP_ID
})

ReactDOM.render(
	<StrictMode>
		<App />
	</StrictMode>,
	document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
