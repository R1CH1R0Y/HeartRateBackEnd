const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const userModel = require("./models/users")
const fileModel = require("./models/files")


let app=express()
app.use(express.json())
app.use(cors())

mongoose.connect("")


app.post("/Register",async(req,res)=>{
    let input=req.body
    let hashedPassword=bcrypt.hashSync(req.body.password, 10)
    req.body.password=hashedPassword
    userModel.find({email: req.body.email}).then(
        (items)=>{
            if(items.length > 0) {
                res.json({"status":"Email ID already exists"})
            }else{
                let result=new userModel(input)
                result.save()
                res.json({"status":"success"})
            }
        }
    )
})

app.post("/Login",async(req,res)=>{
    let input=req.body
    let result=userModel.find({email:req.body.email}).then(
        (items)=>{
            if(items.length>0){
                const passwordValidator=bcrypt.compareSync(req.body.password,items[0].password)
                if(passwordValidator){
                    jwt.sign({email:req.body.email},"Heart",{expiresIn:"1d"},(error,token)=>{
                        if(error){
                            res.json({"status":"error","error":error})
                        }else{
                            res.json({"status":"success","token":token,"userId":items[0]._id})
                        }
                    })
                }else{
                    res.json({"status":"Incorrect Password"})
                }
            }else{
                res.json({"status":"Invalid Email ID"})
            }
        }
    )
})

app.post("/uploadPAFile",async(req,res)=>{
    let input=req.body
    let token=req.headers.token
    jwt.verify(token,"Heart",async(error,decoded)=>{
        if(decoded){
            let result=new fileModel(input)
            await result.save()
            res.json({"status":"success"}) 
        }else{
            res.json({"status":"Invalid Authentication"})
        }
    })
})

app.post("/viewPAFile",(req,res)=>{
    let input=req.body
    let token=req.headers.token
    jwt.verify(token,"Heart",(error,decoded)=>{
        if (decoded) {
            fileModel.find(input).then(
                (items)=>{
                    res.json(items)
                }
            ).catch(
                (error)=>{
                    res.json({"status":"error"})
                }
            )
        } else {
            res.json({"status":"Invalid Authentication"})
        }
    })
})

app.listen(3030,()=>{
    console.log("Server started")
})