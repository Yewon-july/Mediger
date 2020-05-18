module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        userID: {
            type: DataTypes.INTEGER(15),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        userName: {
            type: DataTypes.STRING(32),
            allowNull: false,
            unique: false,
        },
        birth: {
            type: DataTypes.DATE,
            allowNull: false,
            unique: false,
        },
        sex: {
            type: DataTypes.BOOLEAN, //male 0 female 1
            allowNull: false,
            unique: false,
        },
        accompanierName: {
            type: DataTypes.STRING(50),
            allowNull: true,
            unique: false,
        },
        accompanierPhone: {
            type: DataTypes.STRING(20),
            allowNull: true,
            unique: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('now()'),
        },
    },{
        timestamps: false,
    });
};