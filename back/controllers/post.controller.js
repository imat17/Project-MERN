// Importation des schémas
const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const objectId = require('mongoose').Types.ObjectId;

module.exports.readPost = (req, res) => {
	PostModel.find((err, docs) => {
		console.log(docs);
		if (!err) res.send(docs);
		else console.log('Erreur, impossible de récuperer les données' + err);
	});
};

module.exports.createPost = async (req, res) => {
	const newPost = new PostModel({
		posterId: req.body.posterId,
		message: req.body.message,
		video: req.body.video,
		likers: [],
		comments: [],
	});

	try {
		const post = await newPost.save();
		return res.status(201).json(post);
	} catch (err) {
		return res.status(400).send(err);
	}
};

module.exports.updatePost = (req, res) => {
	if (!objectId.isValid(req.params.id)) return res.status(400).send('ID iconnu :' + req.params.id);

	const updatedPost = {
		message: req.body.message,
	};
	PostModel.findOneAndUpdate(req.params.id, { $set: updatedPost }, { new: true }, (err, docs) => {
		if (!err) res.send(docs);
		else console.log('Erreur de modification :' + err);
	});
};

module.exports.deletePost = (req, res) => {
	if (!objectId.isValid(req.params.id)) return res.status(400).send('ID iconnu :' + req.params.id);

	PostModel.findByIdAndDelete(req.params.id, (err, docs) => {
		if (!err) res.send(docs);
		else console.log('Impossible de supprimer le post' + err);
	});
};

// ----------------------------- LIKE / UNLIKE -----------------------------

module.exports.likePost = (req, res) => {
	if (!objectId.isValid(req.params.id))
		return res.status(400).send('ID unknown : ' + req.params.id);

	try {
		PostModel.findByIdAndUpdate(
			req.params.id,
			{
				$addToSet: { likers: req.body.id },
			},
			{ new: true },
			(err, docs) => {
				if (err) return res.status(400).send(err);
			}
		);
		UserModel.findByIdAndUpdate(
			req.body.id,
			{
				$addToSet: { likes: req.params.id },
			},
			{ new: true },
			(err, docs) => {
				if (!err) res.send(docs);
				else return res.status(400).send(err);
			}
		);
	} catch (err) {
		return res.status(400).send(err);
	}
};

module.exports.unlikePost = (req, res) => {
	if (!objectId.isValid(req.params.id)) return res.status(400).send('ID iconnu :' + req.params.id);

	try {
		PostModel.findByIdAndUpdate(
			req.params.id,
			{
				$pull: { likers: req.body.id },
			},
			{ new: true },
			(err, docs) => {
				if (err) return res.status(400).send(err);
			}
		);
		UserModel.findByIdAndUpdate(
			req.body.id,
			{
				$pull: { likes: req.params.id },
			},
			{ new: true },
			(err, docs) => {
				if (!err) res.send(docs);
				else return res.status(400).send(err);
			}
		);
	} catch (err) {
		return res.status(400).send(err);
	}
};
