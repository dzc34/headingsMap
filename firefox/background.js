var tabId;

// open/close when clicking the toolbar button
browser.browserAction.onClicked.addListener(injectHeadingsMapScript);

// listen for messages
browser.runtime.onConnect.addListener(connected);

function injectHeadingsMapScript(tab) {
    tabId = tab.id;

    browser.tabs
        .executeScript(tabId, {file: 'content_scripts/headingsMap.js'})
        .then(showHeadingsMap, reportError);

    browser.tabs
        .insertCSS({file: 'content_scripts/headingsMap.css'})
        .then(null, reportError);
}

function connected(portFromCS) {
    portFromCS.onMessage.addListener(function (message) {
        if(message.action === 'update'){
            updateHeadingsMap();
        } else if (message.action === 'settings') {
            var openOptionsPage = browser.runtime.openOptionsPage();

            openOptionsPage.then(reportSuccess, reportError);
        }
    });
}

function sendActionToHeadingsMapScript(action){
    var message = {action: action},
        settings = browser.storage.local.get();

    settings
        .then(sendActionWithSettings);

    function sendActionWithSettings(settings) {
        message.settings = settings;

        browser.tabs
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
