# WCT smart-contract

0) configure .env file using .env.sample file
1) compile smart-contract: npx hardhat compile
2) deploy smart-contract: npx hardhat deploy
   2.1 add smart contract address to .env file
3) set base token url: npx hardhat set-base-token-uri --base-url {baseToken}
4) verify smart-contract: npx hardhat verify {NFT_CONTRACT_ADDRESS}
5) mint tokens: npx hardhat mint --count-per-transaction {contPerTx} --total-count {totalCount}
6) list first token from Opensea website manually
7) List other tokens using js command from index to index (for example: from 10 to 200):
   npx hardhat sell-tokens-from-to --index-from {index-from} --index-to {indexTo}