// const FunSplit_contract = artifacts.require("FundSplit")
// const Ash_contract = artifacts.require("fakeASH");
// const assert = require('assert');
// const { default: BigNumber } = require('bignumber.js');

// contract("FundSplit", accounts => {

//   var BN = web3.utils.BN;
//   let FundSplitAddress;
//   let ashDeposit = new BigNumber(10000*10**18);
//   let ashMint = new BigNumber(30000*10**18);
//   let ethDeposit = new BigNumber(10*10**18);
//   let beneficiairies = [
//     accounts[2],
//     accounts[3],
//     accounts[4],
//     accounts[5],
//     accounts[6],
//     accounts[7],
//     accounts[8],
//     accounts[9],
//   ]
//   let split = [
//     2,
//     3,
//     4,
//     6,
//     7,
//     8,
//     9,
//     10,
//   ]

//   beforeEach(async() =>{
//     Ash = await Ash_contract.deployed();
//     FundSplit = await FunSplit_contract.deployed();
//     await web3.eth.accounts.wallet.create(1)
//     FundSplitAddress = await FundSplit.address
//     AshAddress = await Ash.address
//   });

  
//   it("... should give deployment costs", async () => {
//     let FundSplitInstance = await FunSplit_contract.new();
//     let receiptFundSplitInstance = await web3.eth.getTransactionReceipt(FundSplitInstance.transactionHash);

//     console.log(`Fund split gas deployement cost: ${receiptFundSplitInstance.gasUsed}`)
//     console.log(`Price @10Gwei: ${(receiptFundSplitInstance.gasUsed)*10*10**9/(10**18)} ETH`)
//     console.log(`Price @20Gwei: ${(receiptFundSplitInstance.gasUsed)*20*10**9/(10**18)} ETH`)
//     console.log(`Price @30Gwei: ${(receiptFundSplitInstance.gasUsed)*30*10**9/(10**18)} ETH`)
//   });

//   it("... should allow accounts to mint some ash", async ()=>{
//     await assert.rejects(AnastasisAct2Mint.setAshAddress(await Ash.address, {from: accounts[1]}) ,"Could not setup contract address");
//     assert(await AnastasisAct2Mint.setAshAddress(await Ash.address) ,"Could not setup contract address");
//     for(let i=0; i <= 1; i++){
//       await Ash.mint(ashMint.toFixed(), {from: accounts[i]});
//     }
//     let balance = new BigNumber(await Ash.balanceOf(accounts[0])).toFixed();
//     assert(balance == ashMint.toFixed(), "Account[0] did not mint ash");
//   })


//   it("... should allow to do admin stuff", async ()=>{
//     await assert.rejects( AnastasisAct2.setURI('test', {from: accounts[1]}), "Admin Could not set the AnastasisAct2Mint as an admin");
//     assert(await AnastasisAct2.setURI('blob'), "Admin Could not set the AnastasisAct2Mint as an admin");
//   })

//   it("... should recieve ASH and track the balance", async ()=>{
//     assert(await FundSplit.setAshAddress(AshAddress))
//     assert(await Ash.transfer(FundSplitAddress, ashDeposit.toFixed(), {from: accounts[0]}),"Could not send Ash to the fund contract")
//     let fundAshBalance = new BigNumber(await FundSplit.getAshBalance()).toFixed()
//     assert.equal(fundAshBalance, ashDeposit.toFixed())
//   })

//   it("... should allow to withdraw half of the Ash", async ()=>{
//     let balance0Init = new BigNumber(await Ash.balanceOf(accounts[0])).toFixed()
//     let balanceInit = new BigNumber(await Ash.balanceOf(FundSplitAddress))
//     assert(await FundSplit.withdrawAsh(accounts[0], ashDeposit.dividedBy(2).toFixed()),"Could not withdraw Ash");
//     let balance0After = new BigNumber(await Ash.balanceOf(accounts[0])).toFixed()
//     let balanceAfter = new BigNumber(await Ash.balanceOf(FundSplitAddress)).toFixed()
//     assert.equal(balance0After,new BigNumber.sum(balance0Init, ashDeposit.dividedBy(2)).toFixed(), "Funds were not deposited to the right account");
//     assert.equal(balanceAfter, balanceInit.minus(ashDeposit.dividedBy(2)).toFixed(), "Funds were not withdrawn correctly");
//   })


