var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var db=require("mysql_orm");
var settings={
  host:"190.129.24.218",
  user:"sistemas",
  password:"Abc123",
  database:"SubsistemaLocalizacion",
  port:""
}
var query=db.mysql(settings);
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Servicio Departamental De Caminos Potosi' });
});
router.get('/MenuPrincipal', function(req, res) {
	res.render('MenuPrincipal',{title:'Administrador'});
});
router.post('/MenuPrincipal', function(req, res) {
	var dirImagen='';
	var f = new Date().toString();
    var fechaa='';
    for(var i=0;i<f.length-43;i++){
        if(f[i]!=' '&&f[i]!=':'){
            fechaa=fechaa+f[i];
        } 
    }
    var form = new formidable.IncomingForm();
    form.parse(req);
    form.on('fileBegin', function (name, file){
    	console.log(name);
        var DirRouter=__dirname;
        var DirRout='';
        for(var i=0;i<DirRouter.length-7;i++){
            DirRout=DirRout+DirRouter[i];
        }
        
        file.path = DirRout+'/public/images/Upload/'+fechaa + file.name;
        console.log(DirRout);
        dirImagen='images/Upload/'+fechaa + file.name;
        console.log(dirImagen);
    });
    form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
		res.render('MenuPrincipal',{title:'Administrador', dirImagen:dirImagen});
    });
});      
router.get('/Principal_TiempoReal', function(req, res) {
  res.render('AdminTRealPrincipal');
});
router.get('/Localizacion_All_TR', function(req, res) {
  res.render('AdminAllLocalizacion');
});
router.get('/Localizacion_One_Personal', function(req, res) {
  res.render('AdminOneLocalizacion');
});


router.get('/GeolocMenuPrincipal', function(req, res, next) {
  res.render('GeolocMenuPrincipal');
});
router.get('/ResidenciaMenuPrincipal', function(req, res, next) {
  res.render('ResidenciaMenuPrincipal');
});
router.get('/Usuarios', function(req, res) {
	res.render('Usuarios',{ title: 'Administrador'});
});
router.get('/RegistrarUsuario',function(req ,res){
	res.render('RegistrarUsuario',{ title: 'Administrador'});
});
router.post('/RegistrarUsuario',function(req ,res){
	console.log(req.body);
	var user=Object();
	user.nombres_apellidos=req.body.nombres;
	user.nick=req.body.nick;
	user.ci=req.body.ci;
	user.pass=req.body.password;
	user.cargo=req.body.cargosis;
	if(req.body.cargosis=='Encargado de Residencia'){
		user.ubicacion=req.body.residencia;
	}
	user.domicilio=req.body.domicilio;
	user.telefono=req.body.telefono;
	user.celular=req.body.celular;
	
	console.log({nombres:user.nombres_apellidos,nick:user.nick,contrasena:user.pass,cargo:user.cargo,ubicacion:user.ubicacion,domicilio:user.domicilio, telefono:user.telefono,celular:user.celular});
	query.save("usuarios",user,(function(r){
		console.log('---',r);
		if(r.affectedRows==1){
			res.render('RegistrarUsuario',{estado:'true'});
		}else{
			res.render('RegistrarUsuario',{estado:'false'});
		}
	}));
});
router.get('/informeSemanal',function(req ,res){
	res.render('informeSemanal',{ title: 'informes'});
});
router.get('/insertInfoSemanal',function(req ,res){
	res.render('InsertInfoSemanal',{ title: 'informes'});
});
module.exports = router;