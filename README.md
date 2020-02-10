# Kauri Staking Contract

# DApp Example 

DApp is deployed on Github Pages here:
https://radek1st.github.io/kauri/index.html

It supports both Mainnet and Ropsten networks.

## Local Installation

```
npm i
ganache-cli -m "foot such pen odor swear tragic bind trap snow squirrel stay dragon" -b 1
```

Import same seed into MetaMask and change network to `localhost:8545`

## Start Test Blockchain

```
truffle --network development console
> migrate
> test
```

## Start UI Server: ##

Use any http server of your choice, for example:
```
cd docs
python -m SimpleHTTPServer 3000
```
