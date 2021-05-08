import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'

import './styles.scss'

import FormInput from './../Forms/FormInput'
import Button from './../Forms/Button'
import AuthWrapper from './../AuthWrapper'

const SignIn = () => {
	const history = useHistory()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	// useEffect(() => {
	// 	if(currentUser) {
	// 		resetForm()
	// 		history.push('/')
	// 	}
	// }, [currentUser])

	const resetForm = () => {
		setEmail('')
		setPassword('')
	}

	const handleSubmit = e => {
		e.preventDefault()
		// dispatch(emailSignInStart({ email, password }))
	}

	const handleGoogleSignIn = () => {
		// dispatch(googleSignInStart())
	}

	const configAuthWrapper = {
		headline: 'LogIn'
	}

	return (
		<AuthWrapper { ...configAuthWrapper }>

				<div className="formWrap">
					<form onSubmit={handleSubmit}>

						<FormInput
							type="email"
							name="email"
							value={email}
							placeholder="Email"
							handleChange={e => setEmail(e.target.value)}
						/>

						<FormInput
							type="password"
							name="password"
							value={password}
							placeholder="Password"
							handleChange={e => setPassword(e.target.value)}
						/>

						<Button type="submit">
							LogIn
						</Button>

						<div className="socialSignin">
							<div className="row">
								<Button onClick={handleGoogleSignIn}>
									Sign In With Google
								</Button>
							</div>
						</div>

						<div className="links">
							<Link to="/recovery">
								Reset Password
							</Link>
						</div>
					</form>
				</div>
		</AuthWrapper>
	)

}

export default SignIn
