module.exports = function (context) {

	const projectId = "Demo Kunde";
	var baseUrl = 'https://typo3-master.ddev.site';
	const cookiePath = __dirname + "/backstop_data/engine_scripts/cookies-" + context + ".json";
	switch (context) {
		case 'dev':
			baseUrl = "https://typo3-master.ddev.site";
			break;
		case 'ref':
			baseUrl = "https://typo3-master.ddev.site";
			break;
	}

	const viewports = [
		"desktop",
		"phone"
	];

	return {
		baseUrl,
		projectId,
		viewports,
		cookiePath
	}
};
