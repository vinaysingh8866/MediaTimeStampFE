import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { injected } from "../connectors";
import useContract from "../hooks/useContract";
import useENSName from "../hooks/useENSName";
import useMetaMaskOnboarding from "../hooks/useMetaMaskOnboarding";
import { formatEtherscanLink, shortenHex } from "../util";
const abi = [{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"data","outputs":[{"internalType":"uint256","name":"totalStamps","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"fileOwners","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"stampHash","type":"bytes32"}],"name":"getOwner","outputs":[{"internalType":"address","name":"owner","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"nameHash","type":"bytes32"}],"name":"getTimeStamp","outputs":[{"internalType":"bytes32","name":"stampHash","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"imageMetaData","outputs":[{"internalType":"uint256","name":"time","type":"uint256"},{"internalType":"uint256","name":"gps","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"time","type":"uint256"},{"internalType":"uint256","name":"gps","type":"uint256"},{"internalType":"bytes32","name":"stampHash","type":"bytes32"}],"name":"insertImageMeta","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32[]","name":"stampHash","type":"bytes32[]"},{"internalType":"bytes32[]","name":"nameHash","type":"bytes32[]"}],"name":"insertMultiple","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"stampHash","type":"bytes32"},{"internalType":"bytes32","name":"nameHash","type":"bytes32"}],"name":"insertTimeStamp","outputs":[],"stateMutability":"nonpayable","type":"function"}]
type AccountProps = {
  triedToEagerConnect: boolean;
};

type TransactionData = {
    fileNameHash:string,
    dataHash:String
};

const PutHash = ({ triedToEagerConnect, data }) => {

  const { active, error, activate, chainId, account, setError } = useWeb3React();

  const {
    isMetaMaskInstalled,
    isWeb3Available,
    startOnboarding,
    stopOnboarding,
  } = useMetaMaskOnboarding();

  async function SendData(){
    console.log(data)
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    const contract = new ethers.Contract(
        "0xe8a0544C99FB3c7c15D5AdD8F9d7F1ada68d66E5",
        abi,
        signer
    );
    const tx = await contract.insertTimeStamp(data.dataHash,data.fileNameHash);
    console.log(data.dataHash,data.fileNameHash)
    //await console.log(contract.insertTimeStamp("0x46696c6531446174610000000000000000000000000000000000000000000000","0x46696c6531000000000000000000000000000000000000000000000000000000"))
    const check = await contract.getTimeStamp(data.fileNameHash);
    console.log(tx, check)
    //
  }

  // manage connecting state for injected connector
  const [connecting, setConnecting] = useState(false);
  useEffect(() => {
    if (active || error) {
      setConnecting(false);
      stopOnboarding();
    }
  }, [active, error, stopOnboarding]);

  const ENSName = useENSName(account);

  if (error) {
    return null;
  }

  if (!triedToEagerConnect) {
    return null;
  }

  if (typeof account !== "string") {
    return (
      <div>
        {isWeb3Available ? (
          <button
            disabled={connecting}
            onClick={() => {
              setConnecting(true);

              activate(injected, undefined, true).catch((error) => {
                // ignore the error if it's a user rejected request
                if (error instanceof UserRejectedRequestError) {
                  setConnecting(false);
                } else {
                  setError(error);
                }
              });
            }}
          >
            {isMetaMaskInstalled ? "Connect to MetaMask" : "Connect to Wallet"}
          </button>
        ) : (
          <button onClick={startOnboarding}>Install Metamask</button>
        )}
      </div>
    );
  }

  return (
    <button onClick={SendData}>
        Insert Hash
    </button>
  );
};

export default PutHash;



