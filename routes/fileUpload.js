const express = require('express')
const authRouter = express.Router();
const fs = require('fs')
const uuidv1 = require('uuid/v1')

/**
 * This function takes in a file and stores it locally in the images folder.
 * If the process has worked fine, it will give a message and url in return.
 * The url specifies where the file is located, so that we can access the file with it's url.
 */
authRouter.route('/uploadlogo').post(async (req,res) =>{
    let errors = {};
    const token = req.headers['authorization'];
    if (!token){
        errors.notauthorized = 'You are not authorized!'
        throw errors;
    }
    try{
        let filename = req.body.name
        const arr1 = filename.split(".")
        filename = uuidv1() + "."+arr1[1]
        const {data} = req.body
        const bufferData = new Buffer(data.data)
        await fs.writeFileSync(`images/${filename}`,bufferData, 'buffer');
        res.status(200).json({
            message : 'Logo has been uploaded!',
            url : `http://localhost:${process.env.PORT}/images/${filename}`
        })
    }catch(err){
        errors = err
        res.status(400).json(errors)
    }
})

module.exports = authRouter