// This is a very old code that I will refactor...

(function () {
    var headingMap, outlineMap,
        headingsMap_outLevels = true,
        headingsMap_outElem = true,
        headingsMap_outError = true,
        headingsMap_headLevels = true,
        headingsMap_headError = true,
        headingsMap_headErrorH1 = true,
        outlineTabLinkId = 'outlineTab',
        headingsTabLinkId = 'headingsTab',
        headingsMapId = 'headingsMap_headings',
        outlineMapId = 'headingsMap_outline',
        headingsMapWrapperId = 'headingsMapWrapper',
        activeStatusClass = 'active',
        classPrefix = 'biohead',
        headErrorClass = 'head_error',
        noHeadClass = 'BIONOHEAD',
        noHeadingsText = 'No headings';

    var i = function (a) {
        this.sections = [];
        this.startingNode = a
    };

    i.prototype = {
        heading: false,
        append: function (a) {
            a.container = this;
            this.sections.push(a)
        },
        asHTML: function (a) {
            var self = this;

            return [getTreeRow(a, u(this.heading), self), q(self.sections, a)];

            function getTreeRow(a, b, self) {
                var treerow, dest, text, span,
                    cad = b;

                if (a) {
                    if (cad.indexOf(noHeadClass) >= 0) {
                        treerow = document.createElement("span");

                        if (headingsMap_outError) {
                            treerow.setAttribute("class", noHeadClass);
                        }
                        cad = " Untitled (" + cad.replace(noHeadClass, "") + ")";
                    } else {
                        treerow = document.createElement("a");
                        dest = v(self.startingNode);

                        treerow.setAttribute("href", '#' + dest);
                    }

                    span = document.createElement('span');
                    span.setAttribute('class', 'head');

                    if (headingsMap_outElem === true) {
                        text = document.createTextNode("[" + self.startingNode.tagName.toLowerCase().replace("body", "document") + "] - ");
                    } else {
                        text = document.createTextNode('');
                    }
                    span.appendChild(text);
                    text = document.createTextNode(cad);
                    treerow.setAttribute("title", cad);
                    treerow.appendChild(span);
                    treerow.appendChild(text);
                }

                return treerow
            }
        }
    };

    var q = function (a, b) {
            var treeitem,
                treechildren = document.createElement("ul");

            for (var c = 0, aLength = a.length; c < aLength; c++) {
                treeitem = document.createElement("li");
                treeitem.appendChild(a[c].asHTML(b)[0]);

                if (a[c].asHTML(b)[1].childNodes.length) {
                    treeitem.appendChild(a[c].asHTML(b)[1]);
                }
                treechildren.appendChild(treeitem);
            }

            return treechildren
        },
        r = function (a) {
            a = a.heading;
            return h(a) ? j(a) : 1
        },
        u = function (a) {
            if (h(a)) {
                return getText(a) || a.innerText || "BIONOHEADno content inside " + a.nodeName
            }
            return "" + a
        },
        v = function (a) {
            var b = a.getAttribute("id");
            if (b) {
                return b;
            }

            do {
                b = "h5o-" + ++s;
            } while (t.getElementById(b));

            a.setAttribute("id", b);
            return b
        },
        e, d, g, s, t,
        w = function (a, b, f) {
            var c = a;
            a:for (; c;) {
                b(c);
                if (c.firstChild) {
                    c = c.firstChild;
                    continue a
                }

                for (; c;) {
                    f(c);
                    if (c.nextSibling) {
                        c = c.nextSibling;
                        continue a
                    }
                    c = c === a ? null : c.parentNode
                }
            }
        },
        x = function (a) {
            if (!h(o(g)))
                if (l(a) || m(a)) {
                    e != null && g.push(e);
                    e = a;
                    d = new i(a);
                    e.outline = {
                        sections: [d],
                        startingNode: a,
                        asHTML: function (c) {
                            return q(this.sections, c)
                        }
                    }
                } else if (e != null)
                    if (h(a)) {
                        if (d.heading)
                            if (j(a) >= r(n(e.outline))) {
                                var b = new i(a);
                                e.outline.sections.push(b);
                                d = b;
                                d.heading = a
                            } else {
                                b = false;
                                var f = d;
                                do {
                                    if (j(a) < r(f)) {
                                        b = new i(a);
                                        f.append(b);
                                        d = b;
                                        d.heading = a;
                                        b = true
                                    }
                                    f = f.container
                                } while (!b)
                            }
                        else
                            d.heading = a;
                        g.push(a)
                    }
        },
        y = function (a) {
            var b = o(g);
            if (h(b)) {
                b === a && g.pop();
            } else {
                if ((l(a) || m(a)) && !d.heading) {
                    d.heading = "BIONOHEADno head element";
                }
                if (l(a) && g.length > 0) {
                    e = g.pop();
                    d = n(e.outline);
                    for (b = 0; b < a.outline.sections.length; b++) {
                        d.append(a.outline.sections[b])
                    }
                } else if (m(a) && g.length > 0) {
                    e = g.pop();
                    for (d = n(e.outline); d.sections.length > 0;) {
                        d = n(d)
                    }
                } else if (l(a) || m(a)) {
                    d = e.outline.sections[0]
                }
            }
        },
        p = function (a) {
            return function (b) {
                return b && b.tagName && (new RegExp(a, "i")).test(b.tagName.toUpperCase())
            }
        },
        m = p("^BLOCKQUOTE|BODY|DETAILS|FIELDSET|FIGURE|TD$"),
        l = p("^ARTICLE|ASIDE|NAV|SECTION$"),
        h = p("^H[1-6]$"),
        j = function (a) {
            var b = a.tagName.toUpperCase();
            return -parseInt(b.substr(1))
        },
        n = function (a) {
            return o(a.sections)
        },
        o = function (a) {
            return a[a.length - 1]
        };

    HTML5Outline = function (a) {
        s = 0;
        t = a.ownerDocument || window.document;
        d = e = null;
        g = [];
        w(a, x, y);
        return e != null ? e.outline : null
    };

    addHeadingsMap();

    function getHeadingsMap() {
        var mainList, list, item, header, level, noHeadingsTextNode, noHeadingsSpanNode,
            parentList, linkElement, descendantListElement, headerTextNode, precedingHeadLevel, parentListClass,
            classValue,
            headLevelsSpanElement, headLevelsSpanTextNode,
            previous = 0,
            previousCorrect = 0,
            currentLevel = 0,
            headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

        mainList = document.createElement('ul');
        list = mainList;
        mainList.setAttribute('class', 'h' + currentLevel);

        if (!headingElements.length) {
            item = document.createElement('li');
            mainList.appendChild(item);
            noHeadingsTextNode = document.createTextNode(noHeadingsText);
            noHeadingsSpanNode = document.createElement('span');
            noHeadingsSpanNode.setAttribute('class', noHeadClass);
            noHeadingsSpanNode.appendChild(noHeadingsTextNode);
            item.appendChild(noHeadingsSpanNode);

            return;
        }

        for (var i = 0, headingElementsLength = headingElements.length; i < headingElementsLength; i++) {
            header = headingElements[i];

            header.setAttribute('id', 'hmap-' + (header.getAttribute('id') || i));

            currentLevel = parseInt(header.tagName.toLowerCase().replace('h', ''));

            item = document.createElement('li');
            if (currentLevel > previous) {
                descendantListElement = document.createElement('ul');
                classValue = 'h' + currentLevel;
                descendantListElement.setAttribute('class', classValue);
                descendantListElement.appendChild(item);

                if (mainList.tagName.toLowerCase() === 'ul') {
                    mainList.appendChild(item);
                } else {
                    mainList.appendChild(descendantListElement);
                }
            }
            if (currentLevel === previous) {
                mainList = mainList.parentNode;
                mainList.appendChild(item);
                previousCorrect = currentLevel;
            } else if (currentLevel < previous) {
                parentList = mainList;
                while (parentList.parentNode.getAttribute('class') != 'hroot') {
                    parentList = parentList.parentNode;
                    parentListClass = parentList.getAttribute('class');

                    if (parentListClass.indexOf('h') >= 0) {
                        var cl = parseInt(parentListClass.replace('h', ''));
                        if (currentLevel >= cl) {
                            mainList = parentList;
                            break;
                        }
                    } else {
                        precedingHeadLevel = parseInt(parentListClass.replace(classPrefix, ''));

                        if (currentLevel > precedingHeadLevel) {
                            mainList = parentList.getElementsByTagName('ul')[0];
                            break;
                        } else if (currentLevel === precedingHeadLevel) {
                            mainList = parentList.parentNode;
                            break;
                        }
                    }
                }
                mainList.appendChild(item);
            }

            mainList = item;
            level = currentLevel;

            linkElement = document.createElement('a');
            linkElement.setAttribute('href', '#' + generateAnchorForElement(header));

            if (headingsMap_headLevels === true) {
                headLevelsSpanElement = document.createElement('span');
                headLevelsSpanElement.setAttribute('class', 'head');

                headLevelsSpanTextNode = document.createTextNode(currentLevel + ' - ');
                headLevelsSpanElement.appendChild(headLevelsSpanTextNode);
                linkElement.appendChild(headLevelsSpanElement);
            }

            headerTextNode = document.createTextNode(getText(header));
            linkElement.appendChild(headerTextNode);
            mainList.appendChild(linkElement);
            mainList.setAttribute('class', classPrefix + level);

            if (currentLevel > previous + 1) {
                if ((i === 0 && headingsMap_headErrorH1 === true && headingsMap_headError === true) || (i > 0 && headingsMap_headError === true)) {
                    linkElement.setAttribute('class', headErrorClass);
                }
            }
            previous = currentLevel;
        }

        return list;

        function generateAnchorForElement(element) {
            var links,
                anchor = element.getAttribute('id') || element.getAttribute('name');

            if (!anchor) {
                links = element.getElementsByTagName('a');

                if (links.length) {
                    anchor = links[0].getAttribute('id') || links[0].getAttribute('name') || '';
                }
            }

            return anchor;
        }
    }

    function addHeadingsMap() {
        var mapsContainer;

        headingMap = getHeadingsMap();
        headingMap.setAttribute('id', headingsMapId);

        outlineMap = HTML5Outline(document.body).asHTML(true);
        outlineMap.setAttribute('id', outlineMapId);

        mapsContainer = getMapsContainer();

        document.body.appendChild(mapsContainer);

        show(localStorage['headingsMap_selectedTab'] || outlineMapId);

        function getMapsContainer() {
            var outlineTab, outText, headingsTab, headText,
                mapsContainer = document.createElement('div'),
                closer = document.createElement('a');

            mapsContainer.setAttribute('id', headingsMapWrapperId);
            closer.setAttribute('id', 'headingsMap_closer');
            closer.onclick = function () {
                close();
            };
            mapsContainer.appendChild(closer);

            outlineTab = document.createElement('a');
            outlineTab.setAttribute('id', outlineTabLinkId);
            outlineTab.onclick = function () {
                show(outlineMapId)
            };
            outText = document.createTextNode('HTML5 Outline');
            outlineTab.appendChild(outText);

            headingsTab = document.createElement('a');
            headingsTab.setAttribute('id', headingsTabLinkId);
            headingsTab.onclick = function () {
                show(headingsMapId)
            };

            headText = document.createTextNode('Headings Structure');
            headingsTab.appendChild(headText);

            mapsContainer.appendChild(outlineTab);
            mapsContainer.appendChild(headingsTab);
            mapsContainer.appendChild(outlineMap);
            mapsContainer.appendChild(headingMap);

            if (headingsMap_outLevels === true) {
                addLevelIndex(mapsContainer.childNodes[3], 0);
            }

            mapsContainer.style.top = '5px';

            return mapsContainer;
        }
    }

    function addLevelIndex(ul, tipo) {
        var levelIndex, span, childNode,
            childNodesList = ul.childNodes;

        for (var i = 0, childNodesListLength = childNodesList.length; i < childNodesListLength; i++) {
            childNode = childNodesList[i];

            levelIndex = document.createTextNode(i + 1 + (headingsMap_outElem ? ' ' : ' - '));

            span = document.createElement('span');
            span.setAttribute('class', 'head_number');
            span.appendChild(levelIndex);

            childNode.childNodes[0].insertBefore(span, childNode.childNodes[0].childNodes[0]);
            span.appendChild(childNode.childNodes[0].childNodes[1]);

            for (var a = 0; a < childNode.childNodes.length; a++) {
                if (childNode.childNodes[a].tagName === 'UL') {
                    addLevelIndex(childNode.childNodes[a], tipo);
                }
            }
        }
    }

    function show(panelToShow) {
        var headingsTabLink = document.getElementById(headingsTabLinkId),
            headingsMap = document.getElementById(headingsMapId),
            outlineMapTabLink = document.getElementById(outlineTabLinkId),
            outlineMap = document.getElementById(outlineMapId);

        if (panelToShow === headingsMapId) {
            headingsTabLink.setAttribute('class', activeStatusClass);
            outlineMapTabLink.setAttribute('class', '');

            headingsMap.style.display = 'block';
            outlineMap.style.display = 'none';
        } else {
            headingsTabLink.setAttribute('class', '');
            outlineMapTabLink.setAttribute('class', activeStatusClass);

            headingsMap.style.display = 'none';
            outlineMap.style.display = 'block';
        }

        localStorage['headingsMap_selectedTab'] = panelToShow;
    }

    function close() {
        var headingsMapWrapper = document.getElementById(headingsMapWrapperId);

        if (headingsMapWrapper) {
            document.body.removeChild(headingsMapWrapper);
        }
    }

    function getText(element) {
        // TODO: add aria attribute values when needed
        var childNodes,
            text = '';

        if (isTextNode(element)) {
            return element.nodeValue.replace("\"", "'").replace("\"", "'").replace("<", "&lt;").replace(">", "&gt;");
        }

        if (isElementWithAltText(element)) {
            return element.getAttribute('alt') || '';
        }

        childNodes = element.childNodes;

        for (var i = 0, childNodesLength = childNodes.length; i < childNodesLength; i++) {
            if (!isCommentNode(element.childNodes[i])) {
                text += getText(childNodes[i]);
            }
        }

        return text.replace(/\n/g, ' ').replace(/\t/g, ' ').replace(/\s+/gi, ' ');
    }

    function isElementWithAltText(node) {
        var tagName = node.tagName.toLowerCase();

        return tagName === 'img' || tagName === 'area' || (tagName === 'input' && element.getAttribute('type').toLowerCase() === 'image');
    }

    function isTextNode(node) {
        return node.nodeType === 3;
    }

    function isCommentNode(node) {
        return node.nodeType === 8;
    }
})();

