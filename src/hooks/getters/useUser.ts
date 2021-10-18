import {useEffect, useState} from "react"
import {UserWithAccount} from "../../types/user"
import getUser from "../../api/firebase/user/getUser"

const useUser = (
	account: string
): {
	user: UserWithAccount | null
	loading: boolean
	error: boolean
	refetch: () => void
} => {
	const [user, setUser] = useState<UserWithAccount | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)

	const getInfo = async () => {
		setLoading(true)
		setError(false)
		try {
			const _user = await getUser(account)
			setUser(_user)
		} catch (e) {
			console.error(e)
			setError(true)
		}
		setLoading(false)
	}

	useEffect(() => {
		getInfo()
	}, [account])

	return {
		user,
		loading,
		error,
		refetch: getInfo
	}
}

export default useUser
