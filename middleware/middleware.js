const db = require('../config/db_sequelize');

module.exports = {
    logRegister(req, res, next){
        console.log(`${req.method} ${req.url} ${new Date().toISOString()}`);
        next();
    },
    sessionControl(req, res, next){
        res.locals.login = req.session.login;
        res.locals.admin = req.session.admin;
        res.locals.isAdmin = req.session.admin === true;

        if (req.session.login != undefined) 
            next();

        else if ((req.url == '/') && (req.method == 'GET'))
            next();

        else if ((req.url == '/login') && (req.method == 'POST'))
            next();

        else if ((req.url).split('/')[1] == 'recuperarSenha')
            next();

        else if ((req.url).startsWith('/public'))
            next();
        else
            res.redirect('/');
    },
    onlyAdmin(req, res, next){
        if (req.session.admin === true) 
            next();
        else
            res.send("Acesso negado");
    },
    async onlyRecipeResponsible(req, res, next){
        if (req.session.admin === true) {
            return next();
        }

        const receitaId = req.params.id || req.body.id;
        const userId = req.session.userId;

        if (!receitaId || !userId) {
            return res.send("Acesso negado");
        }

        try {
            const receita = await db.Receita.findByPk(receitaId, { include: db.Usuario });
            if (!receita) {
                return res.redirect('/home');
            }

            const responsavel = receita.usuarios.some(usuario => usuario.id === userId);
            if (responsavel) {
                return next();
            }

            return res.send("Acesso negado");
        } catch (err) {
            console.log(err);
            return res.send("Acesso negado");
        }
    },
    publicAccess(req, res, next){
        
        next();
    }
};