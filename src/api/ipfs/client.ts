import {create} from "ipfs-http-client"
import config from "../../config"

const client = create({url: config.IPFS_ENDPOINT})

export default client
