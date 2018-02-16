chrome.tabs.query({currentWindow: true, active: true}, injectHeadingsMapScript);

var tabId;

function injectHeadingsMapScript(tab) {
    tabId = tab.id;
    console.log(1111)
    chrome.tabs
        .executeScript(tabId, {file: '../content_scripts/headingsMap.js'}, showHeadingsMap);

    chrome.tabs
        .insertCSS({file: '../content_scripts/headingsMap.css'});
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
