const express = require('express');
const db = require('../config/db_sequelize');
const controllerUsuario = require('../controllers/controllerUsuario');
const controllerComentario = require('../controllers/controllerComentario');
const controllerCategoria = require('../controllers/controllerCategoria');
const controllerReceita = require('../controllers/controllerReceita');
const route = express.Router();
const middleware = require('../middleware/middleware');

async function iniciar(){

    await db.sequelize.sync();
    
    const adminExiste = await db.Usuario.findOne({where: {login: 'admin'}});
    if(!adminExiste){
        await db.Usuario.create({
            login:'admin', 
            nome:'admin',
            admin: true, 
            senha:'admin'
        });
        console.log('Admin criado com sucesso!');
    }else{
        console.log('Admin já existe!');
    }   
}

iniciar();

module.exports = route;

//Controller Usuario
route.get("/", controllerUsuario.getLogin);
route.post("/login", controllerUsuario.postLogin);
route.get("/usuarioCreate", middleware.onlyAdmin, controllerUsuario.getCreate);
route.post("/usuarioCreate", controllerUsuario.postCreate);
route.get("/usuarioList", middleware.onlyAdmin, controllerUsuario.getList);
route.get("/usuarioUpdate/:id", controllerUsuario.getUpdate);
route.post("/usuarioUpdate", controllerUsuario.postUpdate);
route.get("/usuarioDelete/:id", controllerUsuario.getDelete);

//Controller Categoria
route.get("/categoriaCreate", controllerCategoria.getCreate);
route.post("/categoriaCreate", controllerCategoria.postCreate);
route.get("/categoriaList", controllerCategoria.getList);
route.get("/categoriaUpdate/:id", controllerCategoria.getUpdate);
route.post("/categoriaUpdate", controllerCategoria.postUpdate);
route.get("/categoriaDelete/:id", controllerCategoria.getDelete);

//Controller Receita
route.get("/receitaCreate", controllerReceita.getCreate);
route.post("/receitaCreate", controllerReceita.postCreate);
route.get("/receitaList", controllerReceita.getList);
route.get("/receitaUpdate/:id", controllerReceita.getUpdate);
route.post("/receitaUpdate", controllerReceita.postUpdate);
route.get("/receitaDelete/:id", controllerReceita.getDelete);

//Controller Comentario
route.get("/comentarioCreate", controllerComentario.getCreate);
route.post("/comentarioCreate", controllerComentario.postCreate);
route.get("/comentarioList", controllerComentario.getList);

//Logout
route.get("/logout", controllerUsuario.getLogout);

//Home
route.get("/home", function (req, res){
    if(req.session.login){
        res.render('home', { login: req.session.login });
    } else {
        res.redirect('/');
    }
});