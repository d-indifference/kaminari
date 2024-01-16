function cpuSectionCollapser() {
	var $cpuToggle = $('#cpu_toggle');
	var $cpuSection = $('#cpu_section');

	if ($cpuSection && $cpuToggle) {
		$cpuToggle.on('click', function() {
			$cpuSection.slideToggle();
			$cpuToggle.text(function(_, text) {
				return text === 'Show' ? 'Hide' : 'Show';
			});
		});
	}
}

function generatePassword(len) {
	var chars="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	var pass='';

	for (var i=0; i < len; i++) {
		var rnd=Math.floor(Math.random() * chars.length);
		pass += chars.substring(rnd,rnd + 1);
	}

	return pass;
}

function setNewMemberPassword() {
	var $newMemberPassword = $('#new_member_password');

	if ($newMemberPassword) {
		$newMemberPassword.val(generatePassword(16));
	}
}

$(document).ready(function() {
	cpuSectionCollapser();
	setNewMemberPassword();
});