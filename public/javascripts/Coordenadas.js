$(function(){
    var mapa;
    google.maps.event.addDomListener(window, 'load', inicializar);
    function inicializar() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(mostrarLocalizacion,errores); 
        }
        else{
            alert("Su navegador no soporta Geolocalizacion"); 
        }
    }
    function mostrarLocalizacion(posicion) {
        var pos = new google.maps.LatLng(posicion.coords.latitude,posicion.coords.longitude);
        console.log(posicion.coords.latitude,posicion.coords.longitude);
    }
    function errores (error) {
        alert('Ha ocurrido un error al intentar obtener la información');
    }
})