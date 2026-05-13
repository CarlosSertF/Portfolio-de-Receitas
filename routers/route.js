const express = require('express');
const db = require('../config/db_sequelize');
const controllerUsuario = require('../controllers/controllerUsuario');
const controllerComentario = require('../controllers/controllerComentario');
const controllerCategoria = require('../controllers/controllerCategoria');
const controllerReceita = require('../controllers/controllerReceita');
const controllerHabilidade = require('../controllers/controllerHabilidade');
const controllerUsuarioHabilidade = require('../controllers/controllerUsuarioHabilidade');
const controllerPublic = require('../controllers/controllerPublic');
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

// Rotas Públicas (sem login)
route.get("/public/receitas", middleware.publicAccess, controllerPublic.getPublicRecipes);
route.get("/public/categorias", middleware.publicAccess, controllerPublic.getPublicCategories);
route.get("/public/receitas/categoria/:id", middleware.publicAccess, controllerPublic.getPublicRecipesByCategory);
route.get("/public/relatorio-habilidades", middleware.publicAccess, controllerPublic.getSkillReport);

//Controller Usuario
route.get("/", controllerUsuario.getLogin);
route.post("/login", controllerUsuario.postLogin);
route.get("/usuarioCreate", middleware.onlyAdmin, controllerUsuario.getCreate);
route.post("/usuarioCreate", middleware.onlyAdmin, controllerUsuario.postCreate);
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

//Controller Habilidade
route.get("/habilidadeCreate", middleware.onlyAdmin, controllerHabilidade.getCreate);
route.post("/habilidadeCreate", middleware.onlyAdmin, controllerHabilidade.postCreate);
route.get("/habilidadeList", middleware.onlyAdmin, controllerHabilidade.getList);
route.get("/habilidadeUpdate/:id", middleware.onlyAdmin, controllerHabilidade.getUpdate);
route.post("/habilidadeUpdate", middleware.onlyAdmin, controllerHabilidade.postUpdate);
route.get("/habilidadeDelete/:id", middleware.onlyAdmin, controllerHabilidade.getDelete);

//Controller Receita
route.get("/receitaCreate", controllerReceita.getCreate);
route.post("/receitaCreate", controllerReceita.postCreate);
route.get("/receitaList", controllerReceita.getList);
route.get("/receitaUpdate/:id", middleware.onlyRecipeResponsible, controllerReceita.getUpdate);
route.post("/receitaUpdate", middleware.onlyRecipeResponsible, controllerReceita.postUpdate);
route.get("/receitaDelete/:id", middleware.onlyRecipeResponsible, controllerReceita.getDelete);

// Controller Usuario Habilidade
route.get("/usuarioHabilidadeList", controllerUsuarioHabilidade.getList);
route.get("/usuarioHabilidadeCreate", controllerUsuarioHabilidade.getCreate);
route.post("/usuarioHabilidadeCreate", controllerUsuarioHabilidade.postCreate);
route.get("/usuarioHabilidadeUpdate/:id", controllerUsuarioHabilidade.getUpdate);
route.post("/usuarioHabilidadeUpdate", controllerUsuarioHabilidade.postUpdate);
route.get("/usuarioHabilidadeDelete/:id", controllerUsuarioHabilidade.getDelete);

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

module.exports = route;