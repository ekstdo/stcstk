import { ValidationError, invArray } from "../util";

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
		 * @type {Map<string, number>}
		 */
		this.fromAlphabetLabel = invArray(alphabet);
		/**
		 * list of state labels
		 * @type {string[]}
		 */
		this.stateLabels = states;
		/**
		 * indexing labels
		 * @type {Map<string, number>}
		 */
		this.fromStateLabel = invArray(states);
		if (typeof(starting) == "string") 
			starting = this.fromStateLabel.get(starting) ??
				ValidationError.throw_("starting state is not part of states");
		if (typeof endStates[0] == "string") 
			// @ts-ignore
			endStates = endStates.map(x => this.getState(x));
		/**
		 * transition function as a matrix
		 * @type {number[][]}
		 */
		this.transitions = transitions;
		/**
		 * transition function as a matrix
		 * @type {number}
		 */
		// @ts-ignore
		this.start = starting;
		/**
		 * transition function as a matrix
		 * @type {number[]}
		 */
		// @ts-ignore
		this.endStates = endStates;
	}

	/**
	 * @param {number|string} from  transition state from
	 * @param {number|string} to    transition state to
	 * @param {number|string} with_ letter to transition with
	 */
	setTransition(from, to, with_){
		let fromInt = this.getState(from);
		let toInt = this.getState(to);
		let withInt = this.getState(with_, this.fromAlphabetLabel);
		this.transitions[fromInt][withInt] = toInt;
	}

	/**
	 * @param {string | number} s
	 * @param {Map<string, number>?} set to convert it to
	 * @returns {number}
	 */
	getState(s, set = null){
		if (set === null) {
			set = this.fromStateLabel;
		}
		return typeof(s) == "string" ? ValidationError.throw_(`state ${s} doesn't exist`, this.fromStateLabel.get(s)) : s;
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
		/**
		 * @type {number}
		 */
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
		let res = word.find(x => this.param.fromAlphabetLabel.get(x) !== undefined);
		if (res !== undefined) {
			return `${res} not part of the alphabet! Please change the word or the alphabet accordingly`;
		}
		this.word = word.map(x => this.param.getState(x, this.param.fromAlphabetLabel));
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




