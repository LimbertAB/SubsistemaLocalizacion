$(function(){ 
	var socket=io();
//_______________________ADMINISTRAR RESIDENCIAS______________
	// MAPA INTERFACE RESIDENCIAS CREAR NUEVA RESIDENCIAS
	var latResidencia=-20.550508894195627;var lonResidencia=-66.62109375;
	if(window.location.pathname=='/Residencias'){
		var marker;
		var map = L.map('mimapa').setView([-20.550508894195627, -66.62109375], 7);
		L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGltYmVydGFiIiwiYSI6ImNpcG9mMnV3ZDAxcHZmdG0zOWc1NjV2aGwifQ.89smGLtgJWmUKgd7B0cV1Q', {attribution: 'de: <a href="http://www.sedecapotosi.com">Servicio Departamental de caminos POTOSI</a>',maxZoom: 17}).addTo(map);
		var polyline = L.polyline(functionPuntos(), {color: 'red',border:50}).addTo(map);
		marker = L.marker([-20.550508894195627, -66.62109375]).addTo(map).bindPopup('<b>Residencia ubicación</b><br>marca la ubicacion exacta').openPopup();
		map.on('click', function (e) {
			agregarotro(e);});
		function agregarotro(e){
			map.removeLayer(marker);
			latResidencia=e.latlng.lat;
			lonResidencia=e.latlng.lng;
			marker = L.marker(e.latlng).addTo(map).bindPopup('<b>Residencia ubicación</b><br>Esta es la Ubicacion exacta!').openPopup();}}
	$('.tablaResidenciasbody tr').click(function(){var fila=$(this).closest('tr').attr('value');window.location.href = "/Menu_Residencias?id="+fila+"";});
	var latitudactual;
	var longitudactual;
// MENU RESIDENCIAS INDIVIDUAL
	if(window.location.pathname=='/Menu_Residencias'){
		var marker;
		latitudactual=$('#latitud').text();
		longitudactual=$('#longitud').text();
		var map = L.map('mimapa').setView([$('#latitud').text(), $('#longitud').text()], 17);
		L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGltYmVydGFiIiwiYSI6ImNpcG9mMnV3ZDAxcHZmdG0zOWc1NjV2aGwifQ.89smGLtgJWmUKgd7B0cV1Q', {
		    attribution: 'de: <a href="http://www.sedecapotosi.com">Servicio Departamental de caminos POTOSI</a>',
			maxZoom: 17
		}).addTo(map);
		marker = L.marker([latitudactual,longitudactual]).addTo(map)
			.bindPopup('<b>Ubicación exacta!</b><br>para cambiar la ubicación,<br> click en MODIFICAR')
    		.openPopup();

    	map.on('click', function (e) {
    		if($('.btnmodificarresidencia').text()=='GUARDAR'){
    			agregarotro2(e);
    		}
		});
		function agregarotro2(e){
			if((e.latlng.lat!=latitudactual)||(e.latlng.lng!=longitudactual)){
				$('.btnmodificarresidencia').attr('disabled', false);
			}else{
				$('.btnmodificarresidencia').attr('disabled', true);
			}
			map.removeLayer(marker);
			latResidencia=e.latlng.lat;
			lonResidencia=e.latlng.lng;
			marker = L.marker(e.latlng).addTo(map).bindPopup('<b>Residencia ubicación</b><br>Esta es la Ubicacion exacta!').openPopup();
		}
    }
