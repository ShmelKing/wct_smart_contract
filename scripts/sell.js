const {task} = require("hardhat/config");
require('dotenv').config();

const opensea = require("opensea-js");
const OpenSeaPort = opensea.OpenSeaPort;
const Network = opensea.Network;
const MnemonicWalletSubprovider = require("@0x/subproviders").MnemonicWalletSubprovider;
const RPCSubprovider = require("web3-provider-engine/subproviders/rpc");
const Web3ProviderEngine = require("web3-provider-engine");

const MNEMONIC = process.env.MNEMONIC;
const ALCHEMY_KEY = process.env.ALCHEMY_KEY;
const FACTORY_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NETWORK = process.env.NETWORK;
const API_KEY = process.env.OPENSEA_API_KEY || "";
const FIXED_PRICE = process.env.FIXED_PRICE;
const LISTING_DATE = process.env.LISTING_DATE;
const EXPIRATION_DATE = process.env.EXPIRATION_DATE;

const NUM_FIXED_PRICE_AUCTIONS = 100;
const BASE_DERIVATION_PATH = `44'/60'/0'/0`;

const mnemonicWalletSubprovider = new MnemonicWalletSubprovider({
    mnemonic: MNEMONIC,
    baseDerivationPath: BASE_DERIVATION_PATH,
});

const rpcSubprovider = new RPCSubprovider({
    rpcUrl: "https://eth-" + NETWORK + ".alchemyapi.io/v2/" + ALCHEMY_KEY,
});

const providerEngine = new Web3ProviderEngine();
providerEngine.addProvider(mnemonicWalletSubprovider);
providerEngine.addProvider(rpcSubprovider);
providerEngine.start();


console.log("Creating fixed price auctions...");
console.log("FACTORY_CONTRACT_ADDRESS = ", FACTORY_CONTRACT_ADDRESS);
console.log("OWNER_ADDRESS = ", OWNER_ADDRESS);
console.log("FIXED_PRICE = ", FIXED_PRICE);

const listingDate = new Date(LISTING_DATE);
const expirationDate = new Date(EXPIRATION_DATE);

const listingTime = Math.round(listingDate / 1000);
const expirationTime = Math.round(expirationDate / 1000);

const seaport = new OpenSeaPort(
    providerEngine,
    {
        networkName: Network.Rinkeby,
        apiKey: API_KEY,
    },
    (arg) => console.log(arg)
);

async function sellOrders(indexFrom, indexTo) {
    let assets = [];
    for (let i = indexFrom; i <= indexTo; i++) {
        assets.push({tokenId: i, tokenAddress: FACTORY_CONTRACT_ADDRESS})
    }

    await seaport.createFactorySellOrders({
        assets: assets,
        factoryAddress: FACTORY_CONTRACT_ADDRESS,
        accountAddress: OWNER_ADDRESS,
        startAmount: FIXED_PRICE,
        listingTime: listingTime,
        expirationTime: expirationTime,
        numberOfOrders: NUM_FIXED_PRICE_AUCTIONS,
    });
    console.log(
        `Successfully made ${indexTo - indexFrom} fixed-price sell orders for multiple assets at once!\n`
    );
}


async function sellOrdersWithoutApiKey(indexFrom, indexTo) {
    for (let i = indexFrom; i <= indexTo; i++) {
        await seaport.createSellOrder({
            asset: {tokenId: i, tokenAddress: FACTORY_CONTRACT_ADDRESS},
            accountAddress: OWNER_ADDRESS,
            startAmount: FIXED_PRICE,
            listingTime: listingTime,
            expirationTime: expirationTime,
        });
        console.log(
            `Successfully made fixed-price sell order for NFT ${i}!\n`
        );
    }
}

async function sellSingleNft(nftIndex) {
    await seaport.createSellOrder({
        asset: {tokenId: nftIndex, tokenAddress: FACTORY_CONTRACT_ADDRESS},
        accountAddress: OWNER_ADDRESS,
        startAmount: FIXED_PRICE,
        listingTime: listingTime,
        expirationTime: expirationTime,
    });
    console.log(
        `Successfully made fixed-price sell order for NFT ${nftIndex}!\n`
    );
}

task("sell-tokens-from-to", "Sell tokens using Opensea API")
    .addParam("indexFrom", "Index of token from which start sell tokens")
    .addParam("indexTo", "Index of token to which sell tokens include this index")
    .setAction(async function (taskArguments, hre) {
        await sellOrders(taskArguments.indexFrom, taskArguments.indexTo);
    });

task("sell-tokens-from-to-without-apikey", "Sell tokens using Opensea API")
    .addParam("indexFrom", "Index of token from which start sell tokens")
    .addParam("indexTo", "Index of token to which sell tokens include this index")
    .setAction(async function (taskArguments, hre) {
        await sellOrdersWithoutApiKey(taskArguments.indexFrom, taskArguments.indexTo);
    });

task("sell-single-token", "Sell tokens using Opensea API")
    .addParam("nftIndex", "Index of token from which start sell tokens")
    .setAction(async function (taskArguments, hre) {
        await sellSingleNft(taskArguments.nftIndex);
    });
