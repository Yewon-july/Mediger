module.exports = (sequelize, DataTypes) => {
    return sequelize.define('mediSchedules', {
        mediSchedulesID: {
            type: DataTypes.INTEGER(15),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        scheID: { 
            type: DataTypes.INTEGER(10),
            allowNull: false,
        },
        medicineID: {
            type: DataTypes.INTEGER(15),
            allowNull: false,
        },
        medicineName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        dose: {
            type: DataTypes.STRING(50),
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