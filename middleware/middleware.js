const mostrarConsulta = (req, res, next) => {
    const url = req.url
    const method = req.method
    console.log(`${new Date()} => Consulta '${url}', Método '${method}'`);
    next()
}

module.exports = mostrarConsulta