//   it("... should recieve ETH and track the balance", async ()=>{
//     assert(await web3.eth.sendTransaction({from: accounts[0], to: FundSplitAddress, value: ethDeposit.toFixed() }));
//     let balance = new BigNumber(await web3.eth.getBalance(FundSplitAddress)).toFixed()
//     assert.equal(balance, ethDeposit.toFixed())
//   })

//   it("... should allow to withdraw half of the ETH", async ()=>{
//     let balance0Init = new BigNumber(await web3.eth.getBalance(accounts[0])).toFixed()
//     let balanceInit = new BigNumber(await web3.eth.getBalance(FundSplitAddress)).dividedBy(2).toFixed()
//     let receipt = await FundSplit.withdrawEth(accounts[0], balanceInit)

//     // Get gas used
//     let gasUsed = new BigNumber(receipt.receipt.gasUsed);
//     // Get gas price
//     let tx = await web3.eth.getTransaction(receipt.tx);
//     let gasPrice = new BigNumber(tx.gasPrice);
  
//     // assert(await FundSplit.withdrawAllEth(accounts[0]),"Could not withdraw ETH");
//     let totalEthUsed = gasPrice.multipliedBy(gasUsed)
//     let balance0After = new BigNumber(await web3.eth.getBalance(accounts[0])).toFixed()
//     let expectedBalance = BigNumber.sum(totalEthUsed, balance0Init, ethDeposit.dividedBy(2).toFixed())
//     let balanceAfter = new BigNumber(await web3.eth.getBalance(FundSplitAddress)).dividedBy(2).toFixed()
//     assert.equal(balance0After, expectedBalance.toFixed(), "Funds were not deposited to the right account");
//     assert.equal(balanceInit, new BigNumber.sum(balanceAfter, ethDeposit).toFixed(), "Funds were not deposited to the right account");
//   })

//   it("... should allow to set the beneficiairies", async ()=>{
//     await assert.rejects(FundSplit.setSplit(beneficiairies, split, {from: accounts[1]}),"Non Admin could set the Split")
//     assert(await FundSplit.setSplit(beneficiairies, split),"Could not set the Split")
//   })

//   it("... should allow to split all the Ash", async ()=>{
//     assert(await Ash.transfer(FundSplitAddress, ashDeposit.toFixed(), {from: accounts[0]}),"Could not send Ash to the fund contract")
//     let fundsToSplit = new BigNumber(await FundSplit.getAshBalance());
//     let balancesBefore=[];
//     for(let i =0; i< beneficiairies.length; i++){
//       balancesBefore.push(new BigNumber(await Ash.balanceOf(beneficiairies[i])).toFixed())
//     }
//     await assert.rejects(FundSplit.splitAsh(0,{from: accounts[1]}),"Non Admin could withdraw the Eth")
//     assert(await FundSplit.splitAsh(0),"Non Admin couldn't get the Ash")
//     for(let i =0; i< beneficiairies.length; i++){
//       let balanceAfter = new BigNumber(await Ash.balanceOf(beneficiairies[i])).toFixed();
//       let expectedBalance = fundsToSplit.multipliedBy(split[i])
//       expectedBalance = expectedBalance.dividedBy(100)
//       assert.equal(balanceAfter, expectedBalance.toFixed(),"Withdrawal unsuccesful")
//     }
//   })

