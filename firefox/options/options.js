var headingsMapPort = browser.runtime.connect({name: 'port-from-cs'});

function initialize() {
    var select = document.getElementsByTagName('select'),
        settings = browser.storage.local.get();

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

        browser.storage.local.set(option);

        headingsMapPort.postMessage({action: 'update'});
    }
}

document.addEventListener('DOMContentLoaded', initialize);