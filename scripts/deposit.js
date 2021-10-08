const chalk = require('chalk')
const hardhat = require("hardhat")
const { TOKEN_DECIMALS } = require('../constants')
const { ethers } = hardhat

const toWei = ethers.utils.parseEther

async function run() {

  const yieldSource = await ethers.getContract('MockYieldSource')
  const token = await ethers.getContractAt('ERC20Mintable', (await yieldSource.depositToken()))
  const ticket = await ethers.getContract('Ticket')
  const prizePool = await ethers.getContract('YieldSourcePrizePool')
  const prizeDistributors = await ethers.getContract('PrizeDistributor')

  const signers = await ethers.getSigners()

  const amount = ethers.utils.parseUnits('10000000', TOKEN_DECIMALS)

  console.log(chalk.dim(`Minting to ${signers[0].address}...`))
  await token.mint(signers[0].address, amount)

  console.log(chalk.dim(`Approving prize spend...`))
  const tx = await token.approve(prizePool.address, amount)
  await tx.wait(1)

  console.log(chalk.dim(`Depositing for myself...`))
  await prizePool.depositTo(signers[0].address, amount)

}

run()