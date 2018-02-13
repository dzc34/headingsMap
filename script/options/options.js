var select = document.getElementsByTagName('select'),
    selectLength = select.length;

for (var i = 0; i < selectLength; i++) {
    select[i].onchange = function () {
        save_options(this);
    };
}

function save_options(el) {
    var status,
        opt = el.getAttribute('id'),
        optVal = el.children[el.selectedIndex].value;

    localStorage[opt] = optVal;

    status = document.getElementById('status');
    el.parentNode.appendChild(status);
    status.innerHTML = ' Guardada';

    setTimeout(function () {
        status.innerHTML = '';
    }, 750);
}

function restore_options() {
    var opt, fav, selectCur, selectCurChildNodes, child;

    for (var i = 0; i < selectLength; i++) {
        selectCur = select[i];
        selectCurChildNodes = selectCur.childNodes;
        opt = selectCur.getAttribute('id');
        fav = localStorage[opt];

        for (var a = 0, selectCurChildNodesLength = selectCur.childNodes.length; a < selectCurChildNodesLength; a++) {
            child = selectCurChildNodes[a];

            if (child.value == fav) {
                child.selected = 'true';
                break;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', restore_options);
//document.getElementById('save').addEventListener('click', save_options);