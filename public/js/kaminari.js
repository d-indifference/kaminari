function getCookie(name) {
	with (document.cookie) {
		var regexp= new RegExp('(^|;\\s+)' + name + '=(.*?)(;|$)');

		var hit= regexp.exec(document.cookie);

		if (hit && hit.length > 2) {
			return unescape(hit[2]);
		} else {
			return '';
		}
	}
}

function setCookie(name,value,days) {
	var expires = '';

	if (days) {
		var date = new Date();

		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

		expires = '; expires=' + date.toGMTString();
	}

	document.cookie = name + '=' + value + expires + '; path=/';
}

function generatePassword(len) {
	var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	var pass = '';

	for (var i= 0; i < len; i++) {
		var rnd= Math.floor(Math.random() * chars.length);
		pass += chars.substring(rnd,rnd + 1);
	}

	return pass;
}

function setInputs(id) {
	var form = document.getElementById(id);

	if (!form.password.value) {
		var password = getCookie('kaminariPass');

		if (!password) {
			setCookie('kaminariPass', generatePassword(8), 365);

			form.password.value = getCookie('kaminariPass');
		}

		form.password.value = password;
	}
}

function setDeletePassword(id) {
	var form = document.getElementById(id);

	form.password.value = getCookie('kaminariPass');
}

