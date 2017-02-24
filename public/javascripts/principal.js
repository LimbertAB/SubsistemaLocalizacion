var nombreAvatar;
var ciAvatar;
var tamanopaginacion;
var tampage,tampage1,tampage2,tampage3;
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
		socket.emit('listaUnUsuario',info.idusuario);
	});

//________________ADMINISTRACION DE USUARIOS___________________
	if(window.location.pathname=='/Usuarios'){
		$('body').css('background', 'transparent')
		var conting=(ci1.length/10).toString();
		var res = conting.split(".");
		tamanopaginacion=parseInt(res[0]);
		if((tamanopaginacion>0)&&(res.length>1)){
			tamanopaginacion++;
		}
		console.log(tamanopaginacion);
	}
	if(window.location.pathname=='/equipos'){
		var conting=(idequipos1.length/10).toString();
		var res = conting.split(".");
		tamanopaginacion=parseInt(res[0]);
		if((tamanopaginacion>0)&&(res.length>1)){
			tamanopaginacion++;
		}
		console.log(tamanopaginacion);
	}
	//LISTAR UN SOLO USUARIO
	$('.tablaV tr').click(function(){socket.emit('listaUnUsuario',$(this).closest('tr').attr('value'));});
	var controlador=0,idusuario;
	//respuesta de informacion de un solo usuario
	socket.on('RespuestaListaUnUsuario',function(valores){if(valores.estado!='fallido'){if(valores.estado=='actualizado'){swal("Satisfactorio!", "Informacion Actualizada correctamente", "success");}idusuario=valores.idusuario;$('.nomC').text(valores.nombres);$('.nicC').text(valores.nick);$('.ciC').text(valores.ci);$('.carC').text(valores.cargo);$('.domC').text(valores.domicilio);$('.telC').text(valores.telefono);$('.celC').text(valores.celular);	}else{sweetAlert("ERROR!", "Ocurrio un error de conexión intentelo nuevamente!", "error");}$(".User .form-group").css('display','none');$(".User p").show();$('.edit').val('Editar');$('.edit').text('Editar');$('.edit').removeClass('disabled');
    	//MODIFICAR INFORMACION DE USUARIO
		$(".edit").click(function(){var aux2=$('.edit').val();if(aux2=='Editar'){$('.form1').removeClass('has-error');$('.form1').addClass('has-success');$('.form1 span').removeClass('glyphicon-remove');$('.form1 span').addClass('glyphicon-ok');$('.form2').removeClass('has-error');$('.form2').addClass('has-success');$('.form2 span').removeClass('glyphicon-remove');$('.form2 span').addClass('glyphicon-ok');$('.form3').removeClass('has-error');$('.form3').addClass('has-success');$('.form3 span').removeClass('glyphicon-remove');$('.form3 span').addClass('glyphicon-ok');$('.form7').removeClass('has-error');$('.form7').addClass('has-success');$('.form7 span').removeClass('glyphicon-remove');$('.form7 span').addClass('glyphicon-ok');$('.n').val($('.nomC').text());$('.k').val($('.nicC').text());$('.i').val($('.ciC').text());$('.d').val($('.domC').text());$('.t').val($('.telC').text());$('.c').val($('.celC').text());$(".User .form-group").show();$(".titModalUser").css("display", "none");$('.edit').val('Guardar Cambios');$('.edit').text('Guardar Cambios');$('.edit').addClass('disabled');}else{if(aux2=='Guardar Cambios'){if($('.edit').hasClass('disabled')){}else{var valores={"idusuario":idusuario,"nombres":$('.n').val(),"nick":$('.k').val(),"ci":$('.i').val(),"domicilio":$('.d').val(),"telefono":$('.t').val(),'celular':$('.c').val()};socket.emit('ActualizarUsuarios',valores);}	}}});
		//controla que realice una modificacion para actualizar
		$(".User input").keyup(function(){if(($('.n').val()!=$('.nomC').text()) || ($('.k').val()!=$('.nicC').text()) || ($('.i').val()!=$('.ciC').text()) || ($('.d').val()!=$('.domC').text()) || ($('.t').val()!=$('.telC').text()) || ($('.c').val()!=$('.celC').text())){if(($('.form1').hasClass('has-success'))&&($('.form2').hasClass('has-success'))&&($('.form3').hasClass('has-success'))&&($('.form7').hasClass('has-success'))){$('.edit').removeClass('disabled');}else{$('.edit').addClass('disabled');}}else{$('.edit').addClass('disabled');}});
	});
	
	//___________________ REGISTRO NUEVO USUARIO_____________________ culminado
	if(window.location.pathname=='/RegistrarUsuario'){$('body').css('background', 'transparent')}
	//CONTROLAR EL INGRESO DEL NOMBRE COMPLETO
	$('.apellidoR').keyup(function(){if($(this).val().length>15){$('.form1').removeClass('has-error');$('.form1').addClass('has-success');$('.form1 span').removeClass('glyphicon-remove');$('.form1 span').addClass('glyphicon-ok');}else{$('.form1').removeClass('has-success');$('.form1').addClass('has-error');$('.form1 span').removeClass('glyphicon-ok');$('.form1 span').addClass('glyphicon-remove');}});
	//NO DEJAR INTRODUCIR ALGUNOS CARACTERES EN EL CAMBO NICK
	$(".nombreR").keydown(function (e) {if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,186]) !== -1 || (e.keyCode >= 35 && e.keyCode <= 39)) {return;}if ((e.keyCode < 48 || e.keyCode > 57)) {e.preventDefault();}});
	//CONTROLAR QUE NO EXISTRA NOMBRE DE USUARIO EN EL REGISTRO ENVIANDO AL SOCKET
	$('.nombreR').keyup(function(){if($(this).val().length>10)socket.emit('buscarnombreusuario',$(this).val());else{$('.form2').removeClass('has-success');$('.form2').addClass('has-error');$('.form2 span').removeClass('glyphicon-ok');$('.form2 span').addClass('glyphicon-remove');}});
	//RESPUESTA DEL SOCKET NOMBRE USUARIO
	socket.on('respuestanombreusuario',function(valor){if(valor==true){$('.form2').removeClass('has-error');$('.form2').addClass('has-success');$('.form2 span').removeClass('glyphicon-remove');$('.form2 span').addClass('glyphicon-ok');}else{$('.form2').removeClass('has-success');$('.form2').addClass('has-error');$('.form2 span').removeClass('glyphicon-ok');$('.form2 span').addClass('glyphicon-remove');}});	
	//CONTROLAR REGISTRO DE CI
	$('.ci').keyup(function(){if(parseInt($(this).val())>999999){$('.form3').removeClass('has-error');$('.form3').addClass('has-success');$('.form3 span').removeClass('glyphicon-remove');$('.form3 span').addClass('glyphicon-ok');}else{$('.form3').removeClass('has-success');$('.form3').addClass('has-error');$('.form3 span').removeClass('glyphicon-ok');$('.form3 span').addClass('glyphicon-remove');}});
	//CONTROLAR LA CONTRASEÑA EN REGISTRO
	$('.contrasR').keyup(function(){if($(this).val().length>9){if($(this).val()==$('.repcontrasR').val()){$('.form5').removeClass('has-error');$('.form5').addClass('has-success');$('.form5 span').removeClass('glyphicon-remove');$('.form5 span').addClass('glyphicon-ok');}else{$('.form5').removeClass('has-success');$('.form5').addClass('has-error');$('.form5 span').removeClass('glyphicon-ok');$('.form5 span').addClass('glyphicon-remove');}$('.form4').removeClass('has-error');$('.form4').addClass('has-success');$('.span4').removeClass('glyphicon-remove');$('.span4').addClass('glyphicon-ok');}else{$('.form4').removeClass('has-success');$('.form4').addClass('has-error');$('.span4').removeClass('glyphicon-ok');$('.span4').addClass('glyphicon-remove');$('.form5').removeClass('has-success');$('.form5').addClass('has-error');$('.span5').removeClass('glyphicon-ok');$('.span5').addClass('glyphicon-remove');}});
	//CONTROLAR REPETIR CONTRASEÑA
	$('.repcontrasR').keyup(function(){if($(this).val()==$('.contrasR').val()&&($('.contrasR').val().length>9)){$('.form5').removeClass('has-error');$('.form5').addClass('has-success');$('.form5 span').removeClass('glyphicon-remove');$('.form5 span').addClass('glyphicon-ok');}else{$('.form5').removeClass('has-success');$('.form5').addClass('has-error');$('.form5 span').removeClass('glyphicon-ok');$('.form5 span').addClass('glyphicon-remove');}});
	//SELECCIONAR CARGO EN EL SISTEMA (SI CARGO ES ENCARGADO DE RESIDENCIA MOSTRAR OTRO CAMPO IMPUT)
	$('.cargoSistemaR').change(function(){if($(this).val()!='Seleccione Cargo'){$('.form6').removeClass('has-error');$('.form6').addClass('has-success');$(this).removeClass('glyphicon-remove');$(this).addClass('glyphicon-ok');}else{$('.form6').removeClass('has-success');$('.form6').addClass('has-error');$(this).removeClass('glyphicon-ok');$(this).addClass('glyphicon-remove');}});
	//CONTROLAR IMPUT DE DOMICILIO
	$('.domicilioR').keyup(function(){if($(this).val().length>5){$('.form7').removeClass('has-error');$('.form7').addClass('has-success');$('.form7 span').removeClass('glyphicon-remove');$('.form7 span').addClass('glyphicon-ok');}else{$('.form7').removeClass('has-success');$('.form7').addClass('has-error');$('.form7 span').removeClass('glyphicon-ok');$('.form7 span').addClass('glyphicon-remove');}});
	//CONTROLA CAMPOS IMPUT PARA HABILITAR EL BOTON ENVIAR REGISTRO
	$('.formulariosRegistro').change(function(){var aux=0;for(var i=1;i<9;i++){if($(".form"+i+"").hasClass("has-success")){aux++;}}if(aux==7){$(".btnEnviarRegistro").removeClass('disabled');}else{$(".btnEnviarRegistro").addClass('disabled');}});
	//ENVIAR REGISTRO DE NUEVO USUARIO
	$(".btnEnviarRegistro").click(function(){if($(this).hasClass('disabled')){return false;}else{var $btn = $(this).button('loading');return true;}});
	//UNA VEZ REGISTRADO EL USUARIO LANZAMOS EL MODAL CON EL RESULTADO
	if($('.resultadoRegistro').text()!=''){if($('.resultadoRegistro').text()=='true'){swal("Satisfactorio!", "El registro del Usuario se completo!", "success")}else{sweetAlert("ERROR!", "Ocurrio un error de conexión intentelo nuevamente!", "error");}}

	//efecto enpequeñecer y engranceder el menu de arriba
	$('#mainNav').affix({offset: {top: 100}});
	//efecto de animacion hacia abajo
	$('a[href^="#Notificaciones"]').click(function() {$('html,body').animate({ scrollTop: $(this.hash).offset().top}, 800);return false;e.preventDefault();});

