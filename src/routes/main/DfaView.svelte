<script>
	import { onMount } from "svelte";
	import SvgView from "./SvgView.svelte";
	import { models } from "./mainstate";
	import { vecAdd } from "./util";

	const circleRadius = 30;

	/** @type {string } */
	 export let model;

	// @ts-ignore
	$: mod = models[model];

	let mounted = false;

	onMount(() => {
		mounted = true;
	})

	/**
	 * @param {string | number} from
	 * @param {string | number} to
	 */
	function toPath(from, to) {
		let p1 = $mod.positions[from];

		let p2 = $mod.positions[to];
		let {x, y} = centerPoint(from, to);
		let angle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
		let s = 40;
		x += s * Math.cos(angle + Math.PI / 2);
		y += s * Math.sin(angle + Math.PI / 2);
		let tempPath = `M ${p1[0]},${p1[1]} Q ${x},${y},${p2[0]},${p2[1]}`;
		if (from == to) {
			tempPath = `M ${p1[0]},${p1[1]} c -100,100 100,100 0,0`
		}
		if (!mounted)
			return [tempPath, '']
		let svgTempPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
		svgTempPath.setAttributeNS(null, "d", tempPath);
		let len = svgTempPath.getTotalLength();
		let pos1 = svgTempPath.getPointAtLength(len - 1.75*circleRadius);
		let pos2 = svgTempPath.getPointAtLength(len - 1.75*circleRadius + 7.5);
		return [tempPath, `M ${pos1.x},${pos1.y} L ${pos2.x},${pos2.y}`]
	}

	/**
	 * @param {string | number} from
	 * @param {string | number} to
	 * @param {number} f
	 */
	function centerPoint(from, to, f = 0.5) {
		let p1 = $mod.positions[from];
		let p2 = $mod.positions[to];
		return {x: p1[0] * f + p2[0] * (1 - f), y: p1[1] * f + p2[1] * (1 - f)}
	}

	/**
	 * @param {string | number} from
	 * @param {string | number} to
	 */
	function textPosition(from, to){
		let p1 = $mod.positions[from];
		if (from == to) {
			let f = 1.3;
			let [x, y] = vecAdd(p1, [f * circleRadius, f *  circleRadius]);
			return {x, y}
		}
		let p2 = $mod.positions[to];
		let {x, y} = centerPoint(from, to, 0.7);
		let angle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
		let s = 30;
		return {x: x + s * Math.cos(angle + Math.PI / 2), y: y + s * Math.sin(angle + Math.PI / 2) }
	}



	/**
	 * @type {number[]}
	 */
	let selected = [];
	let maybeDeselect = -1;
	let pressed = false;
	let moved = false;
	/**
	 * @param {number} index
	 * @param {MouseEvent & { currentTarget: EventTarget & SVGCircleElement; }} ev
	 */
	function mousedown(index, ev){
		pressed = true;
		ev.stopPropagation();
		let selectInd = selected.indexOf(index);

		if (ev.shiftKey) {
			if (selectInd !== -1) {
				maybeDeselect = selectInd;
			} else {
				selected.push(index);
				selected = selected;
			}
		} else if (selectInd === -1) {
			selected = [index];
		} else {
			maybeDeselect = selectInd;;
		}
	};
	/**
	 * @param {any} ev
	 */
	function mousemove({ detail: ev }){
		if (!pressed) return;
		if (isNaN(ev.movementX)) return;
		moved = true;
		// @ts-ignore
		for (let i of selected) {
			$mod.positions[i][0] += ev.movementX;
			$mod.positions[i][1] += ev.movementY;
		}
	}

	/**
	 * @param {any} _ev
	 */
	function mouseup({detail: _ev}) {
		pressed = false;
		if (maybeDeselect !== -1 && !moved) {
			selected.splice(maybeDeselect, 1);
			selected = selected;
		}
		maybeDeselect = -1;
		moved = false;

	}

	/**
	 * @param {any} ev
	 */
	function globalMousedown({detail: ev}){
		if (!ev.shiftKey)
			selected = [];
	}

</script>



<SvgView on:mousemove={mousemove} on:mouseup={mouseup} on:mousedown={globalMousedown}>
	{#each $mod.getConnections() as [from, fromMap]}
		{#each fromMap as [to, toSet]}
			{@const paths = toPath(from, to)}
			<path class="transition-line" d={paths[0]}/>
			<path class="transition-line" d={paths[1]} marker-end="url(#arrowhead)"/>
			<text text-anchor="middle" class="transition-label" {...textPosition(from, to)}>{Array.from(toSet).map(x => $mod.param.alphabet[x]).join(", ")}</text>
		{/each}
	{/each}
	{#each $mod.positions as pos, index}
		<g>
			<circle cx={pos[0]} cy={pos[1]} r={circleRadius} class={"usual-circle" + (selected.includes(index)? " selected-circle" : "")} on:mouseup={mouseup} on:mousedown={ev=>mousedown(index, ev)} on:mousemove={mousemove}></circle>
			{#if index === $mod.param.start}
				<path class="transition-line" d={`M ${pos[0] - 2 * circleRadius},${pos[1]} L ${pos[0] - circleRadius - 15},${pos[1]}`} marker-end="url(#arrowhead)"/>
			{/if}
			<text x={pos[0]} y={pos[1]}  on:mouseup={mouseup} text-anchor="middle" class="usual-dfa-state-label">{$mod.param.stateLabels[index]}</text>
		</g>
	{/each}
</SvgView>

<style>
.usual-circle {
	fill: var(--color-bg-0);
	stroke: white;
	color: white;
	transition: filter 0.4s;
}

.selected-circle {
	stroke: var(--color-theme-1);
}

.usual-circle:hover {
	filter: brightness(5);
}


.usual-dfa-state-label {
	dominant-baseline: central;
	fill: white;
}

.transition-line {
	stroke: white;
	stroke-width: 2px;
	fill: none;
}

.transition-label {
	fill: white;
	dominant-baseline: central;
}
</style>
