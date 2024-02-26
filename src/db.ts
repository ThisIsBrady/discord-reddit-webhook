import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

try {
    sequelize.authenticate();
    console.log('DB Connection established successfully');
} catch (e) {
    console.error('Unable to connect to DB: ', e);
    process.exit(1);
}

const Hooks = sequelize.define('hooks', {
    hook: {
        type: DataTypes.STRING(255),
        primaryKey: true,
    },
    sub: {
        type: DataTypes.STRING(20),
        primaryKey: true,
    },
    lastPostTimestamp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
});

await sequelize.sync();

export { Hooks };
