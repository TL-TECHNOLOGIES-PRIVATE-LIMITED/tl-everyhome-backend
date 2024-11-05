import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_SERVER,
  dialect: 'mssql',
  logging: console.log,
  dialectOptions: {
    options: {
      encrypt: true,
      enableArithAbort: true,
    },
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to SQL Server with Sequelize');
    await sequelize.sync();
    console.log('Database synchronized successfully');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
};

export default connectDB;
export { sequelize };
