<script>
	/** @type {string } */
	export let model;


	// @ts-ignore
	$: mod = models[model];

	let running = false;

	export let history = [];
</script>


<div id="run-icons" style="display: flex; font-size: 32px;">
	{#if running}
		<i class="iconoir-pause"></i>
	{:else}
		<i class="iconoir-play"></i>
	{/if}
	<i class="iconoir-forward"></i>
</div>
