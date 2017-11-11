	
$('.btn-delete-url').on('click', function(event){
	var temp = $(this).attr('_id');
	var url_del = '/tinyurl/del/'+temp;

	event.preventDefault(); 
	location.replace(url_del);

});

	
$('.btn-graph-url').on('click', function(event){
	var temp = $(this).attr('_id');
	var url_graph = '/tinyurl/graph/'+temp;

	event.preventDefault(); 
	window.open(url_graph);
});