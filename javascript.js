$(document).ready( function() {
	$("a").click( function() {
		event.preventDefault();
		
		var url = 'http://localhost:8983/solr/select?indent=on&version=2.2';
		
		$("form input").each( function() {
			//console.log(this);
			if($(this).val() != "") {
				url = url + '&' + $(this).attr("class") + '=' + urlencode($(this).val());
			}
		});
		
		window.location.href = url;
		
	});
	
	$("form input").change( function() {
		
		var url = 'http://localhost:8983/solr/select?indent=on&version=2.2';
		
		$("form input").each( function() {
			//console.log(this);
			if($(this).val() != "") {
				url = url + '&' + $(this).attr("class") + '=' + urlencode($(this).val());
			}
		});
		
		$("input.url").val(url);
		
		$.ajax({
	    	dataType: "xml",
	    	url: "proxy.php",
	    	data: {url: url},
	    	error: function(){
				$("p.error").text("This is not a valid URL.");
			},
	        success: function(data){
	        	$("p.error").text("");
	        	var xmlstr = data.xml ? data.xml : (new XMLSerializer()).serializeToString(data);
				//alert(xmlstr);
	        	$("code").text(xmlstr);
            Prism.highlightAll();
        	}
        });
        
	});

});



function urlencode(str) {
    return escape(str.replace(/%/g, '%25').replace(/\+/g, '%2B')).replace(/%25/g, '%');
}
