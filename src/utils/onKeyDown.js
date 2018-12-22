/**
* When the user presses a key down, check if it's space then translate that into a hyphen.
* 
* @param {KeyboardEvent} e - Keydown Event
*/
export function onKeyDown (e) {
	if (e.key === 'Space' || e.key === ' ') {
		e.preventDefault();
		const index = e.currentTarget.selectionStart;
		const newIndex = index + 1;
		const currentValue = e.currentTarget.value;
		const value = `${currentValue.substring(0, index)}-${currentValue.substring(index, currentValue.length)}`;

		e.currentTarget.value = value;
		e.currentTarget.setSelectionRange(newIndex, newIndex);
	}
}