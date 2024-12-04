// models/LightMeasurement.js
const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Sensor = require('./sensors.model');

const LightMeasurement = sequelize.define('LightMeasurement', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    value_lux: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    sensor_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
            model: Sensor,
            key: 'id'
        }
    }
}, {
    tableName: 'LightMeasurements',
    timestamps: false
});

LightMeasurement.belongsTo(Sensor, { foreignKey: 'sensor_id' });
Sensor.hasMany(LightMeasurement, { foreignKey: 'sensor_id' });

module.exports = LightMeasurement;