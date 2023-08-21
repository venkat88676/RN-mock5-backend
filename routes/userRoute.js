const express=require("express");

const userRoute=express.Router();
const {UserModel} = require("../model/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

userRoute.post("/register",async(req,res)=>{
    let {email,password}=req.body;
    
    try{
        const isUser=await UserModel.findOne({email});
        if(isUser) {
            return res.send({"msg":"Already Register"})
        }
        bcrypt.hash(password, 5 , async(err,hash)=>{
            const user= new UserModel({email,password:hash})
            await user.save();
            res.send({"msg":"Registration Done"})
        })

    }catch(err){
        res.send({"msg":err})
    }
})


userRoute.post("/login", async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await UserModel.findOne({ email })
        if (user) {
            bcrypt.compare(password, user.password, function (err, result) {
                if (result) {
                    let accesstoken = jwt.sign({ "userID": user._id }, 'accesstoken', { expiresIn: "7d" });

                    res.status(201).send({ "msg": "login success", "token": accesstoken, "user":user })

                } else {
                    res.status(401).send({ "msg": "wrong credential" })
                }
            });
        } else {
            res.status(401).send({ "msg": "User is not found" })

        }
    } catch (error) {
        res.status(401).send({ "msg": "error occourd while login " })

    }
})

module.exports={userRoute}

