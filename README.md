# ERC20 Smart Contract
My Simple ERC20 Smart Contract

###Deploy to rinkeby network:
```
npx hardhat run --network rinkeby scripts/deploy.ts
```
###HardHat tasks:
Approve tokens
```
npx hardhat myERC20_approve --address [contract address] --address [to-address] --amount=1
```

Transfer tokens
```
npx hardhat myERC20_transfer --address [contract address] --to-address [to-address] --amount=1
```

Transfer From tokens
```
npx hardhat myERC20_transferFrom --address [contract address] --from-address [from-address] --to-address [to-address] --amount 1
```

Contract address:
[0x9C6BCD0a6FD234208f1AE3207E7524f14B0F8125](https://rinkeby.etherscan.io/token/0x9C6BCD0a6FD234208f1AE3207E7524f14B0F8125
)
