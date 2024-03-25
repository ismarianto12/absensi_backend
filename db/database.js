import { Sequelize } from "sequelize";
const db = new Sequelize('alumni', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    port: '3308'
})

export default db;