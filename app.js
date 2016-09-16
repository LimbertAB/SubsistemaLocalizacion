var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var socket=require("socket.io");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var db=require("mysql_orm");
var fs=require('fs');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

var settings={
  host:"190.129.24.218",
  user:"sistemas",
  password:"Abc123",
  database:"SubsistemaLocalizacion",
  port:""
}
var query2=db.mysql(settings);
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
var PORT =5000;
var http=app.listen(PORT,function(){
  console.log("servidor corriendo en el puerto: "+PORT);
});
var io= socket(http);
io.on("connection",function(socket){
  var estado='false';
  var stado='true';
  var user=Object();
  socket.on('ConectarUsuario',function(ci){
    socket.join('salaChat'+ci+'');
  });
  socket.on('listarUsuarios',function(aux){
    console.log(aux);
    if(aux!=''){
      query2.get("usuarios").where({'ubicacion':aux}).execute(function(v){
        if(v.result.length>0){
          var lista1=[];var lista2=[];var lista3=[];var lista4=[];var lista5=[];  
          for(var i=0; i<v.result.length; i++){
            lista1.push(v.result[i].idusuario);lista2.push(v.result[i].ci);lista3.push(v.result[i].nombres_apellidos);lista4.push(v.result[i].cargo);lista5.push(v.result[i].ubicacion);
          }
          socket.emit('respuestaListarUsuarios',{"idusuario":lista1,"ci":lista2,'nombres':lista3,'cargo':lista4,'ubicacion':lista5});
        }
        else{
          socket.emit('respuestaListarUsuarios',{'estado':false});
        }
        
      });
    }
    else{
      query2.get("usuarios").execute(function(v){
        var lista1=[];var lista2=[];var lista3=[];var lista4=[];var lista5=[];  
        for(var i=0; i<v.result.length; i++){
          lista1.push(v.result[i].idusuario);lista2.push(v.result[i].ci);lista3.push(v.result[i].nombres_apellidos);lista4.push(v.result[i].cargo);lista5.push(v.result[i].ubicacion);
        }
        socket.emit('respuestaListarUsuarios',{"idusuario":lista1,"ci":lista2,'nombres':lista3,'cargo':lista4,'ubicacion':lista5});
      });
    }
    
  });
  socket.on('listaUnUsuario',function(aux){
    console.log('???',aux);
    query2.get("usuarios").where({'idusuario':aux}).execute(function(v){
      if(v.result.length==1){
        var lista1=[];var lista2=[];var lista3=[];var lista4=[];var lista5=[];var lista6=[];var lista7=[]; var lista8=[];var lista9=[];  
        lista1.push(v.result[0].idusuario);lista2.push(v.result[0].nombres_apellidos);lista3.push(v.result[0].nick);lista4.push(v.result[0].ci);lista5.push(v.result[0].cargo);lista6.push(v.result[0].ubicacion);lista7.push(v.result[0].domicilio);lista8.push(v.result[0].telefono);lista9.push(v.result[0].celular);
        socket.emit('RespuestaListaUnUsuario',{"idusuario":lista1,"nombres":lista2,'nick':lista3,'ci':lista4,'cargo':lista5,'ubicacion':lista6,'domicilio':lista7,'telefono':lista8,'celular':lista9});
      }  
    }); 
  });
  socket.on('Buscaruseradm',function(valor){
    query2.get("usuarios").contains({'nombres_apellidos':valor}).execute(function(rows2){
      if(rows2.result.length>0){
        var nombreCompleto=[];var ci=[];
        for(var i=0; i<rows2.result.length; i++){
          nombreCompleto.push(rows2.result[i].nombres_apellidos);
          ci.push(rows2.result[i].idusuario);
        }
        socket.emit('RespuestaBuscaruseradm',{'estado':'true','nombreCompleto':nombreCompleto,'idusuario':ci});
      }else{
        socket.emit('RespuestaBuscaruseradm',{'estado':'false'}); 
      }
    });
  });
  socket.on("nuevaNoticia",function(usernoti){
    user.ciNoti=usernoti.ci;
    user.descripcion=usernoti.noticia;
    user.direccion=usernoti.direccion;
    var nombresNoti=[];var cargo=[];var descripNoti=[];var fechaNoti=[];var direccionImg=[];
    query2.save("notificaciones",user,(function(r){
      if(r.affectedRows==1){
        query2.get("usuarios").execute(function(rows1){
          query2.get("notificaciones").execute(function(rows2){
            for(var i=0; i<rows2.result.length; i++){
              for(var j=0; j<rows1.result.length; j++){
                if(rows2.result[i].ciNoti==rows1.result[j].ci){
                  nombresNoti.push(rows1.result[j].nombres_apellidos);
                  cargo.push(rows1.result[j].cargo);
                  descripNoti.push(rows2.result[i].descripcion);
                  fechaNoti.push(rows2.result[i].fecha);
                  direccionImg.push(rows2.result[i].direccion);
                }
              }
            }
            io.sockets.emit("NotificacionResponse",{"nombre":nombresNoti,"cargo":cargo,"descripcion":descripNoti,"fecha":fechaNoti,"direccionImg":direccionImg});
          });
        });
      }
      else{
        io.sockets.emit("NotificacionResponse",{'estado':estado});
      }
    }));
  });
  socket.on('Login',function(userDatos){
    
    var nick=userDatos.nombre;
    var pass=userDatos.contras;

    query2.get("usuarios").where({"nick":nick,"pass":pass}).execute(function(v){ 
      if(v.result.length==1){
        var ci=v.result[0].idusuario;
        var cargo=v.result[0].cargo;
        var auxx=nick + ' id Usuario: ' + ci;
        console.log('Ingreso a la pagina: ' , auxx);
        var desc=v.result[0].descripcion;
        var nombre=v.result[0].nombres_apellidos;
        if(cargo=='ADMINISTRADOR'){
          var estado=true;
            socket.emit('LoginRespuesta',{"nombre":nick,"ci":ci,"estado":estado, "cargo":cargo});
        }else{
          if(cargo=='RESIDENTE'){
            var estado=true;
            socket.emit('LoginRespuesta',{"nombre":nick,"ci":ci,"estado":estado,"cargo":cargo,"descripcion":desc});
          }
          else{
            if((cargo=='TRABAJADOR')||(cargo=='ENCARGADO CAMPAMENTO')){
              var estado=true;
              socket.emit('LoginRespuesta',{"nick":nick,"nombre":nombre,"ci":ci,"estado":estado,"cargo":cargo});
            }
          }
        }
      }
      else{
        var estado=false;
        socket.emit('LoginRespuesta',{"nombre":nick,"password":pass,"estado":estado});
      }
    });  
  });
  socket.on('ActualizarUsuarios',function(informacion){
    console.log(informacion);
    var using=Object();
    using.nombres_apellidos=informacion.nombres;
    using.nick=informacion.nick;
    using.ci=informacion.ci;
    using.domicilio=informacion.domicilio;
    using.telefono=informacion.telefono;
    using.celular=informacion.celular;
    query2.update("usuarios",using).where({"idusuario":informacion.idusuario}).execute(function(r){
      if(r.affectedRows==1){
        query2.get("usuarios").where({'idusuario':informacion.idusuario}).execute(function(v){
          var lista1=[];var lista2=[];var lista3=[];var lista4=[];var lista5=[];var lista6=[];var lista7=[]; var lista8=[];var lista9=[];  
          lista1.push(v.result[0].idusuario);lista2.push(v.result[0].nombres_apellidos);lista3.push(v.result[0].nick);lista4.push(v.result[0].ci);lista5.push(v.result[0].cargo);lista6.push(v.result[0].ubicacion);lista7.push(v.result[0].domicilio);lista8.push(v.result[0].telefono);lista9.push(v.result[0].celular);
          socket.emit('RespuestaListaUnUsuario',{"idusuario":lista1,"nombres":lista2,'nick':lista3,'ci':lista4,'cargo':lista5,'ubicacion':lista6,'domicilio':lista7,'telefono':lista8,'celular':lista9});
        }); 
      }
    });
  });
  socket.on('notificaciones',function(){
    var nombresNoti=[];var cargo=[];var descripNoti=[];var fechaNoti=[];var direccionImg=[];
    query2.get("usuarios").execute(function(rows1){
        query2.get("notificaciones").execute(function(rows2){
            for(var i=0; i<rows2.result.length; i++){
              for(var j=0; j<rows1.result.length; j++){
                if(rows2.result[i].ciNoti==rows1.result[j].idusuario){
                  nombresNoti.push(rows1.result[j].nombres_apellidos);
                  cargo.push(rows1.result[j].cargo);
                  descripNoti.push(rows2.result[i].descripcion);
                  fechaNoti.push(rows2.result[i].fecha);
                  direccionImg.push(rows2.result[i].direccion);
                }
              }
            }
            io.sockets.emit("NotificacionResponse",{"nombre":nombresNoti,"cargo":cargo,"descripcion":descripNoti,"fecha":fechaNoti,"direccionImg":direccionImg});
        });
    });
  });
  socket.on('BuscadorUsuarios',function(valor){
    var nombreCompleto=[];var ci=[];
    query2.get("usuarios").contains({'nombres_apellidos':valor}).execute(function(rows2){
      if(rows2.result.length>0){
        console.log('estos son los nombres '+rows2.result.length);
        for(var i=0; i<rows2.result.length; i++){
          nombreCompleto.push(rows2.result[i].nombres_apellidos);
          ci.push(rows2.result[i].idusuario);
        }
        socket.emit('RespuestaBuscador',{'nombreCompleto':nombreCompleto,'ci':ci});
      }else{
        socket.emit('RespuestaBuscador',{'nombreCompleto':nombreCompleto,'ci':ci}); 
      }
    });
  });
  socket.on('ListaMisMensajes',function(valor){
    var nombresMensaje=[];var Mensajes=[];var fechaMensaje=[];var CIMensaje=[];
    query2.get("usuarios").execute(function(rows1){
      query2.get("mensajes").where_or({"ciOrigen":valor,"ciDestino":valor}).execute(function(rows2){
        for(var i=0; i<rows2.result.length; i++){
          for(var j=0; j<rows1.result.length; j++){
            if(rows2.result[i].ciOrigen==valor){
              if(rows2.result[i].ciDestino==rows1.result[j].idusuario){
                nombresMensaje.push(rows1.result[j].nombres_apellidos);
                CIMensaje.push(rows1.result[j].idusuario);
                Mensajes.push(rows2.result[i].mensaje);
                fechaMensaje.push(rows2.result[i].fecha);
              }
            }else{
              if(rows2.result[i].ciOrigen==rows1.result[j].idusuario){
                nombresMensaje.push(rows1.result[j].nombres_apellidos);
                CIMensaje.push(rows1.result[j].idusuario);
                Mensajes.push(rows2.result[i].mensaje);
                fechaMensaje.push(rows2.result[i].fecha);   
              }
            }
          }
        }
        socket.emit("RespuestaMisMensajes",{"nombres":nombresMensaje,"cis":CIMensaje,"mensajes":Mensajes,"fechas":fechaMensaje});
      });
    });
  });
  socket.on('BuscarUsuariosParaResidencia',function(){
    query2.get("usuarios").where_or({'descripcion':'trabajador','cargo':'Encargado de Campamento'}).execute(function(v){
      var CI=[];var Nombres=[];
      for(var i=0; i<v.result.length; i++){
        Nombres.push(v.result[j].nombres_apellidos);
        CI.push(v.result[i].ci);
      }
      socket.emit('RespuestaBuscarUsuariosResidencia',{ nombres:Nombres, ci:CI});
    });
  });
  socket.on('DamePersonalResidencia',function(cis){
    query2.get("usuarios").execute(function(usuarios){
      var Nombres=[];
      for(var i=0; i<cis.length; i++){
        for(var j=0; j<usuarios.result.length; j++){
          if(cis[i]==usuarios.result[j].ci){
            Nombres.push(usuarios.result[j].nombres_apellidos);
          }
        }
      }
      socket.emit('RespuestaPersonalResidencia',{ nombres:Nombres});
    });
  });
  socket.on('listaMensajesUnUsuario',function(data){
    var mensaje=[];var fecha=[];var origen=[]; var destino=[];
    query2.get("mensajes").where_or({"ciOrigen":data.mici,"ciDestino":data.mici}).execute(function(enviados){
      console.log('enviados ',enviados);                 //1 2 3 6 7                        //4 5 8 9 10             
      for(var i=0; i<enviados.result.length; i++){  
        if(data.mici==enviados.result[i].ciOrigen){
          if(data.suci==enviados.result[i].ciDestino){
            origen.push(enviados.result[i].ciOrigen);
            destino.push(enviados.result[i].ciDestino);
            mensaje.push(enviados.result[i].mensaje);
            fecha.push(enviados.result[i].fecha);
          }
        }else{
          if(data.suci==enviados.result[i].ciOrigen){
            origen.push(enviados.result[i].ciOrigen);
            destino.push(enviados.result[i].ciDestino);
            mensaje.push(enviados.result[i].mensaje);
            fecha.push(enviados.result[i].fecha);
          }
        }
      }
      var ciDest=data.suci;
      socket.emit("ListaMensajesUnUsuario",{"origen":origen,"destino":destino,"mensaje":mensaje,"fecha":fecha,"ciDestino":ciDest}); 
    });
  });
  socket.on('enviandoUnMensaje',function(MensajesEntrada){
    console.log('llegaron',MensajesEntrada);
    var date = new Date;
    var meses = new Array ("Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic");
    var datosMensajes=Object();
    datosMensajes.ciOrigen=MensajesEntrada.origen;
    datosMensajes.ciDestino=MensajesEntrada.destino;
    datosMensajes.mensaje=MensajesEntrada.mensaje;
    datosMensajes.fecha=date.getDate() + " " + meses[date.getMonth()] + " " + date.getFullYear();
    datosMensajes.hora=date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
    
    query2.save("mensajes",datosMensajes,(function(r){
      if(r.affectedRows==1){
        console.log('insertados');
        //socket.join('salaChat'+ci+'');
        //io.to('salaChat'+MensajesEntrada.destino+'').emit('RespuestaMensajeSolo',{msn:'Se ha Unido A la sala ',fecha:'04:30'});
        //socket.broadcast.to(id).emit("mi mensaje",msg); 
      }
    }));
  });
  socket.on('ListaCI',function(todos){
    console.log('llego campamento',todos);
    query2.get("usuarios").execute(function(usuarios){
      var Nombres=[];
      console.log('tamaño',todos.cis.length);
      for(var i=0; i<todos.cis.length; i++){
        for(var j=0; j<usuarios.result.length; j++){
          if(todos.cis[i]==usuarios.result[j].ci){
            Nombres.push(usuarios.result[j].nombres_apellidos);
          }
        }
      }
      socket.emit('RespuestaNombresCampamento',{ nombres:Nombres, cis:todos.cis, ocupacion:todos.ocupacion});
    });
  });
  socket.on('ListaLocalizados',function(){
    var nombresLocalizados=[];var Cargo=[];var Ci=[];
    query2.get("usuarios").execute(function(usuario){
      query2.get("ubicaciontiemporeal").execute(function(localizacion){
        for(var i=0; i<localizacion.result.length; i++){
          for(var j=0; j<usuario.result.length; j++){
            if(localizacion.result[i].CiUsuario==usuario.result[j].ci){
                nombresLocalizados.push(usuario.result[j].nombres_apellidos);
                Ci.push(usuario.result[j].ci);
                Cargo.push(usuario.result[j].cargo);
              }
          }
        }
        socket.emit("RespuestaListaLocalizados",{"nombres":nombresLocalizados,"cis":Ci,"cargos":Cargo});
      });
    });
  });
  socket.on('ListaCordenadasUnUser',function(valor){
    var nombresLocalizados=[];var Fecha=[];var Hora=[];var latitud=[];var longitud=[];
    query2.get("usuarios").where({'ci':valor}).execute(function(usuario){
      query2.get("ubicaciontiemporeal").where({'CiUsuario':valor}).execute(function(localizacion){
        nombresLocalizados.push(usuario.result[0].nombres_apellidos);
        for(var i=0; i<localizacion.result.length; i++){
          Fecha.push(localizacion.result[i].Fecha);
          Hora.push(localizacion.result[i].Hora);
          latitud.push(localizacion.result[i].LatitudTR);
          longitud.push(localizacion.result[i].LongitudTR);
        }
        socket.emit("RespuestaListaCordenadasUnUser",{"nombres":nombresLocalizados,"fecha":Fecha,"hora":Hora,"latitud":latitud,"longitud":longitud});
      });
    });
  });
  socket.on('buscarnombreusuario',function(valor){
    query2.get("usuarios").where({'nick':valor}).execute(function(rows2){
      if(rows2.result.length==0){
        socket.emit('respuestanombreusuario',true);
      }else{
        socket.emit('respuestanombreusuario',false); 
      }
    });
  });
});
module.exports = app;


