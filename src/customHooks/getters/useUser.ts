import {useEffect, useState} from "react"
import {User} from "../../types/user"
import getUser from "../../api/firebase/user/getUser"

const useUser = (
	account: string
): {
	user: User | null
	loading: boolean
	error: boolean
} => {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)

	const getInfo = async (_account: string) => {
		setLoading(true)
		setError(false)
		try {
			const _user = await getUser(_account)
			setUser(_user)
		} catch (e) {
			console.error(e)
			setError(true)
		}
		setLoading(false)
	}

	useEffect(() => {
		getInfo(account)
	}, [account])

	return {
		user,
		loading,
		error
	}
}

export default useUser
