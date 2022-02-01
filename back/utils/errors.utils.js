// Gestion des erreurs diverses lors du signUp
module.exports.signUpErrors = (err) => {
	let errors = { pseudo: '', email: '', password: '' };
	if (err.message.includes('pseudo')) errors.pseudo = 'Pseudo incorrect ou déjà utilisé';
	if (err.message.includes('password'))
		errors.password = 'Mot de passe invalide (minimum 6 caractères)';
	if (err.message.includes('email')) errors.email = 'Email invalide';
	if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('pseudo'))
		errors.pseudo = 'Cet pseudo est déjà utilisé';
	if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('email'))
		errors.email = 'Cet email est déjà enregistré';

	return errors;
};

//  Gestion des erreurs diverses lors du signIn ---PROBLEME ?? a tester ---
module.exports.signInErrors = (err) => {
	let errors = { email: '', password: '' };

	if (err.message.includes('email')) errors.email = 'Email inconnu';

	if (err.message.includes('password')) errors.password = 'Le mot de passe ne correspond pas';

	return errors;
};

// Gestion des erreurs upload
module.exports.uploadErrors = (err) => {
	let errors = { format: '', maxSize: '' };

	if (err.message.includes('invalid file')) errors.format = 'Format incompatabile';

	if (err.message.includes('max size')) errors.maxSize = 'Le fichier dépasse 500ko';

	return errors;
};