// socket.on('insertarInformeSemanal',function(datos){
//     console.log('llegaron',datos);
//     var inforsemanal=Object();
//     inforsemanal.idresidencia=datos.idresidencia;
//     inforsemanal.idusuario=datos.idusuario;
//     inforsemanal.ruta=datos.ruta;
//     inforsemanal.semanadel=datos.semanadel;
//     inforsemanal.semanaal=datos.semanaal;
//     inforsemanal.mes=datos.mes;
//     inforsemanal.año=datos.año;
//     inforsemanal.distrito=datos.distrito;
//     query2.save("informesemanal",inforsemanal,(function(r){
//       if(r.affectedRows==1){
//         query2.get("informesemanal").where({'idusuario':datos.idusuario}).execute(function(a){
//           var ultimoInforme=a.result[a.result.length-1].idInformeSemanal;
//           var detalleInforme=Object();
//           for(var i=1;i<=datos.dia.length;i++){
//             detalleInforme.idinformesemanal=ultimoInforme;
//             detalleInforme.dia=datos.dia[i];
//             detalleInforme.ruta=datos.ruta[i];
//             detalleInforme.seccion=datos.seccion[i];
//             detalleInforme.kilometroinicial=datos.kilometroinicial[i];
//             detalleInforme.kilometrofinal=datos.kilometrofinal[i];
//             detalleInforme.idactividad=datos.idactividad[i];
//             detalleInforme.personalclase=datos.personalclase[i];
//             detalleInforme.personalhorasregulares=datos.personalhorasregulares[i];
//             detalleInforme.materialesclase=datos.materialesclase[i];
//             detalleInforme.materialescantidad=datos.materialescantidad[i];
//             detalleInforme.equiposnumerointerno=datos.equiposnumerointerno[i];
//             detalleInforme.equiposhorasutilizadas=datos.equiposhorasutilizadas[i];
//             detalleInforme.observaciones=datos.observaciones[i];
//             query2.save("detalleinformesemanal",datos,(function(resultado){
//               if(resultado.affectedRows==1){
//                 console.log('insertado!!!');
//               }
//             }));
//           }
//         });
//       }
//     }));
//   });
//   socket.on('listarInformeSemanal',function(valor){//?año=2016&mes=marzo&semana=1
//     console.log('entro a la lista');
//       var fecha=valor.mes;
//       var ci=valor.ci;
//       var idresidencia;var idusuario; var ruta;var semanadel; var semanaal;var mes; var año; var distrito;
//       var dia=[];var ruta=[];var seccion=[];var kilometroinicial=[];var kilometrofinal=[];var idactividad=[];
//       var personalclase=[];var personalhorasregulares=[];var materialesclase=[];var materialescantidad=[];
//       var equiposnumerointerno=[];var equiposhorasutilizadas=[];var observaciones=[];
//       if(fecha==undefined){
//         query2.get("informesemanal").where({"IdUsuario":ci}).execute(function(v){
//           if(v.result.length>0){
//             var estado='true';
//             var ultimo=v.result.length-1;
//             var ultimoInforme=v.result[ultimo].idInformeSemanal;
//             idresidencia=v.result[ultimo].idresidencia;idusuario=v.result[ultimo].idusuario;ruta=v.result[ultimo].ruta;semanadel=v.result[ultimo].semanadel;
//             semanaal=v.result[ultimo].semanaal;mes=v.result[ultimo].mes;año=v.result[ultimo].año;distrito=v.result[ultimo].distrito;
//             query2.get("detalleinformesemanal").where({'idinformesemanal':ultimoInforme}).execute(function(a){
//               for(var i=0;i<a.result.length;i++){
//                 dia.push(a.result[i].dia);
//                 ruta.push(a.result[i].ruta);
//                 seccion.push(a.result[i].seccion);
//                 kilometroinicial.push(a.result[i].kilometroinicial);
//                 kilometrofinal.push(a.result[i].kilometrofinal);
//                 idactividad.push(a.result[i].idactividad);
//                 personalclase.push(a.result[i].personalclase);
//                 personalhorasregulares.push(a.result[i].personalhorasregulares);
//                 materialesclase.push(a.result[i].materialesclase);
//                 materialescantidad.push(a.result[i].materialescantidad);
//                 equiposnumerointerno.push(a.result[i].equiposnumerointerno);
//                 equiposhorasutilizadas.push(a.result[i].equiposhorasutilizadas);
//                 observaciones.push(a.result[i].observaciones);
//               }
//               socket.emit('respuestalistainformesemanal', {estado:estado,idresidencia:idresidencia,idusuario:idusuario,ruta:ruta,semanadel:semanadel,semanaal:semanaal,mes:mes,año:año,distrito:distrito,dia:dia,ruta:ruta,seccion:seccion,kilometroinicial:kilometroinicial,kilometrofinal:kilometrofinal,idactividad:idactividad,personalclase:personalclase,personalhorasregulares:personalhorasregulares,materialesclase:materialesclase,materialescantidad:materialescantidad,equiposnumerointerno:equiposnumerointerno,equiposhorasutilizadas:equiposhorasutilizadas,observaciones:observaciones});
//             });
//           }
            
