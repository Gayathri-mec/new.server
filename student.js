const express=require('express')
const bodyparser=require('body-parser')
const mysql=require('mysql2')
const cors = require('cors')
const app=express()
app.use(cors())
app.use(express.json())

const port = 2021

const database=mysql.createConnection({
    host:"localhost",
    database:"symposium",
    user:"root",
    password:"12345"
})
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())

database.connect(()=>{
    console.log('database is connected')
})


app.listen(port,(err)=>{
    console.log("new web is connecting")
})
app.get('/back',async(req,res)=>{
    const sql="select*from student"
    database.query(sql,(err,records)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(records==0){
            res.status(404).json({message:"no records are there"})
            return
        }
        res.status(200).json({records})

    })

})


//put
app.put('/change/:id',async(req,res)=>{
    const{roll_no,name,email,phonenumber}=req.body
    const sql="update student set roll_no=?,name=?,email=?,phonenumber=? where roll_no=?"
    database.query(sql,[roll_no,name,email,phonenumber,res.params],(err,records)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }

        res.status(200).json({message:"updated"})
        return
    })
})


//post

app.post('/new',async(req,res)=>{
    const{roll_no,name,email,phonenumber}=req.body
    const sql="insert into student values(?,?,?,?)"
    database.query(sql,[roll_no,name,email,phonenumber],(err,records)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }

        res.status(200).json({message:"result.students has added"})
    
    })
})

//delete

app.delete('/remove/:key',async(req,res)=>{
    const sql="delete from student where roll_no=?"
    database.query(sql,[req.params.key],(err,ack)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(ack.affectedrows==0){
            req.status(404).json({message:"records not found"})
        }

        res.status(200).json({message:"details has deleted"})
    })
})