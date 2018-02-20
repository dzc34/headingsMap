var headingsMapPort = chrome.runtime.connect({name: 'port-from-cs'});

document.addEventListener('DOMContentLoaded', initialize);

function initialize() {
    var select = document.getElementsByTagName('select'),
        settings = chrome.storage.local.get(['showHeadLevels', 'showHeadError', 'showHeadErrorH1', 'showOutLevels', 'showOutElem', 'showOutError'], setInitialValues);

    // FF: chrome.storage.local.get returns a promise
    // Chrome: chrome.storage.local.get uses a callback

    for (var i = 0, selectLength = select.length; i < selectLength; i++) {
        select[i].onchange = function () {
            saveOption(this);
        };
    }

    settings
        .then(setInitialValues);

    function setInitialValues(values) {
        var selectToUpdate;

        for (var key in values) {
            selectToUpdate = document.getElementById(key);
            selectToUpdate.value = values[key];
        }
    }

    function saveOption(el) {
        var option = {},
            optionId = el.getAttribute('id'),
            optionValue = el.children[el.selectedIndex].value === 'true';

        option[optionId] = optionValue;
        chrome.storage.local.set(option);

        headingsMapPort.postMessage({action: 'update'});
    }
}