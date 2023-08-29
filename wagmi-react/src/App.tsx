import { WagmiConfig, createConfig, configureChains, mainnet } from "wagmi";

// import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import TodoApp from "./TodoApp";

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [
    // alchemyProvider({ apiKey: "oUa708phD3Yi9BrV41bqPPqMckKXUW37" }),
    jsonRpcProvider({
      rpc: () => ({
        http: "http://127.0.0.1:7545", // Ganache Personal Blockchain network
      }),
    }),
    publicProvider(),
  ]
);

// Set up wagmi config
const config = createConfig({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  publicClient,
  webSocketPublicClient,
});

function App() {
  return (
    <WagmiConfig config={config}>
      <TodoApp />
    </WagmiConfig>
  );
}

export default App;
