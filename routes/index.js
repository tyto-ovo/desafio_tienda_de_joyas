const {
  obtenerInventario,
  obtenerInventarioPorFiltros,
  prepararHATEOAS,
} = require("../controllers/consultas");

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.listen(3000, () => {
  console.log("Servidor levantado en el puerto 3000");
});

app.get("/", (req, res) => {
  res.send("Inventario de joyas");
});

app.get("*", (req, res) => {
  res.status(404).send("Esta ruta no existe");
});
app.get("/joyas", async (req, res) => {
  try {
    const inventario = await obtenerInventario(req.query);
    const HATEOAS = await prepararHATEOAS(inventario);
    res.json(HATEOAS);
  } catch ({ error, message }) {
    console.error("Error", error);
    res.status(500).send(message);
  }
});

app.get("/joyas/filtros", async (req, res) => {
  try {
    const inventario = await obtenerInventarioPorFiltros(req.query);
    res.json(inventario);
  } catch ({ error, message }) {
    console.error("Error", error);
    res.status(500).send(message);
  }
});
