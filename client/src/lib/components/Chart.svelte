<script lang="ts">
	import { Chart, registerables } from 'chart.js';
	export let id: String;
	import { onMount } from 'svelte';

	let chartValues: number[] = [];
	let chartLabels: String[] = [];
	let ctx;
	let chartCanvas: any;
	let highest = 0;
	let tickCount = 5;
	let stepSize = 1;

	onMount(async () => {
		await getUsage();
	});

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

	const getUsage = async () => {
		let res = await fetch(
			'https://8000-lohanidamod-redishackur-9nx4sio0v2b.ws-us60.gitpod.io/urls/' + id + '/usage',
			{
				method: 'GET',
				mode: 'cors'
			}
		);
		let data = await res.json();
		if (res.status == 200) {
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
			}
			createChart();
		}
	};
</script>

<canvas height="140" bind:this={chartCanvas} id="myChart" />
