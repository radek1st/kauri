let KauriTestToken = artifacts.require("KauriTestToken");
let KauriStaking = artifacts.require("KauriStaking");

async function doDeploy(deployer, accounts) {
  let token = await deployer.deploy(KauriTestToken);
  await deployer.deploy(KauriStaking, token.address);
  await token.transfer(accounts[1], 200*10**6, {from: accounts[0]});
}

module.exports = (deployer, network, accounts) => {
  deployer.then(async () => {
    await doDeploy(deployer, accounts);
  });
};
