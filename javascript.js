$(document).ready(function () {

	getURL();


	$("body").on('click', '#removeURL', function () {
		deleteHistory();
		$("#history").hide();
	});


	$("input.url").click(function (event) {
		event.stopPropagation();
		$("#history").toggle();
	});


	$("body").on('click', '#history li', function () {
		var url = $(this).text();
		$("input.url").val(url);
		$("#history").hide();
		reloadResultFromURL(url);
	});


	$("body").on('click', '#history', function (event) {
		event.stopPropagation();
	});


	$("input.url").bind('paste', function (e) {
		setTimeout(function () {
			var url = e.target.value;
			reloadResultFromURL(url);
		}, 0)
	});


	$("html").click(function () {
		$("#history").hide();
	});


	$("form input, form textarea").change(function () {
		reloadResult();
	});


	$("header a").click(function () {
		event.preventDefault();
		search();
	});
	
	$("tr td:first-child").mouseover( function () {
    	var value = $(this).attr("data-info");
    	if(value != null) {
    	    var box = "<td class='info'><div>"+ value +"</div></td>";
            $(this).parent().append(box);
        }
	});
	
	$("tr td:first-child").mouseleave( function () {
    	$("td.info").remove();
	});

	setLabel();
	$('.checkbox').on('change', 'input', setLabel)
});


function reloadResult() {
	var url = 'http://localhost:8983/solr/select?indent=on&version=2.2';
	//For each input adds a get property to the query url
	$("form input").each(function () {
		if ($(this).val() != "") {
			url = url + '&' + $(this).attr("class") + '=' + urlencode($(this).val());
		}
		
	});
	
	if ($("form textarea.custom").val() != "") {
	
	    console.log("test");
	    var custom = URLToArray($("form textarea.custom").val());
	    
	    for (var i = 0; i < custom.length; i++) {
    	    url = url + '&' + custom[i]['key'] + '=' + urlencode(custom[i]['value'].replace(/\s/g, ""));
	    }
	}

	$("input.url").val(url);

	$.ajax({
		dataType: "text",
		url: url,
		error: function () {
			$("p.error").text("This is not a valid URL.");
		},
		success: function (data) {
			$("p.error").text("");
			$("code").text(data);

			if (data[0] == "<") {
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
	
	var custom = "";
	
	for (var i = 0; i < search.length; i++) {
	    
	    var finded = false; 
	    
	    if(search[i]['key'] == 'indent' || search[i]['key'] == 'version') {
    	    finded = true;
	    }
	    
	    $("form input").each(function () {
		    var param = $(this).attr('class');
		    if(param == search[i]['key']) {
    		    $(this).val(urldecode(search[i]['value']));
    		    finded = true;
		    }
        });
        
        if(!finded) {
            if(custom == "") {
    	        custom = custom + search[i]['key'] + '=' + search[i]['value'];
            } else {
                custom = custom + '\n&\n' + search[i]['key'] + '=' + search[i]['value'];
            }
        }
	}
	
	$("form textarea.custom").html(custom);

	reloadResult();
	

}

function getParameterByName( name,href )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( href );
  if( results == null )
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}


function URLToArray(url) {
	var request = [];
	var pairs = url.substring(url.indexOf('?') + 1).split('&');
	for (var i = 0; i < pairs.length; i++) {
		var pair = pairs[i].split('=');
		var param = [];
		
		var key = decodeURIComponent(pair[0])
		key = key.replace(/\s+/g, '');
		
		param['key'] = key;
		param['value'] = decodeURIComponent(pair[1]);
		request[i] = param;
	}
	return request;
}


function search() {
	var url = 'http://localhost:8983/solr/select?indent=on&version=2.2';

	$("form input").each(function () {
		if ($(this).val() != "") {
			url = url + '&' + $(this).attr("class") + '=' + urlencode($(this).val());
		}
	});
	
	if ($("form textarea.custom") != "") {
    	url = url + '&' + $("form textarea.custom").val();
	}

	window.location.href = url;
}


function saveURL(url) {

	var urlList = localStorage.getItem("urlSolr");

	if (urlList == null) {
		urlList = [];
	} else {
		urlList = JSON.parse(urlList);
	}

	for (var i = 0; i < urlList.length; i++) {
		if (urlList[i] == url) {
			urlList.splice(i, 1);
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

	if (urlList == null) {
		urlList = [];
	} else {
		urlList = JSON.parse(urlList);
	}

	urlList.reverse();

	$("header nav").remove();

	$('header')
		.append($('<nav>').attr('id', 'history')
			.append($('<ul>'))
			.append($('<p>').attr('id', 'removeURL').text('Delete URLs'))
	)

	for (var i = 0; i < urlList.length; i++) {
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

function urldecode(str) {
	return str.replace(/\+/g, " ");
}



//toggle the displayed label
function setLabel() {
	switch ($('.checkbox input:checked').val()) {
	case 'short':
		$('form .l, form .f').each(function () {
			$(this).hide(400)
		})
		$('form .s').each(function () {
			$(this).show(400)
		})
		break;
	case 'long':
		$('form .s, form .f').each(function () {
			$(this).hide(400)
		})
		$('form .l').each(function () {
			$(this).show(400)
		})
		break;
	case 'full':
		$('form span').each(function () {
			$(this).show(400)
		})
		break;
	}
}