<script>
// @ts-ignore
import * as Types from "./types.js"
import { propagateResize } from "./util.js"
import SvgView from "./SvgView.svelte";
import ViewNode from "./ViewNode.svelte";
import DfaView from "./DfaView.svelte";
import { onMount } from "svelte";
	import ContextMenu from "./ContextMenu.svelte";

/**
 * current viewnodes, that should be displayed
 * @property {any} component main view to be displayed
 * @property {any[]} children main view to be displayed
 * @property {any} data - data to be displayed
 * @property {number?} width - width
 * @property {number?} height - height
 */
let viewNodes = {
	component: DfaView,
	data: {model: "dfa-1"},
	children: [],
	direction: Types.viewnodeStates.LEAF,
	width: 0,
	height: 0
};

/**
 * @type {Element}
 */
let el; 

onMount(() => {
	const resizeObserver = new ResizeObserver(entries => {
		for (const entry of entries){
			if (viewNodes.width !== window.innerWidth){
				viewNodes.width = window.innerWidth;
				propagateResize(viewNodes, Types.viewnodeStates.HORIZONTAL, {width: viewNodes.width,  height: viewNodes.height});
			}
			if (viewNodes.height !== window.innerHeight){
				viewNodes.height = window.innerHeight;
				propagateResize(viewNodes, Types.viewnodeStates.VERTICAL, {width: viewNodes.width,  height: viewNodes.height});
			}
		}
	});
	resizeObserver.observe(el);

	viewNodes.width = window.innerWidth;
	viewNodes.height = window.innerHeight;
})

/** @type{[number, number] | undefined} */
let showDisplayMenu = undefined;


/**
 * @param {PointerEvent} ev
 */
function onctxMenu(ev) {
	ev.preventDefault();
	/**
	 * @param {MouseEvent} ev
	 */
	function undoFunc(ev){
		showDisplayMenu = undefined;
		// @ts-ignore
		ev.currentTarget.removeEventListener(undoFunc);
	}
	// @ts-ignore
	ev.target.addEventListener("click", undoFunc);
	showDisplayMenu = [ev.x, ev.y];
	return false;
}



/**
 * splits a viewnode or appends a new one to the list 
 * @param {Types.directionStates } direction  direction it should be added to
 * @param {boolean } isStart tells, if the node to be added should be at the start of the list
 *
 */
// @ts-ignore
function createViewNode(direction, isStart) {
	if (direction != viewNodes.direction || viewNodes.direction === Types.viewnodeStates.LEAF) {

		viewNodes = {
			// @ts-ignore
			component: undefined,
			// @ts-ignore
			data: {},
			// @ts-ignore
			children: [viewNodes],
			direction,
			width: viewNodes.width,
			height: viewNodes.height
		}
		if (direction == Types.directionStates.HORIZONTAL){
			// @ts-ignore
			delete viewNodes.children[0].height;
		} else {
			// @ts-ignore
			delete viewNodes.children[0].width;
		}
	}

	let el = {
		component: DfaView,
		data: {model: "dfa-1"},
		children: [],
		direction: Types.viewnodeStates.LEAF,
	};
	if (isStart){
		// @ts-ignore
		viewNodes.children.unshift(el);
	} else {
		// @ts-ignore
		viewNodes.children.push(el);
	}

	propagateResize(viewNodes, direction, {width: viewNodes.width,  height: viewNodes.height});
	viewNodes = viewNodes;
}



</script>

<div bind:this={el} class="resizer-view-create" on:contextmenu={onctxMenu}>
	<div class="resizer-create resizer-horizontal-create1 resizer-horizontal-create" on:click={ev => createViewNode(Types.directionStates.VERTICAL, false)}>⮝</div>
	<div class="resizer-create resizer-vertical-create1 resizer-vertical-create" on:click={ev => createViewNode(Types.directionStates.HORIZONTAL, false)}>⮜</div>
	<div class="resizer-create resizer-vertical-create0 resizer-vertical-create" on:click={ev => createViewNode(Types.directionStates.HORIZONTAL, true)}>⮞</div>
	<div class="resizer-create resizer-horizontal-create0 resizer-horizontal-create" on:click={ev => createViewNode(Types.directionStates.VERTICAL, true)}>⮟</div>
	<ViewNode id={[0]} {...viewNodes}></ViewNode>

	{#if showDisplayMenu !== undefined}
		<ContextMenu x={showDisplayMenu[0]} y={showDisplayMenu[1]}></ContextMenu>
	{/if}
</div>


<style>

.resizer-view-create {
	position: relative;
	height: 100vh;
	align-items: stretch;
}

.resizer-create {
	position: absolute;
	background-color: gray;
	opacity: 0;
	transition: opacity 0.4s;
	color: white;
	text-align: center;
}

.resizer-create:hover {
	opacity: 1;
}

.resizer-horizontal-create {
	width: 100%;
	height: 17px;
	line-height: 15px;
}

.resizer-horizontal-create0 {
	top: 0;
}

.resizer-horizontal-create1 {
	bottom: 0;
}

.resizer-vertical-create {
	height: 100%;
	line-height: 100vh;
	width: 17px;
}

.resizer-vertical-create0 {
	left: 0;
}

.resizer-vertical-create1 {
	right: 0;
}
</style>
