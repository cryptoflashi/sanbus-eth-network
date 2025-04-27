const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Estado simulado de la blockchain
let currentBlock = 123456;
const fakeChainId = "0x539"; // 1337 en hexadecimal

app.use(express.json());

app.post("/", async (req, res) => {
  const { method, params, id } = req.body;

  console.log(`Método recibido: ${method}`);

  try {
    let result;

    switch (method) {
      case "eth_chainId":
        result = fakeChainId;
        break;

      case "eth_blockNumber":
        result = "0x" + currentBlock.toString(16);
        break;

      case "eth_gasPrice":
        result = "0x3b9aca00"; // 1 Gwei
        break;

      case "eth_getBalance":
        result = "0x204fce5e3e2502611000000"; // Saldo inventado (625M ETH)
        break;

      case "net_version":
        result = "1337";
        break;

      case "eth_getBlockByNumber":
        result = {
          number: "0x" + currentBlock.toString(16),
          hash: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
          parentHash: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
          nonce: "0x0",
          sha3Uncles: "0x0",
          logsBloom: "0x0",
          transactionsRoot: "0x0",
          stateRoot: "0x0",
          receiptsRoot: "0x0",
          miner: "0x0000000000000000000000000000000000000000",
          difficulty: "0x0",
          totalDifficulty: "0x0",
          extraData: "0x0",
          size: "0x0",
          gasLimit: "0x6691b7",
          gasUsed: "0x0",
          timestamp: "0x" + Math.floor(Date.now() / 1000).toString(16),
          transactions: [],
          uncles: []
        };
        break;

      case "eth_syncing":
        result = false; // No estamos sincronizando
        break;

      case "eth_estimateGas":
        result = "0x5208"; // 21000 gas estándar
        break;

      case "eth_getLogs":
        result = []; // No hay logs simulados
        break;

      case "web3_clientVersion":
        result = "Sanbus-Ethereum-Client/v1.0.0";
        break;

      case "eth_sendTransaction":
        result = "0x" + Math.random().toString(16).substr(2, 64); // Simula un hash de transacción
        break;

      default:
        throw new Error(`Método ${method} no soportado aún: ${method}`);
    }

    res.json({
      jsonrpc: "2.0",
      id,
      result,
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor RPC mock completo corriendo en el puerto ${PORT}`);
});
