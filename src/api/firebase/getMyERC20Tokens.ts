import firebase from "firebase"
import {ERC20Token} from "../../types/ERC20Token"

const getMyERC20Tokens = async (account: string): Promise<firebase.firestore.QuerySnapshot<ERC20Token>> =>
	firebase.firestore().collection("ERC20Tokens").where("owner", "==", account).get() as Promise<
		firebase.firestore.QuerySnapshot<ERC20Token>
	>

export default getMyERC20Tokens
