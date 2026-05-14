module.exports = (sequelize, Sequelize) => {
    const UsuarioHabilidade = sequelize.define('usuario_habilidade', {
        nivel: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
                max: 10
            }
        }
    }, {
        tableName: 'usuario_habilidade',
        indexes: [
            {
                unique: true,
                fields: ['usuarioId', 'habilidadeId']
            }
        ]
    });
    return UsuarioHabilidade;
};