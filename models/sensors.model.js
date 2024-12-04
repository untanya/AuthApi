const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Sensor = sequelize.define('Sensor', {
    id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    location: {
        type: DataTypes.STRING(200),
        allowNull: true
    }
}, {
    tableName: 'Sensors',
    timestamps: false
});

module.exports = Sensor;