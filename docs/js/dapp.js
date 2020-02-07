DApp = {
    web3Provider: null,
    stakingContract: null,
    tokenContract: null,
    currentAccount: null,

    networkId: 0,
    //local, mainnet, empty, ropsten
    tokenAddressList: ["0x8A5769bE1A538aF4259f8687c73bd03a26C1A78a","","","0xbe4c5eea642f0f2245780cd08b7168c77c22c50e"],
    stakingAddressList: ["0xd06e9C6B3280FB3ee68264C29788B1A523a3ae99", "", "", "0x62b2890788fb0f001ad93c30288937df0873bdc2"],
    //localhost:
    tokenAddress: "",
    stakingAddress: "",

    tokenDecimals: 1000000,

    graphEndpoint: "https://api.thegraph.com/subgraphs/name/radek1st/kauri",

    init: function() {
        console.log("[x] Initializing DApp.");
        this.initWeb3();
        this.initContract();
    },

    /**************************************************************************
     * Smart Contracts interaction methods.
     *************************************************************************/

    initWeb3: function() {

            if (window.ethereum) {
                window.web3 = new Web3(window.ethereum);
                window.ethereum.enable();
            }
            else if (window.web3) {
                window.web3 = new Web3(window.web3.currentProvider)
            }
            else {
                window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
            }
            DApp.web3Provider = window.web3.currentProvider;
            console.log("[x] Web3 initialized.");
    },

    initContract: function(){

        web3.eth.getChainId(function(err,res){
            if(err){
                console.log("chainId error", err);
            } else {
                DApp.networkId = res;
                if(res == 1){
                    $("#currentNetwork").html("Mainnet");
                } else if(res == 3){
                    $("#currentNetwork").html("Ropsten");
                } else {
                    $("#currentNetwork").html("Other network Id: " + res);
                }
                DApp.tokenAddress = DApp.tokenAddressList[res];
                DApp.stakingAddress = DApp.stakingAddressList[res];

                $.getJSON('contracts/KauriStaking.json', function(stakingContract){
                    DApp.stakingContract = new web3.eth.Contract(stakingContract.abi, DApp.stakingAddress);
                    console.log("[x] Staking contract initialized.");

                    $.getJSON('contracts/KauriTestToken.json', function(tokenContract){
                        DApp.tokenContract = new web3.eth.Contract(tokenContract.abi, DApp.tokenAddress);
                        console.log("[x] Token contract initialized.");

                        web3.eth.getAccounts(function(error, accounts) {
                            if (error) {
                                console.error(error);
                            } else {
                                DApp.currentAccount = accounts[0];
                                console.log("[x] Using account", DApp.currentAccount);
                                DApp.initFrontend();
                            }
                        });

                    });
                });

            }
        });
    },

    initFrontend: function() {
        $("#userWalletAddress").html(DApp.currentAccount);

        DApp.stakingContract.methods.owner().call(function(error, res) {
            if(error) {
                console.log("admin address", error);
            } else {
                $("#adminWalletAddress").html(res);
            }
        });

        DApp.tokenContract.methods.allowance(DApp.currentAccount, DApp.stakingAddress).call(function(error, res) {
            if(error) {
                console.log("allowance", error);
            } else {
                let tokenAllowance = res / DApp.tokenDecimals;
                console.log("zzz", res, tokenAllowance);
                $("#userAllowedTokens").html(tokenAllowance);
            }
        });

        DApp.tokenContract.methods.balanceOf(DApp.currentAccount).call(function(error, res) {
            if(error) {
                console.log("user token balance", error);
            } else {
                let tokenBalance = res / DApp.tokenDecimals;
                $("#userTokenBalance").html(tokenBalance);
            }
        });

        DApp.tokenContract.methods.balanceOf(DApp.stakingAddress).call(function(error, res) {
            if(error) {
                console.log("stakingAddress token balance", error);
            } else {
                let tokenBalance = res / DApp.tokenDecimals;
                $("#allStakedTokenBalance").html(tokenBalance);

                DApp.tokenContract.methods.allowance(DApp.currentAccount, DApp.stakingAddress).call(function(error, allowedTokens) {
                    if(error) {
                        console.log("allowance", error);
                    } else {
                        let allowedBalance = allowedTokens / DApp.tokenDecimals;
                        let allowed = tokenBalance<=allowedBalance;
                        if(allowedBalance == 0) allowed = false;
                        $("#userEnabledStaking").html(String(allowed));
                    }
                });

            }
        });

        DApp.stakingContract.methods.stakedDetails(DApp.currentAccount).call(function(error, res) {
            if(error) {
                console.log("user staked token balance", error);
            } else {
                console.log("res", res);
                $("#userStakedTime").html(res[0]);
                $("#userStakedDuration").html(res[1]);
                $("#userStakedTokenBalance").html(res[2]/DApp.tokenDecimals);
                $("#userStakedLocked").html(String(res[3]));
            }
        });

        web3.eth.getBalance(DApp.currentAccount, function(error, ethBalance) {
            if (error) {
                // handle error
                console.log("Couldn't get user ether balance: ", error);
            } else {
                $('#userEtherBalance').html(web3.utils.fromWei(ethBalance.toString(), "ether"));
            }
        });

        $("#enableStaking").click(function(){
            let amount = $("#stake-amount").val() * DApp.tokenDecimals;
            DApp.tokenContract.methods.approve(DApp.stakingAddress, amount).
            send({from: DApp.currentAccount}, function(error, res) {
                if(error) {
                    console.log("enable staking", error);
                } else {
                    console.log(res);
                }
            });
        });

        $("#enableStaking-for").click(function(){
            let amount = $("#stake-for-amount").val() * DApp.tokenDecimals;
            DApp.tokenContract.methods.approve(DApp.stakingAddress, amount).
            send({from: DApp.currentAccount}, function(error, res) {
                if(error) {
                    console.log("enable staking", error);
                } else {
                    console.log(res);
                }
            });
        });

        $("#stake").click(function(){
            let amount = $("#stake-amount").val() * DApp.tokenDecimals;
            let duration = $("#stake-duration").val();
            console.log("stake:", amount, duration);
            DApp.stakingContract.methods.stakeTokens(amount, duration).
            send({from: DApp.currentAccount}, function(error, res) {
                if(error) {
                    console.log("stake", error);
                } else {
                    console.log(res);
                }
            });
        });

        $("#stake-for").click(function(){
            let amount = $("#stake-for-amount").val() * DApp.tokenDecimals;
            let duration = $("#stake-for-duration").val();
            let user = $("#stake-for-user").val();
            console.log("stake for:", user, amount, duration);
            DApp.stakingContract.methods.stakeTokensFor(user, amount, duration).
            send({from: DApp.currentAccount}, function(error, res) {
                if(error) {
                    console.log("stake for user", error);
                } else {
                    console.log(res);
                }
            });
        });

        $("#withdraw").click(function(){
            let amount = $("#unstake-amount").val() * DApp.tokenDecimals;
            DApp.stakingContract.methods.withdrawTokens(amount).
            send({from: DApp.currentAccount}, function(error, res) {
                if(error) {
                    console.log("stake", error);
                } else {
                    console.log(res);
                }
            });
        });

        $("#check-staking-details").click(function(){
            let wallet = $("#user-wallet-address").val();
            DApp.stakingContract.methods.stakedDetails(wallet).call(function(error, res) {
                if(error) {
                    console.log("user staked token balance", error);
                } else {
                    alert("time: " + res[0] +
                    "\nduration: " + res[1] +
                    "\nbalance: " + res[2]/DApp.tokenDecimals +
                    "\nisLocked: " + String(res[3]));
                }
            });
        });

        //GraphQL functions
        $("#from").val(1580520596);
        $("#to").val(Math.ceil(Date.now() / 1000));

        $("#check-staking-events").click(function(){

            let from = $("#from").val();
            let to = $("#to").val();

            fetch(DApp.graphEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: '{"query":"{tokensStakeds(where: {time_gt: ' + from +
                    ', time_lt: ' + to + '}){id, staker, time, duration, amount},tokensUnstakeds(where: {time_gt: '
                + from + ',time_lt: ' + to +'}) {id, staker, time, amount, remaining}}"}'
            })
                .then(r => r.json())
                .then(data => {
                    let stakers = [];
                    let unstakers = [];
                    let all;
                    let events = {};
                    let staked = data.data.tokensStakeds;
                    let unstaked = data.data.tokensUnstakeds;
                    for (var i = 0; i < staked.length; i++) {
                        stakers.push(staked[i].staker);
                        if(!Array.isArray(events[staked[i].staker])){
                            events[staked[i].staker] = [];
                        }
                        events[staked[i].staker].push(staked[i]);
                    }
                    for (var i = 0; i < unstaked.length; i++) {
                        unstakers.push(unstaked[i].staker);
                        if(!Array.isArray(events[unstaked[i].staker])){
                            events[unstaked[i].staker] = [];
                        }
                        events[unstaked[i].staker].push(unstaked[i]);
                    }

                    $("#staking-addresses").html(Array.from(new Set(stakers)).join('<br>'));
                    $("#unstaking-addresses").html(Array.from(new Set(unstakers)).join('<br>'));

                    all = Array.from(new Set(stakers,unstakers));
                    let output = "";
                    for (var i = 0; i < all.length; i++) {
                        output += "<b>"+all[i]+":</b><ul>";
                        for (var j = 0; j < events[all[i]].length; j++) {
                            output += "<li>";
                            if(events[all[i]][j].duration){
                                output += "Staked: " + events[all[i]][j].amount + "<br>";
                                output += "Time: " + events[all[i]][j].time + "<br>";
                                output += "Duration: " + events[all[i]][j].duration;
                            } else {
                                output += "Unstaked: " + events[all[i]][j].amount + "<br>";
                                output += "Time: " + events[all[i]][j].time + "<br>";
                                output += "Remaining: " + events[all[i]][j].remaining;
                            }
                            output += "</li>";
                        }
                        output += "</ul>";
                    }
                    $("#all-events").html(output);
                });


        });




        console.log("[x] Frontend initialized.");
    }
}

$(function() {
    DApp.init();
});