//___________________ ADMINISTRACION DE VEHICULOS_____________________
	//_________ REGISTRO NUEVO VEHICULO____________
	//CONTROLAR QUE NO EXISTRA EL MISMO CODIGO INTERNO EN EL REGISTRO ENVIANDO AL SOCKET
	$('.group1 input').keyup(function(){if($(this).val().length>4){socket.emit('buscarcodigointerno',{'valor':$(this).val()});}else{$('.group1').removeClass('has-success');$('.group1').addClass('has-error');$('.group1 span').removeClass('glyphicon-ok');$('.group1 span').addClass('glyphicon-remove');}});
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
	$('.tablabodyVehiculos tr').click(function(){fila=$(this).closest('tr').attr('id');socket.emit('listaUnVehiculo',fila);});
	var tipocod;
	socket.on("respuestalistaUnVehiculo",function(r){tipocod=r.codtipo;$(".textupdatecar").show();$('#btnupdatecar').text('EDITAR');$('#btnupdatecar').removeClass('disabled');$(".inputsupdatecar").css("display", "none");$('.text1').text(r.codinterno);$('.text2').text(r.placa);$('.text3').text(r.marca);$('.text4').text(r.modelo);$('.text5').text(r.color);$('.text6').text(r.tipo);$('.text7').text(r.combustible);$('.text8').text(r.estado);$("#btnupdatecar").click(function(){if($(this).text()=='EDITAR'){$('.groupo1').removeClass('has-error');$('.groupo1').addClass('has-success');$('.groupo1 span').removeClass('glyphicon-remove');$('.groupo1 span').addClass('glyphicon-ok');$('.groupo2').removeClass('has-error');$('.groupo2').addClass('has-success');$('.groupo2 span').removeClass('glyphicon-remove');$('.groupo2 span').addClass('glyphicon-ok');$('.groupo3').removeClass('has-error');$('.groupo3').addClass('has-success');$('.groupo3 span').removeClass('glyphicon-remove');$('.groupo3 span').addClass('glyphicon-ok');$('.groupo4').removeClass('has-error');$('.groupo4').addClass('has-success');$('.groupo4 span').removeClass('glyphicon-remove');$('.groupo4 span').addClass('glyphicon-ok');$('.groupo5').removeClass('has-error');$('.groupo5').addClass('has-success');$('.groupo5 span').removeClass('glyphicon-remove');$('.groupo5 span').addClass('glyphicon-ok');$('.groupo6').removeClass('has-error');$('.groupo6').addClass('has-success');$('.groupo7').removeClass('has-error');$('.groupo7').addClass('has-success');$('.groupo8').removeClass('has-error');$('.groupo8').addClass('has-success');$(this).addClass('disabled');$(".inputsupdatecar").show();$(this).text('Guardar Cambios');$(".textupdatecar").css("display", "none");$('#inputcarupdate1').val($('.text1').text());$('#inputcarupdate2').val($('.text2').text());$('#inputcarupdate3').val($('.text3').text());$('#inputcarupdate4').val($('.text4').text());$('#inputcarupdate5').val($('.text5').text());$("#inputcarupdate6").val();$('#inputcarupdate6').val(tipocod);$('#inputcarupdate7').val($('.text7').text());$('#inputcarupdate8').val($('.text8').text());	}else{if($(this).hasClass('disabled')){}else{var $btn = $(this).button('loading');var valores={"idequipos":fila,"codinterno":$('#inputcarupdate1').val(),"placa":$('#inputcarupdate2').val(),"modelo":$('#inputcarupdate4').val(),"marca":$('#inputcarupdate3').val(),"color":$('#inputcarupdate5').val(),'tipo':$('#inputcarupdate6').val(),'combustible':$('#inputcarupdate7').val(),'perfil':$('#inputcarupdate8').val()};socket.emit('ActualizarVehiculos',valores);}	}});});
	//MODIFICAR INFORMACION DE VEHICULO
	//Ver si existe codigo interno en el modal
	$('.groupo1 input').keyup(function(){if($(this).val().length>4){socket.emit('buscarcodigointerno',{'valor':$(this).val(),'estado':true});}else{$('.groupo1').removeClass('has-success');$('.groupo1').addClass('has-error');$('.groupo1 span').removeClass('glyphicon-ok');$('.groupo1 span').addClass('glyphicon-remove');}});
	//RESPUESTA DEL SOCKET CODIGOINTERNO Modal
	socket.on('respuestabuscarcodigointerno2',function(valor){if(valor==true){$('.groupo1').removeClass('has-error');$('.groupo1').addClass('has-success');$('.groupo1 span').removeClass('glyphicon-remove');$('.groupo1 span').addClass('glyphicon-ok');}else{$('.groupo1').removeClass('has-success');$('.groupo1').addClass('has-error');$('.groupo1 span').removeClass('glyphicon-ok');$('.groupo1 span').addClass('glyphicon-remove');}});
	//CONTROLAR EL INGRESO PLACA Modal
	$('.groupo2 input').keyup(function(){if($(this).val().length>6){$('.groupo2').removeClass('has-error');$('.groupo2').addClass('has-success');$('.groupo2 span').removeClass('glyphicon-remove');$('.groupo2 span').addClass('glyphicon-ok');}else{$('.groupo2').removeClass('has-success');$('.groupo2').addClass('has-error');$('.groupo2 span').removeClass('glyphicon-ok');$('.groupo2 span').addClass('glyphicon-remove');}});
	//CONTROLAR EL INGRESO MODELO Modal
	$('.groupo3 input').keyup(function(){if($(this).val().length>3){$('.groupo3').removeClass('has-error');$('.groupo3').addClass('has-success');$('.groupo3 span').removeClass('glyphicon-remove');$('.groupo3 span').addClass('glyphicon-ok');}else{$('.groupo3').removeClass('has-success');$('.groupo3').addClass('has-error');$('.groupo3 span').removeClass('glyphicon-ok');$('.groupo3 span').addClass('glyphicon-remove');}});
	//CONTROLAR EL INGRESO MARCA MOdal
	$('.groupo4 input').keyup(function(){if($(this).val().length>3){$('.groupo4').removeClass('has-error');$('.groupo4').addClass('has-success');$('.groupo4 span').removeClass('glyphicon-remove');$('.groupo4 span').addClass('glyphicon-ok');}else{$('.groupo4').removeClass('has-success');$('.groupo4').addClass('has-error');$('.groupo4 span').removeClass('glyphicon-ok');$('.groupo4 span').addClass('glyphicon-remove');}});
	//CONTROLAR EL INGRESO COLOR Modal
	$('.groupo5 input').keyup(function(){if($(this).val().length>3){$('.groupo5').removeClass('has-error');$('.groupo5').addClass('has-success');$('.groupo5 span').removeClass('glyphicon-remove');$('.groupo5 span').addClass('glyphicon-ok');}else{$('.groupo5').removeClass('has-success');$('.groupo5').addClass('has-error');$('.groupo5 span').removeClass('glyphicon-ok');$('.groupo5 span').addClass('glyphicon-remove');}});
	//controla que realice una modificacion en los inputs
	$("#infocar input").keyup(function(){var cont=0;for (var i=1;i<6;i++){if(($('#inputcarupdate'+i+'').val())!=($('.text'+i+'').text())){cont=cont+1;}}if(cont>0){$('#btnupdatecar').removeClass('disabled');}else{$('#btnupdatecar').addClass('disabled');}});
	//controla que realice una modificacion en los selects
	$("#infocar select").change(function(){var cont=0;for (var i=6;i<9;i++){if(($('#inputcarupdate'+i+' option:selected').text())!=($('.text'+i+'').text())){cont=cont+1;}}if(cont>0){$('#btnupdatecar').removeClass('disabled');}else{$('#btnupdatecar').addClass('disabled');}});
	//respuesta del socket actualizar vehiculo
	socket.on('respuestaActualizarVehiculos',function(valor){if(valor==true){swal({title: "Satisfactorio!",text: "La informacion del vehiculo se actualizo",type: "success",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){window.location.href = "equipos";});}else{swal({title: "ERROR!",text: "Ocurrio un error de conexión intentelo nuevamente!",type: "error",confirmButtonText: "Aceptar",closeOnConfirm: false},function(){window.location.href = "equipos";});}});
	
	//BUSCADOR DE VEHICULOS EN LA INTERFACE VEHICULOS
	$( "#buscarvehiculos" ).focusin(function() {$("#buscarvehiculos").popover({content: '<div class="list-group" id="listabusquedacar" style="margin:0;padding:0"></div>',html: true}).popover('show');});
	var myVar;
	$('#buscarvehiculos').keyup(function(){var valorTeclado=$(this).val();if(valorTeclado.length>0){clearInterval(myVar);myVar = setTimeout(function(){if(valorTeclado!=''){socket.emit('buscarvehiculos',valorTeclado);}}, 1000);}else{$("#buscarvehiculos").attr('data-content','');$('#listabusquedacar').empty();}});
	//respuesta buscar vehiculos
	socket.on("respuestabuscarvehiculos",function(r){$('#listabusquedacar').empty();if(r.estado==true){var cadena='';for(var i=0;i<r.codinterno.length; i++){cadena=cadena+'<a id="filabuscarcar" class="list-group-item" value="'+r.idvehiculo[i]+'" data-toggle="modal" data-target="#modalUnvehiculo"><h4 class="list-group-item-heading">'+r.codinterno[i]+'</h4><h5 class="list-group-item-text" style="margin:0;padding:0">Placa: '+r.placa[i]+'</h5></a>'}$("#listabusquedacar").append(cadena);$("#buscarvehiculos").attr('data-content',cadena);}else{$('#listabusquedacar').append('<h5>No se encontraron Coincidencias</h5>');}$( "#filabuscarcar" ).click(function(){socket.emit('listaUnVehiculo',$(this).attr('value'));});});
	//BUSCADOR DE USUARIOS EN LA INTERFACE USUARIOS
	$( "#buscarusuarios" ).focusin(function() {$(this).popover({content: '<div class="list-group" id="listabusquedauser" style="margin:0;padding:0"></div>',html: true}).popover('show');});
	var myVar;
	$('#buscarusuarios').keyup(function(){var valorTeclado=$(this).val();if(valorTeclado.length>0){clearInterval(myVar);myVar = setTimeout(function(){socket.emit('Buscaruseradm',valorTeclado);}, 1000);}else{$(this).attr('data-content','');$('#listabusquedauser').empty();}});
	//respuesta buscar usuarios
	socket.on("RespuestaBuscaruseradm",function(r){$('#listabusquedauser').empty();if(r.estado==true){var cadena='';for(var i=0;i<r.idusuario.length; i++){cadena=cadena+'<a id="filabuscarus" class="list-group-item" value="'+r.idusuario[i]+'" data-toggle="modal" data-target="#modalUser"><h4 class="list-group-item-heading">'+r.nombreCompleto[i]+'</h4><h5 class="list-group-item-text" style="margin:0;padding:0">CI: '+2343434+'</h5></a>'}$("#listabusquedauser").append(cadena);$("#buscarusuarios").attr('data-content',cadena);}else{$('#listabusquedauser').append('<h5>No se encontraron Coincidencias</h5>');}$( "#filabuscarus").click(function(){socket.emit('listaUnUsuario',$(this).attr('value'));});});

	$('#page-selection').bootpag({
            total: tamanopaginacion,
   			maxVisible: tamanopaginacion
        }).on("page", function(event, num){
        	console.log(ubicacion1);
        	if(window.location.pathname=='/Usuarios'){
        		$('#tablaU').empty();
        		for (var i = (num*10)-10; i < num*10; i++) {
        			if(ci1[i]!=null){
        				if(i%2==0){
        					$('#tablaU').append('<tr value='+idusuario1[i]+' data-toggle="modal" class="info" data-target="#modalUser"><td>'+(i+1)+'</td><td id="ciT">'+ci1[i]+'</td><td id="nomT">'+nombres1[i]+'</td><td id="cargT">'+cargo1[i]+'</td><td id="ubicT">'+ubicacion1[i]+'</td></tr>');
        				}else{
        					$('#tablaU').append('<tr value='+idusuario1[i]+' data-toggle="modal" data-target="#modalUser"><td>'+(i+1)+'</td><td id="ciT">'+ci1[i]+'</td><td id="nomT">'+nombres1[i]+'</td><td id="cargT">'+cargo1[i]+'</td><td id="ubicT">'+ubicacion1[i]+'</td></tr>');
        				}
  						
        			}
        		};
        	}
        	if(window.location.pathname=='/equipos'){
        		$('.tablabodyVehiculos').empty();
        		for (var i = (num*10)-10; i < num*10; i++) {
        			if(ci1[i]!=null){
        				if(i%2==0){
        					$('.tablabodyVehiculos').append('<tr value='+idequipos1[i]+' data-toggle="modal" class="info" data-target="#modalUnvehiculo"><td>'+(i+1)+'</td><td id="codv">'+codinterno1[i]+'</td><td id="ubiv">'+ubicacion1[i]+'</td><td id="tipv">'+tipo1[i]+'</td><td id="estv">'+perfil1[i]+'</td></tr>');
        				}else{
        					$('.tablabodyVehiculos').append('<tr value='+idequipos1[i]+' data-toggle="modal" data-target="#modalUnvehiculo"><td>'+(i+1)+'</td><td id="codv">'+codinterno1[i]+'</td><td id="ubiv">'+ubicacion1[i]+'</td><td id="tipv">'+tipo1[i]+'</td><td id="estv">'+perfil1[i]+'</td></tr>');
        				}
  						
        			}
        		};
        	}
        	$('#tablaU tr').click(function(){socket.emit('listaUnUsuario',$(this).closest('tr').attr('value'));});
        	$('.tablabodyVehiculos tr').click(function(){fila=$(this).closest('tr').attr('id');socket.emit('listaUnVehiculo',fila);});
        });
    	
    if(window.location.pathname=='/Codificacion_Sam'){
		var conting=(activida1.length/10).toString();
		var res = conting.split(".");
		tampage=parseInt(res[0]);
		if((tampage>0)&&(res.length>1)){
			tampage++;
		}
		var conting=(codifip1.length/10).toString();
		var res = conting.split(".");
		tampage1=parseInt(res[0]);
		if((tampage1>0)&&(res.length>1)){
			tampage1++;
		}
		var conting=(codifiv1.length/10).toString();
		var res = conting.split(".");
		tampage2=parseInt(res[0]);
		if((tampage2>0)&&(res.length>1)){
			tampage2++;
		}
		var conting=(materia1.length/10).toString();
		var res = conting.split(".");
		tampage3=parseInt(res[0]);
		if((tampage3>0)&&(res.length>1)){
			tampage3++;
		}
	}
	$('#page-codactividades').bootpag({
            total: tampage,
   			maxVisible: tampage
        }).on("page", function(event, num){
    		$('#tablacodactividades').empty();
    		for (var i = (num*10)-10; i < num*10; i++) {
    			if(activida1[i]!=null){
					if(i%2==0){
						$('#tablacodactividades').append('<tr class="info"><td>'+(i+1)+'</td><td>'+activida1[i]+'</td><td>'+activida2[i]+'</td><td>'+activida3[i]+'</td></tr>');
					}else{
						$('#tablacodactividades').append('<tr><td>'+(i+1)+'</td><td>'+activida1[i]+'</td><td>'+activida2[i]+'</td><td>'+activida3[i]+'</td></tr>');
					}
				}
    		};
        });
    $('#page-codpersonal').bootpag({
            total: tampage1,
   			maxVisible: tampage1
        }).on("page", function(event, num){
    		$('#tablacodpersonal').empty();
    		for (var i = (num*10)-10; i < num*10; i++) {
    			if(codifip1[i]!=null){
					if(i%2==0){
						$('#tablacodpersonal').append('<tr class="info"><td>'+(i+1)+'</td><td>'+codifip1[i]+'</td><td>'+codifip2[i]+'</td><td>'+codifip3[i]+'</td></tr>');
					}else{
						$('#tablacodpersonal').append('<tr><td>'+(i+1)+'</td><td>'+codifip1[i]+'</td><td>'+codifip2[i]+'</td><td>'+codifip3[i]+'</td></tr>');
					}
				}
    		};
        });
    $('#page-codvehiculo').bootpag({
            total: tampage2,
   			maxVisible: tampage2
        }).on("page", function(event, num){
    		$('#tablacodvehiculo').empty();
    		for (var i = (num*10)-10; i < num*10; i++) {
    			if(codifiv1[i]!=null){
					if(i%2==0){
						$('#tablacodvehiculo').append('<tr class="info"><td>'+(i+1)+'</td><td>'+codifiv1[i]+'</td><td>'+codifiv2[i]+'</td><td>Hora</td></tr>');
					}else{
						$('#tablacodvehiculo').append('<tr><td>'+(i+1)+'</td><td>'+codifiv1[i]+'</td><td>'+codifiv2[i]+'</td><td>Hora</td></tr>');
					}
				}
    		};
        });
    $('#page-codmaterial').bootpag({
            total: tampage3,
   			maxVisible: tampage3
        }).on("page", function(event, num){
    		$('#tablacodmaterial').empty();
    		for (var i = (num*10)-10; i < num*10; i++) {
    			if(materia1[i]!=null){
					if(i%2==0){
						$('#tablacodmaterial').append('<tr class="info"><td>'+(i+1)+'</td><td>'+materia1[i]+'</td><td>'+materia2[i]+'</td><td>'+materia3[i]+'</td></tr>');
					}else{
						$('#tablacodmaterial').append('<tr><td>'+(i+1)+'</td><td>'+materia1[i]+'</td><td>'+materia2[i]+'</td><td>'+materia3[i]+'</td></tr>');
					}
				}
    		};
        });

