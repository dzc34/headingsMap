var select = document.getElementsByTagName('select');
for(var i = 0; i < select.length; i++){
  select[i].onchange=function(){save_options(this)}; 
}
function save_options(el) {
	var opt = el.getAttribute('id');
	var optVal = el.children[el.selectedIndex].value;
	localStorage[opt] = optVal;
  var status = document.getElementById("status");
  el.parentNode.appendChild(status);
  status.innerHTML = " Guardada";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}
function restore_options() {
 	for(var i = 0; i < select.length; i++){
		var opt = select[i].getAttribute('id');
		var fav = localStorage[opt];
		for (var a = 0; a < select[i].childNodes.length; a++) {
    		var child = select[i].childNodes[a];
    		if (child.value == fav) {
      			child.selected = "true";
      			break;
    		}
  		}
  	}

}
document.addEventListener('DOMContentLoaded', restore_options);
//document.getElementById('save').addEventListener('click', save_options);
