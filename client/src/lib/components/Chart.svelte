<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	export let data: any[];

	let chartValues: number[] = [];
	let chartLabels: String[] = [];
	let ctx;
	let chartCanvas: any;
	let highest = 0;
	let tickCount = 5;
	let stepSize = 1;
	for (let index = 0; index < data.length; index++) {
		const element = data[index];
		const date = new Date(element.timestamp);
		chartLabels.push(date.toUTCString());
		chartValues.push(element.value);
		if (highest < element.value) {
			highest = element.value;
		}
	}
	// ceiling of the highest value
	if (highest > 0) {
		highest = Math.ceil(highest / tickCount) * tickCount;
		stepSize = highest / tickCount;
	} else {
		highest = 5;
	}
	const createChart = () => {
		ctx = chartCanvas.getContext('2d');
		Chart.register(...registerables);
		var chart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: chartLabels,
				datasets: [
					{
						label: 'Hits',
						backgroundColor: 'rgb(255, 99, 132)',
						borderColor: 'rgb(255, 99, 132)',
						data: chartValues
					}
				]
			},
			options: {
				scales: {
					yAxes: {
						ticks: {
							beginAtZero: true,
							stepSize: stepSize
						},
						max: highest
					},
					xAxes: {
						display: false
					}
				},
				animation: {
					duration: 0
				},
				responsive: true,
				hover: {
					mode: 'nearest',
					intersect: false
				},
				plugins: {
					title: {
						display: false,
						text: 'Stats'
					},
					legend: {
						display: false
					},
					tooltip: {
						mode: 'index',
						intersect: false,
						caretPadding: 0
					}
				}
			}
		});
	};

	onMount(() => {
		createChart();
	});
</script>

<div>
	<canvas height="80" bind:this={chartCanvas} id="myChart" />
</div>

<style>
	div {
		padding: 20px;
		margin: 20px;
		max-height: 450px;
		max-width: 950px;
		width: 100%;
		box-sizing: border-box;
		overflow: hidden;
	}
</style>
