const pool = require("../config/conexion");
const format = require("pg-format");

const obtenerInventario = async ({
  limits = 2,
  order_by = "id_ASC",
  page = 0,
}) => {
  const [campo, direccion] = order_by.split("_");
  const offset = page * limits;
  const formattedQuery = format(
    "SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s",
    campo,
    direccion,
    limits,
    offset
  );
  const { rows: inventario } = await pool.query(formattedQuery);
  return inventario;
};

const obtenerInventarioPorFiltros = async ({
  precio_max,
  precio_min,
  categoria,
  metal,
}) => {
  let filtros = [];
  const values = [];

  const agregarFiltro = (campo, comparador, valor) => {
    values.push(valor);
    const { length } = filtros;
    filtros.push("${campo} ${comparador} $${length + 1}");
  };
  if (precio_max) {
    agregarFiltro("precio", "<=", precio_max);
  }
  if (precio_min) {
    agregarFiltro("precio", ">=", precio_min);
  }
  if (categoria) {
    agregarFiltro("categotia", "=", categoria);
  }
  if (metal) {
    agregarFiltro("metal", "=", metal);
  }

  let consulta = "SELECT * FROM inventario";

  if (filtros.length > 0) {
    filtros = filtros.join(" AND ");
    consulta += "WHERE ${filtros}";
  }

  const { rows: inventario } = await pool.query(consulta, values);
  return inventario;
};

const prepararHATEOAS = (inventario) => {
  const results = inventario.map((i) => {
    return {
      name: i.nombre,
      categoria: i.categoria,
      metal: i.metal,
    };
  });
  const total = inventario.length;
  const HATEOAS = {
    total,
    results,
  };
  return HATEOAS;
};
module.exports = {
  obtenerInventario,
  obtenerInventarioPorFiltros,
  prepararHATEOAS,
};
