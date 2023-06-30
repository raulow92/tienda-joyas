const pool = require("../db/conexion");
const format = require("pg-format");

const getProducts = async ({ limits = 2, page = 1, order_by = "id_asc" }) => {
    const [campo, direccion] = order_by.split("_");
    const offset = (page - 1) * limits;
    const formattedQuery = format(
        "SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s",
        campo,
        direccion,
        limits,
        offset
    );
    const { rows } = await pool.query(formattedQuery);
    return rows;
};

const getHATEOAS = async (products) => {
    const results = products.map((product) => ({
        nombre: product.nombre,
        price: product.price,
        url: `/joyas/product/${product.id}`,
    }));

    const totalProductsQuery = "SELECT COUNT(*) as total FROM inventario";
    const { rows } = await pool.query(totalProductsQuery);
    const totalProducts = +(rows[0].total);
    const productsPerPage = results.length;
    const totalPages = Math.floor(totalProducts / productsPerPage)
    const pagination = `${page} de ${totalPages}`;
    // let nextPage = page < totalPages ? `/joyas?page=${page + 1}` : null
    // let previousPage = page == 1 ? null : `/joyas?page=${page - 1}`

    const HATEOAS = {
        page,
        productsPerPage,
        totalProducts,
        pagination,
        // nextPage,
        // previousPage,
        results,
    };
    return HATEOAS;
};

const getProduct = async (id) => {
    const { rows } = await pool.query(
        "SELECT * FROM inventario WHERE id = $1",
        [id]
    );
    return rows[0];
};

const getProductsBy = async ({
    id,
    nombre,
    metal,
    categoria,
    precio_max,
    precio_min,
    stock_max,
    stock_min,
}) => {
    
    let filtros = [];
    let values = [];

    const agregarFiltro = (campo, comparador, valor) => {
        values.push(valor);
        const { length } = filtros;
        filtros.push(format('%s %s $%s', campo, comparador, length + 1));
    };

    id && agregarFiltro("id", "=", id);
    nombre && agregarFiltro("nombre", "ilike", `%${nombre}%`);
    categoria && agregarFiltro("categoria", "ilike", `%${categoria}%`);
    metal && agregarFiltro("metal", "ilike", `%${metal}%`);
    precio_min && agregarFiltro("precio", ">=", precio_min);
    precio_max && agregarFiltro("precio", "<=", precio_max);
    stock_max && agregarFiltro("stock", "<=", stock_max);
    stock_min && agregarFiltro("stock", ">=", stock_min);

    let consulta = "SELECT * FROM inventario";
    if (filtros.length > 0) {
        consulta += ` WHERE ${filtros.join(' AND ')}`;
    }
    const { rows } = await pool.query(consulta, values);
    return rows;
};

module.exports = {
    getProducts,
    getHATEOAS,
    getProduct,
    getProductsBy,
};
