import { Button } from "@chakra-ui/react";
// import { ethers } from "ethers";
// import { ethers } from 'alchemy-sdk'

// import { ethers } from 'ethers';
// import { AlchemyProvider } from 'alchemy-sdk';




export function Web3Login({getTokenBalance, setUserAddress, userAddress}) {    

    async function connectWallet() {
        if (window.ethereum) {
            try {
                const addressArray = await window.ethereum.request({
                    method: "eth_requestAccounts",
                })

                const obj = {
                    address: addressArray[0],
                }
                
                return obj;

            } catch (err) {
                throw err;
            }
        } else {
            throw new Error("You must install MetaMask")
        }
    };

    async function handleConnect() {
        try {

            const walletResponse = await connectWallet();
            setUserAddress(walletResponse.address) // TENTAR SIMPLIFICAR ESSE
            getTokenBalance(walletResponse.address)

        } catch (err) {
            console.error("Error connecting wallet:", err)
        }
    }


    return (
        <Button fontSize={20} onClick={handleConnect} bgColor="black" borderWidth="3px" color={'white'}>
            Connect Wallet
        </Button>
    )
}


