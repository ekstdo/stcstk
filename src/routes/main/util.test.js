import { expect, test } from "vitest";
import { distance, getRandomUnitPoint, normalize, poissonDiskSampling } from "./util";

test('checks for random unit point', () => {
	let randomPoint = getRandomUnitPoint();
	expect(distance(randomPoint) - 1).toBeLessThan(0.0001);
})

test('checks for distance function in general', () => {
	let d = distance([1, 0], [0, 1]);
	expect(d - Math.sqrt(2)).toBeLessThan(0.0001);
})

test('checks for normalization', () => {
	let d = normalize([2, 2]);
	expect(distance(d) - 1).toBeLessThan(0.0001);
})

test('general poisson disk sampling test', () => {
	let result = poissonDiskSampling(1.0, 20, 10, [10, 10])
	expect(result.length).toBe(10);
	for (let i = 0; i < result.length; i ++){
		for (let j = 0; j  < result.length; j++){
			if (i == j)
				continue;

			expect(distance(result[i], result[j])).toBeGreaterThan(1.0);
		}
	}
})

test('general poisson disk sampling misssing parameters', () => {
	let result = poissonDiskSampling(1.0, 20, 10)
	expect(result.length).toBe(10);
	for (let i = 0; i < result.length; i ++){
		for (let j = 0; j  < result.length; j++){
			if (i == j)
				continue;

			expect(distance(result[i], result[j])).toBeGreaterThan(1.0);
		}
	}
})
