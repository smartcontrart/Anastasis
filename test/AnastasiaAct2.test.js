const AnastatsisAct2_contract = artifacts.require("Anastasis_Act2");
const AnastatsisAct2Mint_contract = artifacts.require("AnastasisOpenEdition");
const FunSplit_contract = artifacts.require("FundSplit")
const Ash_contract = artifacts.require("fakeASH");
const FOMOverse_contract = artifacts.require("fakeFOMOverse");
const assert = require('assert');
const { default: BigNumber } = require('bignumber.js');

contract("AnastasisAct2", accounts => {

  var BN = web3.utils.BN;
  let signer = web3.eth.accounts.wallet[0];
  let AL = {};
  let WL;
  let AnastasisAct2Address;
  let AnastasisAct2MintAddress;
  let FundSplitAddress;
  let amount = 900*10**18;

  beforeEach(async() =>{
    Ash = await Ash_contract.deployed();
    FOMOverse = await FOMOverse_contract.deployed();
    FundSplit = await FunSplit_contract.deployed();
    AnastasisAct2 = await AnastatsisAct2_contract.deployed();
    AnastasisAct2Mint = await AnastatsisAct2Mint_contract.deployed();
    await web3.eth.accounts.wallet.create(1)
    signer = web3.eth.accounts.wallet[0]

    ashPrice = await AnastasisAct2Mint._ashPrice.call();
    holderPrice = await AnastasisAct2Mint._holderPrice.call();
    publicPrice = await AnastasisAct2Mint._publicPrice.call();

    FOMOverseAddress = await FOMOverse.address
    AnastasisAct2Address = await AnastasisAct2.address
    AnastasisAct2MintAddress = await AnastasisAct2Mint.address
    FundSplitAddress = await FundSplit.address
    AshAddress = await Ash.address

    signer = web3.eth.accounts.wallet[0]
  });

  
  it("... should give deployment costs", async () => {
    let AnastasisAct2Instance = await AnastatsisAct2_contract.new();
    let AnastasisAct2MintInstance = await AnastatsisAct2Mint_contract.new();
    let receiptAnastasisAct2 = await web3.eth.getTransactionReceipt(AnastasisAct2Instance.transactionHash);
    let receiptAnastasisAct2Mint = await web3.eth.getTransactionReceipt(AnastasisAct2MintInstance.transactionHash);

    console.log(`Multivaria gas deployement cost: ${receiptAnastasisAct2.gasUsed}`)
    console.log(`Price @10Gwei: ${(receiptAnastasisAct2.gasUsed)*10*10**9/(10**18)} ETH`)
    console.log(`Price @20Gwei: ${(receiptAnastasisAct2.gasUsed)*20*10**9/(10**18)} ETH`)
    console.log(`Price @30Gwei: ${(receiptAnastasisAct2.gasUsed)*30*10**9/(10**18)} ETH`)

    console.log(`MultivariaMint gas deployement cost: ${receiptAnastasisAct2Mint.gasUsed}`)
    console.log(`Price @10Gwei: ${(receiptAnastasisAct2Mint.gasUsed)*10*10**9/(10**18)} ETH`)
    console.log(`Price @20Gwei: ${(receiptAnastasisAct2Mint.gasUsed)*20*10**9/(10**18)} ETH`)
    console.log(`Price @30Gwei: ${(receiptAnastasisAct2Mint.gasUsed)*30*10**9/(10**18)} ETH`)

    console.log(`Total deployement cost: ${receiptAnastasisAct2.gasUsed + receiptAnastasisAct2Mint.gasUsed}`)
    console.log(`Price @10Gwei: ${(receiptAnastasisAct2.gasUsed + receiptAnastasisAct2Mint.gasUsed)*10*10**9/(10**18)} ETH`)
    console.log(`Price @20Gwei: ${(receiptAnastasisAct2.gasUsed + receiptAnastasisAct2Mint.gasUsed)*20*10**9/(10**18)} ETH`)
    console.log(`Price @30Gwei: ${(receiptAnastasisAct2.gasUsed + receiptAnastasisAct2Mint.gasUsed)*30*10**9/(10**18)} ETH`)
  });

  it("... should create an AL (bidders + artists", async ()=>{
    WL = [
      {"address": accounts[3]},
      {"address": accounts[4]},
      {"address": accounts[5]},
      {"address": accounts[6]}]
    const mintOpenedCheck = true;
    const accountAlreadyMintedCheck = false;
    assert(await AnastasisAct2Mint.setSigner(signer.address),"Could not set the signer");
    for(i=0; i < WL.length ;i ++){
      assert(web3.utils.toChecksumAddress(WL[i].address),"error")
      assert(web3.utils.toChecksumAddress(signer.address),"error")
      AL[WL[i].address] = await web3.eth.accounts.sign(web3.utils.soliditySha3(WL[i].address, AnastasisAct2Address, mintOpenedCheck, accountAlreadyMintedCheck), signer.privateKey)
    }
  })

  it("... should allow accounts to mint some ash", async ()=>{
    assert(await AnastasisAct2Mint.setAshAddress(AshAddress) ,"Could not setup contract address");
    for(let i=0; i < 5; i++){
      await Ash.mint(amount.toString(), {from: accounts[i]});
    }
    let balance = await Ash.balanceOf(accounts[0]);
    assert(balance.toString() == amount.toString(), "Account[0] did not mint ash");
  })


  it("... should allow to do admin stuff", async ()=>{
    await assert.rejects( AnastasisAct2.setURI(15, 'test', {from: accounts[1]}), "Admin Could not set the AnastasisAct2Mint as an admin");
    assert(await AnastasisAct2.setURI(15, 'test'), "Admin Could not set the AnastasisAct2Mint as an admin");
  })

  it("... should setup the mint contract correctly", async ()=>{
    await assert.rejects(AnastasisAct2.approveAdmin(AnastasisAct2MintAddress, {from: accounts[1]}), "Non admin could set the AnastasisAct2Mint as an admin");
    assert(await AnastasisAct2.approveAdmin(AnastasisAct2MintAddress), "Admin Could not set the AnastasisAct2Mint as an admin");
    await assert.rejects(AnastasisAct2Mint.setFundSplitAddress(FundSplitAddress, {from: accounts[1]}), "Non Admin could set the recipeient");
    assert(await AnastasisAct2Mint.setFundSplitAddress(FundSplitAddress), "Could not set the recipient as a contract");
    assert(await AnastasisAct2Mint.setAnastasisAct2Address(AnastasisAct2Address) ,"Could not setup contract address");
  })

  it("... should allow to mint with ASH", async ()=>{
    let minter = accounts[1];
    let mintQuantity = 2
    assert(await FundSplit.setAshAddress(AshAddress))
    assert(await Ash.approve(FundSplitAddress, (ashPrice * mintQuantity).toString(), {from: minter}),"Could not approve ASH");
    await assert.rejects(AnastasisAct2Mint.mint(false, mintQuantity, {from: minter}), 'Could not mint');
    await assert.rejects(AnastasisAct2Mint.toggleMintOpened({from: accounts[1]}), "Non admin could toggle MintOpened");
    assert(await AnastasisAct2Mint.toggleMintOpened(), "Could not toggle MintOpened");
    assert(await AnastasisAct2Mint.mint(false, mintQuantity, {from: minter}));
    let fundAshBalance = await FundSplit.getAshBalance()
    assert.equal(fundAshBalance.toString(), (ashPrice*mintQuantity).toString())
  })

  it("... should allow to mint with ETH", async ()=>{
    let AshHolder = accounts[2];
    let mintQuantityAshHolder = 9
    assert(await AnastasisAct2Mint.mint(true, mintQuantityAshHolder, {from: AshHolder, value: holderPrice * mintQuantityAshHolder}), 'Could not mint');

    assert(await AnastasisAct2Mint.setFOMOAddress(await FOMOverseAddress) ,"Could not setup contract address");
    let FOMOHolder = accounts[6];
    let mintQuantityFOMOHolder = 9
    await FOMOverse.mint(FOMOHolder)

    assert(await AnastasisAct2Mint.mint(true, mintQuantityFOMOHolder, {from: FOMOHolder, value: holderPrice * mintQuantityFOMOHolder}), 'Could not mint');
    
    let publicMint = accounts[7]
    let mintQuantitypublicMint = 4
    await assert.rejects( AnastasisAct2Mint.mint(true, mintQuantitypublicMint, {from: publicMint, value: holderPrice * mintQuantitypublicMint}), 'Could not mint');
    assert(await AnastasisAct2Mint.mint(true, mintQuantitypublicMint, {from: publicMint, value: publicPrice * mintQuantitypublicMint}), 'Could not mint');
  })

  it("... should prevent to mint more than 10 tokens in one transaction", async ()=>{
    let FOMOholder = accounts[2];
    let mintQuantityFOMOholder = 11
    await assert.rejects( AnastasisAct2Mint.mint(true, mintQuantityFOMOholder, {from: FOMOholder, value: holderPrice * mintQuantityFOMOholder}), 'Could not mint');
  })

  it("... should prevent to mint more than 30 tokens total", async ()=>{
    let minter = accounts[3];
    let quantity = 10
    for(let i= 1 ; i<=3; i++){
      assert(await AnastasisAct2Mint.mint(true, quantity, {from: minter, value: holderPrice * quantity}), 'Could not mint when should have');
    }
    await assert.rejects(AnastasisAct2Mint.mint(true, quantity, {from: minter, value: holderPrice * quantity}), 'Could mint more than 30 tokens');
  })

  it("... should allow to bidders from the Act1 to mint for free", async ()=>{
    let minter = accounts[4]
    let signature = AL[minter]
    assert(await AnastasisAct2Mint.getFreeMint(signature.v, signature.r, signature.s, {from: minter}) , "Couldn't get a free mint while being eligible");
    await assert.rejects( AnastasisAct2Mint.getFreeMint(signature.v, signature.r, signature.s, {from: minter}),  "Could get 2 free mints ");
    
    minter = accounts[5]
    signature = AL[minter]
    await assert.rejects(AnastasisAct2Mint.getFreeMint(signature.v, signature.r, signature.s, {from: accounts[3]}),  "Could mint more than 30 tokens with the free mint ");
  })

  it("... should have different odds of getting each piece", async ()=>{

    let results = []
    for(let i=0; i<=45; i++){
      let result = await AnastasisAct2._tokenURIs.call(i+1);
      console.log(`iteration ${i+1}: returned: ${result}`)
      results.push(result);
    }

    const occurrences = results.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});
    console.log(occurrences)

    // for(let i=1; i<=45;i++){
    //   console.log(await AnastasisAct2.tokenURI(i));
    // }
  })

  it("... should be burnable", async ()=>{
    await assert.rejects(AnastasisAct2.burn( 1, {from: accounts[3]}), "Could burn someone else's token");
    assert(await AnastasisAct2.burn(30, {from: accounts[3]}), 'Could not burn when should have');
  })


});
