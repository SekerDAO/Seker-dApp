import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import firebase from "firebase"
import {firebaseConfig} from "./firebase/config"
// import reportWebVitals from './reportWebVitals';

// TODO
declare global {
	interface Window {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		ethereum: any
	}
}

firebase.initializeApp(firebaseConfig)

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
