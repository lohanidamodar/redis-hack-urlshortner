<div>
    <span class="loader" />
</div>

<style>
    div {
        height: 100vh;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
		background-color: #0009;
    }
	.loader {
		box-sizing: border-box;
		width: 40px;
		height: 20px;
        color: #fff;
		--c: radial-gradient(farthest-side, currentColor 93%, #fff0);
		background: var(--c) 0 0, var(--c) 50% 0;
		background-size: 8px 8px;
		background-repeat: no-repeat;
		position: relative;
		clip-path: inset(-200% -100% 0 0);
		animation: db6-0 1.5s linear infinite;
	}
	.loader:before {
		content: '';
		position: absolute;
		width: 8px;
		height: 12px;
		background: currentColor;
		left: -16px;
		top: 0;
		animation: db6-1 1.5s linear infinite, db6-2 0.5s cubic-bezier(0, 200, 0.8, 200) infinite;
	}
	.loader:after {
		content: '';
		position: absolute;
		inset: 0 0 auto auto;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: currentColor;
		animation: db6-3 1.5s linear infinite;
	}

	@keyframes db6-0 {
		0%,
		30% {
			background-position: 0 0, 50% 0;
		}
		33% {
			background-position: 0 100%, 50% 0;
		}
		41%,
		63% {
			background-position: 0 0, 50% 0;
		}
		66% {
			background-position: 0 0, 50% 100%;
		}
		74%,
		100% {
			background-position: 0 0, 50% 0;
		}
	}

	@keyframes db6-1 {
		90% {
			transform: translateY(0);
		}
		95% {
			transform: translateY(15px);
		}
		100% {
			transform: translateY(15px);
			left: calc(100% - 8px);
		}
	}

	@keyframes db6-2 {
		100% {
			top: -0.1px;
		}
	}

	@keyframes db6-3 {
		0%,
		80%,
		100% {
			transform: translate(0);
		}
		90% {
			transform: translate(26px);
		}
	}
</style>
