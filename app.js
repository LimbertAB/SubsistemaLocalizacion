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
var nmea=require("node-nmea");
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

var settings={host:"localhost",user:"root",password:"",database:"sistemasedecauatf",port:""}
var query=db.mysql(settings);
// var settings2={host:"192.168.43.201",user:"sistemas",password:"12345",database:"subsistemaproyectos",port:""}
// var query3=db.mysql(settings2);
// var settings2={host:"localhost",user:"root",password:"",database:"subsistemaproyectos",port:""}
// var query3=db.mysql(settings2);

// error handlers
var nicknamesx=[];
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
  //console.log('conectados',socket);
  var estado='false';
  var stado='true';
  var user=Object();

   
  socket.on('Login',function(data){
    console.log(data.nombre,data.contras);
    query.get("usuarios").where({"nick":data.nombre,"pass":data.contras}).execute(function(v){ 
      if(v.result.length==1){
        var usuario=[];
        usuario.push({"idusuario":v.result[0].idusuario,"nombres":v.result[0].nombres_apellidos,'nick':v.result[0].nick,'ci':v.result[0].ci,'cargo':v.result[0].cargo,'domicilio':v.result[0].domicilio,'telefono':v.result[0].telefono,'celular':v.result[0].celular});
        if(v.result[0].cargo!='Administrador'){
          var fecha = new Date();var ano = fecha.getFullYear();
          query.get("residencias").where({'año':ano}).execute(function(residenciaño){
            console.log('//',residenciaño);
            if(residenciaño.result.length>0){
              query.get("asignacionusuarios").where({'idusuario':v.result[0].idusuario}).execute(function(asignacion){
                console.log('....',asignacion);
                if(asignacion.result.length>0){
                  var residencia=[];var contador=0;
                  var idresidencia,nombreresidencia,estadoresidencia;
                  for (var j=0;j<asignacion.result.length;j++){
                    for (var i=0;i<residenciaño.result.length;i++){ //2
                      if(residenciaño.result[i].idresidencias==asignacion.result[j].idresidencia){
                        contador=contador+1;
                        console.log('kk',contador);
                        idresidencia=residenciaño.result[i].idresidencias;estadoresidencia=residenciaño.result[i].estado;nombreresidencia=residenciaño.result[i].nombre;
                      } 
                    }
                  }
                  if(contador==1){
                    if(estadoresidencia=='habilitado'){
                      console.log('todo okey');
                      residencia.push({"idresidencia":idresidencia,"nombreresidencia":nombreresidencia,'estadoresidencia':true});
                    }else{
                      console.log('residencia desabilitada');
                      residencia.push({"idresidencia":idresidencia,"nombreresidencia":nombreresidencia,'estadoresidencia':false});
                    }
                    socket.emit('LoginRespuesta',{"estado":true,"usuario":usuario,"estadoasignacion":true,"residencia":residencia});
                  }else{
                    console.log('no estas asignado en ninguna residencia esta gestion');
                    socket.emit('LoginRespuesta',{"estado":true,"usuario":usuario,"estadoasignacion":false});
                  }
                }else{
                  console.log('no estas asignado en ninguna residencia1');
                  socket.emit('LoginRespuesta',{"estado":true,"usuario":usuario,"estadoasignacion":false});
                }
              });
            }else{
              console.log('no estas asignado en ninguna residencia2');
              socket.emit('LoginRespuesta',{"estado":true,"usuario":usuario,"estadoasignacion":false});
            }
          });
        }else{
          socket.emit('LoginRespuesta',{"estado":true,"usuario":usuario});
        }
      }else{
        console.log('no hay usuario');
        socket.emit('LoginRespuesta',{"estado":false});
      }
    });
  });
  socket.on('LoginANDROID',function(data){
    query.get("usuarios").where({"nick":data.nombre,"pass":data.pass}).execute(function(v){ 
      if(v.result.length==1){
        console.log('id usuario a la aplicacion: ',v.result[0].idusuario);
        socket.emit('respuestaLoginANDROID',{"estado":true,"idusuario":v.result[0].idusuario});
      }else{
        console.log('no hay usuario');
        socket.emit('respuestaLoginANDROID',{"estado":false});
      }
    });
  });
  socket.on('listarUsuarios',function(aux){
    console.log(aux);
    if(aux!=''){
      query.get("usuarios").where({'ubicacion':aux}).execute(function(v){
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
      query.get("usuarios").execute(function(v){
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
    query.get("usuarios").where({'idusuario':aux}).execute(function(v){
      if(v.result.length==1){
        var lista1=[];var lista2=[];var lista3=[];var lista4=[];var lista5=[];var lista6=[];var lista7=[]; var lista8=[];var lista9=[];  
        lista1.push(v.result[0].idusuario);lista2.push(v.result[0].nombres_apellidos);lista3.push(v.result[0].nick);lista4.push(v.result[0].ci);lista5.push(v.result[0].cargo);lista7.push(v.result[0].domicilio);lista8.push(v.result[0].telefono);lista9.push(v.result[0].celular);
        socket.emit('RespuestaListaUnUsuario',{'estado':'listar',"idusuario":lista1,"nombres":lista2,'nick':lista3,'ci':lista4,'cargo':lista5,'domicilio':lista7,'telefono':lista8,'celular':lista9});
      } 
    }); 
  });
  socket.on('Buscaruseradm',function(valor){
    console.log(valor);
    query.get("usuarios").contains({'nombres_apellidos':valor}).execute(function(rows2){
      if(rows2.result.length>0){
        var nombreCompleto=[];var ci=[];
        for(var i=0; i<rows2.result.length; i++){
          nombreCompleto.push(rows2.result[i].nombres_apellidos);
          ci.push(rows2.result[i].idusuario);
        }
        socket.emit('RespuestaBuscaruseradm',{'estado':true,'nombreCompleto':nombreCompleto,'idusuario':ci});
      }else{
        socket.emit('RespuestaBuscaruseradm',{'estado':false}); 
      }
    });
  });
  socket.on('buscarvehiculos',function(valor){
    query.get("vehiculos").contains({'codinterno':valor}).execute(function(rows2){
      if(rows2.result.length>0){
        var codinterno=[],placa=[],idvehiculo=[];
        for(var i=0; i<rows2.result.length; i++){
          codinterno.push(rows2.result[i].codinterno);
          placa.push(rows2.result[i].placa);
          idvehiculo.push(rows2.result[i].idequipos);
        }
        socket.emit('respuestabuscarvehiculos',{'estado':true,'codinterno':codinterno,'placa':placa,'idvehiculo':idvehiculo});
      }else{
        socket.emit('respuestabuscarvehiculos',{'estado':false}); 
      }
    });
  });
  socket.on("nuevaNoticia",function(usernoti){
    user.ciNoti=usernoti.ci;
    user.descripcion=usernoti.noticia;
    user.direccion=usernoti.direccion;
    var nombresNoti=[];var cargo=[];var descripNoti=[];var fechaNoti=[];var direccionImg=[];
    query.save("notificaciones",user,(function(r){
      if(r.affectedRows==1){
        query.get("usuarios").execute(function(rows1){
          query.get("notificaciones").execute(function(rows2){
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
  socket.on('ActualizarUsuarios',function(informacion){
    console.log(informacion);
    var using=Object();
    using.nombres_apellidos=informacion.nombres;
    using.nick=informacion.nick;
    using.ci=informacion.ci;
    using.domicilio=informacion.domicilio;
    using.telefono=informacion.telefono;
    using.celular=informacion.celular;
    query.update("usuarios",using).where({"idusuario":informacion.idusuario}).execute(function(r){
      if(r.affectedRows==1){
        query.get("usuarios").where({'idusuario':informacion.idusuario}).execute(function(v){
          var lista1=[];var lista2=[];var lista3=[];var lista4=[];var lista5=[];var lista6=[];var lista7=[]; var lista8=[];var lista9=[];  
          lista1.push(v.result[0].idusuario);lista2.push(v.result[0].nombres_apellidos);lista3.push(v.result[0].nick);lista4.push(v.result[0].ci);lista5.push(v.result[0].cargo);lista6.push(v.result[0].ubicacion);lista7.push(v.result[0].domicilio);lista8.push(v.result[0].telefono);lista9.push(v.result[0].celular);
          socket.emit('RespuestaListaUnUsuario',{'estado':'actualizado',"idusuario":lista1,"nombres":lista2,'nick':lista3,'ci':lista4,'cargo':lista5,'ubicacion':lista6,'domicilio':lista7,'telefono':lista8,'celular':lista9});
        }); 
      }
      else{
        socket.emit('RespuestaListaUnUsuario',{'estado':'fallido'});
      }
    });
  });
  socket.on('ActualizarVehiculos',function(informacion){
    console.log(informacion);
    var carupdate=Object();
    carupdate.codinterno=informacion.codinterno;
    carupdate.placa=informacion.placa;
    carupdate.modelo=informacion.modelo;
    carupdate.marca=informacion.marca;
    carupdate.color=informacion.color;
    carupdate.tipo=informacion.tipo;
    carupdate.combustible=informacion.combustible;
    carupdate.perfil=informacion.perfil;
    query.update("vehiculos",carupdate).where({"idequipos":informacion.idequipos}).execute(function(r){
      if(r.affectedRows==1){
        socket.emit('respuestaActualizarVehiculos',true); 
      }
      else{
        socket.emit('respuestaActualizarVehiculos',true);
      }
    });
  });
  socket.on('notificaciones',function(){
    var nombresNoti=[];var cargo=[];var descripNoti=[];var fechaNoti=[];var direccionImg=[];
    query.get("usuarios").execute(function(rows1){
        query.get("notificaciones").execute(function(rows2){
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
    query.get("usuarios").contains({'nombres_apellidos':valor}).execute(function(rows2){
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
    query.get("usuarios").execute(function(rows1){
      query.get("mensajes").where_or({"ciOrigen":valor,"ciDestino":valor}).execute(function(rows2){
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
    query.get("usuarios").where_or({'descripcion':'trabajador','cargo':'Encargado de Campamento'}).execute(function(v){
      var CI=[];var Nombres=[];
      for(var i=0; i<v.result.length; i++){
        Nombres.push(v.result[j].nombres_apellidos);
        CI.push(v.result[i].ci);
      }
      socket.emit('RespuestaBuscarUsuariosResidencia',{ nombres:Nombres, ci:CI});
    });
  });
  socket.on('DamePersonalResidencia',function(cis){
    query.get("usuarios").execute(function(usuarios){
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
    query.get("mensajes").where_or({"ciOrigen":data.mici,"ciDestino":data.mici}).execute(function(enviados){
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
  socket.on('nuevousuario',function(data){
    console.log('este es mi nick',data);
    var nombre='username'+data;var aux=0;
    for (var i = 0; i < nicknamesx.length; i++) {
      if(nicknamesx[i]==nombre){
        aux++;
      }
    };if(aux==0){
      socket.nickname=nombre;
      nicknamesx.push(nombre);
      socket.join(nombre);
      io.to(nombre).emit('usernames',true);
    }
  });
  socket.on('enviandoUnMensaje',function(MensajesEntrada){
    console.log('llegaron',MensajesEntrada);
    var date = new Date;
    var meses = new Array ("Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic");
    var datosMensajes=Object();
    datosMensajes.ciOrigen=MensajesEntrada.origen;
    datosMensajes.ciDestino=MensajesEntrada.destino;
    datosMensajes.mensaje=MensajesEntrada.mensaje;
    var fecha=date.getDate() + " " + meses[date.getMonth()] + " " + date.getFullYear();
    var hora=date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
    datosMensajes.fecha=fecha;
    datosMensajes.hora=hora;
    query.save("mensajes",datosMensajes,(function(r){
      if(r.affectedRows==1){
        var user='username'+MensajesEntrada.destino;
        io.to(user).emit('respuestaMensajeSolo',{msn:MensajesEntrada.mensaje,fecha:fecha,hora:hora});
      }
      else{
        //nose inserto el mensaje
      }
    }));
  });
  socket.on('ListaCI',function(todos){
    console.log('llego campamento',todos);
    query.get("usuarios").execute(function(usuarios){
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
    query.get("usuarios").execute(function(usuario){
      query.get("ubicacionusuarios").execute(function(localizacion){
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
    query.get("usuarios").where({'ci':valor}).execute(function(usuario){
      query.get("ubicacionusuarios").where({'CiUsuario':valor}).execute(function(localizacion){
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
    query.get("usuarios").contains({'nick':valor}).execute(function(rows2){
      if(rows2.result.length==0){
        socket.emit('respuestanombreusuario',true);
      }else{
        socket.emit('respuestanombreusuario',false); 
      }
    });
  });
  socket.on('listaResidencias1',function(valor){
    query.get("residencias").execute(function(rows2){
      if(rows2.result.length==0){
        socket.emit('respuestalistaResidencias',false);
      }else{
        socket.emit('respuestalistaResidencias',true); 
      }
    });
  });
  socket.on('listarSam',function(){
    var codsam=[];var descripcion=[];var unidad=[];var presunit=[];
    query.get("codificacionsam").execute(function(row){
      if(row.result.length>0){
        for(var i=0; i<row.result.length; i++){
          codsam.push(row.result[i].codsam);
          descripcion.push(row.result[i].descripcion);
          unidad.push(row.result[i].unidad);
          presunit.push(row.result[i].presunit);
        }
        socket.emit("RespuestalistarSam",{"estado":true,"codsam":codsam,"descripcion":descripcion,"unidad":unidad,"presunit":presunit});
      }
      else{
        socket.emit("RespuestalistarSam",{"estado":false});
      }
    });  
  });
  socket.on('buscarcodigointerno',function(valor){
    query.get("vehiculos").where({'codinterno':valor.valor}).execute(function(rows2){
      if(rows2.result.length==0){
        if(valor.estado!=undefined){
          socket.emit('respuestabuscarcodigointerno2',true);
        }else{
          socket.emit('respuestabuscarcodigointerno',true);
        }
      }else{
        if(valor.estado!=undefined){
          socket.emit('respuestabuscarcodigointerno2',false);
        }else{
          socket.emit('respuestabuscarcodigointerno',false); 
        }
      }
    });
  });
  socket.on('listarVehiculos',function(aux){
      query.get("vehiculos").execute(function(v){
        if(v.result.length>0){
          var lista1=[];var lista2=[];var lista3=[];var lista4=[];
          for(var i=0; i<v.result.length; i++){
            lista1.push(v.result[i].codinterno);lista2.push(v.result[i].idresidencia);lista3.push(v.result[i].tipo);lista4.push(v.result[i].estado);
          }
          socket.emit('respuestalistarVehiculos',{'responde':true,"codinterno":lista1,"ubicacion":lista2,'tipo':lista3,'estado':lista4});
        }else{
          socket.emit('respuestalistarVehiculos',{'responde':false});
        }
      });
  });
  socket.on('listaUnVehiculo',function(aux){
    query.get("vehiculos").where({'idequipos':aux}).execute(function(v){
      query.get("codificacionvehiculos").where({'idcodificacionvehiculos':v.result[0].tipo}).execute(function(t){
        socket.emit('respuestalistaUnVehiculo',{"codinterno":v.result[0].codinterno,"idvehiculo":aux,'placa':v.result[0].placa,'modelo':v.result[0].modelo,'marca':v.result[0].marca,'color':v.result[0].color,'codtipo':v.result[0].tipo,'tipo':t.result[0].descripcion,'combustible':v.result[0].combustible,'estado':v.result[0].perfil});
      });
    });
  });
  socket.on('buscarquenoexistaresidencia',function(aux){
    console.log(aux);
    query.get("residencias").contains({'nombre':aux.valor}).execute(function(v){
      console.log(v.result.length);
      if(v.result.length==0){
        socket.emit('respuestabuscarquenoexistaresidencia',{estado:true});
      }
      else{
        var nombre=[],latitud=[],longitud=[],ubicacion=[],contador=0,auxii=0,valores=[];
        for (var i = 0; i < v.result.length; i++) {
          if(v.result[i].idresidencias!=''){
            for (var j = i; j < v.result.length; j++) {
              if((v.result[i].latitud==v.result[j].latitud)){
                v.result[j].idresidencias='';
                auxii=i;
              }
            }
            valores.push(auxii);
          }
        }
        if(aux.gestion==null){
          query.get("residencias").where({'idresidencias':aux.idresidencia}).execute(function(ve){
            gestion=ve.result[0].año;
            for (var i = 0; i < valores.length; i++) {
              var uu=valores[i];
              if((gestion!=v.result[uu].año)){
                nombre.push(v.result[uu].nombre);
                latitud.push(v.result[uu].latitud);
                longitud.push(v.result[uu].longitud);
                ubicacion.push(v.result[uu].ubicacion);
              }
            }
            socket.emit('respuestabuscarquenoexistaresidencia',{estado:false,nombre:nombre,lat:latitud,lng:longitud,ubicacion:ubicacion});
          });
        }else{
          for (var i = 0; i < valores.length; i++) {
            var uu=valores[i];
            if((aux.gestion!=v.result[uu].año)){
              nombre.push(v.result[uu].nombre);
              latitud.push(v.result[uu].latitud);
              longitud.push(v.result[uu].longitud);
              ubicacion.push(v.result[uu].ubicacion);
            }
          }
          socket.emit('respuestabuscarquenoexistaresidencia',{estado:false,nombre:nombre,lat:latitud,lng:longitud,ubicacion:ubicacion});
        }
      } 
    }); 
  });
  socket.on('RegistrarResidencia',function(datos){
    console.log('llegaron',datos);
    var datoresidencia=Object();
    datoresidencia.nombre=datos.nombre;
    datoresidencia.latitud=datos.latitud;
    datoresidencia.longitud=datos.longitud;
    datoresidencia.ubicacion=datos.ubicacion;
    datoresidencia.estado=datos.estado;
    datoresidencia.año=datos.gestion;
    query.save("residencias",datoresidencia,(function(r){
      if(r.affectedRows==1){
        socket.emit("RespuestaRegistrarResidencia",true);
      }
      else{
        socket.emit("RespuestaRegistrarResidencia",false);
      }
    }));
  });
  socket.on('ActualizarResidencia',function(datos){
    console.log('llegaron',datos);
    var datoresidencia=Object();
    datoresidencia.nombre=datos.nombre;
    datoresidencia.latitud=datos.latitud;
    datoresidencia.longitud=datos.longitud;
    datoresidencia.ubicacion=datos.ubicacion;
    query.update("residencias",datoresidencia).where({"idresidencias":datos.idresidencia}).execute(function(r){
      if(r.affectedRows==1){
        socket.emit("RespuestaActualizarResidencia",true);
      }
      else{
        socket.emit("RespuestaActualizarResidencia",false);
      }
    });
  });
  socket.on('asignarusuariosaresidencia',function(datos){
    console.log('llegaron',datos);
    var x=-1;
    for (var i=0;i<datos.idusuarios.length;i++) {
      var useresidencia=Object();
      useresidencia.idusuario=datos.idusuarios[i];
      useresidencia.idresidencia=datos.idresidencia;
      useresidencia.perfil=datos.perfil[i];
      useresidencia.estado='Activo';
      query.save("asignacionusuarios",useresidencia,(function(r){
        if(r.affectedRows==1){
          if(i==(datos.idusuarios.length)){
              socket.emit('Respuestaasignarusuariosresidencia',{'estado':true});
          }
        }
        else{
          if(i==(datos.idusuarios.length)){
              socket.emit('Respuestaasignarusuariosresidencia',{'estado':false});
          }
        }
      }));
    }
  });
  socket.on('asignartramosaresidencia',function(datos){
    for (var i=0;i<datos.tramos.length;i++) {
      var useresidencia=Object();
      useresidencia.idresidencia=datos.idresidencia;
      useresidencia.descripcion=datos.tramos[i];
      query.save("tramos",useresidencia,(function(r){
        if(r.affectedRows==1){
          socket.emit('Respuestaasignartramosaresidencia',true);
        }
        else{
          socket.emit('Respuestaasignartramosaresidencia',false);
        }
      }));
    }
  });
  socket.on('asignarvehiculosaresidencia',function(datos){
    for (var i=0;i<datos.idvehiculo.length;i++) {
      var caresidencia=Object();
      caresidencia.idequipo=datos.idvehiculo[i];
      caresidencia.idresidencia=datos.idresidencia;
      caresidencia.estado='Activo';
      query.save("asignacionvehiculos",caresidencia,(function(r){
        if(r.affectedRows==1){
          socket.emit('Respuestaasignarvehiculosaresidencia',true);
        }
        else{
          socket.emit('Respuestaasignarvehiculosaresidencia',false);
        }
      }));
    }
  });
  socket.on('asignamaterialresidencia',function(datos){
    var materiales=Object();
    materiales.descripcion=datos.material;
    materiales.unidaddemedida=datos.unidad;
    materiales.cantidad=datos.cantidad;
    materiales.preciounitario=datos.preciounitario;
    materiales.idresidenciamateriales=datos.idresidencia;
    query.save("asignacionmateriales",materiales,(function(r){
      if(r.affectedRows==1){
        socket.emit('respuestaasignamaterialresidencia',true);
      }
      else{
        socket.emit('respuestaasignamaterialresidencia',false);
      }
    }));
  });
  socket.on('asignaservicioresidencia',function(datos){
    console.log('llegaron',datos);
    var servicios=Object();
    servicios.servicios=datos.servicio;
    servicios.preciounitario=datos.preciounitario;
    servicios.idresidenciaservicios=datos.idresidencia;
    query.save("asignacionservicios",servicios,(function(r){
      if(r.affectedRows==1){
        socket.emit('respuestaasignaservicioresidencia',true);
      }
      else{
        socket.emit('respuestaasignaservicioresidencia',false);
      }
    }));
  });
  socket.on('cambiarEstadoResidencia',function(informacion){
    console.log(informacion);
    var residencia=Object();
    residencia.estado=informacion.estado;
    query.update("residencias",residencia).where({"idresidencias":informacion.idresidencia}).execute(function(r){
      if(r.affectedRows==1){
        socket.emit('respuestacambiarEstadoResidencia',true);
      }else{
        socket.emit('respuestacambiarEstadoResidencia',false);
      }
    });
  });
  socket.on('damecordenadasdeusuario',function(aux){
    query.get("ubicacionusuarios").where({'idusuarios':aux.iduser,'Fecha':aux.fecha}).execute(function(ubicaciones){
      console.log(ubicaciones);
      if(ubicaciones.result.length>0){
        var lista1=[],lista2=[],lista3=[],lista4=[];
        for(var i=0; i<ubicaciones.result.length; i++){
          lista1.push(ubicaciones.result[i].Fecha);lista2.push(ubicaciones.result[i].Hora);
          lista3.push(ubicaciones.result[i].latitud);lista4.push(ubicaciones.result[i].longitud);
        }
        socket.emit('respuestadamecordenadasdeusuario',{'responde':true,"fecha":lista1,"hora":lista2,'latitud':lista3,'longitud':lista4});
        console.log(lista1,lista2,lista3,lista4);
      }else{
        socket.emit('respuestadamecordenadasdeusuario',{'responde':false});
      }
    });
  });
  socket.on('insertarcoordenadasAndroid',function(datos){
    console.log(datos);
    var x=0;
    for (var i=0;i<datos.idusuarios.length;i++) {
      var coordenadas=Object();
      coordenadas.idusuarios=datos.idusuarios[i];
      coordenadas.latitud=parseFloat(datos.latitud[i]);
      coordenadas.longitud=parseFloat(datos.longitud[i]);
      coordenadas.Fecha=datos.fecha[i].toString();
      coordenadas.Hora=datos.hora[i];
      query.save("ubicacionusuarios",coordenadas,(function(r){
        if(r.affectedRows==1){
          x=x+1;
          if(x==datos.idusuarios.length){
            socket.emit('response_android',{'estado':true});
            socket.broadcast.emit('coordenadas_android',{'estado':true,'idusuarios':datos.idusuarios,'latitudes':datos.latitud,'longitudes':datos.longitud,'fechas':datos.fecha,'horas':datos.hora});
          }
        }
        else{
          socket.emit('response_android',{'estado':false});
        }
      }));
    }
  });
  socket.on('programacionactividadespersonal',function(aux){
    var idproquincenal;
    var idproquincenal2;
    var asignartotal=[];
    query.get("codificacionsam").execute(function(sam){
      query.get("asignaciondiasquincenal").where({'idresidencia':aux.idresidencia,'mes':aux.mes}).execute(function(asignardias){
        if(asignardias.result.length>0){
          query.get("asignaciontareaspersonalquincenal").execute(function(usertareas){
            query.get("usuarios").execute(function(users){
              for(var i=0; i<asignardias.result.length; i++){
                var usuarios,dias=asignardias.result[i].dia,samcod;
                for(var j=0; j<usertareas.result.length; j++){
                  if(asignardias.result[i].idasignaciondiasquincenal==usertareas.result[j].idasignaciondias){
                    for(var k=0; k<users.result.length; k++){
                      if(users.result[k].idusuario==usertareas.result[j].idusuario){
                        usuarios=users.result[k].nombres_apellidos;
                      }
                    }
                    for(var l=0; l<sam.result.length; l++){
                      if(asignardias.result[i].idsam==sam.result[l].idsam){
                        samcod=sam.result[i].descripcion;
                      }
                    }
                  }
                }
                asignartotal.push({'dias':dias,'nombres':usuarios,'sam':samcod});
              }
              socket.emit('respondeprogramacionactividadespersonal',{'estado':true,'asignaciontotal':asignartotal});
            });
          });
        }else{
          query.get("programacionquincenal").where({'idresidencia':aux.idresidencia,'mes':aux.mes}).execute(function(quincenal){
            if(quincenal.result.length>0){
              idproquincenal=quincenal.result[0].idprogramacionquincenal;
              idproquincenal2=quincenal.result[0].idprogramacionquincenal;
              if(quincenal.result.length>1){
                idproquincenal2=quincenal.result[1].idprogramacionquincenal;
                var totaltickes=[],totaltickes1=[];
                query.get("detalleproquincenal").where_or({'idproquincena':idproquincenal}).execute(function(detallequincenal){
                  query.get("detalleproquincenal").where_or({'idproquincena':idproquincenal2}).execute(function(detallequincenal2){
                    query.get("asignaciontareaspersonalquincenal").execute(function(usertareas){
                      for(var i=0; i<detallequincenal.result.length; i++){
                        var samcod,tickeo,idsam;
                        for(var j=0; j<sam.result.length; j++){
                          if(detallequincenal.result[i].idsam==sam.result[j].idsam){
                            idsam=detallequincenal.result[i].idsam;
                            tickeo=detallequincenal.result[i].tickeo;
                            samcod=sam.result[i].descripcion;
                          }
                        }
                        totaltickes.push({'idsam':idsam,'tickeo':tickeo,'sam':samcod})
                      }
                      for(var i=0; i<detallequincenal2.result.length; i++){
                        var samcod1,tickeo1,idsam1;
                        for(var j=0; j<sam.result.length; j++){
                          if(detallequincenal2.result[i].idsam==sam.result[j].idsam){
                            idsam1=detallequincenal2.result[i].idsam;
                            tickeo1=detallequincenal2.result[i].tickeo;
                            samcod1=sam.result[i].descripcion;
                          }
                        }
                        totaltickes1.push({'idsam':idsam1,'tickeo':tickeo1,'sam':samcod1})
                      }
                      console.log('hey',totaltickes);
                      console.log('hoy',totaltickes1);
                      socket.emit('respondeprogramacionactividadespersonal',{'estado':false,'estadoquincena':true,'totalsemanas':true,'totalticket':totaltickes,'totalticket1':totaltickes1});
                    });
                  });
                });
              }
              else{
                var totaltickes=[];
                query.get("detalleproquincenal").where_or({'idproquincena':idproquincenal}).execute(function(detallequincenal){
                  console.log('ñññññ',detallequincenal);
                  query.get("asignaciontareaspersonalquincenal").execute(function(usertareas){
                    for(var i=0; i<detallequincenal.result.length; i++){
                      var samcod=[],tickeo=[],idsam=[];
                      for(var j=0; j<sam.result.length; j++){
                        if(detallequincenal.result[i].idsam==sam.result[j].idsam){
                          idsam.push(detallequincenal.result[i].idsam);
                          tickeo.push(detallequincenal.result[i].tickeo);
                          samcod.push(sam.result[i].descripcion);
                        }
                      }
                      totaltickes.push({'idsam':idsam,'tickeo':tickeo,'sam':samcod})
                    }
                    socket.emit('respondeprogramacionactividadespersonal',{'estado':false,'estadoquincena':true,'totalsemanas':false,'totalticket':totaltickes});
                  });
                });
              }
            }
            else{
              socket.emit('respondeprogramacionactividadespersonal',{'estado':false,'estadoquincena':false});
              //no hay programacion quincenal en ese mes
            }
          });
        }
      });
    });
  });
  socket.on('registrarasignaciontrab',function(valor){
    var aux=0;
    console.log('llegoooooooooooo',valor);
    var dato0=Object();
    for(var i=0;i<valor.actividadd.length;i++){
      dato0.idresidencia=valor.idresidencia;
      dato0.mes=valor.mes;
      dato0.dia=valor.diass[i];
      dato0.idsam=valor.actividadd[i];
      query.save("asignaciondiasquincenal",dato0,(function(resultado){
        if(resultado.affectedRows==1){
          aux=aux+1;
          console.log('aux',aux);
          if(aux==i){
            console.log('entro if',aux);
            query.get("asignaciondiasquincenal").execute(function(volumen){
              console.log('asignacion de dias:',volumen);
              var ultimo=(volumen.result.length)-(valor.diass.length);
              console.log('ultimo:',ultimo);
              var volid=volumen.result[ultimo].idasignaciondiasquincenal;
              console.log('su iddd:',volid);
              socket.emit('responderegistrarasignaciontrab',{'estado':true,'idvolumen':volid});
            });
          }
        }
      }));
    }
  });
  socket.on('llenarasignacionusuarios',function(valor){
      console.log('llegoooooooooooo',valor);
      var dato0=Object();
      for(var i=0;i<valor.userids.length;i++){
        dato0.idasignaciondias=valor.volumenes[i];
        dato0.idusuario=valor.userids[i];
        query.save("asignaciontareaspersonalquincenal",dato0,(function(resultado){
          if(resultado.affectedRows==1){
            socket.emit('respondellenarasignacionusuarios',true);
          }else{
            socket.emit('respondellenarasignacionusuarios',false);
          }
        }));
      }
  });
  socket.on('usuariosparamiresidencia',function(){
    var idresidencia=2;
    query.get('asignacionusuarios').where({'idresidencia':idresidencia}).execute(function(usuarioresidencia){
      if(usuarioresidencia.result.length>0){
        query.get('usuarios').execute(function(usuario){
          var nombres_apellidos=[];var idusuario=[];
            for(var j=0;j<usuarioresidencia.result.length;j++){
              idusuario.push(usuarioresidencia.result[j].idusuario);
              for(var k=0;k<usuario.result.length;k++){
                if(idusuario[j]==usuario.result[k].idusuario){
                  nombres_apellidos.push(usuario.result[k].nombres_apellidos);
                  //console.log('namesss', nombres_apellidos);
                }
              }  
            }
          //console.log('uno....',nombres_apellidos);
          socket.emit('respuestausuariosparamiresidencia', {'estado':true,'nombres_apellidos':nombres_apellidos,'idusuario':idusuario});
        });
      }else{
        socket.emit('respuestausuariosparamiresidencia', {'estado':false});
      }
    });
  });
  socket.on('insertarcoordenadasmemoriacard',function(value){
    aux=0;
    var meses = new Array ("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
    for (var i = 0; i < value.coordenadas.length; i++) {
      var gpsdata=Object();
      var raw = value.coordenadas[i];
      var data = nmea.parse(raw);
      console.log(data);
      if(data.valid==true){
        gpsdata.idvehiculo=value.idvehiculo;
        gpsdata.latitud=data.loc.geojson.coordinates[1];
        gpsdata.longitud=data.loc.geojson.coordinates[0];
        var mes;
        for (var j = 0; j < meses.length; j++) {
          if(meses[j]==(data.datetime).toString().substring(4,7)){
            if((j+1)<10){
              mes="0"+(j+1);
            }else{
              mes=j+1;
            }
          }
        }
        gpsdata.fecha=(data.datetime).toString().substring(8,10)+"-"+mes+"-"+(data.datetime).toString().substring(11,15);
        gpsdata.hora=(data.datetime).toString().substring(16,24);
        gpsdata.velocidad=data.speed.kmh;
        query.save("ubicaciongps",gpsdata,(function(resultado){
          if(resultado.affectedRows==1){
            aux=aux+1;
            if(aux==i){
              socket.emit('respuestainsertarcoordenadasmemoriacard',true);
            }
          }else{
            aux=aux+1;
            if(aux==i){
              socket.emit('respuestainsertarcoordenadasmemoriacard',false);
            }
          }
        }));
      }else{
        aux=aux+1;
        if(i==value.coordenadas.length-1){
          socket.emit('respuestainsertarcoordenadasmemoriacard',null);
        }
      }
    }
  });
  socket.on('damecordenadasdeunvehiculo',function(aux){
    query.get("ubicaciongps").where({'idvehiculo':aux.idcar,'fecha':aux.fecha}).execute(function(ubicaciones){
      console.log(ubicaciones);
      if(ubicaciones.result.length>0){
        var lista1=[],lista2=[],lista3=[],lista4=[],lista5=[];
        for(var i=0; i<ubicaciones.result.length; i++){
          lista1.push(ubicaciones.result[i].fecha);lista2.push(ubicaciones.result[i].hora);
          lista3.push(ubicaciones.result[i].latitud);lista4.push(ubicaciones.result[i].longitud);lista5.push(ubicaciones.result[i].velocidad);
        }
        socket.emit('respuestadamecordenadasdeunvehiculo',{'responde':true,"fecha":lista1,"hora":lista2,'latitud':lista3,'longitud':lista4,'velocidad':lista5});
      }else{
        socket.emit('respuestadamecordenadasdeunvehiculo',{'responde':false});
      }
    });
  });
  socket.on('enviarcodificacionactividades',function(datos){
    console.log('llegaron',datos);
    var x=0;
    for (var i=0;i<datos.codigo.length;i++){
      var datosam=Object();
      datosam.codsam=datos.codigo[i];
      datosam.descripcion=datos.descripcion[i];
      datosam.unidad=datos.unidad[i];
      query.save("codificacionsam",datosam,(function(r){
        if(r.affectedRows==1){
          x=x+1;
          if(x==datos.codigo.length){
            socket.emit('respuestaenviarcodificacionactividades',true);
          }
        }
        else{
          x=x+1;
          if(x==datos.codigo.length){
            socket.emit("respuestaenviarcodificacionactividades",false);
          }
        }
      }));
    }
  });
  socket.on('actualizarSam',function(informacion){
    console.log(informacion);
    var using=Object();
    using.codsam=informacion.codsam;
    using.descripcion=informacion.descripcion;
    using.unidad=informacion.unidad;
    using.presunit=informacion.presunit;
    query.update("codificacionsam",using).where({"codsam":informacion.codsam}).execute(function(r){
      if(r.affectedRows==1){
        query.get("codificacionsam").where({"codsam":informacion.codsam}).execute(function(v){
          var lista1=[];var lista2=[];var lista3=[];var lista4=[]; 
          lista1.push(v.result[0].codsam);lista2.push(v.result[0].descripcion);lista3.push(v.result[0].unidad);lista4.push(v.result[0].presunit);
          socket.emit('respuestaactualizarSam',{"estado":true,"codsam":lista1,"descripcion":lista2,'unidad':lista3,'presunit':lista4});
        }); 
      }else{
        socket.emit('respuestaactualizarSam',{"estado":false});
      }
    });
  });
  socket.on('enviarcodificacionpersonal',function(datos){
    console.log('llegaron',datos);
    var x=0;
    for (var i=0;i<datos.clase.length;i++){
      var codperson=Object();
      codperson.clase=datos.clase[i];
      codperson.descripcion=datos.descripcion[i];
      codperson.unidad='Hora';
      query.save("codificacionpersonal",codperson,(function(r){
        if(r.affectedRows==1){
          x=x+1;
          if(x==datos.clase.length){
            socket.emit('respuestaenviarcodificacionpersonal',true);
          }
        }
        else{
          x=x+1;
          if(x==datos.clase.length){
            socket.emit("respuestaenviarcodificacionpersonal",false);
          }
        }
      }));
    }
  });
  socket.on('enviarcodificacionvehiculo',function(datos){
    console.log('llegaron',datos);
    var x=0;
    for (var i=0;i<datos.clase.length;i++){
      var codvehic=Object();
      codvehic.clase=datos.clase[i];
      codvehic.descripcion=datos.descripcion[i];
      query.save("codificacionvehiculos",codvehic,(function(r){
        if(r.affectedRows==1){
          x=x+1;
          if(x==datos.clase.length){
            socket.emit('respuestaenviarcodificacionvehiculo',true);
          }
        }
        else{
          x=x+1;
          if(x==datos.clase.length){
            socket.emit("respuestaenviarcodificacionvehiculo",false);
          }
        }
      }));
    }
  });
  socket.on('enviarcodificacionmaterial',function(datos){
    console.log('llegaron',datos);
    var x=0;
    for (var i=0;i<datos.clase.length;i++){
      var codmaterial=Object();
      codmaterial.clase=datos.clase[i];
      codmaterial.descripcion=datos.descripcion[i];
      codmaterial.unidad=datos.unidad[i];
      query.save("codificacionmaterial",codmaterial,(function(r){
        if(r.affectedRows==1){
          x=x+1;
          if(x==datos.clase.length){
            socket.emit('respuestaenviarcodificacionmaterial',true);
          }
        }
        else{
          x=x+1;
          if(x==datos.clase.length){
            socket.emit("respuestaenviarcodificacionmaterial",false);
          }
        }
      }));
    }
  });
  socket.on('enviarsueldousuarios',function(datos){
    console.log('llegaron',datos);
    var x=0;
    for (var i=0;i<datos.codpersonal.length;i++){
      var salarios=Object();
      salarios.idcodificacionpersonal=datos.codpersonal[i];
      salarios.numeroitems=datos.nroitems[i];
      salarios.sueldomensual=datos.sueldomensual[i];
      salarios.gestion=datos.gestion;
      query.save("planillasalarial",salarios,(function(r){
        if(r.affectedRows==1){
          x=x+1;
          if(x==datos.codpersonal.length){
            socket.emit('respuestaenviarsueldousuarios',true);
          }
        }
        else{
          x=x+1;
          if(x==datos.codpersonal.length){
            socket.emit("respuestaenviarsueldousuarios",false);
          }
        }
      }));
    }
  });
  socket.on('versalariosgestiones',function(datos){
    query.get("planillasalarial").where({'gestion':datos}).execute(function(salario){
      console.log('salario------',salario.result);
      if(salario.result.length>0){
        var descripcions=[],nroitems=[],sueldomensual=[];
        query.get("codificacionpersonal").execute(function(codpersonal){
          for(var i=0; i<salario.result.length; i++){
            for(var j=0; j<codpersonal.result.length; j++){
              if(codpersonal.result[j].codigo==salario.result[i].idcodificacionpersonal){
                descripcions.push(codpersonal.result[j].descripcion);
              }
            }
            nroitems.push(salario.result[i].numeroitems);
            sueldomensual.push(salario.result[i].sueldomensual);
          }
          socket.emit('respuestaversalariosgestiones',{"estado":true,"descripcion":descripcions,"nroitem":nroitems,"sueldomensual":sueldomensual});
        });
      }
      else{
        socket.emit('respuestaversalariosgestiones',{"estado":false});
      }
    });
  });
  socket.on('eliminartramo',function(datos){
    query.delete('tramos').where({'idtramos':datos}).execute(function(res){
      console.log(res);
      if(res.affectedRows==1){
        console.log('sii');
        socket.emit('respuestaeliminartramo',true);

      }else{
        console.log('noo');
        socket.emit("respuestaeliminartramo",false);
      }
    });
  });
  socket.on('modificartramo',function(datos){
    console.log(datos);
    var using=Object();
    using.descripcion=datos.valor;
    query.update("tramos",using).where({"idtramos":datos.idtramo}).execute(function(r){
      if(r.affectedRows==1){
        socket.emit('respuestamodificartramo',true);
      }else{
        socket.emit("respuestamodificartramo",false);
      }
    });
  });
  socket.on('eliminarasignacionp',function(datos){
    query.delete('asignacionusuarios').where({'idasignacionusuarios':datos}).execute(function(res){
      if(res.affectedRows==1){
        socket.emit('respuestaeliminarasignacionp',true);

      }else{
        socket.emit("respuestaeliminarasignacionp",false);
      }
    });
  });
  socket.on('modificarpersonalresidencia',function(datos){
    console.log(datos);
    var using=Object();
    using.estado=datos.estado;
    using.perfil=datos.perfil;
    using.observaciones=datos.observacion;
    query.update("asignacionusuarios",using).where({"idasignacionusuarios":datos.idasignacionp}).execute(function(r){
      if(r.affectedRows==1){
        socket.emit('respuestamodificarpersonalresidencia',true);
      }else{
        socket.emit("respuestamodificarpersonalresidencia",false);
      }
    });
  });

  socket.on('eliminarasignacionv',function(datos){
    query.delete('asignacionvehiculos').where({'idasignacionvehiculos':datos}).execute(function(res){
      if(res.affectedRows==1){
        socket.emit('respuestaeliminarasignacionv',true);

      }else{
        socket.emit("respuestaeliminarasignacionv",false);
      }
    });
  });
  socket.on('modificarvehiculoresidencia',function(datos){
    console.log(datos);
    var using=Object();
    using.estado=datos.estado;
    using.observaciones=datos.observacion;
    query.update("asignacionvehiculos",using).where({"idasignacionvehiculos":datos.idasignacionv}).execute(function(r){
      if(r.affectedRows==1){
        socket.emit('respuestamodificarvehiculoresidencia',true);
      }else{
        socket.emit("respuestamodificarvehiculoresidencia",false);
      }
    });
  });

  socket.on('eliminarasignacionm',function(datos){
    query.delete('asignacionmateriales').where({'idmaterialesysuministros':datos}).execute(function(res){
      if(res.affectedRows==1){
        socket.emit('respuestaeliminarasignacionm',true);

      }else{
        socket.emit("respuestaeliminarasignacionm",false);
      }
    });
  });
  socket.on('modificarmaterialresidencia',function(datos){
    console.log(datos);
    var using=Object();
    using.unidaddemedida=datos.unidad;
    using.cantidad=datos.cantidad;
    using.preciounitario=datos.precio;
    query.update("asignacionmateriales",using).where({"idmaterialesysuministros":datos.idasignacionm}).execute(function(r){
      if(r.affectedRows==1){
        socket.emit('respuestamodificarmaterialresidencia',true);
      }else{
        socket.emit("respuestamodificarmaterialresidencia",false);
      }
    });
  });
  socket.on('verreportesporgestiones',function(datos){
    query.get("residencias").where({'año':datos}).execute(function(v){
      if(v.result.length>0){
        var lista1='',lista2='',residencias=[];
        for (var i = 0; i < v.result.length; i++) {
          residencias.push({idresidencia:v.result[i].idresidencias,nombre:v.result[i].nombre});
        }
        socket.emit('respuestaverreportesporgestiones',{estado:true,residencias:residencias});
      }else{
        socket.emit('respuestaverreportesporgestiones',{estado:false});
      }
    });
  });
});
module.exports = app;