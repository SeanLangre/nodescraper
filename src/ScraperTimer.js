export default class ScraperTimer {
	constructor() {
		this._startDate;
		this._endDate;
		this._diff;
	}

	StartTimer() {
		this._startDate = new Date();
	}

	EndTimer() {
		this._endDate = new Date();
		this._diff = this.GetDiff()
	}

	GetDiff() {
		let now = new Date();
		return now.getTime() - this._startDate.getTime();
	}

	PrintTime() {
		console.log(`-TIME- : ${this._diff / 1000} Seconds`)
	}

	GetTime() {
		return this.GetDiff() / 1000
	}
}