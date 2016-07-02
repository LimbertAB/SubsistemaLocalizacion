var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var db=require("mysql_orm");
var settings={
	host:"localhost",
	user:"root",
	password:"",
	database:"EjemploSistema",
	port:""
}
var query=db.mysql(settings);
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Servicio Departamental De Caminos Potosi' });
});
//LOGEAR USUARIOS
router.post('/', function(req, res) {
	var nick=req.body.nombre;
	var pass=req.body.contraseña;
	console.log(nick, pass);
	query.get("usuarios").where({"nick":nick,"pass":pass}).execute(function(v){	
		if(v.result.length==1){
			var ci=v.result[0].ci;
			var aux=v.result[0].cargo;
			if(aux=='ADMINISTRADOR'){
				res.redirect('MenuPrincipal');
			}else{
				if(aux=='geolocalizacion')
					res.render('GeolocMenuPrincipal',{ title: 'Geolocalizacion', nombre: nick, ci:ci});
				else
					res.render('ResidenciaMenuPrincipal');
			}
		}
		else{
			res.render('index', { error:'ERROR: Verifique sus datos'});
		}
	});
});
router.get('/MenuPrincipal', function(req, res) {
	var nombresNoti=[];var cargo=[];var descripNoti=[];var fechaNoti=[];var imagenDir=[];
	query.get("usuarios").execute(function(usuariosNoti){
		query.get("notificaciones").execute(function(noti){
			for(var i=0; i<noti.result.length; i++){
				for(var j=0; j<usuariosNoti.result.length; j++){
					if(noti.result[i].ciNoti==usuariosNoti.result[j].ci){
						nombresNoti.push(usuariosNoti.result[j].nombres_apellidos);
						cargo.push(usuariosNoti.result[j].cargo);
						descripNoti.push(noti.result[i].descripcion);
						fechaNoti.push(noti.result[i].fecha);
						imagenDir.push(noti.result[i].descripcion);
					}
				}
			}
  			res.render('MenuPrincipal',{ title: 'Administrador', NombreNoti:nombresNoti, cargoNoti: cargo, descNoti:descripNoti, fechNoti:fechaNoti,imagenDir:imagenDir});
  		});
  	});
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
	query.get("usuarios").execute(function(v){
		var lista1=[];var lista2=[];var lista3=[];var lista4=[];var lista5=[];var lista6=[];	
		for(var i=0; i<v.result.length; i++){
			lista1.push(v.result[i].ci);lista2.push(v.result[i].nick);lista3.push(v.result[i].nombres_apellidos);
			lista4.push(v.result[i].cargo);lista5.push(v.result[i].domicilio);lista6.push(v.result[i].telefono);
		}
		res.render('Usuarios',{ title: 'Administrador', cii:lista1, 
														nick:lista2,
														nombres:lista3,
														cargos:lista4,
														domicilios:lista5,
														telefonos:lista6});
	});
});
router.get('/RegistrarUsuario',function(req ,res){
	res.render('RegistrarUsuario',{ title: 'Administrador'});
});
router.post('/RegistrarUsuario',function(req ,res){
	var user=Object();
	user.nick=req.body.nombres;
	user.nombres_apellidos=req.body.apellidos;
	user.pass=req.body.password;
	user.cargo=req.body.cargo;
	user.domicilio=req.body.domicilio;
	user.telefono=req.body.telefono;
	console.log({nombre:user.nick,apellido:user.nombres_apellidos,contraseña:user.pass,cargo:user.cargo,domicilio:user.domicilio, telefono: user.telefono});
	query.save("usuarios",user,(function(r){
		res.render('RegistrarUsuario',{confirmacion:'REGISTRO EXITOSO!'});
	}));
});
router.get('/informeSemanal',function(req ,res){
	res.render('informeSemanal',{ title: 'informes'});
});
module.exports = router;