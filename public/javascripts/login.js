$(function(){
	var socket=io();
	$('#btnEnviarLogin').click(function(){
		var nombre=$('#nombre').val();
		var contras=$('#contraseña').val();
		if(nombre!=''&&contras!=''){
			var datos={nombre:nombre, contras:contras};
			socket.emit('Login',datos);
		}	
	});
	socket.on('LoginRespuesta',function(rows){

		if(rows.estado==true){
			if(rows.usuario[0].cargo=='Administrador'){
				localStorage.setItem('userinfo', JSON.stringify(rows.usuario[0]));
				location.href="MenuPrincipal";
			}
			else{
				$('.error').text('No corresponde acceder al sistema');
				$('.errorLogo').slideDown('fast');
			}
		}else{
			$('.error').text('NO EXISTE EL USUARIO');
			$('.errorLogo').slideDown('fast');
		}
		
		// 	
		// 	sessionStorage.setItem('CI',ci);
		// 	
		// }
		// else{
		// 	$('.error').text('verifique sus datos')
		// 	$('.errorLogo').slideDown('fast');
		// }
	});
})