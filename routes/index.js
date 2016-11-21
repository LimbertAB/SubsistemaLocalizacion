 var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var db=require("mysql_orm");

//var settings={host:"190.129.24.218",user:"sistemas",password:"Abc123",database:"SubsistemaLocalizacion",port:""}
//var query=db.mysql(settings);
//var settings2={host:"190.129.24.218",user:"sistemas",password:"Abc123",database:"SubsistemaProyectos",port:""}
//var query2=db.mysql(settings2);

var settings={host:"localhost",user:"root",password:"",database:"SubsistemaLocalizacion",port:""}
var query=db.mysql(settings);
var settings2={host:"192.168.1.3",user:"sistemas",password:"12345",database:"subsistemaproyectos",port:""}
var query2=db.mysql(settings2);

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
router.get('/Principal_TiempoReal', function(req, res){
  año=2016;
  if(año!=''){
    query2.get("residencias").where({'año':año}).execute(function(residenciaño){
      if(residenciaño.result.length>0){
        var ResidenciaTotal=[];
        query.get("asignacionusuarios").execute(function(asig){
          query.get("usuarios").execute(function(user){
            query.get("ubicaciontiemporeal").execute(function(ubicaciones){
              for (var i=0;i<residenciaño.result.length;i++){ //2
                var residenciaids=[],residencianombres=[],userids=[],usernombres=[],usercis=[],userlatitudes=[],userlongitudes=[];
                for (var j=0;j<asig.result.length;j++){
                  if(residenciaño.result[i].idresidencias==asig.result[j].idresidencia){
                    for (var k=0;k<user.result.length;k++){
                      if(user.result[k].idusuario==asig.result[j].idusuario){
                        userids.push(user.result[k].idusuario);
                        usernombres.push(user.result[k].nombres_apellidos);
                        usercis.push(user.result[k].ci);
                        var lat='',lon='';
                        for(var m=0;m<ubicaciones.result.length;m++){
                          if(user.result[k].idusuario==ubicaciones.result[m].idusuarios){
                            lat=ubicaciones.result[m].latitud;
                            lon=ubicaciones.result[m].longitud;
                          }
                        }
                        userlatitudes.push(lat);userlongitudes.push(lon); 
                      }
                    }
                  }
                }
                console.log(userlongitudes);
                ResidenciaTotal.push({'idresidencia':residenciaño.result[i].idresidencias,'nombreres':residenciaño.result[i].nombre,'userids':userids,'usernombres':usernombres,'usercis':usercis,'latitudes':userlatitudes,'longitudes':userlongitudes});
              }
              console.log('total',userlongitudes);
              res.render('AdminTRealPrincipal',{title: 'Administrador',"residencias":ResidenciaTotal,'estado':true});
            });
          }); 
        });
      }else{
        res.render('AdminTRealPrincipal',{ title: 'Administrador','estado': false});
      }
    });
  }
});
router.get('/Residencias', function(req, res) {
  query2.get("residencias").execute(function(v){
    if(v.result.length>0){
        var lista1=[],lista2=[],lista3=[],lista4=[];
        for (var i = 0; i < v.result.length; i++) {
          lista1.push(v.result[i].nombre);lista2.push(v.result[i].ubicacion);lista3.push(v.result[i].estado);lista4.push(v.result[i].idresidencias);
        }
        res.render('Residencias',{nombre:lista1,ubicacion:lista2,estado:lista3,idresidencia:lista4});
    }else{
      res.render('Residencias');
    }  
  });
  
});
router.get('/Menu_Residencias', function(req, res) {
  var id=req.query.id;// residencia=2
  var año;
  if(id!=undefined){
    query2.get("residencias").where({'idresidencias':id}).execute(function(residencia){
      año=residencia.result[0].año;
      if(residencia.result.length==1){
          var personal=[],materiales=[],vehiculos=[],servicios=[],tramos=[],residencias=[],costototal=0,usuarios=[],equipos=[];
          var residencia1,residencia2,residencia3,residencia4,residencia5=0,residencia6=0,residencia7,residencia8,residencia9;
          residencia1=residencia.result[0].nombre;residencia7=residencia.result[0].latitud;residencia8=residencia.result[0].longitud;
          residencia9=residencia.result[0].estado;
          query.get("asignacionusuarios").where({'idresidencia':id}).execute(function(asiguser){
            residencia2=asiguser.result.length;
            query.get("usuarios").execute(function(user){
              if(asiguser.result.length>0){
                for (var i=0;i<asiguser.result.length;i++){
                  var persona1=[],persona2=[],persona3=[],persona4=[],persona5=[];
                  for (var j=0;j<user.result.length;j++){
                    if(asiguser.result[i].idusuario==user.result[j].idusuario){
                      persona1.push(user.result[j].idusuario);persona2.push(asiguser.result[i].perfil);persona3.push(user.result[j].nombres_apellidos);persona4.push(asiguser.result[i].observaciones);persona5.push(asiguser.result[i].estado);
                    }
                  }
                  personal.push({"estado":true,'idusuario':persona1,"perfil":persona2,"nombres":persona3,'observaciones':persona4,'estadouser':persona5});
                }
              }else{
                 personal.push({"estado":false});//sin personal en residencia
              }
              query.get("asignacionvehiculos").where({'idresidencia':id}).execute(function(asigvehiculo){
                residencia3=asigvehiculo.result.length;
                query.get("vehiculos").execute(function(cargeneral){
                  if(asigvehiculo.result.length>0){
                    for (var i=0;i<asigvehiculo.result.length;i++){
                      var vehiculo1=[],vehiculo2=[],vehiculo3=[],vehiculo4=[],vehiculo5=[],vehiculo6=[];
                      for (var j=0;j<cargeneral.result.length;j++){
                        if(asigvehiculo.result[i].idequipo==cargeneral.result[j].idequipos){
                          vehiculo1.push(cargeneral.result[j].idequipos);vehiculo2.push(cargeneral.result[j].codinterno);vehiculo3.push(cargeneral.result[j].tipo);
                          if(asigvehiculo.result[i].encargado!=null){
                            for (var k=0;k<user.result.length;k++){
                              if(asigvehiculo.result[i].encargado==user.result[k].idusuario){
                                vehiculo4.push(user.result[k].nombres_apellidos);
                              }
                            }
                          }
                          else{
                            vehiculo4.push('Sin chofer');
                          }
                          vehiculo5.push(asigvehiculo.result[i].estado);vehiculo6.push(asigvehiculo.result[i].observaciones);
                        }
                      }
                      vehiculos.push({"respuesta":true,'idequipo':vehiculo1,"codinterno":vehiculo2,"tipo":vehiculo3,'encargado':vehiculo4,'estado':vehiculo5,'observaciones':vehiculo6});
                    }
                  }else{
                     vehiculos.push({"respuesta":false});//sin personal en residencia
                  }
                  query2.get("residencias").where({'año':año}).execute(function(residenciaño){ //2,3,4
                    query.get("asignacionusuarios").execute(function(asig){
                      var idusuariosderesidencia=[];
                      for (var i=0;i<residenciaño.result.length;i++){ //2
                        for (var j=0;j<asig.result.length;j++){
                          if(residenciaño.result[i].idresidencias==asig.result[j].idresidencia){
                            idusuariosderesidencia.push(asig.result[j].idusuario);
                          } 
                        }
                      }
                      var person1=[],person2=[],contador=0;
                      for (var j=0;j<user.result.length;j++){
                        for (var i=0;i<idusuariosderesidencia.length;i++){
                          if(user.result[j].idusuario==idusuariosderesidencia[i]){
                            contador++;
                          }
                        }
                        if(contador==0){
                          person1.push(user.result[j].idusuario);person2.push(user.result[j].nombres_apellidos);
                        }
                        contador=0;
                      }
                      if(person1.length>0){
                        usuarios.push({"estado":true,'idusuario':person1,"nombre":person2});
                      }
                      else{
                        usuarios.push({"estado":false});
                      }
                      query.get("asignacionvehiculos").execute(function(asigcar){
                        var idcaresidencia=[];
                        for (var i=0;i<residenciaño.result.length;i++){ //2
                          for (var j=0;j<asigcar.result.length;j++){
                            if(residenciaño.result[i].idresidencias==asigcar.result[j].idresidencia){
                              idcaresidencia.push(asigcar.result[j].idequipo);
                            }
                          }
                        }
                        console.log('asignados',idcaresidencia);
                        var equipo1=[],equipo2=[],contador=0;
                        for (var j=0;j<cargeneral.result.length;j++){
                          for (var i=0;i<idcaresidencia.length;i++){
                            if(cargeneral.result[j].idequipos==idcaresidencia[i]){
                              contador++;
                            }
                          }
                          if(contador==0){
                            equipo1.push(cargeneral.result[j].idequipos);equipo2.push(cargeneral.result[j].codinterno);
                          }
                          contador=0;
                        }
                        if(equipo1.length>0){
                          equipos.push({"estado":true,'idequipo':equipo1,"codinterno":equipo2});
                        }
                        else{
                          equipos.push({"estado":false});
                        }     
                        query2.get("materialesaresidencia").where({'idresidenciamateriales':id}).execute(function(material){
                          if(material.result.length>0){
                            var material1=[],material2=[],material3=[],material4=[],material5=[],material6=[],material7=[];
                            for(var j=0; j<material.result.length; j++){
                              material1.push(material.result[j].idmaterialesysuministros);material2.push(material.result[j].descripcion);material3.push(material.result[j].unidaddemedida);material4.push(material.result[j].cantidad);material5.push(material.result[j].preciounitario);material6.push(material.result[j].monto);material7.push(material.result[j].partidapresupuestaria);
                            }
                            materiales.push({"estado":true,"idmaterial":material1,"descripcion":material2,'unidaddemedida':material3,'cantidad':material4,'presiounitario':material5,'monto':material6,'partidapresupuestaria':material7});
                          }else{
                            materiales.push({"estado":false});//vacio
                          }
                          query2.get("serviciosnobasicos").where({'idresidenciaservicios':id}).execute(function(servicio){
                            if(servicio.result.length>0){
                              var servicio1=[],servicio2=[],servicio3=[],servicio4=[],servicio5=[];
                              for(var j=0; j<servicio.result.length; j++){
                                servicio1.push(servicio.result[j].idserviciosnobasicos);servicio2.push(servicio.result[j].servicios);servicio3.push(servicio.result[j].preciounitario);servicio4.push(servicio.result[j].monto);servicio5.push(servicio.result[j].partidapresupuesto);
                              }
                              servicios.push({"estado":true,"idservicio":servicio1,"descripcion":servicio2,'preciounitario':servicio3,'monto':servicio4,'partidapresupuestaria':servicio5});
                            }else{
                              servicios.push({"estado":false});//vacio
                            }
                            query2.get("tramos").where({'idresidencia':id}).execute(function(tramo){
                              var tramos=[];
                              residencia4=tramo.result.length;
                              if(tramo.result.length>0){
                                query2.get("actividadestramos").execute(function(actividad){
                                  if(actividad.result.length>0){
                                    var longitudtotal=0,longitud=0,contador=0,costotramo=0;
                                    query.get("sam").execute(function(sam){
                                      for(var k=0; k<tramo.result.length; k++){ //tramo  //tramo =rio salado id=1
                                        var tramo1=[],tramo2=[],tramo3=[],tramo4=[];
                                        var actividad1=[],actividad2=[],actividad3=[],actividad4=[],actividad5=[];
                                        for(var j=0; j<actividad.result.length; j++){ //actividad
                                          if(tramo.result[k].idtramos==actividad.result[j].idtramo){
                                            contador++;
                                            for(var i=0; i<sam.result.length; i++){
                                              if(actividad.result[j].idsam==sam.result[i].idsam){
                                                if(sam.result[i].unidad=='Km'){
                                                  longitud=longitud+actividad.result[j].cantidad;
                                                  longitudtotal=longitudtotal+longitud;
                                                }
                                                costotramo=costotramo+(actividad.result[j].cantidad*sam.result[i].presunit);
                                                actividad1.push(sam.result[i].codsam);actividad2.push(sam.result[i].descripcion);actividad3.push(sam.result[i].unidad);actividad4.push(actividad.result[j].cantidad);actividad5.push(sam.result[i].presunit);
                                              }
                                            }
                                          }
                                        }
                                        residencia5=residencia5+costotramo;
                                        residencia6=residencia6+longitud;
                                        console.log(residencia6);
                                        tramo1.push(tramo.result[k].idtramos);tramo2.push(tramo.result[k].descripcion);tramo3.push(longitud);tramo4.push(costotramo);
                                        longitud=0;
                                        costotramo=0;
                                        if(contador>0){
                                          tramos.push({'estado':true,"idtramo":tramo1,"descripcion":tramo2,"longitud":tramo3,'costototal':tramo4,'estadoactividad':true,'codsam':actividad1,'descripcionsam':actividad2,'unidadsam':actividad3,'cantidad':actividad4,'presiounitario':actividad5});
                                        }
                                        else{
                                          tramos.push({'estado':true,"idtramo":tramo1,"descripcion":tramo2,"longitud":tramo3,'costototal':tramo4,'estadoactividad':false});
                                        } 
                                      }
                                      residencias.push({"nombre":residencia1,"cantidaduser":residencia2,'cantidadcar':residencia3,'cantidadtramos':residencia4,'costototal':residencia5.toFixed(3),'longitudtotal':residencia6.toFixed(3),'latitud':residencia7,'longitud':residencia8,'estadoR':residencia9});
                                      console.log('???',tramos);
                                      res.render('ResidenciasGeneral',{title: 'Administrador','usuarios':usuarios,'equipos':equipos,"personal":personal,"vehiculos":vehiculos,"materiales":materiales,'tramos':tramos,'servicios':servicios,'residencias':residencias});  
                                    });
                                  }else{
                                    var tramo1=[],tramo2=[],tramo3=[],tramo4=[];
                                    for(var j=0; j<tramo.result.length; j++){
                                      tramo1.push(tramo.result[j].idtramos);tramo2.push(tramo.result[j].descripcion);tramo3.push('0.00');tramo4.push('0.00');
                                      tramos.push({'estado':true,"idtramo":tramo1,"descripcion":tramo2,"longitud":tramo3,'costototal':tramo4,'estadoactividad':false});
                                    }
                                    
                                    console.log('dos....',tramos);
                                    residencias.push({"nombre":residencia1,"cantidaduser":residencia2,'cantidadcar':residencia3,'cantidadtramos':residencia4,'costototal':residencia5.toFixed(3),'longitudtotal':residencia6.toFixed(3),'latitud':residencia7,'longitud':residencia8,'estadoR':residencia9});
                                    res.render('ResidenciasGeneral',{title: 'Administrador','usuarios':usuarios,'equipos':equipos,"personal":personal,"vehiculos":vehiculos,"materiales":materiales,'tramos':tramos,'servicios':servicios,'residencias':residencias});
                                  }
                                });
                              }else{
                                tramos.push({"estado":false,'estadoactividad':false});//vacio
                                residencias.push({"nombre":residencia1,"cantidaduser":residencia2,'cantidadcar':residencia3,'cantidadtramos':residencia4,'costototal':residencia5.toFixed(3),'longitudtotal':residencia6.toFixed(3),'latitud':residencia7,'longitud':residencia8,'estadoR':residencia9});
                                console.log('tres....',residencias);
                                res.render('ResidenciasGeneral',{title: 'Administrador','usuarios':usuarios,'equipos':equipos,"personal":personal,"vehiculos":vehiculos,"materiales":materiales,'tramos':tramos,'servicios':servicios,'residencias':residencias});
                              }     
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
      }else{
        //no hay residencia
        res.redirect('Residencias');
      }
    });  
  }else{
    res.redirect('Residencias');
  }
});
router.get('/Locationcoordinates', function(req, res) {
  var id=req.query.idUser;// residencia=2
  var año;
  if(id!=undefined){
    query.get("usuarios").where({'idusuario':id}).execute(function(user){
      if(user.result.length>0){
        var userid='',usernombre='',userfecha='';
        query.get("ubicaciontiemporeal").where({'idusuarios':id}).execute(function(ubicaciones){
          if(ubicaciones.result.length>0){
            userid=user.result[0].idusuario;
            usernombre=user.result[0].nombres_apellidos;
            userfecha=ubicaciones.result[(ubicaciones.result.length)-1].Fecha; 
            console.log(userid,usernombre,userfecha);
            res.render('AdminOneLocalizacion',{title: 'Administrador',"idusuario":userid,'nombreusuario':usernombre,'fecha':userfecha,'estado':'true'});
          }else{
            userid=user.result[0].idusuario;
            usernombre=user.result[0].nombres_apellidos;
            userfecha='00-00-0000';
            console.log(userid,usernombre,userfecha);
            res.render('AdminOneLocalizacion',{title: 'Administrador',"idusuario":userid,'nombreusuario':usernombre,'fecha':userfecha,'estado':'false'});
          }
        });
      }else{
        res.redirect('Principal_TiempoReal');
      }
    });
  }
  else{
    res.redirect('Principal_TiempoReal');
  }
});
router.get('/Usuarios', function(req, res) {
  query.get("usuarios").execute(function(user){
    if(user.result.length>0){
      var idusuario=[],ci=[],nombres=[],cargo=[],ubicacion=[],residencias=[];
      query2.get('residencias').execute(function(residencia){
        if(residencia.result.length>0){
          query.get('asignacionusuarios').execute(function(asignacion){
            if(asignacion.result.length>0){
              for(var i=0; i<residencia.result.length; i++){//acasio
                var lista1=[],lista2=[],lista3=[],lista4=[];
                for(var j=0; j<asignacion.result.length; j++){
                  if(residencia.result[i].idresidencias==asignacion.result[j].idresidencia){
                    for(var k=0; k<user.result.length; k++){
                      if(asignacion.result[j].idusuario==user.result[k].idusuario){
                        lista1.push(user.result[k].idusuario);lista2.push(user.result[k].ci);lista3.push(user.result[k].nombres_apellidos);lista4.push(user.result[k].cargo);
                      }
                    }
                  }
                }
                residencias.push({ 'title': 'Administrador',"nombreres":residencia.result[i].nombre,"idusuario":lista1,"ci":lista2,'nombres':lista3,'cargo':lista4});
              }
              for(var k=0; k<user.result.length; k++){
                var idu,nom,cii,carg,ubi;
                for(var j=0; j<asignacion.result.length;j++){
                  if(asignacion.result[j].idusuario==user.result[k].idusuario){
                    for(var i=0; i<residencia.result.length; i++){
                      if(residencia.result[i].idresidencias==asignacion.result[j].idresidencia){
                        ubicacion.push(residencia.result[i].nombre);
                      }
                    }
                  }
                }
                idusuario.push(user.result[k].idusuario);
                ci.push(user.result[k].ci);
                nombres.push(user.result[k].nombres_apellidos);
                cargo.push(user.result[k].cargo);
              }
              console.log('hay todo',residencias,idusuario,ci,nombres,cargo,ubicacion);  
              res.render('Usuarios',{title:'Administrador','estadouser':true,'estadoresidencia':true,'estadoasignacion':true,"residencias":residencias,"idusuario":idusuario,"ci":ci,'nombres':nombres,'cargo':cargo,'ubicacion':ubicacion});
            }
            else{// na hay usuarios asignados
              for(var k=0; k<user.result.length; k++){
                idusuario.push(user.result[k].idusuario);ci.push(user.result[k].ci);nombres.push(user.result[k].nombres_apellidos);cargo.push(user.result[k].cargo);ubicacion.push('No Asignado');
              }
              for(var i=0; i<residencia.result.length; i++){
                  residencias.push({"nombreres":residencia.result[i].nombre});
              }
              console.log('no hay asignaciones',residencias,idusuario,ci,nombres,cargo,ubicacion);  
              res.render('Usuarios',{title:'Administrador','estadouser':true,'estadoresidencia':true,'estadoasignacion':false,"residencias":residencias,"idusuario":idusuario,"ci":ci,'nombres':nombres,'cargo':cargo,'ubicacion':ubicacion});
            }
          });
        }else{//no hay residencias
          for(var k=0; k<user.result.length; k++){
            idusuario.push(user.result[k].idusuario);ci.push(user.result[k].ci);nombres.push(user.result[k].nombres_apellidos);cargo.push(user.result[k].cargo);ubicacion.push('No Asignado');
          }
          console.log('no hay residencias',residencias,idusuario,ci,nombres,cargo,ubicacion);  
          res.render('Usuarios',{ 'title': 'Administrador','estadouser':true,'estadoresidencia':false,'estadoasignacion':false,"idusuario":idusuario,"ci":ci,'nombres':nombres,'cargo':cargo,'ubicacion':ubicacion});
        }
      });
    }else{//no hay usuarios
      console.log('no hay usuario',residencias,idusuario,ci,nombres,cargo,ubicacion);  
      res.render('Usuarios',{ title: 'Administrador','estadouser':false,'estadoresidencia':false,'estadoasignacion':false});
    }
  });
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
	user.domicilio=req.body.domicilio;
	user.telefono=req.body.telefono;
	user.celular=req.body.celular;
	query.save("usuarios",user,(function(r){
		if(r.affectedRows==1){
			res.render('RegistrarUsuario',{estado:'true'});
		}else{
			res.render('RegistrarUsuario',{estado:'false'});
		}
	}));
});
router.get('/sam',function(req ,res){
  res.render('sam',{ title: 'informes'});
});
router.get('/equipos', function(req, res) {
  query.get("vehiculos").execute(function(car){
    if(car.result.length>0){
      var idequipos=[],codinterno=[],ubicacion=[],placa=[],modelo=[],marca=[],color=[],tipo=[],combustible=[],perfil=[],residencias=[];
      query2.get('residencias').execute(function(residencia){
        if(residencia.result.length>0){
          query.get('asignacionvehiculos').execute(function(asignacion){
            if(asignacion.result.length>0){
              for(var i=0; i<residencia.result.length; i++){//acasio
                var lista1=[];var lista2=[];var lista3=[];var lista4=[];var lista5=[];var lista6=[];var lista7=[];var lista8=[];var lista9=[];var lista10=[];var lista11=[];
                for(var j=0; j<asignacion.result.length; j++){
                  if(residencia.result[i].idresidencias==asignacion.result[j].idresidencia){
                    for(var k=0; k<car.result.length; k++){
                      if(asignacion.result[j].idequipo==car.result[k].idequipos){
                        lista1.push(car.result[k].idequipos);lista2.push(car.result[k].codinterno);lista3.push(residencia.result[i].nombre);lista5.push(car.result[k].placa);lista6.push(car.result[k].modelo);lista7.push(car.result[k].marca);lista8.push(car.result[k].color);lista9.push(car.result[k].tipo);lista10.push(car.result[k].combustible);lista11.push(car.result[k].perfil);
                      }
                    }
                  }
                }
                residencias.push({ 'title': 'Administrador',"nombreres":residencia.result[i].nombre,"idequipos":lista1,"codinterno":lista2,'ubicacion':lista3,'encargado':lista4,'placa':lista5,'modelo':lista6,'marca':lista7,'color':lista8,'tipo':lista9,'combustible':lista10,'perfil':lista11});
              }
              for(var k=0; k<car.result.length; k++){
                for(var j=0; j<asignacion.result.length;j++){
                  if(asignacion.result[j].idequipo==car.result[k].idequipos){
                    for(var i=0; i<residencia.result.length; i++){
                      if(residencia.result[i].idresidencias==asignacion.result[j].idresidencia){
                        ubicacion.push(residencia.result[i].nombre);
                      }
                    }
                  }
                }
                idequipos.push(car.result[k].idequipos);codinterno.push(car.result[k].codinterno);
                placa.push(car.result[k].placa);modelo.push(car.result[k].modelo);
                marca.push(car.result[k].marca);color.push(car.result[k].color);
                tipo.push(car.result[k].tipo);combustible.push(car.result[k].combustible);perfil.push(car.result[k].perfil);
              }
              res.render('equipos',{title: 'Administrador','estadocar':true,'estadoresidencia':true,'estadoasignacion':true,"residencias":residencias,"idequipos":idequipos,"codinterno":codinterno,'ubicacion':ubicacion,'placa':placa,'modelo':modelo,'marca':marca,'color':color,'tipo':tipo,'combustible':combustible,'perfil':perfil});
            }
            else{// na hay vehiculos asignados
              for(var k=0; k<car.result.length; k++){
                idequipos.push(car.result[k].idequipos);codinterno.push(car.result[k].codinterno);
                placa.push(car.result[k].placa);modelo.push(car.result[k].modelo);
                marca.push(car.result[k].marca);color.push(car.result[k].color);ubicacion.push('No Asignado');
                tipo.push(car.result[k].tipo);combustible.push(car.result[k].combustible);perfil.push(car.result[k].perfil);
              }
              for(var i=0; i<residencia.result.length; i++){
                  residencias.push({"nombreres":residencia.result[i].nombre});
              }
              console.log('no hay asignaciones',residencias,idequipos,tipo,modelo,ubicacion);  
              res.render('equipos',{title: 'Administrador','estadocar':true,'estadoresidencia':true,'estadoasignacion':false,"residencias":residencias,"idequipos":idequipos,"codinterno":codinterno,'ubicacion':ubicacion,'placa':placa,'modelo':modelo,'marca':marca,'color':color,'tipo':tipo,'combustible':combustible,'perfil':perfil});
            }
          });
        }
        else{//no hay residencias
          for(var k=0; k<car.result.length; k++){
            idequipos.push(car.result[k].idequipos);codinterno.push(car.result[k].codinterno);
            placa.push(car.result[k].placa);modelo.push(car.result[k].modelo);
            marca.push(car.result[k].marca);color.push(car.result[k].color);ubicacion.push('No Asignado');
            tipo.push(car.result[k].tipo);combustible.push(car.result[k].combustible);perfil.push(car.result[k].perfil);
          }
          console.log('no hay residencias',residencias,idequipos,tipo,modelo,ubicacion);   
          res.render('equipos',{title: 'Administrador','estadocar':true,'estadoresidencia':false,'estadoasignacion':false,"idequipos":idequipos,"codinterno":codinterno,'ubicacion':ubicacion,'placa':placa,'modelo':modelo,'marca':marca,'color':color,'tipo':tipo,'combustible':combustible,'perfil':perfil});
        }
      });
    }
    else{//no hay vehiculos
      var residencias=[],idequipos=[],codinterno=[],ubicacion=[],placa=[],modelo=[],marca=[],color=[],tipo=[],combustible=[],perfil=[],residencias=[];
      res.render('equipos',{title: 'Administrador','estadocar':true,'estadoresidencia':true,'estadoasignacion':false,"residencias":residencias,"idequipos":idequipos,"codinterno":codinterno,'ubicacion':ubicacion,'placa':placa,'modelo':modelo,'marca':marca,'color':color,'tipo':tipo,'combustible':combustible,'perfil':perfil});
    }
  });
});
router.post('/equipos',function(req ,res){
  console.log(req.body);
  var car=Object();
  car.codinterno=req.body.codinterno;
  car.placa=req.body.placa;
  car.modelo=req.body.modelo;
  car.marca=req.body.marca;
  car.color=req.body.color;
  car.tipo=req.body.tipo;
  car.combustible=req.body.combustible;
  car.perfil=req.body.estado;
  query.save("vehiculos",car,(function(r){
    if(r.affectedRows==1){
      var residencias=[],idequipos=[],codinterno=[],ubicacion=[],placa=[],modelo=[],marca=[],color=[],tipo=[],combustible=[],perfil=[];
      res.render('equipos',{title: 'Administrador','estadocar':true,'estadoresidencia':true,'estadoasignacion':false,"residencias":residencias,"idequipos":idequipos,"codinterno":codinterno,'ubicacion':ubicacion,'placa':placa,'modelo':modelo,'marca':marca,'color':color,'tipo':tipo,'combustible':combustible,'perfil':perfil,'estadoinsertarvehiculo':'true'});
    }else{ 
      res.render('equipos',{title: 'Administrador','estadocar':true,'estadoresidencia':true,'estadoasignacion':false,"residencias":residencias,"idequipos":idequipos,"codinterno":codinterno,'ubicacion':ubicacion,'placa':placa,'modelo':modelo,'marca':marca,'color':color,'tipo':tipo,'combustible':combustible,'perfil':perfil,'estadoinsertarvehiculo':'false'});
    }
  }));
});
router.get('/registrarEquipos',function(req ,res){
  res.render('registrarEquipos',{ title: 'informes'});
});
router.post('/registroservicios',function(req ,res){
  console.log(req.body);
  var servicio=Object();
  servicio.nombres_apellidos=req.body.nombres;
  servicio.nick=req.body.nick;
  servicio.ci=req.body.ci;
  query.save("usuarios",servicio,(function(r){
    if(r.affectedRows==1){
      res.render('RegistrarUsuario',{estado:'true'});
    }else{
      res.render('RegistrarUsuario',{estado:'false'});
    }
  }));
});
router.post('/registromateriales',function(req ,res){
  console.log(req.body);
  var material=Object();
  material.pass=req.body.password;
  material.cargo=req.body.cargosis;
  material.domicilio=req.body.domicilio;
  material.telefono=req.body.telefono;
  material.celular=req.body.celular;
  query.save("usuarios",material,(function(r){
    if(r.affectedRows==1){
      res.render('RegistrarUsuario',{estado:'true'});
    }else{
      res.render('RegistrarUsuario',{estado:'false'});
    }
  }));
});
router.get('/Mi_Residencia', function(req, res) {
  var id=2;// residencia=2
  var año;
  if(id!=undefined){
    query2.get("residencias").where({'idresidencias':id}).execute(function(residencia){
      año=residencia.result[0].año;
      if(residencia.result.length==1){
          var personal=[],materiales=[],vehiculos=[],servicios=[],tramos=[],residencias=[],costototal=0,usuarios=[],equipos=[];
          var residencia1,residencia2,residencia3,residencia4,residencia5=0,residencia6=0,residencia7,residencia8,residencia9;
          residencia1=residencia.result[0].nombre;residencia7=residencia.result[0].latitud;residencia8=residencia.result[0].longitud;
          residencia9=residencia.result[0].estado;
          query.get("asignacionusuarios").where({'idresidencia':id}).execute(function(asiguser){
            residencia2=asiguser.result.length;
            query.get("usuarios").execute(function(user){
              if(asiguser.result.length>0){
                for (var i=0;i<asiguser.result.length;i++){
                  var persona1=[],persona2=[],persona3=[],persona4=[],persona5=[];
                  for (var j=0;j<user.result.length;j++){
                    if(asiguser.result[i].idusuario==user.result[j].idusuario){
                      persona1.push(user.result[j].idusuario);persona2.push(asiguser.result[i].perfil);persona3.push(user.result[j].nombres_apellidos);persona4.push(asiguser.result[i].observaciones);persona5.push(asiguser.result[i].estado);
                    }
                  }
                  personal.push({"estado":true,'idusuario':persona1,"perfil":persona2,"nombres":persona3,'observaciones':persona4,'estadouser':persona5});
                }
              }else{
                 personal.push({"estado":false});//sin personal en residencia
              }
              query.get("asignacionvehiculos").where({'idresidencia':id}).execute(function(asigvehiculo){
                residencia3=asigvehiculo.result.length;
                query.get("vehiculos").execute(function(cargeneral){
                  if(asigvehiculo.result.length>0){
                    for (var i=0;i<asigvehiculo.result.length;i++){
                      var vehiculo1=[],vehiculo2=[],vehiculo3=[],vehiculo4=[],vehiculo5=[],vehiculo6=[];
                      for (var j=0;j<cargeneral.result.length;j++){
                        if(asigvehiculo.result[i].idequipo==cargeneral.result[j].idequipos){
                          vehiculo1.push(cargeneral.result[j].idequipos);vehiculo2.push(cargeneral.result[j].codinterno);vehiculo3.push(cargeneral.result[j].tipo);
                          if(asigvehiculo.result[i].encargado!=null){
                            for (var k=0;k<user.result.length;k++){
                              if(asigvehiculo.result[i].encargado==user.result[k].idusuario){
                                vehiculo4.push(user.result[k].nombres_apellidos);
                              }
                            }
                          }
                          else{
                            vehiculo4.push('Sin chofer');
                          }
                          vehiculo5.push(asigvehiculo.result[i].estado);vehiculo6.push(asigvehiculo.result[i].observaciones);
                        }
                      }
                      vehiculos.push({"respuesta":true,'idequipo':vehiculo1,"codinterno":vehiculo2,"tipo":vehiculo3,'encargado':vehiculo4,'estado':vehiculo5,'observaciones':vehiculo6});
                    }
                  }else{
                     vehiculos.push({"respuesta":false});//sin personal en residencia
                  }
                  query2.get("residencias").where({'año':año}).execute(function(residenciaño){ //2,3,4
                    query.get("asignacionusuarios").execute(function(asig){
                      var idusuariosderesidencia=[];
                      for (var i=0;i<residenciaño.result.length;i++){ //2
                        for (var j=0;j<asig.result.length;j++){
                          if(residenciaño.result[i].idresidencias==asig.result[j].idresidencia){
                            idusuariosderesidencia.push(asig.result[j].idusuario);
                          } 
                        }
                      }
                      var person1=[],person2=[],contador=0;
                      for (var j=0;j<user.result.length;j++){
                        for (var i=0;i<idusuariosderesidencia.length;i++){
                          if(user.result[j].idusuario==idusuariosderesidencia[i]){
                            contador++;
                          }
                        }
                        if(contador==0){
                          person1.push(user.result[j].idusuario);person2.push(user.result[j].nombres_apellidos);
                        }
                        contador=0;
                      }
                      if(person1.length>0){
                        usuarios.push({"estado":true,'idusuario':person1,"nombre":person2});
                      }
                      else{
                        usuarios.push({"estado":false});
                      }
                      query.get("asignacionvehiculos").execute(function(asigcar){
                        var idcaresidencia=[];
                        for (var i=0;i<residenciaño.result.length;i++){ //2
                          for (var j=0;j<asigcar.result.length;j++){
                            if(residenciaño.result[i].idresidencias==asigcar.result[j].idresidencia){
                              idcaresidencia.push(asigcar.result[j].idequipo);
                            } 
                          }
                        }
                        console.log('asignados',idcaresidencia);
                        var equipo1=[],equipo2=[],contador=0;
                        for (var j=0;j<cargeneral.result.length;j++){
                          for (var i=0;i<idcaresidencia.length;i++){
                            if(cargeneral.result[j].idequipos==idcaresidencia[i]){
                              contador++;
                            }
                          }
                          if(contador==0){
                            equipo1.push(cargeneral.result[j].idequipos);equipo2.push(cargeneral.result[j].codinterno);
                          }
                          contador=0;
                        }
                        if(equipo1.length>0){
                          equipos.push({"estado":true,'idequipo':equipo1,"codinterno":equipo2});
                        }
                        else{
                          equipos.push({"estado":false});
                        }     
                        query2.get("materialesaresidencia").where({'idresidenciamateriales':id}).execute(function(material){
                          if(material.result.length>0){
                            var material1=[],material2=[],material3=[],material4=[],material5=[],material6=[],material7=[];
                            for(var j=0; j<material.result.length; j++){
                              material1.push(material.result[j].idmaterialesysuministros);material2.push(material.result[j].descripcion);material3.push(material.result[j].unidaddemedida);material4.push(material.result[j].cantidad);material5.push(material.result[j].preciounitario);material6.push(material.result[j].monto);material7.push(material.result[j].partidapresupuestaria);
                            }
                            materiales.push({"estado":true,"idmaterial":material1,"descripcion":material2,'unidaddemedida':material3,'cantidad':material4,'presiounitario':material5,'monto':material6,'partidapresupuestaria':material7});
                          }else{
                            materiales.push({"estado":false});//vacio
                          }
                          query2.get("serviciosnobasicos").where({'idresidenciaservicios':id}).execute(function(servicio){
                            if(servicio.result.length>0){
                              var servicio1=[],servicio2=[],servicio3=[],servicio4=[],servicio5=[];
                              for(var j=0; j<servicio.result.length; j++){
                                servicio1.push(servicio.result[j].idserviciosnobasicos);servicio2.push(servicio.result[j].servicios);servicio3.push(servicio.result[j].preciounitario);servicio4.push(servicio.result[j].monto);servicio5.push(servicio.result[j].partidapresupuesto);
                              }
                              servicios.push({"estado":true,"idservicio":servicio1,"descripcion":servicio2,'preciounitario':servicio3,'monto':servicio4,'partidapresupuestaria':servicio5});
                            }else{
                              servicios.push({"estado":false});//vacio
                            }
                            query2.get("tramos").where({'idresidencia':id}).execute(function(tramo){
                              var tramos=[];
                              residencia4=tramo.result.length;
                              if(tramo.result.length>0){
                                query2.get("actividadestramos").execute(function(actividad){
                                  if(actividad.result.length>0){
                                    var longitudtotal=0,longitud=0,contador=0,costotramo=0;
                                    query.get("sam").execute(function(sam){
                                      for(var k=0; k<tramo.result.length; k++){ //tramo  //tramo =rio salado id=1
                                        var tramo1=[],tramo2=[],tramo3=[],tramo4=[];
                                        var actividad1=[],actividad2=[],actividad3=[],actividad4=[],actividad5=[];
                                        for(var j=0; j<actividad.result.length; j++){ //actividad
                                          if(tramo.result[k].idtramos==actividad.result[j].idtramo){
                                            contador++;
                                            for(var i=0; i<sam.result.length; i++){
                                              if(actividad.result[j].idsam==sam.result[i].idsam){
                                                if(sam.result[i].unidad=='Km'){
                                                  longitud=longitud+actividad.result[j].cantidad;
                                                  longitudtotal=longitudtotal+longitud;
                                                }
                                                costotramo=costotramo+(actividad.result[j].cantidad*sam.result[i].presunit);
                                                actividad1.push(sam.result[i].codsam);actividad2.push(sam.result[i].descripcion);actividad3.push(sam.result[i].unidad);actividad4.push(actividad.result[j].cantidad);actividad5.push(sam.result[i].presunit);
                                              }
                                            }
                                          }
                                        }
                                        residencia5=residencia5+costotramo;
                                        residencia6=residencia6+longitud;
                                        console.log(residencia6);
                                        tramo1.push(tramo.result[k].idtramos);tramo2.push(tramo.result[k].descripcion);tramo3.push(longitud);tramo4.push(costotramo);
                                        longitud=0;
                                        costotramo=0;
                                        if(contador>0){
                                          tramos.push({'estado':true,"idtramo":tramo1,"descripcion":tramo2,"longitud":tramo3,'costototal':tramo4,'estadoactividad':true,'codsam':actividad1,'descripcionsam':actividad2,'unidadsam':actividad3,'cantidad':actividad4,'presiounitario':actividad5});
                                        }
                                        else{
                                          tramos.push({'estado':true,"idtramo":tramo1,"descripcion":tramo2,"longitud":tramo3,'costototal':tramo4,'estadoactividad':false});
                                        } 
                                      }
                                      residencias.push({"nombre":residencia1,"cantidaduser":residencia2,'cantidadcar':residencia3,'cantidadtramos':residencia4,'costototal':residencia5.toFixed(3),'longitudtotal':residencia6.toFixed(3),'latitud':residencia7,'longitud':residencia8,'estadoR':residencia9});
                                      console.log('???',tramos);
                                      res.render('miresidencia',{title: 'Administrador','usuarios':usuarios,'equipos':equipos,"personal":personal,"vehiculos":vehiculos,"materiales":materiales,'tramos':tramos,'servicios':servicios,'residencias':residencias});  
                                    });
                                  }else{
                                    for(var j=0; j<tramo.result.length; j++){
                                      tramo1.push(tramo.result[j].idtramos);tramo2.push(tramo.result[j].descripcion);tramo3.push('0.00');tramo4.push('0.00');
                                    }
                                    tramos.push({'estado':true,"idtramo":tramo1,"descripcion":tramo2,"longitud":tramo3,'costototal':tramo4,'estadoactividad':false});
                                    console.log('dos....',tramos);
                                    residencias.push({"nombre":residencia1,"cantidaduser":residencia2,'cantidadcar':residencia3,'cantidadtramos':residencia4,'costototal':residencia5.toFixed(3),'longitudtotal':residencia6.toFixed(3),'latitud':residencia7,'longitud':residencia8,'estadoR':residencia9});
                                    res.render('miresidencia',{title: 'Administrador','usuarios':usuarios,'equipos':equipos,"personal":personal,"vehiculos":vehiculos,"materiales":materiales,'tramos':tramos,'servicios':servicios,'residencias':residencias});
                                  }
                                });
                              }else{
                                tramos.push({"estado":false,'estadoactividad':false});//vacio
                                residencias.push({"nombre":residencia1,"cantidaduser":residencia2,'cantidadcar':residencia3,'cantidadtramos':residencia4,'costototal':residencia5.toFixed(3),'longitudtotal':residencia6.toFixed(3),'latitud':residencia7,'longitud':residencia8,'estadoR':residencia9});
                                console.log('tres....',residencias);
                                res.render('miresidencia',{title: 'Administrador','usuarios':usuarios,'equipos':equipos,"personal":personal,"vehiculos":vehiculos,"materiales":materiales,'tramos':tramos,'servicios':servicios,'residencias':residencias});
                              }     
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
      }else{
        //no hay residencia
        res.redirect('Residencias');
      }
    });  
  }else{
    res.redirect('Residencias');
  }
});

router.get('/Location_GPS_principal',function(req ,res){
  año=2016;
  if(año!=''){
    query2.get("residencias").where({'año':año}).execute(function(residenciaño){
      if(residenciaño.result.length>0){
        var ResidenciaTotal=[];
        query.get("asignacionvehiculos").execute(function(asig){
          query.get("vehiculos").execute(function(car){
            query.get("ubicaciongps").execute(function(ubicaciones){
              for (var i=0;i<residenciaño.result.length;i++){ //2
                var residenciaids=[],residencianombres=[],carids=[],carcodinterno=[],cartipo=[],carplaca=[],carlatitudes=[],carlongitudes=[];
                for (var j=0;j<asig.result.length;j++){
                  if(residenciaño.result[i].idresidencias==asig.result[j].idresidencia){
                    for (var k=0;k<car.result.length;k++){
                      if(car.result[k].idequipos==asig.result[j].idequipo){
                        carids.push(car.result[k].idequipos);
                        carcodinterno.push(car.result[k].codinterno);
                        carplaca.push(car.result[k].placa);
                        cartipo.push(car.result[k].tipo);
                        var lat='',lon='';
                        for(var m=0;m<ubicaciones.result.length;m++){
                          if(car.result[k].idequipos==ubicaciones.result[m].idvehiculo){
                            lat=ubicaciones.result[m].latitud;
                            lon=ubicaciones.result[m].longitud;
                          }
                        }
                        carlatitudes.push(lat);carlongitudes.push(lon); 
                      }
                    }
                  }
                }
                console.log(carlongitudes);
                ResidenciaTotal.push({'idresidencia':residenciaño.result[i].idresidencias,'nombreres':residenciaño.result[i].nombre,'carids':carids,'carcodinterno':carcodinterno,'carplaca':carplaca,'cartipo':cartipo,'latitudes':carlatitudes,'longitudes':carlongitudes});
              }
              console.log('total',carlongitudes);
              res.render('GPS_principal',{title: 'Administrador',"residencias":ResidenciaTotal,'estado':true});
            });
          }); 
        });
      }else{
        res.render('GPS_principal',{ title: 'Administrador','estado': false});
      }
    });
  }
});

router.get('/Location_GPS_car', function(req, res) {
  var id=req.query.idVehiculo;// residencia=2
  if(id!=undefined){
    query.get("vehiculos").where({'idequipos':id}).execute(function(car){
      if(car.result.length>0){
        var carid='',codinterno='',carfecha='',tipo='';
        query.get("ubicaciongps").where({'idvehiculo':id}).execute(function(ubicaciones){
          if(ubicaciones.result.length>0){
            carid=car.result[0].idequipos;
            codinterno=car.result[0].codinterno;
            tipo=car.result[0].tipo;
            carfecha=ubicaciones.result[(ubicaciones.result.length)-1].fecha; 
            res.render('GPS_onecar',{title: 'Administrador',"idvehiculo":carid,'codinterno':codinterno,'tipo':tipo,'fecha':carfecha,'estado':'true'});
          }else{
            carid=car.result[0].idequipos;
            codinterno=car.result[0].codinterno;
            tipo=car.result[0].tipo;
            carfecha='00-00-0000';
            res.render('GPS_onecar',{title: 'Administrador',"idvehiculo":carid,'codinterno':codinterno,'tipo':tipo,'fecha':carfecha,'estado':'false'});
          }
        });
      }else{
        res.redirect('Location_GPS_principal');
      }
    });
  }
  else{
    res.redirect('Location_GPS_principal');
  }
});
router.get('/Importar_Coordenadas',function(req ,res){
  res.render('GPS_importCoordenadas',{ title: 'Administrador'});
});

router.put('/', function(req, res) {
   var aux=req.body;
   console.log(aux);
   res.render('index', { title: 'Put',informacion:aux});
});
module.exports = router;