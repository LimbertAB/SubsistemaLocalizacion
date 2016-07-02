var nombreAvatar;
var ciAvatar;
var trid;
$(function(){ 
	var socket=io();
	var Principal=$(location).attr('href');
	if(Principal=='http://localhost:5000/MenuPrincipal'){
		socket.emit('notificaciones');  //envia un alerta para listar NOTIFICACIONES
	}
	var miCi=sessionStorage.getItem("CI");
	socket.emit('ConectarUsuario',miCi);
	$(".avatarrr a").remove();var nombreAvaa=sessionStorage.getItem("Nombre")+'..';$('.avatarrr').append('<a class="dropdown-toggle avatarNombre" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">'+nombreAvaa+'<span class="glyphicon glyphicon-user" aria-hidden="true"></span></a><ul class="dropdown-menu" aria-labelledby="dropdownMenu1"><li><a href="#">Salir</a></li></ul>');var confirmacion=$('.h1Success').text();
	if(confirmacion!=''){
		$(".ventanaModal").slideDown('slow');
	}
	$("#botonImg").change(function(){
        var nombree=($(this).val()).toString();var tamano=nombree.length;
        if(tamano>24){
        	var total=nombree.substring(12,18);total=total+'..';var formato=nombree.substring(tamano-4,tamano);total=total+formato;$('.nombreImg').text(total);
        }else{
        	var total=nombree.substring(12,tamano);$('.nombreImg').text(total);
        }
    });
	$(".btnSuccess").click(function(event){
		$(".ventanaModal").slideUp('fast');
	});
	$(".btnEnviarRegistro").click(function(){
		var nombreE = $('.nombreR').val();var apellidoE = $('.apellidoR').val();var contraseñaE = $('.contrasR').val();var cargoE = $('.cargoR').val();var domicilioE = $('.domicilioR').val();
		if(nombreE==''){
			$("#mensaje1").fadeIn( "slow" );
			return false;
		}
		else{
			$("#mensaje1").fadeOut( "slow" );
			if(apellidoE==''){
				$("#mensaje2").fadeIn( "slow" );
				return false;
			}
			else{
				$("#mensaje2").fadeOut( "slow" );
				if(contraseñaE==''){
					$("#mensaje3").fadeIn( "slow" );
					return false;
				}
				else{
					$("#mensaje3").fadeOut( "slow" );
					if(cargoE==''){
						$("#mensaje4").fadeIn( "slow" );
						return false;
					}
					else{
						$("#mensaje4").fadeOut( "slow" );
						if(domicilioE==''){
							$("#mensaje5").fadeIn( "slow" );
							return false;
						}
					}
				}
			}
		}
	});
	var nombres = $('.app').text()+',';var total=''; totalCompleto=[];
	if(nombres!=''){
		for (var i = 0 ; i < nombres.length; i++) {
			if(nombres[i]!=','){
				total=total+nombres[i];
			}
			else{
				totalCompleto.push(total);total='';
			}
		}
	}
	$('.buscador').keyup(function(){  //algoritmo para buscar personal
		var valorTeclado=$(this).val();$("#resultado").slideDown('fast');$("#resultado p").remove();$("#resultado img").remove();$("#resultado").removeClass('imagen');
		if(valorTeclado.length>0){
			for (var i = 0; i < totalCompleto.length; i++) {  //{Limbert Arando, Beto Vargas, Jimena Cruz, Lim Fee}
				var nombresolo=totalCompleto[i]; // nombresolo=Limbert Arando[0]
				//console.log('aqui nombress', nombresolo); //la
				var aux=0; var aux2=0;
				for (var k = 0; k <=nombresolo.length; k++) {  // 0 < 14   valorteclado[0]    L[0], i[1], m[2], ......
					if (aux==0){
						if(aux2<valorTeclado.length){  //lim   0 < 3
							var ascciNombre=nombresolo[k].charCodeAt();   //L=766
							var ascciTeclado=valorTeclado[aux2].charCodeAt(); //l=108  
							//console.log(ascciTeclado-32);
							if(ascciNombre<ascciTeclado){
								if((ascciNombre==ascciTeclado) || (ascciNombre==ascciTeclado-32)){ //for (var j = 0; j < valorTeclado.length; j++) { //arand =5
									aux2++;
								}
								else{aux=1;aux2=0;}
							}
							else{
								if((ascciNombre==ascciTeclado) || (ascciNombre-32==ascciTeclado)){ //for (var j = 0; j < valorTeclado.length; j++) { //arand =5
									aux2++;
								}
								else{aux=1;aux2=0;}
							}
						}
						else{
							$("#resultado").append( "<p class = "+i+" data-toggle='modal' data-target='#myModal'>"+nombresolo+"</p>" );
							aux=3;					
						}
					}			
					else{
						if (nombresolo[k] == ' ' && aux != 3){
							aux=0;
						}
					}
				}
			}
		}
		$( "#resultado p" ).click(function(){
				console.log('click al p');
				trid = $(this).attr('class');
				clickTabla();
		});
		// $("#resultado").addClass('imagen');$("#resultado.imagen").append('<img src="../images/loading.gif">');	
	});
	$('.tablaV tr').click(function(){
		trid = $(this).closest('tr').attr('id');clickTabla();
	});
	function clickTabla(){
		var controlador=0;
    	var ci=$('#'+trid+' '+'#ciT').text();var nombres=$('#'+trid+' '+'#nomT').text();var apellidos=$('#'+trid+' '+'#apeT').text();var cargos=$('#'+trid+' '+'#cargT').text();var domicilios=$('#'+trid+' '+'#domT').text();var telefonos=$('#'+trid+' '+'#telT').text();$('.nomC').text(nombres);$('.apC').text(apellidos);$('.carC').text(cargos);$('.domC').text(domicilios);$('.telC').text(telefonos);
    	$("#resultado").slideUp('fast');$(".User input").slideUp('fast');$(".User p").slideDown('fast');$('.edit').val('Editar');$('.edit').text('Editar');	$('.edit').removeClass('disabled');
		$(".edit").click(function(event){
			var aux2=$('.edit').val();
			if(aux2=='Editar'){
				Norig=$('.nomC').text(); $('.n').val(Norig);Aorig=$('.apC').text(); $('.a').val(Aorig);Corig=$('.carC').text(); $('.c').val(Corig);Dorig=$('.domC').text(); $('.d').val(Dorig);Torig=$('.telC').text(); $('.t').val(Torig);
				$(".User input").toggle(5);$(".titModalUser").css("display", "none");$('.edit').val('Guardar Cambios');$('.edit').text('Guardar Cambios');$('.edit').addClass('disabled');
			}
			else{
				if(aux2=='Guardar Cambios'){
					if(controlador==1){
						console.log('entro');
						var no=$('.n').val();var ap=$('.a').val();var ca=$('.c').val();var dom=$('.d').val();var tel=$('.t').val();
						var valores={"ci":ci,"nick":no,"nombres":ap,"cargo":ca,"domicilio":dom,"telefono":tel};
						socket.emit('ActualizarUsuarios',valores);
					}
				}
			}
		});
		$(".User input").keyup(function(){
			if(($('.n').val()!=Norig) || ($('.a').val()!=Aorig) || ($('.c').val()!=Corig) || ($('.d').val()!=Dorig) || ($('.t').val()!=Torig)){
				$('.edit').removeClass('disabled');
				controlador=1;
			}
			else{
				$('.edit').addClass('disabled');
			}
		});
	}
	var auuu=$('.dirImagen').text();
	if(auuu!=''){
		var direccionImg=$('.dirImagen').text();// F:/fmdskf/sfa
		console.log('otra direccion'+direccionImg);
		var direction='http://192.168.43.81:5000/';
		for (var i = 0; i <direccionImg.length; i++) {
			direction=direction+direccionImg[i];
		};
		var almacenar=sessionStorage.getItem("CI");
		var noticia=sessionStorage.getItem("mensaje");
		var valor={noticia:noticia,ci:almacenar,direccion:direction}
		console.log('la nueva notificacion: ', noticia,almacenar,direction);
		$('.dirImagen').text('');
		socket.emit("nuevaNoticia",valor);
	}
	socket.on("NotificacionResponse",function(r){
		$(".cajaNoticia").remove();
		$(".cajaPosicion").remove();
		$(".cajaNoticia strong").remove();
		$(".cajaNoticia span").remove();
		$(".cajaNoticia p").remove();
		$(".imagenNoti").remove();
		var img=r.direccionImg;
		var imagenesTotal=[];
		var img2="src='";
		for(var j=0;j<img.length;j++){
			var palabra=img[j].toString();
			for(var k=0;k<palabra.length;k++){
				img2=img2+palabra[k];
			}
			img2=img2+"'";
			imagenesTotal.push(img2);
			img2="src='";
		}
		for(var i=r.nombre.length-1; i>=0; i--){
			$(".noticias").append( '<div class=cajaNoticia><div class=cajaPosicion><strong>'+r.nombre[i]+'</strong><span>'+r.cargo[i]+' </span><span class=fecha>'+r.fecha[i]+'</span><p>'+r.descripcion[i]+'</p><img class=imagenNoti '+imagenesTotal[i]+'></div></div>');
		}
	});
	$('#btnNoticiaNew').click(function(){
		var mensaje=$('#textNoticiaNew').val();
		sessionStorage.setItem('mensaje',mensaje);
	});
	$('.buscador').focus(function(){
		$('#resultado p').css('display','block');
	});
	$('.buscador').blur(function(){
		$( "#resultado p" ).click(function(){
			trid = $(this).attr('class');
			$('#resultado p').css('display','none');
			clickTabla();
		});
	});
})