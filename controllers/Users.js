import Users from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// const { QueryTypes } = require('sequelize');


export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'name', 'email']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

export const Register = async (req, res) => {
    const { name, email, password, confPassword, username } = req.body;
    if (password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password tidak cocok" });
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            username: username,
            name: name,
            email: email,
            password: hashPassword
        });
        res.json({ msg: "Register Berhasil" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error });
    }
}

export const Login = async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await Users.findOne({
            where: {
                username: username
            }
        })
        // console.log(user.password, "parameter user")
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ msg: "Wrong Password" });
        const userId = user.id;
        const name = user.name;
        const email = user.username; 
        const accessToken = jwt.sign({ userId, name, username }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1500s'
        });
        const refreshToken = jwt.sign({ userId, name, username }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1500d'
        });
        await Users.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({
            messages: 'request login successfully',
            token: accessToken
        });
    } catch (error) {
        console.log(error, 'errornya')
        res.status(404).json({ messages: 'access error' });
    }
}

export const ValidateToken = (req, res) => {

    if (req.headers && req.headers.Authorization) {
        var authorization = req.headers.Authorization.split(' ')[1],
            decoded;
        // try {

        const secretToken = process.env.ACCESS_TOKEN_SECRET
        decoded = jwt.verify(authorization, secretToken);
        // } catch (e) {
        //     return res.status(401).send('unauthorized');
        // }
        var userId = decoded.id;
        // Fetch the user by id 
        console.log(decoded, 'dateil decoded')
        Users.findOne({ id: userId }).then(function (user) {
            // Do something with the user
            // return res.send(200);
            res.status(200).json(user)
        });
    }
    res.status(200).json({
        data: []
    })
}


export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where: {
            refresh_token: refreshToken
        }
    });
    if (!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({ refresh_token: null }, {
        where: {
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}