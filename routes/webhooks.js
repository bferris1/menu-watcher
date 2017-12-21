let express = require('express');
let router = express.Router();
const dialogActions = require('../util/dialog-actions');


router.post('/', (req, res) => {
	if (req.body.result.action === 'get_top_dining_court') {
		dialogActions.getBestDiningCourt(req.body)
			.then(response => res.json(response))
			.catch(() => res.status(500).json({speech: 'An error occurred'}));
	} else {
		return res.json({speech: 'Only top dining court actions are supported right now.'});
	}
});

module.exports = router;
