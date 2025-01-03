var stlib = stlib || {
  functions: [],
  functionCount: 0,
  util: {
    prop: function(p, obj) {
      if (obj) {
        return obj[p];
      }
      return function(o) { return o[p]; };
    }
  },
  dynamicOn: true,
  setPublisher : function(pubKey){
    stlib.publisher = pubKey;
  },
  setProduct : function(prod){
    stlib.product = prod;
  },
  parseQuery: function( query ) {
    var Params = new Object ();
    if ( ! query ) return Params; // return empty object
    var Pairs = query.split(/[;&]/);
    for ( var i = 0; i < Pairs.length; i++ ) {
       var KeyVal = Pairs[i].split('=');
       if ( ! KeyVal || KeyVal.length != 2 ) continue;
       var key = unescape( KeyVal[0] );
       var val = unescape( KeyVal[1] );
       val = val.replace(/\+/g, ' ');
       Params[key] = val;
    }
    return Params;
  },
  getQueryParams : function(){
    var buttonScript = document.getElementById('st_insights_js');
    if(buttonScript && buttonScript.src){
      var queryString = buttonScript.src.replace(/^[^\?]+\??/,'');
      var params = stlib.parseQuery( queryString );
      stlib.setPublisher ( params.publisher);
      stlib.setProduct( params.product);
    }
  }
};

stlib.global = {
  hash: stlib.util.prop('hash', document.location).substr(1)
};

// Extract out parameters
stlib.getQueryParams();
stlib.debugOn = false;
stlib.debug = {
	count: 0,
	messages: [],
	debug: function(message, show) {
		if (show && (typeof console) != "undefined") {
			console.log(message);
		} 
		stlib.debug.messages.push(message);
	},
	show: function(errorOnly) {
		for (message in stlib.debug.messages) {
			if ((typeof console) != "undefined") {
				if (errorOnly) {
					/ERROR/.test(stlib.debug.messages[message]) ? console.log(stlib.debug.messages[message]) : null;
				} else {
					console.log(stlib.debug.messages[message]);
				}
			} 
		}
	},
	showError: function() { 
		stlib.debug.show(true); 
	}
};

var _$d = function(message) {	stlib.debug.debug(message, stlib.debugOn); }
var _$d0 = function() { _$d(" "); };
var _$d_ = function() { _$d("___________________________________________"); };
var _$d1 = function(m) { _$d(_$dt() + "| " + m); };
var _$d2 = function(m) { _$d(_$dt() + "|  * " + m); };
var _$de = function(m) { _$d(_$dt() + "ERROR: " + m); };

