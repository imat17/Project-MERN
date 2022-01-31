// Importation du schéma
const UserModel = require('../models/user.model');
const objectId = require('mongoose').Types.ObjectId;

// Avoir tout les utilisateurs
module.exports.getAllUsers = async (req, res) => {
	const users = await UserModel.find().select('-password');
	res.status(200).json(users);
};

// Avoir un seul utilisateur
module.exports.getOneUser = async (req, res) => {
	if (!objectId.isValid(req.params.id))
		return res.status(400).send('ID Inconnu : ' + req.params.id);

	UserModel.findById(req.params.id, (err, docs) => {
		if (!err) res.send(docs);
		else console.log('ID Inconnu : ' + err);
	}).select('-password');
};

// Modifier un utilisateur
module.exports.updateUser = async (req, res) => {
	if (!objectId.isValid(req.params.id))
		return res.status(400).send('ID Inconnu : ' + req.params.id);

	try {
		await UserModel.findOneAndUpdate(
			{ _id: req.params.id },
			{
				$set: {
					bio: req.body.bio,
				},
			},
			{ new: true, upsert: true, setDefaultsOnInsert: true },
			(err, docs) => {
				if (!err) return res.send(docs);
				if (err) return res.status(500).send({ message: err });
			}
		);
	} catch (err) {
		// return res.status(500).send({ message: err });
	}
};

// Supprimer un utilisateur
module.exports.deleteUser = async (req, res) => {
	if (!objectId.isValid(req.params.id))
		return res.status(400).send('ID Inconnu : ' + req.params.id);

	try {
		await UserModel.deleteOne({ _id: req.params.id }).exec();
		res.status(200).json({ message: 'Utilisateur supprimé' });
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};

// Follow

module.exports.follow =  (req, res) => {
	if (!objectId.isValid(req.params.id) || !objectId.isValid(req.body.idToFollow))
		return res.status(400).send('ID unknown : ' + req.params.id);

	try {
		// add to the follower list
		 UserModel.findByIdAndUpdate(
			req.params.id,
			{ $addToSet: { following: req.body.idToFollow } },
			{ new: true, upsert: true },
			(err, docs) => {
				if (!err) res.status(201).json(docs);
				else return res.status(400).json(err);
			}
		);
		// add to following list
		 UserModel.findByIdAndUpdate(
			req.body.idToFollow,
			{ $addToSet: { followers: req.params.id } },
			{ new: true, upsert: true },
			(err, docs) => {
				// if (!err) res.status(201).json(docs);
				if (err) return res.status(400).json(err);
			}
		);
	} catch (err) {
		// return res.status(500).json({ message: err });
	}
};

// Unfollow
module.exports.unfollow =  (req, res) => {
	if (!objectId.isValid(req.params.id) || !objectId.isValid(req.body.idToUnfollow))
		return res.status(400).send('ID unknown : ' + req.params.id);

	try {
		 UserModel.findByIdAndUpdate(
			req.params.id,
			{ $pull: { following: req.body.idToUnfollow } },
			{ new: true, upsert: true },
			(err, docs) => {
				if (!err) res.status(201).json(docs);
				else return res.status(400).jsos(err);
			}
		);
		// remove to following list
		 UserModel.findByIdAndUpdate(
			req.body.idToUnfollow,
			{ $pull: { followers: req.params.id } },
			{ new: true, upsert: true },
			(err, docs) => {
				// if (!err) res.status(201).json(docs);
				if (err) return res.status(400).jsos(err);
			}
		);
	} catch (err) {
		// return res.status(500).json({ message: err });
	}
};
