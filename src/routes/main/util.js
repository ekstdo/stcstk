/**
 * @function
 * @template T
 * @param {T[]} input 
 * @returns {Map<T, number>}
 */
export function invArray(input) {
	let result = new Map();
	for (let i = 0; i < input.length; i++){
		result.set(input[i], i);
	}
	return result;
}


/**
 * @function
 * @template T
 * @param {Set<T>} setA first set 
 * @param {Set<T>} setB second set 
 * @returns {Set<T>}
 */
export function difference(setA, setB) {
	const _difference = new Set(setA);
	for (const elem of setB) {
		_difference.delete(elem);
	}
	return _difference;
}

export class UndefinedError extends Error {
	/**
	 * @param {string | undefined} message
	 */
	constructor(message) {
		super(message);
		this.name = "UndefinedError";
	}

	/**
	 * @template T
	 * @param {string | undefined} message
	 * @param {T?} obj  object, that should be returned, if it's not undefined
	 * @throws ValidationError
	 * @returns {T}
	 */
	static throw_(message, obj = null) {
		if (obj == null)
			throw new UndefinedError(message);
		else 
			return obj;
	}
}


/**
 * @param {?number} max - excluded maximum
 * @param {number} min - included minimum
 * @returns {number}
 */
export function getRandom(min, max = null) {
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
export function getRandomPoint(bounds){
	return bounds.map(x => typeof x === "number"? getRandom(0, x) : getRandom(x[0], x[1]));
}

export function getBoxMullerRandomPoint(){
	let r = Math.sqrt(- 2 * Math.log1p(-Math.random()));
	let theta = 2 * Math.PI * (1 - Math.random());
	return [r * Math.cos(theta), r * Math.sin(theta)]
}

/**
 * normalizes a point, returns 0 point on 0 point
 * @param {number[]} point
 * @returns {number[]}
 */
export function normalize(point){
	let l = distance(point);
	if (l == 0)
		return point;
	return point.map(x => x / l);
}

/**
 * @param {number} n
 */
export function getRandomUnitPoint(n = 2) {
	let result = Array(n);
	do {
		for (let i = 0; i < n; i += 2){
			let [r, q] = getBoxMullerRandomPoint();
			result[i] = r;
			if (i + 1 < n)
				result[i + 1] = q;
		}
	} while (distance(result) === 0);
	return normalize(result);
}

/**
 * @param {number[]} indexes
 * @param {number[]} bounds
 */
export function combineIndex(indexes, bounds){
	let resultingIndex = 0;
	let factor = 1;
	indexes.forEach((x, i) => {
		resultingIndex += x * factor;
		factor *= bounds[i];
	});
	return resultingIndex;
}

/**
 * @param {number[]} a
 * @param {number[] | number} b
 */
export function distance(a, b = 0, n = 2){
	/** @type {function(number, number, number): number} */
	let redFun = typeof b == "number" ? 
		(acc, i, _ind) => acc + Math.pow(i - b, n) :
		(acc, i, ind) => acc + Math.pow(i - b[ind], n);
	return Math.pow(a.reduce(redFun, 0), 1/n);
}


/**
 * @param {(number[]?)[]} grid
 * @param {number[]} point
 * @param {number} radius
 */
function isValidPoint(grid, point, radius){
	for (let i = 0; i < grid.length; i++){
		// @ts-ignore
		if (grid[i] != null && distance(grid[i], point) < radius){
			return false
		}
	}
	return true;
}

/**
 * @param {number[]} point
 * @param {number[]} bounds
 */
export function isWithin(point, bounds){
	return point.every((x, ind) => x < bounds[ind] && x > 0);
}

/**
 * @param {number[]} p1
 * @param {number[]} p2
 */
export function vecAdd(p1, p2){
	return p1.map((x, ind) => x + p2[ind]);
}

/**
 * @param {number | number[]} a
 * @param {number | number[]} b
 * @returns {number[]}
 */
export function dot(a, b){
	/** @type {function(number): number} */
	let bGet = typeof b === "number" ? _ => b : ind => b[ind];
	if (typeof a == "number")
		if (typeof b == "number")
			return [a * b];
		else return b.map(x => x * a);
	return a.map((x, ind) => x * bGet(ind));
}

/**
 * generates a list of points at random, as packed as 
 * possible, but further apart than radius
 * @param {any} radius
 * @param {any} tries
 * @param {number | number[]} max
 * @param {number[]?} bounds
 */
export function poissonDiskSampling(radius, tries, max, bounds = null) {
	if (typeof max != "number"){
		bounds = max;
		max = Number.MAX_VALUE;
	}
	if (bounds === null){
		let x = ~~((Math.sqrt(max) + 1) * radius);
		bounds = [x, x] 
	}
	let dim = bounds.length;
	let cellsize = radius/Math.sqrt(dim)
	let cellbounds = bounds.map(x => Math.ceil(x / cellsize) + 1);
	let product = cellbounds.reduce((x, acc) => x * acc, 1);
	/** @type {(number[]?)[]} */
	let grid = Array(product).fill(null);
	let insertIntoGrid = (/** @type {number[]} */ point) => 
		grid[combineIndex(point.map(x => ~~(x / cellsize)), cellbounds)] = point;
	/** @type {number[][]} */
	let points = [];
	/** @type {number[][]} */
	let active = [];
	let registerPoint = (/** @type {number[]} */ point) => {
		insertIntoGrid(point);
		points.push(point);
		active.push(point);
	};

	registerPoint(getRandomPoint(bounds));

	while(active.length > 0){
		let randomIndex = ~~getRandom(active.length);
		let randomPoint = active[randomIndex];

		let found = false;
		for (let i = 0; i < tries; i++){
			let randomAngle = getRandomUnitPoint(dim);
			// not really uniform
			// but we want some bias towards the center anyway
			let randomDist = getRandom(radius, 2.0 * radius);
			let newRandomPoint = vecAdd(randomPoint, dot(randomAngle, randomDist));
			if (isWithin(newRandomPoint, bounds) && isValidPoint(grid, newRandomPoint, radius)){
				registerPoint(newRandomPoint);
				if (points.length == max)
					return points;
				found = true;
				break;
			}
		}

		if (!found)
			active.splice(randomIndex, 1);
	}

	return points;
}
