const truffleAssert = require('truffle-assertions');

const KauriStaking = artifacts.require("./KauriStaking.sol");
const KauriTestToken = artifacts.require("./KauriTestToken.sol");

let creator, user1, user2;
let kauriToken, kauriStaking;

const testTokenDecimals = 6;
const oneHundredTokens = 100 * Math.pow(10, testTokenDecimals);
const twoHundredTokens = 200 * Math.pow(10, testTokenDecimals);
const threeHundredTokens = 300 * Math.pow(10, testTokenDecimals);

const duration = 100;

contract('KauriStaking', (accounts) => {

    beforeEach(async () => {
        creator = accounts[0];
        user1 = accounts[1];
        user2 = accounts[2];

        kauriToken = await KauriTestToken.new();
        kauriStaking = await KauriStaking.new(kauriToken.address);

        await kauriToken.transfer(user1, twoHundredTokens, {from: creator});
        await kauriToken.transfer(user2, oneHundredTokens, {from: creator});

        //users have to enable staking first
        await kauriToken.approve(kauriStaking.address, twoHundredTokens, {from: creator});
        await kauriToken.approve(kauriStaking.address, twoHundredTokens, {from: user1});
        await kauriToken.approve(kauriStaking.address, oneHundredTokens, {from: user2});
    });

    it("Defaults are correct", async () => {
        let details = await kauriStaking.stakedDetails.call(user1);
        assert(details[0] == 0, "time should be zero");
        assert(details[1] == 0, "duration should be zero");
        assert(details[2] == 0, "amount should be zero");
        assert(details[3] == false, "should be unlocked");

        assert(twoHundredTokens == await kauriToken.balanceOf.call(user1), "user should have all the tokens");
        assert(0 == await kauriToken.balanceOf.call(kauriStaking.address), "staking contract should be empty");

        assert(creator === await kauriStaking.owner.call(), "invalid contract owner");
    });

    it("Users can stake tokens", async () => {
        let tx;
        //user1
        try {
            await kauriStaking.stakeTokens(threeHundredTokens, duration, {from: user1});
            assert(false);
        } catch (e) {
            expectRevert(e, "trying to stake more than available");
        }

        tx = await kauriStaking.stakeTokens(oneHundredTokens, duration, {from: user1});

        truffleAssert.eventEmitted(tx, 'TokensStaked', (ev) => {
            return ev.staker === user1 && ev.time > 0 &&
                ev.duration == duration && ev.amount == oneHundredTokens;
        });

        let details = await kauriStaking.stakedDetails.call(user1);
        assert(details[0] > 0, "time shouldn't be zero");
        assert(details[1] == duration, "invalid duration");
        assert(details[2] == oneHundredTokens, "invalid amount");
        assert(details[3] == true, "should be locked");

        assert(oneHundredTokens == await kauriToken.balanceOf.call(user1), "user should have half the tokens");
        assert(oneHundredTokens == await kauriToken.balanceOf.call(kauriStaking.address), "staking contract should have the tokens");

        //user2
        tx = await kauriStaking.stakeTokens(oneHundredTokens, duration, {from: user2});

        truffleAssert.eventEmitted(tx, 'TokensStaked', (ev) => {
            return ev.staker === user2 && ev.time > 0 &&
                ev.duration == duration && ev.amount == oneHundredTokens;
        });

        details = await kauriStaking.stakedDetails.call(user2);
        assert(details[0] > 0, "time shouldn't be zero");
        assert(details[1] == duration, "invalid duration");
        assert(details[2] == oneHundredTokens, "invalid amount");
        assert(details[3] == true, "should be locked");

        assert(0 == await kauriToken.balanceOf.call(user2), "user should have 0 tokens");
        assert(twoHundredTokens == await kauriToken.balanceOf.call(kauriStaking.address), "staking contract should have all the tokens");
    });

    it("User can withdraw tokens after lock expired", async () => {
        await kauriStaking.stakeTokens(twoHundredTokens, duration, {from: user1});
        let tx;

        try {
            await kauriStaking.withdrawTokens(twoHundredTokens, {from: user1});
            assert(false);
        } catch (e) {
            expectRevert(e, "shouldn't be withdrawn, tokens should be locked");
        }

        //move time forward
        increaseTime(duration);

        try {
            await kauriStaking.withdrawTokens(threeHundredTokens, {from: user1});
            assert(false);
        } catch (e) {
            expectRevert(e, "trying to unstake more than available");
        }

        let details = await kauriStaking.stakedDetails.call(user1);
        assert(details[0] > 0, "time shouldn't be zero");
        assert(details[1] == duration, "invalid duration");
        assert(details[2] == twoHundredTokens, "invalid amount");
        assert(details[3] == false, "should be unlocked");

        //withdraw some tokens
        tx = await kauriStaking.withdrawTokens(oneHundredTokens, {from: user1});

        truffleAssert.eventEmitted(tx, 'TokensUnstaked', (ev) => {
            return ev.staker === user1 && ev.time > 0 &&
                ev.amount == oneHundredTokens && ev.remaining == oneHundredTokens;
        });

        assert(oneHundredTokens == await kauriToken.balanceOf.call(user1), "user should now have some the tokens");
        assert(oneHundredTokens == await kauriToken.balanceOf.call(kauriStaking.address), "staking contract should still have some tokens");

        //staking details should be updated
        details = await kauriStaking.stakedDetails.call(user1);
        assert(details[0] > 0, "time should be zero");
        assert(details[1] == duration, "invalid duration");
        assert(details[2] == oneHundredTokens, "amount should correct");
        assert(details[3] == false, "should be unlocked");

        //withdraw all the remaining tokens
        tx = await kauriStaking.withdrawTokens(oneHundredTokens, {from: user1});

        truffleAssert.eventEmitted(tx, 'TokensUnstaked', (ev) => {
            return ev.staker === user1 && ev.time > 0 &&
                ev.amount == oneHundredTokens && ev.remaining == 0;
        });

        assert(twoHundredTokens == await kauriToken.balanceOf.call(user1), "user should have all the tokens");
        assert(0 == await kauriToken.balanceOf.call(kauriStaking.address), "staking contract should have 0 tokens");

        //staking details should be reset
        details = await kauriStaking.stakedDetails.call(user1);
        assert(details[0] == 0, "time should be zero");
        assert(details[1] == 0, "duration should be zero");
        assert(details[2] == 0, "amount should be zero");
        assert(details[3] == false, "should be unlocked");
    });

    it("Admin can stake for users, but users cannot stake for others", async () => {
        let tx;
        try {
            await kauriStaking.stakeTokensFor(user2, threeHundredTokens, duration, {from: user1});
            assert(false);
        } catch (e) {
            expectRevert(e, "users cannot stake for others");
        }

        tx = await kauriStaking.stakeTokensFor(user1, oneHundredTokens, duration, {from: creator});

        truffleAssert.eventEmitted(tx, 'TokensStaked', (ev) => {
            return ev.staker === user1 && ev.time > 0 &&
                ev.duration == duration && ev.amount == oneHundredTokens;
        });

        let details = await kauriStaking.stakedDetails.call(user1);
        assert(details[0] > 0, "time shouldn't be zero");
        assert(details[1] == duration, "invalid duration");
        assert(details[2] == oneHundredTokens, "invalid amount");
        assert(details[3] == true, "should be locked");

        assert(twoHundredTokens == await kauriToken.balanceOf.call(user1), "user should have all the tokens");
        assert(oneHundredTokens == await kauriToken.balanceOf.call(kauriStaking.address), "staking contract should have the tokens from admin");

        //move time forward
        increaseTime(duration);

        //user can withdraw admin staked tokens
        tx = await kauriStaking.withdrawTokens(oneHundredTokens, {from: user1});

        truffleAssert.eventEmitted(tx, 'TokensUnstaked', (ev) => {
            return ev.staker === user1 && ev.time > 0 &&
                ev.amount == oneHundredTokens && ev.remaining == 0;
        });

        assert(threeHundredTokens == await kauriToken.balanceOf.call(user1), "user should have all the tokens");
        assert(0 == await kauriToken.balanceOf.call(kauriStaking.address), "staking contract should have 0 tokens");

        //staking details should be reset
        details = await kauriStaking.stakedDetails.call(user1);
        assert(details[0] == 0, "time should be zero");
        assert(details[1] == 0, "duration should be zero");
        assert(details[2] == 0, "amount should be zero");
        assert(details[3] == false, "should be unlocked");

    });

    function increaseTime(duration) {
        const id = Date.now();

        return new Promise((resolve, reject) => {
            web3.currentProvider.send({
                jsonrpc: '2.0',
                method: 'evm_increaseTime',
                params: [duration],
                id: id,
            }, err1 => {
                if (err1) return reject(err1);

                web3.currentProvider.send({
                    jsonrpc: '2.0',
                    method: 'evm_mine',
                    id: id+1,
                }, (err2, res) => {
                    return err2 ? reject(err2) : resolve(res);
                })
            })
        })
    }

    function expectRevert(e, msg) {
        assert(e.message.search('revert') >= 0, msg);
    }

});
