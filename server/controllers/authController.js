const User = require('../models/user')
const {hashPassword, comparePassword} = require('../helpers/auth');

const test = (req, res) => {
    res.json('test de travail')
}
// Register
const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        // vérifiez si le nom a été saisi
        if (!name) {
            return res.json({
                error: 'name is required'
            })
        };
        // vérifiez si le password est bon
        if (! password || password.length < 6) {
          return res.json({
            error:'mot de passe  requis doit comporter au moins 6 caractères'
          })  
        };
        // vérifiez le email
        const exist = await User.findOne({email});
        if (exist) {
            return res.json({
                error: "l'email est déjà pris"
            })
        }
        const hashedPassword = await hashPassword(password)
        // creation de user database
        const user = await User.create({
            name, 
            email, 
            password: hashedPassword,
        })
        return res.json(user)
    } catch (error) {
        console.log(error);
    }
};

// Login
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        // verifiez si user existe
        const user = await User.findOne({email});
        if (!user) {
            return res.json({
                error: 'No user found'
            })
        }

        // verifiez si le mot est correcte
        const match = await comparePassword(password, user.password)
        if (match) {
           res.json('passwords match') 
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    test,
    registerUser,
    loginUser
};