require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: [
        {
          privateKey: '0x30f94f55af283b6047337ae25ac6ba1e16ed967ee90f5815d4afc0fe3a67517e',
          balance: '600000000000000000000000000' // 600 millones de ETH en wei
        }
      ]
    }
  },
  solidity: "0.8.20",
};
