const express = require("express");
const { JsonRpcProvider } = require("ethers");

const app = express();
const PORT = process.env.PORT || 3000; // <- Dinámico aquí

const provider = new JsonRpcProvider("http://127.0.0.1:8545");

app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const { method, params, id, jsonrpc } = req.body;
    const result = await provider.send(method, params);
    res.json({ id, jsonrpc, result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor RPC público corriendo en el puerto ${PORT}`);
});
