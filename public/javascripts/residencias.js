$(function(){ 
	var socket=io();
//_______________________ADMINISTRAR RESIDENCIAS______________
	// MAPA INTERFACE RESIDENCIAS CREAR NUEVA RESIDENCIAS
	var latResidencia=-20.550508894195627;var lonResidencia=-66.62109375;
	if(window.location.pathname=='/Residencias'){var marker;var map = L.map('mimapa').setView([-20.550508894195627, -66.62109375], 7);L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGltYmVydGFiIiwiYSI6ImNpcG9mMnV3ZDAxcHZmdG0zOWc1NjV2aGwifQ.89smGLtgJWmUKgd7B0cV1Q', {attribution: 'de: <a href="http://www.sedecapotosi.com">Servicio Departamental de caminos POTOSI</a>',maxZoom: 17}).addTo(map);var polyline = L.polyline(functionPuntos(), {color: 'red',border:50}).addTo(map);marker = L.marker([-20.550508894195627, -66.62109375]).addTo(map).bindPopup('<b>Residencia ubicación</b><br>marca la ubicacion exacta').openPopup();map.on('click', function (e) {map.removeLayer(marker);agregarotro(e);});function agregarotro(e){latResidencia=e.latlng.lat;lonResidencia=e.latlng.lng;marker = L.marker(e.latlng).addTo(map).bindPopup('<b>Residencia ubicación</b><br>marca la ubicacion exacta').openPopup();}}
	$('.tablaResidenciasbody tr').click(function(){var fila=$(this).closest('tr').attr('value');window.location.href = "/Menu_Residencias?id="+fila+"";});

// MENU RESIDENCIAS INDIVIDUAL
	if(window.location.pathname=='/Menu_Residencias'){
		var marker;
		var map = L.map('mimapa').setView([$('#latitud').text(), $('#longitud').text()], 17);
		L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGltYmVydGFiIiwiYSI6ImNpcG9mMnV3ZDAxcHZmdG0zOWc1NjV2aGwifQ.89smGLtgJWmUKgd7B0cV1Q', {
		    attribution: 'de: <a href="http://www.sedecapotosi.com">Servicio Departamental de caminos POTOSI</a>',
			maxZoom: 17
		}).addTo(map);
		marker = L.marker([$('#latitud').text(), $('#longitud').text()]).addTo(map)
			.bindPopup('<b>Ubicación exacta!</b><br>para cambiar la ubicación,<br> click en MODIFICAR')
    		.openPopup();
    }
//______________REGISTRAR NUEVA RESIDENCIA_____________

	// verificar q no exista mismo nombre en las residencias
	$('#formRegistroResidencia input').keyup(function(){if($(this).val().length>4){$('#nuevaResidenciaMapa button').attr('disabled', true);socket.emit('buscarquenoexistaresidencia',$(this).val());}else{$('#formRegistroResidencia').removeClass('has-success').addClass('has-error');$('#formRegistroResidencia span').removeClass('glyphicon-ok').addClass('glyphicon-remove');$('#nuevaResidenciaMapa button').attr('disabled', true);}});
	socket.on('respuestabuscarquenoexistaresidencia',function(valor){if(valor==true){$('#nuevaResidenciaMapa button').attr('disabled', false);$('#formRegistroResidencia').removeClass('has-error').addClass('has-success');$('#formRegistroResidencia span').removeClass('glyphicon-remove').addClass('glyphicon-ok');}else{$('#formRegistroResidencia').removeClass('has-success').addClass('has-error');$('#formRegistroResidencia span').removeClass('glyphicon-ok').addClass('glyphicon-remove');$('#nuevaResidenciaMapa button').attr('disabled', true);}});
	//click para registrar nueva residencia
	$('#nuevaResidenciaMapa button').click(function(){var $btn = $(this).button('loading');$.getJSON("http://nominatim.openstreetmap.org/reverse?format=json&addressdetails=0&zoom=18&lat=" + latResidencia + "&lon=" + lonResidencia + "&json_callback=?",function (response) {socket.emit('RegistrarResidencia',{nombre:$('#formRegistroResidencia input').val(),latitud:latResidencia,longitud:lonResidencia,ubicacion:response.display_name,estado:'desabilitado'});});});
	socket.on("RespuestaRegistrarResidencia",function(valor){$('#nuevaResidenciaMapa button').button('loading').button('reset');$('#formRegistroResidencia input').val('');$('#nuevaResidenciaMapa button').attr('disabled', true);if(valor==true){swal({title: "Satisfactorio!",text: "El registro de la Residencia se completo!",type: "success",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}else{swal({title: "ERROR!",text: "Ocurrio un error de conexión intentelo nuevamente!",type: "error",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}});
//___________ REGISTRO DE MATERIALES
    //Control de ingreso de materiales y suministros
    $('.material1 input').keyup(function(){
		if($(this).val().length>7){$('.material1').removeClass('has-error');$('.material1').addClass('has-success');$('.material1 span').removeClass('glyphicon-remove');$('.material1 span').addClass('glyphicon-ok');}else{$('.material1').removeClass('has-success');$('.material1').addClass('has-error');$('.material1 span').removeClass('glyphicon-ok');$('.material1 span').addClass('glyphicon-remove');}});
    //control de unidad
    $('.material2 select').change(function(){if($(this).val()!='Seleccione Unidad'){$('.material2').removeClass('has-error');$('.material2').addClass('has-success');}else{$('.material2').removeClass('has-success');$('.material2').addClass('has-error');}});
    //control de cantidad
    $('.material3 input').change(function(){if(parseInt($(this).val())>0){$('.material3').removeClass('has-error');$('.material3').addClass('has-success');$('.material3 span').removeClass('glyphicon-remove');$('.material3 span').addClass('glyphicon-ok');}else{$('.material3').removeClass('has-success');$('.material3').addClass('has-error');$('.material3 span').removeClass('glyphicon-ok');$('.material3 span').addClass('glyphicon-remove');}});
    //control de ingreso de precio unitario
    $('.material4 input').change(function(){if(parseInt($(this).val())>0){$('.material4').removeClass('has-error');$('.material4').addClass('has-success');$('.material4 span').removeClass('glyphicon-remove');$('.material4 span').addClass('glyphicon-ok');}else{$('.material4').removeClass('has-success');$('.material4').addClass('has-error');$('.material4 span').removeClass('glyphicon-ok');$('.material4 span').addClass('glyphicon-remove');}});
    //control de campos inputs y habilitar el boton de envio
	$('.formulariomateriales').change(function(){var aux=1;for(var i=1;i<5;i++){if($(".material"+i+"").hasClass("has-success")){aux++;}}if(aux>4){$("#btnRegistromaterial").removeClass('disabled');}else{$("#btnRegistromaterial").addClass('disabled');}});
	//Enviar registro de material a residencia
	$("#btnRegistromaterial").click(function(){if($(this).hasClass('disabled')){return false;}else{socket.emit('asignamaterialresidencia',{material:$('.material1 input').val(),unidad:$('.material2 select').val(),cantidad:$('.material3 input').val(),preciounitario:$('.material4 input').val(),idresidencia:$.urlParam('id')});var $btn = $(this).button('loading');}});
	//lanzar el alerta de respuesta de asignar material
	 socket.on('respuestaasignamaterialresidencia',function(datos){if(datos==true){swal({title: "Satisfactorio!",text: "La asignacion del material se completo!",type: "success",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}else{swal({title: "ERROR!",text: "Ocurrio un error de conexión intentelo nuevamente!",type: "error",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}});

//___________ REGISTRO DE SERVICIOS
    //control de ingreso servicios no materiales
    $('.servicio1 input').keyup(function(){if($(this).val().length>3){$('.servicio1').removeClass('has-error');$('.servicio1').addClass('has-success');$('.servicio1 span').removeClass('glyphicon-remove');$('.servicio1 span').addClass('glyphicon-ok');}else{$('.servicio1').removeClass('has-success');$('.servicio1').addClass('has-error');$('.servicio1 span').removeClass('glyphicon-ok');$('.servicio1 span').addClass('glyphicon-remove');}});
    //control de ingreso precio unitario
    $('.servicio2 input').change(function(){if(parseInt($(this).val())>0){$('.servicio2').removeClass('has-error');$('.servicio2').addClass('has-success');$('.servicio2 span').removeClass('glyphicon-remove');$('.servicio2 span').addClass('glyphicon-ok');}else{$('.servicio2').removeClass('has-success');$('.servicio2').addClass('has-error');$('.servicio2 span').removeClass('glyphicon-ok');$('.servicio2 span').addClass('glyphicon-remove');}});
    //control de campos inputs y habilitar el boton de envio
    $('.formularioservicios').change(function(){var aux=1;for(var i=1;i<3;i++){if($(".servicio"+i+"").hasClass("has-success")){aux++;}}if(aux>2){$("#btnRegistroservicio").removeClass('disabled');}else{$("#btnRegistroservicio").addClass('disabled');}});
    //Enviar registro del servicio a residencia
	$("#btnRegistroservicio").click(function(){if($(this).hasClass('disabled')){return false;}else{socket.emit('asignaservicioresidencia',{servicio:$('.servicio1 input').val(),preciounitario:$('.servicio2 input').val(),idresidencia:$.urlParam('id')});var $btn = $(this).button('loading');}});
	//lanzar el alerta de respuesta de asignar servicios
	 socket.on('respuestaasignaservicioresidencia',function(datos){if(datos==true){swal({title: "Satisfactorio!",text: "La asignacion del servicio se completo!",type: "success",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}else{swal({title: "ERROR!",text: "Ocurrio un error de conexión intentelo nuevamente!",type: "error",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}});


//________ASIGNAR PERSONAL A UNA RESIDENCIA______________
	var nombreAsignar;
	$('#asignar .grupo2').click(function(){nombreAsignar=$(this).attr('id');});
	$('#ModalAsignarUser .list-group a').click(function(){$('#'+nombreAsignar+'').val($(this).text());$('#'+nombreAsignar+'').attr("value", $(this).attr('value'));});
	//Control del perfil
	$('#asignar select').change(function(){var aux=$(this).attr('value');if($(this).val()!='Seleccione Perfil'){$('#columna'+aux+'').removeClass('has-error');$('#columna'+aux+'').addClass('has-success');}else{$('#columna'+aux+'').removeClass('has-success');$('#columna'+aux+'').addClass('has-error');}});
	// Controlar el nombre
	$('#asignar .grupo2').blur(function(){var aux=$(this).attr('id');if($(this).val().length>0){$('#columna'+aux+'').removeClass('has-error');$('#columna'+aux+'').addClass('has-success');$('#columna'+aux+' span').removeClass('glyphicon-remove');$('#columna'+aux+' span').addClass('glyphicon-ok');}else{$('#columna'+aux+'').removeClass('has-success');$('#columna'+aux+'').addClass('has-error');$('#columna'+aux+' span').removeClass('glyphicon-ok');$('#columna'+aux+' span').addClass('glyphicon-remove');}var aux=0;for(var i=0;i<13;i++){if($("#columna"+i+"").hasClass("has-success")){if($("#columnanombre"+i+"").hasClass("has-success")){$(".tabla"+(i+1)+"").show();aux++;}	}}if(aux>0){$("#btnAsignarUser").removeClass('disabled');}else{$("#btnAsignarUser").addClass('disabled');}});
	//CONTROLA CAMPOS IMPUT PARA HABILITAR EL BOTON ENVIAR REGISTRO
	$('#formAsignarUser').change(function(){var aux=0;for(var i=0;i<13;i++){if($("#columna"+i+"").hasClass("has-success")){if($("#columnanombre"+i+"").hasClass("has-success")){$(".tabla"+(i+1)+"").show();aux++;}	}}if(aux>0){$("#btnAsignarUser").removeClass('disabled');}else{$("#btnAsignarUser").addClass('disabled');}});
	$.urlParam = function(name){var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);return results[1] || 0;}
	//ENVIAR REGISTRO DE NUEVO USUARIO
	$("#btnAsignarUser").click(function(){var perfil=[],idusuarios=[];if($(this).hasClass('disabled')){return false;}else{for(var i=0;i<13;i++){if($("#columna"+i+"").hasClass("has-success")){if($("#columnanombre"+i+"").hasClass("has-success")){perfil.push($("#columna"+i+" select").val());idusuarios.push($("#columnanombre"+i+" input").attr('value'));}}}socket.emit('asignarusuariosaresidencia',{perfil:perfil,idusuarios:idusuarios,idresidencia:$.urlParam('id')});var $btn = $(this).button('loading');}});
	//UNA VEZ REGISTRADO EL VEHICULO LANZAMOS EL ALERTA CON EL ESTADO
	 socket.on('Respuestaasignarusuariosresidencia',function(datos){if(datos.estado==true){swal({title: "Satisfactorio!",text: "La asignacion del personal se completo!",type: "success",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}else{if(datos.estado=='regular'){swal({title: "ERROR!",text: "Algunos Usuarios no fueron asignados Correctamente!",type: "error",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}else{swal({title: "ERROR!",text: "Ocurrio un error de conexión intentelo nuevamente!",type: "error",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}}});
//_______________ASIGNAR TRAMOS A RESIDENCIA___________________	
	//controla el ingreso del nombre
	$('#formTramo input').keyup(function(){var aux=$(this).attr('id');if($(this).val().length>10){$('#tramoinpu'+aux+'').removeClass('has-error');$('#tramoinpu'+aux+'').addClass('has-success');$('#tramoinpu'+aux+' span').removeClass('glyphicon-remove');$('#tramoinpu'+aux+' span').addClass('glyphicon-ok');}else{$('#tramoinpu'+aux+'').removeClass('has-success');$('#tramoinpu'+aux+'').addClass('has-error');$('#tramoinpu'+aux+' span').removeClass('glyphicon-ok');$('#tramoinpu'+aux+' span').addClass('glyphicon-remove');}});
	//CONTROLA CAMPOS IMPUT PARA HABILITAR EL BOTON ENVIAR REGISTRO
	$('#formTramo').change(function(){var aux=0;for(var i=0;i<13;i++){if($("#tramoinput"+i+"").hasClass("has-success")){$("#tramoinput"+(i+1)+"").css('display','block');aux++;	}}if(aux>0){$("#btnRegistroTramo").removeClass('disabled');}else{$("#btnRegistroTramo").addClass('disabled');}});
	
	//ENVIAR REGISTRO DE TRAMO A RESIDENCIA
	$("#btnRegistroTramo").click(function(){var tramos=[];if($(this).hasClass('disabled')){return false;}else{for(var i=0;i<20;i++){if($("#tramoinput"+i+"").hasClass("has-success")){tramos.push($("#tramoinput"+i+" input").val());}}socket.emit('asignartramosaresidencia',{tramos:tramos,idresidencia:$.urlParam('id')});var $btn = $(this).button('loading');}});
	//UNA VEZ REGISTRADO EL TRAMO LANZAMOS EL ALERTA CON EL ESTADO
	socket.on('Respuestaasignartramosaresidencia',function(datos){if(datos==true){swal({title: "Satisfactorio!",text: "La asignacion del tramo se completo!",type: "success",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}else{swal({title: "ERROR!",text: "Ocurrio un error de conexión intentelo nuevamente!",type: "error",confirmButtonText: "Aceptar",closeOnConfirm: false },function(){location.reload();});}});
//________ASIGNAR VEHICULOS
	$('#asignarcar input').click(function(){nombreAsignar=$(this).attr('id');});
	$('#myModalcar .list-group a').click(function(){$('#'+nombreAsignar+'').val($(this).text());$('#'+nombreAsignar+'').attr("value", $(this).attr('value'));});
	// Controlar el nombre
	$('#asignarcar input').blur(function(){var aux=$(this).attr('id');if($(this).val().length>0){$('#columna'+aux+'').removeClass('has-error');$('#columna'+aux+'').addClass('has-success');$('#columna'+aux+' span').removeClass('glyphicon-remove');$('#columna'+aux+' span').addClass('glyphicon-ok');}else{$('#columna'+aux+'').removeClass('has-success');$('#columna'+aux+'').addClass('has-error');$('#columna'+aux+' span').removeClass('glyphicon-ok');$('#columna'+aux+' span').addClass('glyphicon-remove');}var aux2=0;for(var i=0;i<10;i++){if($("#columnacar"+i+"").hasClass("has-success")){$(".tablacar"+(i+1)+"").show();aux2++;}}if(aux2>0){$("#btnAsignarVehiculos").removeClass('disabled');}else{$("#btnAsignarVehiculos").addClass('disabled');}});
	//enviar asignacion de vehiculos
	$("#btnAsignarVehiculos").click(function(){idvehiculo=[];if($(this).hasClass('disabled')){return false;}else{for(var i=0;i<13;i++){if($("#columnacar"+i+"").hasClass("has-success")){idvehiculo.push($("#columnacar"+i+" input").attr('value'));}}socket.emit('asignarvehiculosaresidencia',{idvehiculo:idvehiculo,idresidencia:$.urlParam('id')});var $btn = $(this).button('loading');}});
	//respuesta de asignacion de vehiculos
	socket.on('Respuestaasignarvehiculosaresidencia',function(datos){if(datos==true){swal({title: "Satisfactorio!",text: "La asignacion del vehiculos se completo!",type: "success",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}else{swal({title: "ERROR!",text: "Ocurrio un error de conexión intentelo nuevamente!",type: "error",confirmButtonText: "Aceptar",closeOnConfirm: false},function(){location.reload();});}});
	//REASIGNAR PERSONAL
	$('[data-toggle="tooltip"]').tooltip();

	$('.btnHabilitarResidencia').click(function(){
		if($(this).hasClass('disabled')){
			console.log('no puedes hacer nada');
		}
		else{
			if($(this).text()=='DESABILITADO'){
				swal({   
					title: "¿Estás seguro?",   
					text: "se habilitara la residencia para el funcionamiento del los demas sistemas",   
					type: "warning",   
					showCancelButton: true,   
					confirmButtonColor: "#16AB72",   
					confirmButtonText: "Habilitar Residencia!",   
					closeOnConfirm: false 
				}, 
				function(){
					setTimeout(function(){
						socket.emit('cambiarEstadoResidencia',{estado:'habilitado',idresidencia:$.urlParam('id')}); 
					});
				});
			}else{
				swal({   
					title: "¿Estás seguro?",   
					text: "se desabilitara la residencia, el cual ocasionaria FALLOS en los demas sistemas",   
					type: "warning",   
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",   
					confirmButtonText: "Desabilitar Residencia!",   
					closeOnConfirm: false 
				}, 
				function(){
					setTimeout(function(){     
						socket.emit('cambiarEstadoResidencia',{estado:'desabilitado',idresidencia:$.urlParam('id')}); 
					});
				});
			}
		}
	});
	socket.on('respuestacambiarEstadoResidencia',function(valor){
		if(valor==true){
			swal({
				title: "Satisfactorio!",
				text: "Los cambios se guardaron correctamente!",
				type: "success",
				confirmButtonText: "Aceptar",
				closeOnConfirm: false 
			}, 
			function(){
				location.reload();
			});
		}else{
			swal({
				title: "ERROR!",
				text: "Ocurrio un error de conexión intentelo nuevamente!",
				type: "error",
				confirmButtonText: "Aceptar",
				closeOnConfirm: false
			},
			function(){
				location.reload();
			});
		}
	});
})


