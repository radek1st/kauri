
https://thegraph.com/docs/define-a-subgraph#create-a-subgraph-project
graph init \
  --from-contract {contract-address} \
  --network ropsten \
  --abi KauriStaking.abi \
  radek1st/kauri
  
  
  graph auth https://api.thegraph.com/deploy/ {auth-code}
  cd kauri
  yarn deploy
  
install js lib

https://graphql.org/graphql-js/
