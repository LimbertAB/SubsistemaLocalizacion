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
		var nombre=rows.nombre;
		var ci=rows.ci;
		var estado=rows.estado;
		console.log(rows.nombre,rows.estado,rows.estado);
		if(estado==true){
			sessionStorage.setItem('Nombre',nombre);
			sessionStorage.setItem('CI',ci);
			location.href="http://localhost:5000/MenuPrincipal";
		}
		else{
			$('.error').text('verifique sus datos')
			$('.errorLogo').slideDown('fast');
		}
		console.log(rows);
	});
})