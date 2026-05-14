const db = require('../config/db_sequelize');

module.exports = {
    async getCreate(req, res){
        res.render('habilidade/habilidadeCreate');
    },
    async postCreate(req, res){
        try{
            await db.Habilidade.create({ nome: req.body.nome });
            res.redirect('/habilidadeList');
        }catch(err){
            console.log(err);
            res.redirect('/habilidadeCreate');
        }
    },
    async getList(req, res){
        db.Habilidade.findAll()
        .then(habilidades => {
            res.render('habilidade/habilidadeList', {habilidades: habilidades.map(h => h.toJSON())});
        }).catch(err => { console.log(err); });
    },
    async getUpdate(req, res){
        await db.Habilidade.findByPk(req.params.id)
        .then(habilidade => {
            res.render('habilidade/habilidadeUpdate', {habilidade: habilidade.dataValues});
        }).catch(err => { console.log(err); });
    },
    async postUpdate(req, res){
        await db.Habilidade.update({ nome: req.body.nome }, { where: { id: req.body.id } })
        .then(() => res.redirect('/habilidadeList'))
        .catch(err => { console.log(err); });
    },
    async getDelete(req, res){
        await db.Habilidade.destroy({ where: { id: req.params.id } })
        .then(() => res.redirect('/habilidadeList'))
        .catch(err => { console.log(err); });
    }
};