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
} from '@chakra-ui/react';

import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useEffect, useState } from 'react';


function App() {
  const [userAddress, setUserAddress] = useState('');
  const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);
  const [loading, setLoading] = useState(false)

  async function getTokenBalance() {
    setLoading(true);

    const config = {
      apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
      network: Network.ETH_MAINNET,
    };

    const alchemy = new Alchemy(config);
    const data = await alchemy.core.getTokenBalances(userAddress);

    setResults(data);
    
    const tokenDataPromises = [];
    
    for (let i = 0; i < data.tokenBalances.length; i++) {
      const tokenData = alchemy.core.getTokenMetadata(
        data.tokenBalances[i].contractAddress
        );
      console.log(tokenData)
      tokenDataPromises.push(tokenData);
    }

    setTokenDataObjects(await Promise.all(tokenDataPromises));
    setHasQueried(true);
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
            color="black"
            w="600px"
            textAlign="center"
            p={4}
            bgColor="white"
            fontSize={24}
            placeholder='Enter a wallet address'
          />
          <Button fontSize={20} onClick={getTokenBalance} color={'black'} bgColor="white" borderColor='black' borderWidth="3px">
            Search Wallet
          </Button>
          <p>or</p>
          <Button fontSize={20} onClick={getTokenBalance} bgColor="black" borderWidth="3px" color={'white'}>
            Connect Wallet
          </Button>
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
                    key={e.id}
                    borderRadius={16}
                  >
                    <Image src={tokenDataObjects[i].logo || "./../public/generic-token.png"} w={'50%'} maxW={50} />
                    <Box borderColor={'black'}>
                      <b>Symbol:</b> {tokenDataObjects[i].symbol.slice(0,7) }&nbsp;
                    </Box>
                    <Box borderColor={'black'}>
                      <Image src={tokenDataObjects[i].logo || "./../public/generic-token.png"} w={'50%'} maxW={50} />
                      {tokenDataObjects[i].symbol.slice(0,7) }
                    </Box>
                    <Box>
                      <b>Balance:</b>&nbsp;
                      {Utils.formatUnits(
                        e.tokenBalance,
                        tokenDataObjects[i].decimals
                      )}
                    </Box>
                  </Flex>
                );
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

export default App;
