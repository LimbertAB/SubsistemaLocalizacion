var nombreAvatar;
var ciAvatar;
var trid;
$(function(){ 
	var socket=io();
	
	var miCi=sessionStorage.getItem("CI");
	socket.emit('ConectarUsuario',miCi);
	$(".avatarrr a").remove();var nombreAvaa=sessionStorage.getItem("Nombre")+'..';$('.avatarrr').append('<a class="dropdown-toggle avatarNombre" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" style="padding-left:0;padding-right:0;">'+nombreAvaa+'<span class="glyphicon glyphicon-user" aria-hidden="true"></span></a><ul class="dropdown-menu" aria-labelledby="dropdownMenu1"><li><a href="#">Salir</a></li></ul>');var confirmacion=$('.h1Success').text();
	if(confirmacion!=''){
		$(".ventanaModal").slideDown('slow');
	}
//___________________ REGISTRO NUEVO USUARIO_____________________

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
	$('.cargoSistemaR').change(function(){if($(this).val()!='Seleccione Cargo'){if($(this).val()=='Encargado de Residencia'){$('.form7').css('display','block');$(".btnEnviarRegistro").addClass('disabled');}else{$('.form7').css('display','none');}$('.form6').removeClass('has-error');$('.form6').addClass('has-success');$(this).removeClass('glyphicon-remove');$(this).addClass('glyphicon-ok');}else{$('.form7').css('display','none');$('.form6').removeClass('has-success');$('.form6').addClass('has-error');$(this).removeClass('glyphicon-ok');$(this).addClass('glyphicon-remove');}});
	
	//SELECCIONAR RESIDENCIA EN CASO DE QUE USUARIO SEA ENCARGADO DE RESIDENCIA
	$('.ResidenciaR').change(function(){if($(this).val()!='Seleccione Residencia'){$('.form7').removeClass('has-error');$('.form7').addClass('has-success');$(this).removeClass('glyphicon-remove');$(this).addClass('glyphicon-ok');}else{$('.form7').removeClass('has-success');$('.form7').addClass('has-error');$(this).removeClass('glyphicon-ok');$(this).addClass('glyphicon-remove');}});

	//CONTROLAR IMPUT DE DOMICILIO
	$('.domicilioR').keyup(function(){if($(this).val().length>5){$('.form8').removeClass('has-error');$('.form8').addClass('has-success');$('.span8').removeClass('glyphicon-remove');$('.span8').addClass('glyphicon-ok');}else{$('.form8').removeClass('has-success');$('.form8').addClass('has-error');$('.span8').removeClass('glyphicon-ok');$('.span8').addClass('glyphicon-remove');}});
	
	//CONTROLA CAMPOS IMPUT PARA HABILITAR EL BOTON ENVIAR REGISTRO
	$('.formulariosRegistro').change(function(){var aux=0;for(var i=1;i<9;i++){if($(".form"+i+"").hasClass("has-success")){aux++;}}if(aux>6){if($(".form7").css("display")=='none'){$(".btnEnviarRegistro").removeClass('disabled');}else{if(aux==8){$(".btnEnviarRegistro").removeClass('disabled');}else{$(".btnEnviarRegistro").addClass('disabled');}}}else{$(".btnEnviarRegistro").addClass('disabled');}});
	
	//ENVIAR REGISTRO DE NUEVO USUARIO
	$(".btnEnviarRegistro").click(function(){if($(this).hasClass('disabled')){return false;}else{return true;var $btn = $(this).button('loading');}});
	
	//UNA VEZ REGISTRADO EL USUARIO LANZAMOS EL MODAL CON EL RESULTADO
	if($('.resultadoRegistro').text()!=''){$('.closeModalfondo').addClass('modal-backdrop fade in');$('.modalRegistro').css('display','block').slideDown('fast');if($('.resultadoRegistro').text()=='true'){$('.modalRegistroResult').css('background','#36C598');$(".imagenRegistro").attr("src","/images/success.png");$('.registroEstado').text('Registro Satisfactorio').css('color','#36C598');$('.registroDescripcion').text('El usuario se registro Correctamente..');}else{$('.modalRegistroResult').css('background','#DD4A4A');$(".imagenRegistro").attr("src","/images/failed.png");$('.registroEstado').text('Registro Fallido').css('color','#DD4A4A');$('.registroDescripcion').text('El usuario no se pudo registrar Correctamente..');}}
	
	//CERRAMOS MODAL DE REGISTRO DE USUARIOS
	$('.cerrarmodalRegistro').click(function(){$('.modalRegistro').slideUp('fast');$('.closeModalfondo').removeClass('modal-backdrop fade in');});
//________________________________________________


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
//___________________ NOTIFICACIONES____________________ //

	var Principal=$(location).attr('href');
	if(Principal=='http://localhost:5000/MenuPrincipal'){
		socket.emit('notificaciones');  //envia un alerta para listar NOTIFICACIONES
	}
    var nombreImgNoti='';
    $("#botonImg").change(function(){
        nombreImgNoti=($(this).val()).toString();var tamano=nombreImgNoti.length;
        if(tamano>24){
        	var total=nombreImgNoti.substring(12,18);total=total+'..';var formato=nombreImgNoti.substring(tamano-4,tamano);total=total+formato;$('.nombreImg').text(total);
        }else{
        	var total=nombreImgNoti.substring(12,tamano);$('.nombreImg').text(total);
        }
    });
	var auuu=$('.dirImagen').text();
	if(auuu!=''){
		var almacenar=sessionStorage.getItem("CI");
		var noticia=sessionStorage.getItem("mensaje");
		var direccionImg=$('.dirImagen').text();// F:/fmdskf/sfa
		console.log('otra direccion'+direccionImg);
		var direction='http://192.168.1.70:5000/';
		for (var i = 0; i <direccionImg.length; i++) {
			direction=direction+direccionImg[i];
		};
		var valor={noticia:noticia,ci:almacenar,direccion:direction}
		console.log('la nueva notificacion: ', noticia,almacenar,direction);
		$('.dirImagen').text('');
		socket.emit("nuevaNoticia",valor);
	}
	socket.on("NotificacionResponse",function(r){
		$('.dirImagen').remove('text');
		console.log($('.dirImagen').text(),'helio');
		sessionStorage.removeItem("mensaje");

		$(".cajaNoticia").remove();
		$(".cajaPosicionNoti").remove();
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
			$(".noticias").append( '<div class=cajaNoticia><div class=cajaPosicionNoti><strong>'+r.nombre[i]+'</strong><span>'+r.cargo[i]+' </span><span class=fechaNoti>'+r.fecha[i]+'</span><p>'+r.descripcion[i]+'</p><img class=imagenNoti '+imagenesTotal[i]+'></div></div>');
		}
	});
	
	$('#textNoticiaNew').keyup(function(){
		var textoNoti=$(this).val();
		if(textoNoti.length>10){
			$('#btnNoticiaNew').removeClass('disabled');
		}
		else{
			$('#btnNoticiaNew').addClass('disabled');
		}
		$('#btnNoticiaNew').click(function(){
			if(textoNoti.length>10){
				var mensaje=$('#textNoticiaNew').val();
				sessionStorage.setItem('mensaje',mensaje);
				if(nombreImgNoti==''){
					var almacenar=sessionStorage.getItem("CI");
					var valor={noticia:mensaje,ci:almacenar}
					socket.emit("nuevaNoticia",valor);
				}
				else{
					
				}
				return false;
			}
			else{
				return false;
			}
		});

	});
//_______________________FIN NOTIFICACIONES______________

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