var nombreAvatar;
var ciAvatar;
$(function(){ 
	var socket=io();
	var info=JSON.parse(localStorage.getItem('userinfo'));
	console.log('retrievedObject: ', info);
	//localStorage.removeItem('nombre');
	if(info.idusuario==''||info.idusuario==null||info.idusuario==undefined){
		location.href="index";
	}

	//listar mi informacion
	$('#miperfil').click(function(){
		console.log('click en mi perfil');
		socket.emit('listaUnUsuario',info.idusuario);
	});

//________________ADMINISTRACION DE USUARIOS___________________
	if(window.location.pathname=='/Usuarios'){$('body').css('background', 'transparent')}
	//LISTAR UN SOLO USUARIO
	$('.tablaV tr').click(function(){socket.emit('listaUnUsuario',$(this).closest('tr').attr('value'));});
	var controlador=0,idusuario;
	//respuesta de informacion de un solo usuario
	socket.on('RespuestaListaUnUsuario',function(valores){controlador=0;if(valores.estado!='fallido'){if(valores.estado=='actualizado'){swal("Satisfactorio!", "Informacion Actualizada correctamente", "success");}idusuario=valores.idusuario;$('.nomC').text(valores.nombres);$('.nicC').text(valores.nick);$('.ciC').text(valores.ci);$('.carC').text(valores.cargo);$('.domC').text(valores.domicilio);$('.telC').text(valores.telefono);$('.celC').text(valores.celular);	}else{sweetAlert("ERROR!", "Ocurrio un error de conexión intentelo nuevamente!", "error");}$(".User input").css('display','none');$(".User p").slideDown('fast');$('.edit').val('Editar');$('.edit').text('Editar');$('.edit').removeClass('disabled');
    	//MODIFICAR INFORMACION DE USUARIO
		$(".edit").click(function(){var aux2=$('.edit').val();if(aux2=='Editar'){$('.n').val($('.nomC').text());$('.k').val($('.nicC').text());$('.i').val($('.ciC').text());$('.d').val($('.domC').text());$('.t').val($('.telC').text());$('.c').val($('.celC').text());$(".User input").toggle(5);$(".titModalUser").css("display", "none");$('.edit').val('Guardar Cambios');$('.edit').text('Guardar Cambios');$('.edit').addClass('disabled');}else{if(aux2=='Guardar Cambios'){if(controlador==1){var valores={"idusuario":idusuario,"nombres":$('.n').val(),"nick":$('.k').val(),"ci":$('.i').val(),"domicilio":$('.d').val(),"telefono":$('.t').val(),'celular':$('.c').val()};socket.emit('ActualizarUsuarios',valores);}}}});
		//controla que realice una modificacion para actualizar
		$(".User input").keyup(function(){if(($('.n').val()!=$('.nomC').text()) || ($('.k').val()!=$('.nicC').text()) || ($('.i').val()!=$('.ciC').text()) || ($('.d').val()!=$('.domC').text()) || ($('.t').val()!=$('.telC').text()) || ($('.c').val()!=$('.celC').text())){$('.edit').removeClass('disabled');controlador=1;}else{$('.edit').addClass('disabled');}});
	});
	
	//___________________ REGISTRO NUEVO USUARIO_____________________ culminado
	if(window.location.pathname=='/RegistrarUsuario'){$('body').css('background', 'transparent')}
	//CONTROLAR EL INGRESO DEL NOMBRE COMPLETO
	$('.apellidoR').keyup(function(){if($(this).val().length>15){$('.form1').removeClass('has-error');$('.form1').addClass('has-success');$('.span1').removeClass('glyphicon-remove');$('.span1').addClass('glyphicon-ok');}else{$('.form1').removeClass('has-success');$('.form1').addClass('has-error');$('.span1').removeClass('glyphicon-ok');$('.span1').addClass('glyphicon-remove');}});
	//NO DEJAR INTRODUCIR ALGUNOS CARACTERES EN EL CAMBO NICK
	$(".nombreR").keydown(function (e) {if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,186]) !== -1 || (e.keyCode >= 35 && e.keyCode <= 39)) {return;}if ((e.keyCode < 48 || e.keyCode > 57)) {e.preventDefault();}});
	//CONTROLAR QUE NO EXISTRA NOMBRE DE USUARIO EN EL REGISTRO ENVIANDO AL SOCKET
	$('.nombreR').keyup(function(){if($(this).val().length>10)socket.emit('buscarnombreusuario',$(this).val());else{$('.form2').removeClass('has-success');$('.form2').addClass('has-error');$('.span2').removeClass('glyphicon-ok');$('.span2').addClass('glyphicon-remove');}});
	//RESPUESTA DEL SOCKET NOMBRE USUARIO
	socket.on('respuestanombreusuario',function(valor){if(valor==true){$('.form2').removeClass('has-error');$('.form2').addClass('has-success');$('.span2').removeClass('glyphicon-remove');$('.span2').addClass('glyphicon-ok');}else{$('.form2').removeClass('has-success');$('.form2').addClass('has-error');$('.span2').removeClass('glyphicon-ok');$('.span2').addClass('glyphicon-remove');}});	
	//CONTROLAR REGISTRO DE CI
	$('.ci').keyup(function(){if($(this).val().length>6){$('.form3').removeClass('has-error');$('.form3').addClass('has-success');$('.span3').removeClass('glyphicon-remove');$('.span3').addClass('glyphicon-ok');}else{$('.form3').removeClass('has-success');$('.form3').addClass('has-error');$('.span3').removeClass('glyphicon-ok');$('.span3').addClass('glyphicon-remove');}});
	//CONTROLAR LA CONTRASEÑA EN REGISTRO
	$('.contrasR').keyup(function(){if($(this).val().length>9){if($(this).val()==$('.repcontrasR').val()){$('.form5').removeClass('has-error');$('.form5').addClass('has-success');$('.span5').removeClass('glyphicon-remove');$('.span5').addClass('glyphicon-ok');}else{$('.form5').removeClass('has-success');$('.form5').addClass('has-error');$('.span5').removeClass('glyphicon-ok');$('.span5').addClass('glyphicon-remove');}$('.form4').removeClass('has-error');$('.form4').addClass('has-success');$('.span4').removeClass('glyphicon-remove');$('.span4').addClass('glyphicon-ok');}else{$('.form4').removeClass('has-success');$('.form4').addClass('has-error');$('.span4').removeClass('glyphicon-ok');$('.span4').addClass('glyphicon-remove');$('.form5').removeClass('has-success');$('.form5').addClass('has-error');$('.span5').removeClass('glyphicon-ok');$('.span5').addClass('glyphicon-remove');}});
	//CONTROLAR REPETIR CONTRASEÑA
	$('.repcontrasR').keyup(function(){if($(this).val()==$('.contrasR').val()&&($('.contrasR').val().length>9)){$('.form5').removeClass('has-error');$('.form5').addClass('has-success');$('.span5').removeClass('glyphicon-remove');$('.span5').addClass('glyphicon-ok');}else{$('.form5').removeClass('has-success');$('.form5').addClass('has-error');$('.span5').removeClass('glyphicon-ok');$('.span5').addClass('glyphicon-remove');}});
	//SELECCIONAR CARGO EN EL SISTEMA (SI CARGO ES ENCARGADO DE RESIDENCIA MOSTRAR OTRO CAMPO IMPUT)
	$('.cargoSistemaR').change(function(){if($(this).val()!='Seleccione Cargo'){$('.form6').removeClass('has-error');$('.form6').addClass('has-success');$(this).removeClass('glyphicon-remove');$(this).addClass('glyphicon-ok');}else{$('.form6').removeClass('has-success');$('.form6').addClass('has-error');$(this).removeClass('glyphicon-ok');$(this).addClass('glyphicon-remove');}});
	//CONTROLAR IMPUT DE DOMICILIO
	$('.domicilioR').keyup(function(){if($(this).val().length>5){$('.form7').removeClass('has-error');$('.form7').addClass('has-success');$('.span7').removeClass('glyphicon-remove');$('.span7').addClass('glyphicon-ok');}else{$('.form7').removeClass('has-success');$('.form7').addClass('has-error');$('.span7').removeClass('glyphicon-ok');$('.span7').addClass('glyphicon-remove');}});
	//CONTROLA CAMPOS IMPUT PARA HABILITAR EL BOTON ENVIAR REGISTRO
	$('.formulariosRegistro').change(function(){var aux=0;for(var i=1;i<9;i++){if($(".form"+i+"").hasClass("has-success")){aux++;}}if(aux==7){$(".btnEnviarRegistro").removeClass('disabled');}else{$(".btnEnviarRegistro").addClass('disabled');}});
	//ENVIAR REGISTRO DE NUEVO USUARIO
	$(".btnEnviarRegistro").click(function(){if($(this).hasClass('disabled')){return false;}else{var $btn = $(this).button('loading');return true;}});
	//UNA VEZ REGISTRADO EL USUARIO LANZAMOS EL MODAL CON EL RESULTADO
	if($('.resultadoRegistro').text()!=''){if($('.resultadoRegistro').text()=='true'){swal("Satisfactorio!", "El registro del Usuario se completo!", "success")}else{sweetAlert("ERROR!", "Ocurrio un error de conexión intentelo nuevamente!", "error");}}

