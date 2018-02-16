var rumoHeadingsmap_bio_documents = {
	contents: function(act,previos) {
		var documentos = new Array();
		if(previos)
			documentos = previos;
		if (!act) {
			documentos.push(window.content);
			act = window.content;
		}
		if(act.document.getElementsByTagName('frame').length){
			for(var i = 0; i < act.document.getElementsByTagName('frame').length; i++){
				if(!act.frames[i].document.getElementsByTagName('frame').length)
					documentos.push(act.frames[i]);
				if(act.frames[i].document.getElementsByTagName('frame').length || act.frames[i].document.getElementsByTagName('iframe').length)
					rumoHeadingsmap_bio_documents.contents(act.frames[i],documentos);
			}
		}else {
			if(act.document.getElementsByTagName('iframe').length){
				for(var i = 0; i < act.document.getElementsByTagName('iframe').length; i++){
					if(act.document.getElementsByTagName('iframe')[i].getAttribute('class') != 'niq_valid')
						documentos.push(act.frames[i]);
					if(act.frames[i].document.getElementsByTagName('frame').length || act.frames[i].document.getElementsByTagName('iframe').length)
						rumoHeadingsmap_bio_documents.contents(act.frames[i],documentos);
				}
			}
		}
		return documentos;
	},
	documents: function(act,previos) {
		var documentos = new Array();
		if(previos)
			documentos = previos;
		if (!act) {
			documentos.push(window.content.document);
			act = window.content;
		}
		if(act.document.getElementsByTagName('frame').length){
			for(var i = 0; i < act.document.getElementsByTagName('frame').length; i++){
				if(!act.frames[i].document.getElementsByTagName('frame').length)
					documentos.push(act.frames[i].document);
				if(act.frames[i].document.getElementsByTagName('frame').length || act.frames[i].document.getElementsByTagName('iframe').length)
					rumoHeadingsmap_bio_documents.documents(act.frames[i],documentos);
			}
		}else {
			if(act.document.getElementsByTagName('iframe').length){
				for(var i = 0; i < act.document.getElementsByTagName('iframe').length; i++){
					if(act.document.getElementsByTagName('iframe')[i].getAttribute('class') != 'niq_valid')
						documentos.push(act.frames[i].document);
					if(act.frames[i].document.getElementsByTagName('frame').length || act.frames[i].document.getElementsByTagName('iframe').length)
						rumoHeadingsmap_bio_documents.documents(act.frames[i],documentos);
				}
			}
		}
		return documentos;
	},
	tipodocuments: function(act,previos) {
		var tipodocumentos = new Array();
		if(previos) tipodocumentos = previos;
		if (!act) {
			tipodocumentos.push('Principal' + ' - ' + window.content.location.href);
			act = window.content;
		}
		if(act.document.getElementsByTagName('frame').length){
			for(var i = 0; i < act.document.getElementsByTagName('frame').length; i++){
				if(!act.frames[i].document.getElementsByTagName('frame').length)
					tipodocumentos.push('Frame' + ' - ' + act.document.getElementsByTagName('frame')[i].getAttribute('src'));
				if(act.frames[i].document.getElementsByTagName('frame').length || act.frames[i].document.getElementsByTagName('iframe').length)
					rumoHeadingsmap_bio_documents.documentTypes(act.frames[i],tipodocumentos);
			}
		}else {
			if(act.document.getElementsByTagName('iframe').length){
				for(var i = 0; i < act.document.getElementsByTagName('iframe').length; i++){
					if(act.document.getElementsByTagName('iframe')[i].getAttribute('class') != 'niq_valid')
						tipodocumentos.push('Iframe' + ' - ' + act.document.getElementsByTagName('iframe')[i].src);
					if(act.frames[i].document.getElementsByTagName('frame').length || act.frames[i].document.getElementsByTagName('iframe').length)
						rumoHeadingsmap_bio_documents.documentTypes(act.frames[i],tipodocumentos);
				}
			}
		}
		return tipodocumentos;
	}
}
