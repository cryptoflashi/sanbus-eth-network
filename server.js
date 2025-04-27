const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Simulación de estado
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

      case "net_version":
        result = "1337";
        break;

      case "web3_clientVersion":
        result = "SanbusEthereum/v1.0.0";
        break;

      case "eth_blockNumber":
        result = "0x" + currentBlock.toString(16);
        break;

      case "eth_getBalance":
        result = "0x204fce5e3e2502611000000"; // Saldo simulado
        break;

      case "eth_gasPrice":
        result = "0x3b9aca00"; // 1 Gwei
        break;

      case "eth_syncing":
        result = false;
        break;

      case "eth_getBlockByNumber":
        result = {
          number: "0x" + currentBlock.toString(16),
          hash: "0x" + "a".repeat(64),
          parentHash: "0x" + "b".repeat(64),
          nonce: "0x0",
          sha3Uncles: "0x" + "0".repeat(64),
          logsBloom: "0x" + "0".repeat(512),
          transactionsRoot: "0x" + "0".repeat(64),
          stateRoot: "0x" + "0".repeat(64),
          receiptsRoot: "0x" + "0".repeat(64),
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

      case "eth_getTransactionCount":
        result = "0x1"; // Siempre 1
        break;

      case "eth_estimateGas":
        result = "0x5208"; // 21000 gas
        break;

      case "eth_sendTransaction":
        result = "0x" + Math.random().toString(16).substring(2, 66);
        break;

      case "eth_getTransactionByHash":
        result = null; // No almacenamos transacciones reales
        break;

      case "eth_getTransactionReceipt":
        result = null;
        break;

      case "eth_call":
        result = "0x"; // Sin llamadas reales
        break;

      case "eth_getCode":
        result = "0x"; // No hay contratos
        break;

      case "eth_getLogs":
        result = [];
        break;

      case "eth_accounts":
        result = [
          "0x0000000000000000000000000000000000000001"
        ]; // Cuenta simulada
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
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor RPC mock PRO corriendo en el puerto ${PORT}`);
});
