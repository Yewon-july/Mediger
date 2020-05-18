module.exports = (sequelize, DataTypes) => {
    return sequelize.define('schedule', {
        scheID: { 
            type: DataTypes.INTEGER(15),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
        },
        scheName: {
            type: DataTypes.STRING(50),
        },
        userID: {
            type: DataTypes.INTEGER(15),
            allowNull: false,
        },
        scheDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        scheHour: {
            type: DataTypes.INTEGER(2),
            allowNull: false,
        },
        scheMin: {
            type: DataTypes.INTEGER(2),
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        intake: {
            type: DataTypes.BOOLEAN, //복용했으면 1 안했으면 0
            allowNull: false,
            defaultValue: 0,
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