import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });


export default {
  solidity: {
    version: "0.8.2",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    rinkeby: {
      allowUnlimitedContractSize: true,
      url: "https://rinkeby.infura.io/v3/fc67656cdc6e467c80dd1dfc6a7149f2",
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
    },
  },
};