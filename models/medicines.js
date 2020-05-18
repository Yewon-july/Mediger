module.exports = (sequelize, DataTypes) => {
    return sequelize.define('medicine', {
        medicineID: {
            type: DataTypes.INTEGER(15),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        medicineName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        isApi: {
            type: DataTypes.BOOLEAN, //true 1 false 0
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