var _$dt = function() { 
	var today=new Date();
	var h=today.getHours();
	var m=today.getMinutes();
	var s=today.getSeconds();
	return h+":"+m+":"+s+" > ";
};
stlib.validate = {
	regexes: {
		notEncoded:		/(%[^0-7])|(%[0-7][^0-9a-f])|["{}\[\]\<\>\\\^`\|]/gi,
		tooEncoded:		/%25([0-7][0-9a-f])/gi,
		publisher:		/^(([a-z]{2}(-|\.))|)[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
		url:			/^(http|https):\/\/([a-z0-9!'\(\)\*\.\-\+:]*(\.)[a-z0-9!'\(\)\*\.\-\+:]*)((\/[a-z0-9!'\(\)\*\.\-\+:]*)*)/i,
		fpc:			/^[0-9a-f]{7}-[0-9a-f]{11}-[0-9a-f]{7,8}-[0-9]*$/i,
		sessionID:		/^[0-9]*\.[0-9a-f]*$/i,
		title:			/.*/,
		description:	/.*/,
		buttonType:		/^(chicklet|vcount|hcount|large|custom|button|)$/, // TODO: verify, also, is blank ok.
		comment:		/.*/,
		destination:	/.*/, // TODO: check against all service (construct a regexp?)
		source:			/.*/, // TODO: Need to define this
		image:			/(^(http|https):\/\/([a-z0-9!'\(\)\*\.\-\+:]*(\.)[a-z0-9!'\(\)\*\.\-\+:]*)((\/[a-z0-9!'\(\)\*\.\-\+:]*)*))|^$/i,
		sourceURL:		/^(http|https):\/\/([a-z0-9!'\(\)\*\.\-\+:]*(\.)[a-z0-9!'\(\)\*\.\-\+:]*)((\/[a-z0-9!'\(\)\*\.\-\+:]*)*)/i,
		sharURL:		/(^(http|https):\/\/([a-z0-9!'\(\)\*\.\-\+:]*(\.)[a-z0-9!'\(\)\*\.\-\+:]*)((\/[a-z0-9!'\(\)\*\.\-\+:]*)*))|^$/i
	}
};

stlib.html = {
	encode : function(value) {
		if(stlib.html.startsWith(value, 'http')) {//URL check
			return String(value)
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#39;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;');		
		} else {
			return String(value)
				.replace(/&/g, '&amp;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#39;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;');
		}
	},
  
	startsWith : function(value, str) {
     return (value.match("^"+str)==str);
    }
};
/********************START COOKIE LIBRARY***********************/
/*
 * This handles cookies
 */
var tpcCookiesEnableCheckingDone = false;
var tpcCookiesEnabledStatus = true;

stlib.cookie = {
	setCookie : function(name, value, days) {
		var safari =(navigator.userAgent.indexOf("Safari") !=-1 && navigator.userAgent.indexOf("Chrome") ==-1);
		var ie =(navigator.userAgent.indexOf("MSIE") !=-1);

		if (safari || ie) {
			  var expiration = (days) ? days*24*60*60 : 0;

			  var _div = document.createElement('div');
			  _div.setAttribute("id", name);
			  _div.setAttribute("type", "hidden");
			  document.body.appendChild(_div);

			  var
			  div = document.getElementById(name),
			  form = document.createElement('form');

			  try {
				  var iframe = document.createElement('<iframe name="'+name+'" ></iframe>');
					//try is ie
				} catch(err) {
					//catch is ff and safari
					iframe = document.createElement('iframe');
				}

			  iframe.name = name;
			  iframe.src = 'javascript:false';
			  iframe.style.display="none";
			  div.appendChild(iframe);

			  form.action = "https://sharethis.com/account/setCookie.php";
			  form.method = 'POST';

			  var hiddenField = document.createElement("input");
			  hiddenField.setAttribute("type", "hidden");
			  hiddenField.setAttribute("name", "name");
			  hiddenField.setAttribute("value", name);
			  form.appendChild(hiddenField);

			  var hiddenField2 = document.createElement("input");
			  hiddenField2.setAttribute("type", "hidden");
			  hiddenField2.setAttribute("name", "value");
			  hiddenField2.setAttribute("value", value);
			  form.appendChild(hiddenField2);

			  var hiddenField3 = document.createElement("input");
			  hiddenField3.setAttribute("type", "hidden");
			  hiddenField3.setAttribute("name", "time");
			  hiddenField3.setAttribute("value", expiration);
			  form.appendChild(hiddenField3);

			  form.target = name;
			  div.appendChild(form);

			  form.submit();
		}
		else {
			if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
			} else {
				var expires = "";
			}
			var cookie_string = name + "=" + escape(value) + expires;
			cookie_string += "; domain=" + escape (".sharethis.com")+";path=/";
			document.cookie = cookie_string;
		}
	},
	setTempCookie : function(name, value, days) {
		if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
		} else {
				var expires = "";
		}
		var cookie_string = name + "=" + escape(value) + expires;
		cookie_string += "; domain=" + escape (".sharethis.com")+";path=/";
		document.cookie = cookie_string;
	},
	getCookie : function(cookie_name) {
	  var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
	  if (results) {
		  return (unescape(results[2]));
	  } else {
		  return false;
	  }
	},
	deleteCookie : function(name) {

		// For all browsers
		var path="/";
		var domain=".sharethis.com";
		document.cookie = name.replace(/^\s+|\s+$/g,"") + "=" +( ( path ) ? ";path=" + path : "")
				  + ( ( domain ) ? ";domain=" + domain : "" ) +";expires=Thu, 01-Jan-1970 00:00:01 GMT";


		// For Safari and IE
		var safari =(navigator.userAgent.indexOf("Safari") !=-1 && navigator.userAgent.indexOf("Chrome") ==-1);
		var ie =(navigator.userAgent.indexOf("MSIE") !=-1);

		if (safari || ie) {
			var _div = document.createElement('div');
			_div.setAttribute("id", name);
			_div.setAttribute("type", "hidden");
			document.body.appendChild(_div);

			var
			div = document.getElementById(name),
			form = document.createElement('form');

			try {
			  var iframe = document.createElement('<iframe name="'+name+'" ></iframe>');
				//try is ie
			} catch(err) {
				//catch is ff and safari
				iframe = document.createElement('iframe');
			}

			iframe.name = name;
			iframe.src = 'javascript:false';
			iframe.style.display="none";
			div.appendChild(iframe);

			form.action = "https://sharethis.com/account/deleteCookie.php";
			form.method = 'POST';

			var hiddenField = document.createElement("input");
			hiddenField.setAttribute("type", "hidden");
			hiddenField.setAttribute("name", "name");
			hiddenField.setAttribute("value", name);
			form.appendChild(hiddenField);

			form.target = name;
			div.appendChild(form);

			form.submit();
		}
	},
	deleteAllSTCookie : function() {
		var a=document.cookie;
		a=a.split(';');
		for(var i=0;i<a.length;i++){
			var b=a[i];
			b=b.split('=');

      // do not delete the st_optout cookie
			if(!/st_optout/.test(b[0])){
				var name=b[0];
				var path="/";
				var domain=".edge.sharethis.com";
				document.cookie = name + "=;path=" + path + ";domain=" + domain +";expires=Thu, 01-Jan-1970 00:00:01 GMT";
			}
		}
	},
	setFpcCookie : function(name, value) {
//		var name="__unam";
		var current_date = new Date;
		var exp_y = current_date.getFullYear();
		var exp_m = current_date.getMonth() + 9;// set cookie for 9 months into future
		var exp_d = current_date.getDate();
		var cookie_string = name + "=" + escape(value);
		if (exp_y) {
			var expires = new Date (exp_y,exp_m,exp_d);
			cookie_string += "; expires=" + expires.toGMTString();
		}
		var domain=stlib.cookie.getDomain();
		cookie_string += "; domain=" + escape (domain)+";path=/";
		document.cookie = cookie_string;
	},
	getFpcCookie : function(cookie_name) {
		var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
		if (results)
			return (unescape(results[2]));
		else
			return false;
	},
	getDomain : function() {
		var str = document.domain.split(/\./);
		var domain="";
		if(str.length>1){
			domain="."+str[str.length-2]+"."+str[str.length-1];
		}
		return domain;
	},
	checkCookiesEnabled: function() {
		if(!tpcCookiesEnableCheckingDone) {
			stlib.cookie.setTempCookie("STPC", "yes", 1);
			if(stlib.cookie.getCookie("STPC") == "yes") {
				tpcCookiesEnabledStatus = true;
			}else {
				tpcCookiesEnabledStatus = false;
			}
			tpcCookiesEnableCheckingDone = true;
			return tpcCookiesEnabledStatus;
		}else{
			return tpcCookiesEnabledStatus;
		}
	},
	hasLocalStorage: function() {
		try {
			localStorage.setItem("stStorage", "yes");
			localStorage.removeItem("stStorage");
			return true;
		} catch(e) {
			return false;
		}
	}
};
/********************END COOKIE LIBRARY***********************/
/*
 * This holds critical data, requires the cookie object
 */
if (typeof(stlib.data) == "undefined") {
	stlib.data = {
		bInit: false,
		publisherKeySet: false,
		pageInfo: {
		},
		shareInfo: {
		},
		resetPageData: function() {
			//stlib.data.pageInfo.publisher 		= "00-00-00"; // The publisher key as given by the publisher
			//stlib.data.pageInfo.fpc 			= "ERROR"; // The cookie set on the publisher's domain to track the user on that domain
			stlib.data.pageInfo.sessionID 		= "ERROR"; // The session on any given pageview with our widget on it
			//stlib.data.pageInfo.sourceURL		= "ERROR"; // The source domain
			stlib.data.pageInfo.hostname		= "ERROR"; // The source domain
			stlib.data.pageInfo.location		= "ERROR"; // The source domain
			stlib.data.pageInfo.product             = "widget";
			stlib.data.pageInfo.stid            = "";
		},
		resetShareData: function() {
			stlib.data.shareInfo = {};
			stlib.data.shareInfo.url 			= "ERROR"; // The url the service is sharing before any modification
			stlib.data.shareInfo.sharURL		= ""; // The shar url the service is sharing before any modification
			stlib.data.shareInfo.buttonType		= "ERROR"; // The button type that were clicked (hcount or vcount)
			stlib.data.shareInfo.destination	= "ERROR"; // The channel that is being shared to (facebook, twitter)
			stlib.data.shareInfo.source 		= "ERROR"; // The widget or code location that is generating the request
			//stlib.data.shareInfo.title 			= ""; // The title of the article as best as can be determined
			//stlib.data.shareInfo.image 			= ""; // The title of the article as best as can be determined
			//stlib.data.shareInfo.description 	= "";	   // The description of the article as best as can be determined
			//stlib.data.shareInfo.comment	 	= "";	   // The description of the article as best as can be determined
		},
		resetData: function() {
			stlib.data.resetPageData();
			stlib.data.resetShareData();
		},
		validate: function () {
			var regexes = stlib.validate.regexes;

			function validateHelp(key, value) {
				if (value != encodeURIComponent(value)) {
					regexes.notEncoded.test(value) ? _$de(key + " not encoded") : null;
					regexes.tooEncoded.test(value) ? _$de(key + " has too much encoding") :null;
				}
				var valueOk = regexes[key] ? regexes[key].test(decodeURIComponent(value)) : true;
				if (!valueOk) {
					_$de(key + " failed validation");
				}
			}

			var p = stlib.data.pageInfo;
			var param;
			for (param in p) {
				validateHelp(param, p[param])
			}
			p = stlib.data.shareInfo;
			for (param in p) {
				validateHelp(param, p[param])
			}

		},
		init: function() {
			if (!stlib.data.bInit) {
				stlib.data.bInit = true;
				stlib.data.resetData();
				stlib.data.set("fcmp", typeof(window.__cmp) == 'function', "pageInfo");
                              stlib.data.set("fcmpv2", typeof(window.__tcfapi) == 'function', "pageInfo");

				if(stlib.publisher){
					stlib.data.setPublisher(stlib.publisher);
				}
				stlib.data.set("product",stlib.product,"pageInfo");
				var rawUrl = document.location.href, refDomain = '', refQuery = '', referArray = [], currentRefer = '', cleanUrl = '', hashString = "",
					baseURL = '', sessionID_time = '', sessionID_rand = '';

				//Fix for WID-343
				referArray = stlib.data.getRefDataFromUrl(rawUrl);//get referrer data coming from share.es
				if(referArray.length > 0) {
					refDomain = (typeof(referArray[0]) != "undefined") ? referArray[0] : "";
					refQuery = (typeof(referArray[1]) != "undefined") ? referArray[1] : "";
					cleanUrl = stlib.data.removeRefDataFromUrl(rawUrl);//Remove referrer data from the URL.

					//Displays the modified(without referrer data parameter) or original URL in the address bar
					stlib.data.showModifiedUrl(cleanUrl);
					stlib.data.set("url", cleanUrl, "shareInfo");
				} else { //For old non-secure shar urls
					currentRefer = document.referrer;
					referArray = currentRefer.replace("http://", "").replace("https://", "").split("/");
					refDomain = referArray.shift();
					refQuery = referArray.join("/");

					stlib.data.set("url", rawUrl,"shareInfo");
				}
				// TODO add option to not use hash tag

        stlib.data.set("title", document.title, "shareInfo");

				if (stlib.data.publisherKeySet != true) {
					stlib.data.set("publisher","ur.00000000-0000-0000-0000-000000000000","pageInfo");
				}

				// no longer using fpc
				// stlib.fpc.createFpc();
				// stlib.data.set("fpc",stlib.fpc.cookieValue,"pageInfo"); // Requires that the cookie has been created

				sessionID_time = (new Date()).getTime().toString();
				sessionID_rand = Number(Math.random().toPrecision(5).toString().substr(2)).toString();
				stlib.data.set("sessionID",sessionID_time + '.' + sessionID_rand,"pageInfo");

				//stlib.data.set("sourceURL", document.location.href,"pageInfo");
				stlib.data.set("hostname", document.location.hostname,"pageInfo");
				stlib.data.set("location", document.location.pathname,"pageInfo");

				stlib.data.set("refDomain", refDomain ,"pageInfo");
				stlib.data.set("refQuery", refQuery,"pageInfo");
			}
		},
		//Fix for WID-343
		showModifiedUrl: function(modUrl) {
			if (window.history && history.replaceState)
				history.replaceState(null, document.title, modUrl);
			else if ((/MSIE/).test(navigator.userAgent)) {
				var ampInHashIndex = 0, hashString = window.location.hash, patt1 = new RegExp("(\&st_refDomain=?)[^\&|]+"),
					patt2 = new RegExp("(\#st_refDomain=?)[^\&|]+"), hRef = document.location.href;
				if(patt1.test(hRef)) {
					ampInHashIndex = hashString.indexOf('&st_refDomain');
					window.location.hash = hashString.substr(0, ampInHashIndex);
				} else if(patt2.test(hRef))
					window.location.replace("#");
			} else {
				document.location.replace(modUrl);
			}
		},
		//Fix for WID-343
		getRefDataFromUrl: function(url) {
			var patt = new RegExp("st_refDomain="), tempDomain = '', tempQuery = '', result = [];

			if(patt.test(url)) {
				tempDomain = url.match(/(st_refDomain=?)[^\&|]+/g);
				result.push(tempDomain[0].split('=')[1]);

				tempQuery = url.match(/(st_refQuery=?)[^\&|]+/g);
				result.push(tempQuery[0].replace('st_refQuery=', ''));
			}

			return result;
		},
		//Fix for WID-343
		removeRefDataFromUrl: function(url) {
			var urlWoRefdomain = '',
				obj = '',
				patt1 = new RegExp("(\&st_refDomain=?)[^\&|]+"),
				patt2 = new RegExp("(\#st_refDomain=?)[^\&|]+");

			if(patt1.test(url)) {
				urlWoRefdomain = url.replace(/\&st_refDomain=(.*)/g,'');
			} else if(patt2.test(url)) {
				urlWoRefdomain = url.replace(/\#st_refDomain=(.*)/g,'');
			} else {
				urlWoRefdomain = url;
			}

			return urlWoRefdomain;
		},
		setPublisher: function(publisherKey) {
			// TODO: Add Validation
			stlib.data.set("publisher",publisherKey,"pageInfo");
			stlib.data.publisherKeySet = true;
		},
		setSource: function(src, options) {
			// TODO: Add Validation
			var source = "";
			// Inside widget logging
			if (options) {
				if (options.toolbar) {
					source = "toolbar"+src;
				} else if (options.page && options.page != "home" && options.page != "") {
					source = "chicklet"+src;
				} else {
					source = "button"+src;
				}
			}
			// Outside widget logging
			else {
				// can be share5x, share4x, chicklet, fastshare, mobile
				source = src;
			}
			stlib.data.set("source",source,"shareInfo");
		},
		set: function(key, value, table) {
			if (typeof(value) == "number" || typeof(value) == "boolean") {
				stlib.data[table][key] = value;
			} else if (typeof(value) == "undefined" || value == null) {
			} else {
//				_$d1("Stripping HTML: " + key + ": " + value.replace(/<[^<>]*>/gi, " "));
//				_$d1("decodeURI: " + key + ": " + decodeURI(value.replace(/<[^<>]*>/gi, " ")));
//				_$d1("Escape percent: " + key + ": " + decodeURI(value.replace(/<[^<>]*>/gi, " ")).replace(/%/gi, "%25"));
//				_$d1("Decoding: " + key + ": " + decodeURIComponent(decodeURI(value.replace(/<[^<>]*>/gi, " ")).replace(/%/gi, "%25")));
//				_$d1("Encoding: " + key + ": " + encodeURIComponent(decodeURIComponent(decodeURI(value.replace(/<[^<>]*>/gi, " ")).replace(/%/gi, "%25"))));
				stlib.data[table][key] = encodeURIComponent(decodeURIComponent(unescape(value.replace(/<[^<>]*>/gi, " ")).replace(/%/gi, "%25")));
				// These might have url encoded data
				if (key=="url" /*|| key=="sourceURL"*/ || key=="location" || key=="image") {
					try {
						stlib.data[table][key] = encodeURIComponent(decodeURIComponent(decodeURI(value.replace(/<[^<>]*>/gi, " ")).replace(/%/gi, "%25")));
					} catch (e) {
						stlib.data[table][key] = encodeURIComponent(decodeURIComponent(unescape(value.replace(/<[^<>]*>/gi, " ")).replace(/%/gi, "%25")));
					}
				}
			}
		},
		get: function(key, table) {
			try {
				if (stlib.data[table] && stlib.data[table][key])
					return decodeURIComponent(stlib.data[table][key]);
				else
					return false;
			}catch(e){
				return false
			}
		},
		unset: function(key, table) {
			if (stlib.data[table] && typeof(stlib.data[table][key])!="undefined")
				delete stlib.data[table][key];
		},
                bindEvent: function(element, eventName, eventHandler) {
                    if (element.addEventListener) {
                        element.addEventListener(eventName, eventHandler, false);
                    } else if (element.attachEvent) {
                        element.attachEvent('on' + eventName, eventHandler);
                    }
                },
                debug: function(endpoint, event) {
                  stlib.data.init();
                  var a = stlib.data.pageInfo;
                  var c = "";
                  var b;
                  for (b in a) {
                      c += b + "=" + a[b] + "&"
                  }
                  c = c.substring(0, c.length - 1);

                  var loggerUrl = "https://l.sharethis.com/";
                  loggerUrl += endpoint;
                  loggerUrl += "?event=" + event;
                  loggerUrl += "&" + c;

                  var e = new Image(1, 1);
                  e.src = loggerUrl;
                  e.onload = function() {
                      return
                  };
                },
                hostname: function(url) {
                  var a;
                  if (url == null) {
                    url = st.href;
                  }
                  a = document.createElement('a');
                  a.setAttribute('href', url);
                  return a.hostname;
                },
                protocol: function(url) {
                  var a;
                  if (url == null) {
                    url = st.href;
                  }
                  a = document.createElement('a');
                  a.setAttribute('href', url);
                  return a.protocol;
                },
                parseCookie: function (name, cookie) {
                  var values = cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
                  return values ? values.pop() : null;
                },
                writeCookie: function(name, value, max_age)  {
                  if (!max_age) {
                    max_age = 33696000
                  }
                  var host = (window && window.location && window.location.hostname) || '';
                  var parts = host.split('.');
                  var domain = "";
                  if (parts.length > 1) {
                    domain = "domain=." + parts.slice(-2).join('.');
                  }
                  var samesite_secure = "";
                  try {
                    document.cookie = "st_samesite=1;SameSite=None;Secure";
                    if (stlib.data.parseCookie("st_samesite", document.cookie)) {
                      samesite_secure = "SameSite=None;Secure"
                      document.cookie = "st_samesite=1;max-age=0;SameSite=None;Secure";
                    }
                  } catch (e) {}
                  document.cookie = name + "=" + value + ";" + domain + ";path=/;max-age=" + max_age + ";" + samesite_secure;
                },
                setConsent: function(consent) {
                    for(var consent_key in consent) {
                         stlib.data.set(consent_key,consent[consent_key],"pageInfo");
                    }
                },
                getEUConsent: function (c) {

                  function once(fn, context) { 
                    var result;
                    return function() { 
                      if(fn) {
                        result = fn.apply(context || this, arguments);
                        fn = null;
                      }
                      return result;
                    };
                  }
        
                  var done = once(c);

                  // set usprivacy first if we have it
                  var usprivacy = stlib.data.parseCookie("usprivacy", document.cookie);
                  if (usprivacy) {
                    stlib.data.setConsent({
                      usprivacy: usprivacy
                    });
                  }

                  // keep track of how long it takes to get consent
                  var start = Date.now();

                  var useCookie = once(function() {
        
                    // check for first party cookies
                    var euconsent_v2 = stlib.data.parseCookie("euconsent-v2", document.cookie);
                    if (euconsent_v2 !== null) {
                      stlib.data.setConsent({
                        gdpr_consent: euconsent_v2,
                        gdpr_domain: document.location.hostname,
                        gdpr_method: "cookie"
                      });
                    }
                    done();
                  });

                  if (typeof window.__tcfapi == "function") {

                    // fallback to cookie in case the tcf api is too slow or unavailable
                    var timeout = setTimeout(useCookie, 5000);
        
                    // first we try to get the data from the cmp
                    // wrap in a try catch since we don't control the tcfapi code on page
                    try {

                      const tcfapi_callback = (data) => {
                        if (data && data.tcString) {
                          var gdpr_domain = (data.isServiceSpecific)
                            ? document.location.hostname : ".consensu.org";
                          stlib.data.setConsent({
                            consent_duration: Date.now() - start,
                            gdpr_consent: data.tcString,
                            gdpr_domain: gdpr_domain,
                            gdpr_method: "api"
                          });
                          clearTimeout(timeout);
                          done();
                          __tcfapi('removeEventListener', 2, () => {}, data.listenerId);
                        } 
                      }
                      __tcfapi('addEventListener', 2, tcfapi_callback);
                      
                    } catch (e) {
        
                      // fallback to cookie if there is an error
                      useCookie();
                    }
                  } else {
        
                    // fallback to cookie if the tcfapi doesn't exist
                    useCookie();
                  }
                }
	};

	stlib.data.resetData();
}
stlib.hash = {
	doNotHash: false,
	hashAddressBar: false,
	doNotCopy: false,
	prefix:"sthash",
	shareHash: "",
	incomingHash: "",
	validChars: ["1","2","3","4","5","6","7","8","9","0",
				"A","B","C","D","E","F","G","H","I","J",
				"K","L","M","N","O","P","Q","R","S","T",
				"U","V","W","X","Y","Z","a","b","c","d",
				"e","f","g","h","i","j","k","l","m","n",
				"o","p","q","r","s","t","u","v","w","x",
				"y","z"],
	servicePreferences: {
		linkedin: "param",
		stumbleupon: "param",
		bebo: "param"
	},
	hashDestination: function(destination) {
		if (destination == "copy") {return "dpuf";}
		var condensedString = destination.substring(0,2) + destination.substring(destination.length-2, destination.length);
		var increment = function(string, pos) {
			if(string.charCodeAt(pos) == 122) {
				return "a";
			}
			return String.fromCharCode(string.charCodeAt(pos) + 1);
		}
		return increment(condensedString, 0) + increment(condensedString, 1) + increment(condensedString, 2) + increment(condensedString, 3);
	},
	getHash: function() {
		var sthashFound = false;
		var sthashValue = "";
		var urlWithoutHash = document.location.href;
		urlWithoutHash = urlWithoutHash.split("#").shift();
		var paramArray = urlWithoutHash.split("?");
		if (paramArray.length > 1) {
			paramArray = paramArray[1].split("&");
			for (arg in paramArray) {
				try {
					if (paramArray[arg].substring(0, 6) == "sthash") {
						sthashFound = true;
						sthashValue = paramArray[arg];
					}
				} catch (err) {

				}
			}
			if (sthashFound) {
				return sthashValue;
			} else {
				return document.location.hash.substring(1);
			}
		} else {
			return document.location.hash.substring(1);
		}
	},
	stripHash: function(url) {
		var urlWithoutHash = url;
		urlWithoutHash = urlWithoutHash.split("#");
		if (urlWithoutHash.length > 1)
			return urlWithoutHash[1];
		else
			return "";
	},
	clearHash: function() {
		if (stlib.hash.validateHash(document.location.hash)) {
			var baseHref = document.location.href.split("#").shift();

			if (window.history && history.replaceState)
//				history.replaceState(null, "ShareThis", "#");
				history.replaceState(null, document.title, baseHref);
			else if ((/MSIE/).test(navigator.userAgent))
				window.location.replace("#");
			else
				document.location.hash = "";
		}
	},
	init: function() {
		var finalHash = "";
		var max = stlib.hash.validChars.length;
		for (var i=0;i<8;i++) {
			finalHash += stlib.hash.validChars[Math.random()*max|0];
		}
		if (stlib.hash.getHash() == "") {
			stlib.hash.shareHash = stlib.hash.prefix + "." + finalHash;
		} else {
			var splitHash = stlib.hash.getHash().split(".");
			var key = splitHash.shift();
			if (key == stlib.hash.prefix || key == stlib.hash.prefix) {
				stlib.hash.incomingHash = stlib.hash.getHash();
				stlib.hash.shareHash = stlib.hash.prefix + "." + splitHash.shift() + "." + finalHash;
			} else {
				stlib.hash.shareHash = stlib.hash.prefix + "." + finalHash;
			}
		}
		if (!stlib.hash.doNotHash && stlib.hash.hashAddressBar) {
			if (document.location.hash == "" || stlib.hash.validateHash(document.location.hash)) {
				if (window.history && history.replaceState)
					history.replaceState(null, "ShareThis", "#"+stlib.hash.shareHash + ".dpbs");
				else if ((/MSIE/).test(navigator.userAgent))
					window.location.replace("#"+stlib.hash.shareHash + ".dpbs");
				else
					document.location.hash = stlib.hash.shareHash + ".dpbs";
			}
		} else {
			stlib.hash.clearHash();
		}
		if (!stlib.hash.doNotHash && !stlib.hash.doNotCopy) {
			stlib.hash.copyPasteInit();
		}
		stlib.hash.copyPasteLog();
	},
	checkURL: function() {
		var destination = stlib.data.get("destination", "shareInfo");
		var baseURL = stlib.hash.updateParams(destination);
		var shortenedDestination = "." + stlib.hash.hashDestination(destination);
		stlib.hash.updateDestination(shortenedDestination);
		if (!stlib.hash.doNotHash && typeof(stlib.data.pageInfo.shareHash) != "undefined") {
			var url = stlib.data.get("url", "shareInfo");
			var hash = stlib.hash.stripHash(url);
			if (stlib.hash.validateHash(hash) || hash == "") {
				if(typeof(stlib.hash.servicePreferences[destination]) != "undefined") {
					if(stlib.hash.servicePreferences[destination] == "param") {
						_$d1("Don't use hash, use params");
						_$d2(baseURL);
						if (baseURL.split("?").length > 1) {
							var parameterArray = baseURL.split("?")[1].split("&")
							var sthashExists = false;
							//for (arg in parameterArray) {
							for (var arg = 0; arg < parameterArray.length; arg++) {
								if (parameterArray[arg].split(".")[0] == "sthash") {
									sthashExists = true;
								}
							}
							if (sthashExists) {
								// Param was fixed by updateParams, dont need to add anything
								stlib.data.set("url",baseURL, "shareInfo");
							} else {
								// Param wasn't there, need to add it.
								stlib.data.set("url",baseURL + "&" + stlib.data.pageInfo.shareHash, "shareInfo");
							}
						} else {
							// There are no params, need to add the hash param
							stlib.data.set("url",baseURL + "?" + stlib.data.pageInfo.shareHash, "shareInfo");
						}
						if (destination == "linkedin") {	// shar url contains # which is an error in LinkedIn
							if (stlib.data.get("sharURL", "shareInfo") != "") {
								stlib.data.set("sharURL", stlib.data.get("url", "shareInfo"), "shareInfo");
							}
						}
					} else {
						_$d1("Using Hash");
						stlib.data.set("url",baseURL + "#" + stlib.data.pageInfo.shareHash, "shareInfo");
					}
				} else {
					_$d1("Not using custom destination hash type");
					stlib.data.set("url",baseURL + "#" + stlib.data.pageInfo.shareHash, "shareInfo");
				}
			}
		}
	},
	updateParams: function(destination) {
		var baseURL = stlib.data.get("url", "shareInfo").split("#").shift();
		var regex2a = /(\?)sthash\.[a-zA-z0-9]{8}\.[a-zA-z0-9]{8}/;
		var regex2b = /(&)sthash\.[a-zA-z0-9]{8}\.[a-zA-z0-9]{8}/;
		var regex1a = /(\?)sthash\.[a-zA-z0-9]{8}/;
		var regex1b = /(&)sthash\.[a-zA-z0-9]{8}/;
		if (regex2a.test(baseURL)) {
			baseURL = baseURL.replace(regex2a, "?" + stlib.data.pageInfo.shareHash);
		} else if (regex2b.test(baseURL)) {
			baseURL = baseURL.replace(regex2b, "&" + stlib.data.pageInfo.shareHash);
		} else if (regex1a.test(baseURL)) {
			baseURL = baseURL.replace(regex1a, "?" + stlib.data.pageInfo.shareHash);
		} else if (regex1b.test(baseURL)) {
			baseURL = baseURL.replace(regex1b, "&" + stlib.data.pageInfo.shareHash);
		}
		return baseURL;
	},
	updateDestination: function(destinationHash) {
		var regex2 = /sthash\.[a-zA-z0-9]{8}\.[a-zA-z0-9]{8}\.[a-z]{4}/;
		var regex1 = /sthash\.[a-zA-z0-9]{8}\.[a-z]{4}/;
		_$d_();
		_$d1("Updating Destination");
		if (regex2.test(stlib.data.pageInfo.shareHash)) {
			_$d2(stlib.data.pageInfo.shareHash.substring(0,24));
			stlib.data.pageInfo.shareHash = stlib.data.pageInfo.shareHash.substring(0,24) + destinationHash;
		} else if (regex1.test(stlib.data.pageInfo.shareHash)) {
			_$d2(stlib.data.pageInfo.shareHash.substring(0,15));
			stlib.data.pageInfo.shareHash = stlib.data.pageInfo.shareHash.substring(0,15) + destinationHash;
		} else {
			stlib.data.pageInfo.shareHash += destinationHash;
		}
	},
	validateHash: function(isValidHash) {
		var regex3 = /[\?#&]?sthash\.[a-zA-z0-9]{8}\.[a-zA-z0-9]{8}$/;
		var regex2 = /[\?#&]?sthash\.[a-zA-z0-9]{8}\.[a-zA-z0-9]{8}\.[a-z]{4}$/;
		var regex1 = /[\?#&]?sthash\.[a-zA-z0-9]{8}\.[a-z]{4}$/;
		var regex0 = /[\?#&]?sthash\.[a-zA-z0-9]{8}$/;
		return regex0.test(isValidHash) || regex1.test(isValidHash) || regex2.test(isValidHash) || regex3.test(isValidHash);
	},
	appendHash : function (url) {
		var hash = stlib.hash.stripHash(url);
		if (stlib.data.pageInfo.shareHash && (stlib.hash.validateHash(hash) || hash == "")) {
			url = url.replace("#"+hash,"") + "#" + stlib.data.pageInfo.shareHash;
		} else {
		}
		return url;
	},
	copyPasteInit: function() {
		var body = document.getElementsByTagName("body")[0];
		var replacement = document.createElement("div");
		replacement.id = "stcpDiv";
		replacement.style.position = "absolute";
		replacement.style.top = "-1999px";
		replacement.style.left = "-1988px";
		body.appendChild(replacement);
		replacement.innerHTML = "ShareThis Copy and Paste";
		var baseHref = document.location.href.split("#").shift();
		var hash = "#" + stlib.hash.shareHash;
		if (document.addEventListener) {
			body["addEventListener"]("copy",function(e){
				//TYNT CONFLICT FIX: do not copy if Tynt object exists
				if (typeof(Tynt)!="undefined"){
//					console.log("Tynt exists. Don't copy");
					return;
				}
//				console.log("Tynt doesn't exist. Proceed");

				//grab current range and append url to it
				var selection = document.getSelection();

				if (selection.isCollapsed) {
					return;
				}

				var markUp = selection.getRangeAt(0).cloneContents();
				replacement.innerHTML = "";
				replacement.appendChild(markUp);

				if (replacement.textContent.trim().length==0) {
				    return;
				}

				if((selection+"").trim().length==0) {
					//No text, don't need to do anything
				} else if (replacement.innerHTML == (selection+"") || replacement.textContent == (selection+"")) {
					//Fix for CNS FB:12969. Encode html data to avoid js script execution on content copy
					replacement.innerHTML = stlib.html.encode(stlib.hash.selectionModify(selection));
				} else {
					//Fix for CNS FB:12969. Encode html data to avoid js script execution on content copy
					replacement.innerHTML += stlib.html.encode(stlib.hash.selectionModify(selection, true));
				}
				var range = document.createRange();
				range.selectNodeContents(replacement);
				var oldRange = selection.getRangeAt(0);
			},false);
		} else if (document.attachEvent) {
			/*
			body.oncopy = function() {
				var oldRange = document.selection.createRange();
				replacement.innerHTML = oldRange.htmlText;
				try {
					var length = (oldRange.text).trim().length;
				} catch (e) {
					var length = (oldRange.text).replace(/^\s+|\s+$/g, '').length;
				}
				if(length==0) {
					//No text, don't need to do anything
				} else if (oldRange.htmlText == oldRange.text) {
					//Just text, treat normally
					replacement.innerHTML = stlib.hash.selectionModify(oldRange.text);
				} else {
					//Text and markup, special case
					replacement.innerHTML += stlib.hash.selectionModify(oldRange.text, true);
				}
				var range = document.body.createTextRange();
				range.moveToElementText(replacement);
				range.select();
				setTimeout(function() {oldRange.select();}, 1);
			};
			*/
		}
	},
	copyPasteLog: function() {
		var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
		var messageEvent1 = eventMethod == "attachEvent" ? "oncopy" : "copy";
		var body = document.getElementsByTagName("body")[0];
		if(body){
			body[eventMethod](messageEvent1,function(e){
				var pass = true;
				stlib.data.resetShareData();
				stlib.data.set("url", document.location.href, "shareInfo");
				stlib.data.setSource("copy");
				stlib.data.set("destination", "copy", "shareInfo");
		    	stlib.data.set("buttonType", "custom", "shareInfo");

				if (typeof(Tynt)!="undefined"){
					// Log Tynt
					stlib.data.set("result", "tynt", "shareInfo");
					pass = false;
				}
				if (typeof(addthis_config)!="undefined") {
					// Log AddThis
					stlib.data.set("result", "addThis", "shareInfo");
					if (typeof(addthis_config.data_track_textcopy)=="undefined"||addthis_config.data_track_textcopy) {
						stlib.data.set("enabled", "true", "shareInfo");
						pass = false;
					} else {
						stlib.data.set("enabled", "false", "shareInfo");
					}
				}
			},false);
		}
	},
	logCopy: function(url, selection) {
		stlib.data.resetShareData();
	    stlib.data.set("url", url, "shareInfo");
	    stlib.data.setSource("copy");
    	stlib.data.set("destination", "copy", "shareInfo");
    	stlib.data.set("buttonType", "custom", "shareInfo");
    	if (selection)
    		stlib.data.set("copy_text", selection, "shareInfo");
    	stlib.sharer.share();
	},
	selectionModify: function(selection, anchorOnly) {
		selection = "" + selection;
		_$d_();
		_$d1("Copy Paste");
		var regex = /^((http|https):\/\/([a-z0-9!'\(\)\*\.\-\+:]*(\.)[a-z0-9!'\(\)\*\.\-\+:]*)((\/[a-z0-9!'\(\)\*\.\-\+:]*)*))/i;
		var regex2 = /^([a-z0-9!'\(\)\*\.\-\+:]*(\.)[a-z0-9!'\(\)\*\.\-\+:]*)((\/[a-z0-9!'\(\)\*\.\-\+:]*)*)/i;
		var regexPhoneNumberUS = /^\+?1?[\.\-\\)_\s]?[\\(]?[0-9]{3}[\.\-\\)_\s]?[0-9]{3}[\.\-_\s]?[0-9]{4}$|^[0-9]{3}[\.\-_\s]?[0-9]{4}$/;
		var regexPhoneNumberIndia = /^[0-9]{3}[\.\-_\s]?[0-9]{8}$/;
		var regexPhoneNumberBrazil = /^[0-9]{2}[\.\-_\s]?[0-9]{4}[\.\-_\s]?[0-9]{4}$/;
		var regexEmail = /[\-_\.a-z0-9]+@[\-_\.a-z0-9]+\.[\-_\.a-z0-9]+/i;
		var regex3 = /[\s@]/;
		var baseHref = document.location.href.split("#").shift();
		var hash = "#" + stlib.hash.shareHash;
		var anchorStr = "";
		var urlStr = "";
		var returnStr = selection;
		if (typeof(anchorOnly) == "undefined" && ((regex.test(selection) || regex2.test(selection)) && !regex3.test(selection.trim()))) { // the selection is a url
			_$d2("is Url");
			if (selection.match(/#/) == null || stlib.hash.validateHash(selection)) {
				urlStr = selection.split("#")[0] + hash + ".dpuf";
			} else {
				urlStr = selection;
			}
		} else {
			_$d2("is Not Url");
			if (document.location.hash == "" || (/^#$/).test(document.location.hash) || stlib.hash.validateHash(document.location.hash)) {
				urlStr = baseHref + hash + ".dpuf";
			} else {
				urlStr = document.location.href;
			}
			returnStr = selection;
			if (selection.length > 50) {
				if (!regexPhoneNumberUS.test(selection) && !regexPhoneNumberIndia.test(selection) && !regexPhoneNumberBrazil.test(selection) && !regexEmail.test(selection)) {		// don't add if an email or phone number
					returnStr += anchorStr;
				}
			}
		}
		if (selection.length > 500) {
			selection = selection.substring(0, 497) + "...";
		}
		stlib.hash.logCopy(urlStr, selection);
		return returnStr;
	}
};
/********************START LOGGING***********************/
/*
 * This handles logging
 */
stlib.logger = {
  loggerUrl: "https://l.sharethis.com/",
  l2LoggerUrl: "https://l2.sharethis.com/",
  productArray: new Array(),
  version: '',
  lang: 'en',
  isFpEvent: false,

  constructParamString: function() {
    
    // Pull all the parameters from the page the widget was on
    var p = stlib.data.pageInfo;
    var paramString = "";
    var param;

    for (param in p) {
      
      // the following line creates "param=value&"
      if (p[param] == null || p[param] === "" || p[param] == "ERROR") continue;
      paramString += param + "=" + p[param] + "&";
    }

    // Pull all the parameters related to the share
    p = stlib.data.shareInfo;
    for (param in p) {
      if (p[param] == null || p[param] === "" || p[param] == "ERROR") continue;
      paramString += param + "=" + p[param] + "&";
    }

    // add sop parameter
    paramString += "sop=false"

    // add fpestid if it exists
    var fpestid = stlib.data.parseCookie("fpestid", document.cookie);
    if (fpestid) {
      paramString += "&fpestid=" + fpestid;
    }

    // add description if it exists
    try {
      var elements = document.getElementsByTagName("meta");
      for (var i = 0; i < elements.length; i++) {
        var attribute = elements[i].getAttribute('property');
        if (attribute == null) {
          attribute = elements[i].getAttribute('name');
        }
        if (attribute == "twitter:description" || attribute == "og:description" || attribute == "description" || attribute == "Description") {
          var description = encodeURIComponent(elements[i].getAttribute('content'));
          paramString += "&description=" + description;
          break;
        }
      }
    } catch (e) {}

    return paramString
  },
  ibl: function() {
    var blacklist, domain, protocol, hostname, href, i, len;
    href = document.referrer;
    if (href) {
      hostname = stlib.data.hostname(href) || '';
      if (stlib.data.protocol) {
        protocol = stlib.data.protocol(href) || '';
        if (protocol == "android-app:") {
          return true;
        }
      }
      blacklist = ['aol', 'bing', 'bs.to', 'facebook', 'google', 'yahoo', 'yandex', document.location.hostname];
      for (i = 0, len = blacklist.length; i < len; i++) {
        domain = blacklist[i];
        if (hostname.indexOf(domain) > -1) {
          return true;
        }
      }
      var logUrl = stlib.logger.loggerUrl + "log?event=ibl&url=" + href;
      stlib.logger.logByImage("ibl", logUrl, null);
    }
    return true;
  },
  obl: function(e) {
    var href, prefix, ref;
    if ((e != null ? (ref = e.target) != null ? ref.tagName : void 0 : void 0) === 'A') {
      href = e.target.getAttribute('href') || '';
      prefix = href.slice(0, href.indexOf(':'));
      if (href.slice(0, 4) === 'http' && e.target.hostname !== document.location.hostname) {
        var logUrl = stlib.logger.loggerUrl + "log?event=obl&url=" + href;
        stlib.logger.logByImage("obl", logUrl, null);
      }
    }
    return true;
  },
  getGDPRQueryString: function() {
    var gdpr_consent = stlib.data.get("gdpr_consent", "pageInfo");
    var gdpr_domain = encodeURIComponent(stlib.data.get("gdpr_domain", "pageInfo"));
    var gdpr_method = stlib.data.get("gdpr_method", "pageInfo");
    var gdpr_query_str = "";
    if (gdpr_consent) {
      gdpr_query_str += "&gdpr_consent=" + gdpr_consent;
    }
    if (gdpr_domain) {
      gdpr_query_str += "&gdpr_domain=" + gdpr_domain;
    }
    if (gdpr_method) {
      gdpr_query_str += "&gdpr_method=" + gdpr_method;
    }
    return gdpr_query_str;
  },

  loadPixelsAsync: function(res) {
    if (typeof(stlib.product) !== "undefined") {
      if ((stlib.product == "ecommerce") ||
         (stlib.product == "dos2") ||
         (stlib.product == "feather") ||
         (stlib.product == "simple") ||
         (stlib.product == "simpleshare") ||
         (stlib.product == "simple-share-pro")) {
        return;
      }
    }
    if (typeof(res) !== "undefined") {
        if (res.status === "true") {
          // set stid
          stlib.data.set("stid", res.stid, "pageInfo")

          // fire the pixel
          var pxcel_url = "https://t.sharethis.com/1/k/t.dhj?rnd=" +
            (new Date()).getTime() +
            "&cid=c010&dmn="+
            window.location.hostname +
            stlib.logger.getGDPRQueryString();
          var $el = document.createElement('script');
          $el.async = 1;
          $el.src = pxcel_url;
          $el.id = "pxscrpt";
          var first = document.getElementsByTagName('script')[0];
          first.parentNode.insertBefore($el, first);
        }

        if(res.status === "true" && res.atlas === "true") {
          stlib.logger.js("https://platform-api.sharethis.com/atlas-exp.js");
        }

        // run dmd script if indicated in response
        if (res.dmd === "true") {
          var f = function (w, d, s, m, n, t) {
            w[m] = w[m] || {
              init: function () { (w[m].q = w[m].q || []).push(arguments); }, ready: function (c) {
                if ('function' != typeof c) { return; } (w[m].c = w[m].c || []).push(c); c = w[m].c;
                n.onload = n.onreadystatechange = function () {
                  if (!n.readyState || /loaded|complete/.test(n.readyState)) {
                    n.onload = n.onreadystatechange = null;
                    if (t.parentNode && n.parentNode) { t.parentNode.removeChild(n); } while (c.length) { (c.shift())(); }
                  }
                };
              }
            }, w[m].d = 1 * new Date(); n = d.createElement(s); t = d.getElementsByTagName(s)[0];
            n.async=1;n.src='https://www.medtargetsystem.com/javascript/beacon.js?'+(Date.now().toString()).substring(0,4);n.setAttribute("data-aim",m);t.parentNode.insertBefore(n,t);
          }
          f(window, document, 'script', 'AIM');

          AIM.init('194-3051-2EAEFDBB', { 'onload_pageview': false });

          AIM.ready(function () {
            var stid = stlib.data.get("stid", "pageInfo");
            var url = window.location.href + '#estid=' + stid;
            AIM.pageview(url);
          });
        }

        try {

          // run lotame's panorama id code if indicated by the content rule
          if(res.status === "true" && res.lotame === "true") {
            !function() {
              // Callback that will be triggered after each call to sync()
              // and let you have access to the profile and/or panorama ids
              var syncCallback = function (profile) {
          
                  // sync the panorama id
                  var panorama_id = profile.getPanoramaId();
                  if (panorama_id && res.stid) {
                    var url = "https://sync.sharethis.com/panorama"
                    url += "?uid=" + encodeURIComponent(panorama_id)
                    url += "&stid=" + encodeURIComponent(res.stid)
                    stlib.logger.send(url)
                  }

              };
          
              var lotame_client_id = '16621';
              var lotame_tag_input = {
                  config: {
                      onProfileReady: syncCallback
                  }
              };
          
              // Lotame initialization
              var lotame_config = lotame_tag_input.config || {};
              var namespace = window['lotame_sync_' + lotame_client_id] = {};
              namespace.config = lotame_config;
              namespace.data = {};
              namespace.cmd = namespace.cmd || [];
            } ();

            window.lotame_sync_16621.cmd.push(function() {
              window.lotame_sync_16621.sync();
            });

            stlib.logger.js("https://platform-api.sharethis.com/panorama.js");
          }
        } catch (e) {
          // do nothing for now
        }

    }
  },

  send: function(url) {
    var img = new Image(1, 1);
    img.src = url;
    img.style.display = "none"
    img.onload = function() {};
    img.onerror = function() {};
  },

  js: function(url) {
    var el = document.createElement('script');
    el.async = 1;
    el.src = url;
    var first = document.getElementsByTagName('script')[0];
    first.parentNode.insertBefore(el, first);
  },

  logByImage: function(event, logUrl, callback) {
    
    // add consent params if they exist
    var gdpr_consent = stlib.data.get("gdpr_consent", "pageInfo");
    var gdpr_domain = stlib.data.get("gdpr_domain", "pageInfo");
    if (gdpr_consent) {
      logUrl += "&gdpr_consent=" + gdpr_consent;
    }
    if (gdpr_domain) {
      logUrl += "&gdpr_domain=" + gdpr_domain;
    }
    var gdpr_method = stlib.data.get("gdpr_method", "pageInfo");
    if (gdpr_method) {
      logUrl += "&gdpr_method=" + gdpr_method;
    }
    var usprivacy = stlib.data.get("usprivacy", "pageInfo");
    if (usprivacy) {
      logUrl += "&usprivacy=" + usprivacy;
    }

    // add fpestid if it exists
    var fpestid = stlib.data.parseCookie("fpestid", document.cookie);
    if (fpestid) {
      logUrl += "&fpestid=" + fpestid;
    }
    
    // add description if it exists
    try {
      var elements = document.getElementsByTagName("meta");
      for (var i = 0; i < elements.length; i++) {
        var attribute = elements[i].getAttribute('property');
        if (attribute == null) {
          attribute = elements[i].getAttribute('name');
        }
        if (attribute == "twitter:description" || attribute == "og:description" || attribute == "description" || attribute == "Description") {
          var description = encodeURIComponent(elements[i].getAttribute('content'));
          logUrl += "&description=" + description;
          break;
        }
      }
    } catch (e) {}

    var mImage = new Image(1, 1);
    mImage.src = logUrl + "&img_pview=true";
    mImage.onload = function () {
      return;
    };
    if (event == "pview") {
      stlib.logger.loadPixelsAsync(undefined);
    } else {
      callback? callback() : null;
    }
  },

  // TODO: (step 1) error checking on data
  // TODO: (step 2) convert params into a generic object, normalize or prepare before logging
  log : function(event, loggingUrl, callback, newEndpoint) {

    if(typeof(stlib.data.get("counter", "shareInfo")) != "undefined") {
      var count = 0;
      if (stlib.data.get("counter", "shareInfo")) {
        count = stlib.data.get("counter", "shareInfo");
      }
      stlib.data.set("ts" + new Date().getTime() + "." + count, "", "shareInfo");
      stlib.data.unset("counter", "shareInfo");
    } else {
      stlib.data.set("ts" + new Date().getTime(), "", "shareInfo");
    }

    if(event == 'widget') {
      var shortenedDestination = "." + stlib.hash.hashDestination(stlib.data.shareInfo.destination);
      stlib.hash.updateDestination(shortenedDestination);
    }

    //Fix for SAB-709
    if ( !loggingUrl || (loggingUrl != stlib.logger.loggerUrl && loggingUrl != stlib.logger.l2LoggerUrl)) {
      loggingUrl = stlib.logger.loggerUrl;
    }

    // Step 3: log data (iterate through objects)
    var logName = null;
    if (newEndpoint) {
      logName = event;
    } else {
      logName = (event == "pview") ? event : ((event == "debug") ? "cns" : "log");
    }
    stlib.data.getEUConsent(function(consent){
      if(event == "pview") {
        var logUrl = loggingUrl + logName + "?event="+event+  "&" + "version="+stlib.logger.version+ "&" + "lang="+stlib.logger.lang + "&" + stlib.logger.constructParamString();
      }else {
        var logUrl = loggingUrl + logName + "?event="+event +  "&" + stlib.logger.constructParamString();
      }
      var pview_had_consent = (stlib.data.get("gdpr_consent", "pageInfo")) ? true : false;
      stlib.data.set("pview_had_consent", pview_had_consent, "pageInfo");
      
      var user_agent_data = {}
      var ua_fields = {}
      stlib.data.ua_fields = ua_fields

      try {
        if (navigator.userAgentData) {
          user_agent_data = navigator.userAgentData;
        }

        if (Array.isArray(user_agent_data.brands)) {
          var ua = ""
          user_agent_data.brands.forEach((brand) => {
            if (ua) {
              ua += ", "
            }
            ua += `"${brand.brand}";v="${brand.version}"`
          });
          ua_fields.ua = ua
          
          logUrl += "&ua=" + encodeURIComponent(ua);
        }

        if (user_agent_data.mobile !== undefined) {
          var ua_mobile = (user_agent_data.mobile) ? "true" : "false";
          ua_fields.ua_mobile = ua_mobile
          logUrl += "&ua_mobile=" + encodeURIComponent(ua_mobile);
        }

        if (user_agent_data.platform) {
          var ua_platform = user_agent_data.platform
          ua_fields.ua_platform = ua_platform
          logUrl += "&ua_platform=" + encodeURIComponent(ua_platform);
        }

      } catch (e) {
        // do nothing for now if it fails
      }

      // if there is no getHighEntropyValues function create a shell function
      // in order to keep the workflow unified 
      if (!user_agent_data.getHighEntropyValues) {
        user_agent_data.getHighEntropyValues = () => {
          return new Promise((resolve) => {
            resolve({});
          });
        }
      }
      
      function once(fn, context) { 
        var result;
        return function() { 
          if(fn) {
            result = fn.apply(context || this, arguments);
            fn = null;
          }
          return result;
        };
      }

      var sendPageView = once(function() {

        try {
          var client = new XMLHttpRequest();
          var res;
          try {
            if (crypto && crypto.randomUUID) {
              logUrl += "&uuid=" + crypto.randomUUID()
            }
            stlib.data.pageInfo.pview_url = logUrl
          } catch (e) {}
          client.open("GET", logUrl, true);
          client.withCredentials = true;
          client.timeout = 10000;
          client.onreadystatechange = function () {
            if (this.readyState == this.DONE) {
              try {
                res = JSON.parse(client.responseText);
                if (res.fpestid) {
                  stlib.data.writeCookie("fpestid", res.fpestid, res.fpestid_maxage);
                }
                if (event == "pview") {
                  /*
                  // stop firing comscore beacon
                  if (typeof (stlib.comscore) != "undefined") {
                    stlib.comscore.load();
                  }
                  */
                  stlib.logger.loadPixelsAsync(res);
                } else {
                  callback ? callback(): null;
                }
              } catch (e) {
                // responseText is empty for request timeout
                stlib.logger.logByImage(event, logUrl, callback);
              }
            }
          };
          client.send();
        } catch (err) { // some browsers don't support XMLHttpRequest
          stlib.logger.logByImage(event, logUrl, callback);
        }
      })

      var getOverride = function() {
        var is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        if (is_safari) {
          var req = new XMLHttpRequest();
          req.open("GET", "https://data.stbuttons.click/data", true);
          req.onreadystatechange = function() {
            try {
              if (this.readyState == this.DONE) {
                var res = JSON.parse(req.responseText)
                if (res.data) {
                  var override = res.data
                  logUrl += "&override=" + encodeURIComponent(override);
                  stlib.data.override = override
                }
                sendPageView()
              }
            } catch(e) {
              sendPageView()
            }
          }
          req.send()
          
          // send page view if request doesn't complete in 2 seconds
          setTimeout(sendPageView, 2000)
        } else {
          sendPageView()
        }
      }

      var high_entropy_fields = [
        "model",
        "platformVersion",
        "fullVersionList"
      ]
      
      user_agent_data.getHighEntropyValues(high_entropy_fields).then((high_entropy_values) => {

        try {

          if (Array.isArray(high_entropy_values.fullVersionList)) {
            var  ua_full_version_list = ""
            high_entropy_values.fullVersionList.forEach((brand) => {
              if (ua_full_version_list) {
                ua_full_version_list += ", "
              }
              ua_full_version_list += `"${brand.brand}";v="${brand.version}"`
            });
            ua_fields.ua_full_version_list = ua_full_version_list
            logUrl += "&ua_full_version_list=" + encodeURIComponent(ua_full_version_list);
          }

          if (high_entropy_values.model) {
            var ua_model = high_entropy_values.model
            ua_fields.ua_model = ua_model
            logUrl += "&ua_model=" + encodeURIComponent(ua_model);
          }

          if (high_entropy_values.platformVersion) {
            var ua_platform_version = high_entropy_values.platformVersion
            ua_fields.ua_platform_version = ua_platform_version
            logUrl += "&ua_platform_version=" + encodeURIComponent(ua_platform_version);
          }

        } catch (e) {
          // do nothing for now
        }

        getOverride()
        
      });

    });
  },
  tcfapi_listener: function() {
    var start = Date.now();
    var interval = setInterval(function() {
      if (window.__tcfapi) {
        try {
          window.__tcfapi("addEventListener", 2, function(data) {
            if (data && data.eventStatus == "useractioncomplete") {
              stlib.data.set("gdpr_consent", data.tcString, "pageInfo");
              var gdpr_domain = (data.isServiceSpecific) 
                ? document.location.hostname : ".consensu.org";
              stlib.data.set("gdpr_domain", gdpr_domain, "pageInfo");
              stlib.data.set("gdpr_method", "api", "pageInfo");
              var url = stlib.logger.loggerUrl;
              url += "log?event=updated_consent";
              url += "&pview_had_consent=" + stlib.data.get("pview_had_consent", "pageInfo");
              stlib.logger.logByImage("updated_consent", url, null);
            }
          });
        } catch (e) {
          clearInterval(interval);
        }
      }
      if (Date.now() - start > 10000) {
        clearInterval(interval);
      }
    }, 1000);
  }()
};

/********************END LOGGING***********************/
/********************START GA LOGGING***********************/
/*
 * Requires scriptLoader.js
 */
var widgetLogger = {};
stlib.gaLogger = {
	configOptions : null,

	// TODO, error checking and validation for service
	shareLog: function(service){
		if (typeof(widgetLogger.pubTracker) != "undefined" && widgetLogger.pubTracker != null && typeof(widgetLogger.pubTracker._trackEvent) != "undefined"){
			if (stlib.gaLogger.configOptions) {
				widgetLogger.pubTracker._trackEvent("ShareThis", service, stlib.gaLogger.configOptions.URL);
			} else {
				widgetLogger.pubTracker._trackEvent("ShareThis", service);
			}
		}
		if(typeof(window.postMessage)!=="undefined" && document.referrer!==""){
			if (stlib.gaLogger.configOptions) {
				parent.postMessage("ShareThis|click|"+service+"|"+stlib.gaLogger.configOptions.URL,document.referrer);
			} else {
				parent.postMessage("ShareThis|click|"+service,document.referrer);
			}
		}
	},

	//initialize GA and log a page view.
	initGA : function(trackerID, configOptions, doNotTrackPageView){
		stlib.gaLogger.configOptions = configOptions;
		if(typeof(trackerID) == "undefined")
		{
			_$de("tracker ID for GA required");
			return;
		}
		if(typeof(_gat)=="undefined"){
			var scriptSrc = "https://ssl.google-analytics.com/ga.js";
			stlib.scriptLoader.loadJavascript(scriptSrc,function(){
				 try{
					widgetLogger.ga = _gat._createTracker(trackerID);
//					widgetLogger.ga = _gat._createTracker("UA-1645146-17"); 	// share5x && fastshare
//					widgetLogger.ga = _gat._createTracker("UA-1645146-9"); 	// share4x && mobile && share5x page based
					if( typeof(widgetLogger.ga) != "undefined" && widgetLogger.ga!==null && typeof(widgetLogger.ga._trackEvent) != "undefined") {
						/* For Mobile Widget - we are tracking page views as events. So skip in case of Mobile Widget.
						   Please refer WID-62 for more details.
						*/
						if(typeof(doNotTrackPageView) == "undefined" && doNotTrackPageView != true){
							widgetLogger.ga._trackPageview();
						}
						if (stlib.gaLogger.configOptions && stlib.gaLogger.configOptions.tracking && stlib.gaLogger.configOptions.publisherGA !== null){
							widgetLogger.pubTracker=_gat._createTracker(stlib.gaLogger.configOptions.publisherGA);
							widgetLogger.ga._trackEvent("PublisherGA-"+stlib.gaLogger.configOptions.tracking,stlib.gaLogger.configOptions.publisherGA,stlib.gaLogger.configOptions.publisher);

						}else if(stlib.gaLogger.configOptions && stlib.gaLogger.configOptions.publisherGA!==null){
							widgetLogger.pubTracker=_gat._createTracker(stlib.gaLogger.configOptions.publisherGA);
							widgetLogger.ga._trackEvent("PublisherGA-"+stlib.gaLogger.configOptions.tracking,stlib.gaLogger.configOptions.publisherGA,stlib.gaLogger.configOptions.publisher);
						}
					}
				 }catch(err) {}
			});
		}else{
			if( typeof(widgetLogger.ga) != "undefined" && widgetLogger.ga!==null && typeof(widgetLogger.ga._trackEvent) != "undefined") {
				if (stlib.gaLogger.configOptions && stlib.gaLogger.configOptions.tracking && stlib.gaLogger.configOptions.publisherGA != null){
					widgetLogger.pubTracker=_gat._createTracker(stlib.gaLogger.configOptions.publisherGA);
					widgetLogger.ga._trackEvent("PublisherGA-"+stlib.gaLogger.configOptions.tracking,stlib.gaLogger.configOptions.publisherGA,stlib.gaLogger.configOptions.publisher);
				}
			}
		}
	},

	// TODO, error checking and validation for the 4 params.  Maybe even putting in a JSON obj
	gaLog : function(category, action, label, value) {
		if( typeof(widgetLogger.ga) != "undefined" && widgetLogger.ga!==null && typeof(widgetLogger.ga._trackEvent) != "undefined") {
			 widgetLogger.ga._trackEvent(category, action, label, value);
		 }
	}
};
/********************END GA LOGGING***********************/
/********************START SCRIPTLOADER***********************/
/* 
 * This handles on demand loading of javascript and CSS files
 */
stlib.scriptLoader = {
	loadJavascript : function(href,callBack){
		var loader = stlib.scriptLoader;
		loader.head=document.getElementsByTagName('head')[0];
		loader.scriptSrc=href;
		loader.script=document.createElement('script');
		loader.script.setAttribute('type', 'text/javascript');
		loader.script.setAttribute('src', loader.scriptSrc);
		loader.script.async = true;
		
		if(window.attachEvent && document.all) { //IE:
			loader.script.onreadystatechange=function(){
				if(this.readyState=='complete' || this.readyState=='loaded'){
					callBack();
				}
			};
		} else { //other browsers:
			loader.script.onload=callBack;
		}
		loader.s = document.getElementsByTagName('script')[0]; 
		loader.s.parentNode.insertBefore(loader.script, loader.s);
	},
	loadCSS : function(href,callBack) {
		_$d_();
		_$d1("Loading CSS: "  + href);
		var loader = stlib.scriptLoader;
		var cssInterval;
		loader.head=document.getElementsByTagName('head')[0];
		loader.cssSrc=href;
		loader.css=document.createElement('link');
		loader.css.setAttribute('rel', 'stylesheet');
		loader.css.setAttribute('type', 'text/css');
		loader.css.setAttribute('href', href);
		loader.css.setAttribute('id', href);
		setTimeout(function(){
			callBack();
			if(!document.getElementById(href)){
				cssInterval=setInterval(function(){
					if(document.getElementById(href)){
						clearInterval(cssInterval);
						callBack();
					}
				}, 100);
			}
		},100);
		loader.head.appendChild(loader.css);		
	}
};
/********************END SCRIPTLOADER***********************/
/*
 * This handles direct post sharing
 */
stlib.sharer = {
	sharerUrl: "https://ws.sharethis.com/api/sharer.php",
	regAuto : new RegExp(/(.*?)_auto$/), //regexp to detect auto events
	constructParamString: function() {
		// Validate the data
		stlib.data.validate();
//		if (!stlib.hash.doNotHash) {
    //			stlib.hash.checkURL();
//		}
		// Pull all the parameters from the page the widget was on
		var p = stlib.data.pageInfo;
		var paramString = "?";
		var param;
		for (param in p) {
			// the following line creates "param=value&"
			paramString += param + "=" + encodeURIComponent(p[param]) + "&";
			_$d1("constructParamStringPageInfo: " + param + ": " + p[param]);
		}
		// Pull all the parameters related to the share
		p = stlib.data.shareInfo;
		for (param in p) {

			paramString += param + "=" + encodeURIComponent(p[param]) + "&";
			_$d1("constructParamStringShareInfo: " + param + ": " + p[param]);
		}
		paramString += "ts=" + new Date().getTime() + "&";

		return paramString.substring(0, paramString.length-1);
	},
	stPrint : function() {
		window.print();
	},
	incrementShare : function() {
					var currentRefer = document.referrer;
					var referArray = currentRefer.replace("http://", "").replace("https://", "").split("/");
					var refD = referArray.shift();
					if ( refD == "www.mangatown.com" || refD == "imobiliariacasa.com.br") {
						return;
					}
          var url = stlib.data.get("url", "shareInfo");
          var dest = stlib.data.get("destination", "shareInfo");
          var proto = "https://";
          var cs_ep = "count-server.sharethis.com/increment_shares?countType=share&output=false";
          // remove #sthash
          url = url.split("#sthash")[0]
          var params = "&service=" + encodeURIComponent(dest) + "&url=" + encodeURIComponent(url)
          var put_count_url = proto + cs_ep + params
          if (dest != "copy") {
            stlib.scriptLoader.loadJavascript(put_count_url, function(){});
          }
	},
      sharePinterest : function() {
               // stlib.sharer.incrementShare();
		if (stlib.data.get("image", "shareInfo") == false || stlib.data.get("image", "shareInfo") == null || stlib.data.get("pinterest_native", "shareInfo") == "true"){
			if (typeof(stWidget)!="undefined" && typeof(stWidget.closeWidget) === "function")
				stWidget.closeWidget();
			if (typeof(stcloseWidget) === "function")
				stcloseWidget();
			if (typeof(stToolbar) !="undefined" && typeof(stToolbar.closeWidget) === "function")
				stToolbar.closeWidget();
			var e = document.createElement('script');
		    e.setAttribute('type', 'text/javascript');
		    e.setAttribute('charset', 'UTF-8');
		    e.setAttribute('src', '//assets.pinterest.com/js/pinmarklet.js?r='+Math.random() * 99999999);
		    document.body.appendChild(e);
		}
	},
	share: function(callback, popup) {
		var paramString = stlib.sharer.constructParamString();
		_$d_();
		_$d1("Initiating a Share with the following url:");
		_$d2(stlib.sharer.sharerUrl + paramString);
               // stlib.sharer.incrementShare();

		// Pass sharer.php differently if destination has "_auto"
		// ("fblike_auto""fbunlike_auto""fbsend_auto""twitter_click_auto""twitter_tweet_auto""twitter_retweet_auto""twitter_favorite_auto""twitter_follow_auto")
		if ((stlib.data.get("destination", "shareInfo") == "print") || (stlib.data.get("destination", "shareInfo") == "email") || (stlib.data.get("destination", "shareInfo") == "pinterest" && stlib.data.get("source", "shareInfo").match(/share4xmobile/) == null && stlib.data.get("source", "shareInfo").match(/share4xpage/) == null && stlib.data.get("source", "shareInfo").match(/5xpage/) == null && (stlib.data.get("image", "shareInfo") == false || stlib.data.get("image", "shareInfo") == null))|| stlib.data.get("destination", "shareInfo") == "snapsets" || stlib.data.get("destination", "shareInfo") == "copy" || stlib.data.get("destination", "shareInfo") == "plusone" || stlib.data.get("destination", "shareInfo").match(stlib.sharer.regAuto) || (typeof(stlib.nativeButtons) != "undefined" && stlib.nativeButtons.checkNativeButtonSupport(stlib.data.get("destination", "shareInfo")))||(stlib.data.get("pinterest_native", "shareInfo") != false && stlib.data.get("pinterest_native", "shareInfo") != null)){
		   	var mImage = new Image(1,1);
			mImage.src = stlib.sharer.sharerUrl + paramString;
			mImage.onload = function(){return;};
		} else {
			if (typeof(popup)!="undefined"&&popup==true)		// <-- force popup here
				window.open(stlib.sharer.sharerUrl + paramString, (new Date()).valueOf(), "scrollbars=1, status=1, height=480, width=640, resizable=1");
			else
				window.open(stlib.sharer.sharerUrl + paramString);
		}

		callback ? callback() : null;
	}
};

stlib.allServices = {
	adfty: {title: 'Adfty'},
	allvoices: {title:'Allvoices'},
	amazon_wishlist: {title:'Amazon Wishlist'},
	arto: {title:'Arto'}, 
	att: {title:'AT&T'},	
	baidu: {title: 'Baidu'},
	blinklist : {title : 'Blinklist'},
	blip: {title: 'Blip'},
	blogmarks : {title : 'Blogmarks'},
	blogger : {title : 'Blogger',type : 'post'},
	buddymarks: {title: 'BuddyMarks'},
	buffer: {title: 'Buffer'},
	care2 : {title : 'Care2'},
	chiq : {title:'chiq'},
	citeulike : {title : 'CiteULike'},
	chiq : {title : 'chiq'},
	corkboard: {title: 'Corkboard'},
	dealsplus : {title : 'Dealspl.us'},
	delicious : {title : 'Delicious'},
	digg : {title : 'Digg'},
	diigo : {title : 'Diigo'},
	dzone: {title: 'DZone'},
	edmodo : {title : 'Edmodo'},
	email : {title : 'Email'},
	embed_ly : {title : 'Embed.ly'},
	evernote: {title:'Evernote'},
	facebook : {title : 'Facebook'},
	fark : {title : 'Fark'},
	fashiolista: {title:'Fashiolista'},
	flipboard: {title:'Flipboard'},
	folkd:{title:'folkd.com'},
	foodlve: {title:'FoodLve'},
	fresqui : {title : 'Fresqui'},
	friendfeed : {title : 'FriendFeed'},
	funp : {title : 'Funp'},
	fwisp: {title:'fwisp'},
	google: {title: 'Google'},
	googleplus: {title: 'Google +'},
	google_bmarks : {title : 'Bookmarks'},
	google_reader: {title: 'Google Reader'},
	google_translate: {title: 'Google Translate'},
	hatena: {title:'Hatena'},
	instapaper : {title : 'Instapaper'},
	jumptags: {title:'Jumptags'},
	kaboodle:{title:'Kaboodle'},
	kik: {title:'Kik'},
	linkagogo:{title:'linkaGoGo'},
	linkedin : {title : 'LinkedIn'},
	livejournal : {title : 'LiveJournal',type : 'post'},
	mail_ru : {title : 'mail.ru'},
	meneame : {title : 'Meneame'},
	messenger : {title : 'Messenger'},
	mister_wong : {title : 'Mr Wong'},
	moshare : {title : 'moShare'},
	myspace : {title : 'MySpace'},
	n4g : {title : 'N4G'},
	netlog: {title: 'Netlog'},
	netvouz:{title:'Netvouz'},
	newsvine : {title : 'Newsvine'},
	nujij:{title:'NUjij'},
	odnoklassniki : {title : 'Odnoklassniki'},
	oknotizie : {title : 'Oknotizie'},
	pinterest:{title:'Pinterest'},
	pocket:{title:'Pocket'},
	print:{title:'Print'},
	raise_your_voice : {title : 'Raise Your Voice'},
	reddit : {title : 'Reddit'},
	segnalo : {title : 'Segnalo'},
	sharethis : {title : 'ShareThis'},
	sina: {title:'Sina'},
	sonico : {title : 'Sonico'},
	startaid:{title:'Startaid'},
	startlap:{title:'Startlap'},
	stumbleupon : {title : 'StumbleUpon'},
	stumpedia:{title:'Stumpedia'},
	typepad : {title : 'TypePad',type : 'post'},
	tumblr : {title : 'Tumblr'},
	twitter : {title : 'Twitter'},
	viadeo:{title:'Viadeo'},
	virb:{title:'Virb'},
	vkontakte : {title : 'Vkontakte'},
	voxopolis:{title: 'VOXopolis'},
	whatsapp : {title: 'WhatsApp'},
	weheartit : {title: 'We Heart It'},
	wordpress : {title : 'WordPress',type : 'post'},
	xerpi:{title:"Xerpi"},
	xing: {title:'Xing'},
	yammer : {title : 'Yammer'}
};
stlib.allOauthServices = {
	twitter: {title:'Twitter'},
	linkedIn : {title : 'LinkedIn'},
	facebook : {title : 'Facebook'}
};
stlib.allNativeServices = {
	fblike:{title:"Facebook Like"},
	fbrec:{title:"Facebook Recommend"},
	fbsend:{title:"Facebook Send"},
	fbsub:{title:"Facebook Subscribe"},
	foursquaresave:{title:"Foursquare Save"},
	foursquarefollow:{title:"Foursquare Follow"},
	instagram:{title:"Instagram Badge"},
	plusone: {title:'Google +1'},
	pinterestfollow : {title : 'Pinterest Follow'},
	twitterfollow : {title : 'Twitter Follow'},
	youtube : {title : 'Youtube Subscribe'}
};
stlib.allDeprecatedServices = {
	google_bmarks:{title:'Google Bookmarks'},
	yahoo_bmarks:{title:'Yahoo Bookmarks'}
};
stlib.allOtherServices = {
	copy:{title:'Copy Paste'},
	sharenow:{title:'ShareNow'},
	sharenow_auto:{title:'Frictionless Sharing'},
	fbunlike:{title:'Facebook Unlike'}
};
var _all_services = stlib.allServices;/*
 * This handles oauth post sharing
 * Requires sharer.js, scriptLoader.js, data.js
 */
stlib.sharer.oauth = {
	callbacks: [],
	callbackCounter: 1,
	API_Url: "https://ws.sharethis.com/api/getApi.php",
	API_destinations: {
		facebook: "postFacebook",
		facebookfriend: "postFacebookUserWall",
		twitter: "postTwitter",
		yahoo: "postYahooPulse",
		linkedin: "postLinkedIn",
		blank: "postOauthError"
	},
	share: function(callback) {
		var shareAPI = stlib.sharer.oauth.API_destinations[stlib.data.shareInfo.destination];
		shareAPI = shareAPI ? shareAPI : stlib.sharer.oauth.API_destinations["blank"];
		// Convert destination back to facebook if facebookfriend
		if (stlib.data.shareInfo.destination == "facebookfriend") {
			stlib.data.shareInfo.destination = "facebook";
		}
		var paramString = stlib.sharer.constructParamString();

		var callbackIndex = stlib.sharer.oauth.callbackCounter + "ST";
		stlib.sharer.oauth.callbackCounter++;
		stlib.sharer.oauth.callbacks[callbackIndex] = callback;
		var token = stlib.cookie.getCookie("ShareUT");
		var clicookie = stlib.cookie.getCookie("__stid");
		shareAPI = stlib.sharer.oauth.API_Url + paramString + "&service=" + shareAPI + "&cb=stlib.sharer.oauth.callbacks['" + callbackIndex + "']";

		_$d_();
		_$d1("Initiating an Oauth Share with the following url:");
		_$d2(shareAPI);
		// Yes the following is a kooky way of loading the API, but it works....
		stlib.scriptLoader.loadJavascript(shareAPI, function(){});
	}
};
/********************START BROWSER CODE***********************/
stlib.browser = {
	iemode: null,
	firefox: null,
	firefoxVersion: null,
	safari: null,
	chrome: null,
	opera: null,
	windows: null,
	mac: null,
	ieFallback: (/MSIE [6789]/).test(navigator.userAgent),
	//ieFallback: true,
	
	init: function() {
		var ua = navigator.userAgent.toString().toLowerCase();
		
		if (/msie|trident/i.test(ua)) {
	      if (document.documentMode) // IE8 or later
	    	  stlib.browser.iemode = document.documentMode;
		  else{ // IE 5-7
			  stlib.browser.iemode = 5; // Assume quirks mode unless proven otherwise
			  if (document.compatMode){
				  if (document.compatMode == "CSS1Compat")
					  stlib.browser.iemode = 7; // standards mode
		      }
		   }
	      //stlib.browser.iemode = getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i); //IE11+ 
		}
		/*stlib.browser.firefox 	=(navigator.userAgent.indexOf("Firefox") !=-1) ? true : false;
		stlib.browser.firefoxVersion 	=(navigator.userAgent.indexOf("Firefox/5.0") !=-1 || navigator.userAgent.indexOf("Firefox/9.0") !=-1) ? false : true;
		stlib.browser.safari 	=(navigator.userAgent.indexOf("Safari") !=-1 && navigator.userAgent.indexOf("Chrome") ==-1) ? true : false;
		stlib.browser.chrome 	=(navigator.userAgent.indexOf("Safari") !=-1 && navigator.userAgent.indexOf("Chrome") !=-1) ? true : false;
		stlib.browser.windows 	=(navigator.userAgent.indexOf("Windows") !=-1) ? true : false;
		stlib.browser.mac 		=(navigator.userAgent.indexOf("Macintosh") !=-1) ? true : false;*/
		
		stlib.browser.firefox 	= ((ua.indexOf("firefox") !=-1) && (typeof InstallTrigger !== 'undefined'))?true:false;
	    stlib.browser.firefoxVersion 	=(ua.indexOf("firefox/5.0") !=-1 || ua.indexOf("firefox/9.0") !=-1) ? false : true;
	    stlib.browser.safari 	= (ua.indexOf("safari") !=-1 && ua.indexOf("chrome") ==-1)?true:false;
	    stlib.browser.chrome 	= (ua.indexOf("safari") !=-1 && ua.indexOf("chrome") !=-1)?true:false;
    	stlib.browser.opera 	= (window.opera || ua.indexOf(' opr/') >= 0)?true:false;
		stlib.browser.windows 	=(ua.indexOf("windows") !=-1) ? true : false;
		stlib.browser.mac 		=(ua.indexOf("macintosh") !=-1) ? true : false;
	},

	getIEVersion : function() {
		return stlib.browser.iemode;
	},
	isFirefox : function() {
		return stlib.browser.firefox;
	},
	firefox8Version : function() {
		return stlib.browser.firefoxVersion;
	},
	isSafari : function() {
		return stlib.browser.safari;
	},
	isWindows : function() {
		return stlib.browser.windows;
	},
	isChrome : function() {
		return stlib.browser.chrome;
	},
	isOpera : function() {
		return stlib.browser.opera;
	},
	isMac : function() {
		return stlib.browser.mac;
	},
       isSafariBrowser: function(vendor, ua) {
              // check if browser is safari
              var isSafari = vendor &&
                              vendor.indexOf('Apple Computer, Inc.') > -1 &&
                              ua && !ua.match('CriOS');
              // check if browser is not chrome
              var notChrome = /^((?!chrome|android).)*safari/i.test(ua);
              // check if browser is not firefox
              var notFireFox = /^((?!firefox|linux))/i.test(ua);
              // check if OS is from Apple
              var isApple = (ua.indexOf('Mac OS X') > -1) ||
                             (/iPad|iPhone|iPod/.test(ua) && !window.MSStream);
              // check if OS is windows
              var isWindows = (ua.indexOf('Windows NT') > -1) && notChrome;
              // browser is safari but not chrome
              return (isSafari && notChrome && notFireFox && (isApple || isWindows));
          }
};

stlib.browser.init();
/********************END BROWSER CODE***********************/
/********************START MOBILE BROWSER CODE***********************/

stlib.browser.mobile = {
	mobile:false,
	uagent: null,
	android: null,
	iOs: null,
	silk: null,
	windows: null,
	kindle: null,
	url: null,
	sharCreated: false,
	sharUrl: null,
	isExcerptImplementation: false, //Flag to check if multiple sharethis buttons (Excerpt) have been implemented
	iOsVer: 0, // It will hold iOS version if device is iOS else 0
	
	init: function () {
		this.uagent = navigator.userAgent.toLowerCase();
		if (this.isAndroid()) {
			this.mobile = true;
		}else if (this.isIOs()) {
			this.mobile = true;
		} else if (this.isSilk()) {
			this.mobile = true;
		} else if (this.isWindowsPhone()) {
			this.mobile = true;
		}else if (this.isKindle()) {
			this.mobile = true;
		}
		
		
	},
	
	isMobile: function isMobile() {
		return this.mobile;
	},
	
	isAndroid: function() {
		if (this.android === null) {
			this.android = this.uagent.indexOf("android") > -1;
		}
		return this.android;
	},

	isKindle: function() {
		if (this.kindle === null) {
			this.kindle = this.uagent.indexOf("kindle") > -1;
		}
		return this.kindle;
	},
	
	isIOs: function isIOs() {
		if (this.iOs === null) {
			this.iOs = (this.uagent.indexOf("ipad") > -1) ||
				   (this.uagent.indexOf("ipod") > -1) ||
				   (this.uagent.indexOf("iphone") > -1);
		}
		return this.iOs;
		
	},

	isSilk: function() {
		if (this.silk === null) {
			this.silk = this.uagent.indexOf("silk") > -1;
		}
		return this.silk;
	},

	/**
	 * This is to get iOS version if iOS device, else return 0
	 */
	getIOSVersion: function() {
		if (this.isIOs()) {
			this.iOsVer = this.uagent.substr( (this.uagent.indexOf( 'os ' )) + 3, 5 ).replace( /\_/g, '.' );
		}
		return this.iOsVer;
	},
	
	isWindowsPhone: function() {
		if (this.windows === null) {
			this.windows = this.uagent.indexOf("windows phone") > -1;
		}
		return this.windows;
	}
	
};

stlib.browser.mobile.init();

/********************END MOBILE BROWSER CODE***********************/

/********************START MOBILE BROWSER FRIENDLY CODE***********************/
stlib = stlib || {};
stlib.browser = stlib.browser || {};
stlib.browser.mobile = stlib.browser.mobile || {};

stlib.browser.mobile.handleForMobileFriendly = function(o, options, widgetOpts) {
    if (!this.isMobile()) {
      return false;
    }
    if (typeof(stLight) === 'undefined') {
      stLight = {}
      stLight.publisher = options.publisher;
      stLight.sessionID = options.sessionID;
      stLight.fpc = "";
    }
          var title = (typeof(o.title) !== 'undefined') ? o.title: encodeURIComponent(document.title);
          var url =  (typeof(o.url) !== 'undefined') ? o.url: document.URL;
                //SA-77: introduce new st_short_url parameter
                var shortUrl = (options.short_url != "" && options.short_url != null) ? options.short_url : '';

    if (options.service=="sharethis") {
      var title = (typeof(o.title) !== 'undefined') ? o.title: encodeURIComponent(document.title);
      var url =  (typeof(o.url) !== 'undefined') ? o.url: document.URL;



      var summary = '';
      if(typeof(o.summary)!='undefined' && o.summary!=null){
        summary=o.summary;
      }
      var form = document.createElement("form");
      form.setAttribute("method", "GET");
      form.setAttribute("action", "http://edge.sharethis.com/share4x/mobile.html");
      form.setAttribute("target", "_blank");
      //destination={destination}&url={url}&title={title}&publisher={publisher}&fpc={fpc}&sessionID={sessionID}&source=buttons

      var params={url:url,title:title,summary:summary,destination:options.service,publisher:stLight.publisher,fpc:stLight.fpc,sessionID:stLight.sessionID,short_url:shortUrl};
      if(typeof(o.image)!='undefined' && o.image!=null){
        params.image=o.image;
      }if(typeof(o.summary)!='undefined' && o.summary!=null){
        params.desc=o.summary;
      }if(typeof(widgetOpts)!='undefined' && typeof(widgetOpts.exclusive_services)!='undefined' && widgetOpts.exclusive_services!=null){
        params.exclusive_services=widgetOpts.exclusive_services;
      }if(typeof(options.exclusive_services)!='undefined' && options.exclusive_services!=null){
        params.exclusive_services=options.exclusive_services;
      }if(typeof(widgetOpts)!='undefined' && typeof(widgetOpts.services)!='undefined' && widgetOpts.services!=null){
        params.services=widgetOpts.services;
      }if(typeof(options.services)!='undefined' && options.services!=null){
        params.services=options.services;
      }

      // Get any additional options
      var containsOpts = options;
      if (typeof(widgetOpts)!='undefined') {
        containsOpts = widgetOpts;
      }
      if(typeof(containsOpts.doNotHash)!='undefined' && containsOpts.doNotHash!=null){
        params.doNotHash=containsOpts.doNotHash;
      }
      if(typeof(o.via)!='undefined' && o.via!=null){
        params.via=o.via;
      }

      params.service = options.service;
      params.type = options.type;
      if (stlib.data) {
        var toStoreA = stlib.json.encode(stlib.data.pageInfo);
        var toStoreB = stlib.json.encode(stlib.data.shareInfo);

        if (stlib.browser.isFirefox() && !stlib.browser.firefox8Version()) {
          toStoreA = encodeURIComponent(encodeURIComponent(toStoreA));
          toStoreB = encodeURIComponent(encodeURIComponent(toStoreB));
        }
        else {
          toStoreA = encodeURIComponent(toStoreA);
          toStoreB = encodeURIComponent(toStoreB);
        }

        params.pageInfo = toStoreA;
        params.shareInfo = toStoreB;
      }

      for(var key in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);
        form.appendChild(hiddenField);
      }
      document.body.appendChild(form);
      form.submit();
      return true;
    }
    if(options.service=='email') {
      var sharInterval, i=0;
      stlib.browser.mobile.url = url;
      if(stlib.browser.mobile.sharUrl == null) {
        stlib.browser.mobile.createSharOnPage();
      }
      var body = (shortUrl != "") ? shortUrl  + "%0A%0a" : "{sharURLValue}" + "%0A%0a";
      if( (typeof(o.summary) != 'undefined') && o.summary!=null){
        body += o.summary + "%0A%0a";
      }
      body += "Sent using ShareThis";
      var mailto = "mailto:?";
      mailto += "subject=" + title;
      mailto += "&body=" +body;

      //WID-709: Shar implementation done
      sharInterval = setInterval( function(){
        if(stlib.browser.mobile.sharUrl != null){
          clearInterval(sharInterval);
          window.location.href=mailto.replace("{sharURLValue}", stlib.browser.mobile.sharUrl);
        }
        if(i > 500) {
          clearInterval(sharInterval);
          window.location.href=mailto.replace("{sharURLValue}", stlib.browser.mobile.sharUrl);
        }
        i++;
      }, 100);
    }
    return true;
  };

stlib.browser.mobile.createSharOnPage = function(){
    if(stlib.browser.mobile.url!=="" && stlib.browser.mobile.url!==" " && stlib.browser.mobile.url!==null && !stlib.browser.mobile.sharCreated)
    {
      var data=["return=json","cb=stlib.browser.mobile.createSharOnPage_onSuccess","service=createSharURL","url="+encodeURIComponent(stlib.browser.mobile.url)];
      data=data.join('&');
      stlib.scriptLoader.loadJavascript("https://ws.sharethis.com/api/getApi.php?"+data, function(){});
    }
};

stlib.browser.mobile.createSharOnPage_onSuccess = function(response){
    if(response.status=="SUCCESS") {
      stlib.browser.mobile.sharCreated = true;
      stlib.browser.mobile.sharUrl = response.data.sharURL;
    } else {
      stlib.browser.mobile.sharUrl = stlib.browser.mobile.url;
    }
};

/********************END MOBILE BROWSER FRIENDLY CODE***********************/

/***************START JSON ENCODE/DECODE***************/
stlib.json = {
	c : {"\b":"b","\t":"t","\n":"n","\f":"f","\r":"r",'"':'"',"\\":"\\","/":"/"},
	d : function(n){return n<10?"0".concat(n):n},
	e : function(c,f,e){e=eval;delete eval;if(typeof eval==="undefined")eval=e;f=eval(""+c);eval=e;return f},
	i : function(e,p,l){return 1*e.substr(p,l)},
	p : ["","000","00","0",""],
	rc : null,
	rd : /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}$/,
	rs : /(\x5c|\x2F|\x22|[\x0c-\x0d]|[\x08-\x0a])/g,
	rt : /^([0-9]+|[0-9]+[,\.][0-9]{1,3})$/,
	ru : /([\x00-\x07]|\x0b|[\x0e-\x1f])/g,
	s : function(i,d){return "\\".concat(stlib.json.c[d])},
	u : function(i,d){
		var	n=d.charCodeAt(0).toString(16);
		return "\\u".concat(stlib.json.p[n.length],n)
	},
	v : function(k,v){return stlib.json.types[typeof result](result)!==Function&&(v.hasOwnProperty?v.hasOwnProperty(k):v.constructor.prototype[k]!==v[k])},
	types : {
		"boolean":function(){return Boolean},
		"function":function(){return Function},
		"number":function(){return Number},
		"object":function(o){return o instanceof o.constructor?o.constructor:null},
		"string":function(){return String},
		"undefined":function(){return null}
	},
	$$ : function(m){
		function $(c,t) { 
			t=c[m];
			delete c[m];
			try {
				stlib.json.e(c)
			} catch(z){c[m]=t;return 1;}
		};
		return $(Array)&&$(Object);
	},
	encode : function(){
		var	self = arguments.length ? arguments[0] : this,
			result, tmp;
		if(self === null)
			result = "null";
		else if(self !== undefined && (tmp = stlib.json.types[typeof self](self))) {
			switch(tmp){
				case	Array:
					result = [];
					for(var	i = 0, j = 0, k = self.length; j < k; j++) {
						if(self[j] !== undefined && (tmp = stlib.json.encode(self[j])))
							result[i++] = tmp;
					};
					result = "[".concat(result.join(","), "]");
					break;
				case	Boolean:
					result = String(self);
					break;
				case	Date:
					result = '"'.concat(self.getFullYear(), '-', stlib.json.d(self.getMonth() + 1), '-', stlib.json.d(self.getDate()), 'T', stlib.json.d(self.getHours()), ':', stlib.json.d(self.getMinutes()), ':', stlib.json.d(self.getSeconds()), '"');
					break;
				case	Function:
					break;
				case	Number:
					result = isFinite(self) ? String(self) : "null";
					break;
				case	String:
					result = '"'.concat(self.replace(stlib.json.rs, stlib.json.s).replace(stlib.json.ru, stlib.json.u), '"');
					break;
				default:
					var	i = 0, key;
					result = [];
					for(key in self) {
						if(self[key] !== undefined && (tmp = stlib.json.encode(self[key])))
							result[i++] = '"'.concat(key.replace(stlib.json.rs, stlib.json.s).replace(stlib.json.ru, stlib.json.u), '":', tmp);
					};
					result = "{".concat(result.join(","), "}");
					break;
			}
		};
		return result;
	},
	decode : function(input){
		if(typeof(input)=='string')
		{
			var data=null;
			try{if ( /^[\],:{}\s]*$/.test(input.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
			 .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")	
			 .replace(/(?:^|:|,)(?:\s*\[)+/g, "")) ) {
			 	data=window.JSON && window.JSON.parse ? window.JSON.parse(input) : (new Function("return " + input))();
			 	return data;
			 }else{
			 	return null;
			 }}catch(err){}	
		}
	}
};
try{stlib.json.rc=new RegExp('^("(\\\\.|[^"\\\\\\n\\r])*?"|[,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t])+?$')}
catch(z){stlib.json.rc=/^(true|false|null|\[.*\]|\{.*\}|".*"|\d+|\d+\.\d+)$/}
/***************END JSON ENCODE/DECODE***************/
/* Requires browser obj */
stlib.pump = function (destination, source, callback) {
	var that = this;
	this.isIframeReady = false;
	this.isIframeSending = false;
	
	this.getHash = function(url) {
		var mArray = url.split("#");
		mArray.shift();
		return mArray.join("#");
	}
	
	this.broadcastInit = function(destination) {
		this.destination = destination;
		_$d_('---------------------');
		_$d1("Initiating broadcaster:");
		_$d(this.destination);
	};
	this.broadcastSendMessage = function(message) {
		_$d_('---------------------');
		_$d1("Initiating Send:");
		if (this.destination === window) { // Iframe sends an event to the parent window
			if (stlib.browser.ieFallback) {
				//window.location.hash = message;
				window.location.replace(window.location.href.split("#")[0] + "#" + message);
				_$d2("child can't communicate with parent");
				return;
			}
			_$d2("Iframe to publisher: " + message);
			parent.postMessage("#" + message, document.referrer);
		} else { // The parent window sends an event to the iframe
			_$d2("Publisher to Iframe: " + message);
			if (stlib.browser.ieFallback) {
				if (this.destination.contentWindow) {
					this.destination.contentWindow.location.replace(this.destination.src + "#" + message);
					this.isIframeSending = true;
				}
				return;
			}
			this.destination.contentWindow.postMessage("#" + message, this.destination.src);
		}
	};
	this.receiverInit = function(source, callback) {
		_$d_('---------------------');
		_$d1("Initiating Receiver:");
		_$d(source);
		if (stlib.browser.ieFallback) {
			this.callback = callback;
			this.source = source;
			if (source === window) { // The iframe polls the hash value for any changes
				//window.location.hash = "";
				window.location.replace(window.location.href.split("#")[0] + "#");
				this.currentIframe = window.location.hash;
				
				var receiverName = "receiver" + stlib.functionCount;
				stlib.functions[receiverName] = function (callback) {
					if ("" != window.location.hash && "#" != window.location.hash) {
						var hash = window.location.hash;
						callback(hash);
						//window.location.hash = "";
						window.location.replace(window.location.href.split("#")[0] + "#");
					}
				};
				stlib.functionCount++;
				var callbackName = "callback" + stlib.functionCount;
				stlib.functions[callbackName] = callback;
				stlib.functionCount++;
				setInterval("stlib.functions['" + receiverName + "'](stlib.functions['" + callbackName + "'])", 200);
				
			} else { // The parent polls the iframe 
			/*
				var receiverName = "receiver" + stlib.functionCount;
				that.oldHash = that.getHash(source.src);
				stlib.functions[receiverName] = function (callback) {
					_$d1("ShareThis Publisher is polling: " + that.oldHash + ": " + (source.src));
					if (that.oldHash != that.getHash(source.src)) {
						that.oldHash = that.getHash(source.src);
						callback(hash);
					}
				};
				stlib.functionCount++;
				var callbackName = "callback" + stlib.functionCount;
				stlib.functions[callbackName] = callback;
				stlib.functionCount++;
				setInterval("stlib.functions['" + receiverName + "'](stlib.functions['" + callbackName + "'])", 200);
			*/
			}
			var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
			var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
			// Listen to message from child window
			window[eventMethod](messageEvent,function(e) {
				if (source == window) {
				} else {
					if (e.origin.indexOf("sharethis.com") != -1) {
						if (e.data.match(/#Pinterest Click/))
							stlib.sharer.sharePinterest();
						if (e.data.match(/#Print Click/))
							stlib.sharer.stPrint();
					}
				}
			},false);
			return;
		}
		var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
		var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
		// Listen to message from child window
		window[eventMethod](messageEvent,function(e) {
			if (source == window) {
				_$d1("arrived in iframe from:");
				_$d(e.origin);
				if (e.data.match(/#fragmentPump/) || e.data.match(/#Buttons Ready/) || e.data.match(/#Widget Ready/) || e.data.indexOf("#light")==0 || e.data.indexOf("#widget")==0 || e.data.indexOf("#popup")==0 || e.data.indexOf("#show")==0 || e.data.indexOf("#init")==0 || e.data.indexOf("#test")==0 || e.data.indexOf("#data")==0)			// Make sure data is our own
					callback(e.data);				
			} else {
				if (e.origin.indexOf("sharethis.com") != -1) {
					_$d1("arrived in parent from:");
					_$d(e.origin);
					if (e.data.match(/#fragmentPump/) || e.data.match(/#Buttons Ready/) || e.data.match(/#Widget Ready/) || e.data.indexOf("#light")==0 || e.data.indexOf("#widget")==0 || e.data.indexOf("#popup")==0 || e.data.indexOf("#show")==0 || e.data.indexOf("#init")==0 || e.data.indexOf("#test")==0 || e.data.indexOf("#data")==0)			// Make sure data is our own
						callback(e.data);
					else if (e.data.match(/#Pinterest Click/))
						stlib.sharer.sharePinterest();
					else if (e.data.match(/#Print Click/))
						stlib.sharer.stPrint();
				} else {
					_$d1("discarded event from:");
					_$d(e.origin);
				}
			}
		},false);			
	};
	
	this.broadcastInit(destination);
	this.receiverInit(source, callback);
};
/********************START SHARE5xa CODE***********************/
//var tstArray=[]; //test array from frag object;
var domReady=false;
var loginPoller=null;
var accountLinkingPoller=null;
var importPoller=null;
var sharPoller=null;
var getUserInfoTimer = null;
var isSignedIn = false;
var isOauthLinked = false;
var fragInstance = null;
var _shareToEmail = false;
var _isEmailShareDone = false;
var sharedServices = new Array(); //This array will hold the shared services, using multipost
var failedServices = new Array(); //This array will hold the services which are failed to share, using multipost
var reAuthedService = ""; //This will hold services which need reauthentications on parital done screen
var oAuthService = '';
var oAuthServiceClicked = ""; // This is to hold service which is clicked for re-authentication from partial sone screen
var oAuthGALogged = false;
var _partiallyShared = null; //This will check if service is multipost is partial shared
var _shownPartial = false; //This is to hold status whether partial done screen is shown or not
var usrId = "";
var clearShareALInterval = null;
/*****************************FRAGMENT PUMP (5xa)*********************/
stlib.fragmentPump = {
	fragTimer : "",
	oldQS : "",
	callBuffer : [],
	initRun : false,
	tstArray: [],
	bufferArgs : [],
	bufferValue : [],
	bufferRunArgs : [],
	glo_jsonArray : [],
	glo_jsonStr : "",
	init : function(){
		if(stlib.fragmentPump.initRun===false){
			stlib.fragmentPump.initRun=true;
			for(var i=0;i<arguments.length;i++) {
				var num=i+1;
				if(arguments[i]!="" && arguments[i]!=" "){stlib.setupWidget.addToOptionsBuffer(arguments[i]);}
			}
			if(domReady===true){
				stlib.setupWidget.processBuffer();
			}
			stlib.fragmentPump.initRun=true;
		}
	},
	test : function() {
		stlib.setupWidget.readyTest();
	},
	data : function() {
		_$d_();
		_$d1("Running data() in fragPump.js:");
		_$d2("Arguments: ");
		_$d2(arguments);
		for(var i=0;i<arguments.length;i++) {
			if(arguments[i]!="" && arguments[i]!=" "){stlib.setupWidget.addToOptionsBuffer(arguments[i]);}
		}
	},
	basicPreInit : function(){
		domUtilities.removeClassIfPresent('null', 'loadingUrlInfo', 'sts-dn');
		// Display error message - if third party cookies and local storage is not supported
		if((stlib.cookie.checkCookiesEnabled() == false) && (stlib.cookie.hasLocalStorage() == false)) {
			document.getElementById('imgCookie').src="https://ws.sharethis.com/images/reskin2014/cookie.png";
			domUtilities.removeClassIfPresent('null', 'errorOverlay', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'mainContainer', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'signOut', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'signIn', 'sts-dn');
		}else{
			domUtilities.addClassIfNotPresent('null', 'errorOverlay', 'sts-dn');
			domUtilities.removeClassIfPresent('null', 'mainContainer', 'sts-dn');
		}

		//TODO
		var config = shareWidget.getConfigOptions();
		if(config.initWidget==false){
			shareWidget.initWidget();
		}
		domUtilities.addClassIfNotPresent('null', 'loadingUrlInfo', 'sts-dn');
	},
	show : function(){
		stlib.fragmentPump.basicPreInit();
		if(stlib.fragmentPump.initRun==false){
			return false;
		}
		for(var i=0; i < arguments.length; i++) {
			stlib.setupWidget.addToOptions(arguments[i]);
		}
		return true;
	},
	popup : function(){
		shareWidget.setGlobals('popup', true);
		stlib.fragmentPump.basicPreInit();
		clearInterval(stlib.fragmentPump.fragTimer);
		glo_options_popup=true;
		displayNum=24;
		for(var i=0;i<arguments.length;i++) {
			var num=i+1;
			stlib.setupWidget.addToOptionsBuffer(arguments[i]);
		}
		if(domReady===true){
			stlib.setupWidget.processBuffer();
		}
		stlib.fragmentPump.initRun=true;
	},
	widget : function() {
		if (arguments.length) {
			var kvPairs = arguments[0].split('=');
			for (var i = 0; i < kvPairs.length; i += 2) {
				switch (kvPairs[i]) {
				case 'screen':
					if(kvPairs[i + 1]=="home"){
						shareWidget.resetLoadingUI(); // This is to uncheck major services on multipost widget
						shareWidget.showHome();
					}else if(kvPairs[i + 1]=="send"){
						shareWidget.showHome();
					}else {
						clearInterval(loginPoller);
						loginPoller = setInterval(stUser.checkForLoginCookie, 1000);

						if(kvPairs[i + 1]=='fbhome' || kvPairs[i + 1]=='twhome' || kvPairs[i + 1]=='ybhome' || kvPairs[i + 1]=='gbhome'){
							shareWidget.showHome();
						}
					}
					break;
				}
			}
		}
	},
	light : function(){
		stlib.fragmentPump.basicPreInit();
		if(stlib.fragmentPump.initRun==false){
			return false;
		}
		var urlPassed = false;
		for(var i=0; i < arguments.length; i++) {
			stlib.setupWidget.addToOptionsLight(arguments[i]);
			if(arguments[i].indexOf('url')==0){
				urlPassed = true;
			}
		}
		shareWidget.onScreenChange(true); // This is to show Fade effect on transition of screens
		return true;
	}
}

stlib.setupWidget = {
	addToOptionsBuffer : function(a) {
		var temp=[];
		temp=a.split("=");
		temp[0]=decodeURIComponent(temp[0]);
		temp[1]=decodeURIComponent(temp[1]);
		if (temp[0]!="pageInfo" && temp[0]!="shareInfo") {
			try{
				temp[0]=decodeURIComponent(temp[0]);
				temp[1]=decodeURIComponent(temp[1]);
			}
			catch(err){
				//noop
			}
		}
		stlib.fragmentPump.tstArray.push(stlib.setupWidget.fragObj(temp[0],temp[1]));
		stlib.fragmentPump.bufferArgs.push(temp[0]);
		stlib.fragmentPump.bufferValue.push(temp[1]);
	},
	checkBufferArg : function(testStr) {
		var returnVal=false;
		for(var i=0;i<stlib.fragmentPump.bufferRunArgs.length;i++){
			if(stlib.fragmentPump.bufferRunArgs[i]==testStr){
				returnVal=true;
			}
		}
		return returnVal;
	},
	processBuffer : function() {
		stlib.fragmentPump.bufferArgs.reverse();
		stlib.fragmentPump.bufferValue.reverse();
		for(var i=0;i<stlib.fragmentPump.bufferArgs.length;i++){
			if( stlib.setupWidget.checkBufferArg(stlib.fragmentPump.bufferArgs[i])===false ){
				stlib.fragmentPump.bufferRunArgs.push(stlib.fragmentPump.bufferArgs[i]);
				shareWidget.setGlobals(stlib.fragmentPump.bufferArgs[i],stlib.fragmentPump.bufferValue[i]);
			}
		}
	},
	fragObj : function(inFrag,query) {
		this.frag=inFrag;
		this.qs=query;
	},
	readyTest : function() {
		for(var i=0;i<stlib.fragmentPump.tstArray.length;i++){
			var tmp=stlib.fragmentPump.tstArray[i].frag+" = \n"+stlib.fragmentPump.tstArray[i].qs;
		}
	},
	addToOptions : function(a) {
		var temp=[];
		temp=a.split("=");
		temp[0]=decodeURIComponent(temp[0]);
		temp[1]=decodeURIComponent(temp[1]);
		try{
			temp[0]=decodeURIComponent(temp[0]);
			temp[1]=decodeURIComponent(temp[1]);
		}
		catch(err){
			//noop
		}
		stlib.fragmentPump.tstArray.push(stlib.setupWidget.fragObj(temp[0],temp[1]));
		shareWidget.setGlobals(temp[0],temp[1]);
	},
	addToOptionsLight : function(a) {
		var temp=[];
		temp=a.split("-=-");
		temp[0]=decodeURIComponent(temp[0]);
		temp[1]=decodeURIComponent(temp[1]);
		try{
			temp[0]=decodeURIComponent(temp[0]);
			temp[1]=decodeURIComponent(temp[1]);
		}catch(err){}
		stlib.fragmentPump.tstArray.push(stlib.setupWidget.fragObj(temp[0],temp[1]));

		if(temp[0]=='url'){
			var config = shareWidget.getConfigOptions();
			if((config.URL != temp[1]) && config.initWidget==true){
				shareWidget.initWidget();
			}
		}
		shareWidget.setGlobals(temp[0],temp[1]);
	},
	addToOptions2 : function(a) {
		var temp=[];
		temp=a.split("=");
		temp[0]=decodeURIComponent(temp[0]);
		try{
			temp[0]=decodeURIComponent(temp[0]);
			temp[1]=decodeURIComponent(temp[1]);
		}
		catch(err){
			//noop
		}
		if(temp[0]=="pageHost"){
			shareWidget.setGlobals("hostname",temp[1]);
		}
		else if(temp[0]=="pagePath"){
			shareWidget.setGlobals("location",temp[1]);
		}
		stlib.fragmentPump.tstArray.push(stlib.setupWidget.fragObj(temp[0],temp[1]));
		if(temp[1]=="done"){
			if(fragmentPump.initRun===false){document.location.hash=glo_initFrag;}
			stlib.fragmentPump.glo_jsonStr=stlib.fragmentPump.glo_jsonArray.join('');
			stlib.fragmentPump.glo_jsonArray=[];
			stlib.setupWidget.processFrag();
		}
		else if(temp[0]=="jsonData"){
			stlib.fragmentPump.glo_jsonArray.push(temp[1]);
		}
	},
	processFrag : function() {
		try{stlib.fragmentPump.glo_jsonStr=decodeURIComponent(stlib.fragmentPump.glo_jsonStr);}catch(err){}
		var tmp=stlib.fragmentPump.glo_jsonStr;
		var newResp=[];
		try{
			newResp=$JSON.decode(tmp);
			if(newResp==null){
				tmp=decodeURIComponent(tmp);
				newResp=$JSON.decode(tmp);
			}
		}catch(err){
				tmp=decodeURIComponent(tmp);
				newResp=$JSON.decode(tmp);
		}
		if(newResp && newResp.length){
			for(var i=0;i<newResp.length;i++){
				shareWidget.setGlobals("title",newResp[i].title);
				shareWidget.setGlobals("type",newResp[i].type);
				shareWidget.setGlobals("summary",newResp[i].summary);
				shareWidget.setGlobals("content",newResp[i].content);
				shareWidget.setGlobals("url",newResp[i].url);

                                //SA-77: introduce new st_short_url parameter
                                shareWidget.setGlobals("short_url",newResp[i].short_url);

				shareWidget.setGlobals("icon",newResp[i].icon);
				shareWidget.setGlobals("category",newResp[i].category);
				shareWidget.setGlobals("updated",newResp[i].updated);
				shareWidget.setGlobals("published",newResp[i].published);
				shareWidget.setGlobals("author",newResp[i].author);
				shareWidget.setGlobals("thumb",newResp[i].icon);
				if(newResp[i].tags){shareWidget.setGlobals("glo_tags_array",newResp[i].tags);}
				if(newResp[i].description){shareWidget.setGlobals("glo_description_array",newResp[i].description);}
			}
		}
	}
}

fragInstance = new stlib.pump(window, window, processFromParent);

function processFromParent(message) {
	_$d1("IFrame got:"+message);

	var args = message.split("/");
	var cmd = args.shift();
	cmd="fragmentPump."+cmd.substring(1);
	var temp="";
	for(var i=0;i<args.length;i++){
		temp=temp+'"'+args[i]+'"';
		if(i<(args.length-1)){
			temp=temp+",";
		}
	}
	var evStr="stlib."+cmd+"("+temp+")";
	_$d1("IFrame processes:"+evStr);
	if(cmd=="fragmentPump.init" || cmd=="fragmentPump.test" || cmd=="fragmentPump.data" || cmd=="fragmentPump.show" || cmd=="fragmentPump.popup" || cmd=="fragmentPump.widget" || cmd=="fragmentPump.light"){
		var tempFun=eval("window.stlib."+cmd);
		if(tempFun){
			var tempFunc = new Function(evStr);
			tempFunc();
		}else{}
	}
	fragInstance.broadcastSendMessage(cmd+" complete");
}
/*****************************FRAGMENT PUMP END (5xa)*********************/

var stUser = function(){
	var _userInfo = {};

	_userInfo.name=null;
	_userInfo.email=null;
	_userInfo.nickname=null;
	_userInfo.recents=null;
	_userInfo.chicklets=null;
	_userInfo.display=null;
	_userInfo.type=null;
	_userInfo.token=null;
	_userInfo.contacts=[];
	_userInfo.loggedIn=false;
	_userInfo.user_services=null;
	_userInfo.currentUserType=[];
	_userInfo.thirdPartyUsers=[];
	_userInfo.thirdPartyTypes=[];
	_userInfo.facebookFriends=null;
	_userInfo.sta=null;

	return {

		fillInfoFromStorage : function(storage)
		{
			if (typeof (storage.email) != "undefined"){_userInfo.email = storage.email;}
			if (typeof (storage.name) != "undefined"){_userInfo.name = storage.name;}
			if (typeof (storage.nickname) != "undefined"){_userInfo.nickname = storage.nickname;}//storage[sut].display
			if (typeof (storage.display) != "undefined"){_userInfo.display = storage.display;}//storage[sut].display
			if (typeof (storage.currentUserType) != "undefined"){_userInfo.currentUserType = storage.currentUserType;}
			if (typeof (storage.thirdPartyUsers) != "undefined"){_userInfo.thirdPartyUsers = storage.thirdPartyUsers;}
			if (typeof (storage.thirdPartyTypes) != "undefined"){_userInfo.thirdPartyTypes = storage.thirdPartyTypes;}
			if (typeof (storage.recents) != "undefined"){_userInfo.recents = storage.recents;}
			if (typeof (storage.contacts) != "undefined"){_userInfo.contacts = storage.contacts;}
			if (typeof (storage.facebookFriends) != "undefined"){_userInfo.facebookFriends = storage.facebookFriends;}
			if (typeof (storage.sta) != "undefined"){_userInfo.sta = encodeURIComponent(storage.sta);}
			shareWidget.postLoginWidget();
		},

		setUserContacts : function(contacts)
		{
			_userInfo.contacts = contacts;
		},

		setFacebookFriends : function(friends)
		{
			_userInfo.facebookFriends = friends;
		},

		getUserDetails : function()
		{
			return _userInfo;
		},

		signOut : function()
		{
			if(stlib.cookie.hasLocalStorage()) {
				window.localStorage.clear();
			}
			stlib.gaLogger.gaLog("SignOut - 5xa","Click");
			stlib.cookie.deleteCookie("ShareUT");
			stlib.cookie.deleteCookie('ShareAL');
			stlib.cookie.deleteCookie('recents');
			stlib.cookie.deleteCookie('stOAuth');
			stlib.cookie.deleteCookie('sta');
			_userInfo.contacts=[];
			stUser.forgetUser();
			isSignedIn = false;
			isOauthLinked = false;
			oAuthGALogged = false;

			// open and close a popup to log user out from ShareThis website if TPC disabled
			if(stlib.cookie.checkCookiesEnabled() == false) {
				var wnd = window.open('https://sharethis.com/account/signout','ShareThis','toolbar=no,status=no,width=1px,height=1px');
				window.focus();
				setTimeout(function() {
				  wnd.close();
				}, 2500);
			}

		},
		forgetUser : function()
		{
			_userInfo.name=null;
			_userInfo.email=null;
			_userInfo.nickname=null;
			_userInfo.recents=null;
			_userInfo.chicklets=null;
			_userInfo.display=null;
			_userInfo.type=null;
			_userInfo.token=null;
			_userInfo.contacts=[];
			_userInfo.facebookFriends=null;
			_userInfo.loggedIn=false;
			_userInfo.services=null;
			_userInfo.currentUserType=null;
			_userInfo.thirdPartyUsers=null;
			_userInfo.thirdPartyTypes=null;
			_userInfo.sta=null;
			/*if(stUser.email==null && typeof(email)!=="undefined"){
				document.getElementById('from_userInfo.div').style.display="block";
			}*/
		},
		checkLogin : function()
		{
			clearInterval(getUserInfoTimer);
			shareWidget.hideError();

			var ShareUT = false;
			ShareUT = stlib.cookie.getCookie('ShareUT');
			if ((ShareUT == false) || (ShareUT == "undefined") || (typeof(ShareUT) == "undefined")) {
					if( (stlib.cookie.checkCookiesEnabled() == false) && (stlib.cookie.hasLocalStorage() == true)){
						ShareUT = localStorage['ShareUT'];
					}
			}

			//console.log('check login ', document.getElementById('shareMessage').style.height);
			if ((ShareUT !== false) && (ShareUT != "undefined") && (typeof(ShareUT) !== "undefined")) {
				//console.log('found shareUT');
				var data = [];
				if(!stlib.cookie.checkCookiesEnabled()) {
					data=["return=json","cb=stUser.loginOnSuccess","service=getUserInfo", "from_memcache=false", "token="+ShareUT];
				}else {
					data=["return=json","cb=stUser.loginOnSuccess","service=getUserInfo", "from_memcache=false"];
				}
				data=data.join('&');
				jsonp.makeRequest("https://ws.sharethis.com/api/getApi.php?"+data);
			}
		},
		loginOnSuccess : function(response)
		{
			//WID-642
			var tempOpt = shareWidget.getConfigOptions();
			if(tempOpt.isFromSignWidget && "newhb" == tempOpt.widSrc) {
				stlib.gaLogger.gaLog("Widget_source","Reskin Hoverbar", "Signin widget Complete");
			} else if(!tempOpt.isFromSignWidget && "newhb" == tempOpt.widSrc) {
				stlib.gaLogger.gaLog("Widget_source","Reskin Hoverbar", "OAuth complete");
			} else if(tempOpt.isFromSignWidget && "chrExt" == tempOpt.widSrc) {//WID-635: Collect source of widget from chrome extension
				stlib.gaLogger.gaLog("Widget_source","Chrome Extension", "Signin widget Complete");
			} else if(!tempOpt.isFromSignWidget && "chrExt" == tempOpt.widSrc) {//WID-635: Collect source of widget from chrome extension
				stlib.gaLogger.gaLog("Widget_source","Chrome Extension", "OAuth Complete");
			}

			//console.log('in loginonsuccess');
			stlib.gaLogger.gaLog("SignIn - 5xa","Complete");
			if(response && response.status=="SUCCESS"){
				if(oAuthServiceClicked != ""){
					if(isSignedIn && usrId !== response.data.userID){
						//de-select all major services
						shareWidget.resetLoadingUI();
					}

					shareWidget.autoSelectService(oAuthServiceClicked); //This is to auto select oAuthed service just after oAuth success
					oAuthServiceClicked = "";
				}
				usrId = response.data.userID; //ID os current user is stored in this variable

				isSignedIn = true;
				_userInfo.email=response.data.email;
				_userInfo.name=response.data.name;
				_userInfo.nickname=response.data.nickname;
				_userInfo.recents=response.data.recipients;
				if(_userInfo.recents!==null){
					stlib.cookie.setCookie('recents',stlib.json.encode(_userInfo.recents));
				}
				//	chicklets=response.data.socialShares;
				_userInfo.display=_userInfo.email;
				_userInfo.currentUserType=response.data.CurrentUserType;
				_userInfo.thirdPartyUsers=response.data.ThirdPartyUsers;
				_userInfo.thirdPartyTypes=response.data.ThirdPartyTypes;
				//Used for deterministic logging
				_userInfo.sta=response.data.staHash;

				var serviceReplaceNames = ["facebook", "twitter", "linkedin"];
				for (var c=0; c<serviceReplaceNames.length; c++) {
					if (_userInfo.thirdPartyUsers!=null && _userInfo.thirdPartyUsers[serviceReplaceNames[c]]!=null) {
						if(_userInfo.email!=null)
							_userInfo.thirdPartyUsers[serviceReplaceNames[c]]=_userInfo.email;
						if(_userInfo.name!=null)
							_userInfo.thirdPartyUsers[serviceReplaceNames[c]]=_userInfo.name;
					}
				}

				var shareWidgetOptions=shareWidget.getConfigOptions();
				if((shareWidgetOptions.publisherMigration == true) && (!oAuthGALogged)){
					if(oAuthService == "twitter" || oAuthService == "facebook" || oAuthService == "linkedin" ||
						oAuthService == "yahoo" || oAuthService == "google")
					{
						stlib.gaLogger.gaLog("OAuth-Migration",shareWidgetOptions.publisher+","+shareWidgetOptions.hostname, oAuthService);
						oAuthGALogged = true;
					}
					oAuthService = "";
				}

				stlib.cookie.setCookie('stOAuth',stlib.json.encode(_userInfo.thirdPartyUsers), 365);
				stlib.cookie.setCookie('sta',encodeURIComponent(_userInfo.sta), 365);
				if((_userInfo.thirdPartyUsers != null) && (_userInfo.thirdPartyUsers != false) && typeof(_userInfo.thirdPartyUsers) != "undefined"){
					isOauthLinked = true;
				}

				//Update HTML5 localstorage
				if(stlib.cookie.hasLocalStorage()) {
					var sut = stlib.cookie.getCookie('ShareUT');
					var storage = window.localStorage;
					if (_userInfo.email!=null){storage.email=_userInfo.email;}
					if (_userInfo.name!=null){storage.name=_userInfo.name;}
					if (_userInfo.nickname!=null){storage.nickname=_userInfo.nickname;}
					if (_userInfo.currentUserType!=null){storage.currentUserType=_userInfo.currentUserType;}
					if (_userInfo.thirdPartyUsers!=null){
						for (var c=0; c<serviceReplaceNames.length; c++) {
							if (_userInfo.thirdPartyUsers!=null && _userInfo.thirdPartyUsers[serviceReplaceNames[c]]!=null) {
								if(_userInfo.email!=null)
									_userInfo.thirdPartyUsers[serviceReplaceNames[c]]=_userInfo.email;
								if(_userInfo.name!=null)
									_userInfo.thirdPartyUsers[serviceReplaceNames[c]]=_userInfo.name;
							}
						}
						storage.thirdPartyUsers=stlib.json.encode(_userInfo.thirdPartyUsers);
					}
					if (_userInfo.thirdPartyTypes!=null){storage.thirdPartyTypes=_userInfo.thirdPartyTypes;}
					//if (_userInfo.recents!=null){storage.recents=_userInfo.recents;}
					if (_userInfo.recents!=null){storage.recents=stlib.json.encode(_userInfo.recents);}

					if (_userInfo.contacts!=null){storage.contacts=_userInfo.contacts;}
					if (_userInfo.facebookFriends!=null){storage.facebookFriends=_userInfo.facebookFriends;}
					if (_userInfo.sta!=null){storage.sta=encodeURIComponent(_userInfo.sta);}
				}
				shareWidget.postLoginWidget();
			}
			else
			{
				shareWidget.showError(lang.strings['msg_failed_login']);
				getUserInfoTimer = setTimeout(stUser.checkLogin, 10000);
			}
		},
		checkForAccountLinkingCookie : function()
		{
			var authCookie = stlib.cookie.getCookie("ShareAL");
			if ((authCookie == false) || (authCookie == "undefined") || (typeof(authCookie) == "undefined")) {
				if( (stlib.cookie.checkCookiesEnabled() == false) && (stlib.cookie.hasLocalStorage() == true)){
					authCookie = localStorage['ShareAL'];
				}
			}

			if (authCookie) {
				stlib.gaLogger.gaLog("Linking Successful - 5xa", authCookie);
				if(stlib.cookie.hasLocalStorage()) {
					localStorage.removeItem('ShareAL');
				}
				stlib.cookie.deleteCookie('ShareAL');
				clearInterval(accountLinkingPoller);
				stUser.checkLogin();
				// For Email Share, we are checking localstorage thirdPartyTypes is set or not and it takes time to complete the request on sharethis.com so added extra check below
				if( (stlib.cookie.checkCookiesEnabled() == false) && (stlib.cookie.hasLocalStorage() == true)){
					var getUserInfoThirdPartyTypes = setTimeout(function(){
							var thirdPartyTypes = localStorage['thirdPartyTypes'];
							if ((thirdPartyTypes == false) || (thirdPartyTypes == "undefined") || (typeof(thirdPartyTypes) == "undefined") ) {
								stUser.checkLogin();
							}
					},3000);
				}
				clearInterval(accountLinkingPoller);
			}
		},
		checkForLoginCookie : function()
		{
			var authCookie = stlib.cookie.getCookie("ShareAL"), ShareUT = false;
			oAuthService = authCookie;

			if (authCookie) {
				stlib.gaLogger.gaLog("Linking Successful - 5xa", authCookie);
				stlib.cookie.deleteCookie('ShareAL');
			}

			ShareUT = stlib.cookie.getCookie('ShareUT');
			if ((ShareUT == false) || (ShareUT == "undefined") || (typeof(ShareUT) == "undefined")) {
				if( (stlib.cookie.checkCookiesEnabled() == false) && (stlib.cookie.hasLocalStorage() == true)){
					ShareUT = localStorage['ShareUT'];
				}
			}

			if ((ShareUT !== false) && (ShareUT != "undefined") && (typeof(ShareUT) !== "undefined") && !isSignedIn) {
				stlib.gaLogger.gaLog("Login Successful - 5xa", 'Thru SignIn Page Or Linking');
				clearInterval(loginPoller);
				stUser.checkLogin();
				clearInterval(loginPoller);
			}
		}
	};
}();

/*********************WIDGET OBJECT**************************/

var shareWidget = function() {

	var _themeNames = [];
	_themeNames[1] = 'themeOne';
	_themeNames[2] = 'themeTwo';
	_themeNames[3] = 'themeThree';
	_themeNames[4] = 'themeFour';
	_themeNames[5] = 'themeFive';
	_themeNames[6] = 'themeSix';
	_themeNames[7] = 'themeSeven';
	_themeNames[8] = 'themeEight';
	_themeNames[9] = 'themeNine';

	var  _config = {};
	_config.oldURL=null;
	_config.URL=null;
        _config.short_url=null; //SA-77: introduce new st_short_url parameter
	_config.title=null;
	_config.sessionID=null;
	_config.fpc=null;
	_config.publisher=null;
	_config.browser=null;
	_config.services=[];
	_config.publisher=null;
	_config.icon;
	_config.content;
	_config.i18n=false;
	_config.lang=null;
	_config.guid;
	_config.guid_index;
	_config.published;
	_config.author;
	_config.updated;
	_config.summary='';
	_config.thumb='';
	_config.pThumb='';
	_config.message='';
	_config.via=null;
	_config.tags;
	_config.hostname;
	_config.location;
	_config.headerTitle;
	_config.headerfg;
	_config.purl;
	_config.top_config = {}, _config.exclusive_config={}, _config.guid_config = {}, _config.email_config = {}, _config.sms_config = {}, _config.merge_config = {}, _config.chicklet_config = {};

	_config.top_config.services = 'email,facebook,twitter,linkedin,yahoo';
	_config.exclusive_config.services=null;
	//_config.services="blogger,myspace,digg,aim,stumbleupon,messenger"; //this is from publisher and for default ordering
	_config.displayServices=[];
	_config.topDisplayServices=[];
	_config.chickletNumber=6;
	_config.guid_config.index=0;
	_config.page="home";
	_config.toolbar=false;
	_config.metaInfo=null;
	_config.mainCssLoaded=false;
	_config.pageTracker=null;
	_config.pubTracker=null;
	_config.tracking=false;
	_config.lastURL=null; //indicates last url shortned, prevents re-calling of creatShar ajax call
	_config.sharURL=null;
	_config.poster=null; //indicates which poster service is in use
	_config.linkfg=null;
	_config.email_config.service=true;
	_config.sms_config.service=true;
	_config.merge_config.list=true; ///merge all services into list by default
	_config.chicklet_loaded=false;
	_config.initWidget=false;
	_config.ga=null;
	_config.popup=false;
	_config.cssInterval=null;
	_config.stLight=false;
	_config.doneScreen=true;
	_config.urlhash=null;
	_config.theme=1;
	_config.headerText = '';
	_config.customColors={
		serviceBarColor: '',
		shareButtonColor: '',
		footerColor: '',
		headerTextColor: '',
		helpTextColor: '',
		mainWidgetColor: '',
		textBoxFontColor: ''
	};
	_config.excludeServices=null;
	_config.minorServices=true;
	_config.iconsLoaded=false;
	_config.facebookFriends=null;
	_config.customUrlPassed=false;
	_config.shorten=true;
	_config.publisherGA=null;
	_config.isFromSignWidget=false;//WID-642
	_config.widSrc=null;//WID-642

	var _container = document.getElementById('outerContainer');
	var _postServicesQueue = new Array();

	var _popupWidths = {};
	_popupWidths['facebook'] = '450';
	_popupWidths['twitter'] = '684';
	_popupWidths['yahoo'] = '500';
	_popupWidths['google'] = '550';
	_popupWidths['linkedin'] = '600';

	var _popupHeights = {};
	_popupHeights['facebook'] = '300';
	_popupHeights['twitter'] = '718';
	_popupHeights['yahoo'] = '460';
	_popupHeights['google'] = '400';
	_popupHeights['linkedin'] = '433';

	var _shownDone = false;
	var _shareToWordpress = false;
	var _shareToAtt = false;
	var _noServicesError = false;
	var _currentURL = '';
	var _shareToTwitter = false;
	var _shareToFacebook = false;
	var _sharFetched = false;
	var _urlInfoFetched = false;
	var _sharClearedOnce = false;
	var _twitterMessagePopulated = false;


	function createServiceLink(service)
	{
		var otherClass=" rpChicklet";
		if(_config.chicklet_loaded==true)
		{
			otherClass=" ckimg";
		}

		if(service=="wordpress"){
			var a = document.createElement('a');
			a.className = service;
			a.className+=otherClass;
			a.setAttribute('title', stlib.allServices[service].title);
			a.setAttribute('id', "post_"+service+"_link");
			if(a.attachEvent){
				a.attachEvent('onclick',function(){shareWidget.createWordpressScreen();});
			}else{
				a.setAttribute('onclick', 'shareWidget.createWordpressScreen()');
			}
			a.setAttribute('href', 'javascript:void(0);');
			a.appendChild(document.createTextNode(stlib.allServices[service].title));
			if(_config.linkfg!=null){a.style.color=_config.linkfg;}
			return a;
		}else if(service=="email") { // we want to give a different click event for the email button
			var a = document.createElement('a');
			a.className = service;
			a.className+=otherClass;
			a.setAttribute('title', stlib.allServices[service].title);
			a.setAttribute('id', "post_"+service+"_link");
			if(a.attachEvent){
				a.attachEvent('onclick',function(){shareWidget.showEmailScreenFromMoreServices();});
			}else{
				a.setAttribute('onclick', 'shareWidget.showEmailScreenFromMoreServices()');
			}
			a.setAttribute('href', 'javascript:void(0);');
			a.appendChild(document.createTextNode(stlib.allServices[service].title));
			if(_config.linkfg!=null){a.style.color=_config.linkfg;}
			return a;
		}else{
			var source="chicklet5x";
			var a = document.createElement('a');
			a.className = service;
			a.className+=otherClass;
			a.setAttribute('href', '#');
			a.setAttribute('title', stlib.allServices[service].title);
			a.setAttribute('id', "post_"+service+"_link");
			a.setAttribute('stservice', service);
			if(a.attachEvent){
				a.attachEvent('onclick',function(){shareWidget.serviceClicked(a);});
			}else{
				a.setAttribute('onclick', 'shareWidget.serviceClicked(this);');
			}
			a.appendChild(document.createTextNode(stlib.allServices[service].title));
			if(_config.linkfg!=null){a.style.color=_config.linkfg;}
			return a;
		}
	}

	// This is to reset UI on click of Share Again link
	function shareAgainClicked(e){
		shareWidget.resetLoadingUI();
		shareWidget.showHome();
	}
	// This is to log GA log and clear box on focus of text boxes
	function searchFocus(e){
		e = e || window.event;
		var searchBox = e.target || e.srcElement;

		if(searchBox.value==lang.strings[searchBox.id]){
			searchBox.value="";
		}
		stlib.gaLogger.gaLog(searchBox.id+" - 5xa","focus");
	}
	function searchBlur(e){
		e = e || window.event;
		var searchBox = e.target || e.srcElement;

		if(searchBox.value==""){
			searchBox.value = lang.strings[searchBox.id];
		}
	}

	function searchAndDisplay(e){
		e = e || window.event;
		var searchBox = e.target || e.srcElement;

		//replaceStyles(true);
		var searchTerm = searchBox.value;
		var element=document.getElementById('chicklets');
		if(searchTerm == "") {
			displaySmallChicklets(stlib.allServices);
			return;
		}

		try{var pReg = new RegExp("^" + searchTerm, "gi");}catch(err){return false;}
		try{var reg = new RegExp(searchTerm, "gi");}catch(err){return false;}

		var matchesKeysCount = 0, matches = [], pMatches = [];
		delete stlib.allServices.sharebox;
		//search for all matches in case you want to do something with them later (Legacy, left for future use)
		for(var i in stlib.allServices){
			var text=stlib.allServices[i].title;
			if(pReg.test(text)==true){
				pMatches[i] = stlib.allServices[i];
				matchesKeysCount++;
			}else if(reg.test(text)==true){
				matches[i] = stlib.allServices[i];
				matchesKeysCount++;
			}else{
				/*if(reg.test(text)==true){
					//console.log("not match:"+i);
				}*/
			}
		}

		for (var key in matches){
			if (matches.hasOwnProperty(key)){
				pMatches[key] = matches[key];
			}
		}
       	if(matchesKeysCount > 0){
       		displaySmallChicklets(pMatches);
       	}

		shareWidget.lastSearchTerm=searchTerm;
		return true;
	}

	function customizeServiceList()
	{
		if(!_config.minorServices){
			domUtilities.addClassIfNotPresent('null', 'moreLink', 'sts-dn');
		}

		if(typeof(_config.excludeServices)!='undefined' && _config.excludeServices!=null && _config.excludeServices!=''){
			var serviceName='', tempArr=_config.excludeServices.split(","), servicesList = domUtilities.searchElementsByClass("serviceDisplay", "a", document.getElementById('services'));
			for(i in servicesList){

				serviceName = servicesList[i].getAttribute('data-value');
				if(inArray(serviceName,tempArr)){
					domUtilities.addClassIfNotPresent(servicesList[i], '', 'sts-dn');
				}
			}
		}
		//console.log("customizeServiceList- finished");
	}

	function displaySmallChicklets(servicesToList)
	{
		var newNode;
		var element=document.getElementById('chicklets');
		element.innerHTML = "";

		// We don't want sharethis service to show up
		if (typeof(servicesToList.sharethis)!="undefined")
			delete servicesToList.sharethis;

		for(var i in servicesToList){
			if(i == "whatsapp" || i == "kik") continue; //Feature wid-123 && WID-443
			newNode = createServiceLink(i);
			if(newNode != null) {
				// We want to add Email service as a top service in More Services section (WID-152). If we change the Email Position in allServices array then it will affect the other flows such as Get Sharing Flow, Wordpress/Drupal Plugins etc.
				if (i == "email") {
					element.insertBefore(newNode,element.firstChild);
				}else {
					element.appendChild(newNode);
				}
			}
		}
		domUtilities.replaceClass('rpChicklet','ckimg');
		_config.chicklet_loaded = true;
	}

	function getMainCss(){

		if(_config.mainCssLoaded==false){
      var fileSrc = "https://ws.sharethis.com/secure5x/css/share.f06aa6247f5143d42d9d8339457c4a60.css";
			stlib.scriptLoader.loadCSS(fileSrc,function(){
				document.getElementsByTagName('body')[0].style.display="block";
			});
      fileSrc = "https://ws.sharethis.com/css/font-awesome/css/font-awesome.min.css";
			stlib.scriptLoader.loadCSS(fileSrc,function(){},true);
			_config.mainCssLoaded=true;
		}else{
			return false;
		}
	}

	function extractDomainFromURL(url, keepWWW) {
	  try{var domain = url.replace(/(\w+):\/\/([^\/:]+)(:\d*)?([^# ]*)/, '$2');
		  if (!keepWWW && domain.toLowerCase().indexOf('www.') == 0) {
			  domain = domain.substring(4);
		  }
		  domain=domain.replace(/#.*?$/,''); //replace #onwards
		  return domain;
	  }catch(err){
		  return null;
	  }
	}

	/**************DONE SCREEN ************************/

	function getCount()
	{
		var sMsg, remainingSpace;
		var mBox=document.getElementById('shareMessage');
		if(mBox.getAttribute('placeholder')==mBox.value){
			sMsg = '';
		} else{
			sMsg = mBox.value;
		}
		/*var sharString = ' - ' + _config.title + ' - ';
		if(sharString.length > 40) {
			remainingSpace = 140 - text.length - 40 - 25;
		} else {
			remainingSpace = 140 - text.length - sharString.length - 25;
		}
		return remainingSpace;*/
		return sMsg.length;
	}

	function updateCharCount()
	{
		var charCount = getCount();
		var elemCounter = document.getElementById('charCounter');
		if(charCount>117){
			//document.getElementById('charCounter').style.color='#ff2222';
			domUtilities.removeClassIfPresent(elemCounter, '', 'pos');
			domUtilities.addClassIfNotPresent(elemCounter, '', 'neg');
		}else{
			//document.getElementById('charCounter').style.color='#aaa';
			domUtilities.removeClassIfPresent(elemCounter, '', 'neg');
			domUtilities.addClassIfNotPresent(elemCounter, '', 'pos');
		}
		//document.getElementById('charCounter').innerHTML = 117 - charCount;
		elemCounter.innerHTML = 117 - charCount;
	}

	function bigServiceIconClicked(e)
	{

		if(_noServicesError)
		{
			shareWidget.hideError();
		}

		e = e || window.event;
		var target = e.target || e.srcElement;
		if(target.tagName!='A') {
			target = target.parentNode;
		}

		var service = target.getAttribute('data-value');
		stlib.data.resetShareData();
		stlib.data.set("url",_config.URL,"shareInfo");

		//SA-77: introduce new st_short_url parameter
		stlib.data.set("short_url",_config.short_url,"shareInfo");

		stlib.data.set("shorten",_config.shorten,"shareInfo");
		stlib.data.set("title",_config.title,"shareInfo");
		stlib.data.set("buttonType",_config.type,"shareInfo");
		stlib.data.set("destination",service,"shareInfo");
		stlib.data.setSource("5x", _config);
		if(service=="twitter" && _config.via != null){
			stlib.data.set("via", _config.via, "shareInfo");
		}

		if(typeof(_config.thumb)!='undefined' && _config.thumb!=null){
			stlib.data.set("image",_config.thumb,"shareInfo");
		}if(typeof(_config.summary)!='undefined' && _config.summary!=null){
			stlib.data.set("description",_config.summary,"shareInfo");
		}if(_config.message!=''){
			stlib.data.set("message",_config.message,"shareInfo");
		}

		stlib.sharer.share(null, _config.servicePopup);
	}

	function prepareMultiShare()
	{
		if(domUtilities.hasClass(document.getElementById('shareButton'), 'emailFade')){
			return;
		}

		if (_postServicesQueue.length == 1 && _postServicesQueue[0].search('facebookfriend')!='-1')
		{
			if(jsUtilities.trimString(document.getElementById('txtFriendsName').value)=='')
			{
				_postServicesQueue=[];
			}
		}

		if(_shareToWordpress)
		{
			poster.postToWordpress();
		}
		else if(_shareToAtt)
		{
			poster.postToAtt();
		}
		else if(_postServicesQueue.length == 0)
		{
			//console.log('no services selected error..');
			shareWidget.showError(lang.strings['msg_no_services_selected']);
			_noServicesError = true;
		}
		else if(_shareToTwitter)
		{
			shareWidget.beginMultiShare();
		}
		else{
			poster.createShar(_config.URL);
			clearInterval(sharPoller);
			sharPoller = setInterval( function(){
				if(poster.getSharURL() != ''){
					clearInterval(sharPoller);
					shareWidget.beginMultiShare();
					clearInterval(sharPoller);
				}
			}, 1000);
		}
	}

	function inArray(value,arr)
	{
		// Returns true if the passed value is found in the array. Returns false if it is not.
		for (var i=0; i < arr.length; i++){
			if (arr[i] == value){
				return true;
			}
		}
		return false;
	}

	function addServiceToShareQueue(serviceName)
	{
		if(typeof(_config.excludeServices)!='undefined' && _config.excludeServices!=null && _config.excludeServices!=''){
			var arr=_config.excludeServices.split(",");
			if(inArray(serviceName,arr)){return;}
		}
		var cookieName = 'st_' + serviceName + '_uncheck';
		if(stlib.cookie.getCookie(cookieName)!==false){
			//user does not want this one checked
			return;
		}

		var serviceIcon = null, servicesList = domUtilities.searchElementsByClass("serviceDisplay", "a", document.getElementById('services'));
		if(typeof(servicesList)!='undefined'){
			for(i in servicesList){
				if(serviceName == (servicesList[i].getAttribute('data-value'))){
					serviceIcon = servicesList[i];
					break;
				}
			}
		}

		if(serviceIcon != null)
		{
			domUtilities.removeClassIfPresent(serviceIcon, '', 'unchecked');
			domUtilities.addClassIfNotPresent(serviceIcon, '', 'checked');

			if(serviceName=='twitter')
			{
				_shareToTwitter = true;
				var shar;
				var msgBox = document.getElementById('shareMessage');
				domUtilities.removeClass('null', 'charCounter', 'sts-dn');
				//updateCharCount();
				domUtilities.addListenerCompatible(msgBox, 'keyup', updateCharCount);
				msgBox.setAttribute('maxlength', 117);
				if(!_sharClearedOnce) {
					poster.clearSharURL();
					_sharClearedOnce = true;
				}
				poster.createShar(_config.URL);
				clearInterval(sharPoller);
				sharPoller = setInterval( function(){
					shar = poster.getSharURL();
					if(shar!=''){
						clearInterval(sharPoller);
						_sharFetched = true;
						populateTwitterBox();
						clearInterval(sharPoller);
					}
				}, 1000);
			}
			else if(serviceName=='facebook')
			{
				_shareToFacebook = true;
				domUtilities.removeClass('null', 'friendsWall', 'sts-dn');
				if( document.all && (navigator.appVersion.indexOf('MSIE 7.')!=-1 || (navigator.appVersion.indexOf('MSIE 6.')!=-1)) )
				{
					document.getElementById('extraInfo').style.position = 'relative';
					document.getElementById('extraInfo').style.top = '5px';

					document.getElementById('helpText').style.position = 'relative';
					document.getElementById('helpText').style.top = '10px';
				}
			}
			_postServicesQueue.push(serviceName);
			stlib.gaLogger.gaLog('Added Service To Share Queue - 5xa', serviceName);
		}
	}

	function populateTwitterBox()
	{
		//console.trace();
		//console.log('in populateTwitterBox ', _twitterMessagePopulated, _sharFetched, _urlInfoFetched);
		if(!_twitterMessagePopulated)
		{
			if(_sharFetched && _urlInfoFetched )
			{
				domUtilities.removeClass('null', 'charCounter', 'sts-dn');
				clearInterval(sharPoller);

                                //SA-77: introduce new short_url parameter
                                var tempUrl = (_config.short_url != "" && _config.short_url != null) ? _config.short_url : poster.getSharURL();

				if(document.getElementById('headline').innerHTML==''){
					var appendString = tempUrl;
				}else{
					var appendString =  _config.title + ' ' + tempUrl;
				}
				var mBox=document.getElementById('shareMessage');
				if(mBox.value != mBox.getAttribute('placeholder')){
					var tempTwitterMsg = mBox.value;
				}else{
					var tempTwitterMsg = "";
				}
				var initialLength = tempTwitterMsg.length;
				if(mBox.getAttribute('placeholder') == tempTwitterMsg){
					tempTwitterMsg = appendString;
				} else {
					if (tempTwitterMsg == ""){
						tempTwitterMsg += appendString;
					}else{
						tempTwitterMsg += ' '+appendString;
					}
				}
				var strVia = (!(_config.via))?' via @sharethis':' via @'+_config.via;

				var sizeDiff = (117 - (tempTwitterMsg + strVia).length);
				if(sizeDiff < 0){
					tempTwitterMsg = tempTwitterMsg.substring(0,(tempTwitterMsg.length - (' '+tempUrl).length));
					if(tempTwitterMsg.length > (-1 * sizeDiff)){
						tempTwitterMsg = tempTwitterMsg.substring(0,(tempTwitterMsg.length + sizeDiff));
						tempTwitterMsg += ' '+tempUrl;
					}else{
						tempTwitterMsg = tempUrl;
					}
				}

				tempTwitterMsg += strVia;
				mBox.value = tempTwitterMsg;
				updateCharCount();
				mBox.setAttribute('twMsgSize', (tempTwitterMsg.length - initialLength));
				_twitterMessagePopulated = true;
			}
			else if(_sharFetched)
			{
				clearInterval(sharPoller);
			}
		}
	}

	function signInToWidget()
	{
		var enableTPC = '';

		//WID-642
		if("newhb" == _config.widSrc) {
			//This flag is used to generate widget source log from loginOnSuccess method.
			//As loginOnSuccess method is called for both widget siginin and OAuth, so this flag checks if the signin was done through signin widget popup.
			_config.isFromSignWidget=true;
			stlib.gaLogger.gaLog("Widget_source","Reskin Hoverbar", "Attempting signin widget");
		} else if ("chrExt" == _config.widSrc) {// WID-635
			_config.isFromSignWidget=true;
			stlib.gaLogger.gaLog("Widget_source","Chrome Extension", "Attempting signin widget");
		}

		if((stlib.cookie.checkCookiesEnabled() == false) && (stlib.cookie.hasLocalStorage() == false)) {
			enableTPC = '?enableTPC=true';
		}
		window.open( "https://sharethis.com/account/signin-widget"+enableTPC, "LoginWindow","scrollbars=1, status=1, height=450, width=970, resizable=1" );
		clearInterval(loginPoller);
		loginPoller = setInterval(stUser.checkForLoginCookie, 1000);
		stlib.gaLogger.gaLog("SignIn - 5xa","Click");
	}

	function signOutFromWidget()
	{
		_postServicesQueue = new Array();
		domUtilities.addClassIfNotPresent('null', 'signOut', 'sts-dn');
		domUtilities.removeClassIfPresent('null', 'signIn', 'sts-dn');

		document.getElementById('welcomeMsg').innerHTML = lang.strings['msg_share'];

		document.getElementById('emailshareHeading').innerHTML = '<span class="userName"><a href="javascript:void(0);" id="closeEmailLink" class="backToDefault goBackLink checked" data-value="email" title="Close" onclick="shareWidget.closeEmailWidget();">Close</a></span> <em>' + lang.strings['email_msg_share'] + '</em>';

		stUser.signOut();
		_config.isFromSignWidget=false;//WID-642
		if(typeof(email)!=="undefined")
		{
			domUtilities.addClassIfNotPresent('null', 'recents', 'sts-dn'); //hide recents
		}

		domUtilities.replaceClass('checked', 'unchecked');
		domUtilities.replaceClass('ununchecked', 'unchecked');

		if (_shareToTwitter){
			_shareToTwitter=false;
		}

		hideFacebookFriendsLink();
		document.getElementById('shareMessage').value = document.getElementById('shareMessage').getAttribute('placeholder');

		shareWidget.showHome();
	}

	function getURLInfo()
	{
		//console.log('url = ' + _config.URL);
		//console.log('purl = ' + _config.pUrl);
		//_config.URL = "http://www.boston.com/bigpicture/2010/11/great_migrations.html";

		var data=['return=json',"url="+encodeURIComponent(_config.URL),"cb=shareWidget.fillURLInfo","service=getLiveUrlInfo"];
		data=data.join('&');
		jsonp.makeRequest("https://ws.sharethis.com/api/getApi.php?"+data);
	}

	function afterFillingArticleDetails(wasSuccess)
	{
		if(wasSuccess)
		{
			domUtilities.removeClass('null', 'articleDetails', 'sts-dn');
		}
		_urlInfoFetched = true;

		//console.log('in afterFillingArticleDetails ', _shareToTwitter, _sharFetched);
		if(_shareToTwitter)
		{
			var shar;
			if(!_sharFetched){
				poster.createShar(_config.URL);
				clearInterval(sharPoller);
				sharPoller = setInterval( function(){
					shar = poster.getSharURL();
					if(shar!=''){
						clearInterval(sharPoller);
						_sharFetched = true;
						populateTwitterBox();
						clearInterval(sharPoller);
					}
				}, 1000);
			}
			else
			{
				populateTwitterBox();
			}
		}
	}

	function initFacebookFriends()
	{
		domUtilities.addClassIfNotPresent('null', 'postFriendsLink', 'sts-dn');
		domUtilities.removeClassIfPresent('null', 'friendsInputWrapper', 'sts-dn');
		if(typeof(facebook)=="undefined")
		{
			stlib.scriptLoader.loadJavascript("https://ws.sharethis.com/secure5x/js/facebook.js",function(){});
		}
		else
		{
			facebook.getFacebookFriends(true);
		}
		stlib.gaLogger.gaLog("Facebook Friends Wall - 5xa","Click");
	}

	function cancelFacebookFriends()
	{
		shareWidget.hideError();
		domUtilities.addClassIfNotPresent('null', 'friendsInputWrapper', 'sts-dn');
		domUtilities.removeClassIfPresent('null', 'postFriendsLink', 'sts-dn');
		document.getElementById('txtFriendsName').value = '';
		domUtilities.removeClassIfPresent('null', 'txtFriendsName', 'friendSelected');
		stlib.gaLogger.gaLog("Facebook Friends Wall - 5xa","Cancel");
	}

	function hideTwiterMessage(){
		var mBox = document.getElementById('shareMessage');
		if(mBox.value != mBox.getAttribute('placeholder')){
			if(parseInt(mBox.getAttribute('twMsgSize')) != null){
				if(parseInt(mBox.getAttribute('twMsgSize')) > 0){
					mBox.value = mBox.value.substr(0, (mBox.value.length)-(parseInt(mBox.getAttribute('twMsgSize'))));
				}else{
					mBox.value = mBox.getAttribute('placeholder');
				}
				mBox.setAttribute('twMsgSize', 0);
				_twitterMessagePopulated = false;
			}
		}
	}

	function hideFacebookFriendsLink()
	{
		domUtilities.addClass('null', 'friendsWall', 'sts-dn');
		if( document.all && (navigator.appVersion.indexOf('MSIE 7.')!=-1 || (navigator.appVersion.indexOf('MSIE 6.')!=-1)) )
		{
			document.getElementById('extraInfo').style.position = 'static';
			document.getElementById('extraInfo').style.top = 'auto';

			document.getElementById('helpText').style.position = 'static';
			document.getElementById('helpText').style.top = 'auto';
		}
		document.getElementById('txtFriendsName').value = '';
		domUtilities.removeClassIfPresent('null', 'txtFriendsName', 'friendSelected');
	}

	function customizeWidgetColors()
	{
		if(_config.customColors.helpTextColor!=''){
			document.getElementById('helpText').style.color = _config.customColors.helpTextColor;
		}

		if(_config.customColors.shareButtonColor!=''){
			document.getElementById('shareButton').style.background = _config.customColors.shareButtonColor;
		}

		if(_config.customColors.headerTextColor!=''){
			document.getElementById('welcomeMsg').style.color = _config.customColors.headerTextColor;
			document.getElementById('doneMsg').style.color = _config.customColors.headerTextColor;
		}

		if(_config.customColors.textBoxFontColor!='')
		{
			var textBoxes = document.getElementsByTagName('textarea');
			for(i=0; i<textBoxes.length; i++)
			{
				textBoxes[i].style.color = _config.customColors.textBoxFontColor;
			}

			textBoxes = document.getElementsByTagName('input');
			for(i=0; i<textBoxes.length; i++)
			{
				textBoxes[i].style.color = _config.customColors.textBoxFontColor;
			}
		}
	}
	// WID-152  This function is responsible for showing the new Email Workflow Screen
	function showExternalEmailScreen()
	{
		stlib.scriptLoader.loadCSS("https://ws.sharethis.com/secure5x/css/emailShare.css",function(){},true);

		domUtilities.removeClassIfPresent('null', 'loadingUrlInfo', 'sts-dn');
		domUtilities.addClassIfNotPresent('null', 'serviceCTAs', 'sts-dn');
		domUtilities.addClassIfNotPresent('null', 'welcomeMsg', 'sts-dn');
		domUtilities.removeClassIfPresent('null', 'emailshareHeading', 'sts-dn');
		domUtilities.addClassIfNotPresent('null', 'emailShareDetails', 'sts-dn');
		document.getElementById('shareMessage').style.display = "none";
		domUtilities.addClassIfNotPresent('null', 'extraInfo', 'sts-dn');
		document.getElementById('shareDetails').style.display = "none";
		document.getElementById('emailAuthentication').style.display = "block";
		domUtilities.replaceClass('emailBright','emailFade');
		domUtilities.addClassIfNotPresent('null', 'loadingUrlInfo', 'sts-dn');
		stlib.gaLogger.gaLog("New Email share page - 5xa","Opened");
	}

	// This function hides the Email Screen
	function hideExternalEmailScreen()	{
		domUtilities.removeClassIfPresent('null', 'loadingUrlInfo', 'sts-dn');
		domUtilities.removeClassIfPresent('null', 'emailShareDetails', 'sts-dn');
		domUtilities.addClassIfNotPresent('null', 'serviceCTAs', 'enabled');
		document.getElementById('shareMessage').style.display = "block";
		domUtilities.removeClassIfPresent('null', 'extraInfo', 'sts-dn');
		document.getElementById('articleDetails').style.display = "block";
		document.getElementById('shareDetails').style.display = "block";
		document.getElementById('emailAuthentication').style.display = "none";
		domUtilities.replaceClass('emailFade','emailBright');
		domUtilities.removeClassIfPresent('null', 'welcomeMsg', 'sts-dn');
		domUtilities.addClassIfNotPresent('null', 'emailshareHeading', 'sts-dn');
		domUtilities.addClassIfNotPresent('null', 'loadingUrlInfo', 'sts-dn');
	}

	function emailShareOAuth(e)	{
		shareWidget.hideError();
		domUtilities.removeClassIfPresent('null', 'loadingUrlInfo', 'sts-dn');
		e = e || window.event;
		var target = e.target || e.srcElement;
		if(target.tagName!='A') {
			target = target.parentNode;
		}

		var serviceType = target.getAttribute('data-value');
		shareWidget.beginOAuth(serviceType);
		stlib.gaLogger.gaLog("New Email share page - 5xa","OAuth_"+serviceType);
		domUtilities.addClassIfNotPresent('null', 'loadingUrlInfo', 'sts-dn');
	}

	function reOAuthService(e){
		domUtilities.removeClassIfPresent('null', 'loadingUrlInfo', 'sts-dn');
		e = e || window.event;
		var target = e.target || e.srcElement;
		if(target.tagName!='A') {
			target = target.parentNode;
		}

		var serviceType = target.getAttribute('data-value');
		reAuthedService = serviceType;
		shareWidget.beginOAuth(serviceType);
		domUtilities.addClassIfNotPresent('null', 'loadingUrlInfo', 'sts-dn');
	}

	function urlEncodeCharacter(c)
	{
		return '%' + c.charCodeAt(0).toString(16);
	}

	function urlEncode( s )
	{
		return escape(s);
	}

	/*
	 * Function: getExternalEmailBody
	 * Parameters:
	 *  1. serviceType: Which email service button is clicked
	 *  	- Possible values:
	 *  		1.1 'gmail' - Gamil button is clicked
	 *  		1.2 'yahoo' - Yahoo button is clicked
	 *  		1.3 'outlook' - Outlook button is clicked
	 *  		1.4 'mailto' - Native email button is clicked
	 *  2. sharURLValue: Shortened URL
	 *  	- Possible values:
	 *  		2.1 '' - If URL is not shortened, due to some reason
	 *  		2.2 Shortened URL
	 *  3. trimData: Flag to trim data in case of very long data to share
	 *  	- Possible values:
	 *  		3.1 null - If data trimming is not required (Limited data being shared)
	 *  		3.2 1 - If data is too long for GET request but can be managed if description is removed from it
	 *  		3.3 2 - If data is too long for GET request and can not be managed by removing description only,
	 *  			  then comment is also removed from sharing data
	 *
	 */

	function getExternalEmailBody(serviceType, sharURLValue, trimData)
	{
		// If trimData == 1: Remove Description from message
		// If trimData == 2: Remove Description and Comment both from message

		var comment="";
		if(trimData != 2){
			comment=document.getElementById('shareMessage').value;
			if(comment==lang.strings['shareMessage'] || comment=="write your comment here..."){comment='';}
			var urlInComment = comment.match(/http:\/\/.*shar.es/);
			if( urlInComment){
				comment = comment.slice(0, comment.indexOf(urlInComment));
			}
		}

		var emailData={
				type:_config.type,
				recipients:"",
				url: _config.URL,
				title:(_config.title),
				comment: comment,
				thumbnail:_config.thumb,
				embed:_config.content,
				description:_config.summary,
				tags:_config.tags,
				sharURL:(sharURLValue != '')?sharURLValue:_config.URL
			};

		var st_signature = 'This message was sent using ShareThis (https://www.sharethis.com)';
		var newLineSpacer = '\r\n\r\n';

                //SA-77: introduce new st_short_url parameter
                if(_config.short_url != "" && _config.short_url != null)
                    emailData.sharURL = _config.short_url;

		if(serviceType == "mailto"){
			newLineSpacer = urlEncode(newLineSpacer);
			if(emailData.comment){
				emailData.comment = emailData.comment.replace(/%/g, urlEncodeCharacter );
			}
			if(emailData.description){
				emailData.description = emailData.description.replace(/%/g, urlEncodeCharacter );
			}
		}

		//var YahooEmailMessage = emailData.sharURL+'.'+newLineSpacer+st_signature;
		var emailMessage = emailData.sharURL;
		if(emailData.comment && trimData != 2){
			emailMessage = emailData.comment+newLineSpacer+emailMessage;
		}
		if(emailData.description && trimData != 1 && trimData != 2){
			emailMessage += newLineSpacer+emailData.description;
		}
		emailMessage += newLineSpacer+st_signature;

		var YahooEmailMessage = emailMessage; // assign the same Gmail emailMessage to Yahoo as well

		var emailTo = (emailData.recipients)?emailData.recipients:"";
		var emailSubject = (emailData.title)?emailData.title:"Message Subject";
		var emailBody = (emailMessage)?(emailMessage):"Message Body";
		YahooEmailMessage = (YahooEmailMessage)?(YahooEmailMessage):"Message Body";

		var emailServices = {};
		emailServices['gmail'] = {
			href: "https://mail.google.com/mail/?view=cm",
			su: encodeURIComponent(emailSubject),
			to: emailTo,
			body: encodeURIComponent(emailBody)
		};

		emailServices['yahoo'] = {
			href: "//compose.mail.yahoo.com/?",
			Subject: encodeURIComponent(emailSubject.replace(/%/g, urlEncodeCharacter ).replace(/&/g, urlEncodeCharacter ).replace(/#/g, urlEncodeCharacter).replace(/'/g,urlEncodeCharacter).replace( /"/g, urlEncodeCharacter ).replace(/>/g, urlEncodeCharacter).replace(/</g,urlEncodeCharacter).replace(/\\n/g,"").replace(/\\r/g,"").replace(/\\/g,"")),
			To: emailTo,
			Body: urlEncode(YahooEmailMessage.replace( /#/g, urlEncodeCharacter ).replace(/\r\n/g,'<br>'))
		};

		emailServices['outlook'] = {
			href: "//mail.live.com/default.aspx?rru=compose",
			subject: encodeURIComponent(emailSubject),
			to: emailTo,
			body: encodeURIComponent(emailBody.replace(/\r\n/g,'<br>').replace(/\(/g, '[').replace(/\)/g, ']'))
		};

		emailServices['mailto'] = {
			href: "mailto:"+emailTo+"?",
			Subject: emailSubject.replace(/%/g, urlEncodeCharacter ).replace(/&/g, urlEncodeCharacter ).replace(/#/g, urlEncodeCharacter).replace(/'/g,urlEncodeCharacter).replace( /"/g, urlEncodeCharacter ).replace(/>/g, urlEncodeCharacter).replace(/</g,urlEncodeCharacter),
			Body: emailBody.replace(/&/g, urlEncodeCharacter ).replace(/#/g, urlEncodeCharacter).replace(/'/g,urlEncodeCharacter).replace( /"/g, urlEncodeCharacter ).replace(/>/g, urlEncodeCharacter).replace(/</g,urlEncodeCharacter)
		};
		//Body: encodeURIComponent((emailBody + '').toString()).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A');//.replace(/~/g, '%7E');

		var newHref = "";
		for(var arg in emailServices[serviceType]){
			if(arg == "href"){
				newHref += emailServices[serviceType][arg];
			}else{
				if(!(serviceType == "mailto" && arg == "Subject")){
					newHref += "&";
				}
				newHref += arg+"="+emailServices[serviceType][arg];
			}
		}

		return newHref;
	}

	function clearExEmailSharPoller(arrPollersToClear)
	{
		for(var i=0; i< arrPollersToClear.length; i++){
			clearTimeout(arrPollersToClear[i]);
		}
	}

	function shareExternalEmail(winEmail, serviceType, sharURLValue)
	{
		/***
		 * Maximum characters allowed in URL is 2048
		 * But it was not working on Google so implemented 1855 by following (http://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers)
		 * Also observed that if more than 1200 characters are sent for google compose window when NOT logged in to google (It breaks on successful sign-in redirect).
		 *
		 * 655 is the maximum number of characters can be used for redirects internally by email services (I observed till 479 characters in login success redirect window in Google)
		 */
		var maxCharactersAllowedInURL = 1200; //(1855-655)

		_shareToEmail = true;
		shareWidget.updateServiceCount(_postServicesQueue[0], 'Email');

		var newHref = getExternalEmailBody(serviceType, sharURLValue, null); // Last parameter is null to trim nothing
		if(maxCharactersAllowedInURL < encodeURIComponent(newHref).length){
			newHref = getExternalEmailBody(serviceType, sharURLValue, 1); // Last parameter is 1 to remove description from data
		}
		if(maxCharactersAllowedInURL < encodeURIComponent(newHref).length){
			newHref = getExternalEmailBody(serviceType, sharURLValue, 2); // Last parameter is 2 to remove description and comments both from data
		}

		// START: ShareThis logging
        stlib.data.resetShareData();
        var ShareUT = '';
        ShareUT = stlib.cookie.getCookie('ShareUT');
        if ((ShareUT == false) || (ShareUT == "undefined") || (typeof(ShareUT) == "undefined")) {
	        if( (stlib.cookie.checkCookiesEnabled() == false) && (stlib.cookie.hasLocalStorage() == true)){
	        	ShareUT = localStorage['ShareUT'];
	        }else{
	        	ShareUT = '';
	        }
        }

        stlib.data.set("url",_config.URL,"shareInfo");

        //SA-77: introduce new st_short_url parameter
        stlib.data.set("short_url",_config.short_url,"shareInfo");

        stlib.data.set("title",_config.title,"shareInfo");
        stlib.data.set("destination",'email',"shareInfo");
        stlib.data.set("destinations",'email',"shareInfo");
        stlib.data.set("ip",'',"shareInfo");
        stlib.data.set("agent",navigator.userAgent,"shareInfo");
        stlib.data.set("clicookie",stlib.cookie.getCookie("__stid"),"shareInfo");
       	stlib.data.set("token",ShareUT,"shareInfo");
        stlib.data.set("buttonType",_config.type,"shareInfo");
        stlib.data.set("emailDestination", 'email', "shareInfo");
		stlib.data.set("sharURL", sharURLValue, "shareInfo");
		stlib.data.setSource("5x", _config);

		stlib.sharer.share(null, null);
		// END: ShareThis logging

		//stlib.logger.log("5x-External_"+serviceType);
		stlib.gaLogger.shareLog("email");
		stlib.gaLogger.gaLog("New Email share page - 5xa","External_"+serviceType);

		winEmail.location = newHref;
		if(serviceType == "mailto"){
			setTimeout(function(){winEmail.close();},1000);
		}

		//alert("target.id - "+target.id);
		domUtilities.addClassIfNotPresent('null', 'loadingUrlInfo', 'sts-dn');

		// Show minor done screen
		hideExternalEmailScreen();
		domUtilities.addClassIfNotPresent('null', 'doneScrMessage', 'minors');
		shareWidget.showMinorShareMsg();
		shareWidget.showDoneScreen(true, true);
	}

	function emailShareExternal(e)
	{
		shareWidget.hideError();
		var sharURLValue = '';
		poster.createShar(_config.URL);
		e = e || window.event;
		var target = e.target || e.srcElement;
		if(target.tagName!='A') {
			target = target.parentNode;
		}
		var serviceType = target.getAttribute('data-value')

		var removeExEmailSharPoller, exEmailSharPoller;
		var winEmail = window.open('');
		if(winEmail){
	    	var winEmailTitle = "";
			switch(serviceType){
		    	case 'gmail':
		    		winEmailTitle = 'Connecting you to GMail';
		    		break;
		    	case 'yahoo':
		    		winEmailTitle = 'Connecting you to Yahoo! Mail';
		    		break;
		    	case 'outlook':
		    		winEmailTitle = 'Connecting you to Outlook';
		    		break;
		    	case 'mailto':
		    		winEmailTitle = 'Connecting you to your native email client';
		    		break;
	    	}

			var winEmailLightbox = '<!DOCTYPE><html><head><title>'+winEmailTitle+'</title></head><body>'+
									'<div id="lightbox" style="height:41px; width:410px; z-index:+1; position:fixed; border:4px solid #ccc; top:40%; left:33%; padding:8px; background-color:#eee; text-align:center; -moz-border-radius:9px; -webkit-border-radius:9px; border-radius:9px;">'+
								        '<div style="margin-right:10px">'+
									    	'<span id="lightboxText" style="color:#777; font-family:Tahoma; font-size:1.3em;">'+winEmailTitle+'</span>'+
									    	'<span style="display:block; font-size:0.7em;color:#999; padding-top:4px;">It will be just a second..</span>'+
									     '</div>'+
								    '</div>'+
									'<div id="overlay" style="width: 99%; height: 100%; opacity: 0.9;background-color:#000;position:fixed;"></div>'+
									'</body></html>';

			winEmail.document.write(winEmailLightbox);
			exEmailSharPoller = setInterval( function(){
				sharURLValue = poster.getSharURL();
				if(sharURLValue != ''){
					clearExEmailSharPoller([exEmailSharPoller, removeExEmailSharPoller]);
					shareExternalEmail(winEmail, serviceType, sharURLValue);
				}
			}, 100);
			removeExEmailSharPoller=setTimeout(function(){
				clearExEmailSharPoller([exEmailSharPoller, removeExEmailSharPoller]);
				shareExternalEmail(winEmail, serviceType, '');
			},5000);

		}else{
			/*
			 * Show widget error message.
			 *
			 * if window open is called in context of direct user interaction, Popup-blocker should not block it.
			 * Added as a last resort in case of non-standard popup-blocker
			 *
			 */
			shareWidget.showError("Please disable your popup-blocker!");
		}
	}

	function emailGoBackClick(e){
		shareWidget.hideError();
		domUtilities.removeClassIfPresent('null', 'loadingUrlInfo', 'sts-dn');
		e = e || window.event;
		var target = e.target || e.srcElement;
		if(target.tagName!='A') {
			target = target.parentNode;
		}

		domUtilities.removeClassIfPresent(target, '', 'unchecked');
		domUtilities.removeClassIfPresent(target, '', 'checked');
		domUtilities.addClassIfNotPresent(target, '', 'checked');

		bigServiceIconClicked(e);

		/*var emailElement = shareWidget.getEmailElement();
		domUtilities.removeClassIfPresent(emailElement, '', 'checked');
		domUtilities.addClassIfNotPresent(emailElement, '', 'unchecked');*/

		stlib.gaLogger.gaLog("New Email share page - 5xa","Go Back clicked");
		domUtilities.addClassIfNotPresent('null', 'loadingUrlInfo', 'sts-dn');
	}

	function updateLastUsedEmailsUI(e){
		domUtilities.removeClassIfPresent('null', 'loadingUrlInfo', 'sts-dn');

		e = e || window.event;
		var target = e.target || e.srcElement;
		if(target.tagName!='DIV') {
			target = target.parentNode;
		}

		if((target.id == "lastUsedEmailTitle") && domUtilities.hasClass(document.getElementById('recents_list'), 'sts-dn')) {
			domUtilities.removeClassIfPresent('null', 'recents_list', 'sts-dn');
			domUtilities.removeClassIfPresent('null', 'fa-caret-down', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'fa-caret-right', 'sts-dn');
		} else {
			domUtilities.addClassIfNotPresent('null', 'recents_list', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'fa-caret-down', 'sts-dn');
			domUtilities.removeClassIfPresent('null', 'fa-caret-right', 'sts-dn');
		}

		if("contactsBox" != target.id){
			domUtilities.addClassIfNotPresent('null', 'contactsBox', 'sts-dn');
		}

		domUtilities.addClassIfNotPresent('null', 'loadingUrlInfo', 'sts-dn');
	}

	function refreshMoreButton(objElem, isMouseOver){
		if(domUtilities.hasClass(objElem, 'emailFade')){
			return;
		}
		if(objElem.hasChildNodes()){
			var childElems = objElem.getElementsByTagName('SPAN');
			if(isMouseOver){
				childElems[0].style.display='none';
				childElems[1].style.display='inline';
			}else{
				childElems[1].style.display='none';
				childElems[0].style.display='inline';
			}
		}
	}

	function clipTheContent(contents, maxChars, lastCharsToAdd){
		lastCharsToAdd = !(lastCharsToAdd)?" .&nbsp;.&nbsp;.":lastCharsToAdd;
		var contentsLen = contents.length;
		var extraCharLen = lastCharsToAdd.length;
		if(contentsLen < maxChars){
			return contents;
		}
		contents = contents.substring(0,(maxChars - (lastCharsToAdd.length))) + lastCharsToAdd;

		return contents;
	}

	function addEventListenersToWidget()
	{
		var elementList, retVal, singleElement, i, emailShareVal;

		/*Adding event handler to Message TextArea */
		elementList = _container.getElementsByTagName('textarea');
		for (i in elementList)
		{
			//console.log("addEventListenersToWidget - " + elementList[i] + ": " + i);
			retVal = domUtilities.addListenerCompatible(elementList[i], 'focus', jsUtilities.clearTextArea);
			retVal = domUtilities.addListenerCompatible(elementList[i], 'blur', jsUtilities.fillTextArea);
		}
		var moreLinkElement = document.getElementById('moreLink');
		if(moreLinkElement){
			//console.log("addEventListenerToWidget - more and less links :" + document.getElementById('moreLink'));
			domUtilities.addListenerCompatible(moreLinkElement, 'mouseover', function(){refreshMoreButton(moreLinkElement, true);});
			domUtilities.addListenerCompatible(moreLinkElement, 'mouseout', function(){refreshMoreButton(moreLinkElement, false);});
			domUtilities.addListenerCompatible(moreLinkElement, 'click', shareWidget.showAll);
		}
		//domUtilities.addListenerCompatible(document.getElementById('lessLink'), 'click', shareWidget.hideAll);
		domUtilities.addListenerCompatible(document.getElementById('lessLink'), 'click', shareWidget.showHome);

		elementList = domUtilities.searchElementsByClass("serviceDisplay", "a", '');
		for(i in elementList)
		{
			retVal = domUtilities.addListenerCompatible(elementList[i], 'click', bigServiceIconClicked);
		}

		domUtilities.addListenerCompatible(document.getElementById('shareButton'), 'click', prepareMultiShare);
		domUtilities.addListenerCompatible(document.getElementById('cancelButton'), 'click', function(){shareWidget.showHome();shareWidget.getEmailService();});

		domUtilities.addListenerCompatible(document.getElementById('cancelLink'), 'click', shareWidget.showHome);
		domUtilities.addListenerCompatible(document.getElementById('againLink'), 'click', shareAgainClicked);
		//domUtilities.addListenerCompatible(document.getElementById('againBackLink'), 'click', shareWidget.showMoreFromSingleDone);
		domUtilities.addListenerCompatible(document.getElementById('againBackLink'), 'click', shareWidget.showHome);
		domUtilities.addListenerCompatible(document.getElementById('emailBackLink'), 'click', shareWidget.showEmailScreenFromDoneScreen);
		domUtilities.addListenerCompatible(document.getElementById('emailBackLink2'), 'click', shareWidget.showEmailScreenFromDoneScreen);
		domUtilities.addListenerCompatible(document.getElementById('postFriendsLink'), 'click', initFacebookFriends);
		domUtilities.addListenerCompatible(document.getElementById('cancelFriendsWall'), 'click', cancelFacebookFriends);

		elementList = domUtilities.searchElementsByClass("oAuthService", "a", '');
		for(i in elementList)
		{
			emailShareVal = domUtilities.addListenerCompatible(elementList[i], 'click', emailShareOAuth);
		}

		elementList = domUtilities.searchElementsByClass("externalEmailService", "a", '');
		for(i in elementList)
		{
			emailShareVal = domUtilities.addListenerCompatible(elementList[i], 'click', emailShareExternal);
		}

		//emailShareVal = domUtilities.addListenerCompatible(document.getElementById('goBackLink'), 'click', shareWidget.showMoreServicesFromEmailScreen);
		emailShareVal = domUtilities.addListenerCompatible(document.getElementById('closeEmailLink'), 'click', shareWidget.closeEmailWidget);
		//domUtilities.addListenerCompatible(document.getElementById('lastUsedEmailTitle'), 'click', updateLastUsedEmailsUI);
		domUtilities.addListenerCompatible(_container, 'click', updateLastUsedEmailsUI);

		elementList = domUtilities.searchElementsByClass("defaultText", "input", '');
		for(i in elementList)
		{
			domUtilities.addListenerCompatible(elementList[i], 'focus', searchFocus);
			domUtilities.addListenerCompatible(elementList[i], 'blur', searchBlur);
		}
		var elemSearchMore = document.getElementById('chicklet_search_field');
		domUtilities.addListenerCompatible(elemSearchMore, 'keyup', searchAndDisplay);
		domUtilities.addListenerCompatible(elemSearchMore, 'input', searchAndDisplay);
	}

	return {

		getConfigOptions : function()
		{
			return _config;
		},

		autoSelectService : function(serviceName)
		{
			if(typeof(serviceName) != "undefined" && serviceName != ""){
				var cookieName = 'st_' + serviceName + '_uncheck';
				if(stlib.cookie.getCookie(cookieName)!==false){
					//delete it
					stlib.cookie.deleteCookie(cookieName);
				}
				addServiceToShareQueue(serviceName); //This is to auto select oAuthed service just after oAuth success
			}
		},

		onScreenChange : function(isToShow)
		{
			if(isToShow){
				stFade.fadeIn('outerContainer');
			}else{
				stFade.fadeOut('outerContainer');
			}
		},

		resetLoadingUI : function(){
			// Below 2 lines are responsible for unchecking bigService buttons
			domUtilities.replaceClass('checked', 'unchecked');
			domUtilities.replaceClass('ununchecked', 'unchecked');

			var servicesToUncheck = ['facebook', 'twitter', 'linkedin'];
			if(typeof(_shareToWordpress) != 'undefined'){_shareToWordpress = false;}
			if(typeof(_shareToAtt) != 'undefined'){_shareToAtt = false;}

			for(var i=0, len=servicesToUncheck.length; i<len;i++){
				var serviceType = servicesToUncheck[i];
				var cookieName = 'st_' + serviceType + '_uncheck';
				if(stlib.cookie.getCookie(cookieName)===false){
					stlib.cookie.setCookie(cookieName, 1);
				}

				if(serviceType == "facebook"){
					_shareToFacebook = false;
				}else if(serviceType == "twitter"){
					_shareToTwitter = false;
					domUtilities.addClassIfNotPresent('null', 'charCounter', 'sts-dn');
					document.getElementById('shareMessage').setAttribute('maxlength', 2000);
					domUtilities.removeListenerCompatible(document.getElementById('shareMessage'), 'keyup', updateCharCount);
					hideTwiterMessage();
				}
				jsUtilities.removeElementFromArray(_postServicesQueue, serviceType);
			}
		},

		setGlobals : function(key,value){
			//console.log('in setGlobals', key, value);
			//console.trace();
			if (key!="pageInfo" && key!="shareInfo") {
				try{value=decodeURIComponent(value);}catch(err){}
				try{value=decodeURIComponent(value);}catch(err){}
			} else {
				//debug(key);
				//debug(value);
			}
			if(value=="true"){
				value=true;
			}else if(value=="false"){
				value=false;
			}
			switch(key){
				case 'url':
					//alert(value);
					value = stlib.html.encode(value); //fix for FB:13235
					if(_config.URL==null){
						_config.oldURL = value;
					} else if(_config.URL!=value){
						_config.oldURL = _config.URL;
					}
					_config.customUrlPassed = true;
					_config.URL=value;
					if(_config.popup==true){
						shareWidget.initWidget();
					}
					var hostDomain = extractDomainFromURL(value);
					if(hostDomain==null)
					{
						hostDomain=_config.URL;
					}
					else
					{
						if(_config.hostname==null){
							_config.hostname=hostDomain;
						}
					}
					//document.getElementById('footer_link_a').setAttribute('href','http://sharethis.com/stream?src='+encodeURIComponent(hostDomain));
					_config.sharURL=value;
				break;
                                //SA-77: introduce new st_short_url parameter
                                case 'short_url':
                                    _config.short_url = value;
                                break;
				case 'popup':
					_config.popup = value;
				break;
				case 'title':
					_config.title=value;
				break;
				case 'pUrl':
					if(_config.popup!=true || _config.URL==null){
						if(_config.URL==null){
							_config.oldURL = value;
						} else if(_config.URL!=value){
							_config.oldURL = _config.URL;
						}

						_config.customUrlPassed = true;
						_config.URL=value;
						var hostDomain = extractDomainFromURL(value);
						if(hostDomain==null)
						{
							hostDomain=value;
						}else{
							if(_config.hostname==null){
								_config.hostname=hostDomain;
							}
						}
						//document.getElementById('footer_link_a').setAttribute('href','http://sharethis.com/stream?src='+encodeURIComponent(hostDomain));
					}
				break;
				case 'fpc':
					_config.fpc=value;
				break;
				case 'shorten':
					_config.shorten=value;
				break;
				case 'sessionID':
					_config.sessionID=value;
				break;
				case 'i18n':
					_config.i18n=value;
					if(_config.i18n){
						if(stlib.cookie.getCookie('sti18n')!==false){
							var sti18n=stlib.json.decode(stlib.cookie.getCookie('sti18n'));
							if(_config.lang==null){
								_config.lang={};
								_config.lang.strings=new Object;
							}
							for(var o in sti18n){
								_config.lang.strings[o]=sti18n[o];
							}
						}
//						stlib.scriptLoader.loadJavascript("http://wd.sharethis.com/i18n/message.js",function(){});
					}
				break;
				case 'publisher':
					_config.publisher=value;
				break;
				case 'pageInfo':
					stlib.data.pageInfo=stlib.json.decode(value);
					stlib.data.pageInfo.product=encodeURIComponent(stlib.data.pageInfo.product);// WID-751
					//WID-642
					_config.widSrc=stlib.data.get("widSrc", "pageInfo");
					if(_config.widSrc || _config.widSrc != null)
						stlib.data.unset("widSrc", "pageInfo");
					break;
				case 'doNotHash':
					stlib.hash.doNotHash=value;
					break;
				case 'servicePopup':
					_config.servicePopup=value;
					break;
				case 'via':
					_config.via=value;
					break;
//				case 'shareInfo':
//					stlib.data.shareInfo=stlib.json.decode(value);
//					break;
				case 'type':
					_config.type=value;
				break;
				case 'service':
					_config.service=value;
					//clicked in from outside, delete unchecked cookie
					var cookieNameService = value;
					var cookieName = 'st_' + cookieNameService + '_uncheck';
					if(stlib.cookie.getCookie(cookieName)!==false){
						//delete it
						stlib.cookie.deleteCookie(cookieName);
					}
					break;
				case 'summary':
					_config.summary=value;
				break;
				case 'message':
					_config.message=value;
					document.getElementById('shareMessage').value = _config.message;
				break;
				case 'content':
					_config.content=value;
				break;
				case 'icon':
					_config.icon=value;
				break;
				case 'image':
					_config.thumb=value;
					_config.pThumb=value;
				break;
				case 'category':
					_config.category=value;
				break;
				case 'updated':
					_config.updated=value;
				break;
				case 'author':
					_config.author=value;
				break;
				case 'published':
					_config.published=value;
				break;
				case 'thumb':
					_config.thumb=value;
					_config.pThumb=value;
				break;
				case 'hostname':
					_config.hostname=value;
				break;
				case 'location':
					_config.location=value;
				break;
				case 'guid_index':
					_config.guid_index=value;
				break;
				case 'page':
					_config.page=value;
					//console.log(value);
					if(value && value=="send"){
						shareWidget.getEmailService();
					}else if(value && value=="home"){
						//console.log('i am supposed to show the home screen');
						shareWidget.showHome();
					}else if(value && value=="wphome"){
						shareWidget.createWordpressScreen();
                    }else {
						clearInterval(loginPoller);
						loginPoller = setInterval(stUser.checkForLoginCookie, 1000);

						if(value && value=='fbhome'){
							shareWidget.showHome();
						}else if(value && value=='twhome'){
							shareWidget.showHome();
						}else if(value && value=='ybhome'){
							shareWidget.showHome();
						}else if(value && value=='gbhome'){
							shareWidget.showHome();
						}else if(value && value=='lihome'){
							shareWidget.showHome();
						}
					}
				break;
				case 'toolbar':
					_config.toolbar=value;
				break;
				case 'services':
					_config.services=value;
				break;
				case 'headerTitle':
					_config.headerText = value;
					//if(value.length>0){
					//	var element=document.getElementById('header_div');
					//	var element2=document.getElementById('header_title').innerHTML=value;
					//	element.style.display="block";
					//}
				break;
				case 'headerfg':
					var element=document.getElementById('header_div');
					element.style.color=value;
				break;
				case 'headerbg':
					var element=document.getElementById('header_div');
					element.style.backgroundColor=value;
				break;
				case "tracking":
					_config.tracking=true;
				break;
				case "linkfg":
					_config.linkfg=value;
					break;
				case "textcause":
					var element=document.getElementById('stCause');
					if (element) {
						if (value.length>30)
							value = value.substring(0,11) + " ..... " + value.substr(value.length - 12);
						element.innerHTML=value;
					}
					break;
				case "linkcause":
					var element=document.getElementById('stCause');
					if (element) {
						element.href=value;
						element.style.display = "inline-block";
					}
					break;
				case 'tabs':
					var a=new RegExp(/email|send/);
					if(a.test(value)==false){_config.email_service=false;}
					if(a.test(value)==false){_config.sms_service=false;}
					break;
				case 'send_services':
					var a=new RegExp(/email/);
					if(a.test(value)==false){_config.email_service=false;}
					/*a=new RegExp(/sms/);
					if(a.test(value)==false){_config.sms_service=false;}*/
					break;
				case "exclusive_services":
					_config.merge_list=false;
					break;
				case "post_services":
					//shareWidget.merge_list=false;
					if(_config.services==null){
						_config.services=value;
					}else{
						_config.service+=value;
					}
					break;
				case "stLight":
					_config.stLight=true;
					break;
				case 'doneScreen':
					_config.doneScreen=value;
					break;
				case 'theme':
					//_config.theme = value;
					break;
				case 'headerText':
					_config.headerText = value;
					break;
				case 'serviceBarColor':
					_config.customColors.serviceBarColor = value;
					break;
				case 'shareButtonColor':
					_config.customColors.shareButtonColor = value;
					break;
				case 'footerColor':
					_config.customColors.footerColor = value;
					break;
				case 'headerTextColor':
					_config.customColors.headerTextColor = value;
					break;
				case 'helpTextColor':
					_config.customColors.helpTextColor = value;
					break;
				case 'mainWidgetColor':
					_config.customColors.mainWidgetColor = value;
					break;
				case 'textBoxFontColor':
					_config.customColors.textBoxFontColor = value;
					break;
				case 'excludeServices':
					_config.excludeServices = value;
					break;
				case 'minorServices':
					_config.minorServices = value;
					break;
				case 'publisherGA':
					_config.publisherGA = value;
					break;
				case 'relatedDomain':
					_config.relatedDomain = value;
					break;

				case 'publisherMigration':
					_config.publisherMigration=value;
					break;

				case "embeds":
				case "button":
				case "type":
				case "inactivefg":
				case "inactivebf":
				case "headerbg":
				case "style":
				case "charset":
				case "hash_flag":
				case "onmouseover":
				case "inactivebg":
				case "send_services":
				case "buttonText":
				case "offsetLeft":
				case "offsetTop":
				case "buttonText":
					//legacy stuff some of them
				break;

				default:
				//	//console.log("******Not Found Key:"+key+" Value:"+value);
					//alert("******Not Found Key:"+key+" Value:"+value);
				break;
			}
		},

		initWidget : function(){
			//console.log('in initWidget');
			//console.trace();
			getMainCss();
			_shownDone = false;
			stUser.checkLogin();
			if(_config.URL != _config.oldURL){
				_sharFetched=false;
				_sharClearedOnce=false;
				_twitterMessagePopulated=false;
				_config.thumb='';
				_config.pThumb='';
				_config.summary='';
				_config.title=null;
				//console.log('in initWidget ', _shareToTwitter);
				document.getElementById('shareMessage').value = document.getElementById('shareMessage').getAttribute('placeholder');
			}

			if(_config.URL==null){
				return true;
			}else{
				//console.log('share widget url is not null');

				domUtilities.replaceClass('tempWidgetIcons','widgetIcons');


				domUtilities.removeClassIfPresent('null', 'loadingUrlInfo', 'sts-dn');
				if( document.all && (navigator.appVersion.indexOf('MSIE 7.')!=-1 || navigator.appVersion.indexOf('MSIE 6.')!=-1) ){
					document.getElementById('services').style.height='auto';
				}
				domUtilities.addClassIfNotPresent('null', 'articleDetails', 'sts-dn');
				shareWidget.hideError();
				_config.chicklet_loaded = false;
				customizeServiceList();
				if(!_sharClearedOnce) {
					poster.clearSharURL();
					_sharClearedOnce = true;
				}
				//setTheme();
				customizeWidgetColors();
				if(typeof(_config.headerText)!='undefined' && _config.headerText!='')
				{
					//alert("The title length is : " + _config.headerText.length);
					if (_config.headerText.length > 50) {
						_config.headerText = _config.headerText.substring(0,47) + "...";
					}
					lang.strings['msg_share'] = _config.headerText;
					document.getElementById('welcomeMsg').innerHTML=lang.strings['msg_share'];
				}

				var data=['return=json',"url="+encodeURIComponent(_config.URL),"fpc="+_config.fpc,"cb=shareWidget.initWidgetOnSuccess","service=initWidget"];
				data=data.join('&');
				jsonp.makeRequest("https://ws.sharethis.com/api/getApi.php?"+data);
				return true;
			}
		},

		initWidgetOnSuccess : function(response)
		{
			if(response && response.status=='SUCCESS') {
				_config.metaInfo=response.data;
			}
			domUtilities.replaceClass('rpChicklet','ckimg');
			_config.initWidget = true;
			/* TODO - Replace other sprite images here */
			if(response && response.data && response.data.ga && response.data.ga==true){
        stlib.gaLogger.initGA("UA-1645146-17", shareWidget.getConfigOptions());
			}

			if( typeof(_config.URL)!='undefined' && _config.URL!='' && typeof(_config.title)!='undefined' && _config.title!='' && typeof(_config.summary)!='undefined' && _config.summary!='' && typeof(_config.thumb)!='undefined' && _config.thumb!='' )
			{
                                //SA-77: Go for shorten URL, if not found use normal URL
                                var tempUrl = (_config.short_url != "" && _config.short_url != null) ? _config.short_url : _config.URL;

				domUtilities.addClassIfNotPresent('null', 'loadingUrlInfo', 'sts-dn');
				document.getElementById('thumbnail').setAttribute('src', _config.thumb);
				document.getElementById('headline').innerHTML = clipTheContent(_config.title, 124, false);
				document.getElementById('snippet').innerHTML = clipTheContent(_config.summary, 124, false);
				document.getElementById('url').innerHTML = clipTheContent(tempUrl, 75, false);
				document.getElementById('url').setAttribute('href', tempUrl);
				afterFillingArticleDetails(true);
			}
			else
			{
				getURLInfo();
				//console.log('calling getURL Info');
				afterFillingArticleDetails(false);
			}
		},

		initialize : function()
		{
			//console.log("initialize");
			var isBot=false;
			var nv=navigator.userAgent;
			var nvPat=/bot|gomez|keynote/gi;
			if(nv && nv!==null && nv.length>4){
				var tempMatch=nv.match(nvPat);
				if(tempMatch && tempMatch!==null && tempMatch.length>0){
					isBot=true;
				}
			}else{
				isBot=true;
			}
			//console.log(stlib.fragmentPump.initRun);
			if(stlib.fragmentPump.initRun==true){
				stlib.setupWidget.processBuffer();
			}

			//getMainCss();
			domReady=true;

			if (typeof(lang)!='undefined'&&typeof(lang.strings)!='undefined'&&_config.lang!=null&&typeof(_config.lang.strings)!='undefined'){
				for(var o in _config.lang.strings){
					lang.strings[o]=_config.lang.strings[o];
				}
			}

			setTimeout(function(){
				//console.log("initialize - add msg_view_all");
				document.getElementById('moreLinkText').innerHTML=lang.strings['msg_view_all'];
				document.getElementById('lessLink').innerHTML="&laquo; "+lang.strings['msg_hide_all'];
				//document.getElementById('goBackLink').innerHTML="&laquo; "+lang.strings['msg_hide_all'];
				document.getElementById('sharedMsg').innerHTML=lang.strings['msg_share_success'];
				document.getElementById('againLink').innerHTML=lang.strings['msg_againLink']+" &raquo;";
				document.getElementById('txtYourAddr').value=lang.strings['msg_email_to'];
				document.getElementById('txtYourAddr').setAttribute('placeholder', lang.strings['msg_email_to']);
				document.getElementById('txtFromAddr').value=lang.strings['msg_email_from'];
				document.getElementById('txtFromAddr').setAttribute('placeholder', lang.strings['msg_email_from']);
				document.getElementById('helpText').innerHTML=lang.strings['msg_share_to_destinations'];
				document.getElementById('welcomeMsg').innerHTML=lang.strings['msg_share'];
				document.getElementById('chicklet_search_field').value=lang.strings['chicklet_search_field'];
				document.getElementById('chicklet_search_field').setAttribute('placeholder', lang.strings['chicklet_search_field']);
			},100);

			addEventListenersToWidget();

			//get value from HTML5 localStorage for userinfo
			if (stlib.cookie.getCookie('ShareUT') !== false) {
				if(stlib.cookie.hasLocalStorage()) {
					var sut = stlib.cookie.getCookie('ShareUT');
					//stUser.fillInfoFromStorage(window.localStorage);
				}
			}
			//getURLInfo(); // TODO - comment out here finally
		},

		getEmailService : function(type)
		{
			stlib.gaLogger.gaLog("Chicklet - 5xa","Email");

			_shareToEmail = false;
			_isEmailShareDone = false;

			if( document.all && navigator.appVersion.indexOf('MSIE 6.')!=-1)
			{
				document.getElementById('services').style.height='auto';
				document.getElementById('creditLine').style.position='relative';
			}
			addServiceToShareQueue('email');
			showExternalEmailScreen();
		},

		serviceClicked : function(elem){
			_$d_();
			_$d1("Clicked on a 5xa small chicklet to share.");
			/* TODO - add big chiclets to this too*/
			var service=elem.getAttribute('stservice');
			var serviceTitle = elem.getAttribute('title');

			stlib.data.resetShareData();
			stlib.data.set("url",_config.URL,"shareInfo");

			//SA-77: introduce new st_short_url parameter
			stlib.data.set("short_url",_config.short_url,"shareInfo");

			stlib.data.set("shorten",_config.shorten,"shareInfo");
			stlib.data.set("title",_config.title,"shareInfo");
			stlib.data.set("buttonType",_config.type,"shareInfo");
			stlib.data.set("destination",service,"shareInfo");
			stlib.data.setSource("5x", _config);
			if(service=="twitter" && _config.via != null){
				stlib.data.set("via", _config.via, "shareInfo");
			}

			if(typeof(_config.thumb)!='undefined' && _config.thumb!=null){
				stlib.data.set("image",_config.thumb,"shareInfo");
			}if(typeof(_config.summary)!='undefined' && _config.summary!=null){
				stlib.data.set("description",_config.summary,"shareInfo");
			}if(_config.message!=''){
				stlib.data.set("message",_config.message,"shareInfo");
			}

			if (service=="pinterest" && _config.pThumb=='') {
				stlib.data.unset("image","shareInfo");
				if (stlib.browser.ieFallback) {
					if(typeof(window.postMessage)!=="undefined" && document.referrer!==""){
						parent.postMessage("#Pinterest Click", document.referrer);
					}
				}
				else
					fragInstance.broadcastSendMessage("Pinterest Click");
			}
			stlib.sharer.share(null, _config.servicePopup);

			shareWidget.updateServiceCount(service, serviceTitle);

			domUtilities.addClassIfNotPresent('null', 'doneScrMessage', 'minors');
			shareWidget.showMinorShareMsg();

			stlib.gaLogger.gaLog("Share - 5xa",service);

			if (service=="print") {
				if(typeof(window.postMessage)!=="undefined"){
					parent.postMessage("ShareThis|close|Print", document.referrer);
				}
				if (stlib.browser.ieFallback) {
					if(typeof(window.postMessage)!=="undefined" && document.referrer!==""){
						parent.postMessage("#Print Click", document.referrer);
					}
				}else{
					fragInstance.broadcastSendMessage("Print Click");
				}
			}else{
				shareWidget.showDoneScreen(true);
			}
			_config.chicklet_loaded = false;
			stlib.gaLogger.shareLog(service);
		},

		showAll : function(){
			if(domUtilities.hasClass(document.getElementById('moreLink'), 'emailFade')){
				return;
			}

			shareWidget.onScreenChange(true);
			shareWidget.hideError();
			if(!_config.chicklet_loaded){
				document.getElementById('chicklet_search_field').value=lang.strings['chicklet_search_field'];
				if(_config.URL!=_config.oldURL) {
					var chicklets = document.getElementById('chicklets');
					while (chicklets.childNodes.length >= 1 )
				    {
				        chicklets.removeChild(chicklets.firstChild);
					}
				}
				displaySmallChicklets(stlib.allServices);
			}

			domUtilities.removeClassIfPresent('null', 'moreServices', 'sts-dn');

			if(_config.minorServices){
				domUtilities.addClassIfNotPresent('null', 'moreLink', 'sts-dn');
			}
			domUtilities.removeClassIfPresent('null', 'moreTitle', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'welcomeMsg', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'mainBody', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'serviceCTAs', 'sts-dn');
			stlib.gaLogger.gaLog('Widget - 5xa','show_all');
		},

		showEmailScreenFromDoneScreen: function(){
			shareWidget.showHome();
			addServiceToShareQueue('email');
			showExternalEmailScreen();
		},

		showEmailScreenFromMoreServices: function(){
			shareWidget.hideAll();
			shareWidget.getEmailService();
		},

		hideAll : function(){
			shareWidget.onScreenChange(true);
			domUtilities.addClassIfNotPresent('null', 'moreServices', 'sts-dn');

			if(_config.minorServices){
				domUtilities.removeClassIfPresent('null', 'moreLink', 'sts-dn');
			}
			domUtilities.removeClassIfPresent('null', 'welcomeMsg', 'sts-dn');
			domUtilities.removeClassIfPresent('null', 'mainBody', 'sts-dn');
			domUtilities.removeClassIfPresent('null', 'serviceCTAs', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'moreTitle', 'sts-dn');

			_config.chicklet_loaded = false;

			domUtilities.addClassIfNotPresent('null', 'moreTitle', 'sts-dn');
			stlib.gaLogger.gaLog('Widget - 5xa','hide_all');
		},


		fillURLInfo : function(response)
		{
      var noImageURL = "https://ws.sharethis.com/secure5x/images/no-image.png";
			var fromUrlInfo = false;
			var haveSomeInfo = false;
			var imgSrc='', articleImageURL='';
			domUtilities.addClassIfNotPresent('null', 'loadingUrlInfo', 'sts-dn');
			if(response && response.status=="SUCCESS"){
				fromUrlInfo = true;
				if( (typeof(response.urls[0].img)!='undefined' && response.urls[0].img != "null" && response.urls[0].img != "" &&  response.urls[0].img.indexOf('http://sharethis.com/share/thumb')==-1 ) || (response.urls[0].imagehash && response.urls[0].imagehash != "")){
					if (response.urls[0].imagehash && response.urls[0].imagehash != ""){
						imgSrc = "http://img.sharethis.com/" + response.urls[0].imagehash + "/100_100.jpg";
					} else{
						imgSrc = response.urls[0].img;
					}
				}else{
					imgSrc = '';
				}
			}

			if( typeof(_config.thumb)!='undefined' && _config.thumb!='' ){
				haveSomeInfo = true;
				articleImageURL=_config.thumb;
			}else if(fromUrlInfo){
				_config.thumb = imgSrc;
				if(imgSrc==''){
					imgSrc = noImageURL;
				}
				articleImageURL=imgSrc;
			}else{
			 	_config.thumb = '';
			 	articleImageURL=noImageURL;
			}
			document.getElementById('thumbnail').setAttribute('src', articleImageURL);

			if( typeof(_config.title)!='undefined' && _config.title!='' ){
				haveSomeInfo = true;
				document.getElementById('headline').innerHTML = clipTheContent(_config.title, 124, false);
			}else if(fromUrlInfo && typeof(response.urls[0].title)!='undefined'){
				document.getElementById('headline').innerHTML = clipTheContent(response.urls[0].title, 124, false);
				_config.title = response.urls[0].title;
			}else{
				_config.title='';
				domUtilities.addClassIfNotPresent('null', 'headline', 'sts-dn');
			}

			if( typeof(_config.summary)!='undefined' && jsUtilities.trimString(_config.summary)!='' ){
				haveSomeInfo = true;
				document.getElementById('snippet').innerHTML = clipTheContent(_config.summary, 124, false);
			}else if(fromUrlInfo && typeof(response.urls[0].snippet)!='undefined'){
				document.getElementById('snippet').innerHTML = clipTheContent(response.urls[0].snippet, 124, false);
				_config.summary = response.urls[0].snippet;

				if(jsUtilities.trimString(response.urls[0].snippet)==''){
					domUtilities.addClassIfNotPresent('null', 'snippet', 'sts-dn');
				}else{
					domUtilities.removeClassIfPresent('null', 'snippet', 'sts-dn');
				}
			}else{
				_config.summary = '';
				domUtilities.addClassIfNotPresent('null', 'snippet', 'sts-dn');
			}

                           //SA-77: Go for shortent URL, if not found then use normal URL
                        var tempUrl = (_config.short_url != "" && _config.short_url != null) ? _config.short_url : _config.URL;

			document.getElementById('url').innerHTML = clipTheContent(tempUrl, 75, false);
			document.getElementById('url').setAttribute('href', tempUrl);
			if(fromUrlInfo){
				_config.urlhash = response.urls[0].urlhash;
				afterFillingArticleDetails(true);
			}else if(haveSomeInfo){
				domUtilities.removeClassIfPresent('null', 'articleDetails', 'sts-dn');
			}else{
				afterFillingArticleDetails(false);
				//document.getElementById('shareMessage').style.height='100px';
			}
		},

		addFriendsWallToQueue : function(friendId)
		{
			var previousEntry = false;
			for(var i=0; i<_postServicesQueue.length; i++)
			{
				if(_postServicesQueue[i].search('facebookfriend')!='-1'){
					_postServicesQueue[i] = 'facebookfriend-' + friendId;
					previousEntry = true;
				}
			}
			if(!previousEntry){
				_postServicesQueue.push('facebookfriend-' + friendId);
			}
		},

		beginOAuth : function(serviceType)
		{
			clearInterval(clearShareALInterval);

			//WID-642
			if("newhb" == _config.widSrc) {
				stlib.gaLogger.gaLog("Widget_source", "Reskin Hoverbar", "Attempting OAuth");
			} else if("chrExt" == _config.widSrc) {// WID-635
				stlib.gaLogger.gaLog("Widget_source", "Chrome Extension", "Attempting OAuth");
			}

			stlib.gaLogger.gaLog("Attempting OAuth - 5xa", serviceType);
			var oAuthURL;
			oAuthURL = "http://sharethis.com/account/linking?provider=" + serviceType;
			window.open( oAuthURL, "AccountLinkingWindow","status=1, height=" + _popupHeights[serviceType] + ", width=" + _popupWidths[serviceType] + ", resizable=1" );
			clearInterval(loginPoller);

			// Previous Local Storage value of ShareAL is getting set when we open the OAuth pop-up. We want to delete this value as soon as possible, since it is causing the second OAuth login issue.
			var clearShareALflag = true;
			var countInterval = 0;
			clearShareALInterval = setInterval(function() {

					var authCookie = stlib.cookie.getCookie("ShareAL");
					if(authCookie) {
						stlib.cookie.deleteCookie('ShareAL');
					}

					if(stlib.cookie.hasLocalStorage() && localStorage['ShareAL'] && clearShareALflag) {
						localStorage.removeItem('ShareAL');
						clearShareALflag = false;
						clearInterval(clearShareALInterval);
					}else if(countInterval > 25){
						clearInterval(clearShareALInterval);
					}
					countInterval = countInterval + 1;
				}
			, 100);


			if (!stlib.cookie.checkCookiesEnabled()) {
				accountLinkingPoller = setInterval(stUser.checkForAccountLinkingCookie, 1000);
			}else{
				loginPoller = setInterval(stUser.checkForLoginCookie, 1000);
			}
		},

		postLoginWidget : function()
		{
			if(!((stlib.cookie.checkCookiesEnabled() == false) && (stlib.cookie.hasLocalStorage() == false))) {
				domUtilities.removeClassIfPresent('null', 'signOut', 'sts-dn');
				domUtilities.addClassIfNotPresent('null', 'signIn', 'sts-dn');
			}

			var userDetails = stUser.getUserDetails();
			var name = (userDetails.name) ? userDetails.name : userDetails.nickname;
			var trimmedMsg = lang.strings['msg_share'];
			if(name.length > 14){
				var trimmedName = name.slice(0, 14) + '..';
			} else {
				var trimmedName = name;
			}

			/*trimmedName = trimmedName.replace(/\w+/g, function(a){
				return a.charAt(0).toUpperCase() + a.substr(1).toLowerCase();
			});*/

		    var msgGreeting = lang.strings['msg_greeting'].length;
			var trimmedMsgLen = msgGreeting + 2 + trimmedName.length + lang.strings['msg_share'].length;  //2 is for the space between Hi and username.
			if (trimmedMsgLen > 50) {
				trimmedMsg = lang.strings['msg_share'].substring(0,22) + "...";
			}

			document.getElementById('welcomeMsg').innerHTML = ' <span class="userName" id="welcomeName" title="' + name + '"> ' + lang.strings['msg_greeting'] + ' ' + trimmedName + ' <span>|</span> ' +	' <a href="javascript:void(0);" id="signOutTop">Not you?</a></span><em>' + trimmedMsg + '</em>';

			document.getElementById('emailshareHeading').innerHTML = '<span class="userName"><a href="javascript:void(0);" id="closeEmailLink" class="backToDefault goBackLink checked" data-value="email" title="Close" onclick="shareWidget.closeEmailWidget();">Close</a></span> <em>' + lang.strings['email_msg_share'] + '</em>';

			// Two separate event listeners one is for Home Page and one is for Email Page
			domUtilities.addListenerCompatible(document.getElementById('signOutTop'), 'click', function(){
				signOutFromWidget();
				if(stlib.cookie.checkCookiesEnabled() == false) {
					setTimeout(function() {
						signInToWidget();
					}, 3000);
				}else{
						signInToWidget();
				}
			});

			// Two separate event listeners one is for Home Page and one is for Email Page
			domUtilities.addListenerCompatible(document.getElementById('signOutTopEmail'), 'click', function(){
				signOutFromWidget();
				if(stlib.cookie.checkCookiesEnabled() == false) {
					setTimeout(function() {
						signInToWidget();
					}, 3000);
				}else{
						signInToWidget();
				}
			});
			isSignedIn = true;

			domUtilities.removeClassIfPresent('null', 'postFriendsLink', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'friendsInputWrapper', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'failureError', 'sts-dn');

			for (var c=0, len = failedServices.length;c<len;c++) {
				if(len == 1){
					shareWidget.showHome();
				}else{
					if(failedServices[c] && failedServices[c].hasOwnProperty(reAuthedService)){
						failedServices.splice(c,1);
						continue;
					}
					shareWidget.makeReauthLink(failedServices);
				}
			}

			/*var emailElement = shareWidget.getEmailElement();
			if(domUtilities.hasClass(emailElement, 'checked')){
				resetScreenForEmail();
			}*/
		},

		beginMultiShare : function()
		{
			shareWidget.onScreenChange(true);
			clearInterval(sharPoller);
			var articleObj = {};
			// After dynamic widget, aurl is no longer viable
			//articleObj.aurl = _config.URL;
			articleObj.url = poster.getSharURL();
			if(articleObj.url==''){
				articleObj.url = _config.URL;
			}
			articleObj.title = escape(_config.title);
			articleObj.urlhash = _config.urlhash;
			_shareToEmail = false;
			var onlyToEmail = true;

			for(var i in _postServicesQueue)
			{
				if (_postServicesQueue[i].search('facebookfriend')!='-1'){
					stlib.gaLogger.shareLog('facebookfriend');
				} else {
					stlib.gaLogger.shareLog(_postServicesQueue[i]);
				}

				if(_postServicesQueue[i]=='email')
				{
					email.hasError = false;
					_shareToEmail = true;

					domUtilities.removeClassIfPresent('null', 'loadingUrlInfo', 'sts-dn');
					if(document.getElementById('emailAuthentication').style.display === "block"){
						email.hasError = true;
						shareWidget.showError(lang.strings['msg_emailshare_direct_click']);
					}else{
						email.createMessage();
					}
					shareWidget.updateServiceCount(_postServicesQueue[i], 'Email');
				}
				else
				{
					onlyToEmail = false;
					if(_postServicesQueue[i]=='twitter'){
						shareWidget.updateServiceCount(_postServicesQueue[i], 'Tweet');
					} else if (_postServicesQueue[i]=='facebook'){
						shareWidget.updateServiceCount(_postServicesQueue[i], 'Share');
					} else if (_postServicesQueue[i]=='yahoo'){
						shareWidget.updateServiceCount(_postServicesQueue[i], 'Y! Pulse');
					} else if (_postServicesQueue[i]=='linkedin'){
						shareWidget.updateServiceCount(_postServicesQueue[i], 'LinkedIn');
					}else if (	_postServicesQueue[i].search('facebookfriend')!='-1'){
						shareWidget.updateServiceCount(_postServicesQueue[i], 'Share');
						if(jsUtilities.trimString(document.getElementById('txtFriendsName').value)=='')
						{
							_postServicesQueue.splice(i, 1);
						}
					}
				}
			}

			if(_shareToEmail && email.hasError)
			{
				return;
			}

			if(_shareToFacebook && typeof(facebook)!="undefined" && (facebook.checkFriendName()==false))
			{
				return;
			}

			if(_postServicesQueue.length > 0 && !onlyToEmail)
			{
				poster.multiPost(stUser.getUserDetails(), articleObj, _postServicesQueue, jsUtilities.stripHTML(document.getElementById('shareMessage').value));

				domUtilities.removeClassIfPresent('null', 'loadingUrlInfo', 'sts-dn');
			}
		},

		updateServiceCount : function(service, serviceTitle)
		{
			var usrSvc=stlib.json.decode(stlib.cookie.getCookie('ServiceHistory'));
			if(usrSvc==false || usrSvc==null || usrSvc.length<1){
				usrSvc={};
				usrSvc[service]={};
				usrSvc[service].service=service;
				usrSvc[service].title = serviceTitle;
				usrSvc[service].count=1;
				stlib.cookie.setCookie('ServiceHistory',stlib.json.encode(usrSvc));
				return true;
			}
			var obj={};
			var svc=null;
			var flag=false;
			var sortable=[];
			for(o in usrSvc){
				if(usrSvc[o].service==service){
					usrSvc[o].count++;
					usrSvc[o].title = serviceTitle;
					flag=true;
				}
				sortable.push(usrSvc[o]);
			}
			if(flag==false){
				usrSvc[service]={};
				usrSvc[service].service=service;
				usrSvc[service].title = serviceTitle;
				usrSvc[service].count=1;
			}
			else
			{
				sortable.sort(function(a,b){
					return b.count - a.count;
				});
				usrSvc={};
				for(var i=0;i<sortable.length;i++){
					usrSvc[sortable[i].service]= sortable[i];
				}
			}
			stlib.cookie.setCookie('ServiceHistory',stlib.json.encode(usrSvc));
			return true;
		},

		createWordpressScreen : function()
		{
			shareWidget.onScreenChange(true);
			shareWidget.updateServiceCount('wordpress', 'Wordpress');
			if(_config.title==null){_config.title=_config.URL;}
			//console.log("createPoster");
			_config.poster="wordpress";
			stlib.gaLogger.gaLog("Wordpress - 5xa","poster_clicked");

			var hideElems = ['errorMsg','emailShareDetails','emailshareHeading','services','helpText','moreServices','moreTitle','charCounter','greyScreen','extraInfo'];
			for(var k in hideElems){
				domUtilities.addClassIfNotPresent('null', hideElems[k], 'sts-dn');
			}

			var showElems = ['welcomeMsg','mainBody','preShareScreen','serviceCTAs','cancelLink'];
			for(var k in showElems){
				domUtilities.removeClassIfPresent('null', showElems[k], 'sts-dn');
			}

			var msgBox = document.getElementById('shareMessage');
			msgBox.value = 'YourBlogNameHere.wordpress.com';
			msgBox.setAttribute('placeholder', 'YourBlogNameHere.wordpress.com');
			msgBox.setAttribute('maxlength', 128);
			_shareToWordpress = true;

		},

		showMoreFromSingleDone : function(){
			domUtilities.addClassIfNotPresent('null', 'doneTitle', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'doneScreen', 'sts-dn');
			domUtilities.removeClassIfPresent('null', 'preShareScreen', 'sts-dn');
			_shownDone=false;
			shareWidget.showAll();
		},

		showMoreServicesFromEmailScreen : function(){
			hideExternalEmailScreen();
			shareWidget.showAll();
		},

		closeEmailWidget: function() {
			stlib.gaLogger.gaLog("New Email share page - 5xa","email_close_clicked");
			if(typeof(window.postMessage)!=="undefined"){
				parent.postMessage("ShareThis|close|Email", document.referrer);
			}
		},

		showPartialDoneScreen : function()
		{
			if(domUtilities.hasClass(document.getElementById('partialShared'), 'sts-dn')){
				shareWidget.onScreenChange(true);
			}
			domUtilities.removeClassIfPresent('null', 'loadingUrlInfo', 'sts-dn');
			shareWidget.showError(lang.strings['msg_share_partial']);
			domUtilities.addClassIfNotPresent('null', 'preShareScreen', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'doneScreen', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'serviceCTAs', 'sts-dn');
			domUtilities.removeClassIfPresent('null', 'partialShared', 'sts-dn');
			//Functionality for listing services under correct section

			document.getElementById('partialSuccess').innerHTML = document.getElementById('sharedServices').innerHTML;
			domUtilities.addClassIfNotPresent('null', 'loadingUrlInfo', 'sts-dn');
		},

		showDoneScreen : function(noError, emailDoneScreen)
		{
			if(domUtilities.hasClass(document.getElementById('doneScreen'), 'sts-dn')){
				shareWidget.onScreenChange(true);
			}
			var isIe = stlib.browser.getIEVersion();
			var isFirefox = isIe?null:stlib.browser.isFirefox();
			var isSafari = isFirefox?null:stlib.browser.isSafari();
			var isOpera = isSafari?null:stlib.browser.isOpera();
			var isChrome = isOpera?null:stlib.browser.isChrome();

			domUtilities.removeClassIfPresent('null', 'errorMsg', 'captchaError');
			domUtilities.removeClassIfPresent('null', 'loadingUrlInfo', 'sts-dn');

			if(_shownDone==false && noError)
			{
				shareWidget.hideError();
				_shownDone = true;
				domUtilities.removeClass('null', 'doneTitle', 'sts-dn');
				domUtilities.removeClass('null', 'doneMsg', 'sts-dn');
				domUtilities.removeClassIfPresent('null', 'mainContainer', 'sts-dn');

				var hideElems = ['preShareScreen','partialShared','serviceCTAs','moreServices','moreTitle','welcomeMsg','greyScreen','emailshareHeading'];
				for(var k in hideElems){
					domUtilities.addClassIfNotPresent('null', hideElems[k], 'sts-dn');
				}

				//alert("sharedServices.length -- "+sharedServices.length+" --- _postServicesQueue.length --- "+_postServicesQueue.length);
				//if(sharedServices.length > 0)
				if(_postServicesQueue.length > 0){
					domUtilities.addClassIfNotPresent('null', 'emailBackLink', 'sts-dn'); // To hide back link shown for email done screen
					domUtilities.addClassIfNotPresent('null', 'againBackLink', 'sts-dn');
					domUtilities.removeClassIfPresent('null', 'againLink', 'sts-dn');
				}else{
					domUtilities.addClassIfNotPresent('null', 'againLink', 'sts-dn');
					domUtilities.addClassIfNotPresent('null', 'emailBackLink', 'sts-dn');
					domUtilities.removeClassIfPresent('null', 'againBackLink', 'sts-dn');
					if(emailDoneScreen){
						domUtilities.addClassIfNotPresent('null', 'againBackLink', 'sts-dn');
						domUtilities.removeClassIfPresent('null', 'emailBackLink', 'sts-dn');
					}
				}

				if(_config.doneScreen==false || url==null){
					domUtilities.addClassIfNotPresent('null', 'doneScreen', 'sts-dn');
				}else{
					domUtilities.removeClassIfPresent('null', 'doneScreen', 'sts-dn');

					var browserBookmarkColor = ['stBtnChrome','stBtnExplorer','stBtnFirefox','stBtnSafari','stBtnOpera'], defaultClass='';
					for(var k=0, len=browserBookmarkColor.length; k<len; k++){
						if(isIe){
							defaultClass = 'stBtnExplorer';
						}else if(isChrome){
							defaultClass = 'stBtnChrome';
						}else if(isSafari){
							defaultClass = 'stBtnSafari';
						}else if(isOpera){
							defaultClass = 'stBtnOpera';
						}else{
							defaultClass='stBtnFirefox';
						}
						domUtilities.replaceClass(browserBookmarkColor[k],defaultClass);
					}

					var img_url_initial="https://ws.sharethis.com/images/reskin2014/";
					if(isIe){
						document.getElementById('multiIE').src=img_url_initial+'share_success.png';
						domUtilities.removeClassIfPresent('null', 'multiIE', 'sts-dn');
					}else if(isChrome){
						document.getElementById('multiChrome').src=img_url_initial+'share_success.png';
						domUtilities.removeClassIfPresent('null', 'multiChrome', 'sts-dn');
					}else if(isSafari){
						document.getElementById('multiSafari').src=img_url_initial+'share_success.png';
						domUtilities.removeClassIfPresent('null', 'multiSafari', 'sts-dn');
					}else if(isOpera){
						document.getElementById('multiOpera').src=img_url_initial+'share_success.png';
						domUtilities.removeClassIfPresent('null', 'multiOpera', 'sts-dn');
					}else{
						document.getElementById('multiFF').src=img_url_initial+'share_success.png';
						domUtilities.removeClassIfPresent('null', 'multiFF', 'sts-dn');
					}
				}
			} else if(!noError){
				shareWidget.showError(lang.strings['msg_failed_share']);
			}
			domUtilities.removeClassIfPresent('null', 'mainBody', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'loadingUrlInfo', 'sts-dn');
		},

		getEmailElement : function()
		{
			var element = document.getElementById('bigEmailService');
			return element;
		},

		showHome : function()
		{
			/* Re-initialize everything and set variables to default state.
				Back to the initial screen state
			*/
			domUtilities.removeClassIfPresent('null', 'loadingUrlInfo', 'sts-dn');
			shareWidget.onScreenChange(true);
			hideExternalEmailScreen();
			oAuthServiceClicked = "";
			shareWidget.hideError();
			_config.chicklet_loaded = false;

			var i = 0;
			//console.log("showHome");
			domUtilities.removeClassIfPresent('null', 'greyScreen', 'cookieDisabled');
			var hideElementListIDs = ['emailCaptchaTPCMessage', 'doneScreen', 'greyScreen', 'emailshareHeading', 'emailShareDetails', 'moreServices', 'doneTitle', 'moreTitle', 'cancelLink', 'charCounter'];
			var showElementListIDs = ['mainContainer', 'mainBody', 'preShareScreen', 'shareMessage', 'serviceCTAs', 'services', 'helpText', 'extraInfo', 'welcomeMsg', 'serviceNames'];
			if(_config.minorServices){
				showElementListIDs.push('moreLink');
			}

			for (i=0; i<hideElementListIDs.length; i++ )
			{
				domUtilities.addClassIfNotPresent('null', hideElementListIDs[i], 'sts-dn');
			}
			//console.log('done hiding elements');

			for (i=0; i<showElementListIDs.length; i++ )
			{
				domUtilities.removeClassIfPresent('null', showElementListIDs[i], 'sts-dn');
			}

			if(!(domUtilities.hasClass(document.getElementById('doneScreen'), 'sts-dn'))){
				domUtilities.addClassIfNotPresent('null', 'welcomeMsg', 'sts-dn');
			}

			var toolbarUpsell = document.getElementById('toolbarUpsell');
			if(toolbarUpsell!='undefined' && toolbarUpsell!=null && typeof(toolbarUpsell)!='undefined'){
				toolbarUpsell.parentNode.removeChild(toolbarUpsell);
			}

			var mBox = document.getElementById('shareMessage');
			//mBox.style.height = '100px';
			if( document.all && (navigator.appVersion.indexOf('MSIE 7.')!=-1 || (navigator.appVersion.indexOf('MSIE 6.')!=-1)) ){
				//mBox.style.height = '90px';
				document.getElementById('articleDetails').style.marginTop = '-10px';
			}

			_twitterMessagePopulated = false;

			mBox.setAttribute('placeholder', lang.strings['shareMessage']);
			hideTwiterMessage();
			if(_shareToTwitter){
				mBox.value = '';
				populateTwitterBox();
			} else{
				mBox.setAttribute('maxlength', 2000);
				mBox.value = lang.strings['shareMessage'];
			}

			document.getElementById('txtFriendsName').value = '';
			domUtilities.removeClassIfPresent('null', 'txtFriendsName', 'friendSelected');

			_shownDone = false;
			_shareToWordpress = false;
			_shareToAtt = false;

			updateCharCount();
			//shareWidget.hideError();

			/*if( document.all && (navigator.appVersion.indexOf('MSIE 7.')!=-1 || (navigator.appVersion.indexOf('MSIE 6.')!=-1)) )
			{
					document.getElementById('shareButton').style.top='auto';
					document.getElementById('shareButton').style.bottom='26px';
			}*/
			shareWidget.hidePartialDone();
			shareWidget.resetDoneScreen();
			domUtilities.addClassIfNotPresent('null', 'loadingUrlInfo', 'sts-dn');
		},

		showError : function(errorMessage)
		{
			document.getElementById('errorMsg').innerHTML = errorMessage;
			domUtilities.addClassIfNotPresent('null', 'loadingUrlInfo', 'sts-dn');
			domUtilities.removeClassIfPresent('null', 'errorMsg', 'sts-dn');
		},

		hideError : function()
		{
			domUtilities.addClassIfNotPresent('null', 'errorMsg', 'sts-dn');
		},

		showMinorShareMsg : function()
		{
			// START: Done screen for single service from more services
			document.getElementById('doneMsg').innerHTML = lang.strings['msg_top_singleShared'];
			domUtilities.addClassIfNotPresent('null', 'againLink', 'sts-dn');
			domUtilities.removeClassIfPresent('null', 'againBackLink', 'sts-dn');
			var sharedMessage = document.getElementById('sharedMsg');
			sharedMessage.innerHTML = "";
			sharedMessage.appendChild(document.createTextNode(lang.strings['msg_share_again']));

			var a = document.createElement("A");
			a.setAttribute('title', "");
			sharedMessage.appendChild(a);
			// END: Done screen for single service from more services
		},

		makeReauthLink : function(failedServicesList)
		{
			if(typeof(failedServicesList) == "undefined" || !failedServicesList){
				failedServicesList = failedServices;
			}
			var d=document.getElementById('partialReauth'), e=document.getElementById('partialFail'), f=document.getElementById('incompleteServices'), g=document.getElementById('failureError');
			d.innerHTML = e.innerHTML = f.innerHTML = g.innerHTML = "";

			g.appendChild(document.createTextNode("Log back in to complete your share: "));
			var len = failedServicesList.length;
			if(len > 0){//alert(len);
				var servicesLabels = {
						facebook: "Facebook",
						twitter: "Twitter",
						linkedin: "LinkedIn",
						email: "Email"
				};
				var strTemp = "";
				for (var c=0;c<len;c++) {
					if(failedServicesList[c]){
						for (var service in failedServicesList[c]) {
							if(!failedServicesList[c].hasOwnProperty(service)) continue;
							if(!servicesLabels.hasOwnProperty(service)) continue;
							var label = servicesLabels[service];
							strTemp += ((strTemp)?', ':'') + label;
							var lbl = document.createTextNode(label);
							var a = document.createElement("A"), s = document.createElement("STRONG");
							a.setAttribute('title', label);
							a.setAttribute('data-value', service);
							a.style.color = "#007794";
							a.style.textDecoration = "underline";
							a.setAttribute('href', 'javascript:void(0);');
							a.appendChild(lbl);
							if(c > 0){
								s.appendChild(document.createTextNode(", "));
							}
							var a1 = a.cloneNode(true), s1 = s.cloneNode(true);
							domUtilities.addListenerCompatible(a, 'click', reOAuthService);
							domUtilities.addListenerCompatible(a1, 'click', reOAuthService);
							s.appendChild(a);
							s1.appendChild(a1);
							d.appendChild(s);
							g.appendChild(s1);
						}
					}
				}
				strTemp = strTemp.replace(/,([^,]*)$/, ' &amp; $1');
				e.innerHTML = strTemp;
				f.innerHTML = strTemp;
			}
		},

		showSharedServices : function(service)
		{
			if(typeof(service) == 'undefined' || !service){
				return;
			}
			var e=document.getElementById('sharedServices');
			if (e) {
				domUtilities.removeClassIfPresent(e, 'null', 'sts-dn');
				var servicesArray = {
						facebook: "Facebook",
						twitter: "Twitter",
						linkedin: "LinkedIn",
						email: "Email"
				};
				var strTemp = "", len = sharedServices.length;
				if(len > 1){
					for (var c=0;c<len;c++) {
						for (var key in sharedServices[c]) {
							if(!servicesArray.hasOwnProperty(key)) continue;
							if(!sharedServices[c][key]) continue;
							if(strTemp.indexOf(servicesArray[key]) == -1){
								strTemp += ((strTemp)?', ':'') + servicesArray[key];
							}
						}
					}
					strTemp = strTemp.replace(/,([^,]*)$/, ' &amp; $1');
				}else{
					if(servicesArray.hasOwnProperty(service)){
						strTemp = servicesArray[service];
					}else{
						strTemp = e.innerHTML;
						strTemp = strTemp.substring(0,(strTemp.length - 3));
					}
				}
				e.innerHTML = strTemp;
				domUtilities.removeClassIfPresent('null', 'sharedMsg', 'sts-dn');
			}
		},

		showFailedServices : function(service)
		{
			var d=document.getElementById('incompleteSharedMsg');
			if (d) {
				domUtilities.removeClassIfPresent(d, 'null', 'sts-dn');
				d.innerHTML = "";
				var failedMsg1 = lang.strings['msg_share_fail'];
				var failedMsg2 = " - ";
				var failedMsg3 = lang.strings['msg_againLink'];

				d.appendChild(document.createTextNode(failedMsg1));

				var s = document.createElement("SPAN");
				s.setAttribute('id', "incompleteServices");
				//s.id = "incompleteServices";
				d.appendChild(s);

				d.appendChild(document.createTextNode(failedMsg2));
				var a = document.createElement("A");
				a.setAttribute('title', failedMsg3);
				if(a.attachEvent){
					a.attachEvent('onclick',function(){shareWidget.showHome();});
				}else{
					a.setAttribute('onclick', 'shareWidget.showHome()');
				}
				a.style.color = "#007794";
				a.setAttribute('href', 'javascript:void(0);');
				a.appendChild(document.createTextNode(failedMsg3));
				d.appendChild(a);
			}
		},

		showSuccess : function(service)
		{
			var d=document.getElementById('doneMsg');
			if (d) {
				d.innerHTML = lang.strings['msg_top_shareSuccess'];
			}
			//shareWidget.hideError();
			shareWidget.showSharedServices(service);
		},

		showFail : function(service)
		{
			var d=document.getElementById('doneMsg');
			if (d) {
				d.innerHTML = lang.strings['msg_top_shareFail'];
			}

			if (service) {
				shareWidget.showFailedServices(service);
				var el=document.getElementById('doneMsg');
				if (el) {
					el.innerHTML = "Sharing Incomplete!";
				}
				domUtilities.addClassIfNotPresent(document.getElementById('sharedMsg'), 'null', 'sts-dn');
				domUtilities.removeClassIfPresent('null', 'failureError', 'sts-dn');

				shareWidget.makeReauthLink(failedServices);

				var userDetails = stUser.getUserDetails();
				delete userDetails.thirdPartyUsers[service];
				for(var i in userDetails.thirdPartyTypes){
					if(service == userDetails.thirdPartyTypes[i]) {
						userDetails.thirdPartyTypes.splice(i,1);
						break;
					}
				}
				var stOAuthC = stlib.cookie.getCookie('stOAuth');
				if(stOAuthC){
					stOAuthC = stlib.json.decode(stOAuthC);
					delete stOAuthC[service];
					stlib.cookie.setCookie('stOAuth',stlib.json.encode(stOAuthC), 365);
				}
				/*var bigServicesList = domUtilities.searchElementsByClass("serviceDisplay", "a", '');
				for(var i in bigServicesList){
					var elem = bigServicesList[i];
					if(service==elem.getAttribute('data-value')){
						domUtilities.removeClassIfPresent(elem, '', 'checked');
						domUtilities.addClassIfNotPresent(elem, '', 'unchecked');
					}
				}*/
			}
		},

		hidePartialDone : function()
		{//alert("failedServices.length -- "+failedServices.length);
			domUtilities.removeClassIfPresent('null', 'loadingUrlInfo', 'sts-dn');
			shareWidget.onScreenChange(true);
			shareWidget.hideError();
			failedServices.splice(0, failedServices.length);
			domUtilities.addClassIfNotPresent('null', 'partialShared', 'sts-dn');
			_shownPartial = false;
			document.getElementById('partialSuccess').innerHTML = "";
			document.getElementById('partialFail').innerHTML = "";
			document.getElementById('partialReauth').innerHTML = "";
			reAuthedService = "";
			domUtilities.addClassIfNotPresent('null', 'loadingUrlInfo', 'sts-dn');
			//alert("failedServices.length2 -- "+failedServices.length);
		},

		resetDoneScreen : function()
		{
			sharedServices.splice(0, sharedServices.length);
			domUtilities.addClassIfNotPresent('null', 'failureError', 'sts-dn');
			domUtilities.addClassIfNotPresent('null', 'incompleteSharedMsg', 'sts-dn');
			domUtilities.removeClassIfPresent(document.getElementById('incompleteSharedMsg').firstChild, 'null', 'reddish');
			if(document.getElementById('failureError').hasChildNodes()){
				domUtilities.removeClassIfPresent(document.getElementById('failureError').firstChild, 'null', 'reddish');
			}

			var element=document.getElementById('sharedMsg');
			if (element) {
				element.innerHTML = lang.strings['msg_share_success'];
			}
			domUtilities.addClassIfNotPresent('null', 'sharedServices', 'sts-dn');
			element=document.getElementById('sharedServices');
			if (element) {
				element.innerHTML = "";
			}
			element=document.getElementById('doneMsg');
			if (element) {
				element.innerHTML = lang.strings['msg_top_shareSuccess'];
			}
		}
	};
}();

/********************Posters**********/

var poster= function(){
	var sharCreated = false, sharURL = "";

	return {
		clearSharURL : function(){
			sharURL = "";
			sharCreated = false;
		},

		/***************SHAR URL******************/

		createShar : function(url)
		{
			var tmpOptions=shareWidget.getConfigOptions();

			if(url!=="" && url!==" " && url!==null && !sharCreated)
			{
				if(tmpOptions.shorten!=true){
					//alert("Shorten value made False over here");
					sharURL=url;
					sharCreated = true;
					return true;
				}else{
					//alert("Shorten value made True over here");
					var data=["return=json","cb=poster.createShar_onSuccess","service=createSharURL","url="+encodeURIComponent(url)];
					data=data.join('&');
					jsonp.makeRequest("https://ws.sharethis.com/api/getApi.php?"+data);
				}
			}
		},

		createShar_onSuccess : function(response)
		{
			if(response.status=="SUCCESS")
			{
				sharURL=response.data.sharURL;
				sharCreated = true;
			}
		},

		getSharURL : function()
		{
			return sharURL;
		},

		postToWordpress : function(service)
		{
			var configOptions = shareWidget.getConfigOptions();
			/* Valid blog URL Message */

			var wpurl=document.getElementById('shareMessage').value;
			wpurl = wpurl.replace(/^https?:\/\//,'');
			//if(jsUtilities.trimString(wpurl)=='' || wpurl==document.getElementById('shareMessage').getAttribute('placeholder') || wpurl.indexOf('wordpress.com') == -1)
			if(jsUtilities.trimString(wpurl)=='' || wpurl==document.getElementById('shareMessage').getAttribute('placeholder'))
			{
				shareWidget.showError(lang.strings['msg_empty_wp']);
			} else {
				_$d_();
				_$d1("Submitted wordpress share");
				shareWidget.hideError();
				stlib.data.resetShareData();
				stlib.data.set("url", configOptions.URL, "shareInfo");

                                //SA-77: introduce new st_short_url parameter
                                stlib.data.set("short_url", configOptions.short_url, "shareInfo");

				stlib.data.set("title", configOptions.title, "shareInfo");
				stlib.data.set("buttonType", configOptions.type, "shareInfo");
				stlib.data.set("destination", "wordpress", "shareInfo");
				stlib.data.setSource("5x", configOptions);

				var ShareUT = '';
				if( (stlib.cookie.checkCookiesEnabled() == false) && (stlib.cookie.hasLocalStorage() == true)){
					ShareUT = localStorage['ShareUT'];
				}
				// Pass ShareUT in the request when TPC disabled
				if ((ShareUT !== false) && (ShareUT != "undefined") && (typeof(ShareUT) !== "undefined") && (!stlib.cookie.checkCookiesEnabled())) {
					stlib.data.set("token",ShareUT,"shareInfo");
				}


				if(typeof(configOptions.thumb)!='undefined' && configOptions.thumb!=null){
					stlib.data.set("image", configOptions.thumb, "shareInfo");
				}if(typeof(configOptions.summary)!='undefined' && configOptions.summary!=null){
					stlib.data.set("description", configOptions.summary, "shareInfo");
				}

				stlib.data.set("wpurl", wpurl, "shareInfo");
				stlib.sharer.share(null, configOptions.servicePopup);

				//console.log('in post to wordpress - ' +  url);
//				window.open(url,"post_wordpress" ,"status=1, height=700, width=970, resizable=1" );
				//shareWidget.poster=null;
				shareWidget.showMinorShareMsg();
				shareWidget.showDoneScreen(true);
			}
			return true;
		},

		post_onSuccess : function(response)
		{
			var shareStatus = true;
			//console.log(response);
			//if( (_shareToEmail && _isEmailShareDone) || !_shareToEmail){
				if(response){
					//alert(JSON.stringify(response));
					if(typeof(response.status)!='undefined' && response.status=="SUCCESS"){
						//domUtilities.removeClassIfPresent('null', 'sharedMsgNonEmail', 'sts-dn');
						if (typeof(response.statusMessage)!='undefined') {
							if (response.statusMessage=="EMAIL_SUCCESSFUL") {
								// Email success
								sharedServices.push({"email":1});
								shareWidget.showSuccess("email");
							}
							if (response.statusMessage=="LINKEDIN_POST_SUCCESSFUL") {
								// LinkedIn success
								sharedServices.push({"linkedin":1});
								shareWidget.showSuccess("linkedin");
							}
							if (response.statusMessage=="FACEBOOK_POST_SUCCESSFUL") {
								if ((/error/).test(response.postID)) {
									// Facebook fail
									sharedServices.push({"facebook":0});
									failedServices.push({"facebook":1});
									shareWidget.showFail("facebook");
									shareStatus = false;
								} else {
									// Facebook success
									sharedServices.push({"facebook":1});
									shareWidget.showSuccess("facebook");
								}
							}
						} else {
							// Twitter success
							sharedServices.push({"twitter":1});
							shareWidget.showSuccess("twitter");
						}
//						shareWidget.showDoneScreen(true);
					} else{
						shareStatus = false;
						if (typeof(response.statusMessage)!='undefined') {
							if (response.statusMessage=="" || response.statusMessage == "LINKEDIN_POST_FAILED") {
								// LinkedIn fail
								sharedServices.push({"linkedin":0});
								failedServices.push({"linkedin":1});
								shareWidget.showFail("linkedin");
							}
							if (response.statusMessage=="FACEBOOK_OAUTH_PERMISSIONS"
								|| response.statusMessage=="FACEBOOK_GET_PERMISSIONS_FAILED"
									|| response.statusMessage=="FACEBOOK_OAUTH_TOKEN_EXPIRED"
										|| response.statusMessage=="FACEBOOK_PERMISSIONS_MISSING"
											|| response.statusMessage=="FACEBOOK_POST_FAILED") {
								// Facebook fail
								sharedServices.push({"facebook":0});
								failedServices.push({"facebook":1});
								shareWidget.showFail("facebook");
							}
							if (response.statusMessage=="POST_TWITTER_SERVICE_FAILED") {
								if(response.errorMessage && response.errorMessage.length == 1 && response.errorMessage[0].code == 187){
									// Twitter success (consider success if it is duplicate issue)
									shareStatus = true;
									sharedServices.push({"twitter":1});
									shareWidget.showSuccess("twitter");
								}else{
									// Twitter fail (Not duplicate error)
									sharedServices.push({"twitter":0});
									failedServices.push({"twitter":1});
									shareWidget.showFail("twitter");
								}
							}
						} else {
							// Twitter fail
							sharedServices.push({"twitter":0});
							failedServices.push({"twitter":1});
							shareWidget.showFail("twitter");
						}
//						shareWidget.showDoneScreen(false);
					}
				} else{
					shareWidget.showFail();
					shareStatus = false;
				}
				//alert("failedServices.length - "+failedServices.length+" --- sharedServices.length - "+sharedServices.length);
				//alert("_partiallyShared -- "+_partiallyShared+"  _shownPartial -- "+_shownPartial+"  shareStatus -- "+shareStatus);
				if( (_shareToEmail && _isEmailShareDone) || !_shareToEmail){
					if(_partiallyShared !== null && (shareStatus !== _partiallyShared || _shownPartial === true)){
						// Show done screen for partially shared message
						shareWidget.showPartialDoneScreen();
						_shownPartial = true;
					}else{
						_partiallyShared = shareStatus;
						shareWidget.showDoneScreen(true);
					}
				}
				domUtilities.removeClassIfPresent('null', 'doneScrMessage', 'minors');
			//}
		},

		multiPost : function(user, articleObj, services, comment)
		{
			_$d_();
			_$d1("Starting a Multipost");
			_$d2("User:");
			_$d(user);
			_$d2("The object with article information:");
			_$d(articleObj);
			_$d2("The Services:");
			_$d(services);
			_$d2("The Comment:");
			_$d(comment);
			_$d_();

			var configOptions = shareWidget.getConfigOptions();

			var hasUrlInComment = comment.match(/http:\/\/.*shar.es/);
			if( hasUrlInComment){
				//comment = comment.slice(0, comment.indexOf(hasUrlInComment));
			}

			stlib.gaLogger.gaLog('Multi-Post - 5xa', services.toString());
			_partiallyShared = null;
			for(var i in services)
			{
				_$d1("Processing MultiShare: " + services[i]);
				//As Email delivery has been already handled in share5x.email.js, we are skipping it over here. If we again include this service, then always it shows the error for email destination :postOautherror.
		        if(services[i] == "email")
				{
					continue;
				}
				stlib.gaLogger.gaLog("Posting to.. - 5xa", services[i]);
				stlib.data.resetShareData();
				stlib.data.set("url",configOptions.URL,"shareInfo");

				//SA-77: introduce new st_short_url parameter
				stlib.data.set("short_url",configOptions.short_url,"shareInfo");

				stlib.data.set("sharURL",articleObj.url,"shareInfo");
				stlib.data.set("title",articleObj.title,"shareInfo");
				stlib.data.set("image",configOptions.thumb,"shareInfo");
				stlib.data.set("description",configOptions.summary,"shareInfo");
				stlib.data.set("buttonType",configOptions.type,"shareInfo");
				stlib.data.set("destination",services[i],"shareInfo");
				stlib.data.setSource("oauth5x", configOptions);

				var ShareUT = '';
				if( (stlib.cookie.checkCookiesEnabled() == false) && (stlib.cookie.hasLocalStorage() == true)){
					ShareUT = localStorage['ShareUT'];
				}
				// Pass ShareUT in the request when TPC disabled
				if ((ShareUT !== false) && (ShareUT != "undefined") && (typeof(ShareUT) !== "undefined") && (!stlib.cookie.checkCookiesEnabled())) {
					stlib.data.set("token",ShareUT,"shareInfo");
				}

				var twitterComment = comment;
				if(comment==lang.strings['shareMessage']){comment='';}
				if(twitterComment==lang.strings['shareMessage']){twitterComment='';}

				stlib.data.set("comment",comment,"shareInfo");
				var currentService = services[i];
				if (services[i].search('facebookfriend')!='-1') {
					currentService = 'facebookfriend';
					stlib.data.set("destination",'facebookfriend',"shareInfo");
				}
				switch(currentService) {
					case "twitter":
						if(twitterComment.length > 117) {
							var tUrl = twitterComment.slice(twitterComment.indexOf('http'), twitterComment.indexOf('http') + 24);
							twitterComment = twitterComment.slice(0, 112) + '... ' + tUrl;
						}
						stlib.data.set("comment",twitterComment,"shareInfo");
						break;
					case "facebook":
						break;
					case "yahoo":
						break;
					case "linkedin":
						break;
					case "facebookfriend": //TODO: check this
						var friendId = services[i].slice(services[i].indexOf('-') + 1);
						stlib.data.set("friend_id",friendId,"shareInfo");
						break;
				}
				stlib.sharer.oauth.share(poster.post_onSuccess);
			}
		}
	};
}();

//Adds initialize to be called when dom ready
if (typeof(window.addEventListener) != 'undefined') {
    window.addEventListener("load", shareWidget.initialize, false);
} else if (typeof(document.addEventListener) != 'undefined') {
	document.addEventListener("load", shareWidget.initialize, false);
} else if (typeof window.attachEvent != 'undefined') {
	window.attachEvent("onload", shareWidget.initialize );
}


/***************I18N******************/
if(typeof(lang)=="undefined"){
	var lang={};
	lang.strings=new Object;

	/* -- */

	lang.strings['msg_no_services_selected'] = 'Oops, an error : please select a service below to share to.';
	lang.strings['msg_no_email_recipients'] = 'Please enter a valid recipient email address.';
	lang.strings['msg_valid_email_add_from'] = 'Please enter a valid email address in the "From" field.';
	lang.strings['msg_valid_recipients'] = 'Please enter a valid recipient';
	lang.strings['msg_share']="Share this with your friends";
	lang.strings['email_msg_share']="Select your email service";
	lang.strings['msg_view_all']="More";
	lang.strings['msg_hide_all']="Back";
	lang.strings['msg_share_success']="Your message was successfully shared to ";
	lang.strings['msg_share_again']="Successfully Shared!";
	lang.strings['msg_related_shares']="Most Popular Articles";
	lang.strings['msg_get_button'] = 'Get the button!';
	lang.strings['msg_get_toolbar'] = 'Get the add-on now!';
//	lang.strings['msg_put_sharethis'] = 'Install the ShareThis toolbar on your browser and then share easily from any website!';
	lang.strings['msg_put_sharethis'] = 'Easily share your favorite finds online with a click of a button';
	lang.strings['msg_email_privacy'] = 'Privacy Policy';
	lang.strings['msg_import_contacts'] = 'Import contacts';
	lang.strings['msg_signout']="Sign out";
	lang.strings['msg_failed_login']='An error occured during login. Retrying..';
	lang.strings['msg_empty_wp']='Please enter a valid wordpress blog address below to share.';
	lang.strings['msg_empty_att']='Please enter a valid client ID below to share.';
	lang.strings['msg_email_to'] = 'To';
	lang.strings['msg_email_from'] = 'From';
	lang.strings['msg_share_to_destinations'] = 'Pick one or more destinations:';
	lang.strings['msg_failed_share'] = 'There was an error while sharing. Please try again.';
	lang.strings['msg_facebook_friend'] = 'Please enter a valid Facebook friend name.';
	lang.strings['msg_greeting'] = 'Hi';
	lang.strings['msg_top_emailshare']="Sign in to share via email";
	lang.strings['msg_emailshare_direct_click'] = 'Please login to send email.';
	lang.strings['chicklet_search_field'] = 'Search for services'; //Currently, this is NOT in all languages
	lang.strings['shareMessage'] = 'Write your comment here...'; //Currently, this is NOT in all languages
	lang.strings['txtYourAddr'] = 'To'; //Currently, this is NOT in all languages
	lang.strings['txtFromAddr'] = 'From'; //Currently, this is NOT in all languages
	lang.strings['msg_top_singleShared'] = ''; //Currently, this is NOT in all languages
	lang.strings['msg_top_shareSuccess'] = 'Successfully Shared!'; //Currently, this is NOT in all languages
	lang.strings['msg_top_shareFail'] = 'Sharing incomplete!'; //Currently, this is NOT in all languages
	lang.strings['msg_againLink'] = 'Share again'; //Currently, this is NOT in all languages
	lang.strings['msg_share_fail']="Your message could not be shared. "; //Currently, this is NOT in all languages
	lang.strings['msg_share_partial']="Looks like there's been a bit of a hiccup"; //Currently, this is NOT in all languages
}

//console.log("EOF");
/********************END SHARE5xa CODE***********************/
