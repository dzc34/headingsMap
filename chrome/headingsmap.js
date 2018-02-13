(function(){
	var i=function(a){
		this.sections=[];
		this.startingNode=a
	};
	var originalH = 0;
	var contoffTop = 0;
	var contLeft = 0;
	var bodscroll = 0;
	var dif = 0;
	var heightDoc = 0;
	var widthDoc = 0;
	i.prototype={
		heading:false,
		append:function(a){
			a.container=this;
			this.sections.push(a)
		},
		asHTML:function(a){
			var b = u(this.heading);
			if(a){
				var cad = b;
				if(cad.indexOf('BIONOHEAD') >= 0){
					var treerow = document.createElement("span");
					if(headingsMap_outError == 'true')
						treerow.setAttribute("class",'BIONOHEAD');
					cad = " Untitled (" + cad.replace('BIONOHEAD',"") + ")";
				}else{
					var treerow = document.createElement("a");
					var dest = v(this.startingNode);
					treerow.setAttribute("href",'#' + dest);
				}
				var span = document.createElement('span');
				span.setAttribute('class','bio_head');
				
				if(headingsMap_outElem == 'true')
					var texto = document.createTextNode("[" + this.startingNode.tagName.toLowerCase().replace("body","document") + "] - ");
				else
					var texto = document.createTextNode('');
				span.appendChild(texto);
				texto = document.createTextNode(cad);
				treerow.setAttribute("title",cad);
				treerow.appendChild(span);
				treerow.appendChild(texto);

			}
			var jarl = new Array();
			jarl[0] = treerow;
			jarl[1] = q(this.sections,a);
			return jarl;
		}
	};
	var q=function(a,b){
		var f = new Array();
		var treechildren = document.createElement("ul");
		for(var c=0;c<a.length;c++){
			var treeitem = document.createElement("li");
			treeitem.appendChild(a[c].asHTML(b)[0]);
			if(a[c].asHTML(b)[1].childNodes.length)
				treeitem.appendChild(a[c].asHTML(b)[1]);
			f.push(treeitem);
		}
		
		for(var i=0;i<f.length;i++)
			treechildren.appendChild(f[i]);
		
		return treechildren
	},
	r=function(a){
		a=a.heading;
		return h(a)?j(a):1
	},
	u=function(a){
		if(h(a)){
			return bio_headings_getText(a)||a.innerText||"BIONOHEADno content inside " + a.nodeName			
		}
		return""+a
	},
	v = function (a) {
        var b = a.getAttribute("id");
        if (b) return b;
        do b = "h5o-" + ++s; while (t.getElementById(b));
        a.setAttribute("id", b);
        return b
    },
	e,d,g,s,t,w=function(a,b,f){
		var c=a;
		a:for(;c;){
			b(c);
			if(c.firstChild){
				c=c.firstChild;
				continue a
			}
			for(;c;){
				f(c);
				if(c.nextSibling){
					c=c.nextSibling;
					continue a
				}
				c=c==a?null:c.parentNode
			}
		}
	},
	x=function(a){
		if(!h(o(g)))
			if(l(a)||m(a)){
				e!=null&&g.push(e);
				e=a;
				d=new i(a);
				e.outline={
					sections:[d],
					startingNode:a,
					asHTML:function(c){
						return q(this.sections,c)
					}
				}
			}else if(e!=null)
				if(h(a)){
					if(d.heading)
						if(j(a)>=r(n(e.outline))){
							var b=new i(a);
							e.outline.sections.push(b);
							d=b;
							d.heading=a
						}else{
							b=false;
							var f=d;
							do{
								if(j(a)<r(f)){
									b=new i(a);
									f.append(b);
									d=b;
									d.heading=a;
									b=true
								}
								f=f.container
							}while(!b)
						}
					else 
						d.heading=a;
					g.push(a)
				}
			},
			y=function(a){
				var b=o(g);
				if(h(b))
					b==a&&g.pop();
				else{
					if((l(a)||m(a))&&!d.heading)
						d.heading="BIONOHEADno head element";
					if(l(a)&&g.length>0){
						e=g.pop();
						d=n(e.outline);
						for(b=0;b<a.outline.sections.length;b++)
							d.append(a.outline.sections[b])
					}else if(m(a)&&g.length>0){
						e=g.pop();
						for(d=n(e.outline);d.sections.length>0;)
							d=n(d)
					}else if(l(a)||m(a))
						d=e.outline.sections[0]
				}
			},
			p=function(a){
				return function(b){
					return b&&b.tagName&&(new RegExp(a,"i")).test(b.tagName.toUpperCase())
				}
			},
			m=p("^BLOCKQUOTE|BODY|DETAILS|FIELDSET|FIGURE|TD$"),
			mm=p("^BODY$"),
			l=p("^ARTICLE|ASIDE|NAV|SECTION$"),
			ll=p("^$"),
			h=p("^H[1-6]$"),
			j=function(a){
				var b=a.tagName.toUpperCase();
				return-parseInt(b.substr(1))
			},
			n=function(a){
				return o(a.sections)
			},
			o=function(a){
				return a[a.length-1]
			};
			bio_headings_HTML5Outline=function(a){
				s=0;
				t=a.ownerDocument||window.document;
				d=e=null;
				g=[];
				w(a,x,y);
				return e!=null?e.outline:null
			};
			resuelvexpath=function(nodo, expresion) {
				var iterator = nodo.evaluate(expresion, nodo, null, XPathResult.ANY_TYPE, null );
				switch(iterator.resultType){
					case 1:
						return iterator.numberValue;
						break;
					case 2:
						return iterator.stringValue;
						break;
					case 4:
						var thisIterator = iterator.iterateNext();
						var encontrados = new Array();
						while (thisIterator) {
							encontrados.push(thisIterator);
							thisIterator = iterator.iterateNext();
						}
						return encontrados;
						break;
				}
			};
			getElementsByTagNames=function(elementos,documentoPadre) {
				var individuales = elementos.split('-');
				var listaElementos = new Array();
				for (var i = 0; i < individuales.length; i++) {
					var etiqueta = documentoPadre.getElementsByTagName(individuales[i]);
					for (var j = 0; j < etiqueta.length; j++) {
						listaElementos.push(etiqueta[j]);
					}
				}
				var dummy = listaElementos[0];
				if (!dummy) return [];
				if (dummy.sourceIndex) {
					listaElementos.sort(function (a,b) {
							return a.sourceIndex - b.sourceIndex;
					});
				} else if (dummy.compareDocumentPosition) {
					listaElementos.sort(function (a,b) {
							return 3 - (a.compareDocumentPosition(b) & 6);
					});
				}
				return listaElementos;
			}
		})();

