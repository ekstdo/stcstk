<script>


import { onMount } from 'svelte';
import { calcPinchTrans } from './util';
import { createEventDispatcher } from 'svelte';

/**
 * @type {PointerEvent[]}
 */
const evDownCache = [];
/**
 * @type {PointerEvent[]}
 */
const evCache = [];
let prevDiff = -1;


export let currentZoomLevel = 1.0;
export let currentTranslation = [0, 0];

let cachedZoomLevel = 1.0;
let cachedTranslation = [0, 0];

/**
 * @type {SVGSVGElement}
 */
let svgElem;


/**
 * @type {number}
 */
let svgWidth;
/**
 * @type {number}
 */
let svgHeight;

onMount(() => {
	const resizeObserver = new ResizeObserver(entries => {
		for (const entry of entries){
			svgWidth = entry.contentRect.width;
			svgHeight = entry.contentRect.height;
		}
	});
	resizeObserver.observe(svgElem);
	svgWidth = svgElem.getBoundingClientRect().width;
	svgHeight = svgElem.getBoundingClientRect().height;
	svgViewBox = `${currentTranslation[0] / currentZoomLevel} ${currentTranslation[1] / currentZoomLevel} ${(svgWidth + currentTranslation[0]) / currentZoomLevel } ${(svgHeight + currentTranslation[1]) / currentZoomLevel}`;
})

/**
 * @param {PointerEvent} ev
 */
function pointerDown(ev){
	evDownCache.push(ev);
	evCache.push(ev);
	cachedZoomLevel = currentZoomLevel;
	cachedTranslation = currentTranslation;
}

/**
 * @param {PointerEvent} ev
 */
function pointerMove(ev){
	const index = evCache.findIndex(cachedEv => cachedEv.pointerId == ev.pointerId);
	evCache[index] = ev;
	if (evCache.length === 2) {
		let [tx, ty, scale, theta] = calcPinchTrans([evDownCache[0].x, evDownCache[0].y], [evDownCache[1].x, evDownCache[1].y], [evCache[0].x, evCache[0].y], [evCache[1].x, evCache[1].y])
	}
}


/**
 * @param {WheelEvent} e
 */
function wheel(e) {
	e.preventDefault();
	if (e.ctrlKey) {
		let factor = e.shiftKey ? 0.001 : 0.01;
		let nextZoomLevel = currentZoomLevel - e.deltaY * factor;
		let a = currentTranslation[0] + e.offsetX / currentZoomLevel;
		let b = currentTranslation[1] + e.offsetY / currentZoomLevel;

		currentTranslation[0] = (currentTranslation[0] - a) * currentZoomLevel / nextZoomLevel + a;
		currentTranslation[1] = (currentTranslation[1] - b) * currentZoomLevel / nextZoomLevel + b;
		currentZoomLevel = nextZoomLevel;
	}
	else {
		let factor = e.shiftKey && e.deltaX != 0 ? 0.2 : 2;
		currentTranslation[0] -= 
			e.shiftKey && e.deltaX == 0 ?
			e.deltaY * factor / currentZoomLevel :
			e.deltaX * factor / currentZoomLevel;
		currentTranslation[1] -=
			e.shiftKey && e.deltaX == 0 ?
			0 :
			e.deltaY * factor / currentZoomLevel;
	}
}

/**
 * @param {PointerEvent} ev
 */
function removeEvent(ev){
	const index = evDownCache.findIndex(cachedEv => cachedEv.pointerId == ev.pointerId);
	evDownCache.splice(index, 1);
}

$: svgViewBox = `${currentTranslation[0]} ${currentTranslation[1]} ${svgWidth / currentZoomLevel} ${svgHeight / currentZoomLevel}`;

const dispatch = createEventDispatcher();
const mousemove = (/** @type {MouseEvent} */ ev) => dispatch('mousemove', ev );
const mouseup = (/** @type {MouseEvent} */ ev) => dispatch('mouseup', ev );
const mousedown = (/** @type {MouseEvent} */ ev) => dispatch('mousedown', ev );

</script>

<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox={svgViewBox} bind:this={svgElem} on:pointerdown={pointerDown} on:pointermove={pointerMove} on:wheel={wheel} on:mousemove={mousemove} on:mouseup={mouseup} on:mousedown={mousedown}>
	<defs>
		<pattern id="smallGrid" width="16" height="16" patternUnits="userSpaceOnUse">
			<path d="M 16 0 L 0 0 0 16" fill="none" style="stroke: var(--color-theme-1)" stroke-width="1"/>
		</pattern>
		<pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
			<rect width="80" height="80" fill="url(#smallGrid)"/>
			<path d="M 80 0 L 0 0 0 80" fill="none" style="stroke: var(--color-theme-1)" stroke-width="2"/>
		</pattern>
		<marker id="arrowhead" markerWidth="10" markerHeight="7" 
			refX="0" refY="3.5" orient="auto">
			<polygon fill="white" points="0 0, 10 3.5, 0 7" />
		</marker>
	</defs>
			
	<rect x={currentTranslation[0]} y={currentTranslation[1]} width="100%" height="100%" fill="url(#grid)"/>

	<slot/>
</svg>


<style>
svg {
	display: block;

}
</style>
