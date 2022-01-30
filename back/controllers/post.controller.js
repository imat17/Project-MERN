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

module.exports.createPost = (req, res) => {};

module.exports.updatePost = (req, res) => {};

module.exports.deletePost = (req, res) => {};