//         });
//       }else{
//         query2.get("informesemanal").where({"IdUsuario":ci,"Fecha":fecha}).execute(function(v){
//           if(v.result.length>0){
//             var estado='true';
//             var idd=v.result[0].idPartesDiarios;
//             mañanaIngreso=v.result[0].MañanaIngreso;mañanaSalida=v.result[0].MañanaSalida;TardeIngreso=v.result[0].TardeIngreso;TardeSalida=v.result[0].TardeSalida;
//             ocupacion=v.result[0].Ocupacion;NroInterno=v.result[0].NroInterno;idResidencia=v.result[0].idResidencia;Tramo=v.result[0].Tramo;
//             InicioHorometro=v.result[0].InicioHorometro;FinHorometro=v.result[0].FinHorometro;CantidadCombus=v.result[0].CantidadCombus;tipoCombu=v.result[0].TipoCombus;
//             query2.get("detallestrabajo").where({'idParteDiario':idd}).execute(function(a){
//               console.log('________',a);
//               for(var i=0;i<a.result.length;i++){
//                 horaInicioActividad.push(a.result[i].horaInicioActividad);horaFinActividad.push(a.result[i].horaFinActividad);Descripcion.push(a.result[i].Descripcion);
//               }
//               console.log(horaInicioActividad,horaFinActividad,Descripcion);
//               socket.emit('respuestadatosParteDiario', {estado:estado,mañanaIngreso:mañanaIngreso,mañanaSalida:mañanaSalida,tardeingreso:TardeIngreso,tardesalida:TardeSalida,ocupacion:ocupacion,tramo:Tramo,nrointerno:NroInterno,iniciohorometro:InicioHorometro,finhorometro:FinHorometro,cantidad:CantidadCombus,tipo:tipoCombu,horaInicioActividad:horaInicioActividad,horaFinActividad:horaFinActividad,Descripcion:Descripcion});
//             });
//           }
//           else{
//             var estado='false';
//             socket.emit('respuestadatosParteDiario', {estado:estado});
//           }
//         });
//       }
//   });  