# Setting Up Graph Project

Read up on Graph, set up account (using mine: radek1st) and define a subgraph suited for the project:

https://thegraph.com/docs/define-a-subgraph#create-a-subgraph-project

## Initialise

```
graph init \
  --from-contract 0xfa3ce1b301f03996ad2d8bd32c959bfdae190115 \
  --network ropsten \
  --abi KauriStaking.abi \
  radek1st/kauri-ropsten

graph init \
  --from-contract 0x12ef4d13ab43ba4de1be7cc8385c6e9242aa42c0 \
  --network mainnet \
  --abi KauriStaking.abi \
  radek1st/kauri
```  

## Authenticate and Push

```
  graph auth https://api.thegraph.com/deploy/ {auth-code}
  cd kauri-ropsten
  yarn deploy

  cd kauri-mainnet
  yarn deploy
```

The graphs will be available under:

https://api.thegraph.com/subgraphs/name/radek1st/kauri-ropsten

and

https://api.thegraph.com/subgraphs/name/radek1st/kauri
