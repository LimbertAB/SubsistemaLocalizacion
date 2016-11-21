$(function(){ 
	var socket=io();

	var mbAttr = 'Edit For © <a href="http://mapbox.com">Limbert AB</a>';
	mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibGltYmVydGFiIiwiYSI6ImNpcG9mMnV3ZDAxcHZmdG0zOWc1NjV2aGwifQ.89smGLtgJWmUKgd7B0cV1Q';
	var deafult=L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: mbAttr
	});
	if(window.location.pathname=='/Location_GPS_car'||window.location.pathname=='/Location_GPS_principal'){
		var map = L.map('mimapa', {
		    center: [-20.550508894195627, -66.62109375],
		    zoom:7,
		    maxZoom: 17,
		    layers:deafult,
		});
		var polyline = L.polyline(functionPuntos(), {color: 'red',border:50}).addTo(map);//DIBUJO DEL MAPA DE POTOSI		

		var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
			satellite = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGltYmVydGFiIiwiYSI6ImNpcG9mMnV3ZDAxcHZmdG0zOWc1NjV2aGwifQ.89smGLtgJWmUKgd7B0cV1Q'),
			Dark = L.tileLayer(mbUrl, {id: 'mapbox.dark', attribution: mbAttr}),
			uno = L.tileLayer(mbUrl, {id: 'mapbox.streets', attribution: mbAttr});
		var baseMaps = {"DEFAULT": deafult,"SATELITE":satellite,"OBSCURIDAD":Dark,"OPCION 1": uno};//Titulos Mapas
		L.control.layers(baseMaps).addTo(map);
		$('[data-toggle="tooltip"]').tooltip();
		$('#mainNav').affix({offset: {top: 100}});
	}

	
	//codigo para obtener valor de url
	$.urlParam = function(name){var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
		return results[1] || 0;
	}


	var DirURL = window.location.pathname; 
	//obtener nombre de ubicacion con latitud y longitud
	$.getJSON("http://nominatim.openstreetmap.org/reverse?format=json&addressdetails=0&zoom=18&lat=" + -18.469744 + "&lon=" + -66.562618 + "&json_callback=?",
        function (response) {
        }
    );


	$('#datetimepicker').datetimepicker({
		pickTime: false,
		format: 'dd-MM-yyyy',
		language: 'pt-BO'
	}).on('changeDate', function(ev){
		// do what you want here
		$(this).datetimepicker('hide');
	}).on('changeDate', function(ev){
		var i=$('#valorr').val();
		$('#btnfecha').text(i);
		$('#btnfecha').append('<span style="padding-left:5px;" aria-hidden="true" class="glyphicon glyphicon-calendar"></span>')
		$('#btnfecha').addClass('disabled');
		socket.emit('damecordenadasdeunvehiculo',{idcar:$.urlParam('idVehiculo'),fecha:i});
	});
	var layerGroup;
	if(window.location.pathname=='/Location_GPS_principal'){
		var markers=[];
		for(var i=0;i<$('#todos tr').length;i++){
			var lat=$('#todos #fila'+i+' .latL').text();
			var lon=$('#todos #fila'+i+' .lonL').text();
			if((lat!='')&&(lon!='')){
				var mark1=L.marker([lat, lon]).bindPopup('<b>CODInterno: </b>'+$('#todos #fila'+i+' .codL').text()+'</b><br><b>PLACA: </b>'+$('#todos #fila'+i+' .plL').text()+'<br><b>TIPO: </b>'+$('#todos #fila'+i+' .tipL').text()+'<br><button type="button" class="btn btn-danger btn-xs markerbutton" style="margin:0 auto" onclick="doFunctioncar('+$('#todos #fila'+i+' .idL').text()+')">Ver Ubicaciones<span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span></button>').openPopup();
				markers.push(mark1);
			}
			
		}
		layerGroup=L.layerGroup(markers).addTo(map);
		$(".markerbutton:visible").click(function () {
	        console.log($(this).attr('id'));
	    });
	}
	$('.tabResidencias a').click(function(){
		var id=$(this).attr('href');
		var markers=[];
		map.removeLayer(layerGroup);
		for(var i=0;i<$('#'+id+' tr').length;i++){
			var lat=$('#'+id+' #fila'+i+' .latL').text();
			var lon=$('#'+id+' #fila'+i+' .lonL').text();
			if((lat!='')&&(lon!='')){
				var mark1=L.marker([lat, lon]).bindPopup('<b>CODInterno: </b>'+$('#'+id+' #fila'+i+' .codL').text()+'</b><br><b>PLACA: </b>'+$('#'+id+' #fila'+i+' .plL').text()+'<br><b>TIPO: </b>'+$('#'+id+' #fila'+i+' .tipL').text()+'<br><button type="button" class="btn btn-danger btn-xs markerbutton" style="margin:0 auto" onclick="doFunctioncar('+$('#'+id+' #fila'+i+' .idL').text()+')">Ver Ubicaciones<span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span></button>').openPopup();
				markers.push(mark1);
			}
		}
		layerGroup=L.layerGroup(markers).addTo(map);
	});
	

	if(window.location.pathname=='/Location_GPS_car'){
		var mark1=L.marker([51.5, -0.09]);
		var markers=[];markers.push(mark1);
		layerGroup=L.layerGroup(markers).addTo(map);
		if($('#estadoLocationuser').text()=='true'){
			$('#btnfecha').addClass('disabled');
			socket.emit('damecordenadasdeunvehiculo',{idcar:$.urlParam('idVehiculo'),fecha:$('#btnfecha').text()});
		}
	}
	socket.on('respuestadamecordenadasdeunvehiculo',function(valores){
		console.log(valores)
		var markers=[];
		map.removeLayer(layerGroup);
		$('#btnfecha').removeClass('disabled');
		if(valores.responde==true){
			for(var i=0;i<valores.latitud.length;i++){
				var lat=valores.latitud[i];
				var lon=valores.longitud[i];
				var mark1=L.marker([lat, lon]).bindPopup('<b> Fecha: </b>'+valores.fecha[i]+'<br><b> Hora: </b>'+valores.hora[i]+'<br><b> Velocidad: </b>'+valores.velocidad[i]+'').openPopup();    
				markers.push(mark1);
			}
			layerGroup=L.layerGroup(markers).addTo(map);
		}
		else{
			map.removeLayer(layerGroup);
			console.log('no hay ubicaciones');
		}
	});
	var Localizaciones;
	if(window.location.pathname=='/Importar_Coordenadas'){
		$('body').css('background', '#008fd4');
		var fileInput = document.getElementById('fileInput');
		var fileDisplayArea = document.getElementById('fileDisplayArea');
		fileInput.addEventListener('change', function(e) {
			var file = fileInput.files[0];
			var textType = /text.*/;

			if (file.type.match(textType)) {
				$('#btnenviarcorrdenadasmemoria').removeClass('disabled');
				var reader = new FileReader();

				reader.onload = function(e) {
					fileDisplayArea.innerText = reader.result;
					Localizaciones=(fileDisplayArea.innerText).split("\n");
				}
				reader.readAsText(file);

			} else {
				$('#btnenviarcorrdenadasmemoria').addClass('disabled');
				fileDisplayArea.innerText = "ARCHIVO NO SOPORTADO!"
			}
		});
	}
	$('#btnenviarcorrdenadasmemoria').click(function(){
		if($(this).hasClass('disabled')){
			//boton disabled
		}else{
			var gpsdata=[];
			for (var i = 0; i < Localizaciones.length; i++) {
				if(Localizaciones[i]!=""){
					gpsdata.push(Localizaciones[i]);
				}
			};
			socket.emit('insertarcoordenadasmemoriacard',{'coordenadas':gpsdata,'idvehiculo':$.urlParam('idVehiculo')});
			$('#btnenviarcorrdenadasmemoria').addClass('disabled');
			console.log('antes de enviar',gpsdata);
		}
	});
	socket.on('respuestainsertarcoordenadasmemoriacard',function(data){
		if(data==true){
			console.log('estado',data);
			swal({
				title: "Satisfactorio!",
				text: "Los datos se guardaron correctamente!",
				type: "success",
				confirmButtonText: "Aceptar",
				closeOnConfirm: false 
			}, 
			function(){
				location.reload();
			});
		}else{
			if (data==false){
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
			}else{
				swal({
					title: "ERROR!",
					text: "EL formato no es compatible!",
					type: "error",
					confirmButtonText: "Aceptar",
					closeOnConfirm: false
				},
				function(){
					location.reload();
				});
			}
		}
	});

	$('#btnimportardememoria').click(function(){
		window.location.href = "/Importar_Coordenadas?idVehiculo="+$.urlParam('idVehiculo')+"";
	});
})
