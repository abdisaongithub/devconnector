const express = require('express')
const {check, validationResult} = require('express-validator')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')


const User = require('../../models/User')

// @route   GET api/users
// @desc    Register a user
// @access  Public

router.post('/', [
        check('name', 'Name is required')
            .not()
            .isEmpty(),
        check('email', 'Please include a valid email')
            .isEmail(),
        check('password', 'Please enter a password with 6 or more characters')
            .isLength({min: 6})
    ],
    async  (req, res) => {
        console.log('request received')
        console.log(req.body)
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        }

        const { name, email, password } = req.body

        try {
            let user = await User.findOne({ email })
            if(user){
                res.status(400).json({errors: [{ msg: 'User already exists' }]})
            }

            const avatar = await gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm',
            })

            user = new User({
                name,
                email,
                password,
                avatar
            })

            const salt = await bcrypt.genSalt(10)

            user.password = await bcrypt.hash(password, salt)

            user = await user.save()
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                    if(err) throw err
                    return res.json({ token })
                },
            )
        } catch (e) {
            console.error(e)
            return res.status(500).send("Server Error")
        }

    });

module.exports = router;