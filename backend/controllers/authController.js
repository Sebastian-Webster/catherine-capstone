import Models from "../models/index.js";
import bcrypt from 'bcrypt';

const signIn = async (req, res) => {

    const foundUser = await Models.User.findOne({where: {email: req.body.email}})

    if(foundUser) {
        const passwordValid = await verifyPassword(req.body.password, foundUser.password);
        if (passwordValid) {
            const userInfo = foundUser;
            req.session.user = foundUser.id;
            req.session.save((err) => {
                console.log('Worked')
                console.error('err:', err)
            });
            console.log(req.session);
            res.send({result: 200, msg: 'Aunthentication successful!', sessionId: req.session.id, userId: userInfo.id })
        }else {
            res.send({result: 203, msg: "Password is wrong."})
        }
    } else {
        res.send({result: 204, msg: "User can not be found"})
    }
}

const verifyPassword = (enteredPassword, originalPassword) => {
    const matched = bcrypt.compare(enteredPassword, originalPassword);
    return matched;
  }

const signOut = (req, res) => {
    console.log('Signing out')
    req.session.destroy();
    res.send({result: 200, msg: "Signed out successfully!"})
}

// Sing up
const singUp = async (req, res) => {
    const existUser = await Models.User.findOne({ where: { email: req.body.email } });

    if(existUser === null ){
        Models.User.create(req.body)
        .then((data)=>res.send({result: 200, data: data}))
        .catch(error => {throw error})
    }else {
        res.send({result: 204, msg: "User already exists."})
    }

}
const Controllers = {
    signIn,
    signOut,
    singUp
}

export default Controllers;