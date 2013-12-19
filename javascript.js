$(document).ready( function() {
	
	$("body").on('click', '#removeURL', function() {
		removeURL();
		$("#history").hide();
	});
	
	$("input.url").click( function() {
		$("#history").toggle();
	});
	
	$("body").on('click', '#history li', function() {
		var url = $(this).text();
		$("input.url").val(url);
		$("#history").hide();
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
	    	url: url,
	    	error: function(){
				$("p.error").text("This is not a valid URL.");
			},
	        success: function(data){
	        	$("p.error").text("");
	        	$("code").text(data);

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
	
	//Properly done down there
	//$("header").append('<nav id="history"><ul></ul><p id="removeURL">Delete URLs</p></nav>');
	$('header')
	.append($('<nav>').attr('id','history')
			.append($('<ul>'))
			.append($('<p>').attr('id','removeURL').text('Delete URLs'))
		   )
	
	for(var i=0; i < urlList.length; i++) {
		
		//$("#history ul").append('<li>'+ urlList[i] +'</li>');
		$("#history ul").append($('<li>').text(urlList[i]));
	}
	
}


function urlencode(str) {
    return escape(str.replace(/%/g, '%25').replace(/\+/g, '%2B')).replace(/%25/g, '%');
}
