const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Variables de la simulación
let currentBlockNumber = 123456;
let pendingTransactions = [];
let blocks = [];
let txHashToTx = {};
let txHashToReceipt = {};

// Función para generar un hash aleatorio
function randomHash() {
  return "0x" + Math.random().toString(16).substring(2, 66);
}

// Función para minar un bloque cada 10 segundos
setInterval(() => {
  if (pendingTransactions.length > 0) {
    const newBlock = {
      number: "0x" + currentBlockNumber.toString(16),
      hash: randomHash(),
      parentHash: blocks.length > 0 ? blocks[blocks.length - 1].hash : randomHash(),
      nonce: "0x0",
      sha3Uncles: "0x" + "0".repeat(64),
      logsBloom: "0x" + "0".repeat(512),
      transactionsRoot: randomHash(),
      stateRoot: randomHash(),
      receiptsRoot: randomHash(),
      miner: "0x0000000000000000000000000000000000000000",
      difficulty: "0x0",
      totalDifficulty: "0x0",
      extraData: "0x0",
      size: "0x0",
      gasLimit: "0x6691b7",
      gasUsed: "0x0",
      timestamp: "0x" + Math.floor(Date.now() / 1000).toString(16),
      transactions: pendingTransactions.map(tx => tx.hash),
      uncles: []
    };

    // Guardar bloque
    blocks.push(newBlock);

    // Generar receipts para las transacciones minadas
    pendingTransactions.forEach(tx => {
      txHashToReceipt[tx.hash] = {
        transactionHash: tx.hash,
        blockHash: newBlock.hash,
        blockNumber: newBlock.number,
        from: tx.from,
        to: tx.to,
        cumulativeGasUsed: "0x5208",
        gasUsed: "0x5208",
        contractAddress: null,
        logs: [],
        status: "0x1"
      };
    });

    pendingTransactions = [];
    currentBlockNumber++;
    console.log(`📦 Nuevo bloque minado: ${newBlock.number}`);
  }
}, 10000); // 10 segundos

// Handler principal
app.post("/", async (req, res) => {
  const { method, params, id } = req.body;

  console.log(`Método recibido: ${method}`);

  try {
    let result;

    switch (method) {
      case "eth_chainId":
        result = "0x539"; // 1337
        break;

      case "net_version":
        result = "1337";
        break;

      case "web3_clientVersion":
        result = "SanbusEthereum/v1.0.0";
        break;

      case "eth_blockNumber":
        result = "0x" + currentBlockNumber.toString(16);
        break;

      case "eth_gasPrice":
        // Gas price aleatorio entre 1 Gwei y 5 Gwei
        const gasGwei = Math.floor(Math.random() * 5) + 1;
        result = "0x" + (gasGwei * 1e9).toString(16);
        break;

      case "eth_getBalance":
        result = "0x204fce5e3e2502611000000"; // Saldo simulado
        break;

      case "eth_estimateGas":
        result = "0x5208"; // 21000 gas
        break;

      case "eth_sendTransaction":
      case "eth_sendRawTransaction":
        const txHash = randomHash();
        pendingTransactions.push({ hash: txHash, from: "0x", to: "0x" });
        txHashToTx[txHash] = {
          hash: txHash,
          from: "0x",
          to: "0x"
        };
        result = txHash;
        break;

      case "eth_getTransactionByHash":
        const tx = txHashToTx[params[0]];
        result = tx ? {
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          blockNumber: null,
          blockHash: null,
          gas: "0x5208",
          gasPrice: "0x3b9aca00",
          value: "0x0",
          input: "0x"
        } : null;
        break;

      case "eth_getTransactionReceipt":
        const receipt = txHashToReceipt[params[0]];
        result = receipt || null;
        break;

      case "eth_getBlockByNumber":
        if (params[0] === "latest") {
          result = blocks[blocks.length - 1] || null;
        } else {
          const blockNumber = parseInt(params[0], 16);
          result = blocks.find(b => parseInt(b.number, 16) === blockNumber) || null;
        }
        break;

      case "eth_syncing":
        result = false;
        break;

      case "eth_call":
        result = "0x";
        break;

      case "eth_getCode":
        result = "0x";
        break;

      case "eth_getLogs":
        result = [];
        break;

      case "eth_accounts":
        result = ["0x0000000000000000000000000000000000000001"];
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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor RPC Sanbus Ethereum PRO corriendo en el puerto ${PORT}`);
});
