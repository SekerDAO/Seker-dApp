import mainnetLogo from "../assets/icons/SekerDAO_Networks_Ethereum.svg"
import gnosisLogo from "../assets/icons/SekerDAO_Networks_GnosisChain.svg"
import kovanLogo from "../assets/icons/SekerDAO_Networks_KovanTestnet.svg"
import kovanLogoSmall from "../assets/icons/SekerDAO_Networks_KovanTestnet_StatusIcon.svg"
import sokolLogo from "../assets/icons/SekerDAO_Networks_SokolTestnet.svg"
import sokolLogoSmall from "../assets/icons/SekerDAO_Networks_SokolTestnet_StatusIcon.svg"

const networks: Record<number, string> = {
	1: "mainnet",
	4: "rinkeby",
	42: "kovan",
	77: "sokol",
	100: "dai"
}

export const NETWORK_LOGOS: Record<string, string> = {
	mainnet: mainnetLogo,
	kovan: kovanLogo,
	sokol: sokolLogo,
	dai: gnosisLogo
}

// TODO: add mainnet, dai
export const NETWORK_LOGOS_SMALL: Record<string, string> = {
	kovan: kovanLogoSmall,
	sokol: sokolLogoSmall
}

export default networks
