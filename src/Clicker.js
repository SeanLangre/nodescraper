

export default class Clicker {

	constructor(data) {
		this.data = data
	}

	async SearchAndClick() {
		const elements = [...document.querySelectorAll('[aria-label="Spara i minneslistan"]')];

		elements.forEach(element => {
			let shouldClick = false
			let elementLC = element?.parentElement?.parentElement?.innerHTML.toLowerCase()
			this.data.keywords.forEach(wish => {
				wish = wish.toLowerCase()
				if (elementLC?.includes(wish)) {
					shouldClick = true
					return
				}
			});
			this.data.blacklist.forEach(deny => {
				deny = deny.toLowerCase()
				if (deny && deny.length != 0 && elementLC?.includes(deny)) {
					shouldClick = false
					return
				}
			});

			if (shouldClick) {
				element && element.click();
			}
		});
	}
}