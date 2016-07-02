function onDocumentReady() {
	var socket=io();
	var mbAttr = 'Edit For © <a href="http://mapbox.com">Limbert AB</a>',
	mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibGltYmVydGFiIiwiYSI6ImNpcG9mMnV3ZDAxcHZmdG0zOWc1NjV2aGwifQ.89smGLtgJWmUKgd7B0cV1Q';
	var deafult=L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: mbAttr
	});
	var map = L.map('mimapa', {
	    center: [-20.550508894195627, -66.62109375],
	    zoom:7,
	    layers: [deafult],
	});
	var polyline = L.polyline(functionPuntos(), {color: 'red',border:50}).addTo(map);//DIBUJO DEL MAPA DE POTOSI
	var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
		satellite = L.tileLayer(mbUrl, {id: 'mapbox.satellite', attribution: mbAttr}),
		Dark = L.tileLayer(mbUrl, {id: 'mapbox.dark', attribution: mbAttr}),
		uno = L.tileLayer(mbUrl, {id: 'mapbox.streets', attribution: mbAttr}),
		dos = L.tileLayer(mbUrl, {id: 'mapbox.mapbox-terrain-v2', attribution: mbAttr});
	var baseMaps = {"DEFAULT": deafult,"SATELITE":satellite,"OBSCURIDAD":Dark,"OPCION 1": uno,"OPCION 2":dos };//Titulos Mapas
	L.control.layers(baseMaps).addTo(map);

	var DirURL=$(location).attr('href'); //DIRECCION URL DE LA PAGINA ACTUAL

	if(DirURL=='http://localhost:5000/Principal_TiempoReal'){
		var markMaestranza = L.marker([-19.560032769192688, -65.76850533485413]);
		map.addLayer(markMaestranza);
		markMaestranza.bindPopup('<b>MAESTRANZA SEDECA</b><p>Zona Baja de la coudad de Potosi</p><div><img style="width:100%" src="../images/maestranza.jpg" alt="image"/></div>',{minWidth:200});

		var markDistrito=L.marker([-19.582641500873358, -65.75748682022095]);
		map.addLayer(markDistrito);
		markDistrito.bindPopup('<b>SEDECA</b><p>Av. Del Maestro 310, Potosí, Bolivia</p><div><img style="width:100%" src="../images/banner.jpe" alt="image"/></div>',{minWidth:250});

		var markResidenciaUyuni=L.marker([-21.820707853875017, -67.6318359375]);
		map.addLayer(markResidenciaUyuni);
		markResidenciaUyuni.bindPopup('<b>RESIDENCIA UYUNI</b><p>Municipio de Uyuni</p><div><img style="width:100%" src="../images/residencias.jpe" alt="image"/></div>',{minWidth:250});
		
		var markResidenciaAcasio=L.marker([-18.024047499311752,-66.05887591838837]);
		map.addLayer(markResidenciaAcasio);
		markResidenciaAcasio.bindPopup('<b>RESIDENCIA ACASIO</b><p>Municipio de Acasio</p><div><img style="width:100%" src="../images/residencias.jpe" alt="image"/></div>',{minWidth:250});
	}
	if(DirURL=='http://localhost:5000/Localizacion_All_TR'){

		function onAccuratePositionProgress (e) {
			console.log(e);
		}
		function onAccuratePositionFound (e) {
		    L.marker(e.latlng).addTo(map).bindPopup("You are within meters from this point").openPopup();
		}
		function onAccuratePositionError (e) {
		    console.log(e.message)
		}
		map.on('accuratepositionprogress', onAccuratePositionProgress);
		map.on('accuratepositionfound', onAccuratePositionFound);
		map.on('accuratepositionerror', onAccuratePositionError);

		map.findAccuratePosition({
		    maxWait: 15000, // defaults to 10000
		    desiredAccuracy: 30 // defaults to 20
		});
		// map.locate({  //mas presicion pero un poco mas lento al obtener presicion
		// 	timeout:10000,
		// 	maximumAge:1
		// });
		// function onLocationFound(e) {
		// 	console.log(e);
		//     L.marker([e.latitude,e.longitude]).addTo(map).bindPopup("You are within meters from this point").openPopup();
		// }
		// map.on('locationfound', onLocationFound);
		// function onLocationError(e) {
	 //    	alert(e.message);
		// }
		// map.on('locationerror', onLocationError);
		socket.emit('ListaLocalizados');  //envia un alerta para listar NOTIFICACIONES
	}	
	socket.on("RespuestaListaLocalizados",function(datos){
		// for(var i=0;i<datos.cis.length;i++){
		// 	for(var i=0;i<datos.cis.length;i++){
		// 		if(datos.cis[i]==datos.cis[j]){
		// 		}
		// 		console.log(datos)
		// 	}
		// }
		for(var i=0;i<datos.cis.length;i++){
			$(".ListaLocalizados").append('<tr class="'+datos.cis[i]+'"><td><h4>'+datos.nombres[i]+'<small>-('+datos.cargos[i]+')</small></h4></td></tr>');
		}
		$(".ListaLocalizados tr").click(function(){
			var cii=$(this).closest('tr').attr('class');
			sessionStorage.setItem('CiLocalizado',cii);
			location.href='Localizacion_One_Personal';
			
		});
	});
	if(DirURL=='http://localhost:5000/Localizacion_One_Personal'){
		var cilocalizado=sessionStorage.getItem("CiLocalizado");
		socket.emit('ListaCordenadasUnUser',cilocalizado);
	}
	socket.on("RespuestaListaCordenadasUnUser",function(datos){
		console.log(datos);
		var tam=datos.latitud.length;
		$('.titleOneUser').text(datos.nombres);
		$('.titleOneUser').append('<small style="margin-left:40px;">'+datos.fecha[tam-1]+'</small>');
		var ultimo=datos.fecha[tam-1];
		for(var i=tam-1;i>=0;i--){

			if(ultimo==datos.fecha[i]){
				console.log(i,datos.fecha[i]);
				var mark_Ubicacion=L.marker([datos.latitud[i], datos.longitud[i]]);
				map.addLayer(mark_Ubicacion);
				mark_Ubicacion.bindPopup('<b>HORA DE LOCALIZACION</b><p>'+datos.hora[i]+'</p>');
			}
		}
	});
}
$(document).on('ready', onDocumentReady);
	/*var socket=io();
	$("#enviar_btn").click(function(event){
		var valor = $('#msn_numero').val();
		socket.emit("numero",valor);
		console.log(valor);
	});
	socket.on("response",function(r){
		alert("numero enviado");
	});*/

// map.on('click', function(e) {         CLICK PARA SACAR LATITU Y LONGITUD
	// 	var aux="["+e.latlng.lat+","+e.latlng.lng+"]";
	// 	console.log(aux);
	// });

// var greenIcon = L.icon({  MARKER
// 			    iconUrl: '/images/marker2-icon.png',
// 			    shadowUrl: '/images/marker-shadow.png',
// 			    iconSize:     [38, 95], // size of the icon
// 			    shadowSize:   [27, 37], // size of the shadow
// 			    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
// 			    shadowAnchor: [4, 62],  // the same for the shadow
// 			    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
// 			});
// 			L.marker([-19.582641500873358, -65.75748682022095], {icon: greenIcon}).addTo(map);
// 			console.log(cii);