$(document).ready( function() {
	
	$("#removeURL").click( function() {
		removeURL();
	});
	
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
	    	dataType: "text",
	    	url: "proxy.php",
	    	data: {url: url},
	    	error: function(){
				$("p.error").text("This is not a valid URL.");
			},
	        success: function(data){
	        	$("p.error").text("");
	        	$("code").text(data);

            console.log(data[0]);
            if(data[0] == "<") {
              $("code").attr("class", "language-markup");
            } else {
              $("code").attr("class", "language-javascript");
            }
            Prism.highlightAll();
        	}
        });
        
        saveURL(url);
        getURL();
        
	});

});


function saveURL(url) {
	
	var urlList = localStorage.getItem("urlSolr");
	
	if(urlList == null) {
		urlList = [];
	} else {
		urlList = JSON.parse(urlList);
	}
	
	var id = urlList.length;
	
	var list = [];
	list = urlList;
	list[id] = url;
	
	localStorage.setItem("urlSolr", JSON.stringify(list));
    
}


function removeURL() {
	localStorage.removeItem("urlSolr");
}


function getURL() {
	
	var urlList = localStorage.getItem("urlSolr");
	
	if(urlList == null) {
		urlList = [];
	} else {
		urlList = JSON.parse(urlList);
	}
	
	console.log(urlList);
	
}


function urlencode(str) {
    return escape(str.replace(/%/g, '%25').replace(/\+/g, '%2B')).replace(/%25/g, '%');
}
