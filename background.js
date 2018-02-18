var tabId;

// open/close when clicking the toolbar button
chrome.browserAction.onClicked.addListener(injectHeadingsMapScript);

// listen for messages
chrome.runtime.onConnect.addListener(connected);

function injectHeadingsMapScript(tab) {
    browser.sidebarAction.open();

    tabId = tab.id;

    chrome.tabs
        .executeScript(tabId, {file: 'content_scripts/headingsMap.js'}, showHeadingsMap);

    chrome.tabs
        .insertCSS({file: 'content_scripts/headingsMap.css'});
}

function connected(portFromCS) {
    portFromCS.onMessage.addListener(function (message) {
        if(message.action === 'update'){
            updateHeadingsMap();
        } else if (message.action === 'settings') {
            var openOptionsPage = chrome.runtime.openOptionsPage();

            openOptionsPage.then(reportSuccess, reportError);
        }
    });
}

function sendActionToHeadingsMapScript(action){
    var message = {action: action};

    chrome.storage.local.get(null, sendActionWithSettings);

    function sendActionWithSettings(settings) {
        message.settings = settings;

        chrome.tabs
            .sendMessage(tabId, message);
    }
}

function showHeadingsMap() {
    sendActionToHeadingsMapScript('toggle');
}

function updateHeadingsMap() {
    sendActionToHeadingsMapScript('update');
}

function reportSuccess() {}

function reportError(error) {}
