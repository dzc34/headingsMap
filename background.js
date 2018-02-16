var tabId;

// open/close when clicking the toolbar button
chrome.browserAction.onClicked.addListener(injectHeadingsMapScript);


function injectHeadingsMapScript(tab) {
    browser.sidebarAction.open();
}
