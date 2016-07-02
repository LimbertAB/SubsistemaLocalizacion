var express = require('express');
var router = express.Router();

var db=require("mysql_orm");
var settings={
	host:"localhost",
	user:"root",
	password:"",
	database:"EjemploSistema",
	port:""
}
var query=db.mysql(settings);



module.exports = router;
