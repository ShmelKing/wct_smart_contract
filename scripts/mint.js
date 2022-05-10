const {task} = require("hardhat/config");
const {getContract, getEnvVariable} = require("./helpers");
const fetch = require("node-fetch");

task("mint", "Mints from the WCT contract")
    .addParam("countPerTransaction", "Count of tokens to mint per transaction")
    .addParam("totalCount", "Total count of tokens to mint")
    .setAction(async function (taskArguments, hre) {
        if (taskArguments.totalCount % taskArguments.countPerTransaction !== 0) {
            throw "Please observe the condition: totalCount % countPerTransaction===0";
        }
        const countOfTransactions = taskArguments.totalCount / taskArguments.countPerTransaction;
        const contract = await getContract("WCT", hre);
        for (let i = 0; i < countOfTransactions; i++) {
            const transactionResponse = await contract.mintTo(
                getEnvVariable("OWNER_ADDRESS"),
                taskArguments.countPerTransaction,
                {gasLimit: 10_000_000}
            );
            console.log(`Transaction Hash: ${transactionResponse.hash}`);
        }

    });

task("set-base-token-uri", "Sets the base token URI for the deployed smart contract")
    .addParam("baseUrl", "The base of the tokenURI endpoint to set")
    .setAction(async function (taskArguments, hre) {
        const contract = await getContract("WCT", hre);
        const transactionResponse = await contract.setBaseTokenURI(taskArguments.baseUrl, {
            gasLimit: 500_000,
        });
        console.log(`Transaction Hash: ${transactionResponse.hash}`);
    });


task("token-uri", "Fetches the token metadata for the given token ID")
    .addParam("tokenId", "The tokenID to fetch metadata for")
    .setAction(async function (taskArguments, hre) {
        const contract = await getContract("WCT", hre);
        const metadata_url = await contract.tokenURI(taskArguments.tokenId, {
            gasLimit: 2_500_000,
        });
        console.log(`Metadata URL: ${metadata_url}`);

        const metadata = await fetch(metadata_url).then(res => res.json());
        console.log(`Metadata fetch response: ${JSON.stringify(metadata, null, 2)}`);
    });

task("get-owner-address", "Fetches the token metadata for the given token ID")
    .setAction(async function (taskArguments, hre) {
        console.log(`Owner address: ${getEnvVariable("OWNER_ADDRESS")}`);

    });
