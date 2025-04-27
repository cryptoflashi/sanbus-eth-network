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
        result = "0x204fce5e3e2502611000000"; // Saldo inventado
        break;
      case "net_version":
        result = "1337";
        break;
      default:
        throw new Error(`Método ${method} no soportado aún.`);
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
  console.log(`Servidor RPC mock corriendo en el puerto ${PORT}`);
});