// REPORTES MENU PRINCIPAL ___________________
    //Cambios de año en reportes en menu principal
	$('#datetimepicker13').datetimepicker({viewMode: "years", minViewMode: "years",viewMode: 'years',dateFormat: 'yyyy'}).on('changeDate', function(ev){
		$(this).datetimepicker('hide');
	}).on('changeDate', function(ev){
		var i=$('#valorr').val();
		$('#btnfecha').text(i);
		$('#btnfecha').append('<span style="padding-left:5px;" aria-hidden="true" class="glyphicon glyphicon-calendar"></span>');
		$('#btnfecha').attr('disabled', true);
		socket.emit('verreportesporgestiones',i);
	});
	//respuesta cambio de años en salarios
	socket.on('respuestaverreportesporgestiones',function(valor){
		$('#btnfecha').attr('disabled', false);
		$('#filaerrorreporte').empty();
		if(valor.estado){
			for (var i = 0; i < valor.residencias.length; i++) {
				$('#filaerrorreporte').append('<div style="padding:10px;" class="col-lg-3 col-md-4 col-sm-6 col-xs-12"><div class="hovereffect" value='+valor.residencias[i].idresidencia+'><img src="/images/resid'+i+'.jpg" alt="" class="img-responsive"/><div class="overlay"><h2>'+valor.residencias[i].nombre+'</h2><p><a href="#">VER REPORTES</a></p></div></div></div>');	
			}	
		}else{
			$('#filaerrorreporte').append('<div id="alerterror" class="row"><div class="col-md-8 col-md-offset-2"><div role="alert" id="alertaSamError" style="margin:20px;" class="alert alert-danger alert-dismissible"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true">×</span></button><strong>NO SE ENCONTRARON RESULTADOS!</strong> Pruebe otra gestion</div></div></div>');
		}
		$('.hovereffect').click(function(){
			window.location.href = "Reportes_Residencia?residencia="+$(this).attr('value');
		});
	});
	$('.hovereffect').click(function(){
		window.open('Usuarios')
		//window.location.href = "Reportes_Residencia?residencia="+$(this).attr('value');
	});

})


//socket.emit('ConectarUsuario',miCi);
	//$(".avatarrr a").remove();var nombreAvaa=sessionStorage.getItem("Nombre")+'..';$('.avatarrr').append('<a class="dropdown-toggle avatarNombre" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" style="padding-left:0;padding-right:0;">'+nombreAvaa+'<span class="glyphicon glyphicon-user" aria-hidden="true"></span></a><ul class="dropdown-menu" aria-labelledby="dropdownMenu1"><li><a href="#">Salir</a></li><li><a href="#">Mi Perfil</a></li></ul>');var confirmacion=$('.h1Success').text();
	//if(confirmacion!=''){
		//$(".ventanaModal").slideDown('slow');
	//}

// var myVar;
// clearInterval(myVar);
// 			myVar = setTimeout(
// 			  	function(){
// 					socket.emit('Buscaruseradm',valorTeclado);
// 			  	}, 1000);