<script>
	import SvgView from "./SvgView.svelte";
	import { models } from "./mainstate";

	/** @type {string } */
	 export let model;

	// @ts-ignore
	$: mod = $models[model];
</script>



<SvgView>
	{#each mod.positions as pos}
		<circle cx={pos[0]} cy={pos[1]} r="30" class="usual-circle"></circle>
	{/each}
</SvgView>

<style>
.usual-circle {
	fill: #DDD;
}
</style>
