$('.btn-shorten').on('click', function(){
	$.ajax({
		url: '/shorten',
		type: 'POST',
		dataType: 'JSON',
		data: {url: $('#url-field').val()},
		success: function(data){

			if(data.errorMsg){
				
				var resultHTML = 'The entered text is not a valid url.';

				$('#link').html(resultHTML);
				$('#link').hide().fadeIn('slow');
			}else{
				
				var resultHTML = '<a class="result" href="' + data.shortUrl + '">'
				+ data.shortUrl + '</a>';

				$('#link').html(resultHTML);
				$('#link').hide().fadeIn('slow');
			}		

		}
	});
});