function bio_headings_headingsMap(){
	var encabezados = getElementsByTagNames('h1-h2-h3-h4-h5-h6',document);
	
					var cadena;
					var where= new Array();
					var maxHead = 0;
					var anterior = 0;
					var anteriorcorrecto = 0;
					var actual = 0;
					var totales = 0;
					var acc_cont = 0;
					var superior = document.createElement('div');
					superior.setAttribute('id','mapa');
					superior.setAttribute('class', 'bio_hroot');
					var padre = document.createElement('ul');
					superior.appendChild(padre);
					var lista = padre;
					padre.setAttribute('class', 'bio_h' + actual);
					if(!encabezados.length){
						var item = document.createElement('li');
						padre.appendChild(item);
						var tmp = document.createTextNode('No headings');
						var sptp = document.createElement('span');
						sptp.setAttribute('class', 'BIONOHEAD');
						sptp.appendChild(tmp);
						item.appendChild(sptp);
					}
					for (var i = 0; i < encabezados.length; i++) {
						actual = parseInt(encabezados[i].tagName.toLowerCase().replace('h', ''));
						var item = document.createElement('li');
						if (actual > anterior) {
							var tmp = document.createElement('ul');
							var clase = 'bio_h' + actual;
							tmp.setAttribute('class', clase);
							tmp.appendChild(item);
							if(padre.tagName.toLowerCase() == 'ul')
								padre.appendChild(item);
							else
								padre.appendChild(tmp);
						}
						if (actual == anterior) {
							padre = padre.parentNode;
							padre.appendChild(item);
							anteriorcorrecto = actual;
						}
						if (actual < anterior) {
							var padreTemp = padre;
							while(padreTemp.parentNode.getAttribute('class') != 'bio_hroot'){
								padreTemp = padreTemp.parentNode;
								if(padreTemp.getAttribute('class').indexOf('bio_h') >= 0){
									var cl = parseInt(padreTemp.getAttribute('class').replace('bio_h', ''));
									if(actual >= cl){
										padre = padreTemp;
										break;
									}
								}else{
									var cl = parseInt(padreTemp.getAttribute('class').replace('biohead', ''));
									if(actual > cl){
										padre = padreTemp.getElementsByTagName('ul')[0];
										break;
									}else{
										if(actual == cl){
											padre = padreTemp.parentNode;
											break;
										}
									}
								}
							}
							padre.appendChild(item);
						}
						padre = item;
						cadena = '';
						var lv =  actual;
						cadena = bio_headings_getText(encabezados[i]).replace(/\n/g, '').replace(/\t/g, '');
							
						var ancla = '';
						if(encabezados[i].getAttribute('id')){
							ancla = encabezados[i].getAttribute('id');
						}else{
							if(encabezados[i].getAttribute('name')){
								ancla = encabezados[i].getAttribute('name');
							}else{
								if(encabezados[i].getElementsByTagName('a').length > 0){
									if(encabezados[i].getElementsByTagName('a')[0].getAttribute('id')){
										ancla = encabezados[i].getElementsByTagName('a')[0].getAttribute('id');
									}else{
										if(encabezados[i].getElementsByTagName('a')[0].getAttribute('name'))
											ancla = encabezados[i].getElementsByTagName('a')[0].getAttribute('name');
									}
								}
							}
						}						

						var enlace = document.createElement('a');
						enlace.setAttribute('href', '#' + ancla);
						var ht = document.createElement('span');
						ht.setAttribute('class','bio_head');
						var tp = '';
						if(headingsMap_headLevels == 'true')
							tp = actual + ' - ';
						var htt = document.createTextNode(tp);
						ht.appendChild(htt);
						enlace.appendChild(ht);
						var tmp = document.createTextNode(cadena);
						enlace.appendChild(tmp);
						padre.appendChild(enlace);
						padre.setAttribute('class', 'biohead' + lv);
						if(actual > anterior + 1)
							if((i == 0 && headingsMap_headErrorH1 == 'true' && headingsMap_headError == 'true') || (i > 0 && headingsMap_headError == 'true'))
								enlace.setAttribute('class', 'bio_head_error');
						anterior = actual;
					}
	
	
	return lista;
}
var headingsMap_outLevels;
var headingsMap_outElem;
var headingsMap_outError;
var headingsMap_headLevels;
var headingsMap_headError;
var headingsMap_headErrorH1;


