import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import Account from "../components/Account";
import CheckHash from "../components/CheckHash";
import ETHBalance from "../components/ETHBalance";
import FileUpload from "../components/FileUpload";
import PutHash from "../components/PutHash";
import TokenBalance from "../components/TokenBalance";
import useContract from "../hooks/useContract";
import useEagerConnect from "../hooks/useEagerConnect";

const DAI_TOKEN_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";



type TransactionData = {
  fileNameHash:string,
  dataHash:String
};

const Home = () => {

  function modifyData(fileNameHash, dataHash){
   
   setdata({
     fileNameHash : fileNameHash, 
     dataHash : dataHash
    });
  }
  
  var [data, setdata] = useState({
    fileNameHash:"",
    dataHash:""
  });
  
  const { account, library } = useWeb3React();

  const triedToEagerConnect = useEagerConnect();

  const isConnected = typeof account === "string" && !!library;
  

  return (
    <div>
      <Head>
        <title>Mediatimestamp Hash</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <nav>
          <Link href="/">
            <a>Mediatimestamp Hash</a>
          </Link>

          <Account triedToEagerConnect={triedToEagerConnect} />
        </nav>
      </header>

      <main>
        {/* <h1>
          Welcome to{" "}
          <a href="https://github.com/mirshko/next-web3-boilerplate">
            next-web3-boilerplate
          </a>
        </h1>

        {isConnected && (
          <section>
            <ETHBalance />

            <TokenBalance tokenAddress={DAI_TOKEN_ADDRESS} symbol="DAI" />
          </section>
        )} */}

        <FileUpload modifyData={ modifyData }/>
        <PutHash triedToEagerConnect={triedToEagerConnect as any} data={data}/>
        <CheckHash triedToEagerConnect={triedToEagerConnect as any} data={data}/>
      </main>

      <style jsx>{`
        nav {
          display: flex;
          justify-content: space-between;
        }

        main {
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default Home;
