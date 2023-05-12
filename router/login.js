const express = require('express')
const middleware = require('../middleware/login')
var colors = require('colors');
const Users = require('../Schema/user');
const bcrypt = require('bcrypt')

const router = express.Router();


router.get('/', (req, res) => {
    res.status(200).render("login")

});
router.post('/', async(req, res) => {
    var payload = req.body;

    if (req.body.logUsername && req.body.logPassword) {
        var user = await Users.findOne({
                $or: [
                    { userName: req.body.logUsername },
                    { email: req.body.logUsername }
                ]
            })
            .catch((error) => {
                console.log(error);
                payload.errorMessage = "Something went wrong.";
                res.status(200).render("login", payload);
            });

        if (user != null) {
            var result = await bcrypt.compare(req.body.logPassword, user.password);

            if (result === true) {
                req.session.user = user;
                return res.redirect("/home");
            }
        }

        payload.errorMessage = "Login credentials incorrect.";
        return res.status(200).render("login", payload);
    }

    payload.errorMessage = "Make sure each field has a valid value.";
    res.status(200).render("login");
});



module.exports = router

module.exports = router