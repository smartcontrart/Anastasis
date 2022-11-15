var AnastasisAct1 = artifacts.require("Anastasis_Act1");
var AnastasisAct1Mint = artifacts.require("AnastasisAuction");
var AnastasisAct2 = artifacts.require("Anastasis_Act2");
var AnastasisAct2Mint = artifacts.require("AnastasisOpenEdition");
var AnastasisAct3 = artifacts.require("Anastasis_Act3");
var AnastasisAct3Mint = artifacts.require("AnastasisLimitedEdition");
var AnastasisAct3CreatorMint = artifacts.require("AnastasisCreatorMint");
var AnastasisAct3MintAsh = artifacts.require("AnastasisLimitedEditionAsh");
var FundSplit = artifacts.require("FundSplit");
var fakeAsh = artifacts.require("fakeASH");
var fakeFOMOverse = artifacts.require("fakeFOMOverse");

module.exports = async function(deployer) {
  var initialSupply = 1000000000000
  var tokens = web3.utils.toWei(initialSupply.toString(), 'ether')
  await deployer.deploy(fakeAsh, tokens);
  await deployer.deploy(FundSplit);
  await deployer.deploy(fakeFOMOverse);
  await deployer.deploy(AnastasisAct1);
  await deployer.deploy(AnastasisAct1Mint);
  await deployer.deploy(AnastasisAct2);
  await deployer.deploy(AnastasisAct2Mint);
  await deployer.deploy(AnastasisAct3);
  await deployer.deploy(AnastasisAct3Mint);
  await deployer.deploy(AnastasisAct3MintAsh);
  await deployer.deploy(AnastasisAct3CreatorMint);
};
