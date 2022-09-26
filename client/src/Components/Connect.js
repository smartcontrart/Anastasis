import React, { Component } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { Button } from "react-bootstrap";
import { AccountInfoContext } from '../Context/AccountInfo'
import AIGirls  from "../contracts/AIGirls.json";

class Connect extends Component {
  
  static contextType =  AccountInfoContext
  
  componentDidMount = async () => {

    // const providerOptions = {
    //   walletconnect: {
    //     package: WalletConnectProvider, // required
    //     options: {
    //       infuraId: process.env.REACT_APP_INFURA_PROJECT_ID1 // required
    //     }
    //   },
    //   coinbasewallet: {
    //     package: CoinbaseWalletSDK, // Required
    //     options: {
    //       appName: "BirdBlotter", // Required
    //       infuraId: process.env.REACT_APP_INFURA_PROJECT_ID1, // Required
    //       rpc: "", // Optional if `infuraId` is provided; otherwise it's required
    //       chainId: process.env.REACT_APP_MAINNET_NETWORK, // Optional. It defaults to 1 if not provided
    //       darkMode: false // Optional. Use dark theme, defaults to false
    //     }
    //   }
    // };

    // this.web3Modal = new Web3Modal({
    //   // network: "mainnet", // optional
    //   // cacheProvider: true, // optional
    //   providerOptions // required
    // });

    
    // if (window.ethereum) {
    //   console.log('here')
    //   // this.web3 = new Web3(window.ethereum);
    //   // this.web3 = new Web3(this.provider)
    //   console.log(this.web3)
    // } else 
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      this.web3  = new Web3(window.web3.currentProvider);
    };
    if(this.web3){
      await this.setNetwork();
      await this.getContractsInstances();
      await this.setAccount();
      this.context.updateAccountInfo({web3: this.web3})
    }
  }

  async getContractsInstances(){
    this.networkId = await this.web3.eth.net.getId();
    this.deployedNetwork = AIGirls.networks[this.networkId];
    this.AIGirlsInstance = new this.web3.eth.Contract(
      AIGirls.abi,
      parseInt(process.env.REACT_APP_MAINNET_NETWORK) && process.env.REACT_APP_MAINNET_CONTRACT_ADDRESS
    )
    this.context.updateAccountInfo({AIGirlsInstance: this.AIGirlsInstance})
    this.getMintInfo();
  }

  async setAccount(){
    if(this.context.networkId !== null){
      let accounts = await this.web3.eth.getAccounts();
      await this.context.updateAccountInfo({account: accounts[0]});
      if(this.context.account) this.getAccountsData()
    }else{
      this.resetAccountData();
    }
  }

  resetAccountData(){
    this.context.updateAccountInfo({
      account: null,
    })
  }

  async setNetwork(){
    if(this.web3){
      let networkId = await this.web3.eth.net.getId();
      this.context.updateAccountInfo({networkId: networkId})
    }
  }

  async getAccountsData(){
    if(this.context.networkId === parseInt(process.env.REACT_APP_MAINNET_NETWORK) ){
      this.context.updateAccountInfo({walletETHBalance: await this.web3.eth.getBalance(this.context.account)});
      this.context.updateAccountInfo({dropOpened: await this.AIGirlsInstance.methods._mintOpened().call()})
      this.context.updateAccountInfo({nameChangeActivated: await this.AIGirlsInstance.methods._nameChangeActivated().call()})
    }
  }

  async getMintInfo(){
    if(this.context.networkId === parseInt(process.env.REACT_APP_MAINNET_NETWORK) ){
      this.context.updateAccountInfo({mintPrice: parseFloat(await this.AIGirlsInstance.methods._mintPrice().call())})
      this.context.updateAccountInfo({nameChangePrice: parseFloat(await this.AIGirlsInstance.methods._nameChangePrice().call())})
    }
  }

  async connectWallet(){
    this.context.updateAccountInfo({transactionInProgress: true})
    try{
      window.ethereum.enable()
    }catch(error){
      console.log(error)
    }
    this.context.updateAccountInfo({transactionInProgress: false})
  }

  getAccountStr(account){
    let response = account.slice(0, 5) +  '...' + account.substring(account.length - 2)
    return response
  }

  renderUserInterface(){
    if(!this.context.account){
      // return null
      return <Button variant="outline-light" onClick={() => this.connectWallet()}>Connect</Button>
    }else if(parseInt(this.context.networkId) !== parseInt(this.context.contractNetwork)){
      return <p style={{color: 'white'}}>Please connect to Ethereum Mainnet</p>
    }else return <Button variant="outline-light">Connected as {this.getAccountStr(this.context.account)}</Button>
  }

  render() {
    if(this.web3){
      window.ethereum.on('accountsChanged', async () => {
        await this.setAccount()
      })
      window.ethereum.on('networkChanged', async () => {
        await this.setNetwork()
        await this.setAccount();
      });
      // window.ethereum.on('chainChanged', async () => {
      //   await this.setNetwork()
      //   await this.setAccount();
      // });
    }
    return this.renderUserInterface()
  }
  
}


export default Connect;
