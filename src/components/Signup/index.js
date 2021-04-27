import React, { Component } from 'react'
import './styles.scss'

import { auth, handleUserProfile } from './../../firebase/utils'

import FormInput from './../Forms/FormInput'
import Button from './../Forms/Button'
import AuthWrapper from './../AuthWrapper'

const intialState = {
	displayName: '',
	email: '',
	password: '',
	confirmPassword: '',
	errors: []
}

class Signup extends Component {
	constructor(props) {
		super(props)
		this.state = {
			...intialState
		}

		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(e) {
		const { name, value } = e.target
		this.setState({
			[name]: value
		})
	}

	handleFormSubmit = async event => {
		event.preventDefault()
		const {displayName, email, password, confirmPassword, errors } = this.state

		if(password !== confirmPassword) {
			const err = ['Passwords Don\'t Match']
			this.setState({
				errors: err
			})
			return
		}

		try {
			const { user } = await auth.createUserWithEmailAndPassword(email, password)
			await handleUserProfile(user, { displayName })
			this.setState({
				...intialState
			})
		} catch(err) {
			console.log(err)
		}
	}

	render() {
		const { displayName, email, password, confirmPassword, errors } = this.state
		const configAuthWrapper = {
			headline: 'Registration'
		}

		return (
			<AuthWrapper { ...configAuthWrapper }>

					<div className="formWrap">
						{errors.length > 0 && (
							<ul>
								{errors.map((err, index) => {
									return (
										<li key={index}>
											{err}
										</li>
									)
								})}
							</ul>
						)}
						<form onSubmit={this.handleFormSubmit}>

							<FormInput 
								type="text"
								name="displayName"
								value={displayName}
								placeholder="Full Name"
								onChange={this.handleChange}
							/>

							<FormInput 
								type="email"
								name="email"
								value={email}
								placeholder="Email"
								onChange={this.handleChange}
							/>

							<FormInput 
								type="password"
								name="password"
								value={password}
								placeholder="Password"
								onChange={this.handleChange}
							/>

							<FormInput 
								type="password"
								name="confirmPassword"
								value={confirmPassword}
								placeholder="Confirm Password"
								onChange={this.handleChange}
							/>

							<Button type="submit">
								Register
							</Button>

						</form>
					</div>
			</AuthWrapper>
		)
	}
}

export default Signup