import db from "../models/index.js";

export const getAllAuctions = async (req, res) => {
	try {
		// Récupération des enchères avec leurs relations
		const auctions = await db.AuctionPrice.findAll({
			include: [
				{
					model: db.User,
					as: "user",
					attributes: ["id", "username"], // Sélectionner uniquement les champs nécessaires
				},
				{
					model: db.Synthetiser,
					as: "synthetiser",
					attributes: ["id", "marque", "modele", "image_url"], // Sélectionner uniquement les champs nécessaires
				},
			],
			order: [["createdAt", "DESC"]], // Tri par date de création décroissante
			attributes: {
				exclude: ["userId"], // Exclure les champs sensibles
			},
		});

		// Retourner les résultats
		res.json({
			success: true,
			data: auctions,
		});
	} catch (error) {
		console.error("Erreur lors de la récupération des enchères:", error);
		res.status(500).json({
			success: false,
			error: "Erreur lors de la récupération des enchères",
			details: error.message,
		});
	}
};

export const getLatestAuctionBySynthId = async (req, res) => {
	try {
		const synthId = req.params.synthId; // ou req.query.synthId selon votre route

		const latestAuction = await db.AuctionPrice.findOne({
			where: { synthId },
			order: [["createdAt", "DESC"]],
		});

		if (!latestAuction) {
			return res.status(404).json({
				success: false,
				message: "Aucune enchère trouvée pour ce synthétiseur",
			});
		}

		return res.status(200).json({
			success: true,
			data: latestAuction,
		});
	} catch (error) {
		console.error("Erreur lors de la récupération de l'enchère:", error);
		return res.status(500).json({
			success: false,
			message: "Erreur lors de la récupération de l'enchère",
			error: error.message,
		});
	} 
};

// controllers/auctionController.js
export const createAuction = async (req, res) => {
	try {
		const { proposal_price, userId, synthetiserId, status } = req.body;

		// Validation des données
		if (!proposal_price || !userId || !synthetiserId) {
			return res.status(400).json({
				message: "Prix, userId et synthetiserId sont requis",
			});
		}

		// Création de l'enchère avec le modèle AuctionPrice
		const newAuction = await db.AuctionPrice.create({
			proposal_price: Number(proposal_price),
			userId: Number(userId),
			synthetiserId: Number(synthetiserId),
			status: status || "active",
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		// Vérification que l'enchère a bien été créée
		if (!newAuction) {
			throw new Error("Erreur lors de la création de l'enchère");
		}

		// Retourner la nouvelle enchère créée
		res.status(201).json(newAuction);
	} catch (error) {
		console.error("Erreur lors de la récupération des enchères:", error);
		res.status(500).json({
			success: false,
			error: "Erreur lors de la récupération des enchères",
			details: error.message,
		});
	}
};

// Dans controllers/auctionController.js
export const deleteAuction = async (req, res) => {
	try {
		const { auctionId } = req.params;
		console.log("Tentative de suppression de l'enchère:", auctionId);

		// Vérification que l'enchère existe avant suppression
		const auction = await db.AuctionPrice.findByPk(auctionId);

		if (!auction) {
			return res.status(404).json({
				message: "Enchère non trouvée",
			});
		}

		// Suppression
		await auction.destroy({ force: true });

		console.log("Enchère supprimée avec succès:", auctionId);
		res.status(204).send();
	} catch (error) {
		console.error("Erreur dans deleteAuction:", error);
		res.status(500).json({ message: "Erreur serveur", error: error.message });
	}
};


