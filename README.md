# Hyphal

## Setup

```
yarn install
```

### ENVVARS

This dApp uses ENVVARS and some of them can't be public as they provide access to services that this organization sponsors for the users of the dApp. The services are firebase, cloud functions, and infura. To run this dApp locally you will need to create your own services, free accounts can be made with the services.

```
export REACT_APP_FIREBASE_API_KEY=
export REACT_APP_FIREBASE_AUTH_DOMAIN=
export REACT_APP_FIREBASE_PROJECT_ID=
export REACT_APP_FIREBASE_STORAGE_BUCKET=
export REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
export REACT_APP_FIREBASE_APP_ID=
export REACT_APP_CLOUD_FUNCTIONS_URL=
export REACT_APP_CHAIN_ID=4
export REACT_APP_IPFS_ENDPOINT=https://ipfs.infura.io:5001
export REACT_APP_DOMAIN_ADDRESS=0xa5676205dBd9ffa11038eB4661f785942E7701D5
export REACT_APP_WETH_ADDRESS=0x83b89e0995c2c96216da14b9f9ae6e6b20c1ae89
export REACT_APP_PROXY_ADDRESS=0x055edBee7C16F04a7629611bDAe662d24dFcd0fE
export REACT_APP_AUCTION_ADDRESS=0x3D8568Dd1077eb3d3D6A4dB31Fe3a76183C2bCC5
export REACT_APP_INFURA_NETWORK=rinkeby
export REACT_APP_INFURA_ID=
export REACT_APP_INFURA_SECRET=
export REACT_APP_USUL_MASTERCOPY_ADDRESS=0x0bcE608Dce5B99aA7Cd89de09447A33b347aa294
export REACT_APP_MODULE_FACTORY_ADDRESS=0xb113d1D1bB1bF3B51418B1de9D29b1aaA7Df1007
export REACT_APP_OZ_LINEAR_MASTER_ADDRESS=0xc0F14564aA2c295333e45bB33788F43A8A84739c
export REACT_APP_MULTI_SEND_ADDRESS=0x2890dd2Cf1E4881b630bd680E50439b9DE00AC02
```

```
yarn start
```

## Contributing 

This dApp is free and open software. Contributions are welcome and appreciated! Please follow the [community guide](https://github.com/HyphalDAO/community) when creating pull requests. 
