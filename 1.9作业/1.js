const express=require('express');
const bodyParser=require('body-parser');
const multer=require('multer');
const fs=require('fs')
const path=require('path');
const mysql=require('mysql');
const app=express()
const user=express.Router()

app.use(bodyParser.urlencoded({}))
app.use(multer({dest:'./img'}).any())
app.use('/user',user)

const pool=mysql.createPool({
	host:'127.0.0.1',
	user:'root',
	password:'1234',
	database:'list',
	port:3306
})
	


//上传
user.post('/img',function(req,res){
	const img = req.files
	const name = req.files[0].filename
	const newName = name+path.parse(req.files[0].originalname).ext
	fs.rename('./img/'+name,'./img/'+newName,function(err){
		if(err){
			console.log(err)
			return
		}
		res.send('http://localhost:8000/img/'+newName)
	})
})

//添加
user.post('/zeng',function(req,res){
	const imgurls=req.body.imgurls
	console.log(imgurls)
	pool.getConnection(function(err,connection){
		if(err) throw err
		connection.query(`INSERT INTO img (imgurls) VALUES ('${imgurls}')`,function(err,data){
			if(err) throw err
			connection.query(`select * from img where imgurls='${imgurls}'`,function(err,data){
				res.send(data)
				connection.end()
			})
		})
	})
})
//删图
user.post('/shan',function(req,res){
	const imgurls=req.body.imgurls
	pool.getConnection=function(err,connection){
		if(err) throw err
		connection.query(`DELETE FROM img WHERE imgurls=('${imgurls}')`,function(err,data){
			if(err) throw err
			res.send(data)
			connection.end()
		})
	}
})
//改图
user.post('/gai',function(req,res){
	const imgurls=req.body.imgurls
	const imgurl=req.body.imgurl
	pool.getConnection=function(err,connection){
		if(err) throw err
		connection.query(`UPDATE imgurls SET imgurls=${imgurl} WHERE imgurls=${imgurls}`,function(err,data){
			if(err) throw err
			res.send('ok')
			connection.end()
		})
	}
})



app.use(express.static('./'))
app.listen(8000,function(){
	console.log('ok')
})
