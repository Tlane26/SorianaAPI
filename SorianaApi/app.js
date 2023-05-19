const express = require('express')
const mysql = require('mysql')

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3050;

const app = express();

app.use(bodyParser.json());

// Mysql

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'lucas',
    database: 'soriana_mysql'
});


// Route
app.get('/', (req, res) => {
    res.send('Wlcome to my API');
});

// all promos
app.get('/promociones', (req, res) => {
    const sql = 'SELECT * FROM promociones';
    connection.query(sql, (error, results) => {
        if(error) throw error;
        if(results.length > 0){
            res.json(results);
        } else{
            res.send('No Existen Promociones');
        }

    })
});

// all productos promos
app.get('/promocionesProductos', (req, res) => {
    const sql = 'SELECT * FROM productos';
    connection.query(sql, (error, results) => {
        if(error) throw error;
        if(results.length > 0){
            res.json(results);
        } else{
            res.send('Not results');
        }

    })
});

app.get('/promocion/:id', (req, res) => {
    const {id } = req.params
    const sql = `SELECT * FROM promociones WHERE idpromociones = ${id}`;
    connection.query(sql, (error, result) => {
        if(error) throw error;
        if(result.length > 0){
            res.json(result);
        } else{
            res.send('Not results');
        }

    })
});

app.post('/addPromocion', (req, res) => {
    const sqlCount = 'SELECT COUNT(*) AS count FROM promociones'
    connection.query(sqlCount, (error, result) => {
        if(error) throw error;
        const count = result[0].count;
    
        const sql = 'INSERT INTO promociones SET ?'
        const promocionObj = {
            idpromociones: count + 1,
            nombre: req.body.nombre,
            descuento: req.body.descuento,
            descripcion: req.body.descripcion
        }
        connection.query(sql, promocionObj, error => {
            if(error) throw error;
            res.send('Nueva Promo');
        });
    });
});

app.post('/updatePromo/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, descuento, descripcion } = req.body;
    const sqlCheck = `SELECT COUNT(*) AS count FROM promociones WHERE idpromociones = ${id}`;

    connection.query(sqlCheck, (error, results) => {
        if (error) throw error;
        const count = results[0].count;

        if (count === 0) {
            res.send('El ID de promoción no existe');
        } else {
            const sqlUpdate = `UPDATE promociones SET nombre = '${nombre}', descuento = ${descuento}, descripcion = '${descripcion}' WHERE idpromociones = ${id}`;

            connection.query(sqlUpdate, error => {
                if (error) throw error;
                res.send('Promoción actualizada');
            });
        }
    });
});


app.delete('/deletePromo/:id', (req, res) => {
    const { id } = req.params;
    const sqlCheck = `SELECT COUNT(*) AS count FROM promociones WHERE idpromociones = ${id}`;

    connection.query(sqlCheck, (error, results) => {
        if (error) throw error;
        const count = results[0].count;

        if (count === 0) {
            res.send('El ID de promoción no existe');
        } else {
            const sqlDelete = `DELETE FROM promociones WHERE idpromociones = ${id}`;

            connection.query(sqlDelete, error => {
                if (error) throw error;
                res.send('Promoción eliminada');
            });
        }
    });
});


// Check connect
connection.connect(error => {
    if (error) throw error;
    console.log('Data server running');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));