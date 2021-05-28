import {create} from "ipfs-http-client"
const {REACT_APP_IPFS_ENDPOINT} = process.env

const client = create({url: REACT_APP_IPFS_ENDPOINT})

export default client
