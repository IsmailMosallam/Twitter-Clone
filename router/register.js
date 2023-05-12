const express = require('express')
const middleware = require('../middleware/login')
var colors = require('colors');
const Users = require('../Schema/user');
const users = require('../Schema/user');


const router = express.Router();


router.get('/', (req, res) => {
    res.status(200).render("register")

});
router.post('/', async(req, res) => {
    var firstName = req.body.firstName.trim();
    var lastName = req.body.lastName.trim();
    var userName = req.body.userName.trim();
    var email = req.body.email.trim();
    var password = req.body.password.trim();


    var payload = req.body;
    if (firstName && lastName && email && userName && password) {
        var user = await Users.findOne({
            $or: [{
                    userName: userName
                },
                {
                    email: email
                }
            ]
        })

        .catch((err) => {
            payload.errorMessage = err
            res.status(200).render("register", payload)

        })

        if (user === null) {
            try {
                const user = req.body
                await users.create(user)
                req.session.user = user;
                res.status(200).redirect('/home')
            } catch (err) {
                payload.errorMessage = err
                res.status(200).render("register", payload)


            }
        } else {
            if (email === user.email) {
                payload.errorEmail = "email Already is used"
                res.status(200).render("register", payload)

            } else {
                payload.errorUsername = "username Already is used"
                res.status(200).render("register", payload)
            }
        }
    } else {
        body.errorMessage = "Make sure each field has a valid value."
        res.status(200).render("register", body)
    }
})


module.exports = router