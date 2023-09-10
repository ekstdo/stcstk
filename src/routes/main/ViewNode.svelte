<!-- 
@component

A component representing a view in the view tree.
Can be resized and split into subviews.
-->

<script>
// @ts-ignore
import * as Types from "./types.js"
import { propagateResize } from "./util.js"

/**
 * @type {any[]} subviews
 */
export let children = [];

/**
 * @type {number[]}
 */
export let id = [];
$: idString = id.join("-");

/**
 * @type {Types.directionStates}
 *
 */
export let direction = Types.directionStates.HORIZONTAL;

/**
 * @type {?any}
 *
 */
export let component;
/**
 * @type {?any}
 *
 */
export let data;

$: directionString = direction == Types.directionStates.HORIZONTAL ? "horizontal" : "vertical";

/**
 * @type {number}
 */
 export let height = 100;
/**
 * @type {number}
 */
 export let width = 100;

/**
 * @type {number | undefined}
 */
let currentIndex = undefined;

/**
 * @param {any} ev
 */
function mouseMove(ev){
	if (currentIndex === undefined) {
		console.debug("Resizer Index is undefined !!!");
		return;
	}
	if (direction == Types.directionStates.HORIZONTAL) {
		children[currentIndex - 1].width += ev.movementX;
		children[currentIndex].width -= ev.movementX;
	} else if (currentIndex !== undefined) {
		children[currentIndex - 1].height += ev.movementY;
		children[currentIndex].height -= ev.movementY;
	}
	propagateResize(children[currentIndex - 1], direction, {width, height});
	propagateResize(children[currentIndex], direction, {width, height});

	children = children;
}
/**
 * @param {any} _ev
 */
function mouseUp(_ev){
	window.removeEventListener("mousemove", mouseMove);
	window.removeEventListener("mouseup", mouseUp);
}

/**
 * @param {MouseEvent & { currentTarget: EventTarget & HTMLDivElement; }} ev
 * @param {number} index
 */
function mouseDown(ev, index){
	window.addEventListener("mousemove", mouseMove);
	window.addEventListener("mouseup", mouseUp);
	currentIndex = index;
}

</script>

<div id={"comp-" + idString} style="height: {height}px; width: {width}px" class={`viewnode viewnode-${directionString}`}>
	{#each children as child, index}
		{#if index != 0}
			<div id={"resizer-" + idString + "-" + index} class={`resizer resizer-${directionString}`} on:mousedown={ev => mouseDown(ev, index)}></div>
		{/if}
		<svelte:self {...{height, width, ...child, id: [...id, index]}}/>
	{/each}
	{#if component !== undefined}
		<svelte:component this={component} {...data}/>
	{/if}
</div>

<style>
.viewnode-horizontal > div {
	display: block;
	float: left;
}


.resizer {
	transition: background-color 0.4s;
	flex: 1 0 0;
}

.resizer:hover {
	background-color: var(--color-theme-1);
}

.resizer-vertical {
	height: 5px;
}

.resizer-horizontal {
	width: 5px;
	height: 100%;
}
</style>
