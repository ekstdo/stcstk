/**
 * Enum for possible directions, in which the view can be split
 * @readonly 
 * @enum{number}
 */
export let directionStates = {
	HORIZONTAL: 0,
	VERTICAL: 1
}

/**
 * Enum for possible viewnode directions, in which the view can be split
 * and an additional LEAF state
 * @readonly 
 * @enum{number}
 */
export let viewnodeStates = {
	...directionStates,
	LEAF: 2
}

/**
 * Enum for possible directions, in which the view can be split
 * @readonly 
 * @enum{number}
 */
export let tmDirection = {
	Left: -1,
	Neutral: 0,
	Right: 1
}
