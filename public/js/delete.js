	
$('.btn-delete-url').on('click', function(event){
	var temp = $(this).attr('_id');
	var url_del = '/tinyurl/del/'+temp;

	event.preventDefault(); 
	location.replace(url_del);

});