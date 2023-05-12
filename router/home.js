const express = require('express')
const middleware = require('../middleware/login')
const router = express.Router();

router.get('/', middleware.login, (req, res) => {
    var pay_lout = {
        pageTitle: "Twitter",
        userLogin: req.session.user,
        userLoginJs: JSON.stringify(req.session.user)
    }
    res.status(200).render("home", pay_lout)
});
module.exports = router