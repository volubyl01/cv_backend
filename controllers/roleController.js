import db from "../models/index.js";


// Fonction pour obtenir tous les roles
export const getAllRoles = async (req, res) => {
    try {
        const roles = await db.Role.findAll();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve roles' });
    }  finally {
        // Libère explicitement la connexion
        await sequelize.connectionManager.releaseConnection(connection);
    }
};

// Fonction pour créer un nouveau role
export const createRole = async (req, res) => {
    try {
        const newRole = await db.Role.create(req.body);
        res.status(201).json(newRole);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create role' });
    }  finally {
        // Libère explicitement la connexion
        await sequelize.connectionManager.releaseConnection(connection);
    }
};

// Exporter les fonctions avec un export par défaut 
export default { getAllRoles, createRole};