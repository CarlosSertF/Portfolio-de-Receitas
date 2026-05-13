const db = require('../config/db_sequelize')
const path = require('path')
module.exports = {
    async getCreate(req, res){
        var categorias = await db.Categoria.findAll()
        var usuario = await db.Usuario.findAll()
        res.render('receita/receitaCreate',
        {categorias: categorias.map(catg => catg.toJSON()), usuario: usuario.map(user => user.toJSON())});
    },
    async postCreate(req, res){
        try{
            const receita = await db.Receita.create({
                nome: req.body.nome,
                ingredientes: req.body.ingredientes,
                preparo: req.body.preparo
            });
            await receita.addCategoria(req.body.categorias);
            await receita.addUsuario(req.body.usuarios);
            res.redirect('/home');
        }catch(err){
            console.log(err)
        }
    },
    async getList(req, res){
        db.Receita.findAll({include: [db.Categoria, db.Usuario]})
        .then(receitas => {
            console.log(receitas[0].toJSON())
            res.render('receita/receitaList',
            {receitas:receitas.map(receita => receita.toJSON())})       
        }).catch((err) => {console.log(err)});
    },
    async getUpdate(req, res){
        var categorias = await db.Categoria.findAll()
        var usuario = await db.Usuario.findAll()
        await db.Receita.findByPk(req.params.id)
        .then(
            receita => res.render('receita/receitaUpdate',{
                receita:receita.dataValues,
                categorias:categorias.map(catg => catg.toJSON()),
                usuario: usuario.map(user => user.toJSON())
            })
        ).catch(function(err){console.log(err)})
    },
    async postUpdate(req, res){
        try{
            await db.Receita.update({
                nome: req.body.nome,
                ingredientes: req.body.ingredientes,
                preparo: req.body.preparo
            }, {where: {id: req.body.id}
        });
        const receita = await db.Receita.findByPk(req.body.id);
        await receita.setCategoria(req.body.categorias);
        await receita.setUsuarios(req.body.usuarios);
        res.redirect('/home');
        }catch(err){
            console.log(err)
        }
    },
    async getDelete(req, res){
        await db.Receita.destroy({where: {id: req.params.id}})
        .then(res.render('home'))
        .catch(err => {console.log(err)})
    }
}