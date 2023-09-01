import {
    Box,
    Button,
    Center,
    Flex,
    Heading,
    Image,
    Input,
    SimpleGrid,
    Spinner,
    Stack,
    Text,
    useToast,
} from '@chakra-ui/react';
  
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { Web3Login } from '../Web3Login';

export function Indexer() {
  const [userAddress, setUserAddress] = useState('');
  const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);
  const [loading, setLoading] = useState(false)
  const toast = useToast()


  async function getTokenBalance(addr) {
    setLoading(true);

    const config = {
      apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
      network: Network.ETH_MAINNET,
    };

    const alchemy = new Alchemy(config);

    if (addr == null) {
      addr = userAddress
    }

    // Check if regular EOA address or ENS
    if (addr.length == 42) {
      try {
        const data = await alchemy.core.getTokenBalances(addr);
        setResults(data);
  
        const tokenDataPromises = [];
      
        for (let i = 0; i < data.tokenBalances.length; i++) {
          const tokenData = alchemy.core.getTokenMetadata(
            data.tokenBalances[i].contractAddress
            );
          tokenDataPromises.push(tokenData);
        }
  
        setTokenDataObjects(await Promise.all(tokenDataPromises));
        setHasQueried(true);
  
      } catch (err) {
        console.log("YOU GOT AN ERROR", err)
        setTimeout(() => {setLoading(false)}, 500)
        
  
        toast({
          title: "Not a valid address",
          description: "This address doesn't seem to be correct",
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
  
      }
    } else {
      // IF NOT a regular EOA address
      console.log("not 40 letters. sorry", addr.length)
      console.log("trying as ENS")

      try {
        const address = await alchemy.core.resolveName(addr)
        console.log(`The address of ${addr} is ${address}`);
        getTokenBalance(address);
      } catch (error) {
        console.error(`Failed to resolve ENS name: ${ensName}`);
        console.error(error);
      }


    }

    
  }

  useEffect(( ) => { 
    setLoading(false);
  }, [hasQueried])


  return (
    <Box w="100vw">
      <Center>
        <Flex
          alignItems={'center'}
          justifyContent="center"
          flexDirection={'column'}
        >
          <Heading mb={0} fontSize={36}>
            ERC-20 Token Indexer
          </Heading>
          <Text>
            Plug in an address and this website will return all of its ERC-20
            token balances!
          </Text>
        </Flex>
      </Center>
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent={'center'}
      >
        <Heading mt={42}>
          Get all the ERC-20 token balances of this address:
        </Heading>
        <Flex gap={16}>
          <Input
            onChange={(e) => setUserAddress(e.target.value)}
            value={userAddress}
            color="black"
            w="600px"
            textAlign="center"
            p={4}
            bgColor="white"
            fontSize={24}
            placeholder='Enter a wallet address'
          />
          <Button fontSize={20} onClick={() => getTokenBalance()} color={'black'} bgColor="white" borderColor='black' borderWidth="3px">
            Search Wallet
          </Button>
          <p>or</p>
          <Web3Login 
            getTokenBalance={getTokenBalance} 
            setUserAddress={setUserAddress} 
            userAddress={userAddress}
          /> 
        </Flex>

        {hasQueried ? (
          <Flex 
            flexDirection={'column'} 
            alignItems='center' 
            justifyContent="center" 
          >
            <Heading my={36}>ERC-20 token balances:</Heading>

            <SimpleGrid w={'90vw'} columns={4} spacing={"2rem"} gap={"2rem"}>
              {results.tokenBalances.map((e, i) => {
                if (
                  tokenDataObjects[i].symbol.length < 8 &&
                  tokenDataObjects[i].symbol.length > 0 &&
                  e.tokenBalance > 0 
                  
                ) {
                  return (
                    <Flex
                      flexDir={'column'}
                      color="black"
                      bg="#eeeeee"
                      w={'20vw'}
                      border={'40px'}
                      borderColor={'black'}
  
                      alignItems='center' 
                      justifyContent="center" 
  
                      p={'20px 0 20px 0'}
                      key={i}
                      borderRadius={16}
                    >
                      <Flex 
                        alignItems='center' 
                        justifyContent="center" 
                        gap={16}
                      >
                        <Image src={tokenDataObjects[i].logo || "./../public/generic-token.png"} w={'50%'} maxW={50} />
                        <h2>{tokenDataObjects[i].symbol.slice(0,7)}</h2>
                      </Flex>
                      <Box borderColor={'black'}>
                      </Box>
                      <Box>
                        <b>Balance:</b>&nbsp;
                        {Utils.formatUnits(
                          e.tokenBalance,
                          tokenDataObjects[i].decimals
                        ).slice(0,10)}
                      </Box>
                    </Flex>
                  );
                }
              })}
            </SimpleGrid>

            <Heading my={36}>ERC-20 token with balance ZERO:</Heading>

            <SimpleGrid w={'90vw'} columns={4} spacing={"2rem"} gap={"2rem"}>
              {results.tokenBalances.map((e, i) => {
                if (
                  tokenDataObjects[i].symbol.length < 7 &&
                  tokenDataObjects[i].symbol.length > 0 &&
                  e.tokenBalance == 0 
                  
                ) {
                  return (
                    <Flex
                      flexDir={'column'}
                      color="black"
                      bg="#eeeeee"
                      w={'20vw'}
                      border={'40px'}
                      borderColor={'black'}
  
                      alignItems='center' 
                      justifyContent="center" 
  
                      p={'20px 0 20px 0'}
                      key={i}
                      borderRadius={16}
                    >
                      <Flex 
                        alignItems='center' 
                        justifyContent="center" 
                        gap={16}
                      >
                        <Image src={tokenDataObjects[i].logo || "./../public/generic-token.png"} w={'50%'} maxW={50} />
                        <h2>{tokenDataObjects[i].symbol.slice(0,7)}</h2>
                      </Flex>
                      <Box borderColor={'black'}>
                      </Box>
                    </Flex>
                  );
                }
              })}
            </SimpleGrid>

          </Flex>

        ) : (
          loading ? 
          <Flex 
            flexDirection={'column'} 
            alignItems='center' 
            justifyContent="center" 
          >
            {/* <Heading my={36}>ERC-20 token balances:</Heading> */}
            <Spinner mt={32} w={32} h={32} />
          </Flex>
          : null
          
          )}

      </Flex>
    </Box>
  );
}