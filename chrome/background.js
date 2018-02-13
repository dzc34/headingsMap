function headingsMap(){
	chrome.tabs.getSelected(null,function(tab){
		chrome.tabs.sendRequest(tab.id, {msg: "getOutline",headingsMap_outLevels: localStorage['headingsMap_outLevels'],headingsMap_outElem: localStorage['headingsMap_outElem'],headingsMap_outError: localStorage['headingsMap_outError'],headingsMap_headLevels: localStorage['headingsMap_headLevels'],headingsMap_headError: localStorage['headingsMap_headError'],headingsMap_headErrorH1: localStorage['headingsMap_headErrorH1']}, function(outline){});
	});
}
chrome.browserAction.onClicked.addListener(headingsMap);
