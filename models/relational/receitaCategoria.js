module.exports = (sequelize, DataTypes) => {
    const receitaCategoria = sequelize.define('receitaCategoria', {}, {
        tableName: 'receita_categoria'
    });

    return receitaCategoria;
}