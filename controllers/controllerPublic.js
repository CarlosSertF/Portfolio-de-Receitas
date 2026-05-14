const db = require('../config/db_sequelize');

module.exports = {
    async getPublicRecipes(req, res){
        db.Receita.findAll({include: [db.Categoria, db.Usuario]})
        .then(receitas => {
            res.render('public/receitaPublicList', {
                receitas: receitas.map(receita => receita.toJSON()),
                layout: 'noMenu.handlebars'
            });
        }).catch((err) => { console.log(err); });
    },
    async getPublicRecipesByCategory(req, res){
        const categoriaId = req.params.id;
        db.Receita.findAll({
            include: [
                { model: db.Categoria, where: { id: categoriaId } },
                db.Usuario
            ]
        })
        .then(receitas => {
            res.render('public/receitaPublicList', {
                receitas: receitas.map(receita => receita.toJSON()),
                layout: 'noMenu.handlebars'
            });
        }).catch((err) => { console.log(err); });
    },
    async getPublicCategories(req, res){
        db.Categoria.findAll()
        .then(categorias => {
            res.render('public/categoriaPublicList', {
                categorias: categorias.map(cat => cat.toJSON()),
                layout: 'noMenu.handlebars'
            });
        }).catch((err) => { console.log(err); });
    },
    async getSkillReport(req, res){
        try {
            const habilidades = await db.Habilidade.findAll({
                include: {
                    model: db.Usuario,
                    through: { attributes: ['nivel'] }
                }
            });

            const report = habilidades.map(habilidade => {
                const totalAlunos = habilidade.usuarios.length;
                const niveis = {};
                for (let i = 0; i <= 10; i++) {
                    niveis[i] = 0;
                }
                habilidade.usuarios.forEach(usuario => {
                    const nivel = usuario.usuario_habilidade.nivel;
                    niveis[nivel]++;
                });
                return {
                    nome: habilidade.nome,
                    totalAlunos,
                    niveis
                };
            });

            res.render('public/skillReport', {
                report,
                layout: 'noMenu.handlebars'
            });
        } catch (err) {
            console.log(err);
        }
    }
};