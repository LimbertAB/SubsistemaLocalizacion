$(function(){ 
	$('#mainNav').affix({offset: {top: 100}});

	
	$('#contentReports tr').click(function(){
		console.log($(this).attr('value'));
		PDFObject.embed("/pdf/"+$(this).attr('value')+".pdf", "#example1");
	});
	var options = {
	   fallbackLink: "<p>This is a <a href='[url]'>fallback link</a></p>"
	};
	PDFObject.embed("/pdf/patronesArquitectura.pdf", "#print", options);
	//PDFObject.embed("<p>Hola mundo</p>", "#print");
})