const AnastatsisAct1_contract = artifacts.require("Anastasis_Act1");
const AnastatsisAct1Mint_contract = artifacts.require("AnastasisAuction");
const assert = require('assert');
const { default: BigNumber } = require('bignumber.js');

contract("AnastasisAct1", accounts => {

  var BN = web3.utils.BN;
  let signer = web3.eth.accounts.wallet[0];
  let AL = {};
  let WL;
  let contractAddress;

  beforeEach(async() =>{
    AnastasisAct1 = await AnastatsisAct1_contract.deployed();
    AnastasisAct1Mint = await AnastatsisAct1Mint_contract.deployed();
    await web3.eth.accounts.wallet.create(1)
    signer = web3.eth.accounts.wallet[0]
  });
  
  // it("... should create a WL", async ()=>{
  //   WL = [
  //     {"address": accounts[1]},
  //     {"address": accounts[2]},
  //     {"address": accounts[3]},
  //     {"address": accounts[4]}]
  //   contractAddress = await Multivaria.address;
  //   const mintOpenedCheck = true;
  //   assert(await MultivariaMint.setSigner(signer.address),"Could not set the signer");
  //   for(i=0; i < WL.length ;i ++){
  //     assert(web3.utils.toChecksumAddress(WL[i].address),"error")
  //     assert(web3.utils.toChecksumAddress(signer.address),"error")
  //     AL[WL[i].address] = await web3.eth.accounts.sign(web3.utils.soliditySha3(WL[i].address, contractAddress, mintOpenedCheck, true), signer.privateKey)
  //   }
  // })
  
  it("... should give deployment costs", async () => {
    let AnastasisAct1Instance = await AnastatsisAct1_contract.new();
    let AnastasisAct1MintInstance = await AnastatsisAct1Mint_contract.new();
    let receiptAnastasisAct1 = await web3.eth.getTransactionReceipt(AnastasisAct1Instance.transactionHash);
    let receiptAnastasisAct1aMint = await web3.eth.getTransactionReceipt(AnastasisAct1MintInstance.transactionHash);

    console.log(`Multivaria gas deployement cost: ${receiptAnastasisAct1.gasUsed}`)
    console.log(`Price @10Gwei: ${(receiptAnastasisAct1.gasUsed)*10*10**9/(10**18)} ETH`)
    console.log(`Price @20Gwei: ${(receiptAnastasisAct1.gasUsed)*20*10**9/(10**18)} ETH`)
    console.log(`Price @30Gwei: ${(receiptAnastasisAct1.gasUsed)*30*10**9/(10**18)} ETH`)

    console.log(`MultivariaMint gas deployement cost: ${receiptAnastasisAct1aMint.gasUsed}`)
    console.log(`Price @10Gwei: ${(receiptAnastasisAct1aMint.gasUsed)*10*10**9/(10**18)} ETH`)
    console.log(`Price @20Gwei: ${(receiptAnastasisAct1aMint.gasUsed)*20*10**9/(10**18)} ETH`)
    console.log(`Price @30Gwei: ${(receiptAnastasisAct1aMint.gasUsed)*30*10**9/(10**18)} ETH`)

    console.log(`Total deployement cost: ${receiptAnastasisAct1.gasUsed + receiptAnastasisAct1aMint.gasUsed}`)
    console.log(`Price @10Gwei: ${(receiptAnastasisAct1.gasUsed + receiptAnastasisAct1aMint.gasUsed)*10*10**9/(10**18)} ETH`)
    console.log(`Price @20Gwei: ${(receiptAnastasisAct1.gasUsed + receiptAnastasisAct1aMint.gasUsed)*20*10**9/(10**18)} ETH`)
    console.log(`Price @30Gwei: ${(receiptAnastasisAct1.gasUsed + receiptAnastasisAct1aMint.gasUsed)*30*10**9/(10**18)} ETH`)
  });



  it("... should allow to do admin stuff", async ()=>{
    // Set URI
  })

  it("... should allow to initiate the auction", async () =>{
    let AnastasisAct1MintAddress = AnastasisAct1Mint.address
    assert(await AnastasisAct1.approveAdmin(AnastasisAct1MintAddress), "Could not add AnastasisAct1Mint as admin")
    let contractToMint = await AnastasisAct1.address;
    let startingPrice = (0.01 * 10 ** 18).toFixed();
    let reservePrice = (5 * 10 ** 18).toFixed();
    let minBid = (0.02 * 10 ** 18).toFixed();
    assert(await AnastasisAct1Mint.setUpAuction(contractToMint, startingPrice, reservePrice, minBid, accounts[2]), "Could not setUp the auction");
  })

  it("... should allow admins to start an auction", async () =>{
    await assert.rejects( AnastasisAct1Mint.startAuction({from: accounts[1]}), "Could start the auction while not being admin");
    assert(await AnastasisAct1Mint.startAuction(), "Could not start the auction");
  })

  it("... should allow to place bets", async () =>{
    let bidAmount = (0.03 * 10 ** 18).toFixed();
    assert(await AnastasisAct1Mint.placeBid(bidAmount, {from: accounts[0], value: bidAmount}), "Could not place a bet");
    
    let highestBidder = await AnastasisAct1Mint._highestBidder.call();
    let currentTopBid = await AnastasisAct1Mint._currentTopBid.call();

    assert.equal(await await web3.eth.getBalance(AnastasisAct1Mint.address), await AnastasisAct1Mint._currentTopBid.call(), "Bid funds are not in the contract");
    assert.equal(currentTopBid.toString(), (0.03 * 10 ** 18).toString(), "Highest  bid incorrect");
    assert.equal(highestBidder, accounts[0], "Highest bidder incorrect");
  })

  it("... should reject bids smaller than minimum bid, accept correct bids and refund previous bidder", async () =>{
    let initialTopBid = 0.03 * 10 ** 18;
    let wrongAdditionalBid = 0.01 * 10 ** 18;
    let bidAmount = (initialTopBid + wrongAdditionalBid);
    let initialHighestBidder = await AnastasisAct1Mint._highestBidder.call();
    let initialTopBidderBalance = await web3.eth.getBalance(initialHighestBidder)
    await assert.rejects(AnastasisAct1Mint.placeBid(bidAmount.toFixed(), {from: accounts[1], value: bidAmount}), "Could place a bet smaller than currentTopBid plus minimum bid")

    let correctAdditionalBid = 5 * 10 ** 18;
    bidAmount = (initialTopBid + correctAdditionalBid).toFixed();
    assert(await AnastasisAct1Mint.placeBid(bidAmount, {from: accounts[1], value: bidAmount}), "Couldn't place a valid  bet")

    let newHighestBidder = await AnastasisAct1Mint._highestBidder.call();
    let newTopBid = initialTopBid + correctAdditionalBid;
    let initialTopBidderUpdatedBalance = await web3.eth.getBalance(initialHighestBidder)

    assert.equal( await web3.eth.getBalance(AnastasisAct1Mint.address), await AnastasisAct1Mint._currentTopBid.call(), "Bid funds are not in the contract");
    assert.equal(newTopBid.toString(), (5.03 * 10 ** 18).toString(), "Highest  bid incorrect");
    assert.equal(newHighestBidder, accounts[1], "Highest bidder incorrect");
    let expectedBalance = (new BN(initialTopBidderBalance.toString()).add( new BN(initialTopBid.toString()))).toString()
    assert.equal(initialTopBidderUpdatedBalance, expectedBalance, "Initial bidder wasn't properly refunded");
  })

  it("... should allow admins to close an auction", async () =>{
    let highestBidder = await AnastasisAct1Mint._highestBidder.call();
    let initialRecipientBalance = await web3.eth.getBalance(accounts[2])
    await assert.rejects( AnastasisAct1Mint.closeAuction({from: accounts[1]}), "Could close the auction while not being admin");
    assert(await AnastasisAct1Mint.closeAuction(), "Could not close the auction");
    let auctionToken = await AnastasisAct1.balanceOf(highestBidder);
    assert.equal(auctionToken, 1,"Did not get the expected token minted");
    let newRecipientBalance = await web3.eth.getBalance(accounts[2])
    let highestBid =  await AnastasisAct1Mint._currentTopBid.call()

    let expectedFunds = new BN(initialRecipientBalance).add(new BN(highestBid))
    assert.equal(expectedFunds.toString(), newRecipientBalance.toString(),"Recipient did not get the funds");

  })

  it("... should prevent placing a bid once the auction is closed", async () =>{
    await assert.rejects( AnastasisAct1Mint.placeBid(1*10**18, {from: accounts[1], value: 1000000000000000000}), "Could close the auction while not being admin");
  })


  it("... should prevent from minting a second tooken on the contract", async () =>{
    await assert.rejects(AnastasisAct1.mint(accounts[1]), "Could mint a second token when expected not to be able to")
  })

  it("... should return a diffent URI every 8 hours", async ()=>{
    assert(await AnastasisAct1.setURI(14, 'test'), "Could not set URI")
    for(i=1; i<50; i++){
      uri = await AnastasisAct1.tokenURI(1);
      console.log(uri)
      assert(await AnastasisAct1.setURI(14, `test`), "Could not set URI")
    }
  })

  it("... should allow to burn a token", async () =>{
    assert(await AnastasisAct1.burn(1, {from: accounts[1]}), "Could not burn the token when expeted to be able to")
  })



});
