import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { injected } from "../connectors";
import useContract from "../hooks/useContract";
import useENSName from "../hooks/useENSName";
import useMetaMaskOnboarding from "../hooks/useMetaMaskOnboarding";
import { formatEtherscanLink, shortenHex } from "../util";
const abi = [{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"data","outputs":[{"internalType":"uint256","name":"totalStamps","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"nameHash","type":"bytes32"}],"name":"getTimeStamp","outputs":[{"internalType":"bytes32","name":"stampHash","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"stampHash","type":"bytes32"},{"internalType":"bytes32","name":"nameHash","type":"bytes32"}],"name":"insertTimeStamp","outputs":[],"stateMutability":"nonpayable","type":"function"}];

type AccountProps = {
  triedToEagerConnect: boolean;
};

type TransactionData = {
    fileNameHash:string,
    dataHash:String
};

const CheckHash = ({ triedToEagerConnect, data }) => {

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
        "0xA7aDb6c36F3FCFE17DB3450A29C1F89081538B21",
        abi,
        signer
    );
    const tx = await contract.getOwner(data.dataHash);
    
    //await console.log(contract.insertTimeStamp("0x46696c6531446174610000000000000000000000000000000000000000000000","0x46696c6531000000000000000000000000000000000000000000000000000000"))
    console.log(tx)
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
        Get Owner
    </button>
  );
};

export default CheckHash;



