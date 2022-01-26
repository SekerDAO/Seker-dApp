import config from "../../config"
import networks from "../../constants/networks"

const fetchContractAbi = async (address: string): Promise<string> => {
	const res = await fetch(
		`https://api${
			config.CHAIN_ID === 1 ? "" : `-${networks[config.CHAIN_ID]}`
		}.etherscan.io/api?module=contract&action=getabi&address=${address}`
	)
	const contentType = res.headers.get("content-type")
	if (contentType?.indexOf("application/json") === -1) {
		throw new Error(`Bad response from etherscan API with status ${res.status}`)
	}
	const data = await res.json()
	if (!data.result) {
		throw new Error(`No result in etherscan response`)
	}
	if (!data.result.startsWith("[")) {
		throw new Error(`Bad result in etherscan response: ${data.result}`)
	}
	return data.result.replace(/\//g, "")
}

export default fetchContractAbi
