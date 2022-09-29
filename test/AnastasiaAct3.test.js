const AnastatsisAct2_contract = artifacts.require("Anastasis_Act2");
const AnastatsisAct3_contract = artifacts.require("Anastasis_Act3");
const AnastatsisAct3Mint_contract = artifacts.require("AnastasisLimitedEdition");
const FunSplit_contract = artifacts.require("FundSplit")
const Ash_contract = artifacts.require("fakeASH");
const FOMOverse_contract = artifacts.require("fakeFOMOverse");
const assert = require('assert');
const { default: BigNumber } = require('bignumber.js');

contract("AnastasisAct3", accounts => {

  var BN = web3.utils.BN;
  let signer = web3.eth.accounts.wallet[0];
  let AL = {};
  let WL;
  let AnastasisAct3Address;
  let AnastasisAct3MintAddress;
  let FundSplitAddress;
  let amount = 900*10**18;
  let fomoHolder= accounts[1];
  let ashOEHolder= accounts[2];
  let selectedByArtist= accounts[3];
  let publicMinter= accounts[4];
  let maxSupply = 14*33;

  beforeEach(async() =>{
    Ash = await Ash_contract.deployed();
    FOMOverse = await FOMOverse_contract.deployed();
    FundSplit = await FunSplit_contract.deployed();
    AnastasisAct2 = await AnastatsisAct2_contract.deployed();
    AnastasisAct3 = await AnastatsisAct3_contract.deployed();
    AnastasisAct3Mint = await AnastatsisAct3Mint_contract.deployed();
    await web3.eth.accounts.wallet.create(1)
    signer = web3.eth.accounts.wallet[0]

    price = await AnastasisAct3Mint._price.call();

    ashAddress = await Ash.address
    FOMOverseAddress = await FOMOverse.address
    AnastasisAct2Address = await AnastasisAct2.address
    AnastasisAct3Address = await AnastasisAct3.address
    AnastasisAct3MintAddress = await AnastasisAct3Mint.address
    FundSplitAddress = await FundSplit.address
    editionNumber = await AnastasisAct3._editionNumber.call();
  });

  
  it("... should give deployment costs", async () => {
    let AnastasisAct3Instance = await AnastatsisAct3_contract.new();
    let AnastasisAct3MintInstance = await AnastatsisAct3Mint_contract.new();
    let receiptAnastasisAct3 = await web3.eth.getTransactionReceipt(AnastasisAct3Instance.transactionHash);
    let receiptAnastasisAct3Mint = await web3.eth.getTransactionReceipt(AnastasisAct3MintInstance.transactionHash);

    console.log(`Multivaria gas deployement cost: ${receiptAnastasisAct3.gasUsed}`)
    console.log(`Price @10Gwei: ${(receiptAnastasisAct3.gasUsed)*10*10**9/(10**18)} ETH`)
    console.log(`Price @20Gwei: ${(receiptAnastasisAct3.gasUsed)*20*10**9/(10**18)} ETH`)
    console.log(`Price @30Gwei: ${(receiptAnastasisAct3.gasUsed)*30*10**9/(10**18)} ETH`)

    console.log(`MultivariaMint gas deployement cost: ${receiptAnastasisAct3Mint.gasUsed}`)
    console.log(`Price @10Gwei: ${(receiptAnastasisAct3Mint.gasUsed)*10*10**9/(10**18)} ETH`)
    console.log(`Price @20Gwei: ${(receiptAnastasisAct3Mint.gasUsed)*20*10**9/(10**18)} ETH`)
    console.log(`Price @30Gwei: ${(receiptAnastasisAct3Mint.gasUsed)*30*10**9/(10**18)} ETH`)

    console.log(`Total deployement cost: ${receiptAnastasisAct3.gasUsed + receiptAnastasisAct3Mint.gasUsed}`)
    console.log(`Price @10Gwei: ${(receiptAnastasisAct3.gasUsed + receiptAnastasisAct3Mint.gasUsed)*10*10**9/(10**18)} ETH`)
    console.log(`Price @20Gwei: ${(receiptAnastasisAct3.gasUsed + receiptAnastasisAct3Mint.gasUsed)*20*10**9/(10**18)} ETH`)
    console.log(`Price @30Gwei: ${(receiptAnastasisAct3.gasUsed + receiptAnastasisAct3Mint.gasUsed)*30*10**9/(10**18)} ETH`)
  });

  it("... should create an AL for accounts selected", async ()=>{
    WL = [{"address": selectedByArtist}]
    const mintOpenedCheck = true;
    const accountAlreadyMintedCheck = false;
    assert(await AnastasisAct3Mint.setSigner(signer.address),"Could not set the signer");
    for(i=0; i < WL.length ;i ++){
      assert(web3.utils.toChecksumAddress(WL[i].address),"error")
      assert(web3.utils.toChecksumAddress(signer.address),"error")
      AL[WL[i].address] = await web3.eth.accounts.sign(web3.utils.soliditySha3(WL[i].address, AnastasisAct3Address, mintOpenedCheck, accountAlreadyMintedCheck), signer.privateKey)
    }
  })

  it("... should allow to do admin stuff", async ()=>{
    await assert.rejects( AnastasisAct3.setURI('test', {from: accounts[1]}), "Admin Could not set the AnastasisAct3Mint as an admin");
    assert(await AnastasisAct3.setURI('blob'), "Admin Could not set the AnastasisAct3Mint as an admin");
    assert(await AnastasisAct3.approveAdmin(AnastasisAct3MintAddress), "Could not set Admin up");
    assert(await AnastasisAct3Mint.setAnastasisAct3Address(AnastasisAct3Address) ,"Could not setup contract address");
    assert(await AnastasisAct3Mint.setFOMOAddress(FOMOverseAddress) ,"Could not setup contract address");
    assert(await AnastasisAct3Mint.setAshAddress(ashAddress) ,"Could not setup contract address");
    assert(await AnastasisAct3Mint.setAnastasisAct2Address(AnastasisAct2Address) ,"Could not setup contract address");
    assert(await AnastasisAct3Mint.setRecipient(FundSplitAddress) ,"Could not setup contract address");
  })

  it("... should allow to setup profiles", async ()=>{
    await Ash.mint(amount.toString(),{from: ashOEHolder});
    let balance = await Ash.balanceOf(ashOEHolder);
    assert(balance.toString() == amount.toString(), "ashOEHolder did not mint ash");
    
    assert(await AnastasisAct2.setURI('test', {from: accounts[0]}), "Could not mint FOMO");
    assert(await AnastasisAct2.mint(ashOEHolder, 1, {from: accounts[0]}), "Could not mint FOMO");
    assert(await AnastasisAct2.balanceOf(ashOEHolder)== (1).toString(),"Didn't mint OE");
    
    assert(await FOMOverse.mint(fomoHolder), "Could not mint FOMO");
    assert(await FOMOverse.balanceOf(fomoHolder)== (1).toString(),"Didn't mint FOMOverse");
  })

  it("... should prevent to mint with a drop closed", async ()=>{
    await assert.rejects(AnastasisAct3Mint.fomoHoldersMint({from: fomoHolder, value: 0.03*10**18 }));
    await assert.rejects(AnastasisAct3Mint.ashHoldersMint({from: ashOEHolder, value: 0.03*10**18 }));
    await assert.rejects(AnastasisAct3Mint.selectedMint({from: selectedByArtist, value: 0.03*10**18 }));
    await assert.rejects(AnastasisAct3Mint.publicMint({from: publicMinter, value: 0.03*10**18 }));
  })

  it("... should allow FOMO holders to mint first", async ()=>{
    assert(await AnastasisAct3Mint.toggleFomoMintOpened(), "Could not activate FOMO Mint");
    assert(await AnastasisAct3Mint.fomoHoldersMint({from: fomoHolder, value: 0.03*10**18 }),"FOMO profile couldn't mint");
    await assert.rejects(AnastasisAct3Mint.ashHoldersMint({from: ashOEHolder, value: 0.03*10**18 }));
    await assert.rejects(AnastasisAct3Mint.selectedMint({from: selectedByArtist, value: 0.03*10**18 }));
    await assert.rejects(AnastasisAct3Mint.publicMint({from: publicMinter, value: 0.03*10**18 }));
  })

  it("... should allow Ash holders to mint second", async ()=>{
    assert(await AnastasisAct3Mint.toggleAshMintOpened(), "Could not activate Ash Mint");
    assert(await AnastasisAct3Mint.ashHoldersMint({from: ashOEHolder, value: 0.03*10**18 }),"Ash profile couldn't mint");
    await assert.rejects(AnastasisAct3Mint.selectedMint({from: selectedByArtist, value: 0.03*10**18 }));
    await assert.rejects(AnastasisAct3Mint.publicMint({from: publicMinter, value: 0.03*10**18 }));
  })

  it("... should allow AL to mint third", async ()=>{
    let signature = AL[selectedByArtist]
    assert(await AnastasisAct3Mint.toggleALMintOpened(), "Could not activate AL Mint");
    assert(await AnastasisAct3Mint.selectedMint(signature.v, signature.r, signature.s, {from: selectedByArtist, value: 0.03*10**18 }),"AL profile couldn't mint");
    await assert.rejects(AnastasisAct3Mint.publicMint({from: publicMinter, value: 0.03*10**18 }));
  })

  it("... should allow public to finally mint", async ()=>{
    assert(await AnastasisAct3Mint.togglePublicMintOpened(), "Could not activate public Mint");
    assert(await AnastasisAct3Mint.publicMint({from: publicMinter, value: 0.03*10**18 }),"Public profile couldn't mint");
  })


  it("... should prevent to mint more than 2 tokens for WL wallets", async ()=>{
    assert(await AnastasisAct3Mint.publicMint({from: fomoHolder, value: 0.03*10**18 }), "FOMO profile couldn't mint");
    assert(await AnastasisAct3Mint.publicMint({from: ashOEHolder, value: 0.03*10**18 }),"Ash profile couldn't mint");
    assert(await AnastasisAct3Mint.publicMint({from: selectedByArtist, value: 0.03*10**18 }),"AL profile couldn't mint");
    await assert.rejects(AnastasisAct3Mint.publicMint({from: fomoHolder, value: 0.03*10**18 }));
    await assert.rejects(AnastasisAct3Mint.publicMint({from: ashOEHolder, value: 0.03*10**18 }));
    await assert.rejects(AnastasisAct3Mint.publicMint({from: selectedByArtist, value: 0.03*10**18 }));
    await assert.rejects(AnastasisAct3Mint.publicMint({from: publicMinter, value: 0.03*10**18 }));
  })

  it("... should prevent minting more than available supply", async ()=>{
    for(let i=8; i<=maxSupply; i++){
      assert(await AnastasisAct3Mint.publicMint({from: accounts[i], value: 0.03*10**18 }),"Public profile couldn't mint");
    }
    await assert.rejects(AnastasisAct3Mint.publicMint({from:  accounts[maxSupply + 1], value: 0.03*10**18 }));
  })

  
  it("... should have max 33 tokens of each", async ()=>{
    let results = []
    for(let i=1; i<=maxSupply; i++){
      let result = await AnastasisAct3.tokenURI(i);
      console.log(`iteration ${i}: returned: ${result}`)
      results.push(result);
    }

    const occurrences = results.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    console.log(occurrences)
  })

  it("... should have max 33 tokens of each", async ()=>{
    let results = []
    for(let i=1; i<=maxSupply; i++){
      let result = await AnastasisAct3._tokenURIs.call(i);
      console.log(`iteration ${i}: returned: ${result}`)
      results.push(result);
    }

    const occurrences = results.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    console.log(occurrences)
  })

  it("... should be burnable", async ()=>{
    await assert.rejects(AnastasisAct3.burn(1, {from: accounts[3]}), "Could burn someone else's token");
    assert(await AnastasisAct3.burn( 3, {from: accounts[3]}), 'Could not burn when should have');
  })


});
