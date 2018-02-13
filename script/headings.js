// This is a very old code that I will refactor...

var rumoHeadingsmap_bio_headings = {
    modo: '',
    text2Copy: '',
    where: [],
    plegados: [],
    marco: 0,
    previoHead: -1,
    paneles: 1,
    activar: true,
    treeActual: document.getElementById('mapa'),
    execAll: function () {
        rumoHeadingsmap_bio_headings.cargaMarcos();
        rumoHeadingsmap_bio_headings.encabezados();
        rumoHeadingsmap_bio_headings.cleanPrevioHead();

    },
    hideAll: function () {
        // the next...
    },
    ratonClick: function (e, ind) {
        if (e.button == 2) {
            rumoHeadingsmap_bio_headings.activar = false;
            document.getElementById('copyText').setAttribute('disabled', !ind.view.getItemAtIndex(ind.currentIndex).firstChild.firstChild.getAttribute('label'));
            document.getElementById('copyLink2Head').setAttribute('disabled', !ind.view.getItemAtIndex(ind.currentIndex).firstChild.firstChild.getAttribute('value'));
            rumoHeadingsmap_bio_headings.text2Copy = ind;
        } else {
            rumoHeadingsmap_bio_headings.activar = true;
            rumoHeadingsmap_bio_headings.selectHead(ind);
        }
    },
    keyClick: function (e, ind) {
        if (e.keyCode == 13) {
            rumoHeadingsmap_bio_headings.activar = true;
            rumoHeadingsmap_bio_headings.selectHead(ind);
        } else {
            rumoHeadingsmap_bio_headings.activar = false;
        }
    },
    getText: function (element) {
        var texto = [],
            elementTagName = element.tagName.toLowerCase();

        if (element.nodeType == 3) {
            return element.nodeValue.replace(/\n/g, ' ').replace(/\t/g, ' ').replace(/  /g, ' ').replace(/  /g, ' ').replace(/  /g, ' ').replace(/  /g, ' ');
        }

        if (elementTagName == 'img' || elementTagName == 'area' || (elementTagName == 'input' && element.getAttribute('type').toLowerCase() == 'image')) {
            return element.getAttribute('alt') || '';
        }

        if (element.childNodes[0] && element.childNodes[0].nodeType != 8) {
            texto[0] = rumoHeadingsmap_bio_headings.getText(element.childNodes[0]);
        }

        var i = 1;
        if (element.childNodes[i]) {
            while (element.childNodes[i]) {
                if (element.childNodes[i]) {
                    if (element.childNodes[i].nodeType != 8) {
                        texto[texto.length] = rumoHeadingsmap_bio_headings.getText(element.childNodes[i]);
                    }
                    i++;
                }
            }
        }
        return texto.join('').replace(/\n/g, ' ').replace(/\t/g, ' ').replace(/  /g, ' ').replace(/  /g, ' ').replace(/  /g, ' ').replace(/  /g, ' ');
    },
    getElementsByClassName: function (oElm, strTagName, oClassNames) {
        var arrElements = (strTagName == "*" && oElm.all) ? oElm.all : oElm.getElementsByTagName(strTagName),
            arrReturnElements = [],
            arrRegExpClassNames = [],
            oElement,
            bMatchesAll;

        if (typeof oClassNames == "object") {
            for (var i = 0, classNamesLength = oClassNames.length; i < classNamesLength; i++) {
                arrRegExpClassNames.push(new RegExp("(^|\\s)" + oClassNames[i].replace(/\-/g, "\\-") + "(\\s|$)"));
            }
        } else {
            arrRegExpClassNames.push(new RegExp("(^|\\s)" + oClassNames.replace(/\-/g, "\\-") + "(\\s|$)"));
        }
        for (var j = 0; j < arrElements.length; j++) {
            oElement = arrElements[j];
            bMatchesAll = true;
            for (var k = 0; k < arrRegExpClassNames.length; k++) {
                if (!arrRegExpClassNames[k].test(oElement.className)) {
                    bMatchesAll = false;
                    break;
                }
            }
            if (bMatchesAll) {
                arrReturnElements.push(oElement);
            }
        }
        return (arrReturnElements);
    },
    getAbsolutePosition: function (el) {
        var yPos = 0;
        var xPos = 0;
        if (!el) return {top: 0, left: 0};
        while (el.offsetParent) {
            xPos += el.offsetLeft;
            yPos += el.offsetTop;
            el = el.offsetParent;
        }
        return {top: yPos, left: xPos};
    },
    cleanHeadings: function () {
        var treechildrens = document.getElementById('mapa').getElementsByTagName('treechildren');
        for (var i = treechildrens.length - 1; i >= 0; i--) {
            treechildrens[i].parentNode.removeChild(treechildrens[i]);
        }
        if (document.getElementById("html5").childNodes.length > 1) {
            document.getElementById("html5").removeChild(document.getElementById("html5").childNodes[1])
        }
    },
    cleanMarcos: function () {
        try {
            var documentos = rumoHeadingsmap_bio_documents.documents();
            var vbox = document.getElementsByTagName('vbox');
            for (var i = vbox.length - 1; i >= 0; i--) {
                if (vbox[i].getAttribute('class') == 'basecopy') {
                    vbox[i].parentNode.removeChild(vbox[i]);
                }
            }
            var splitter = document.getElementsByTagName('splitter');
            for (var i = splitter.length - 1; i >= 0; i--) {
                splitter[i].parentNode.removeChild(splitter[i]);
            }
        } catch (e) {
        }
    },
    creaPanel: function (previo, orden, tipo) {
        if (tipo.split(' - ')[0] != 'Iframe') {
            var vbox = document.createElement('vbox');
            vbox.setAttribute('flex', '4');
            vbox.setAttribute('class', 'basecopy');
            var label = document.createElement('label');
            label.setAttribute('value', tipo.split(' - ')[0] + ' ' + orden);
            var box = document.createElement('box');
            box.setAttribute('flex', '1');
            box.setAttribute('orient', 'vertical');
            box.setAttribute('id', 'box' + orden);
            box.setAttribute('tooltiptext', tipo.split(' - ')[1]);
            var tree = document.createElement('tree');
            tree.setAttribute('flex', '1');
            tree.setAttribute('hidecolumnpicker', 'true');
            tree.setAttribute('id', 'mapa' + orden);
            tree.addEventListener("mousedown", function () {
                    rumoHeadingsmap_bio_headings.ratonClick(event, this);
                    rumoHeadingsmap_bio_headings.cleanTreeSeleccion(this);
                    rumoHeadingsmap_bio_headings.selectHead(this);
                },
                false);
            var treecols = document.createElement('treecols');
            var treecol = document.createElement('treecol');
            treecol.setAttribute('hideheader', 'true');
            treecol.setAttribute('primary', 'true');
            treecol.setAttribute('flex', '3');
            treecols.appendChild(treecol);
            tree.appendChild(treecols);
            box.appendChild(tree);
            vbox.appendChild(label);
            vbox.appendChild(box);
            var splitter = document.createElement('splitter');
            splitter.setAttribute('id', 'box' + orden + '_splitter');
            previo.parentNode.appendChild(splitter);
            previo.parentNode.appendChild(vbox);
            paneles++;
        }
    },
    showHideNext: function (jarl) {
        if (paneles > 1) {
            if (jarl.nextSibling.style.display == '') {
                jarl.setAttribute('class', ' pl');
            } else {
                jarl.nextSibling.style.display = '';
                jarl.removeAttribute('class');
            }
        }
    },
    modoPanel: function () {
        rumoHeadingsmap_headingsMapconfig.getStyles();
        document.getElementById('headingsmap-error').checked = rumoHeadingsmap_headingsMapconfig.showErrors;
        document.getElementById('headingsmap-showIframes').checked = rumoHeadingsmap_bio_headings.modo;
        document.getElementById('headingsmap-markHeads').checked = rumoHeadingsmap_headingsMapconfig.markHeads;
        document.getElementById('headingsmap-showNumberOutlines').checked = rumoHeadingsmap_headingsMapconfig.showNumberOutlines;
        document.getElementById('headingsmap-showElementsName').checked = rumoHeadingsmap_headingsMapconfig.showElementsName;
        document.getElementById('headingsmap-outlineErrors').checked = rumoHeadingsmap_headingsMapconfig.outlineErrors;

        rumoHeadingsmap_bio_headings.execAll();
    },
    cargaMarcos: function () {
        rumoHeadingsmap_bio_headings.cleanMarcos();
        try {
            var documentos = rumoHeadingsmap_bio_documents.documents();
            var tipodocumentos = rumoHeadingsmap_bio_documents.documentTypes();
            document.getElementById('base').getElementsByTagName('label')[0].removeAttribute('value');
            paneles = 1;
            for (var doc_number = 0; doc_number < documentos.length; doc_number++) {
                if (doc_number > 0)
                    rumoHeadingsmap_bio_headings.creaPanel(document.getElementById('base'), doc_number, tipodocumentos[doc_number])
            }
            if (window.content.document.getElementsByTagName('frameset').length) {
                document.getElementById('base').style.display = 'none';
                document.getElementsByTagName('splitter')[0].style.display = 'none';
            } else {
                document.getElementById('base').style.display = '';
            }
        } catch (e) {
        }

    },
    newMarco: function (valor) {
        rumoHeadingsmap_bio_headings.marco = valor;
    },
    numeraCap: function (arbol, indice) {
        var childNode, nodeName;

        for (var i = 0; i < arbol.childNodes.length; i++) {
            childNode = arbol.childNodes[i];
            nodeName = childNode.tagName;

            if (nodeName.toLowerCase() == "treeitem") {
                indice = i + 1;
            } else if (nodeName.toLowerCase() == "treecell") {
                childNode.setAttribute("label", indice + " - " + childNode.getAttribute("label"));
            }

            if (childNode.childNodes.length > 0) {
                rumoHeadingsmap_bio_headings.numeraCap(childNode[i], indice);
            }
        }
    },
    encabezados: function () {
        try {
            var documentos = rumoHeadingsmap_bio_documents.documents();
            parser = new DOMParser();
            try {
                var text = HTML5Outline(documentos[0]).asHTML(true);
                if (document.getElementById("html5").childNodes.length > 1) {
                    document.getElementById("html5").removeChild(document.getElementById("html5").childNodes[1])
                }
                document.getElementById("html5").appendChild(text);
                if (rumoHeadingsmap_headingsMapconfig.showNumberOutlines) {
                    rumoHeadingsmap_bio_headings.numeraCap(document.getElementById("html5"), 1);
                }
            } catch (e) {
            }

            var documentos = rumoHeadingsmap_bio_documents.documents();
            var tipodocumentos = rumoHeadingsmap_bio_documents.documentTypes();
            var contenedores = rumoHeadingsmap_bio_documents.contents();
            var padres = document.getElementsByTagName('tree');
            var laterallevel1 = false;
            var laterallevel2 = false;
            var total = documentos.length;
            for (var doc_number = documentos.length - 1; doc_number >= 0; doc_number--) {
                if (tipodocumentos[doc_number].split(' - ')[0] == 'Iframe') {
                    total--;
                }
            }
            var wHead = [false, false, false, false, false];
            var maxHead = 0;
            var lim = 2;

            //Lo siguiente es para poder decidir si el primero es error cuando no sea h1
            var totales = 0;
            var sigue = false;
            for (var doc_number = 0; doc_number < total; doc_number++) {
                var padre = padres[doc_number];
                where = [];
                var tmp = rumoHeadingsmap_bio_headings.headingsAtSameTime(contenedores[doc_number]);
                var encabezados = [];
                for (var i = 0; i < tmp[0].length; i++) {
                    encabezados[i] = tmp[0][i];
                }
                var treechildrens = padre.getElementsByTagName('treechildren');
                for (var i = treechildrens.length - 1; i >= 0; i--) {
                    treechildrens[i].parentNode.removeChild(treechildrens[i]);
                }
                if (encabezados.length > 0) {
                    if (encabezados.length == 1) {
                        padre.parentNode.parentNode.setAttribute('flex', '1');
                    }
                    padre.setAttribute('disabled', 'false');
                    document.getElementById("html5").setAttribute('disabled', 'false');
                    var cadena;
                    var anterior = 0;
                    var anteriorcorrecto = 0;
                    var actual = 0;
                    padre.setAttribute('class', 'h' + actual);
                    var acc_cont = 0;
                    for (var i = 0; i < encabezados.length; i++) {
                        actual = parseInt(encabezados[i].tagName.toLowerCase().replace('h', ''));

                        wHead[actual - 1] = actual <= 5;
                        if (actual > maxHead) {
                            maxHead = actual;
                        }

                        if (actual > anterior) {
                            var treechildren = document.createElement('treechildren');
                            padre.appendChild(treechildren);
                            padre = treechildren;
                            padre.setAttribute('class', 'h' + actual);
                            if (actual > anterior + 1) {
                                padre.setAttribute('class', 'h' + (anterior + 1));
                            }
                        }
                        if (actual == anterior) {
                            padre = padre.parentNode;
                        }
                        if (actual < anterior) {
                            if (document.contentType == "application/xhtml+xml") {
                                var padresHead = rumoHeadingsmap_bio_headings.getElementsByClassName(document, '*', 'h' + actual);
                            } else {
                                var padresHead = rumoHeadingsmap_bio_xpath.resuelvexpath(document, '//*[@class="h' + actual + '"]');
                            }
                            var cont = 0;
                            while (!padresHead.length) {
                                if (document.contentType == "application/xhtml+xml") {
                                    padresHead = rumoHeadingsmap_bio_headings.getElementsByClassName(document, '*', 'h' + actual);
                                } else {
                                    padresHead = rumoHeadingsmap_bio_xpath.resuelvexpath(document, '//*[@class="h' + (actual - cont) + '"]');
                                }
                                cont++;
                                if (cont == 6) {
                                    break;
                                }
                            }
                            if (padresHead.length) {
                                padre = padresHead[padresHead.length - 1];
                            } else {
                                padre = document.getElementById('mapa').getElementsByTagName('treechildren')[0];
                                anterior = 0;
                                anteriorcorrecto = 0;
                            }
                        }
                        cadena = '';
                        var lv = actual;
                        if (rumoHeadingsmap_headingsMapconfig.showNumber) {
                            cadena = actual + ' - ';
                        }
                        cadena += rumoHeadingsmap_bio_headings.getText(encabezados[i]).replace(/\n/g, '').replace(/\t/g, '');

                        var ancla = '';
                        if (encabezados[i].getAttribute('id')) {
                            ancla = encabezados[i].getAttribute('id');
                        } else {
                            if (encabezados[i].getAttribute('name')) {
                                ancla = encabezados[i].getAttribute('name');
                            } else {
                                if (encabezados[i].getElementsByTagName('a').length > 0) {
                                    if (encabezados[i].getElementsByTagName('a')[0].getAttribute('id')) {
                                        ancla = encabezados[i].getElementsByTagName('a')[0].getAttribute('id');
                                    } else if (encabezados[i].getElementsByTagName('a')[0].getAttribute('name'))
                                        ancla = encabezados[i].getElementsByTagName('a')[0].getAttribute('name');
                                }
                            }
                        }
                        var treeitem = document.createElement('treeitem');
                        treeitem.setAttribute('container', 'true');
                        treeitem.setAttribute('open', 'true');
                        treeitem.setAttribute('value', actual);
                        if (actual <= lim) {
                            treeitem.setAttribute('class', 'acc' + acc_cont);
                            acc_cont++;
                        }
                        padre.appendChild(treeitem);
                        var treerow = document.createElement('treerow');
                        if (where[i].split('_').length - 1) {
                            var profundidad = where[i].split('_').length - 1;
                        } else {
                            var profundidad = 0;
                        }
                        var properties = '';
                        if (rumoHeadingsmap_bio_headings.modo && profundidad > 0) {
                            if (treerow.getAttribute('properties')) {
                                properties = treerow.getAttribute('properties') + ' sublevel' + profundidad;
                            } else {
                                properties = 'sublevel' + profundidad;
                            }
                            treerow.setAttribute('properties', properties);
                        }
                        properties = '';
                        if (actual > (anterior + 1)) {
                            if (treerow.getAttribute('properties')) {
                                properties = treerow.getAttribute('properties') + ' error';
                            } else {
                                properties = 'error';
                            }
                            if (rumoHeadingsmap_headingsMapconfig.showErrors) {
                                if (totales > 0 || (totales == 0 && rumoHeadingsmap_headingsMapconfig.firstHead)) {
                                    treerow.setAttribute('properties', properties);
                                    sigue = true;
                                }
                            }
                            anterior = actual;
                        } else {
                            anterior = actual;
                            if (actual > (anteriorcorrecto + 1)) {
                                if (treerow.getAttribute('properties')) {
                                    properties = treerow.getAttribute('properties') + ' sub_error';
                                } else {
                                    properties = 'sub_error';
                                }
                                if (rumoHeadingsmap_headingsMapconfig.showErrors && sigue) {
                                    treerow.setAttribute('properties', properties);
                                }
                            } else {
                                anteriorcorrecto = anterior;
                            }
                        }
                        treeitem.appendChild(treerow);
                        var treecell = document.createElement('treecell');
                        properties = '';
                        if (rumoHeadingsmap_bio_headings.modo && profundidad > 0) {
                            var properties = '';
                            if (treecell.getAttribute('properties')) {
                                properties = treecell.getAttribute('properties') + ' sublevel' + profundidad;
                            } else {
                                properties = 'sublevel' + profundidad;
                            }
                            treecell.setAttribute('properties', properties);
                        }
                        treecell.setAttribute('label', cadena);
                        treecell.setAttribute('value', ancla);
                        treecell.setAttribute('tooltiptext', ancla);
                        treerow.setAttribute('class', 'biohead' + lv);
                        treerow.appendChild(treecell);
                        treerow.setAttribute('value', i);
                        padre = treeitem;
                        totales++;
                    }
                } else {
                    padre.parentNode.parentNode.setAttribute('flex', '1');
                    var treechildren = document.createElement('treechildren');
                    padre.appendChild(treechildren);
                    var treeitem = document.createElement('treeitem');
                    treechildren.appendChild(treeitem);
                    var treerow = document.createElement('treerow');
                    treerow.setAttribute('properties', 'error');
                    treeitem.appendChild(treerow);
                    var treecell = document.createElement('treecell');
                    treecell.setAttribute('label', 'No headings');
                    treerow.appendChild(treecell)
                    padre.setAttribute('disabled', 'true');
                    document.getElementById("html5").setAttribute('disabled', 'true');
                    try {
                        document.getElementById("html5").removeChild(document.getElementById("html5").getElementsByTagName("treechildren")[0]);
                    } catch (e) {
                    }
                    var tmp = treechildren.cloneNode(true)
                    document.getElementById("html5").appendChild(tmp)
                    document.getElementById('copyText').setAttribute('disabled', 'true');
                    document.getElementById('copyLink2Head').setAttribute('disabled', 'true');
                }
            }
            wHead[maxHead - 1] = false;
            var alMenos = false;
            for (var i = 0; i < wHead.length; i++) {
                if (i + 1 < 6) {
                    if (wHead[i]) {
                        if (document.getElementById('level' + (i + 1) + 'p')) {
                            document.getElementById('level' + (i + 1) + 'p').style.display = '';
                        }
                        alMenos = true;
                    } else {
                        if (document.getElementById('level' + (i + 1) + 'p')) {
                            document.getElementById('level' + (i + 1) + 'p').style.display = 'none';
                        }
                    }
                }
            }
            if (alMenos == false) {
                document.getElementById('headingsmap-bio_pleg').setAttribute('disabled', true);
            } else {
                document.getElementById('headingsmap-bio_pleg').setAttribute('disabled', false);
            }
            document.getElementById('copyText').setAttribute('disabled', 'true');
            document.getElementById('copyLink2Head').setAttribute('disabled', 'true');
        } catch (e) {
        }
    },
    optHdPl: function () {
        for (var a = 1; a <= 5; a++) {
            var grupos = rumoHeadingsmap_bio_headings.getElementsByClassName(document, '*', 'biohead' + a);
            var contador = 0;
            for (var i = 0, gruposLength = grupos.length; i < gruposLength; i++) {
                if (grupos[i].parentNode.getAttribute('open') == 'true' && grupos[i].parentNode.childNodes.length > 1) {
                    document.getElementById('level' + a + 'p').checked = false;
                    contador++;
                    break;
                }
            }
            if (contador == 0) {
                try {
                    document.getElementById('level' + a + 'p').checked = true;
                } catch (e) {
                }
            }
        }
    },
    headingsAtSameTime: function (act, headings, num, wh, doc) {
        if (!act) {
            var act = window.content;
        }
        if (!num) {
            var num = [];
        }
        if (!doc) {
            var doc = [];
        }
        if (act.document.contentType == "application/xhtml+xml") {
            var headingsIframes = rumoHeadingsmap_bio_xpath.getElementsByTagNames('h1-h2-h3-h4-h5-h6-iframe', act.document);
        } else {
            var headingsIframes = rumoHeadingsmap_bio_xpath.resuelvexpath(act.document, '//h1 | //h2 | //h3 | //h4 | //h5 | //h6 | //iframe');
        }
        if (!headings) {
            headings = [];
        }
        if (!wh) {
            wh = 'p';
        }
        var contador = 0;
        for (var i = 0; i < headingsIframes.length; i++) {
            if (headingsIframes[i].tagName.toLowerCase() != 'iframe') {
                headings.push(headingsIframes[i]);
                where.push(wh);
                doc.push(act);
                num.push(i);
            } else {
                var indicador = wh + '_f' + parseInt(contador + 1);
                var newheadings = rumoHeadingsmap_bio_headings.headingsAtSameTime(act.frames[contador], headings, num, indicador, doc);
                if (newheadings.length > 0) {
                    var encab = headings.concat(newheadings[0])
                    var nume = num.concat(newheadings[1])
                    var docu = doc.concat(newheadings[2])
                }
                contador++
            }
        }
        var definitivos = [headings, num, doc];
        return definitivos;
    },
    cleanPrevioHead: function () {
        try {
            var documentos = rumoHeadingsmap_bio_documents.documents();
            for (var doc_number = 0; doc_number < documentos.length; doc_number++) {
                var encabezados1 = rumoHeadingsmap_bio_headings.getElementsByClassName(documentos[doc_number], 'h1', 'bioHead');
                var encabezados2 = rumoHeadingsmap_bio_headings.getElementsByClassName(documentos[doc_number], 'h2', 'bioHead');
                var encabezados3 = rumoHeadingsmap_bio_headings.getElementsByClassName(documentos[doc_number], 'h3', 'bioHead');
                var encabezados4 = rumoHeadingsmap_bio_headings.getElementsByClassName(documentos[doc_number], 'h4', 'bioHead');
                var encabezados5 = rumoHeadingsmap_bio_headings.getElementsByClassName(documentos[doc_number], 'h5', 'bioHead');
                var encabezados6 = rumoHeadingsmap_bio_headings.getElementsByClassName(documentos[doc_number], 'h6', 'bioHead');
                var encabezados7 = rumoHeadingsmap_bio_headings.getElementsByClassName(documentos[doc_number], '*', 'bioselect');

                var encabezados = encabezados1.concat(encabezados2, encabezados3, encabezados4, encabezados5, encabezados6, encabezados7);
                for (var i = 0; i < encabezados.length; i++) {
                    rumoHeadingsmap_bio_headings.estila(encabezados[i], false)
                }
                if (documentos[doc_number].removeEventListener("click", rumoHeadingsmap_bio_headings.eliminaSeleccion, false)) {
                    return;
                }
            }
        } catch (e) {
        }
    },
    copyHead: function (ind, tipo) {
        var tree = ind;
        treeActual = tree;
        ind = ind.currentIndex;
        var lab = tree.view.getItemAtIndex(ind).firstChild.firstChild.getAttribute('label');
        if (tipo && (tree.view.getItemAtIndex(ind).firstChild.firstChild.getAttribute('value'))) {
            var dir = window.content.location.href;
            if (treeActual.parentNode.getAttribute('tooltiptext') && treeActual.parentNode.getAttribute('tooltiptext').indexOf(dir.substr(0, dir.lastIndexOf('/'))) == -1) {
                dir = dir.substr(0, dir.lastIndexOf('/')) + '/' + treeActual.parentNode.getAttribute('tooltiptext');
            }
            if (dir.indexOf('#') > 0) {
                dir = dir.substr(0, dir.indexOf('#'))
            }
            if (dir.lastIndexOf('/') == dir.length - 1) {
                dir = dir.substr(0, dir.lastIndexOf('/'))
            }
            lab = dir + '#' + tree.view.getItemAtIndex(ind).firstChild.firstChild.getAttribute('value');
        }
        if (rumoHeadingsmap_headingsMapconfig.showNumber && !tipo) {
            var labs = lab.split("- ");
            lab = labs[1];
        }
        rumoHeadingsmap_bio_headings.copyLinkToClipboard(lab);
    },
    copyHeadgins: function (id) {
        var newArbolActual = document.getElementById(id).childNodes[1].cloneNode(true);

        var treerows = newArbolActual.getElementsByTagName("treerow");
        for (var i = treerows.length - 1; i >= 0; i--) {
            treerows[i].parentNode.insertBefore(treerows[i].childNodes[0], treerows[i]);
            treerows[i].parentNode.removeChild(treerows[i])
        }

        var treecells = newArbolActual.getElementsByTagName("treecell");
        var label = "";
        var texto = document.createTextNode("")
        for (var i = treecells.length - 1; i >= 0; i--) {
            label = document.createTextNode(treecells[i].getAttribute("label"));
            treecells[i].parentNode.insertBefore(label, treecells[i])
            treecells[i].parentNode.removeChild(treecells[i])
        }

        var serializer = new XMLSerializer();

        var lista = serializer.serializeToString(newArbolActual).replace(/treechildren/g, "ul").replace(/treeitem/g, "li").replace(/container=\"true\"/g, "").replace(/open=\"true\"/g, "").replace(/open=\"false\"/g, "").replace(/class=\"h1\"/g, "").replace(/class=\"h2\"/g, "").replace(/class=\"h3\"/g, "").replace(/class=\"h4\"/g, "").replace(/class=\"h5\"/g, "").replace(/class=\"h6\"/g, "").replace(/xmlns=\"http:\/\/www.mozilla.org\/keymaster\/gatekeeper\/there.is.only.xul\"/g, "")
        lista = lista.replace(/class=\"acc.\"/g, "").replace(/class=\"acc..\"/g, "").replace(/class=\"acc...\"/g, "")
        lista = lista.replace(/value=\".\"/g, "").replace(/value=\"..\"/g, "").replace(/value=\"...\"/g, "")

        var textUnicode = lista;
        var textHtml = (lista);
        var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
        if (!str) {
            return false; // couldn't get string obj
        }
        str.data = textUnicode; // unicode string?

        var htmlstring = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
        if (!htmlstring) {
            return false; // couldn't get string obj
        }
        htmlstring.data = textHtml;

        var trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);

        trans.init(null);

        if (!trans) {
            return false; //no transferable widget found
        }


        trans.addDataFlavor("text/unicode");
        trans.setTransferData("text/unicode", str, textUnicode.length * 2); // *2 because it's unicode

        trans.addDataFlavor("text/html");
        trans.setTransferData("text/html", htmlstring, textHtml.length * 2); // *2 because it's unicode

        var clipboard = Components.classes["@mozilla.org/widget/clipboard;1"].getService(Components.interfaces.nsIClipboard);
        if (!clipboard) {
            return false; // couldn't get the clipboard
        }

        clipboard.setData(trans, null, Components.interfaces.nsIClipboard.kGlobalClipboard);

        return true;

    },
    selectHead: function (ind) {
        if (rumoHeadingsmap_bio_headings.activar) {
            var tree = ind,
                absolutePosition,
                slDest;

            treeActual = tree;
            ind = ind.currentIndex;

            slDest = ind + 1;

            if (ind >= 0) {
                var fila = tree.view.getItemAtIndex(ind).firstChild.getAttribute('value');
                ind = fila;
                rumoHeadingsmap_bio_headings.cleanPrevioHead();
                var headings = [];
                var documentos = rumoHeadingsmap_bio_documents.documents();
                var contenedores = rumoHeadingsmap_bio_documents.contents();
                if (documentos[rumoHeadingsmap_bio_headings.marco].getElementsByTagName('frameset').length) {
                    var ruta = tree.getAttribute('id').replace('mapa', '');
                    if (tree.getAttribute('id') == 'mapa') {
                        ruta = rumoHeadingsmap_bio_headings.marco;
                    }
                    if (documentos[ruta].getElementsByTagName('iframe').length) {
                        where = [];
                        var headings = rumoHeadingsmap_bio_headings.headingsAtSameTime(contenedores[ruta]);
                        rumoHeadingsmap_bio_headings.estila(headings[0][ind], true);
                        headings[2][ind].scrollTo(headings[0][ind].offsetLeft, headings[0][ind].offsetTop - 20);
                        headings[2][ind].parent.scrollTo(0, 0);
                        if (where[ind].split('_').length - 1) {
                            var profundidad = where[ind].split('_').length - 1;
                        } else {
                            var profundidad = 0;
                        }
                        if (profundidad > 0) {
                            contenedores[ruta].scrollTo(contenedores[ruta].document.getElementsByTagName('iframe')[where[ind].split('_')[1].replace('f', '') - 1].offsetLeft, contenedores[ruta].document.getElementsByTagName('iframe')[where[ind].split('_')[1].replace('f', '') - 1].offsetTop);
                            if (profundidad > 1) {
                                var contentPadre = contenedores[ruta].frames[where[ind].split('_')[1].replace('f', '') - 1];
                                for (var i = 1; i < profundidad; i++) {
                                    contentPadre.scrollTo(contentPadre.document.getElementsByTagName('iframe')[where[ind].split('_')[i].replace('f', '') - 1].offsetLeft, contentPadre.document.getElementsByTagName('iframe')[where[ind].split('_')[i].replace('f', '') - 1].offsetTop);
                                    contentPadre = contentPadre.frames[where[ind].split('_')[i].replace('f', '') - 1];
                                }
                            }
                        }
                    } else {
                        if (documentos[ruta].contentType == "application/xhtml+xml") {
                            var scripts = rumoHeadingsmap_bio_xpath.getElementsByTagNames('h1-h2-h3-h4-h5-h6', documentos[ruta]);
                        } else {
                            var headings = rumoHeadingsmap_bio_xpath.resuelvexpath(documentos[ruta], '//h1 | //h2 | //h3 | //h4 | //h5 | //h6');
                        }
                        rumoHeadingsmap_bio_headings.estila(headings[ind], true);
                        absolutePosition = rumoHeadingsmap_bio_headings.getAbsolutePosition(headings[ind]);
                        contenedores[ruta].scrollTo(absolutePosition.left, absolutePosition.top - 20);
                    }
                } else {
                    where = [];
                    var headings = rumoHeadingsmap_bio_headings.headingsAtSameTime(contenedores[rumoHeadingsmap_bio_headings.marco]);
                    rumoHeadingsmap_bio_headings.estila(headings[0][ind], true);
                    if (documentos[rumoHeadingsmap_bio_headings.marco].getElementsByTagName('iframe').length) {
                        headings[2][ind].scrollTo(headings[0][ind].offsetLeft, headings[0][ind].offsetTop - 20);
                        var profundidad = 0;
                        if (where[ind].split('_').length - 1) {
                            profundidad = where[ind].split('_').length - 1;
                        }
                        if (profundidad > 0) {
                            contenedores[rumoHeadingsmap_bio_headings.marco].scrollTo(contenedores[rumoHeadingsmap_bio_headings.marco].document.getElementsByTagName('iframe')[where[ind].split('_')[1].replace('f', '') - 1].offsetLeft, contenedores[rumoHeadingsmap_bio_headings.marco].document.getElementsByTagName('iframe')[where[ind].split('_')[1].replace('f', '') - 1].offsetTop);
                            if (profundidad > 1) {
                                var contentPadre = contenedores[rumoHeadingsmap_bio_headings.marco].frames[where[ind].split('_')[1].replace('f', '') - 1];
                                for (var i = 1; i < profundidad; i++) {
                                    contentPadre.scrollTo(contentPadre.document.getElementsByTagName('iframe')[where[ind].split('_')[i + 1].replace('f', '') - 1].offsetLeft, contentPadre.document.getElementsByTagName('iframe')[where[ind].split('_')[i + 1].replace('f', '') - 1].offsetTop);
                                    contentPadre = contentPadre.frames[where[ind].split('_')[i + 1].replace('f', '') - 1];
                                }
                            }
                        }
                    } else {
                        top.getBrowser().markupDocumentViewer.scrollToNode(headings[0][ind]);
                    }
                }
                for (var doc_number = 0; doc_number < documentos.length; doc_number++) {
                    documentos[doc_number].addEventListener("click", rumoHeadingsmap_bio_headings.eliminaSeleccion, false);
                }
                rumoHeadingsmap_bio_headings.previoHead = ind;
            }
        }
        var tree = ind;
    },
    cleanTreeSeleccion: function (el) {
        var trees, tree, inicio;

        if (rumoHeadingsmap_bio_headings.activar) {
            if (document.getElementById('comprobaciones')) {
                trees = document.getElementById('comprobaciones').getElementsByTagName('tree');
                inicio = trees.length > 1 ? 1 : 0;

                for (var i = inicio, treesLength = trees.length; i < treesLength; i++) {
                    tree = trees[i];

                    if ((!el || tree != el) && tree.view) {
                        tree.view.selection.select(-1);
                    }
                }
            }
        }
        rumoHeadingsmap_bio_headings.previoHead = -1;
    },
    eliminaSeleccion: function (e) {
        try {
            if (e) {
                if (e.button != 2) {
                    rumoHeadingsmap_bio_headings.cleanTreeSeleccion();
                    rumoHeadingsmap_bio_headings.cleanPrevioHead();
                }
            } else {
                rumoHeadingsmap_bio_headings.cleanTreeSeleccion();
                rumoHeadingsmap_bio_headings.cleanPrevioHead();
            }
        } catch (e) {
            rumoHeadingsmap_bio_headings.cleanTreeSeleccion();
            rumoHeadingsmap_bio_headings.cleanPrevioHead();
        }
    },
    estila: function (el, aplica) {
        if (!el) {
            return;
        }

        if (aplica && rumoHeadingsmap_headingsMapconfig.markHeads) {
            el.style.border = rumoHeadingsmap_headingsMapconfig.styleBorder;
            var bckc = 'rgba(' + rumoHeadingsmap_bio_headings.hexRGBColor(rumoHeadingsmap_headingsMapconfig.styleBackground) + ',' + rumoHeadingsmap_headingsMapconfig.styleBackgroundOpacity / 10 + ')';
            el.style.backgroundColor = bckc;
            el.style.color = '#000';
            if (el.getAttribute('class')) {
                el.setAttribute('class', el.getAttribute('class') + ' bioHead');
            } else {
                el.setAttribute('class', 'bioHead');
            }
        } else {
            el.style.border = '';
            el.style.backgroundColor = '';
            el.style.color = '';
            if (el.getAttribute('class')) {
                el.setAttribute('class', el.getAttribute('class').replace(' bioHead', '').replace('bioHead', ''));
            }
            if (el.getAttribute('class') != null && !el.getAttribute('class')) {
                el.removeAttribute('class');
            }
            if (el.getAttribute('style') != null && !el.getAttribute('style')) {
                el.removeAttribute('style');
            }
        }
        if (aplica) {
            if (el.getAttribute('class')) {
                el.setAttribute('class', el.getAttribute('class') + ' bioselect');
            } else {
                el.setAttribute('class', 'bioselect');
            }
        } else {
            if (el.getAttribute('class')) {
                el.setAttribute('class', el.getAttribute('class').replace(' bioselect', '').replace('bioselect', ''));
            }
            if (el.getAttribute('class') != null && !el.getAttribute('class')) {
                el.removeAttribute('class');
            }
        }
    },
    topDocument: function () {
        var documentos = rumoHeadingsmap_bio_documents.documents();
        if (documentos[rumoHeadingsmap_bio_headings.marco].contentType == "application/xhtml+xml") {
            top.getBrowser().markupDocumentViewer.scrollToNode(documentos[rumoHeadingsmap_bio_headings.marco].getElementsByTagName('body')[0]);
        } else {
            top.getBrowser().markupDocumentViewer.scrollToNode(rumoHeadingsmap_bio_xpath.resuelvexpath(documentos[rumoHeadingsmap_bio_headings.marco], '//body')[0]);
        }
    },
    pliega: function (lev, chd) {
        var grupos = rumoHeadingsmap_bio_headings.getElementsByClassName(document, '*', 'biohead' + lev);
        for (var i = 0; i < grupos.length; i++) {
            if (grupos[i].parentNode.childNodes.length > 1) {
                if (chd) {
                    grupos[i].parentNode.removeAttribute('open');
                } else {
                    grupos[i].parentNode.setAttribute('open', 'true');
                }
            }
        }
    },
    copyLinkToClipboard: function (copytext) {

        var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
        if (!str) {
            return false;
        }

        str.data = copytext;

        var trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);

        trans.init(null);

        if (!trans) {
            return false; //no transferable widget found
        }

        trans.addDataFlavor("text/unicode");
        trans.setTransferData("text/unicode", str, copytext.length * 2);

        var clipid = Components.interfaces.nsIClipboard;
        var clip = Components.classes["@mozilla.org/widget/clipboard;1"].getService(clipid);
        if (!clip) {
            return false;
        }

        clip.setData(trans, null, clipid.kGlobalClipboard);
    },
    posicion: function (e) {
        var elemento = document.getElementsByTagName('canvas')[0];

        var x = e.clientX - elemento.offsetLeft - 10;
        var y = e.clientY - elemento.offsetTop - 10;

        var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIWebNavigation).QueryInterface(Components.interfaces.nsIDocShellTreeItem).rootTreeItem.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIDOMWindow);
        var Wwidth = mainWindow.getBrowser().selectedBrowser.contentWindow.document.getElementsByTagName('body')[0].offsetWidth;
        var Wheight = mainWindow.getBrowser().selectedBrowser.contentWindow.document.getElementsByTagName('body')[0].offsetHeight;

        var coorX = (Wwidth * x) / elemento.width;
        var coorY = (Wheight * y) / elemento.height;
        window.content.scrollTo(coorX, coorY);
    },
    hexRGBColor: function (color) {
        if (color.indexOf('#') > -1) {
            color = color.replace('#', '');
        }

        if (!(color.length == 3) && !(color.length == 6)) {
            color = '-,-,-';
        } else {
            if (color.length == 3) {
                var r = color.substring(0, 1);
                var g = color.substring(1, 2);
                var b = color.substring(2, 3);
                color = r + r + g + g + b + b;
            }
            var rojo = rumoHeadingsmap_bio_headings.hexR(color);
            var verde = rumoHeadingsmap_bio_headings.hexG(color);
            var azul = rumoHeadingsmap_bio_headings.hexB(color);
            color = rojo + ',' + verde + ',' + azul;
        }
        return color;
    },
    hexR: function (color) {
        return parseInt(color.substring(0, 2), 16);
    },
    hexG: function (color) {
        return parseInt(color.substring(2, 4), 16);
    },
    hexB: function (color) {
        return parseInt(color.substring(4, 6), 16);
    }
};


