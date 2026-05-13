
// \begin{lstlisting}
const db = require('../config/db_sequelize');
const path = require('path');

module.exports = {
    async getLogin(req, res){
        res.render('login', {layout: 'noMenu.handlebars'});
    },
    async getLogout(req, res){
        req.session.destroy();
        res.redirect('/');
    },
    async postLogin(req, res){
        db.Usuario.findOne({
            where: {
                login: req.body.login,
                senha: req.body.senha
            }
        }).then(usuario => {
            if (usuario){
                req.session.login = usuario.login;
                req.session.admin = usuario.admin;
                req.session.userId = usuario.id;
                res.redirect('/home');
            } else {
                res.redirect('/');
            }
        }).catch((err) => {
            console.log(err);
            res.redirect('/');
        });
    },
    async getCreate(req,res){
        res.render('usuario/usuarioCreate');
    },
    async postCreate(req, res){
        db.Usuario.create({
            login:req.body.login,
            nome:req.body.nome,
            admin: false,
            senha:req.body.senha
        }).then(() => {
            res.redirect('/');
        }).catch((err)=>{
            console.log(err);
        });
    },
    async getList(req, res){
        db.Usuario.findAll().then(usuarios => {
          res.render('usuario/usuarioList',
          {usuarios: usuarios.map(user => user.toJSON())});  
        }).catch((err)=>{
            console.log(err);
        });
    },
    async getUpdate(req, res){
        await db.Usuario.findByPk(req.params.id)
        .then(usuario => res.render('usuario/usuarioUpdate', 
            {usuario:usuario.dataValues}))
        .catch(function (err) {console.log(err);
        });    
    },
    async postUpdate(req, res){
        await db.Usuario.update(req.body, {where: {id:req.body.id}})
        .then(() => res.redirect('/home'))
        .catch(function (err){console.log(err)})
    },
    async getDelete(req, res){
        await db.Usuario.destroy({where:{id:req.params.id}})
        .then(() => res.redirect('/home'))
        .catch(err => {console.log(err)});
    }
}
