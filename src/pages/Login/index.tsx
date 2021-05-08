import React, {FormEvent, FunctionComponent, useState} from "react"
import {Link} from "react-router-dom"
import FormInput from "../../components/Forms/FormInput"
import Button from "../../components/Forms/Button"
import AuthWrapper from "../../components/AuthWrapper"
import "./styles.scss"

const Login: FunctionComponent = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	// useEffect(() => {
	// 	if(currentUser) {
	// 		resetForm()
	// 		history.push('/')
	// 	}
	// }, [currentUser])

	const resetForm = () => {
		setEmail("")
		setPassword("")
	}

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()
		// dispatch(emailSignInStart({ email, password }))
	}

	const handleGoogleSignIn = () => {
		// dispatch(googleSignInStart())
	}

	const configAuthWrapper = {
		headline: "LogIn"
	}

	return (
		<AuthWrapper {...configAuthWrapper}>
			<div className="formWrap">
				<form onSubmit={handleSubmit}>
					<FormInput
						type="email"
						name="email"
						value={email}
						placeholder="Email"
						onChange={e => setEmail(e.target.value)}
					/>

					<FormInput
						type="password"
						name="password"
						value={password}
						placeholder="Password"
						onChange={e => setPassword(e.target.value)}
					/>

					<Button type="submit">LogIn</Button>

					<div className="socialSignin">
						<div className="row">
							<Button onClick={handleGoogleSignIn}>Sign In With Google</Button>
						</div>
					</div>

					<div className="links">
						<Link to="/recovery">Reset Password</Link>
					</div>
				</form>
			</div>
		</AuthWrapper>
	)
}

export default Login
