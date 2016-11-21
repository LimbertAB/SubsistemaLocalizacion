$(function(){
	var socket=io();
	/*___________________________________________________________________
                             MENSAJERIA                       
_____________________________________________________________________*/
	//CLICK BOTON MENSAJES...............
	var aux=JSON.parse(localStorage.getItem('userinfo'));
	var MiCi=aux.idusuario;

	$('#btnMensajes').click(function(){
		$("#myModal .modal-header").remove();$("#myModal .modal-body").remove();$("#myModal .modal-header h4").remove();$("#myModal .btnNuevoMensaje").remove();$(".listasMensajes").remove();$("#myModal .modal-header a").remove();$("#myModal .modal-header h3").remove();$(".modal-header button").remove();$(".modal-header input").remove();$("#myModal").remove();$("#myModal .modal-dialog").remove();$("#myModal .modal-content").remove();
		
		$('body').append('<div id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" class="modal fade"><div role="document" class="modal-dialog"><div class="modal-content"><div class="modal-header"></div><div class="modal-body PrincipalMensajes"><table class="table"></table></div><div class="modal-footer"></div></div></div></div>');
		$('#myModal .modal-header').append('<button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true">×</span></button><h4 class="modal-title col-md-5">Mensajes Directos</h4><button type="button" class="btn btn-primary col-md-3 col-md-offset-1 btnNuevoMensaje">Nuevo Mensaje</button></div>');
		socket.emit('ListaMisMensajes',MiCi);
	});
	socket.on('RespuestaMisMensajes',function(valores){
		console.log('....',valores);
		var nomb=[];var mensa=[];var fech=[];var ciss=[];var nom;var men;var fec;var CI;
		for(var i=valores.nombres.length-1;i>=0;i--){
			if(valores.nombres[i]!=''){
				nom=valores.nombres[i];CI=valores.cis[i];men=valores.mensajes[i];fec=valores.fechas[i];nomb.push(nom);ciss.push(CI);mensa.push(men);fech.push(fec);
				for(var j=i-1;j>=0;j--){
					if(valores.nombres[i]==valores.nombres[j]){
						valores.nombres[j]='';valores.mensajes[j]='';valores.fechas[j]='';valores.cis[j]='';
					}
				}
			}
		}
		$('#myModal .modal-body table').remove();$('.listasMensajes').remove();$('.unUsuarioMensajes').remove();
		$('.modal-footer textarea').remove();$('#myModal .modal-footer button').remove();$('#myModal .modal-footer div').remove();
		$('#myModal .modal-body').append('<div class="col-md-12 listasMensajes"></div>');
		for( var k=0;k<nomb.length;k++){
			$('.listasMensajes').append('<div class="row col-md-12 filaMensajes" id="'+ciss[k]+'"><div class="row col-md-12"><p class="nombresMensajes col-md-9">'+nomb[k]+'</p><p class="fechasMensajes col-md-3">'+fech[k]+'</p></div><div class="row col-md-12"><h5>'+mensa[k]+'</h5></div></div>');
		}
		$('.btnNuevoMensaje').click(function(){
			$("#myModal .modal-header h4").remove();
			$("#myModal .modal-header h3").remove();
			$(".btnNuevoMensaje").remove();
			$(".listasMensajes").remove();
			$("#myModal .modal-header input").remove();
			$('#myModal .modal-header').append('<a href="#" class="col-md-1" id="btnAtras2"><span aria-hidden="true" class="glyphicon glyphicon glyphicon-menu-left"></span></a><h4 class="col-md-3"><h3 class="modal-title">Nuevo Mensaje</h3></h4>');
			$('#myModal .modal-header').append('<input type="text" placeholder="Buscar Usuario" id="etBuscar" class="form-control"/>');
			$(".PrincipalMensajes").append('<div class="buscadorr"></div>');
			$('#etBuscar').keyup(function(){
				var valorTeclado=$(this).val();
				if(valorTeclado!=''){
					socket.emit('BuscadorUsuarios',valorTeclado);
				}
				else{
					$(".PrincipalMensajes table").remove();
				}
			});
			$('#btnAtras2').click(function(){
				$("#myModal .modal-header h4").remove();
				$("#myModal .modal-header a").remove();
				$("#myModal .modal-header h3").remove();
				$("#myModal .modal-header button").remove();
				$("#myModal .modal-header input").remove();
				$('#myModal .modal-header').append('<button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true">×</span></button><h4 class="modal-title col-md-5">Mensajes Directos</h4><button type="button" class="btn btn-primary col-md-3 col-md-offset-1 btnNuevoMensaje">Nuevo Mensaje</button></div>');	
				socket.emit('ListaMisMensajes',MiCi);
			});
		});
		$('.filaMensajes.row.col-md-12').click(function(){
			var ciUsuario=$(this).attr('id');var datos={mici:MiCi,suci:ciUsuario}
			console.log(datos);
			socket.emit('listaMensajesUnUsuario',datos);
		});	
	});
	socket.on('ListaMensajesUnUsuario',function(mensajes){
		$("#myModal .modal-header h4").remove();$(".btnNuevoMensaje").remove();$(".listasMensajes").remove();$("#myModal .modal-header a").remove();$("#myModal .modal-header h3").remove();
		$('.modal-footer textarea').remove();$('#myModal .modal-footer button').remove();$('#myModal .modal-footer div').remove();
		$('#myModal .modal-header').append('<a href="#" class="col-md-1" id="btnAtras"><span aria-hidden="true" class="glyphicon glyphicon glyphicon-menu-left"></span></a><h4 class="col-md-3"><h3 class="modal-title">Nuevo Mensaje</h3></h4>');
		$('#myModal .modal-body').append('<div class="col-md-12 unUsuarioMensajes"></div>');
		$('#myModal .modal-footer').append('<div class="col-md-12 footer"><textarea class="col-md-10 col-sm-12" rows="2" id="inputHelpBlock" aria-describedby="helpBlock" placeholder="Escribe un mensaje.."></textarea><div class="col-md-2"><button type="button" class="btn btn-primary col-md-11 col-md-offset-1 btnEnviarMensaje disabled">Enviar</button></div></div>')
		for( var k=0;k<mensajes.mensaje.length;k++){
			if(MiCi==mensajes.origen[k]){
				$('.unUsuarioMensajes').append('<div class="row col-md-10 col-md-offset-2"><div class="row col-md-12 filaorigen"><h5>'+mensajes.mensaje[k]+'</h5></div><div class="row col-md-12"><h6>'+mensajes.fecha[k]+'</h6></div></div>');
			}else{
				$('.unUsuarioMensajes').append('<div class="row col-md-10"><div class="row col-md-12 filadestino"><h5>'+mensajes.mensaje[k]+'</h5></div><div class="row col-md-12"><h6>'+mensajes.fecha[k]+'</h6></div></div>');
			}
		}
		$('#myModal #btnAtras').click(function(){
			$("#myModal .modal-header h4").remove();$("#myModal .modal-header a").remove();$("#myModal .modal-header h3").remove();$("#myModal .modal-header button").remove();$("#myModal .modal-header input").remove();
			$('#myModal .modal-header').append('<button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true">×</span></button><h4 class="modal-title col-md-5">Mensajes Directos</h4><button type="button" class="btn btn-primary col-md-3 col-md-offset-1 btnNuevoMensaje">Nuevo Mensaje</button></div>');	
			socket.emit('ListaMisMensajes',MiCi);
		});
		$('.modal-footer textarea').keyup(function(){
			var texto=$(this).val();
			if(texto!=''){
				$('.btnEnviarMensaje').removeClass('disabled');
			}
			else{
				$('.btnEnviarMensaje').addClass('disabled');
			}
		})
		$('.btnEnviarMensaje').click(function(){
			var Unmensaje=$('.modal-footer textarea').val();
			var now = new Date();
   			var outStr = now.getHours()+':'+now.getMinutes();
			$('.unUsuarioMensajes').append('<div class="row col-md-10 col-md-offset-2"><div class="row col-md-12 filaorigen"><h5>'+Unmensaje+'</h5></div><div class="row col-md-12"><h6>'+outStr+'</h6></div></div>');
			$('.modal-footer textarea').val('');
			var suCi=mensajes.ciDestino;
			var MensajeSolo={"origen":MiCi,"destino":suCi,"mensaje":Unmensaje};
			socket.emit("enviandoUnMensaje",MensajeSolo);			
		});
	});
	socket.on('RespuestaBuscador',function(valores){
		$(".tableB").remove();
		console.log(valores);
		console.log('estos son los resultados: ',valores.nombreCompleto.length);
		$('.buscadorr').append('<table class="table tableB"></table>');
		for(var i=0;i<valores.nombreCompleto.length;i++){
			$('.tableB').append('<tr class="'+valores.ci[i]+'"><td><h4>'+valores.nombreCompleto[i]+'</h4></td></tr>');
		}
		$('.tableB tr').click(function(){
			var ciUsuario=$(this).attr('class');
			var datos={mici:MiCi,suci:ciUsuario}
			$(".tableB").remove();
			$("#myModal .modal-header input").remove();
			socket.emit('listaMensajesUnUsuario',datos);
		});
	});
	socket.on('RespuestaMensajeSolo',function(DataMensaje){

	});
})