const {expect} = require ("chai");
const {ethers} = require ("hardhat");

describe("Exchange", function (){
    let exchange;
    let token;
    let owner;
    let user1;
    let user2;

    beforeEach(async function(){
        [owner,user1,user2] = await ethers.getSigners();
        
        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy();
        // await token.deploy();

        const Exchange = await ethers.getContractFactory("Exchange");
        exchange = await Exchange.deploy(token.target);
        // await exchange.deploy();
    });

    it("should deploy with correct initializaton state", async function(){
        expect(await exchange.tokenAddress()).to.equal(token.target);
        expect(await exchange.name()).to.equal("ETH TOKEN LP Token");
        expect(await exchange.symbol()).to.equal("lpETHTOKEN");
    });

    it("should allow user to add liquidity", async function(){
        const amountOfToken = ethers.parseEther("100");

        await token.connect(owner).approve(exchange.target, amountOfToken);
        await exchange.connect(owner).addLiquidity(amountOfToken, { value: ethers.parseEther("1") });

        const userLPTokenBalance = await exchange.balanceOf(owner.address);
        expect(userLPTokenBalance).to.not.equal(0);
    });

    it("should allow users to remove liquidity", async function () {
        const amountOfToken = ethers.parseEther("100");
        const ethValue = ethers.parseEther("1");
        const user = owner;
    
        await token.connect(user).approve(exchange.target, amountOfToken);
        await exchange.connect(user).addLiquidity(amountOfToken, { value: ethValue });
    
        const userLPTokenBalanceBefore = await exchange.balanceOf(user.address);
        // console.log(ethers.formatEther(userLPTokenBalanceBefore));
    
        await exchange.connect(user).removeLiquidity(userLPTokenBalanceBefore);
    
        const userLPTokenBalanceAfter = await exchange.balanceOf(user.address);
        expect(userLPTokenBalanceAfter).to.equal(0);
    });

    it("should allow users to swap tokens for ETH", async function () {
        const amountOfToken = ethers.parseEther("100");
    
        await token.connect(owner).approve(exchange.target, amountOfToken);
        await exchange.connect(owner).addLiquidity(amountOfToken, { value: ethers.parseEther("1") });
    
        const tokenReserveBefore = await exchange.getReserve();
        const ethReserveBefore = await exchange.getEth();
        const userEthBalanceBefore = await ethers.provider.getBalance(user2.address);
        const sendEth = ethers.parseEther("10");
        const minTokensToReceive = (sendEth * tokenReserveBefore) / (sendEth + ethReserveBefore) * BigInt(99) / BigInt(100) 
        // console.log(ethers.formatEther(minTokensToReceive));

        await exchange.connect(user2).ethToTokenSwap(0, { value: sendEth })
        await token.connect(user2).approve(exchange.target, ethers.parseEther("10"));
        await exchange.connect(user2).tokenToEthSwap(ethers.parseEther("10"), 0);
    
        const tokenReserveAfter = await exchange.getReserve();
        const userEthBalanceAfter = await ethers.provider.getBalance(user2.address);
    
        expect(userEthBalanceAfter).to.be.below(userEthBalanceBefore);
        expect(tokenReserveAfter).to.be.below(tokenReserveBefore);
    });
});
     