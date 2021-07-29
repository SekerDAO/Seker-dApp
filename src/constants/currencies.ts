import {AddressZero} from "@ethersproject/constants"

// TODO make the actual list of currencies
const currencies = [
	{
		symbol: "ETH",
		address: AddressZero
	},
	{
		symbol: "DAI",
		address: "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea"
	},
	{
		symbol: "USDC",
		address: "0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b"
	},
	{
		symbol: "BAT",
		address: "0xbF7A7169562078c96f0eC1A8aFD6aE50f12e5A99"
	}
] as const

export default currencies