//______________SAM__________________________________
	if(window.location.pathname=='/sam'){socket.emit('listarSam');}
	//socket respuesta de listar codigos sam
	socket.on('RespuestalistarSam',function(valor){if(valor.estado==true){for(var i=0;i<valor.codsam.length;i++){$('.tablaSambody').append('<tr id="filasam'+i+'" data-toggle="modal", data-target="#modalSam"><td>'+(i+1)+'</td><td id="actsam">'+valor.codsam[i]+'</td><td id="dessam">'+valor.descripcion[i]+'</td><td id="unisam">'+valor.unidad[i]+'</td><td id="presam">'+valor.presunit[i]+'</td></tr>');}}else{$('#alertaSamError').css('display','block');}$('.tablaSambody tr').click(function(){var num = $(this).closest('tr').attr('id');modificarSam(num);});});
	//REGISTRAR SAM
	$('#codS').keyup(function(){if($(this).val().length==4){$('#actividadS').attr('disabled', false);}else{$('#actividadS').attr('disabled', true);}});
	
	$('#actividadS').keyup(function(){if($(this).val().length>17){$('#unidadS').attr('disabled', false);}else{$('#unidadS').attr('disabled', true);}});
	
	$('#unidadS').change(function(){if($(this).val()!='Seleccione Unidad'){$('#preciounitarioS').attr('disabled', false);}else{$('#preciounitarioS').attr('disabled', true);}});
	
	$('#preciounitarioS').keyup(function(){if($(this).val().length>2){$('.btnRegistroSam').attr('disabled', false);}else{$('.btnRegistroSam').attr('disabled', true);}});
	
	$('.btnRegistroSam').click(function(){var datos1={codigo:$('#codS').val(),descripcion:$('#actividadS').val(),unidad:$('#unidadS').val(),preciounitario:$('#preciounitarioS').val()};$(this).button('loading');socket.emit('RegistrarSam',datos1);});
	//socke de respuesta de registro de codigo sam
	socket.on('RespuestaregistrarSam',function(valor){if(valor==true){swal({title: "Satisfactorio!",text: "Registro de la actividad satisfactoria",type: "success",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}else{swal({title:"ERROR!",text: "Ocurrio un error de conexión intentelo nuevamente!",type: "error",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}});
	//MODIFICAR CODIGO SAM
	function modificarSam(num){$('#'+num+'>#valu').replaceWith( "<h2>New heading</h2>" );$('.actsam').text($('#'+num+'>#actsam').text());$('.dessam').text($('#'+num+'>#dessam').text());$('.unisam').text($('#'+num+'>#unisam').text());$('.presam').text($('#'+num+'>#presam').text());}
	var controlador=0;
	$("#btnmodificarSam").click(function(){var aux2=$(this).text();if(aux2=='Modificar'){$('.inde').val($('.dessam').text());$('.inun').val($('.unisam').text());$('.inpr').val($('.presam').text());$("#modalSam input").toggle(5);$(".desaparecersam").css("display", "none");$(this).text('Guardar');$(this).addClass('disabled');}else{if(aux2=='Guardar'){if(controlador==1){var valores={"codsam":$('.actsam').text(),"unidad":$('.inun').val(),"descripcion":$('.inde').val(),"presunit":$('.inpr').val()};socket.emit('actualizarSam',valores);}}}});
	$("#modalSam input").keyup(function(){if(($('.inde').val()!=$('.dessam').text()) || ($('.inun').val()!=$('.unisam').text()) || ($('.inpr').val()!=$('.presam').text())){$('#btnmodificarSam').removeClass('disabled');controlador=1;}else{$('#btnmodificarSam').addClass('disabled');}});
	$('#btncancelarSam').click(function(){$(".desaparecersam").css("display", "block");$('#btnmodificarSam').text('Modificar').removeClass('disabled');$("#modalSam input").css("display", "none");controlador=0;});
	//socket respuesta de actualizar
	socket.on('respuestaactualizarSam',function(valores){if(valores.estado==true){$('.actsam').text(valores.codsam);$('.dessam').text(valores.descripcion);$('.unisam').text(valores.unidad);$('.presam').text(valores.presunit);$(".desaparecersam").css("display", "block");$('#btnmodificarSam').text('Modificar').removeClass('disabled');$("#modalSam input").css("display", "none");controlador=0;swal({title: "Satisfactorio!",text: "Registro de la actividad satisfactoria",type: "success",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}else{swal({title:"ERROR!",text: "Ocurrio un error de conexión intentelo nuevamente!",type: "error",confirmButtonText: "Aceptar",closeOnConfirm: false },function(){location.reload();});}});
	//efecto enpequeñecer y engranceder el menu de arriba
	$('#mainNav').affix({offset: {top: 100}});
	//efecto de animacion hacia abajo
	$('a[href^="#Notificaciones"]').click(function() {$('html,body').animate({ scrollTop: $(this.hash).offset().top}, 800);return false;e.preventDefault();});

//___________________ ADMINISTRACION DE VEHICULOS_____________________
	//_________ REGISTRO NUEVO VEHICULO____________
	//CONTROLAR QUE NO EXISTRA EL MISMO CODIGO INTERNO EN EL REGISTRO ENVIANDO AL SOCKET
	$('.group1 input').keyup(function(){if($(this).val().length>4){socket.emit('buscarcodigointerno',$(this).val());}else{$('.group1').removeClass('has-success');$('.group1').addClass('has-error');$('.group1 span').removeClass('glyphicon-ok');$('.group1 span').addClass('glyphicon-remove');}});
	//RESPUESTA DEL SOCKET CODIGOINTERNO
	socket.on('respuestabuscarcodigointerno',function(valor){if(valor==true){$('.group1').removeClass('has-error');$('.group1').addClass('has-success');$('.group1 span').removeClass('glyphicon-remove');$('.group1 span').addClass('glyphicon-ok');}else{$('.group1').removeClass('has-success');$('.group1').addClass('has-error');$('.group1 span').removeClass('glyphicon-ok');$('.group1 span').addClass('glyphicon-remove');}});
	//CONTROLAR EL INGRESO PLACA
	$('.group2 input').keyup(function(){if($(this).val().length>6){$('.group2').removeClass('has-error');$('.group2').addClass('has-success');$('.group2 span').removeClass('glyphicon-remove');$('.group2 span').addClass('glyphicon-ok');}else{$('.group2').removeClass('has-success');$('.group2').addClass('has-error');$('.group2 span').removeClass('glyphicon-ok');$('.group2 span').addClass('glyphicon-remove');}});
	//CONTROLAR EL INGRESO MODELO
	$('.group3 input').keyup(function(){if($(this).val().length>3){$('.group3').removeClass('has-error');$('.group3').addClass('has-success');$('.group3 span').removeClass('glyphicon-remove');$('.group3 span').addClass('glyphicon-ok');}else{$('.group3').removeClass('has-success');$('.group3').addClass('has-error');$('.group3 span').removeClass('glyphicon-ok');$('.group3 span').addClass('glyphicon-remove');}});
	//CONTROLAR EL INGRESO MARCA
	$('.group4 input').keyup(function(){if($(this).val().length>3){$('.group4').removeClass('has-error');$('.group4').addClass('has-success');$('.group4 span').removeClass('glyphicon-remove');$('.group4 span').addClass('glyphicon-ok');}else{$('.group4').removeClass('has-success');$('.group4').addClass('has-error');$('.group4 span').removeClass('glyphicon-ok');$('.group4 span').addClass('glyphicon-remove');}});
	//CONTROLAR EL INGRESO COLOR
	$('.group5 input').keyup(function(){if($(this).val().length>3){$('.group5').removeClass('has-error');$('.group5').addClass('has-success');$('.group5 span').removeClass('glyphicon-remove');$('.group5 span').addClass('glyphicon-ok');}else{$('.group5').removeClass('has-success');$('.group5').addClass('has-error');$('.group5 span').removeClass('glyphicon-ok');$('.group5 span').addClass('glyphicon-remove');}});
	//SELECCIONAR TIPO
	$('.group6 select').change(function(){if($(this).val()!='Seleccione Tipo'){$('.group6').removeClass('has-error');$('.group6').addClass('has-success');}else{$('.group6').removeClass('has-success');$('.group6').addClass('has-error');}});
	//SELECCIONAR COMBUSTIBLE
	$('.group7 select').change(function(){if($(this).val()!='Seleccione tipo de Combustible'){$('.group7').removeClass('has-error');$('.group7').addClass('has-success');}else{$('.group7').removeClass('has-success');$('.group7').addClass('has-error');}});
	//SELECCIONAR ESTADO
	$('.group8 select').change(function(){if($(this).val()!='Seleccione Estado'){$('.group8').removeClass('has-error');$('.group8').addClass('has-success');}else{$('.group8').removeClass('has-success');$('.group8').addClass('has-error');}});
	//CONTROLA CAMPOS IMPUT PARA HABILITAR EL BOTON ENVIAR REGISTRO
	$('.formulariosRegistro').change(function(){var aux=0;for(var i=1;i<9;i++){if($(".group"+i+"").hasClass("has-success")){aux++;}}if(aux>7){$("#btnEnviarRegistroVehiculo").removeClass('disabled');}else{$("#btnEnviarRegistroVehiculo").addClass('disabled');}});
	//ENVIAR REGISTRO DE NUEVO USUARIO
	$("#btnEnviarRegistroVehiculo").click(function(){if($(this).hasClass('disabled')){return false;}else{var $btn = $(this).button('loading');return true;}});
	//UNA VEZ REGISTRADO EL VEHICULO LANZAMOS EL ALERTA CON EL ESTADO
	if($('.resultadoRegistroVehiculo').text()!=''){if($('.resultadoRegistroVehiculo').text()=='true'){swal({title: "Satisfactorio!",text: "El registro del vehiculo se completo!",type: "success",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){window.location.href = "equipos";});}else{swal({title: "ERROR!",text: "Ocurrio un error de conexión intentelo nuevamente!",type: "error",confirmButtonText: "Aceptar",closeOnConfirm: false},function(){window.location.href = "equipos";});}$('.resultadoRegistroVehiculo').text('');}
	//ver informacion del vehiculo en el modal
	var fila;
	$('.tablabodyVehiculos tr').click(function(){fila=$(this).closest('tr').attr('id');$(".textupdatecar").show();$('#btnupdatecar').text('EDITAR');$('#btnupdatecar').removeClass('disabled');$(".inputsupdatecar").css("display", "none");$('.text1').text($('#'+fila+'>#codv').text());$('.text2').text($('#'+fila+'>#plav').text());$('.text3').text($('#'+fila+'>#marv').text());$('.text4').text($('#'+fila+'>#modv').text());$('.text5').text($('#'+fila+'>#colv').text());$('.text6').text($('#'+fila+'>#tipv').text());$('.text7').text($('#'+fila+'>#comv').text());$('.text8').text($('#'+fila+'>#estv').text());});
    //MODIFICAR INFORMACION DE VEHICULO
	$("#btnupdatecar").click(function(){if($(this).text()=='EDITAR'){$(this).addClass('disabled');$(".inputsupdatecar").show();$(this).text('Guardar Cambios');$(".textupdatecar").css("display", "none");$('#inputcarupdate1').val($('.text1').text());$('#inputcarupdate2').val($('.text2').text());$('#inputcarupdate3').val($('.text3').text());$('#inputcarupdate4').val($('.text4').text());$('#inputcarupdate5').val($('.text5').text());$('#inputcarupdate6').val($('.text6').text());$('#inputcarupdate7').val($('.text7').text());$('#inputcarupdate8').val($('.text8').text());	}else{if($(this).hasClass('disabled')){}else{var $btn = $(this).button('loading');var valores={"idequipos":fila,"codinterno":$('#inputcarupdate1').val(),"placa":$('#inputcarupdate2').val(),"modelo":$('#inputcarupdate4').val(),"marca":$('#inputcarupdate3').val(),"color":$('#inputcarupdate5').val(),'tipo':$('#inputcarupdate6').val(),'combustible':$('#inputcarupdate7').val(),'perfil':$('#inputcarupdate8').val()};socket.emit('ActualizarVehiculos',valores);}	}});
	//controla que realice una modificacion en los inputs
	$("#infocar input").keyup(function(){var cont=0;for (var i=1;i<6;i++){if(($('#inputcarupdate'+i+'').val())!=($('.text'+i+'').text())){cont=cont+1;}}if(cont>0){$('#btnupdatecar').removeClass('disabled');}else{$('#btnupdatecar').addClass('disabled');}});
	//controla que realice una modificacion en los selects
	$("#infocar select").change(function(){var cont=0;for (var i=6;i<9;i++){if(($('#inputcarupdate'+i+'').val())!=($('.text'+i+'').text())){cont=cont+1;}}console.log(cont);if(cont>0){$('#btnupdatecar').removeClass('disabled');}else{$('#btnupdatecar').addClass('disabled');}});
	//respuesta del socket actualizar vehiculo
	socket.on('respuestaActualizarVehiculos',function(valor){if(valor==true){swal({title: "Satisfactorio!",text: "La informacion del vehiculo se actualizo",type: "success",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){window.location.href = "equipos";});}else{swal({title: "ERROR!",text: "Ocurrio un error de conexión intentelo nuevamente!",type: "error",confirmButtonText: "Aceptar",closeOnConfirm: false},function(){window.location.href = "equipos";});}});



	//socket.emit('ConectarUsuario',miCi);
	//$(".avatarrr a").remove();var nombreAvaa=sessionStorage.getItem("Nombre")+'..';$('.avatarrr').append('<a class="dropdown-toggle avatarNombre" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" style="padding-left:0;padding-right:0;">'+nombreAvaa+'<span class="glyphicon glyphicon-user" aria-hidden="true"></span></a><ul class="dropdown-menu" aria-labelledby="dropdownMenu1"><li><a href="#">Salir</a></li><li><a href="#">Mi Perfil</a></li></ul>');var confirmacion=$('.h1Success').text();
	//if(confirmacion!=''){
		//$(".ventanaModal").slideDown('slow');
	//}
	$(".bann").hover(function(){
	    $('li').removeClass('open');
	   	$(this).addClass('open');
	});
	//BUSCADOR DE USUARIOS EN LA INTERFACE USUARIOS
	// var idd;
	// $('.buscador').keyup(function(){var valorTeclado=$(this).val();if(valorTeclado!=''){socket.emit('Buscaruseradm',valorTeclado);}});
	// socket.on("RespuestaBuscaruseradm",function(r){$('#resultado').empty();console.log(r);if(r.estado=='true'){for(var i=0;i<r.idusuario.length; i++) {$("#resultado").append( "<p class = "+r.idusuario[i]+" data-toggle='modal' data-target='#myModal'>"+r.nombreCompleto[i]+"</p>" );}}else{$("#resultado").append( "<p>NO SE ENCONTRARON COINCIDENCIAS</p>" );}
	// 	$( "#resultado p" ).click(function(){
	// 		idd=$(this).attr('class');
	// 		socket.emit('listaUnUsuario',idd);
	// 	});
	// });
	//OCULTAR RESULTADOS DE BUSCADOR
	$( ".buscador" ).focusin(function() {$('#resultado').css('display','block');});
	$( ".buscador" ).focusout(function() {$('#resultado').toggle('linear');});
	//var nombres = $('.app').text()+',';var total=''; totalCompleto=[];if(nombres!=''){for (var i = 0 ; i < nombres.length; i++) {if(nombres[i]!=','){total=total+nombres[i];}else{totalCompleto.push(total);total='';}}}


	
})

