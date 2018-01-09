const mysql=require('mysql')
const express=require('express')
const bodyParser=require('body-parser')
const app=express()
const user=express.Router()

app.use(bodyParser.urlencoded({}))
app.use('/user',user)
const pool = mysql.createPool({
	host:'localhost',   //主机名
	user:'root',		//用户名
	password:'1234',	//密码
	database:'list',	//数据库名
	port:3306			//端口号
})
//登录
user.use('/user',function(req,res){
	const user=req.body.user
	const pass=req.body.pass
	pool.getConnection(function(err,connection){
		if(err)throw err
		connection.query(`SELECT * FROM user where user=?`,[user],function(err,data){
			if(err)throw err
			if(data==''){
				res.send('用户名不存在')
			}else{
				if(data[0].pass==pass){
					res.send('登陆成功')
				}else{
					res.send('用户名或密码错误')
				}
			}
		})
	})
})



//注册
user.use('/user1', function(req, res) {
	const user = req.body.user
	const pass = req.body.pass
	pool.getConnection(function(err, connection) {
		if(err) throw err;
		connection.query(`SELECT * FROM user where user=?`,[user], function(err, data) {
		if(err) throw err;
		if(data==''){
			connection.query(`INSERT INTO user (user,pass) values ('${user}','${pass}')`, function(err, data) {
			if(err) throw err
			res.send('注册成功')
		})
		}else{
			res.send('用户名已存在');
			}
		})
	})
})

app.use(express.static('./public'));
app.listen(8000,function(){
	console.log('正确')
});