<!-- 
@component

A component representing a view in the view tree.
Can be resized and split into subviews.
-->

<script>
// @ts-ignore
import * as Types from "./types.js"


/**
 * @type {any[]} subviews
 */
export let children = [];



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

export let size = 100;

</script>

<div style="--size: {size}px" class={`viewnode viewnode-${directionString}`}>
	{#each children as child, index}
		{#if index != 0}
			<div class={`resizer resizer-${directionString}`}> <div></div> </div>
		{/if}
		<svelte:self {...child}/>
	{/each}

	{#if component !== undefined}
		<svelte:component this={component} {...data}/>
	{/if}
</div>

<style>

.viewnode {
	display: flex;
	flex: 1;
}

.viewnode-vertical {
	flex-direction: column;
}

.resizer {
	transition: background-color 0.4s;
}

.resizer:hover {
	background-color: var(--color-theme-1);
}

.resizer-vertical > div {
	height: 5px;
}

.resizer-horizontal > div {
	width: 5px;
}
</style>