if (window == top) {
	chrome.extension.sendRequest({msg : "showAction"});	
	chrome.extension.onRequest.addListener(function(req, sender, sendResponse) {
		headingsMap_outLevels = req.headingsMap_outLevels;
		headingsMap_outElem = req.headingsMap_outElem;
		headingsMap_outError = req.headingsMap_outError;
		headingsMap_headLevels = req.headingsMap_headLevels;
		headingsMap_headError = req.headingsMap_headError;
		headingsMap_headErrorH1 = req.headingsMap_headErrorH1;
		
		if(!headingsMap_outLevels)
			headingsMap_outLevels = 'true';
		if(!headingsMap_outElem)
			headingsMap_outElem = 'true';
		if(!headingsMap_outError)
			headingsMap_outError = 'true';
		if(!headingsMap_headLevels)
			headingsMap_headLevels = 'true';
		if(!headingsMap_headError)
			headingsMap_headError = 'true';
		if(!headingsMap_headErrorH1)
			headingsMap_headErrorH1 = 'true';
			
		if (req.msg == "getOutline"){
				var rh = resuelvexpath(document, '//h1 | //h2 | //h3 | //h4 | //h5 | //h6');
				for(var ri = 0; ri - rh.length; ri++){
					if(!(rh[ri].getAttribute('id'))){
						rh[ri].setAttribute('id','hmap-' + ri);
					}
				}
				
				var heads = bio_headings_headingsMap();
				var outline = bio_headings_HTML5Outline(document.body);
				bio_headings_close();
				var contenedor = document.createElement('div');
				contenedor.setAttribute('draggable','true');
				contenedor.setAttribute('id','bio_headinsgmap');
				contenedor.addEventListener('dragstart',bio_headings_drag_start,false); 
				var close = document.createElement('a');
				close.setAttribute('id','bio_headinsgmap_closer');
				close.onclick=function(){bio_headings_close()};
				contenedor.appendChild(close);
				var outlinerTab = document.createElement('a');
				outlinerTab.setAttribute('id','bio_outlinerTab');
				outlinerTab.onclick=function(){bio_headings_show('bio_headinsgmap_outliner',this)};
				var outText = document.createTextNode('HTML5 Outline');
				outlinerTab.appendChild(outText)
				var headingsTab = document.createElement('a');
				headingsTab.setAttribute('id','bio_headingsTab');
				headingsTab.onclick=function(){bio_headings_show('bio_headinsgmap_headings',this)};
				var headText = document.createTextNode('Headings');
				headingsTab.appendChild(headText)
				contenedor.appendChild(outlinerTab);
				contenedor.appendChild(headingsTab);
				contenedor.appendChild(outline.asHTML(true));
				contenedor.appendChild(heads);
				
				contenedor.childNodes[3].setAttribute('id','bio_headinsgmap_outliner');
				contenedor.childNodes[4].setAttribute('id','bio_headinsgmap_headings');
				if(headingsMap_outLevels == 'true')
					bio_headings_numera(contenedor.childNodes[3],0);
				document.body.appendChild(contenedor);
				document.body.addEventListener('dragover',bio_headings_drag_over,false); 
				document.body.addEventListener('drop',bio_headings_drop,false);
				originalH = contenedor.offsetHeight;
				contenedor.style.top = document.body.scrollTop + 5 + 'px';
				contoffTop = document.body.scrollTop + 5;
				bodscroll = document.body.scrollTop;
				dif = 10;
				var body = document.body,
				html = document.documentElement;
				heightDoc = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
				widthDoc = Math.max( body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
				if(localStorage['headingsMap_currentTab'] == 'bio_headinsgmap_outliner'){
					outlinerTab.setAttribute('class','bio_current');
				}
				if(localStorage['headingsMap_currentTab'] == 'bio_headinsgmap_headings'){
					headingsTab.setAttribute('class','bio_current');
					document.getElementById('bio_headinsgmap_headings').style.display = 'block';
				}else{
					outlinerTab.setAttribute('class','bio_current');
					document.getElementById('bio_headinsgmap_outliner').style.display = 'block';
				}
				var conf = document.createElement('a');
				conf.setAttribute('id','bio_headinsgmap_conf');
				conf.setAttribute('href','#');
				conf.onclick=function(){window.open('chrome-extension://flbjommegcjonpdmenkdiocclhjacmbi/options.html','_blank');return false};
				//contenedor.appendChild(conf);
		}
	});
}
function bio_headings_numera(ul,tipo){
	for(var i = 0; i < ul.childNodes.length; i++){
		if(headingsMap_outElem == 'true')
			var it = document.createTextNode(i+1 + ' ');
		else
			var it = document.createTextNode(i+1 + ' - ');
		var span = document.createElement('span');
		span.setAttribute('class','bio_head_number');
		span.appendChild(it);
		ul.childNodes[i].childNodes[0].insertBefore(span,ul.childNodes[i].childNodes[0].childNodes[0]);
		span.appendChild(ul.childNodes[i].childNodes[0].childNodes[1]);
		for(var a = 0; a < ul.childNodes[i].childNodes.length; a++){
			if(ul.childNodes[i].childNodes[a].tagName == 'UL')
				bio_headings_numera(ul.childNodes[i].childNodes[a],tipo)
		}
	}
}
function bio_headings_show(id,wh){
	document.getElementById('bio_outlinerTab').setAttribute('class','');
	document.getElementById('bio_headingsTab').setAttribute('class','');	
	wh.setAttribute('class','bio_current');
	document.getElementById('bio_headinsgmap_outliner').style.display = 'none';
	document.getElementById('bio_headinsgmap_headings').style.display = 'none';
	document.getElementById(id).style.display = 'block';
	localStorage['headingsMap_currentTab'] = id;
}
function bio_headings_close(){
	if(document.getElementById('bio_headinsgmap')){
		document.body.removeChild(document.getElementById('bio_headinsgmap'));
	}
}
function bio_headings_drag_start(event) {
    var style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData("text/plain",(parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY));
} 
function bio_headings_drag_over(event) { 
    event.preventDefault(); 
    return false; 
} 
function bio_headings_drop(event) { 
    var offset = event.dataTransfer.getData("text/plain").split(',');
    var dm = document.getElementById('bio_headinsgmap');
    contLeft = (event.clientX + parseInt(offset[0],10));
    dm.style.left = contLeft + 'px';
	contoffTop = (event.clientY + parseInt(offset[1],10));
    dm.style.top = contoffTop + 'px';
	bodscroll = document.body.scrollTop;
	dif = contoffTop - bodscroll;
	if(dif < 0){
		dif = 0;
		contoffTop = 5;
		dm.style.top = contoffTop + 'px';
		dif = contoffTop - bodscroll;
	}
	if(contoffTop + dm.offsetHeight > heightDoc){
		contoffTop = heightDoc - dm.offsetHeight - 5;
		dm.style.top = contoffTop + 'px';
		dif = contoffTop - bodscroll;
	}
	if(contLeft < 0){
		contLeft = 5;
		dm.style.left = contLeft + 'px';
	}
	if(contLeft + dm.offsetWidth > widthDoc){
		contLeft = widthDoc - dm.offsetWidth - 5;
		dm.style.left = contLeft + 'px';
	}
    event.preventDefault();
    return false;
}
	function bio_headings_getText(element) {
		if (element.nodeType == 3) return element.nodeValue.replace("\"","'").replace("\"","'").replace("<","&lt;").replace(">","&gt;");
		if(element.tagName.toLowerCase() == 'img' || element.tagName.toLowerCase() == 'area' || (element.tagName.toLowerCase() == 'input' && element.getAttribute('type').toLowerCase() == 'image')) {
			var alternativas = '';
			if(element.getAttribute('alt')) alternativas += element.getAttribute('alt');
			return alternativas;
		}
		var texto = new Array();
		if(element.childNodes[0]){
			if(element.childNodes[0].nodeType != 8)
				texto[0] = bio_headings_getText(element.childNodes[0]);
		}
		var i = 1;
		if(element.childNodes[i]){
			while(element.childNodes[i]) {
				if(element.childNodes[i]){
					if(element.childNodes[i].nodeType != 8)
						texto[texto.length] = bio_headings_getText(element.childNodes[i]);
					i++;
				}
			}
		}
		return texto.join('').replace(/  /g,' ').replace(/  /g,' ').replace(/  /g,' ').replace(/\n/g,'').replace(/\t/g,'').replace(/  /g,' ');
	}

window.onscroll=function(){
	if(document.getElementById('bio_headinsgmap')){
		var contenedor = document.getElementById('bio_headinsgmap');
		var destPosX = document.body.scrollTop + dif;
		contenedor.style.top = destPosX + 'px';
		contoffTop = destPosX;
		bodscroll = document.body.scrollTop;
		dif = contoffTop - bodscroll;
		if(contoffTop + contenedor.offsetHeight > heightDoc){
			contoffTop = heightDoc - contenedor.offsetHeight - 5;
			contenedor.style.top = contoffTop + 'px';
			dif = contoffTop - bodscroll;
		}
	}
};

