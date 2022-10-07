import React, { Component } from "react";
import Web3 from "web3";
import { Button } from "react-bootstrap";
import { AccountInfoContext } from '../Context/AccountInfo'
import ALAct2 from "../AL/signedListAct2.json"
import ALAct3 from "../AL/signedListAct3.json"
import ALAct3Creators from "../AL/signedListAct3Creators.json"
import Act1  from "../contracts/Anastasis_Act1.json";
import Act2  from "../contracts/Anastasis_Act2.json";
import Act3  from "../contracts/Anastasis_Act3.json";
import Act1Mint  from "../contracts/AnastasisAuction.json";
import Act2Mint  from "../contracts/AnastasisOpenEdition.json";
import Act3Mint  from "../contracts/AnastasisLimitedEdition.json";
import Act3CreatorMint  from "../contracts/AnastasisCreatorMint.json";
import ash  from "../contracts/fakeASH.json";
import fomo  from "../contracts/fakeFOMOverse.json";
import fundsplit  from "../contracts/FundSplit.json";

class Connect extends Component {
  
  static contextType =  AccountInfoContext
  
  componentDidMount = async () => {

    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      this.web3  = new Web3(window.web3.currentProvider);
    }else{
      var provider = `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID1}`
      var web3Provider = new Web3.providers.HttpProvider(provider);
      this.web3 = new Web3(web3Provider);
    };
    this.context.updateAccountInfo({web3: this.web3})
    if(this.web3){
      await this.setNetwork();
      await this.getContractsInstances();
      if(window.ethereum || window.web3){
        await this.setAccount();
      }
      
    }
  }

  async getContractsInstances(){
    this.networkId = await this.web3.eth.getChainId();
    this.context.updateAccountInfo({networkId: this.networkId})
    this.Act1Instance = new this.web3.eth.Contract(
      Act1.abi,
      parseInt(process.env.REACT_APP_MAINNET_CONTRACT_ACT1_ADDRESS) && process.env.REACT_APP_MAINNET_CONTRACT_ACT1_ADDRESS
    )
    this.Act1MintInstance = new this.web3.eth.Contract(
      Act1Mint.abi,
      parseInt(process.env.REACT_APP_MAINNET_CONTRACT_ACT1MINT_ADDRESS) && process.env.REACT_APP_MAINNET_CONTRACT_ACT1MINT_ADDRESS
    )
    this.Act2Instance = new this.web3.eth.Contract(
      Act2.abi,
      parseInt(process.env.REACT_APP_MAINNET_CONTRACT_ACT2_ADDRESS) && process.env.REACT_APP_MAINNET_CONTRACT_ACT2_ADDRESS  
    )
    this.Act2MintInstance = new this.web3.eth.Contract(
      Act2Mint.abi,
      parseInt(process.env.REACT_APP_MAINNET_CONTRACT_ACT2MINT_ADDRESS) && process.env.REACT_APP_MAINNET_CONTRACT_ACT2MINT_ADDRESS
    )
    this.Act3Instance = new this.web3.eth.Contract(
      Act3.abi,
      parseInt(process.env.REACT_APP_MAINNET_CONTRACT_ACT3_ADDRESS) && process.env.REACT_APP_MAINNET_CONTRACT_ACT3_ADDRESS
    )
    this.Act3MintInstance = new this.web3.eth.Contract(
      Act3Mint.abi,
      parseInt(process.env.REACT_APP_MAINNET_CONTRACT_ACT3MINT_ADDRESS) && process.env.REACT_APP_MAINNET_CONTRACT_ACT3MINT_ADDRESS
    )
    this.Act3CreatorMintInstance = new this.web3.eth.Contract(
      Act3CreatorMint.abi,
      parseInt(process.env.REACT_APP_MAINNET_CONTRACT_ACT3CREATORMINT_ADDRESS) && process.env.REACT_APP_MAINNET_CONTRACT_ACT3CREATORMINT_ADDRESS
    )
    this.ashInstance = new this.web3.eth.Contract(
      ash.abi,
      parseInt(process.env.REACT_APP_MAINNET_CONTRACT_ASH_ADDRESS) && process.env.REACT_APP_MAINNET_CONTRACT_ASH_ADDRESS
    )
    this.FOMOVerseInstance = new this.web3.eth.Contract(
      fomo.abi,
      parseInt(process.env.REACT_APP_MAINNET_CONTRACT_FOMOVERSE_ADDRESS) && process.env.REACT_APP_MAINNET_CONTRACT_FOMOVERSE_ADDRESS
    )
    this.fundSplitInstance = new this.web3.eth.Contract(
      fundsplit.abi,
      parseInt(process.env.REACT_APP_MAINNET_CONTRACT_FUNDSPLIT_ADDRESS) && process.env.REACT_APP_MAINNET_CONTRACT_FUNDSPLIT_ADDRESS
    )
    
    this.context.updateAccountInfo({Act1Instance: this.Act1Instance})
    this.context.updateAccountInfo({Act1MintInstance: this.Act1MintInstance})
    this.context.updateAccountInfo({Act2Instance: this.Act2Instance})
    this.context.updateAccountInfo({Act2MintInstance: this.Act2MintInstance})
    this.context.updateAccountInfo({Act3Instance: this.Act3Instance})
    this.context.updateAccountInfo({Act3MintInstance: this.Act3MintInstance})
    this.context.updateAccountInfo({Act3CreatorMintInstance: this.Act3CreatorMintInstance})
    this.context.updateAccountInfo({ashInstance: this.ashInstance})
    this.context.updateAccountInfo({FOMOVerseInstance: this.FOMOVerseInstance})
    this.context.updateAccountInfo({fundSplitInstance: this.fundSplitInstance})
    this.getAct1Info();
    this.getAct2Info();
    this.getAct3Info();
    this.context.updateAccountInfo({instancesLoaded: true})
  }

  async setAccount(){
    if(this.context.networkId !== null){
      let accounts = await this.web3.eth.getAccounts();
      await this.context.updateAccountInfo({account: accounts[0]});
      if(this.context.account) this.getAccountsData(accounts[0])
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
    // if(this.web3){
      console.log(this.web3)
      let networkId = await this.web3.eth.getChainId();
      console.log(networkId)
      this.context.updateAccountInfo({networkId: networkId})
    // 
  }

  async getAccountsData(account){
    if(this.context.networkId === parseInt(process.env.REACT_APP_MAINNET_NETWORK) ){
      this.context.updateAccountInfo({walletETHBalance: await this.web3.eth.getBalance(this.context.account)});
      let signedMessageAct2 = await this.findSignedMessageAct2(account);
      this.context.updateAccountInfo({signedMessageAct2: signedMessageAct2})
      this.context.updateAccountInfo({hasMintedFreeAct2Token: await this.Act2MintInstance.methods._biddersHasMinted(this.context.account).call()});
      let signedMessageAct3 = await this.findSignedMessageAct3(account);
      this.context.updateAccountInfo({signedMessageAct3: signedMessageAct3})
      let signedMessageAct3Creator = await this.findSignedMessageAct3Creator(account);
      this.context.updateAccountInfo({signedMessageAct3Creator: signedMessageAct3Creator})
      this.context.updateAccountInfo({hasMintedAct3PrivateSale: await this.Act3MintInstance.methods._addressMintedInPrivateSale(this.context.account).call()});
      this.context.updateAccountInfo({hasMintedAct3PublicSale: await this.Act3MintInstance.methods._addressMintedInPublicSale(this.context.account).call()});
      this.context.updateAccountInfo({ashBalance: parseInt(await this.ashInstance.methods.balanceOf(this.context.account).call())})
      this.context.updateAccountInfo({fomoBalance: parseInt(await this.FOMOVerseInstance.methods.balanceOf(this.context.account).call())})
      this.context.updateAccountInfo({act2Balance: parseInt(await this.Act2Instance.methods.balanceOf(this.context.account).call())})
      this.context.updateAccountInfo({fundSplitAllowance: parseInt(await this.ashInstance.methods.allowance(this.context.account, process.env.REACT_APP_MAINNET_CONTRACT_FUNDSPLIT_ADDRESS).call())})
      this.context.updateAccountInfo({creatorHasMinted: await this.Act3CreatorMintInstance.methods._hasMinted(this.context.account).call()})
    }
  }

  async getAct1Info(){
    if(this.context.networkId === parseInt(process.env.REACT_APP_MAINNET_NETWORK) ){
      this.context.updateAccountInfo({act1Opened: await this.Act1MintInstance.methods._isLive().call()})
      this.context.updateAccountInfo({auctionStartingPrice: parseInt(await this.Act1MintInstance.methods._startingPrice().call())})
      this.context.updateAccountInfo({auctionReservePrice: parseInt(await this.Act1MintInstance.methods._reservePrice().call())})
      this.context.updateAccountInfo({auctionMinBid: parseInt(await this.Act1MintInstance.methods._minBid().call())})
      this.context.updateAccountInfo({auctionCurrentTopBid: parseInt(await this.Act1MintInstance.methods._currentTopBid().call())})
      this.context.updateAccountInfo({auctionHighestBidder: parseInt(await this.Act1MintInstance.methods._highestBidder().call())})
    }
  }

  async getAct2Info(){
    if(this.context.networkId === parseInt(process.env.REACT_APP_MAINNET_NETWORK) ){
      this.context.updateAccountInfo({act2Opened: await this.Act2MintInstance.methods._mintOpened().call()})
      this.context.updateAccountInfo({holderPrice: parseInt(await this.Act2MintInstance.methods._holderPrice().call())})
      this.context.updateAccountInfo({publicPrice: parseInt(await this.Act2MintInstance.methods._publicPrice().call())})
      this.context.updateAccountInfo({ashPrice: parseInt(await this.Act2MintInstance.methods._ashPrice().call())})
    }
  }

  async getAct3Info(){
    if(this.context.networkId === parseInt(process.env.REACT_APP_MAINNET_NETWORK) ){
      this.context.updateAccountInfo({FOMOMintOpened: await this.Act3MintInstance.methods._fomoMintOpened().call()})
      this.context.updateAccountInfo({ashMintOpened: await this.Act3MintInstance.methods._ashMintOpened().call()})
      this.context.updateAccountInfo({ALMintOpened: await this.Act3MintInstance.methods._ALMintOpened().call()})
      this.context.updateAccountInfo({publicMintOpened: await this.Act3MintInstance.methods._publicMintOpened().call()})
      this.context.updateAccountInfo({creatorMintOpened: await this.Act3CreatorMintInstance.methods._mintOpened().call()})
      this.context.updateAccountInfo({price: parseInt(await this.Act3MintInstance.methods._price().call())})

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
    }else if(parseInt(this.context.networkId) !== parseInt(process.env.REACT_APP_MAINNET_NETWORK)){
      return <p style={{color: 'white'}}>Please connect to {parseInt(process.env.REACT_APP_MAINNET_NETWORK) === 1 ? "Ethereum Mainnet" : "the GOERLI Network"}</p>
    }else return <Button variant="outline-light">Connected as {this.getAccountStr(this.context.account)}</Button>
  }

  async findSignedMessageAct2(account){
    let signedMessage = null
    for(let i=0;i<ALAct2.length;i++){
      let key = Object.keys(ALAct2[i])[0]
      if(key.toLowerCase() === account.toLowerCase()){
        signedMessage = ALAct2[i][key]
      }
    }
    return signedMessage
  }

  async findSignedMessageAct3(account){
    let signedMessage = null
    for(let i=0;i<ALAct3.length;i++){
      let key = Object.keys(ALAct3[i])[0]
      if(key.toLowerCase() === account.toLowerCase()){
        signedMessage = ALAct3[i][key]
      }
    }
    return signedMessage
  }

  async findSignedMessageAct3Creator(account){
    let signedMessage = null
    for(let i=0;i<ALAct3Creators.length;i++){
      let key = Object.keys(ALAct3Creators[i])[0]
      if(key.toLowerCase() === account.toLowerCase()){
        signedMessage = ALAct3Creators[i][key]
      }
    }
    return signedMessage
  }

  render() {

    if(window.ethereum || window.web3){
      if(this.web3){
        window.ethereum.on('accountsChanged', async () => {
          await this.setAccount()
        })
        window.ethereum.on('networkChanged', async () => {
          await this.setNetwork()
          await this.setAccount();
        });
  
      }
    }
    return this.renderUserInterface()
  }
  
}


export default Connect;
