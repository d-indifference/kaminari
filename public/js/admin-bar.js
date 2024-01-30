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