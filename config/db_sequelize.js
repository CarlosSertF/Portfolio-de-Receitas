const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, 
    {
    host: process.env.DB_HOST, 
    dialect: 'postgres'
    }
);

var db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Usuario = require ('../models/relational/usuario.js')
    (sequelize, Sequelize);
db.Receita = require('../models/relational/receita.js')
    (sequelize, Sequelize);
db.Categoria = require('../models/relational/categoria.js')
    (sequelize, Sequelize);
db.Habilidade = require('../models/relational/habilidade.js')
    (sequelize, Sequelize);
db.UsuarioHabilidade = require('../models/relational/usuarioHabilidade.js')
    (sequelize, Sequelize);
db.Receita.belongsToMany(db.Categoria, {
    through: 'receita_categoria',
    foreignKey: 'receitaId'
});
db.Categoria.belongsToMany(db.Receita, {
    through: 'receita_categoria',
    foreignKey: 'categoriaId'
});
db.Usuario.belongsToMany(db.Receita, {
    through: 'usuario_receita',
    foreignKey: 'usuarioId'
});
db.Receita.belongsToMany(db.Usuario, {
    through: 'usuario_receita',
    foreignKey: 'receitaId'
});
db.Usuario.belongsToMany(db.Habilidade, {
    through: db.UsuarioHabilidade,
    foreignKey: 'usuarioId'
});
db.Habilidade.belongsToMany(db.Usuario, {
    through: db.UsuarioHabilidade,
    foreignKey: 'habilidadeId'
});
module.exports = db;