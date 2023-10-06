<script>
/** @type {number} */
 export let x;
/** @type {number} */
export let y;
</script>


<div style={`left: ${x}px; top: ${y}px`} id="ctx-menu">

Change View to:
<hr/>

<div id="viewtype-changer" style="display: flex; font-size: 32px;">
	<i class="iconoir-curve-array"></i>
	<i class="iconoir-text"></i>
	<i class="iconoir-play"></i>
</div>

<hr/>
if you want to access the browser ctx menu, press shift and right click
</div>

<style>
hr {
	border-color: inherit;
}


#ctx-menu {
	position: absolute;
	background-color: var(--color-bg-0);
	color: var(--color-theme-1);
	width: 200px;
	border: 3px solid var(--color-theme-1);
	border-radius: 0 10px 10px 10px;
	padding: 7px;
}

#viewtype-changer > i {
	border-radius: 7px;
	transition: color 0.4s, background-color 0.4s;
	margin-right: 2px;
	cursor:pointer;
}


#viewtype-changer > i:hover {
	background-color: var(--color-theme-1);
	color: var(--color-bg-0);
}

</style>

