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
  host:"localhost",
  user:"root",
  password:"",
  database:"EjemploSistema",
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
        var ci=v.result[0].ci;
        var cargo=v.result[0].cargo;
        var auxx=nick + ' con CI: ' + ci;
        console.log('Ingreso a la pagina: ' , auxx);
        var aux=v.result[0].cargo;
        var desc=v.result[0].descripcion;
        if(aux=='ADMINISTRADOR'){
          var estado=true;
            socket.emit('LoginRespuesta',{"nombre":nick,"ci":ci,"estado":estado, "cargo":cargo});
        }else{
          if(aux=='RESIDENTE'){
            var estado=true;
            socket.emit('LoginRespuesta',{"nombre":nick,"ci":ci,"estado":estado,"cargo":cargo,"descripcion":desc});
          }
          else{
            if((aux=='TRABAJADOR')||(aux=='ENCARGADO CAMPAMENTO')){
              var estado=true;
              socket.emit('LoginRespuesta',{"nombre":nick,"ci":ci,"estado":estado,"cargo":cargo});
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
    console.log(informacion.ci);
    var using=Object();
    using.nick=informacion.nick;  //recuperar datos a actualizar
    using.nombres_apellidos=informacion.nombres;  //recuperar datos a actualizar
    using.cargo=informacion.cargo;  //recuperar datos a actualizar
    using.domicilio=informacion.domicilio;  //recuperar datos a actualizar
    using.telefono=informacion.telefono;  //recuperar datos a actualizar
    query2.update("usuarios",using).where({"ci":informacion.ci}).execute(function(r){
      console.log(r.affectedRows);
      if(r.affectedRows==1){
        console.log('se actualizo');
      }
    });
  });
  socket.on('notificaciones',function(){
    var nombresNoti=[];var cargo=[];var descripNoti=[];var fechaNoti=[];var direccionImg=[];
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
  });
  socket.on('BuscadorUsuarios',function(valor){
    var nombreCompleto=[];var ci=[];
    query2.get("usuarios").contains({'nombres_apellidos':valor}).execute(function(rows2){
      if(rows2.result.length>0){
        console.log('estos son los nombres '+rows2.result.length);
        for(var i=0; i<rows2.result.length; i++){
          nombreCompleto.push(rows2.result[i].nombres_apellidos);
          ci.push(rows2.result[i].ci);
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
              if(rows2.result[i].ciDestino==rows1.result[j].ci){
                nombresMensaje.push(rows1.result[j].nombres_apellidos);
                CIMensaje.push(rows1.result[j].ci);
                Mensajes.push(rows2.result[i].mensaje);
                fechaMensaje.push(rows2.result[i].fecha);
              }
            }else{
              if(rows2.result[i].ciOrigen==rows1.result[j].ci){
                nombresMensaje.push(rows1.result[j].nombres_apellidos);
                CIMensaje.push(rows1.result[j].ci);
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
});
module.exports = app;