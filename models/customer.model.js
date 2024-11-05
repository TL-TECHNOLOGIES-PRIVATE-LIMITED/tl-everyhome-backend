import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Customer = sequelize.define('Customer', {
    customerId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    phoneNumber: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    provider: {
        type: DataTypes.STRING(10),
        validate: {
            isIn: [['Google', 'Facebook', null]],
        },
    },
    providerId: {
        type: DataTypes.STRING(255),
        unique: true,
    }
}, {

    tableName: 'Customers',
    timestamps: true,
    hooks: {
        beforeUpdate: (customer, options) => {
            customer.UpdatedAt = new Date();
        },
    },
});

export default Customer;