(function () {
    var body, bodyParent,
        headingMap, outlineMap,
        outlineMapTabLink, headingsTabLink,
        settings, showOutLevels, showOutElem, showOutError, showHeadLevels, showHeadError, showHeadErrorH1,
        iframeWidget, iframeContentDocument, iframeBody,
        defaultSettings = {
            showHeadLevels: true,
            showHeadError: true,
            showHeadErrorH1: true,
            showOutLevels: true,
            showOutElem: true,
            showOutError: true,
        },
        sectionsId = [],
        outlineTabLinkId = 'outlineTab',
        headingsTabLinkId = 'headingsTab',
        headingsMapId = 'headingsMap_headings',
        outlineMapId = 'headingsMap_outline',
        headingsMapIframeWrapperId = 'headingsMapIframeWrapper',
        headingsMapWrapperId = 'headingsMapWrapper',
        activeStatusClass = 'active',
        classPrefix = 'biohead',
        headErrorClass = 'head_error',
        noHeadClass = 'no-headed',
        untitledDocumentText = 'Untitled document',
        noHeadingsText = 'No headings',
        noHeadElementText = 'no head element',
        headerIdPrefix = 'hmap-',
        sectionIdPrefix = 'smap-',
        listClassPrefix = 'headingsMap-h',
        documentWindows = [],
        headingsMapPort = chrome.runtime.connect({name: 'port-from-cs'}),
        mutationObserverParams = {childList: true, subtree: true},
        defaultDebounceTime = 250;

    if (window.hasHeadingsMapRun) {
        return;
    }
    window.hasHeadingsMapRun = true;

    body = document.body;
    bodyParent = body.parentNode;

    let bodyMutationEndingObserver, onEndingDOMChangeCallback;

    onEndingDOMChangeCallback = function (mutations) {
        var headingsMapWidget = getWidget();

        if (iframeBody.innerHTML != '<div id="headingsMapWrapper">' + headingsMapWidget.innerHTML + '</div>') {
            updateWidget(headingsMapWidget);
        }
    };
    bodyMutationEndingObserver = addMutationObserver(body, mutationObserverParams, debounceFn(onEndingDOMChangeCallback, false));

    chrome.runtime.onMessage.addListener((message) => {
        settings = Object.assign({}, defaultSettings, message.settings);

        showHeadLevels = settings.showHeadLevels;
        showHeadError = settings.showHeadError;
        showHeadErrorH1 = settings.showHeadErrorH1;
        showOutLevels = settings.showOutLevels;
        showOutElem = settings.showOutElem;
        showOutError = settings.showOutError;

        let headingsMapWidget,
            previous = document.getElementById(headingsMapIframeWrapperId);


        if (previous) {
            if (message.action === 'toggle') {
                closeWidget();
            } else if (message.action === 'update') {
                headingsMapWidget = getWidget();
                updateWidget(headingsMapWidget);
            }
        } else if (message.action === 'toggle') {
            headingsMapWidget = getWidget();
            openWidget(headingsMapWidget);
        }
    });

    function HTML5Outline(documentWindow) {
        var outLine = null,
            outlineSection = generateSectionForMap(documentWindow),
            documentToCheck = documentWindow.document,
            bodyElement = documentToCheck.body,
            ownerDocument = bodyElement.ownerDocument || window.document,
            idCounter = 0,
            generateHTMLListFromSections = function (sections) {
                var itemList,
                    list = createElement('ul');

                for (var i = 0, sectionsLength = sections.length; i < sectionsLength; i++) {
                    itemList = createElement('li');
                    itemList.appendChild(sections[i].asHTML()[0]);

                    if (sections[i].asHTML()[1].childNodes.length) {
                        itemList.appendChild(sections[i].asHTML()[1]);
                    }
                    list.appendChild(itemList);
                }

                return list
            },
            getHeaderElementContent = function (element) {
                if (isHeaderElement(element)) {
                    return getText(element) || element.innerText || noHeadClass + 'no content inside ' + element.nodeName
                }
                return '' + element
            },
            eeeeeee = null,
            dddddd = null,
            ggggggg = [],
            wwwww = function (bodyNode, b, f) {
                var HTMLNode = bodyNode;

                a:for (; HTMLNode;) {
                    b(HTMLNode);
                    if (HTMLNode.firstChild) {
                        HTMLNode = HTMLNode.firstChild;
                        continue a
                    }

                    for (; HTMLNode;) {
                        f(HTMLNode);
                        if (HTMLNode.nextSibling) {
                            HTMLNode = HTMLNode.nextSibling;
                            continue a
                        }
                        HTMLNode = HTMLNode === bodyNode ? null : HTMLNode.parentNode
                    }
                }
            },
            xxxxxx = function (a) {
                if (isHeaderElement(getLastFromArray(ggggggg))) {
                    return;
                }
                if (isSectioningElement(a) || isSectioningRoot(a)) {
                    eeeeeee != null && ggggggg.push(eeeeeee);
                    eeeeeee = a;
                    dddddd = new outlineFactory(a);
                    eeeeeee.outline = {
                        sections: [dddddd],
                        startingNode: a,
                        asHTML: function () {
                            return generateHTMLListFromSections(this.sections)
                        }
                    }
                } else if (eeeeeee != null) {

                    if (!isHeaderElement(a)) {
                        return
                    }

                    if (dddddd.heading) {
                        if (getHeaderElementLevel(a) >= headingLevel(getLastSection(eeeeeee.outline))) {
                            var b = new outlineFactory(a);
                            eeeeeee.outline.sections.push(b);
                            dddddd = b;
                            dddddd.heading = a
                        } else {
                            b = false;
                            var f = dddddd;
                            do {
                                if (getHeaderElementLevel(a) < headingLevel(f)) {
                                    b = new outlineFactory(a);
                                    f.append(b);
                                    dddddd = b;
                                    dddddd.heading = a;
                                    b = true
                                }
                                f = f.container
                            } while (!b)
                        }
                    } else {
                        dddddd.heading = a;
                    }
                    ggggggg.push(a)
                }

                function headingLevel(a) {
                    a = a.heading;

                    return isHeaderElement(a) ? getHeaderElementLevel(a) : 1
                }
            },
            yyyyyyy = function (a) {
                var b = getLastFromArray(ggggggg);
                if (isHeaderElement(b)) {
                    b === a && ggggggg.pop();
                } else {
                    if ((isSectioningElement(a) || isSectioningRoot(a)) && !dddddd.heading) {
                        dddddd.heading = noHeadClass + noHeadElementText;
                    }
                    if (isSectioningElement(a) && ggggggg.length > 0) {
                        eeeeeee = ggggggg.pop();
                        dddddd = getLastSection(eeeeeee.outline);
                        for (b = 0; b < a.outline.sections.length; b++) {
                            dddddd.append(a.outline.sections[b])
                        }
                    } else if (isSectioningRoot(a) && ggggggg.length > 0) {
                        eeeeeee = ggggggg.pop();
                        for (dddddd = getLastSection(eeeeeee.outline); dddddd.sections.length > 0;) {
                            dddddd = getLastSection(dddddd)
                        }
                    } else if (isSectioningElement(a) || isSectioningRoot(a)) {
                        dddddd = eeeeeee.outline.sections[0]
                    }
                }
            },
            isHeadingRelatedElement = function (pattern) {
                return function (nodeElement) {
                    return nodeElement && nodeElement.tagName && (new RegExp(pattern, 'i')).test(nodeElement.tagName.toUpperCase())
                }
            },
            // sectioning root is an HTML element that can have its own outline, but the sections and headings inside it do not contribute to the outline of its ancestor.
            isSectioningRoot = isHeadingRelatedElement('^BLOCKQUOTE|BODY|DETAILS|FIELDSET|FIGURE|TD$'),
            isSectioningElement = isHeadingRelatedElement('^ARTICLE|ASIDE|NAV|SECTION$'),
            isHeaderElement = isHeadingRelatedElement('^H[1-6]$'),
            getHeaderElementLevel = function (a) {
                var tagName = a.tagName.toUpperCase();

                return -parseInt(tagName.substr(1));
            },
            getLastSection = function (a) {
                return getLastFromArray(a.sections)
            },
            getLastFromArray = function (a) {
                return a[a.length - 1]
            };

        var outlineFactory = function (node) {
            this.sections = [];
            this.startingNode = node
        };

        outlineFactory.prototype = {
            heading: false,
            append: function (a) {
                a.container = this;
                this.sections.push(a)
            },
            asHTML: function () {
                var self = this;

                return [getTreeRow(getHeaderElementContent(this.heading), self), generateHTMLListFromSections(self.sections)];

                function getTreeRow(headingContent, self) {
                    var treerow, elementId, text, span,
                        itemTextContent = headingContent;

                    if (headingContent.indexOf(noHeadClass) === -1) {
                        elementId = setElementId(self.startingNode);
                        treerow = createElement('a', {
                            tabindex: '0',
                            'data-header-id': elementId,
                            'title': itemTextContent
                        });
                        treerow.onclick = scrollToHeader;
                    } else {
                        itemTextContent = ' Untitled (' + itemTextContent.replace(noHeadClass, '') + ')';
                        treerow = createElement('span', {
                            'title': itemTextContent,
                            class: showOutError ? noHeadClass : undefined
                        });
                    }

                    span = createElement('span', {class: 'head'});

                    if (showOutElem) {
                        text = createTextNode('[' + self.startingNode.tagName.toLowerCase().replace('body', 'document') + '] - ');
                    } else {
                        text = createTextNode('');
                    }
                    span.appendChild(text);
                    text = createTextNode(itemTextContent);
                    treerow.appendChild(span);
                    treerow.appendChild(text);

                    return treerow;

                    function setElementId(element) {
                        var elementId = element.getAttribute('id');

                        if (elementId) {
                            return elementId;
                        }

                        do {
                            elementId = sectionIdPrefix + ++idCounter;
                        } while (ownerDocument.getElementById(elementId));

                        element.setAttribute('id', elementId);
                        sectionsId.push(elementId);

                        return elementId
                    }
                }
            }
        };

        wwwww(bodyElement, xxxxxx, yyyyyyy);

        if (eeeeeee != null) {
            outLine = eeeeeee.outline.asHTML();
            // outLine.setAttribute('id', outlineMapId);

            if (showOutLevels === true) {
                addLevelIndex(outLine, 0);
            }
        }

        outlineSection.appendChild(outLine);

        return outlineSection;

        function addLevelIndex(list, type) {
            var levelIndex, span, childNode,
                childNodesList = list.childNodes;

            for (var i = 0, childNodesListLength = childNodesList.length; i < childNodesListLength; i++) {
                childNode = childNodesList[i];

                levelIndex = createTextNode(i + 1 + (showOutElem ? ' ' : ' - '));

                span = createElement('span', {class: 'head_number'});
                span.appendChild(levelIndex);

                childNode.childNodes[0].insertBefore(span, childNode.childNodes[0].childNodes[0]);
                span.appendChild(childNode.childNodes[0].childNodes[1]);

                for (var a = 0; a < childNode.childNodes.length; a++) {
                    if (childNode.childNodes[a].tagName === 'UL') {
                        addLevelIndex(childNode.childNodes[a], type);
                    }
                }
            }
        }
    }

    function headingsMap(documentWindow) {
        var mainList, headersList, item, header, headerId, level, noHeadingsTextNode, noHeadingsSpanNode,
            parentList, linkElement, descendantListElement, headerTextNode, precedingHeadLevel, parentListClass,
            classValue,
            headLevelsSpanElement, headLevelsSpanTextNode,
            previous = 0,
            previousCorrect = 0,
            currentLevel = 0,
            headingsMapSection = generateSectionForMap(documentWindow),
            documentToCheck = documentWindow.document,
            headingElements = documentToCheck.querySelectorAll('h1, h2, h3, h4, h5, h6');

        mainList = createElement('ul', {class: listClassPrefix + currentLevel});
        headersList = mainList;

        headingsMapSection.appendChild(headersList);

        if (!headingElements.length) {
            item = createElement('li');
            mainList.appendChild(item);
            noHeadingsTextNode = createTextNode(noHeadingsText);
            noHeadingsSpanNode = createElement('span', {class: noHeadClass});
            noHeadingsSpanNode.appendChild(noHeadingsTextNode);
            item.appendChild(noHeadingsSpanNode);

            return headingsMapSection;
        }

        for (var i = 0, headingElementsLength = headingElements.length; i < headingElementsLength; i++) {
            header = headingElements[i];
            headerId = header.getAttribute('id');

            if (!headerId) {
                headerId = headerIdPrefix + i;
                header.setAttribute('id', headerId);
            }

            currentLevel = parseInt(header.tagName.toLowerCase().replace('h', ''));

            item = createElement('li');

            if (currentLevel > previous) {
                classValue = listClassPrefix + currentLevel;
                descendantListElement = createElement('ul', {class: classValue});
                descendantListElement.appendChild(item);

                if (mainList.tagName.toLowerCase() === 'ul') {
                    mainList.appendChild(item);
                } else {
                    mainList.appendChild(descendantListElement);
                }
            } else if (currentLevel === previous) {
                mainList = mainList.parentNode;
                mainList.appendChild(item);
                previousCorrect = currentLevel;
            } else if (currentLevel < previous) {
                parentList = mainList;

                while (parentList.parentNode.getAttribute('class') != 'hroot') {
                    parentList = parentList.parentNode;
                    parentListClass = parentList.getAttribute('class');

                    if (parentListClass.indexOf('h') >= 0) {
                        var cl = parseInt(parentListClass.replace(listClassPrefix, ''));
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

            linkElement = createElement('a', {tabindex: '0', 'data-header-id': headerId});
            linkElement.onclick = scrollToHeader;

            if (showHeadLevels === true) {
                headLevelsSpanElement = createElement('span', {class: 'head'});

                headLevelsSpanTextNode = createTextNode(currentLevel + ' - ');
                headLevelsSpanElement.appendChild(headLevelsSpanTextNode);
                linkElement.appendChild(headLevelsSpanElement);
            }

            headerTextNode = createTextNode(getText(header));
            linkElement.appendChild(headerTextNode);
            mainList.appendChild(linkElement);
            mainList.setAttribute('class', classPrefix + level);

            if (currentLevel > previous + 1) {
                if ((i === 0 && showHeadErrorH1 === true && showHeadError === true) || (i > 0 && showHeadError === true)) {
                    linkElement.setAttribute('class', headErrorClass);
                }
            }
            previous = currentLevel;
        }

        return headingsMapSection;
    }

    function scrollToHeader(event) {
        var headerElement = document.getElementById(event.target.getAttribute('data-header-id'));

        document.documentElement.scrollTop = getTopPosition(headerElement);

        function getTopPosition(element) {
            // distance of the current element relative to the top of the offsetParent node
            var topPosition = element.offsetTop;

            while (element.tagName != 'BODY') {
                // reference to the object which is the closest positioned containing element
                element = element.offsetParent;

                // returns null when element has style.display set to "none"
                if (element === null) {
                    break;
                }

                topPosition += element.offsetTop;
            }

            return topPosition;
        }
    }

    function getWidget() {
        var widgetContent, widgetLists, collapser;

        documentWindows = getDocuments();

        headingMap = createElement('div', {id: headingsMapId});
        outlineMap = createElement('div', {id: outlineMapId});

        for (var i = 0, documentsLength = documentWindows.length; i < documentsLength; i++) {
            headingMap.appendChild(headingsMap(documentWindows[i]));
            outlineMap.appendChild(HTML5Outline(documentWindows[i]));
        }

        widgetContent = getWidgetContent(headingMap, outlineMap);

        switchPanel(localStorage['headingsMap_selectedTab'] || headingsMapId);

        widgetLists = widgetContent.querySelectorAll('ul ul');

        for(var i = 0, widgetListsLenght = widgetLists.length; i < widgetListsLenght; i++){
            collapser = createElement('span', {class: 'collapser'});
            collapser.addEventListener('click', toggleList)
            widgetLists[i].parentNode.insertBefore(collapser, widgetLists[i]);
        }

        return widgetContent;

        function getWidgetContent(headingMap, outlineMap) {
            var mapsContainer = createElement('div', {id: headingsMapWrapperId}),
                refresh = createElement('a', {id: 'headingsMap_refresh'}),
                settings = createElement('a', {id: 'headingsMap_settings'}),
                closer = createElement('a', {id: 'headingsMap_closer'});

            refresh.onclick = refreshWidget;
            mapsContainer.appendChild(refresh);

            settings.onclick = openSettings;
            mapsContainer.appendChild(settings);

            closer.onclick = closeWidget;
            mapsContainer.appendChild(closer);

            headingsTabLink = generateTabLink('Headings Structure', headingsTabLinkId, headingsMapId);
            mapsContainer.appendChild(headingsTabLink);

            outlineMapTabLink = generateTabLink('HTML5 Outline', outlineTabLinkId, outlineMapId);
            mapsContainer.appendChild(outlineMapTabLink);

            mapsContainer.appendChild(headingMap);
            mapsContainer.appendChild(outlineMap);

            return mapsContainer;

            function refreshWidget() {
                sendMessageToBackgroundScript({action: 'update'});
            }

            function openSettings() {
                sendMessageToBackgroundScript({action: 'settings'});
            }

            function generateTabLink(tabTex, tabId, mapId) {
                var textNode = createTextNode(tabTex),
                    tabButton = createElement('a', {id: tabId});

                tabButton.onclick = function () {
                    switchPanel(mapId);
                };

                tabButton.appendChild(textNode);

                return tabButton;
            }
        }

        function toggleList (event){
            var collapser = event.target,
                listToToggle = collapser.nextSibling;

            if(listToToggle.style.display === 'none'){
                listToToggle.style.display = 'block';
                collapser.className = 'collapser';
            }else{
                listToToggle.style.display = 'none';
                collapser.className = 'collapser collapsed';
            }
        }
    }

    function createElement(tagName, attributes) {
        var newElement = document.createElement(tagName);

        if (attributes) {
            for (var propertyName in attributes) {
                newElement.setAttribute(propertyName, attributes[propertyName]);
            }
        }

        return newElement
    }

    function createTextNode(text) {
        return document.createTextNode(text);
    }

    function switchPanel(panelToShow) {
        if (panelToShow === headingsMapId) {
            headingsTabLink.setAttribute('class', activeStatusClass);
            outlineMapTabLink.setAttribute('class', '');

            headingMap.style.display = 'block';
            outlineMap.style.display = 'none';
        } else {
            headingsTabLink.setAttribute('class', '');
            outlineMapTabLink.setAttribute('class', activeStatusClass);

            headingMap.style.display = 'none';
            outlineMap.style.display = 'block';
        }

        localStorage['headingsMap_selectedTab'] = panelToShow;
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

        function isElementWithAltText(element) {
            var tagName = element.tagName.toLowerCase();

            return (tagName === 'img' && element.getAttribute('src').indexOf('moz-extension://') != 0) || tagName === 'area' || (tagName === 'input' && element.getAttribute('type').toLowerCase() === 'image');
        }

        function isTextNode(node) {
            return node.nodeType === 3;
        }

        function isCommentNode(node) {
            return node.nodeType === 8;
        }
    }

    function openWidget(widgetContent) {
        iframeWidget = createIframeWidget();
        updateWidget(widgetContent)
    }

    function closeWidget() {
        var widget = document.getElementById(headingsMapIframeWrapperId),
            widgetParent = widget.parentNode;

        widgetParent.removeChild(widget);
        widgetParent.removeAttribute('data-headings-map-active');
        cleanHeaderIds();
        bodyMutationEndingObserver()
    }

    function createIframeWidget(iframeContent) {
        var baseURL = chrome.extension.getURL('html/'),
            iframeCSS = getFileContent(baseURL + 'style.css'),
            iframeHead = '<base href="' + baseURL + '" /><style>' + iframeCSS + '</style>',
            iframeWidget = createElement('iframe', {'id': headingsMapIframeWrapperId}),
            iframeWidgetContentWindow;

        bodyParent.insertBefore(iframeWidget, body);
        bodyParent.setAttribute('data-headings-map-active', 'true');

        iframeWidgetContentWindow = iframeWidget.contentWindow;
        iframeWidgetContentWindow.stop();

        iframeContentDocument = iframeWidgetContentWindow.document;
        iframeBody = iframeContentDocument.body;
        iframeContentDocument.head.innerHTML = iframeHead;

        return iframeWidget;

        function getFileContent(fileURL) {
            var xmlhttp = new XMLHttpRequest();

            xmlhttp.open('GET', fileURL, false);
            xmlhttp.send();

            return xmlhttp.responseText;
        }
    }

    function updateWidget(widgetContent) {
        while (iframeBody.firstChild) {
            iframeBody.removeChild(iframeBody.firstChild);
        }

        iframeBody.appendChild(widgetContent);
    }

    function cleanHeaderIds() {
        var headerId, headerIdParts, section,
            headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

        for (var i = 0, headingElementsLength = headingElements.length; i < headingElementsLength; i++) {
            headerId = headingElements[i].getAttribute('id');
            headerIdParts = headerId.split(headerIdPrefix);

            if (headerIdParts.length > 1 && headerIdParts[0] === '' && Number.isInteger(parseInt(headerIdParts[1]))) {
                headingElements[i].removeAttribute('id');
            }
        }

        for (var i = 0, sectionsIdLength = sectionsId.length; i < sectionsIdLength; i++) {
            section = document.getElementById(sectionsId[i]);
            section.removeAttribute('id');
        }
    }

    function getDocuments(act, previous) {
        var frames, currentFrame, currentDocument,
            documentWindows = [];

        if (previous) {
            documentWindows = previous;
        }

        if (!act) {
            act = window.top;
            documentWindows.push(window.top);
        }

        frames = act.document.getElementsByTagName('frame');
        for (var i = 0, framesLength = frames.length; i < framesLength; i++) {
            currentFrame = act.frames[i];
            currentDocument = currentFrame.document;

            if (!currentDocument.getElementsByTagName('frame').length) {
                documentWindows.push(currentFrame);
            }
            if (currentDocument.getElementsByTagName('frame').length || currentDocument.getElementsByTagName('iframe').length) {
                getDocuments(currentFrame, documentWindows);
            }
        }

        frames = act.document.getElementsByTagName('iframe');
        for (var i = 0, framesLength = frames.length; i < framesLength; i++) {

            if (frames[i].getAttribute('id') != headingsMapIframeWrapperId) {
                currentFrame = act.frames[i];
                currentDocument = currentFrame.document;

                documentWindows.push(currentFrame);

                if (currentDocument.getElementsByTagName('frame').length || currentDocument.getElementsByTagName('iframe').length) {
                    getDocuments(currentFrame, documentWindows);

                }
            }
        }

        return documentWindows;
    }

    // To debounce the execution.
    // executeAtTheBeginning controls when it will be executed
    function debounceFn(func, executeAtTheBeginning, wait) {
        var timeout;

        return function () {
            var callNow,
                context = this,
                args = arguments,
                later = function () {
                    timeout = null;
                    if (!executeAtTheBeginning) {
                        func.apply(context, args);
                    }
                };

            callNow = executeAtTheBeginning && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait || defaultDebounceTime);
            if (callNow) {
                func.apply(context, args);
            }
        };
    }

    function addMutationObserver(elementToObserve, config, callback) {
        // Create an observer instance
        var observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(elementToObserve, config);

        return observer.disconnect;
    }

    function sendMessageToBackgroundScript(messageObject) {
        headingsMapPort.postMessage(messageObject);
    }

    function generateSectionForMap(documentWindow) {
        var sectionSubHeaderContent,
            documentToCheck = documentWindow.document,
            section = createElement('section'),
            titleElement = documentToCheck.querySelectorAll('title')[0],
            titleText = titleElement ? getText(titleElement) : untitledDocumentText,
            titleTextNode = createTextNode(titleText),
            sectionHeader = createElement('h2'),
            sectionSubHeader = createElement('p'),
            locationHref = documentWindow.location.href,
            sectionSubHeaderTextNode = createTextNode(locationHref);

        sectionHeader.appendChild(titleTextNode);
        section.appendChild(sectionHeader);

        if (locationHref != 'about:blank') {
            sectionSubHeaderContent = createElement('a', {href: locationHref, target: 'blank'});
            sectionSubHeaderContent.appendChild(sectionSubHeaderTextNode);
        } else {
            sectionSubHeaderContent = sectionSubHeaderTextNode;
        }

        sectionSubHeader.appendChild(sectionSubHeaderContent);
        section.appendChild(sectionSubHeader);

        return section;
    }
})();