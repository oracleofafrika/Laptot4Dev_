const express = require('express')
const mongoose = require('mongoose')
const app = express()
const env = require('dotenv').config();


const port = process.env.PORT;

app.use(express.json())

const db = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_STRING); 
        console.log("database connected successfully");  
    } catch (error) {
        console.log(error);
        
    }
}
db()

const Applicants = new mongoose.Schema({ 
    firstName: {
        type: String, 
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phoneNo: {
        type: Number,
        required: true
    },
    reason: {
        type: String,
        required: true
    },

})
const candidate = mongoose.model('Applicants', Applicants)

app.post('/enroll', async (req, res) =>{
    try {
        const {firstname, lastname, email, phoneNo, reason} = req.body

        if (!firstname || !lastname || !email || !phoneNo || !reason) {
            return res.status(400).json({msg:'Please fill all fields'})   
        }

        const candidateExist = await candidate.findOne({email:email})

        if (candidateExist){
            return res.status(400).json({msg:'candidate already exists'})
        }

        const newCandidate = candidate ({
            firstName: firstname,
            lastName: lastname,
            email: email,
            phoneNo: phoneNo,
            reason: reason
        })
        const candidateGenerated = await newCandidate.save();

        if (!candidateGenerated){
            console.log('cannot save candidate');
            return res.status(400).json({msg:'enrolment failed'});
        }

        return res.status(201).json({msg:'enrolment suffessful'})
    } catch (error) {
        console.log(error.message);
        
    }
    
})

app.get('/All_Member', async (req, res) => {
    try {
        const All_Member = await candidate.find();
    

        if (!All_Member) {
            return res.status(404).json({ message:'no member found' });
        } 
        return res.status(200).json({All_Member});
    } catch (error) { 
        console.log(error.message);
    }   
})

app.get('/countcandidate', async (req, res)=>{
    try {
        const candidateExist = await candidate.find()

        if (!candidateExist){
            return res.status(200).json({msg:'no candidate found'});
        }

        const response = {
            count: candidateExist.length
        }
    
        return res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        
    }
    
})

app.listen(port, (err) => {
    console.log(`server is listening on http://localhost:${port}`)
})