var rumoHeadingsmap_bio_headingsOut = {

    encout: [],

    previo: null,

    ratonClickOutline: function (e, ind) {
        if (e.button == 2) {
            rumoHeadingsmap_bio_headings.activar = false;
            if (!ind.view.getItemAtIndex(ind.currentIndex).firstChild.firstChild.getAttribute('label')) {
                document.getElementById('copyText').setAttribute('disabled', 'true');
            } else {
                document.getElementById('copyText').setAttribute('disabled', 'false');
            }

            if (!ind.view.getItemAtIndex(ind.currentIndex).firstChild.firstChild.getAttribute('value')) {
                document.getElementById('copyLink2Head').setAttribute('disabled', 'true');
            } else {
                document.getElementById('copyLink2Head').setAttribute('disabled', 'false');
            }
            rumoHeadingsmap_bio_headings.text2Copy = ind;
        } else {
            var ident = ind.view.getItemAtIndex(ind.currentIndex).firstChild.firstChild.getAttribute('class');
            top.getBrowser().markupDocumentViewer.scrollToNode(rumoHeadingsmap_bio_headingsOut.encout[ident]);
        }
    },
    keyClickOut: function (e, ind) {
        if (e.keyCode == 13) {
            var ident = ind.view.getItemAtIndex(ind.currentIndex).firstChild.firstChild.getAttribute('class');
            top.getBrowser().markupDocumentViewer.scrollToNode(rumoHeadingsmap_bio_headingsOut.encout[ident]);
        } else {
            rumoHeadingsmap_bio_headings.activar = false;
        }
    },
    cleanPrevioHeadOut: function () {
    }
};