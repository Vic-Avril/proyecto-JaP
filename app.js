const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const puerto = 3000;

app.use(express.json());
app.use(cors());

//constantes de rutas
const cats = require('./datos/cats/cat.json');
const cart = require('./datos/cart/buy.json');
const sell = require('./datos/sell/publish.json');
const user_cart = require('./datos/user_cart/25801.json');

//constantes para token
const SECRET_KEY = 'Claveresecreta';
const USUARIO1 = {
    username: 'usuario1@gmail',
    password: 'clave1'
}
const TOKEN_EXPIRATION = '1m';

const authenticateToken = (req, res, next)=>{
    const token = req.headers['access-token'];
    if (!token){
        return res.status(401).json({ message: 'Token no proporcionado'});
    }
    jwt.verify(token, SECRET_KEY, TOKEN_EXPIRATION, (err, user) => {
        if (err){
            return res.status(401).json({message: 'Token inválido o expirado'});
        }
        req.user = user;
        next();
    })
};

app.post('/login', (req, res)=>{
    const {username, password} = req.body;
    if (username===USUARIO1.username && password===USUARIO1.password){
        const token = jwt.sign({username}, SECRET_KEY, {expiresIn: TOKEN_EXPIRATION});
        res.status(200).json({token});
    } else {
        res.status(401).json({message: "usuario y/o contraseña incorrecto"});
    }
});

app.get('/cats', authenticateToken, (req, res)=>{
    res.json(cats);
});

app.get('/cart', (req, res)=>{
    res.json(cart);
});

app.get('/sell', (req, res)=>{
    res.json(sell);
});

app.get('/user_cart', (req, res)=>{
    res.json(user_cart);
});

app.get('/cats_products/:id',(req, res)=>{
    let id = req.params.id;
    const cats_products = require('./datos/cats_products/'+id+'.json');
    res.json(cats_products);
});

app.get('/products/:id',(req, res)=>{
    let id = req.params.id;
    const products = require('./datos/products/'+id+'.json');
    res.json(products);
});

app.get('/products_comments/:id',(req, res)=>{
    let id = req.params.id;
    const products_comments = require('./datos/products_comments/'+id+'.json');
    res.json(products_comments);
});

app.listen(puerto,()=>{
    console.log('Servidor funcionando en el puerto '+puerto);
});