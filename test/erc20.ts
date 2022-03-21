import {expect} from "chai";
import {ethers} from "hardhat";
import {address} from "hardhat/internal/core/config/config-validation";

describe("ERC20 token", function () {
    const my_value = 13
    const name: string = "my_super_token";
    const symbol: string = "MST";
    const decimals: number = 18;

    let acc1: any
    let acc2: any
    let contract: any

    beforeEach(async function () {
        [acc1, acc2] = await ethers.getSigners()
        const _contract = await ethers.getContractFactory("ERC20", acc1)
        contract = await _contract.deploy();
        await contract.deployed()
    })

    it("Should be deployed", async function () {
        expect(contract.address).to.be.properAddress
    })

    describe("Initialization token methods", function () {
        it("Should be possible get totalSupply", async function () {
            expect(BigInt(await contract.totalSupply())).eq(BigInt(100 * (10 ** 18)))
        })
        it("Should be possible get symbol ", async function () {
            expect(await contract.symbol()).eq(symbol)
        })
        it("Should be possible get decimals ", async function () {
            expect(await contract.decimals()).eq(decimals)
        })
        it("Should be possible get name", async function () {
            expect(await contract.name()).eq(name)
        })
    })
    describe("transfer method", function () {
        it("Should be possible transfer tokens", async function () {
            const balance_before = await contract.balanceOf(acc1.address)
            await contract.connect(acc1).transfer(acc2.address, my_value)
            const balance_after = await contract.balanceOf(acc1.address)

            expect(balance_before).eq(balance_after.add(my_value))
        })

        it("Should be revert if transfer more then sender balance", async function () {
            const balance = await contract.balanceOf(acc1.address)
            await expect(contract.connect(acc1).transfer(acc2.address, balance.add(my_value))).to.be.revertedWith('Not enough money')
        })
    })
    describe("transferFrom method", function () {
        it("Should be revert if transfer tokens more then allowance", async function () {
            await expect(contract.transferFrom(acc1.address, acc2.address, my_value)).to.be.revertedWith('The amount exceeds the allowable amount')
        })
        it("Should be possible transfer allowance tokens", async function () {
            await contract.connect(acc1).approve(acc2.address, my_value)
            await contract.connect(acc2).transferFrom(acc1.address, acc2.address, my_value)
            const balance_after = await contract.balanceOf(acc2.address)

            await expect(balance_after).eq(my_value)
        })
        it("Should be revert if transfer amount more sender balance", async function () {
            let manyTokens = await contract.balanceOf(acc1.address)
            manyTokens += my_value
            await contract.connect(acc1).approve(acc2.address, manyTokens)

            await expect(contract.connect(acc2).transferFrom(acc1.address, acc2.address, manyTokens)).to.be.revertedWith('Balance size to small')
        })

    })
    describe("mint method", function () {
        it("Should be possible mint new tokens", async function () {
            const balance_before = await contract.balanceOf(acc2.address)
            const total_supply_before = await contract.totalSupply()
            await contract.connect(acc1).mint(acc2.address, my_value)

            expect(await contract.balanceOf(acc2.address)).eq(balance_before.add(my_value))
            expect(await contract.totalSupply()).eq(total_supply_before.add(my_value))
        })
        it("Should be revert if try mint to zero address", async () => {
            await expect(contract.mint(ethers.constants.AddressZero, my_value)).to.be.revertedWith("Wrong address");
        })
        it("Should be possible mint only for owner", async function () {
            await expect(contract.connect(acc2).mint(acc2.address, my_value)).to.be.revertedWith("Access denied");
        })
    })
    describe("burn method", function () {
        it("Should be possible burn only for owner", async function () {
            await contract.connect(acc1).mint(acc2.address, my_value)

            await expect(contract.connect(acc2).burn(acc2.address, my_value)).to.be.revertedWith("Access denied");

        })
        it("Should be possible burn tokens", async function () {
            const balance_before = BigInt(await contract.balanceOf(acc1.address))
            const total_supply_before = BigInt(await contract.totalSupply())
            await contract.connect(acc1).burn(acc1.address, my_value)

            expect(await contract.connect(acc1).balanceOf(acc1.address)).eq(balance_before - BigInt(my_value))
            expect(BigInt(await contract.totalSupply())).eq(total_supply_before - BigInt(my_value))

        })
        it("Should be revert if balance more then burning tokens", async function () {
            await contract.mint(acc2.address, my_value)
            await expect(contract.connect(acc1).burn(acc2.address, my_value + 1)).to.be.revertedWith('Balance to small')
        })
        it("Should be revert if try burn for zero address", async () => {
            await expect(contract.burn(ethers.constants.AddressZero, my_value)).to.be.revertedWith("Wrong address");
        })
    })
    describe("approve method", function () {
        it("Should be possible approve 0 tokens", async function () {
            await contract.connect(acc1).approve(acc2.address, my_value)
            await contract.connect(acc1).approve(acc2.address, 0)
            expect(await contract.allowance(acc1.address, acc2.address)).eq(0)
        })

        it("Should be possible approve tokens for anyone", async function () {
            await contract.connect(acc1).approve(acc2.address, my_value)
            expect(await contract.allowance(acc1.address, acc2.address)).eq(my_value)
        })
    })
    describe("allowance method", function () {
        it("Should be possible get count of approved tokens", async function () {
            await contract.connect(acc1).approve(acc2.address, my_value)
            expect(await contract.allowance(acc1.address, acc2.address)).eq(my_value)
        })
    })
    describe("balanceOf method", function () {
        it("Should be possible get tokens balance for any address ", async function () {
            await contract.transfer(acc2.address, my_value)
            await expect(await contract.balanceOf(acc2.address)).eq(my_value)
        })
    })
});
