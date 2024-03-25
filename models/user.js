import { Sequelize } from "sequelize";
// import db from "../db/connect.js";
import db from "../db/database.js";

const { DataTypes } = Sequelize;

const Users = db.define('users', {
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    refresh_token: {
        type: DataTypes.TEXT
    }
}, {
    freezeTableName: true,
    timestamps: false,
    
});

(async () => {
    await db.sync();
})();

export default Users;