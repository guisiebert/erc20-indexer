import { ChakraProvider } from "@chakra-ui/react";
import { Indexer } from "./components/Indexer";

function App() {
  
  return (
    <ChakraProvider >
      <Indexer />
    </ChakraProvider>
  )
}

export default App;
