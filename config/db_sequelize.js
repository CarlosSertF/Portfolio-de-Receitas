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
db.Receita.belongsToMany(db.Categoria, {
    through: 'receita_categoria',
    foreignKey: 'receitaId'
});
db.Categoria.belongsToMany(db.Receita, {
    through: 'receita_categoria',
    foreignKey: 'categoriaId'
});      
module.exports = db;