<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
	<defs>
		<pattern id="smallGrid" width="16" height="16" patternUnits="userSpaceOnUse">
			<path d="M 16 0 L 0 0 0 16" fill="none" style="stroke: var(--color-theme-1)" stroke-width="1"/>
		</pattern>
		<pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
			<rect width="80" height="80" fill="url(#smallGrid)"/>
			<path d="M 80 0 L 0 0 0 80" fill="none" style="stroke: var(--color-theme-1)" stroke-width="2"/>
		</pattern>
	</defs>
			
	<rect width="100%" height="100%" style="fill: var(--color-bg-0)" />
	<rect width="100%" height="100%" fill="url(#grid)"/>

	<slot/>
</svg>


