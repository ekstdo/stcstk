export class DfaConstructor {
	/**
	 * @param {string[]|string} alphabet  alphabet to be used 
	 * @param {string[]|string} states    list of states to be used 
	 * @param {number[][]} transitions  list of transitions to be used 
	 * @param {number|string} starting starting state 
	 * @param {number[] | string[]} endStates list of states, that validate a string
	 */
	constructor(alphabet, states, transitions, starting, endStates){
		if (typeof(alphabet) == "string") 
			alphabet = alphabet.split("");
		if (typeof(states) == "string") 
			states = states.split("");
		this.alphabet = alphabet;
		/**
		 * indexing letters from alphabet
		 * @type {Object.<string, number>}
		 */
		this.fromAlphabetLabel = {};
		this.alphabet.forEach((x, i) => this.fromAlphabetLabel[x] = i);
		/**
		 * list of state labels
		 * @type {string[]}
		 */
		this.stateLabels = states;
		/**
		 * indexing labels
		 * @type {Object.<string, number>}
		 */
		this.fromStateLabel = {};
		states.forEach((x, i) => this.fromStateLabel[x] = i);
		/**
		 * transition function as a matrix
		 * @type {number[][]}
		 */
		this.transitions = transitions;
		if (typeof(starting) == "string") {
			this.start = this.fromStateLabel[starting];
		} else {
			this.start = starting;
		}
		if (typeof endStates[0] == "string") {
			/**
			 * list of end states
			 * @type {number[]}
			 */
			this.endStates = endStates.map(x => this.fromStateLabel[x]);
		} else {
			// @ts-ignore
			this.endStates = endStates;
		}

	}

	/**
	 * @param {number|string} from  transition state from
	 * @param {number|string} to    transition state to
	 * @param {number|string} with_ letter to transition with
	 */
	setTransition(from, to, with_){
		let fromInt = typeof(from) == "string" ? this.fromStateLabel[from] : from;
		let toInt = typeof(to) == "string" ? this.fromStateLabel[to] : to;
		let withInt = typeof(with_) == "string" ? this.fromAlphabetLabel[with_] : with_;
		this.transitions[fromInt][withInt] = toInt;
	}
}

export class Dfa {
	/**
	 * @param {DfaConstructor} dfaConstructor
	 * @param {(string|string[])?} word
	 */
	constructor(dfaConstructor, word = null){
		this.param = dfaConstructor;

		/**
		 * @type {number[]?}
		 */
		this.word;
		if (word !== null) {
			this.setWord(word);
		}
		this.index = 0;
		this.currentState = this.param.start;
	}

	/**
	 * sets the word for the DFA
	 *
	 * returns "ok" on success, and an error message on error
	 * @param {string|string[]} word -  word to be inserted
	 * @returns {string} 
	 */
	setWord(word){
		if (typeof(word) == "string") {
			word = word.split("");
		}
		let res = word.find(x => this.param.fromAlphabetLabel[x] !== undefined);
		if (res !== undefined) {
			return `${res} not part of the alphabet! Please change the word or the alphabet accordingly`;
		}
		this.word = word.map(x => this.param.fromAlphabetLabel[x]);
		return "ok";
	}

	transition(){
		if (this.word !== null) {
			this.currentState = this.param.transitions[this.currentState][this.word[this.index++]];
			return "ok"
		} else 
			return `word is null`
	}

	isAccepted(){
		return this.param.endStates.includes(this.currentState);
	}
}

export class DfaViewModel extends Dfa {
	/**
	 * @param {DfaConstructor} dfaConstructor
	 * @param {(string|string[])?} word
	 */
	constructor(dfaConstructor, word = null){
		super(dfaConstructor, word);
		this.positions = [];
	}
}

/**
 * @param {?number} max - excluded maximum
 * @param {number} min - included minimum
 * @returns {number}
 */
function getRandom(min, max = null) {
	if (max === null) {
		max = min;
		min = 0;
	}
	return Math.random() * (max - min) + min;
}

/**
 * @param {(number|[number,number])[]} bounds
 * @returns {number[]}
 */
function getRandomPoint(bounds){
	return bounds.map(x => typeof x === "number"? getRandom(0, x) : getRandom(x[0], x[1]));
}

/**
 * @param {number[]} indexes
 * @param {number[]} bounds
 */
function combineIndex(indexes, bounds){
	let resultingIndex = 0;
	let factor = 1;
	indexes.forEach((x, i) => {
		resultingIndex += x * factor;
		factor *= bounds[i];
	});
	return resultingIndex;
}

/**
 * @param {any} radius
 * @param {any} tries
 * @param {any} max
 * @param {number[]} bounds
 */
function poissonDiskSampling(radius, tries, max, bounds) {
	let dim = bounds.length;
	let cellsize = ~~ (radius/Math.sqrt(dim))
	let cellbounds = bounds.map(x => Math.ceil(x / cellsize) + 1);
	let grid = Array(cellbounds.reduce((x, acc) => x * acc)).fill(0);
	let insertIntoGrid = (/** @type {number[]} */ point) => 
		grid[combineIndex(point.map(x => ~~(x / cellsize)), cellbounds)] = point;
	let points = [];
	let active = [];

	let initialPoint = getRandomPoint(bounds);
	insertIntoGrid(initialPoint);
	points.push(initialPoint);
	active.push(initialPoint);
}
