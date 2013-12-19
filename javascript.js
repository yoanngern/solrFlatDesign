$(document).ready( function() {
	
	getURL();
	
	
	$("body").on('click', '#removeURL', function() {
		deleteHistory();
		$("#history").hide();
	});
	
	
	$("input.url").click( function(event) {
		event.stopPropagation();
		$("#history").toggle();
	});
	
	
	$("body").on('click', '#history li', function() {
		var url = $(this).text();
		$("input.url").val(url);
		$("#history").hide();
		reloadResultFromURL(url);
    });
	
	
	$("body").on('click', '#history', function(event) {
    	event.stopPropagation();
	});
	
	
	$("input.url").bind('paste', function(e) {
	    setTimeout(function() {
            var url = e.target.value;
            reloadResultFromURL(url);
        }, 0)
    });
	
	
	$("html").click( function() {
    	$("#history").hide();
	});
	
	
	$("form input").change( function() {		
		reloadResult();
	});
	
	
	$("header a").click( function() {
		event.preventDefault();
		search();
	});

});


function reloadResult() {
	var url = 'http://localhost:8983/solr/select?indent=on&version=2.2';
		
	$("form input").each( function() {
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
}


function reloadResultFromURL(url) {
    var search = URLToArray(url);
    
    console.log(search);
    
    $("form input").each( function() {
        var param = $(this).attr('class');
        console.log(search[param]);
        $(this).val(search[param]);
    });
    
    reloadResult();
    
}


function URLToArray(url) {
  var request = {};
  var pairs = url.substring(url.indexOf('?') + 1).split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return request;
}


function search() {
    var url = 'http://localhost:8983/solr/select?indent=on&version=2.2';
		
	$("form input").each( function() {
		if($(this).val() != "") {
			url = url + '&' + $(this).attr("class") + '=' + urlencode($(this).val());
		}
	});
	
	window.location.href = url;
}


function saveURL(url) {
	
	var urlList = localStorage.getItem("urlSolr");
	
	if(urlList == null) {
		urlList = [];
	} else {
		urlList = JSON.parse(urlList);
	}
	
	for(var i=0; i < urlList.length; i++) {
    	if(urlList[i] == url) {
            urlList.splice(i,1);
    	}
	}
	
	var id = urlList.length;
	
	var list = [];
	list = urlList;
	list[id] = url;
	
	localStorage.setItem("urlSolr", JSON.stringify(list));
    
}


function getURL() {
	
	var urlList = localStorage.getItem("urlSolr");
	
	if(urlList == null) {
		urlList = [];
	} else {
		urlList = JSON.parse(urlList);
	}
	
	urlList.reverse();
	
	$("header nav").remove();
	
	$('header')
	.append($('<nav>').attr('id','history')
			.append($('<ul>'))
			.append($('<p>').attr('id','removeURL').text('Delete URLs'))
		   )
	
	for(var i=0; i < urlList.length; i++) {
		$("#history ul").append($('<li>').text(urlList[i]));
	}
	
}


function deleteHistory() {
	localStorage.removeItem("urlSolr");
	
	$("header nav").remove();
	
}


function urlencode(str) {
    return escape(str.replace(/%/g, '%25').replace(/\+/g, '%2B')).replace(/%25/g, '%');
}