//______________REGISTRAR NUEVA RESIDENCIA_____________
	// verificar q no exista mismo nombre en las residencias
	$('#formRegistroResidencia input').keyup(function(){
		if($(this).val().length>4){
			if(window.location.pathname=='/Menu_Residencias'){
				if($('.nombreresidencia').text()!=$(this).val()){
					$('.btnmodificarresidencia').attr('disabled', true);
					socket.emit('buscarquenoexistaresidencia',{valor:$(this).val(),idresidencia:$.urlParam('id')});
				}
			}else{
				$('#nuevaResidenciaMapa button').attr('disabled', true);
				socket.emit('buscarquenoexistaresidencia',{valor:$(this).val(),gestion:$('#btnfecha').text()});
			}
		}else{
			$('#formRegistroResidencia').removeClass('has-success').addClass('has-error');
			$('#formRegistroResidencia span').removeClass('glyphicon-ok').addClass('glyphicon-remove');
			$('#nuevaResidenciaMapa button').attr('disabled', true);
			$('.btnmodificarresidencia').attr('disabled', true);
		}
	});
	socket.on('respuestabuscarquenoexistaresidencia',function(valor){
		$('#listaresidencianuevo').empty();
		if(valor.estado){
			$('.btnmodificarresidencia').attr('disabled', false);
			$('#nuevaResidenciaMapa button').attr('disabled', false);
			$('#formRegistroResidencia').removeClass('has-error').addClass('has-success');
			$('#formRegistroResidencia span').removeClass('glyphicon-remove').addClass('glyphicon-ok');
		}else{
			if(valor.nombre){
				$('.btnmodificarresidencia').attr('disabled', false);
				$('#nuevaResidenciaMapa button').attr('disabled', false);
				$('#formRegistroResidencia').removeClass('has-error').addClass('has-success');
				$('#formRegistroResidencia span').removeClass('glyphicon-remove').addClass('glyphicon-ok');
				for (var i = 0; i < valor.nombre.length; i++) {
					$('#listaresidencianuevo').append('<a class="list-group-item" value="'+i+'"><h4 class="list-group-item-heading">'+valor.nombre[i]+'</h4><p class="list-group-item-text">'+valor.ubicacion[i]+'</p></a>');
				}
			}else{
				$('#formRegistroResidencia').removeClass('has-success').addClass('has-error');
				$('#formRegistroResidencia span').removeClass('glyphicon-ok').addClass('glyphicon-remove');
				$('#nuevaResidenciaMapa button').attr('disabled', true);
				$('.btnmodificarresidencia').attr('disabled', true);
			}
		}
		$('#formRegistroResidencia .list-group a').hover(function(){
			$(this).toggleClass('active');
		});
		$('#formRegistroResidencia .list-group a').click(function(){
			var latlng={lat:valor.lat[$(this).attr('value')],lng:valor.lng[$(this).attr('value')]};
			var auxu={latlng:latlng};
			$('#formRegistroResidencia input').val(valor.nombre[$(this).attr('value')]);
			$('#nuevaResidenciaMapa button').attr('disabled', false);
			$('#formRegistroResidencia').removeClass('has-error').addClass('has-success');
			$('#formRegistroResidencia span').removeClass('glyphicon-remove').addClass('glyphicon-ok');
			if(window.location.pathname=='/Menu_Residencias'){
				agregarotro2(auxu);
			}else{
				agregarotro(auxu);
			}
		});
	});
	//click para registrar nueva residencia
	$('#nuevaResidenciaMapa button').click(function(){
		var $btn = $(this).button('loading');
		$.getJSON("http://nominatim.openstreetmap.org/reverse?format=json&addressdetails=0&zoom=18&lat=" + latResidencia + "&lon=" + lonResidencia + "&json_callback=?",function (response) {
			socket.emit('RegistrarResidencia',{nombre:$('#formRegistroResidencia input').val(),latitud:latResidencia,longitud:lonResidencia,ubicacion:response.display_name,estado:'desabilitado',gestion:$('#btnfecha').text()});
		});});
	socket.on("RespuestaRegistrarResidencia",function(valor){
		if(valor){swal({title: "Satisfactorio!",text: "El registro de la Residencia se completo!",type: "success",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}else{swal({title: "ERROR!",text: "Ocurrio un error de conexión intentelo nuevamente!",type: "error",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}});
	//modificar informacion de una residencia
	$('.btnmodificarresidencia').click(function(){
		if($('.btnmodificarresidencia').text()=='MODIFICAR'){
			$('#btngrupomodificar').append('<button type="button" class="btn btn-warning btn-lg dropdown-toggle btnocultar" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="caret"></span></button><ul class="dropdown-menu btnocultar"><li><a id="optioncancelar">Cancelar</a></li></ul>');
			$('#formRegistroResidencia').show();
			$('.nombreresidencia').css('display','none');
			$(this).text('GUARDAR');
			$(this).attr('disabled', true);
			$('#optioncancelar').click(function(){
				$('.btnocultar').remove();
				$('.btnmodificarresidencia').text('MODIFICAR');
				$('#formRegistroResidencia').css('display','none');
				$('.nombreresidencia').show();
				$('.btnmodificarresidencia').attr('disabled', false);
				map.removeLayer(marker);
				marker = L.marker([latitudactual,longitudactual]).addTo(map)
				.bindPopup('<b>Ubicación exacta!</b><br>para cambiar la ubicación,<br> click en MODIFICAR')
	    		.openPopup();
			});
		}else{
			$('.btnmodificarresidencia').attr('disabled', true);
			$.getJSON("http://nominatim.openstreetmap.org/reverse?format=json&addressdetails=0&zoom=18&lat=" + latResidencia + "&lon=" + lonResidencia + "&json_callback=?",function (response) {
				var datas={nombre:$('#formRegistroResidencia input').val(),latitud:latResidencia,longitud:lonResidencia,ubicacion:response.display_name,idresidencia:$.urlParam('id')};
				console.log(datas);
				socket.emit('ActualizarResidencia',datas);
			});
		}
	});
	socket.on("RespuestaActualizarResidencia",function(valor){
		if(valor){swal({title: "Satisfactorio!",text: "Las modificaciones en la residencia se guardaron!",type: "success",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}else{swal({title: "ERROR!",text: "Ocurrio un error de conexión intentelo nuevamente!",type: "error",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}});
		
//___________ REGISTRO DE MATERIALES
    //Control de ingreso de materiales y suministros
    $('.material1 select').change(function(){if($(this).val()!='Seleccione Material'){$('.material1').removeClass('has-error');$('.material1').addClass('has-success');}else{$('.material1').removeClass('has-success');$('.material1').addClass('has-error');}});
    //control de unidad
    $('.material2 select').change(function(){if($(this).val()!='Seleccione Unidad'){$('.material2').removeClass('has-error');$('.material2').addClass('has-success');}else{$('.material2').removeClass('has-success');$('.material2').addClass('has-error');}});
    //control de cantidad
    $('.material3 input').change(function(){if(parseInt($(this).val())>0){$('.material3').removeClass('has-error');$('.material3').addClass('has-success');$('.material3 span').removeClass('glyphicon-remove');$('.material3 span').addClass('glyphicon-ok');}else{$('.material3').removeClass('has-success');$('.material3').addClass('has-error');$('.material3 span').removeClass('glyphicon-ok');$('.material3 span').addClass('glyphicon-remove');}});
    //control de ingreso de precio unitario
    $('.material4 input').change(function(){if(parseInt($(this).val())>0){$('.material4').removeClass('has-error');$('.material4').addClass('has-success');$('.material4 span').removeClass('glyphicon-remove');$('.material4 span').addClass('glyphicon-ok');}else{$('.material4').removeClass('has-success');$('.material4').addClass('has-error');$('.material4 span').removeClass('glyphicon-ok');$('.material4 span').addClass('glyphicon-remove');}});
    //control de campos inputs y habilitar el boton de envio
	$('.formulariomateriales').change(function(){var aux=1;for(var i=1;i<5;i++){if($(".material"+i+"").hasClass("has-success")){aux++;}}if(aux>4){$("#btnRegistromaterial").removeClass('disabled');}else{$("#btnRegistromaterial").addClass('disabled');}});
	//Enviar registro de material a residencia
	$("#btnRegistromaterial").click(function(){if($(this).hasClass('disabled')){return false;}else{socket.emit('asignamaterialresidencia',{material:$('.material1 select').val(),unidad:$('.material2 select').val(),cantidad:$('.material3 input').val(),preciounitario:$('.material4 input').val(),idresidencia:$.urlParam('id')});var $btn = $(this).button('loading');}});
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


//________ASIGNAR PERSONAL A UNA RESIDENCIA______________  tabla
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
	//_________enviar cambio de estado de residencia
	$('.btnHabilitarResidencia').click(function(){if($(this).text()=='DESABILITADO'){swal({   title: "¿Estás seguro?",   text: "se habilitara la residencia para el funcionamiento del los demas sistemas",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#16AB72",   confirmButtonText: "Habilitar Residencia!",   closeOnConfirm: false }, function(){setTimeout(function(){socket.emit('cambiarEstadoResidencia',{estado:'habilitado',idresidencia:$.urlParam('id')}); });});}else{swal({   title: "¿Estás seguro?",   text: "se desabilitara la residencia, el cual ocasionaria FALLOS en los demas sistemas",   type: "warning",   showCancelButton: true,confirmButtonColor: "#DD6B55",   confirmButtonText: "Desabilitar Residencia!",   closeOnConfirm: false }, function(){setTimeout(function(){     socket.emit('cambiarEstadoResidencia',{estado:'desabilitado',idresidencia:$.urlParam('id')}); });});}});
	//respuesta cambio de estado de residencia
	socket.on('respuestacambiarEstadoResidencia',function(valor){if(valor==true){swal({title: "Satisfactorio!",text: "Los cambios se guardaron correctamente!",type: "success",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}else{swal({title: "ERROR!",text: "Ocurrio un error de conexión intentelo nuevamente!",type: "error",confirmButtonText: "Aceptar",closeOnConfirm: false},function(){location.reload();});}});

//________________________C O D I F I  C A C I O N    S A M ______________________
	//________REGISTRO DE ACTIVIDADES SAM__________
	$('#asignaractividades .grupo1').bind('keyup input', function(){var aux=$(this).attr('id');var aux1=parseInt($(this).val());if(aux1>0){$('#columnaactivida'+aux+'').removeClass('has-error');$('#columnaactivida'+aux+'').addClass('has-success');$('#columnaactivida'+aux+' span').removeClass('glyphicon-remove');$('#columnaactivida'+aux+' span').addClass('glyphicon-ok');}else{$('#columnaactivida'+aux+'').removeClass('has-success');$('#columnaactivida'+aux+'').addClass('has-error');$('#columnaactivida'+aux+' span').removeClass('glyphicon-ok');$('#columnaactivida'+aux+' span').addClass('glyphicon-remove');}mostrarfila();});
	function mostrarfila(){var uuu=0;for(var i=0;i<13;i++){if($("#columnaactividad"+i+"").hasClass("has-success")){if($("#columnaunidad"+i+"").hasClass("has-success")){if($("#columnadescripciond"+i+"").hasClass("has-success")){$(".tabla"+(i+1)+"").show();uuu++;}	}	}}if(uuu>0){$("#btnAsignarActividad").removeClass('disabled');}else{$("#btnAsignarActividad").addClass('disabled');}}
	$('#asignaractividades .grupo2').keyup(function(){var aux=$(this).attr('id');var aux1=$(this).val().length;if(aux1>1){$('#columnaunida'+aux+'').removeClass('has-error');$('#columnaunida'+aux+'').addClass('has-success');$('#columnaunida'+aux+' span').removeClass('glyphicon-remove');$('#columnaunida'+aux+' span').addClass('glyphicon-ok');}else{$('#columnaunida'+aux+'').removeClass('has-success');$('#columnaunida'+aux+'').addClass('has-error');$('#columnaunida'+aux+' span').removeClass('glyphicon-ok');$('#columnaunida'+aux+' span').addClass('glyphicon-remove');}mostrarfila();});
	$('#asignaractividades .grupo3').keyup(function(){var aux=$(this).attr('id');var aux1=$(this).val().length;if(aux1>5){$('#columnadescripcion'+aux+'').removeClass('has-error');$('#columnadescripcion'+aux+'').addClass('has-success');$('#columnadescripcion'+aux+' span').removeClass('glyphicon-remove');$('#columnadescripcion'+aux+' span').addClass('glyphicon-ok');}else{$('#columnadescripcion'+aux+'').removeClass('has-success');$('#columnadescripcion'+aux+'').addClass('has-error');$('#columnadescripcion'+aux+' span').removeClass('glyphicon-ok');$('#columnadescripcion'+aux+' span').addClass('glyphicon-remove');}mostrarfila();});
	//enviar registro de nuevas actividades sam
	$("#btnAsignarActividad").click(function(){
		var actividad=[],unidad=[],descripcion=[];
		if($(this).hasClass('disabled')){
			return false;
		}else{
			for(var i=0;i<13;i++){
				if($("#columnaactividad"+i+"").hasClass("has-success")){
					if($("#columnaunidad"+i+"").hasClass("has-success")){
						if($("#columnadescripciond"+i+"").hasClass("has-success")){
							actividad.push($("#columnaactividad"+i+" input").val());
							unidad.push($("#columnaunidad"+i+" input").val());
							descripcion.push($("#columnadescripciond"+i+" input").val());
						}
					}
				}
			}
			socket.emit('enviarcodificacionactividades',{codigo:actividad,descripcion:descripcion,unidad:unidad});
			var $btn = $(this).button('loading');
		}
	});
	//respuesta registro de nuevas actividades sam
	socket.on('respuestaenviarcodificacionactividades',function(datos){if(datos==true){swal({title: "Satisfactorio!",text: "Actividades registrados con exito..",type: "success",confirmButtonText: "Aceptar",closeOnConfirm: false },function(){location.reload();});}else{swal({title: "ERROR!",text: "Ocurrio un error de conexión intentelo nuevamente!",type: "error",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}});

	//MODIFICAR CODIGO SAM
	// function modificarSam(num){$('#'+num+'>#valu').replaceWith( "<h2>New heading</h2>" );$('.actsam').text($('#'+num+'>#actsam').text());$('.dessam').text($('#'+num+'>#dessam').text());$('.unisam').text($('#'+num+'>#unisam').text());$('.presam').text($('#'+num+'>#presam').text());}
	// var controlador=0;
	// $("#btnmodificarSam").click(function(){var aux2=$(this).text();if(aux2=='Modificar'){$('.inde').val($('.dessam').text());$('.inun').val($('.unisam').text());$('.inpr').val($('.presam').text());$("#modalSam input").toggle(5);$(".desaparecersam").css("display", "none");$(this).text('Guardar');$(this).addClass('disabled');}else{if(aux2=='Guardar'){if(controlador==1){var valores={"codsam":$('.actsam').text(),"unidad":$('.inun').val(),"descripcion":$('.inde').val(),"presunit":$('.inpr').val()};socket.emit('actualizarSam',valores);}}}});
	// $("#modalSam input").keyup(function(){if(($('.inde').val()!=$('.dessam').text()) || ($('.inun').val()!=$('.unisam').text()) || ($('.inpr').val()!=$('.presam').text())){$('#btnmodificarSam').removeClass('disabled');controlador=1;}else{$('#btnmodificarSam').addClass('disabled');}});
	// $('#btncancelarSam').click(function(){$(".desaparecersam").css("display", "block");$('#btnmodificarSam').text('Modificar').removeClass('disabled');$("#modalSam input").css("display", "none");controlador=0;});
	// //socket respuesta de actualizar
	// socket.on('respuestaactualizarSam',function(valores){if(valores.estado==true){$('.actsam').text(valores.codsam);$('.dessam').text(valores.descripcion);$('.unisam').text(valores.unidad);$('.presam').text(valores.presunit);$(".desaparecersam").css("display", "block");$('#btnmodificarSam').text('Modificar').removeClass('disabled');$("#modalSam input").css("display", "none");controlador=0;swal({title: "Satisfactorio!",text: "Registro de la actividad satisfactoria",type: "success",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}else{swal({title:"ERROR!",text: "Ocurrio un error de conexión intentelo nuevamente!",type: "error",confirmButtonText: "Aceptar",closeOnConfirm: false },function(){location.reload();});}});
	

//______________REGISTRO DE CODIFICACION DE PERSONAL____________
	function mostrarfilap(){var uuu=0;for(var i=0;i<13;i++){if($("#columnaclased"+i+"").hasClass("has-success")){if($("#columnadescrid"+i+"").hasClass("has-success")){$(".tablap"+(i+1)+"").show();uuu++;}	}	}if(uuu>0){$("#btnCodPersonal").removeClass('disabled');}else{$("#btnCodPersonal").addClass('disabled');}}
	$('#asignarcodperson .grupo1').bind('keyup input', function(){var aux=$(this).attr('id');var aux1=parseInt($(this).val());if(aux1>0){$('#columnaclase'+aux+'').removeClass('has-error');$('#columnaclase'+aux+'').addClass('has-success');$('#columnaclase'+aux+' span').removeClass('glyphicon-remove');$('#columnaclase'+aux+' span').addClass('glyphicon-ok');}else{$('#columnaclase'+aux+'').removeClass('has-success');$('#columnaclase'+aux+'').addClass('has-error');$('#columnaclase'+aux+' span').removeClass('glyphicon-ok');$('#columnaclase'+aux+' span').addClass('glyphicon-remove');}mostrarfilap();});
	$('#asignarcodperson .grupo2').keyup(function(){var aux=$(this).attr('id');var aux1=$(this).val().length;if(aux1>5){$('#columnadescri'+aux+'').removeClass('has-error');$('#columnadescri'+aux+'').addClass('has-success');$('#columnadescri'+aux+' span').removeClass('glyphicon-remove');$('#columnadescri'+aux+' span').addClass('glyphicon-ok');}else{$('#columnadescri'+aux+'').removeClass('has-success');$('#columnadescri'+aux+'').addClass('has-error');$('#columnadescri'+aux+' span').removeClass('glyphicon-ok');$('#columnadescri'+aux+' span').addClass('glyphicon-remove');}mostrarfilap();});
	//Enviar registro de codificacion de personal
	$("#btnCodPersonal").click(function(){
		var clase=[],descripcion=[];
		if($(this).hasClass('disabled')){
			return false;
		}else{
			for(var i=0;i<13;i++){
				if($("#columnaclased"+i+"").hasClass("has-success")){
					if($("#columnadescrid"+i+"").hasClass("has-success")){
						clase.push($("#columnaclased"+i+" input").val());
						descripcion.push($("#columnadescrid"+i+" input").val());
					}
				}
			}
			console.log(clase,descripcion);
			socket.emit('enviarcodificacionpersonal',{clase:clase,descripcion:descripcion});
			var $btn = $(this).button('loading');
		}
	});
	//respuesta registro de codificacion de personal
	socket.on('respuestaenviarcodificacionpersonal',function(datos){if(datos==true){swal({title: "Satisfactorio!",text: "La codificacion del personal se completo!",type: "success",confirmButtonText: "Aceptar",closeOnConfirm: false },function(){location.reload();});}else{swal({title: "ERROR!",text: "Ocurrio un error de conexión intentelo nuevamente!",type: "error",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}});

//______________REGISTRO DE CODIFICACION DE VEHICULO__________
	function mostrarfilav(){var uuu=0;for(var i=0;i<13;i++){if($("#columnaclasev"+i+"").hasClass("has-success")){if($("#columnadescriv"+i+"").hasClass("has-success")){$(".tablav"+(i+1)+"").show();uuu++;}	}	}if(uuu>0){$("#btncodvehiculo").removeClass('disabled');}else{$("#btncodvehiculo").addClass('disabled');}}
	$('#asignarcodvehiculo .grupo1').bind('keyup input', function(){var aux=$(this).attr('id');var aux1=parseInt($(this).val());if(aux1>0){$('#columnaclase'+aux+'').removeClass('has-error');$('#columnaclase'+aux+'').addClass('has-success');$('#columnaclase'+aux+' span').removeClass('glyphicon-remove');$('#columnaclase'+aux+' span').addClass('glyphicon-ok');}else{$('#columnaclase'+aux+'').removeClass('has-success');$('#columnaclase'+aux+'').addClass('has-error');$('#columnaclase'+aux+' span').removeClass('glyphicon-ok');$('#columnaclase'+aux+' span').addClass('glyphicon-remove');}mostrarfilav();});
	$('#asignarcodvehiculo .grupo2').keyup(function(){var aux=$(this).attr('id');var aux1=$(this).val().length;if(aux1>5){$('#columnadescri'+aux+'').removeClass('has-error');$('#columnadescri'+aux+'').addClass('has-success');$('#columnadescri'+aux+' span').removeClass('glyphicon-remove');$('#columnadescri'+aux+' span').addClass('glyphicon-ok');}else{$('#columnadescri'+aux+'').removeClass('has-success');$('#columnadescri'+aux+'').addClass('has-error');$('#columnadescri'+aux+' span').removeClass('glyphicon-ok');$('#columnadescri'+aux+' span').addClass('glyphicon-remove');}mostrarfilav();});
	//Enviar registro de codificacion vehiculos
	$("#btncodvehiculo").click(function(){
		var clase=[],descripcion=[];
		if($(this).hasClass('disabled')){
			return false;
		}else{
			for(var i=0;i<13;i++){
				if($("#columnaclasev"+i+"").hasClass("has-success")){
					if($("#columnadescriv"+i+"").hasClass("has-success")){
						clase.push($("#columnaclasev"+i+" input").val());
						descripcion.push($("#columnadescriv"+i+" input").val());
					}
				}
			}
			console.log(clase,descripcion);
			socket.emit('enviarcodificacionvehiculo',{clase:clase,descripcion:descripcion});
			var $btn = $(this).button('loading');
		}
	});
	//respuesta registro de codificacion vehiculos
	socket.on('respuestaenviarcodificacionvehiculo',function(datos){if(datos==true){swal({title: "Satisfactorio!",text: "La codificacion del vehiculo se completo!",type: "success",confirmButtonText: "Aceptar",closeOnConfirm: false },function(){location.reload();});}else{swal({title: "ERROR!",text: "Ocurrio un error de conexión intentelo nuevamente!",type: "error",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}});

//_________REGISTRO DE CODIFICACION DE MATERIALES______
	// Controlar el nombre
	$('#asignarcodmaterial .grupo1').bind('keyup input', function(){var aux=$(this).attr('id');var aux1=parseInt($(this).val());if(aux1>0){$('#columnaclase'+aux+'').removeClass('has-error');$('#columnaclase'+aux+'').addClass('has-success');$('#columnaclase'+aux+' span').removeClass('glyphicon-remove');$('#columnaclase'+aux+' span').addClass('glyphicon-ok');}else{$('#columnaclase'+aux+'').removeClass('has-success');$('#columnaclase'+aux+'').addClass('has-error');$('#columnaclase'+aux+' span').removeClass('glyphicon-ok');$('#columnaclase'+aux+' span').addClass('glyphicon-remove');}mostrarfilam();});
	function mostrarfilam(){var uuu=0;for(var i=0;i<13;i++){if($("#columnaclasem"+i+"").hasClass("has-success")){if($("#columnadescripcionm"+i+"").hasClass("has-success")){if($("#columnaunidadm"+i+"").hasClass("has-success")){$(".tablam"+(i+1)+"").show();uuu++;}	}	}}if(uuu>0){$("#btnAsignarmaterial").removeClass('disabled');}else{$("#btnAsignarmaterial").addClass('disabled');}}
	$('#asignarcodmaterial .grupo2').keyup(function(){var aux=$(this).attr('id');var aux1=$(this).val().length;if(aux1>1){$('#columnadescripcion'+aux+'').removeClass('has-error');$('#columnadescripcion'+aux+'').addClass('has-success');$('#columnadescripcion'+aux+' span').removeClass('glyphicon-remove');$('#columnadescripcion'+aux+' span').addClass('glyphicon-ok');}else{$('#columnadescripcion'+aux+'').removeClass('has-success');$('#columnadescripcion'+aux+'').addClass('has-error');$('#columnadescripcion'+aux+' span').removeClass('glyphicon-ok');$('#columnadescripcion'+aux+' span').addClass('glyphicon-remove');}mostrarfilam();});
	$('#asignarcodmaterial .grupo3').keyup(function(){var aux=$(this).attr('id');var aux1=$(this).val().length;if(aux1>5){$('#columnaunidad'+aux+'').removeClass('has-error');$('#columnaunidad'+aux+'').addClass('has-success');$('#columnaunidad'+aux+' span').removeClass('glyphicon-remove');$('#columnaunidad'+aux+' span').addClass('glyphicon-ok');}else{$('#columnaunidad'+aux+'').removeClass('has-success');$('#columnaunidad'+aux+'').addClass('has-error');$('#columnaunidad'+aux+' span').removeClass('glyphicon-ok');$('#columnaunidad'+aux+' span').addClass('glyphicon-remove');}mostrarfilam();});
	//Enviar registro de codificacion materiales
	$("#btnAsignarmaterial").click(function(){
		var actividad=[],unidad=[],descripcion=[];
		if($(this).hasClass('disabled')){
			return false;
		}else{
			for(var i=0;i<13;i++){
				if($("#columnaclasem"+i+"").hasClass("has-success")){
					if($("#columnadescripcionm"+i+"").hasClass("has-success")){
						if($("#columnaunidadm"+i+"").hasClass("has-success")){
							actividad.push($("#columnaclasem"+i+" input").val());
							unidad.push($("#columnadescripcionm"+i+" input").val());
							descripcion.push($("#columnaunidadm"+i+" input").val());
						}
					}
				}
			}
			socket.emit('enviarcodificacionmaterial',{clase:actividad,descripcion:descripcion,unidad:unidad});
			var $btn = $(this).button('loading');
		}
	});
	//respuesta registro de codificacion materiales
	socket.on('respuestaenviarcodificacionmaterial',function(datos){if(datos==true){swal({title: "Satisfactorio!",text: "La codificacion del material se completo!",type: "success",confirmButtonText: "Aceptar",closeOnConfirm: false },function(){location.reload();});}else{swal({title: "ERROR!",text: "Ocurrio un error de conexión intentelo nuevamente!",type: "error",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}});

//__________REGISTRO DE ASIGNAR SALARIOS_______
	//control de cargo
	$('#asignarsalarios .grupo1').change(function(){var aux=$(this).attr('id');var aux1=$(this).val();if(aux1!="Seleccione Cargo"){$('#columnacargo'+aux+'').removeClass('has-error');$('#columnacargo'+aux+'').addClass('has-success');$('#columnacargo'+aux+' span').removeClass('glyphicon-remove');$('#columnacargo'+aux+' span').addClass('glyphicon-ok');}else{$('#columnacargo'+aux+'').removeClass('has-success');$('#columnacargo'+aux+'').addClass('has-error');$('#columnacargo'+aux+' span').removeClass('glyphicon-ok');$('#columnacargo'+aux+' span').addClass('glyphicon-remove');}mostrarfilas();});
	// funcion para ver cambios en los inputs
	function mostrarfilas(){var uuu=0;for(var i=0;i<13;i++){if($("#columnacargos"+i+"").hasClass("has-success")){if($("#columnaitems"+i+"").hasClass("has-success")){if($("#columnasueldos"+i+"").hasClass("has-success")){$(".tablas"+(i+1)+"").show();uuu++;}	}	}}if(uuu>0){$("#btnasignarsueldos").removeClass('disabled');}else{$("#btnasignarsueldos").addClass('disabled');}}
	//control de cantidad de items
	$('#asignarsalarios .grupo2').bind('keyup input', function(){var aux=$(this).attr('id');var aux1=parseInt($(this).val());if(aux1>0){$('#columnaitem'+aux+'').removeClass('has-error');$('#columnaitem'+aux+'').addClass('has-success');$('#columnaitem'+aux+' span').removeClass('glyphicon-remove');$('#columnaitem'+aux+' span').addClass('glyphicon-ok');}else{$('#columnaitem'+aux+'').removeClass('has-success');$('#columnaitem'+aux+'').addClass('has-error');$('#columnaitem'+aux+' span').removeClass('glyphicon-ok');$('#columnaitem'+aux+' span').addClass('glyphicon-remove');}mostrarfilas();});
	//control del sueldo
	$('#asignarsalarios .grupo3').bind('keyup input', function(){var aux=$(this).attr('id');var aux1=parseInt($(this).val());if(aux1>999){$('#columnasueldo'+aux+'').removeClass('has-error');$('#columnasueldo'+aux+'').addClass('has-success');$('#columnasueldo'+aux+' span').removeClass('glyphicon-remove');$('#columnasueldo'+aux+' span').addClass('glyphicon-ok');}else{$('#columnasueldo'+aux+'').removeClass('has-success');$('#columnasueldo'+aux+'').addClass('has-error');$('#columnasueldo'+aux+' span').removeClass('glyphicon-ok');$('#columnasueldo'+aux+' span').addClass('glyphicon-remove');}mostrarfilas();});
	//Enviar registro de salarios 
	$("#btnasignarsueldos").click(function(){
		var cargoss=[],itemss=[],sueldoss=[];
		if($(this).hasClass('disabled')){
			return false;
		}else{
			for(var i=0;i<13;i++){
				if($("#columnacargos"+i+"").hasClass("has-success")){
					if($("#columnaitems"+i+"").hasClass("has-success")){
						if($("#columnasueldos"+i+"").hasClass("has-success")){
							cargoss.push($("#columnacargos"+i+" select").val());
							itemss.push($("#columnaitems"+i+" input").val());
							sueldoss.push($("#columnasueldos"+i+" input").val());
						}
					}
				}
			}
			console.log(cargoss,itemss,sueldoss,$('#btnfecha').text());
			socket.emit('enviarsueldousuarios',{codpersonal:cargoss,nroitems:itemss,sueldomensual:sueldoss,gestion:$('#btnfecha').text()});
			var $btn = $(this).button('loading');
		}
	});
	//respuesta registro de salarios 
	socket.on('respuestaenviarsueldousuarios',function(datos){if(datos==true){swal({title: "Satisfactorio!",text: "Se registraron los salarios Satisfactoriamente",type: "success",confirmButtonText: "Aceptar",closeOnConfirm: false },function(){location.reload();});}else{swal({title: "ERROR!",text: "Ocurrio un error de conexión intentelo nuevamente!",type: "error",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}});
	//Cambios de año en registro de salarios por gestion
	$('#datetimepicker12').datetimepicker({viewMode: "years", minViewMode: "years",viewMode: 'years',dateFormat: 'yyyy'}).on('changeDate', function(ev){$(this).datetimepicker('hide');}).on('changeDate', function(ev){var i=$('#valorr').val();$('#btnfecha').text(i);$('#btnfecha').append('<span style="padding-left:5px;" aria-hidden="true" class="glyphicon glyphicon-calendar"></span>');$('#btnfecha').attr('disabled', true);socket.emit('versalariosgestiones',i);});
	//respuesta cambio de años en salarios
	socket.on('respuestaversalariosgestiones',function(valor){$('#alerterror').remove();$('#btnfecha').attr('disabled', false);$('#tablasalarios').empty();if(valor.estado){for (var i = 0; i < valor.descripcion.length; i++) {$('#tablasalarios').append('<tr><td>'+(i+1)+'</td><td>'+valor.descripcion[i]+'</td><td>'+valor.nroitem[i]+'</td><td>'+valor.sueldomensual[i]+'</td><td>'+((valor.sueldomensual[i]*valor.nroitem[i])*12)+'</td></tr>');}}else{$('#salarios .filaerrorsalario').append('<div style="background:#fff" id="alerterror" class="row"><div class="col-md-8 col-md-offset-2"><div role="alert" id="alertaSamError" style="margin:20px;" class="alert alert-danger alert-dismissible"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true">×</span></button><strong>NO SE ENCONTRARON RESULTADOS!</strong> Aun no se registro la Planilla salarial.. registre planilla para evitar problemas con el sistema.</div></div></div>');}});

	//cambios de año en residencias por gestion
	$('#datetimepicker11').datetimepicker({
		viewMode: "years", 
		minViewMode: "years",
		viewMode: 'years',
		dateFormat: 'yyyy'
	}).on('changeDate', function(ev){
		// do what you want here
		$(this).datetimepicker('hide');
	}).on('changeDate', function(ev){
		var i=$('#valorr').val();
		$('#btnfecha').text(i);
		$('#btnfecha').append('<span style="padding-left:5px;" aria-hidden="true" class="glyphicon glyphicon-calendar"></span>')
		$('#btnfecha').attr('disabled', true);
		window.location.href = "/Residencias?gestion="+i+"";
		
		//socket.emit('damecordenadasdeunvehiculo',{idcar:$.urlParam('idVehiculo'),fecha:i});
	});
	
	$('#formRegistroResidencia input').focus(function(){
		$('#formRegistroResidencia .list-group').show();
	});

	$('#formRegistroResidencia input').blur(function() {
		var myVar;
		clearInterval(myVar);
			myVar = setTimeout(
			  	function(){
					$('#formRegistroResidencia .list-group').hide();
			  	}, 150);
	  });
//___________modificar & eliminar Tramos_____________________
	var descripciontramo;
	var valort;
	$('.btneditartramo').click(function(){valort=$(this).attr('value');descripciontramo=$('.filatramo'+valort+' .descripciont').text();$('.descripcionT').val(descripciontramo);});
	//escribir en formulario de modificar tramo
	$('.descripcionT').keyup(function(){if($(this).val().length>8){if($(this).val()==descripciontramo){$('.btnguardareditartramo').attr('disabled',true);$('.spantramo').removeClass('glyphicon-ok');$('.spantramo').addClass('glyphicon-remove');}else{$('.btnguardareditartramo').attr('disabled',false);$('.spantramo').removeClass('glyphicon-remove');$('.spantramo').addClass('glyphicon-ok');}}else{$('.spantramo').removeClass('glyphicon-ok');$('.spantramo').addClass('glyphicon-remove');}});
	$('.btnguardareditartramo').click(function(){socket.emit('modificartramo',{idtramo:valort,valor:$('.descripcionT').val()});});
	//respuesta modificar tramo
	socket.on('respuestamodificartramo',function(val){if(val){$('.filatramo'+valort+' .descripciont').text($('.descripcionT').val());swal("Satisfactorio!", "El tramo se modifico con éxito", "success");}else{swal("Oops...", "Ocurrio un problema en la conexion!", "error");}});
	//eliminar tramo
	$('.btneliminareditartramo').click(function(){swal({title: "Esta Usted Seguro?",text: "Es posible que el tramo este en uso!",type: "warning",showCancelButton: true,confirmButtonColor: "#DD6B55",confirmButtonText: "Eliminar esto",closeOnConfirm: false},function(){socket.emit('eliminartramo',valort);});});
	//respuesta eliminar tramo
	socket.on('respuestaeliminartramo',function(val){if(val){swal({title: "Eliminado!",text: "El tramo se elimino con exito..",type: "success",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}else{swal("Oops...", "No se pudo eliminar el tramo!", "error");}});

//___________modificar & eliminar asignacion personal _____________________
	var perfil1,estado1,idasignacionp,observacion1;
	$('#tablaasignacionpersonal tr').click(function(){idasignacionp=$(this).attr('value');estado1=$(this).find('#estadop').text();perfil1=$(this).find('#perfilp').attr('value');observacion1=$(this).find('#observacionesp').text();$('.titulomodalpersonal').text($(this).find('#nombresp').text());$('#perfilpp').val(perfil1);$('#estadopp').val(estado1);$('.observacionP').val(observacion1);});
	//controla que realice una modificacion en los selects y inputs
	$("#ModalReasignarUser select").change(function(){modificarasignacionp();});
	$("#ModalReasignarUser input").keyup(function(){modificarasignacionp();});
	function modificarasignacionp(){if(($('#perfilpp').val()!=perfil1)||($('#estadopp').val()!=estado1)||($('.observacionP').val()!=observacion1)){$('.btnguardareditarperson').attr('disabled',false);}else{$('.btnguardareditarperson').attr('disabled',true);}}
		
	$('.btnguardareditarperson').click(function(){socket.emit('modificarpersonalresidencia',{idasignacionp:idasignacionp,perfil:$('#perfilpp').val(),estado:$('#estadopp').val(),observacion:$('.observacionP').val()});});
	//respuesta modificar asignacion personal
	socket.on('respuestamodificarpersonalresidencia',function(val){$('.btnguardareditarperson').attr('disabled',true);if(val){perfil1=$('#perfilpp').val();estado1=$('#estadopp option:selected').text();observacion1=$('.observacionP').val();$('#tablaasignacionpersonal tr[value='+idasignacionp+']').find('#estadop').text($('#estadopp option:selected').text());$('#tablaasignacionpersonal tr[value='+idasignacionp+']').find('#perfilp').text($('#perfilpp option:selected').text());$('#tablaasignacionpersonal tr[value='+idasignacionp+']').find('#perfilp').attr('value',$('#perfilpp').val());$('#tablaasignacionpersonal tr[value='+idasignacionp+']').find('#observacionesp').text($('.observacionP').val());swal("Satisfactorio!", "La asignacion del personal se modifico con éxito", "success");}else{swal("Oops...", "Ocurrio un problema en la conexion!", "error");}});
	//eliminar asignacion personal
	$('.btneliminareditarperson').click(function(){swal({title: "Esta Usted Seguro?",text: "Es posible que el personal este en uso!",type: "warning",showCancelButton: true,confirmButtonColor: "#DD6B55",confirmButtonText: "Eliminar esto",closeOnConfirm: false},function(){socket.emit('eliminarasignacionp',idasignacionp);});});
	//respuesta eliminar asignacion personal
	socket.on('respuestaeliminarasignacionp',function(val){if(val){swal({title: "Eliminado!",text: "la asignacion del usuario a esta residencia se elimino con exito..",type: "success",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}else{swal("Oops...", "No se pudo eliminar el usuario de la residencia", "error");}});

//___________modificar & eliminar asignacion vehiculos _____________________
	var estado2,idasignacionv,observacion2;
	$('#tablaasignacionvehiculo tr').click(function(){idasignacionv=$(this).attr('value');estado2=$(this).find('#estadov').text();observacion2=$(this).find('#observacionv').text();$('.titulomodalvehiculo').text($(this).find('#codinternov').text());$('#estadovv').val(estado2);$('.observacionvv').val(observacion2);});
	//controla que realice una modificacion en los selects y inputs
	$("#ModalReasignarCar select").change(function(){modificarasignacionv();});
	$("#ModalReasignarCar input").keyup(function(){modificarasignacionv();});
	function modificarasignacionv(){if(($('#estadovv').val()!=estado2)||($('.observacionvv').val()!=observacion2)){$('.btnguardareditarcar').attr('disabled',false);}else{$('.btnguardareditarcar').attr('disabled',true);}}
		
	$('.btnguardareditarcar').click(function(){socket.emit('modificarvehiculoresidencia',{idasignacionv:idasignacionv,estado:$('#estadovv').val(),observacion:$('.observacionvv').val()});});
	//respuesta modificar asignacion vehiculos
	socket.on('respuestamodificarvehiculoresidencia',function(val){$('.btnguardareditarcar').attr('disabled',true);if(val){estado2=$('#estadovv option:selected').text();observacion2=$('.observacionvv').val();$('#tablaasignacionvehiculo tr[value='+idasignacionv+']').find('#estadov').text($('#estadovv option:selected').text());$('#tablaasignacionvehiculo tr[value='+idasignacionv+']').find('#observacionv').text($('.observacionvv').val());swal("Satisfactorio!", "La asignacion del vehiculo se modifico con éxito", "success");}else{swal("Oops...", "Ocurrio un problema en la conexion!", "error");}});
	//eliminar asignacion vehiculos
	$('.btneliminareditarcar').click(function(){swal({title: "Esta Usted Seguro?",text: "Es posible que el vehiculo este en uso!",type: "warning",showCancelButton: true,confirmButtonColor: "#DD6B55",confirmButtonText: "Eliminar esto",closeOnConfirm: false},function(){socket.emit('eliminarasignacionv',idasignacionv);});});
	//respuesta eliminar asignacion vehiculos
	socket.on('respuestaeliminarasignacionv',function(val){if(val){swal({title: "Eliminado!",text: "la asignacion del vehiculo a esta residencia se elimino con exito..",type: "success",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}else{swal("Oops...", "No se pudo eliminar el vehiculo de la residencia", "error");}});


//___________modificar & eliminar asignacion materiales _____________________
	var unidad1,cantidad1,precio1,idasignacionm;
	$('#tablaasignacionmaterial tr').click(function(){
		idasignacionm=$(this).attr('value');
		unidad1=$(this).find('#unidadm').text();
		cantidad1=$(this).find('#cantidadm').text();
		precio1=$(this).find('#preciounitariom').text();
		$('.titulomodalmaterial').text($(this).find('#descripcionm').text());
		$('#unidadmm').val(unidad1);
		$('.cantidadmm').val(cantidad1);
		$('.preciomm').val(precio1);
	});
	//controla que realice una modificacion en los selects y inputs
	$("#ModalReasignarMaterial select").change(function(){
		modificarasignacionm();
	});
	$("#ModalReasignarMaterial input").keyup(function(){
		var aux1=parseInt($(this).val());
		if(aux1>0){
			modificarasignacionm();
		}
		else{
			$('.btnguardareditarM').attr('disabled',true);
		}
	});
	function modificarasignacionm(){
		if(($('#unidadmm').val()!=unidad1)||($('.cantidadmm').val()!=cantidad1)||($('.preciomm').val()!=precio1)){
			$('.btnguardareditarM').attr('disabled',false);
		}else{
			$('.btnguardareditarM').attr('disabled',true);
		}
	}
		
	$('.btnguardareditarM').click(function(){
		socket.emit('modificarmaterialresidencia',{idasignacionm:idasignacionm,unidad:$('#unidadmm').val(),cantidad:$('.cantidadmm').val(),precio:$('.preciomm').val()});
	});
	//respuesta modificar asignacion materiales
	socket.on('respuestamodificarmaterialresidencia',function(val){
		$('.btnguardareditarM').attr('disabled',true);
		if(val){
			unidad1=$('#unidadmm').val();
			cantidad1=$('.cantidadmm').val();
			precio1=$('.preciomm').val();
			$('#tablaasignacionmaterial tr[value='+idasignacionm+']').find('#unidadm').text($('#unidadmm option:selected').text());
			$('#tablaasignacionmaterial tr[value='+idasignacionm+']').find('#cantidadm').text($('.cantidadmm').val());
			$('#tablaasignacionmaterial tr[value='+idasignacionm+']').find('#preciounitariom').text($('.preciomm').val());
			swal("Satisfactorio!", "La asignacion del material se modifico con éxito", "success");
		}else{
		swal("Oops...", "Ocurrio un problema en la conexion!", "error");
		}
	});
	//eliminar asignacion materiales
	$('.btneliminareditarM').click(function(){swal({title: "Esta Usted Seguro?",text: "Es posible que el material este en uso!",type: "warning",showCancelButton: true,confirmButtonColor: "#DD6B55",confirmButtonText: "Eliminar esto",closeOnConfirm: false},function(){socket.emit('eliminarasignacionm',idasignacionm);});});
	//respuesta eliminar asignacion materiales
	socket.on('respuestaeliminarasignacionm',function(val){if(val){swal({title: "Eliminado!",text: "la asignacion del material a esta residencia se elimino con exito..",type: "success",confirmButtonText: "Aceptar",closeOnConfirm: false }, function(){location.reload();});}else{swal("Oops...", "No se pudo eliminar el material de la residencia", "error");}});

})