//   it("... should allow to split all the Eth", async ()=>{
//     assert(await web3.eth.sendTransaction({from: accounts[0], to: FundSplitAddress, value: ethDeposit.toFixed() }));
//     let fundsToSplit = new BigNumber(await web3.eth.getBalance(FundSplitAddress));
//     let balancesBefore=[];
//     for(let i =0; i< beneficiairies.length; i++){
//       balancesBefore.push(new BigNumber(await web3.eth.getBalance(beneficiairies[i])).toFixed())
//     }
//     await assert.rejects(FundSplit.splitEth(0, {from: accounts[1]}),"Non Admin could withdraw the Eth")
//     assert(await FundSplit.splitEth(0),"Non Admin couldn't get the Eth")
//     for(let i =0; i< beneficiairies.length; i++){
//       let balanceAfter = new BigNumber(await web3.eth.getBalance(beneficiairies[i])).toFixed();
//       let expectedBalance = fundsToSplit.multipliedBy(split[i])
//       expectedBalance = expectedBalance.dividedBy(100)
//       expectedBalance = BigNumber.sum(expectedBalance, balancesBefore[i])
//       assert.equal(balanceAfter, expectedBalance.toFixed(),"Withdrawal unsuccesful")
//     }
//   })


//   it("... should allow to split some Ash", async ()=>{
//     assert(await Ash.transfer(FundSplitAddress, ashDeposit.toFixed(), {from: accounts[0]}),"Could not send Ash to the fund contract")
//     let amountToWithdraw = BigNumber(ashDeposit).dividedBy(2);
//     let balancesBefore=[];
//     for(let i =0; i< beneficiairies.length; i++){
//       balancesBefore.push(new BigNumber(await Ash.balanceOf(beneficiairies[i])).toFixed())
//     }
//     await assert.rejects(FundSplit.splitAsh(amountToWithdraw.toFixed(),{from: accounts[1]}),"Non Admin could withdraw the Eth")
//     assert(await FundSplit.splitAsh(amountToWithdraw.toFixed()),"Non Admin couldn't get the Ash")
//     for(let i =0; i< beneficiairies.length; i++){
//       let balanceAfter = new BigNumber(await Ash.balanceOf(beneficiairies[i])).toFixed();
//       let expectedBalance = amountToWithdraw.multipliedBy(split[i])
//       expectedBalance = expectedBalance.dividedBy(100)
//       expectedBalance = BigNumber.sum(expectedBalance, balancesBefore[i])
//       console.log(`i: ${i}`)
//       console.log(`split[i]: ${split[i]}`)
//       console.log(`amountToWithdraw: ${amountToWithdraw.toFixed()}`)
//       console.log(`balancesBefore: ${balancesBefore[i]}`)
//       console.log(`balanceAfter: ${balanceAfter}`)
//       console.log(`expectedBalance: ${expectedBalance.toFixed()}`)
//       console.log(`_________________________________________________`)
//       assert.equal(balanceAfter, expectedBalance.toFixed(),"Withdrawal unsuccesful")
//     }
//   })

//   it("... should allow to split some Eth", async ()=>{
//     assert(await web3.eth.sendTransaction({from: accounts[0], to: FundSplitAddress, value: ethDeposit }));
//     let amountToWithdraw = BigNumber(ethDeposit).dividedBy(2);
//     let balancesBefore=[];
//     for(let i =0; i< beneficiairies.length; i++){
//       balancesBefore.push(new BigNumber(await web3.eth.getBalance(beneficiairies[i])).toFixed())
//     }
//     await assert.rejects(FundSplit.splitEth(amountToWithdraw.toFixed(),{from: accounts[1]}),"Non Admin could withdraw the Eth")
//     assert(await FundSplit.splitEth(amountToWithdraw.toFixed()),"Non Admin couldn't get the Eth")
//     for(let i =0; i< beneficiairies.length; i++){
//       let balanceAfter = new BigNumber(await web3.eth.getBalance(beneficiairies[i])).toFixed();
//       let expectedBalance = amountToWithdraw.multipliedBy(split[i])
//       expectedBalance = expectedBalance.dividedBy(100)
//       expectedBalance = BigNumber.sum(expectedBalance, balancesBefore[i])
//       assert.equal(balanceAfter, expectedBalance.toFixed(),"Withdrawal unsuccesful")
//     }
//   })
  
// });
