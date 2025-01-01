import { Sequelize } from "sequelize";
import config from "../config/config.js";
import dotenv from "dotenv";

dotenv.config();

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize({
    database: dbConfig.database,
    username: dbConfig.username,
    password: dbConfig.password,
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    logging: env === "development" ? console.log : false, // Logs SQL uniquement en dev
    dialectOptions: {
		connectTimeout: 60000, // Timeout de connexion plus long
        ssl: env === "production" ? {
            require: true,
            rejectUnauthorized: false
        } : false
    }
});


// Fermeture propre des connexions
process.on('SIGTERM', async () => {
    try {
        await sequelize.close();
        console.log('Connexions fermées');
        process.exit(0);
    } catch (err) {
        console.error('Erreur lors de la fermeture des connexions:', err);
        process.exit(1);
    }
});



// Une seule fonction de test de connexion
const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log(`Database connected successfully in ${env} mode`);
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        // En production, on peut vouloir arrêter le processus
        if (env === "production") {
            process.exit(1);
        }
    }
};

// Exécuter le test de connexion
initializeDatabase();

export default sequelize;
