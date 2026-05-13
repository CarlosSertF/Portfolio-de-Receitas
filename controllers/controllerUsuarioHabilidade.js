const db = require('../config/db_sequelize');

module.exports = {
    async getList(req, res){
        try{
            const usuario = await db.Usuario.findByPk(req.session.userId, {
                include: {
                    model: db.Habilidade,
                    through: { attributes: ['nivel'] }
                }
            });
            const habilidades = await db.Habilidade.findAll();

            res.render('usuarioHabilidade/usuarioHabilidadeList', {
                habilidades: habilidades.map(h => h.toJSON()),
                usuario: usuario ? usuario.toJSON() : null
            });
        }catch(err){
            console.log(err);
        }
    },
    async getCreate(req, res){
        try{
            const usuario = await db.Usuario.findByPk(req.session.userId, {
                include: {
                    model: db.Habilidade,
                    through: { attributes: ['nivel'] }
                }
            });
            const habilidades = await db.Habilidade.findAll();
            res.render('usuarioHabilidade/usuarioHabilidadeCreate', {
                habilidades: habilidades.map(h => h.toJSON()),
                usuario: usuario ? usuario.toJSON() : null
            });
        }catch(err){
            console.log(err);
        }
    },
    async postCreate(req, res){
        try{
            const usuarioId = req.session.userId;
            const habilidadeId = req.body.habilidadeId;
            const nivel = Number(req.body.nivel);
            await db.UsuarioHabilidade.upsert({
                usuarioId,
                habilidadeId,
                nivel
            });
            res.redirect('/usuarioHabilidadeList');
        }catch(err){
            console.log(err);
        }
    },
    async getUpdate(req, res){
        try{
            const usuario = await db.Usuario.findByPk(req.session.userId, {
                include: {
                    model: db.Habilidade,
                    through: { attributes: ['nivel'] }
                }
            });
            const habilidade = await db.Habilidade.findByPk(req.params.id);
            if (!usuario || !habilidade) return res.redirect('/usuarioHabilidadeList');
            const registro = usuario.habilidades.find(h => h.id === Number(req.params.id));
            res.render('usuarioHabilidade/usuarioHabilidadeUpdate', {
                habilidade: habilidade.toJSON(),
                nivel: registro ? registro.usuario_habilidade.nivel : 0
            });
        }catch(err){
            console.log(err);
        }
    },
    async postUpdate(req, res){
        try{
            const usuarioId = req.session.userId;
            const habilidadeId = req.body.habilidadeId;
            const nivel = Number(req.body.nivel);
            await db.UsuarioHabilidade.upsert({
                usuarioId,
                habilidadeId,
                nivel
            });
            res.redirect('/usuarioHabilidadeList');
        }catch(err){
            console.log(err);
        }
    },
    async getDelete(req, res){
        try{
            const usuarioId = req.session.userId;
            await db.UsuarioHabilidade.destroy({ where: { usuarioId, habilidadeId: req.params.id } });
            res.redirect('/usuarioHabilidadeList');
        }catch(err){
            console.log(err);
        }
    }
};