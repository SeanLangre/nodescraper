export default class ScraperTimer {
	constructor() {
		this._startDate;
		this._endDate;
		this._diff;
	}

	StartTimer(){
		this._startDate = new Date();
	}

	EndTimer(){
		this._endDate = new Date();
		this._diff = this._endDate.getTime() - this._startDate.getTime();
		this.PrintTime();
	}

	PrintTime(){
		console.log(`-TIME- : ${this._diff / 1000} Seconds`)
	}
}