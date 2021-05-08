import React, {FormEvent, FunctionComponent, useState} from "react"
import AuthWrapper from "../../components/AuthWrapper"
import FormInput from "../../components/Forms/FormInput"
import Button from "../../components/Forms/Button"
import "./styles.scss"

const Recovery: FunctionComponent = () => {
	const [email, setEmail] = useState("")
	const [errors, setErrors] = useState([])

	// useEffect(() => {
	// 	if(resetPasswordSuccess) {
	// 		dispatch(resetUserState())
	// 		history.push('/login')
	// 	}
	//
	// }, [resetPasswordSuccess])

	// useEffect(() => {
	// 	if(Array.isArray(userErr) && userErr.length > 0) {
	// 		setErrors(userErr)
	// 	}
	//
	// }, [userErr])

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()
		// dispatch(resetPasswordStart({ email }))
	}

	const configAuthWrapper = {
		headline: "Email Password"
	}

	return (
		<AuthWrapper {...configAuthWrapper}>
			<div className="formWrap">
				{errors.length > 0 && (
					<ul>
						{errors.map((e, index) => {
							return <li key={index}>{e}</li>
						})}
					</ul>
				)}

				<form onSubmit={handleSubmit}>
					<FormInput
						type="email"
						name="email"
						value={email}
						placeholder="Email"
						onChange={e => setEmail(e.target.value)}
					/>
					<Button type="submit">Email Password</Button>
				</form>
			</div>
		</AuthWrapper>
	)
}

export default Recovery
