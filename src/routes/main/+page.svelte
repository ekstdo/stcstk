<script>
// @ts-ignore
import * as Types from "./types.js"
import SvgView from "./SvgView.svelte";
import ViewNode from "./ViewNode.svelte";
	import DfaView from "./DfaView.svelte";

/**
 * current viewnodes, that should be displayed
 * @prop {any} component main view to be displayed
 * @prop {[]any} children main view to be displayed
 * @prop {any} data - data to be displayed
 */
let viewNodes = {
	component: DfaView,
	data: {model: "dfa-1"},
	children: [],
	direction: Types.directionStates.HORIZONTAL
};

/**
 * splits a viewnode or appends a new one to the list 
 * @param {Types.directionStates } direction  direction it should be added to
 * @param {boolean } isStart tells, if the node to be added should be at the start of the list
 *
 */
// @ts-ignore
function createViewNode(direction, isStart) {
	if (direction != viewNodes.direction) {
		viewNodes = {
			// @ts-ignore
			component: undefined,
			data: {},
			// @ts-ignore
			children: [viewNodes],
			direction
		}
	}

	if (isStart){
		viewNodes.children.unshift()
	}

}
</script>

<div class="resizer-view-create">
	<div class="resizer-create resizer-horizontal-create1 resizer-horizontal-create">⮝</div>
	<div class="resizer-create resizer-vertical-create1 resizer-vertical-create">⮜</div>
	<div class="resizer-create resizer-vertical-create0 resizer-vertical-create">⮞</div>
	<div class="resizer-create resizer-horizontal-create0 resizer-horizontal-create">⮟</div>
	<ViewNode {...viewNodes}></ViewNode>
</div>


<style>

.resizer-view-create {
	position: relative;
	height: 100vh;
	display: flex;
	align-items: stretch;
	overflow-y: hidden;
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
	height: 15px;
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
	width: 15px;
}

.resizer-vertical-create0 {
	left: 0;
}

.resizer-vertical-create1 {
	right: 0;
}
</style>
