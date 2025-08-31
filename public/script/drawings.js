function toggleMenuCheckbox() {
    let checkbox = document.getElementById('logicMenu');
    checkbox.checked = !checkbox.checked;
}

function gamma(z) {
    // Aproximação de Lanczos para Gamma
    const g = 7;
    const p = [0.9999999999998099, 676.5203681218851, -1259.1392167224028, 771.3234287776531, -176.6150291621406, 12.507343278686905, -0.13857109526572012, 9.984369578019572e-6, 1.5056327351493116e-7];
    if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
    z -= 1;
    let x = p[0];
    for (let i = 1; i < g + 2; i++) {
        x += p[i] / (z + i);
    }
    const t = z + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

function generateNormalDistributionData({ mean = 0, stdDev = 1, points = 300 }) {
    const dataPoints = [];
    if (stdDev <= 0) stdDev = 1;
    const range = 3.5 * stdDev;
    const step = (range * 2) / points;
    for (let i = -range; i <= range; i += step) {
        const x = mean + i;
        const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
        dataPoints.push({ x, y });
    }
    return dataPoints;
}

function generateChiSquaredData({ k = 1, points = 300 }) {
    const dataPoints = [];
    if (k < 1) k = 1;
    const maxX = Math.max(20, k + 4 * Math.sqrt(2 * k));
    const step = maxX / points;
    for (let x = step; x <= maxX; x += step) {
        if (x > 0) {
            const y = (Math.pow(x, (k / 2) - 1) * Math.exp(-x / 2)) / (Math.pow(2, k / 2) * gamma(k / 2));
            dataPoints.push({ x, y });
        }
    }
    return dataPoints;
}

function generateFDistributionData({ d1 = 1, d2 = 1, points = 300 }) {
    const dataPoints = [];
    if (d1 <= 0) d1 = 1;
    if (d2 <= 0) d2 = 1;
    let maxX;
    if (d2 > 4) {
        maxX = Math.max(5, 3 * (d2 / (d2 - 2)));
    } else {
        maxX = 10;
    }
    const step = maxX / points;
    const constTerm1 = gamma((d1 + d2) / 2) * Math.pow(d1 / d2, d1 / 2);
    const constTerm2 = gamma(d1 / 2) * gamma(d2 / 2);
    for (let x = step; x <= maxX; x += step) {
        if (x > 0) {
            const numerator = constTerm1 * Math.pow(x, (d1 / 2) - 1);
            const denominator = constTerm2 * Math.pow(1 + (d1 / d2) * x, (d1 + d2) / 2);
            const y = numerator / denominator;
            dataPoints.push({ x, y });
        }
    }
    return dataPoints;
}

function generateBetaDistributionData({ alpha = 2, beta = 3, points = 300 }) {
    const dataPoints = [];
    if (alpha <= 0) alpha = 1;
    if (beta <= 0) beta = 1;

    // Use a aproximação de Lanczos para a função Gamma
    const betaFunction = (a, b) => (gamma(a) * gamma(b)) / gamma(a + b);
    const B_ab = betaFunction(alpha, beta);

    const step = 1 / points;
    for (let x = 0; x <= 1; x += step) {
        const y = (Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1)) / B_ab;
        dataPoints.push({ x, y });
    }
    return dataPoints;
}

function generateGammaDistributionData({ k = 3, theta = 2, points = 300 }) {
    const dataPoints = [];
    if (k <= 0) k = 1;
    if (theta <= 0) theta = 1;

    const maxX = k * theta + 4 * Math.sqrt(k * theta * theta);
    const step = maxX / points;

    for (let x = 0; x <= maxX; x += step) {
        const y = (Math.pow(x, k - 1) * Math.exp(-x / theta)) / (Math.pow(theta, k) * gamma(k));
        dataPoints.push({ x, y });
    }
    return dataPoints;
}

function generateExpDistributionData({ rate = 1, points = 300 }) {
    const dataPoints = [];
    if (rate <= 0) rate = 1;
    const maxX = 5 / rate;
    const step = maxX / points;
    for (let x = 0; x <= maxX; x += step) {
        const y = rate * Math.exp(-rate * x);
        dataPoints.push({ x, y });
    }
    return dataPoints;
}

function generateUnifDistributionData({ a = 0, b = 1, points = 300 }) {
    const dataPoints = [];
    if (a >= b) b = a + 1;
    const y = 1 / (b - a);
    
    dataPoints.push({ x: a, y: y });
    dataPoints.push({ x: b, y: y });

    const step = (b - a) / points;
    for (let x = a + step; x < b; x += step) {
        dataPoints.push({ x, y });
    }

    return dataPoints;
}


// ----------------------------------------------------------------------------------------

let myDistChart;
let chartState = {
    type: "Normal",
    p1: 0,
    p2: 1,
    precision: 300
};

function updateChart() {
    let dataPoints;
    if (chartState.type === "Normal") {
        dataPoints = generateNormalDistributionData({ mean: chartState.p1, stdDev: chartState.p2, points: chartState.precision });
    } else if (chartState.type === "Chi") {
        dataPoints = generateChiSquaredData({ k: chartState.p1, points: chartState.precision });
    } else if (chartState.type === "F") {
        dataPoints = generateFDistributionData({ d1: chartState.p1, d2: chartState.p2, points: chartState.precision });
    } else if (chartState.type === "Beta") {
        dataPoints = generateBetaDistributionData({ alpha: chartState.p1, beta: chartState.p2, points: chartState.precision });
    } else if (chartState.type === "Gamma") {
        dataPoints = generateGammaDistributionData({ k: chartState.p1, theta: chartState.p2, points: chartState.precision });
    } else if (chartState.type === "Exp") {
        dataPoints = generateExpDistributionData({ rate: chartState.p1, points: chartState.precision });
    } else if (chartState.type === "Unif") {
        dataPoints = generateUnifDistributionData({ a: chartState.p1, b: chartState.p2, points: chartState.precision });
    }

    if (!myDistChart || !dataPoints) return;

    myDistChart.data.datasets[0].data = dataPoints;
    myDistChart.options.scales.x.title.text = "Valor";
    myDistChart.update();
}

function initChart() {
    const ctx = document.getElementById("distributionChart").getContext("2d");
    myDistChart = new Chart(ctx, {
        type: "line",
        data: {
            datasets: [{
                label: "Densidade de Probabilidade",
                borderColor: "#f58442",
                backgroundColor: "rgba(245, 182, 66, 0.2)",
                borderWidth: 2,
                fill: true,
                pointRadius: 0.1,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: "linear",
                    position: "bottom",
                    title: { display: true, text: "Valor" }
                },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: "Densidade de Probabilidade" }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function updateControlsVisibility(type) {
    const param1Label = document.getElementById("param1Label");
    const param2Label = document.getElementById("param2Label");
    const param1Container = document.getElementById("param1Container");
    const param2Container = document.getElementById("param2Container");

    if (type === "Normal") {
        param1Label.textContent = "Valor Esperado (μ):";
        param2Label.textContent = "Desvio Padrão (σ):";
        param2Container.style.display = "flex";
    } else if (type === "Chi") {
        param1Label.textContent = "Graus de Liberdade (k):";
        param2Container.style.display = "none";
    } else if (type === "F") {
        param1Label.textContent = "Graus de Liberdade 1 (d1):";
        param2Label.textContent = "Graus de Liberdade 2 (d2):";
        param2Container.style.display = "flex";
    } else if (type === "Beta") {
        param1Label.textContent = "Parâmetro Alfa (α):";
        param2Label.textContent = "Parâmetro Beta (β):";
        param2Container.style.display = "flex";
    } else if (type === "Gamma") {
        param1Label.textContent = "Parâmetro de Forma (k):";
        param2Label.textContent = "Parâmetro de Escala (θ):";
        param2Container.style.display = "flex";
    } else if (type === "Exp") {
        param1Label.textContent = "Taxa (λ):";
        param2Container.style.display = "none";
    } else if (type === "Unif") {
        param1Label.textContent = "Extremo 1 (a):";
        param2Label.textContent = "Extremo 2 (b):";
        param2Container.style.display = "flex";
    }
}

function showNormalDist(mean = 0, stdDev = 1) {
    chartState.type = "Normal";
    chartState.p1 = mean;
    chartState.p2 = stdDev;
    updateControlsVisibility("Normal");
    updateChart(); 

    document.getElementById("param1Input").value = mean;
    document.getElementById("param1Slider").value = mean;
    document.getElementById("param2Input").value = stdDev;
    document.getElementById("param2Slider").value = stdDev;
    
    document.getElementById("info1").textContent = "Distribuição Normal";
    document.getElementById("info2").textContent = "A Distribuição Normal é a mais importante e mais usada distribuição de probabilidade, tendo seus parâmetros como sua média e desvio padrão. Veja que visualmente, normais distintas são análogas a menos de uma distorção de eixos ou translação da média. Digite um número grande na caixa numérica para aumentar o intervalo do slider.";
    
    document.getElementById("param1Input").focus();
    document.getElementById("param1Input").blur();
    document.getElementById("param2Input").focus();
    document.getElementById("param2Input").blur();
    
}

function showChiSquaredDist(k = 5) {
    chartState.type = "Chi";
    chartState.p1 = k;
    updateControlsVisibility("Chi");
    updateChart(); 

    document.getElementById("param1Input").value = k;
    document.getElementById("param1Slider").value = k;
    
    document.getElementById("info1").textContent = "Distribuição Qui-Quadrado";
    document.getElementById("info2").textContent = "A Distribuição Qui-Quadrado representa a soma dos quadrados de k variáives normais padrão independentes. Tem como parâmetro k: o número de normais independentes, que também é seu número de graus de liberdade.";

    document.getElementById("param1Input").focus();
    document.getElementById("param1Input").blur();
    document.getElementById("param2Input").focus();
    document.getElementById("param2Input").blur();
}

function showFDist(d1 = 5, d2 = 2) {
    chartState.type = "F";
    chartState.p1 = d1;
    chartState.p2 = d2;
    updateControlsVisibility("F");
    updateChart();

    document.getElementById("param1Input").value = d1;
    document.getElementById("param1Slider").value = d1;
    document.getElementById("param2Input").value = d2;
    document.getElementById("param2Slider").value = d2;
    
    document.getElementById("info1").textContent = "Distribuição F";
    document.getElementById("info2").textContent = "A Distribuição F é uma distribuição muito usada para comparar variâncias entre grupos, sendo útil em contextos como Machine Learning. Seus parâmetros são os dois números de graus de liberdade dos dois grupos: d1 e d2.";
    
    document.getElementById("param1Input").focus();
    document.getElementById("param1Input").blur();
    document.getElementById("param2Input").focus();
    document.getElementById("param2Input").blur();
}

function showBetaDist(alpha = 2, beta = 3) {
    chartState.type = "Beta";
    chartState.p1 = alpha;
    chartState.p2 = beta;
    updateControlsVisibility("Beta");
    updateChart(); 

    document.getElementById("param1Input").value = alpha;
    document.getElementById("param1Slider").value = alpha;
    document.getElementById("param2Input").value = beta;
    document.getElementById("param2Slider").value = beta;
    
    document.getElementById("info1").textContent = "Distribuição Beta";
    document.getElementById("info2").textContent = "A Distribuição Beta modela probabilidades e proporções. Seus parâmetros são alfa (α) e beta (β), e quando inteiros, representam eventos: Dentre as tentativas de um evento ocorrer, houveram α sucessos e β falhas. Ela associa a cada x de 0 até 1 uma densidade de probabilidade de x ser a proporção de sucessos de uma nova amostragem. Essa interpretação vem da distribuição beta ser a priori conjugada da distribuição binomial.";
    
    document.getElementById("param1Input").focus();
    document.getElementById("param1Input").blur();
    document.getElementById("param2Input").focus();
    document.getElementById("param2Input").blur();
}

function showGammaDist(k = 3, theta = 2) {
    chartState.type = "Gamma";
    chartState.p1 = k;
    chartState.p2 = theta;
    updateControlsVisibility("Gamma");
    updateChart(); 

    document.getElementById("param1Input").value = k;
    document.getElementById("param1Slider").value = k;
    document.getElementById("param2Input").value = theta;
    document.getElementById("param2Slider").value = theta;
    
    document.getElementById("info1").textContent = "Distribuição Gama";
    document.getElementById("info2").textContent = "A Distribuição Gama é uma distribuição versátil, usada para modelar o tempo entre eventos. Seus parâmetros são a forma (k) e a escala (θ), que permitem que a distribuição se adapte a diferentes tipos de dados de contagem e tempos de espera. Para o caso discreto de θ, k é a taxa que de ocorrência de eventos, enquanto α representa o número de eventos que devem tentar acontecer para um evento de fato ter sucesso.";
    
    document.getElementById("param1Input").focus();
    document.getElementById("param1Input").blur();
    document.getElementById("param2Input").focus();
    document.getElementById("param2Input").blur();
}

function showExpDist(rate = 1) {
    chartState.type = "Exp";
    chartState.p1 = rate;
    chartState.p2 = null;
    updateControlsVisibility("Exp");
    updateChart(); 

    document.getElementById("param1Input").value = rate;
    document.getElementById("param1Slider").value = rate;
    
    document.getElementById("info1").textContent = "Distribuição Exponencial";
    document.getElementById("info2").textContent = "A Distribuição Exponencial modela o tempo entre eventos sucessivos em um processo contínuo e aleatório. Ela é caracterizada por um único parâmetro, a taxa (λ). Imagine que eventos ocorrem a uma taxa de λ por unidade de tempo. Queremos saber qual a densidade da probabilidade do próximo evento ocorrer depois de x unidades de tempo, e isso é modelado por essa função de densidade de probabilidade. Digite um número grande na caixa numérica para aumentar o intervalo do slider.";

    document.getElementById("param1Input").focus();
    document.getElementById("param1Input").blur();
}

function showUnifDist(a = 0, b = 1) {
    chartState.type = "Unif";
    chartState.p1 = a;
    chartState.p2 = b;
    updateControlsVisibility("Unif");
    updateChart();

    document.getElementById("param1Input").value = a;
    document.getElementById("param1Slider").value = a;
    document.getElementById("param2Input").value = b;
    document.getElementById("param2Slider").value = b;
    
    document.getElementById("info1").textContent = "Distribuição Uniforme";
    document.getElementById("info2").textContent = "A Distribuição Uniforme, a mais simples de todas, descreve uma situação onde todos os resultados em um determinado intervalo são igualmente prováveis. Sua densidade de probabilidade é constante, resultando em um gráfico de linha horizontal. Seus parâmetros são os extremos do intervalo: a e b. Digite um número grande na caixa numérica para aumentar o intervalo do slider.";
    
    document.getElementById("param1Input").focus();
    document.getElementById("param1Input").blur();
    document.getElementById("param2Input").focus();
    document.getElementById("param2Input").blur();
}

document.addEventListener("DOMContentLoaded", function () {
    function setupAdvancedInputSync1(inputId, sliderId, stateKey) {
        const input = document.getElementById(inputId);
        const slider = document.getElementById(sliderId);

		input.addEventListener('input', function() {
			let value = String(this.value);
            value = value.replace(/,/g, '.');
            if (value !== '-') {
                value = value.replace(/[^\d.-]/g, '');
		
                if (value.lastIndexOf('-') > 0) value = '-' + value.replace(/-/g, '');
                const parts = value.split('.');
                if (parts.length > 2) value = parts[0] + '.' + parts.slice(1).join('');
            }
            this.value = value;
			let numericValue = parseFloat(value);

			if(!isNaN(numericValue)){
				switch (chartState.type) {
					case "Chi": {
						if (numericValue < 1) {
							numericValue = 1;
							this.value = numericValue;
						}
						if (numericValue > 100) {
							numericValue = 100;
							this.value = numericValue;
						}
						updateChart();
						break;
					}
					case "F": {
						if (numericValue < 1) {
							numericValue = 1;
							this.value = numericValue;
						}
						if (numericValue > 100) {
							numericValue = 100;
							this.value = numericValue;
						}
						updateChart();
						break;
					}
					case "Beta": {
						if (numericValue <= 0) {
							numericValue = 0.0001;
							this.value = numericValue;
						}
						if (numericValue > 70) {
							numericValue = 70;
							this.value = numericValue;
						}
						updateChart();
						break;
					}
					case "Gamma": {
						if (numericValue <= 0) {
							numericValue = 0.0001;
							this.value = numericValue;
						}
						if (numericValue > 70) {
							numericValue = 70;
							this.value = numericValue;
						}
						updateChart();
						break;
					}
					case "Exp": {
						if (numericValue <= 0) {
							numericValue = 0.0001;
							this.value = numericValue;
						}
						if (numericValue > 100000) {
							numericValue = 100000;
							this.value = numericValue;
						}
						updateChart();
						break;
					}
					case "Unif": {
						if (numericValue < -1000000) {
							numericValue = -1000000;
							this.value = numericValue;
						}
						if (numericValue > 1000000) {
							numericValue = 1000000;
							this.value = numericValue;
						}
						updateChart();
						break;
					}
					default : {
						if (numericValue > 1000000) {
							numericValue = 1000000;
							this.value = numericValue;
						}
						if (numericValue < -1000000) {
							numericValue = -1000000;
							this.value = numericValue;
						}
						updateChart();
						break;
					}
				};
			}
		});

		input.addEventListener('blur', function() {
			let value = this.value;
            if (value === '-') { value = '-1'; }
            if (value.endsWith('.')) { value = value.slice(0, -1); }
            if (value.startsWith('.')) { value = '0' + value; }
            if (value === '-.') { value = '-0.'; }
            this.value = value;

            let numericValue = parseFloat(value);
			if (!isNaN(numericValue)) {
				switch (chartState.type) {
					case "Chi": {
						if(numericValue < 1){
							numericValue = 1;
						}
						if(numericValue > 100){
							numericValue = 100;
						}
						input.min = 1; input.max = 100;
						slider.min = 1; slider.max = 100;

						slider.value = numericValue;
						this.value = numericValue;
						chartState[stateKey] = numericValue;
						updateChart();
						break;
					}
					case "F": {
						if(numericValue < 1){
							numericValue = 1;
						}
						if(numericValue > 100){
							numericValue = 100;
						}
						input.min = 1; input.max = 100;
						slider.min = 1; slider.max = 100;

						slider.value = numericValue;
						this.value = numericValue;
						chartState[stateKey] = numericValue;
						updateChart();
						break;
					}
					case "Beta": {
						if (numericValue <= 0) {
							numericValue = 0.0001;
						}
						if (numericValue > 70) {
							numericValue = 70;
						}
						input.min = 0.0001; input.max = 70;
						slider.min = 0.0001; slider.max = 70;

						slider.value = numericValue;
						this.value = numericValue;
						chartState[stateKey] = numericValue;
						updateChart();
						break;
					}
					case "Gamma": {
						if (numericValue <= 0) {
							numericValue = 0.0001;
						}
						if (numericValue > 70) {
							numericValue = 70;
						}
						input.min = 0.0001; input.max = 70;
						slider.min = 0.0001; slider.max = 70;

						slider.value = numericValue;
						this.value = numericValue;
						chartState[stateKey] = numericValue;
						updateChart();
						break;
					}
					case "Exp": {
						if (numericValue <= 0) {
							numericValue = 0.0001;
						}
						if (numericValue > 100000) {
							numericValue = 100000;
						}
						input.min = 0.0001; input.max = Math.max(Math.min(100000,2*numericValue),1);
						slider.min = 0.0001; slider.max = Math.max(Math.min(100000,2*numericValue),1);

						slider.value = numericValue;
						this.value = numericValue;
						chartState[stateKey] = numericValue;
						updateChart();
						break;
					}
					case "Unif": {
						if (numericValue < -1000000) {
							numericValue = -1000000;
							this.value = numericValue;
						}
						if(numericValue == document.getElementById('param2Input').value){
							numericValue += 0.001
						}
						if (numericValue > 1000000) {
							numericValue = 1000000;
							this.value = numericValue;
						}
						if(numericValue == document.getElementById('param2Input').value){
							numericValue += 0.001
						}

						const absValue = Math.abs(numericValue);
						if (numericValue === 0) {
                            slider.min = 0; slider.max = 1;
                        } else {
							slider.min = Math.max(-1000000,-2*absValue); slider.max = Math.min(1000000,2*absValue);
						}
						slider.value = numericValue;
						this.value = numericValue;
						chartState[stateKey] = numericValue;
						updateChart();
						break;
					}
					default : {
						if(numericValue < -1000000){
							numericValue = -1000000;
						}
						if(numericValue > 1000000){
							numericValue = 1000000;
						}
						const absValue = Math.abs(numericValue);
						if (numericValue === 0) {
                            slider.min = -20; slider.max = 20;
                        } else {
							slider.min = Math.max(-1000000,-2*absValue); slider.max = Math.min(1000000,2*absValue);
						}
						
						slider.value = numericValue;
						this.value = numericValue;
						chartState[stateKey] = numericValue;
						updateChart();
						break;
					}
				};
			}
		});

		input.addEventListener('keydown', function(event) {
			if (event.key === 'Enter') {
				this.blur();
			}
		});

        slider.addEventListener('input', function() {
            const value = parseFloat(this.value);
            input.value = value.isInteger ? value : value.toFixed(3);
            chartState[stateKey] = value;
            updateChart();
        });
	}

	function setupAdvancedInputSync2(inputId, sliderId, stateKey) {
        const input = document.getElementById(inputId);
        const slider = document.getElementById(sliderId);

		input.addEventListener('input', function() {
			let value = this.value;
            value = value.replace(/,/g, '.');
            if (value !== '-') {
                value = value.replace(/[^\d.-]/g, '');
		
                if (value.lastIndexOf('-') > 0) value = '-' + value.replace(/-/g, '');
                const parts = value.split('.');
                if (parts.length > 2) value = parts[0] + '.' + parts.slice(1).join('');
            }
            this.value = value;
			let numericValue = parseFloat(value);

			if(!isNaN(numericValue)){
				switch (chartState.type) {
					case "Chi": {
						break;
					}
					case "F": {
						if (numericValue < 1) {
							numericValue = 1;
							this.value = numericValue;
						}
						if (numericValue > 100) {
							numericValue = 100;
							this.value = numericValue;
						}
						updateChart();
						break;
					}
					case "Beta": {
						if (numericValue <= 0) {
							numericValue = 0.0001;
							this.value = numericValue;
						}
						if (numericValue > 70){
							numericValue = 70;
							this.value = numericValue;
						}
						updateChart();
						break;
					}
					case "Gamma": {
						if (numericValue <= 0) {
							numericValue = 0.0001;
							this.value = numericValue;
						}
						if (numericValue > 70) {
							numericValue = 70;
							this.value = numericValue;
						}
						updateChart();
						break;
					}
					case "Exp": {
						break;
					}
					case "Unif": {
						if (numericValue < -1000000) {
							numericValue = -1000000;
							this.value = numericValue;
						}
						if (numericValue > 1000000) {
							numericValue = 1000000;
							this.value = numericValue;
						}
						updateChart();
						break;
					}
					default : {
						if (numericValue > 1000000) {
							numericValue = 1000000;
							this.value = numericValue;
						}
						if (numericValue <= 0) {
							numericValue = 0.0001;
							this.value = numericValue;
						}
						updateChart();
						break;
					}
				};
			}
		});

		input.addEventListener('blur', function() {
			let value = this.value;
            if (value === '-') { value = '-1'; }
            if (value.endsWith('.')) { value = value.slice(0, -1); }
            if (value.startsWith('.')) { value = '0' + value; }
            if (value === '-.') { value = '-0.'; }
            this.value = value;

            let numericValue = parseFloat(value);
			if (!isNaN(numericValue)) {
				switch (chartState.type) {
					case "Chi": {
						break;
					}
					case "F": {
						if(numericValue < 1){
							numericValue = 1;
						}
						if(numericValue > 100){
							numericValue = 100;
						}
						input.min = 1; input.max = 100;
						slider.min = 1; slider.max = 100;

						slider.value = numericValue;
						this.value = numericValue;
						chartState[stateKey] = numericValue;
						updateChart();
						break;
					}
					case "Beta": {
						if (numericValue <= 0) {
							numericValue = 0.0001;
						}
						if (numericValue > 70) {
							numericValue = 70;
						}
						input.min = 0.0001; input.max = 70;
						slider.min = 0.0001; slider.max = 70;

						slider.value = numericValue;
						this.value = numericValue;
						chartState[stateKey] = numericValue;
						updateChart();
						break;
					}
					case "Gamma": {
						if (numericValue <= 0) {
							numericValue = 0.0001;
						}
						if (numericValue > 70) {
							numericValue = 70;
						}
						input.min = 0.0001; input.max = 70;
						slider.min = 0.0001; slider.max = 70;

						slider.value = numericValue;
						this.value = numericValue;
						chartState[stateKey] = numericValue;
						updateChart();
						break;
					}
					case "Exp": {
						break;
					}
					case "Unif": {
						if (numericValue < -1000000) {
							numericValue = -1000000;
						}
						if(numericValue == document.getElementById('param1Input').value){
							numericValue += 0.001
						}
						if (numericValue > 1000000) {
							numericValue = 1000000;
						}
						if(numericValue == document.getElementById('param1Input').value){
							numericValue -= 0.001
						}
						const absValue = Math.abs(numericValue);
						if (numericValue === 0) {
                            slider.min = 0; slider.max = 1;
                        } else {
							slider.min = Math.max(-1000000,-2*absValue); slider.max = Math.min(1000000,2*absValue);
						}
						slider.value = numericValue;
						this.value = numericValue;
						chartState[stateKey] = numericValue;
						updateChart();
						break;
					}
					default : {
						if(numericValue <= 0){
							numericValue = 0.0001;
						}
						if(numericValue > 1000000){
							numericValue = 1000000;
						}
						const absValue = Math.abs(numericValue);
						if (numericValue === 0) {
                            slider.min = 0.0001; slider.max = 20;
                        } else {
							slider.min = 0.0001; slider.max = Math.min(1000000,2*absValue);
						}
						
						slider.value = numericValue;
						this.value = numericValue;
						chartState[stateKey] = numericValue;
						updateChart();
						break;
					}
				};
			}
		});

		input.addEventListener('keydown', function(event) {
			if (event.key === 'Enter') {
				this.blur();
			}
		});

        slider.addEventListener('input', function() {
            const value = parseFloat(this.value);
            input.value = value.isInteger ? value : value.toFixed(3);
            chartState[stateKey] = value;
            updateChart();
        });
	}

	function setupAdvancedInputSyncP(inputId, sliderId, stateKey) {
        const input = document.getElementById(inputId);
        const slider = document.getElementById(sliderId);

		input.addEventListener('input', function() {
			let value = this.value;
            value = value.replace(/\D/g, '');
            
            this.value = value;
			slider.value = value;
			let numericValue = parseFloat(value);

			if(numericValue < 2){
				numericValue = 2;
				this.value = numericValue;
			} else if(numericValue > 1000){
				numericValue = 1000;
				this.value = numericValue;
			}
		});

		input.addEventListener('blur', function() {
			let value = this.value;
            value = value.replace(/\D/g, '');
            
            this.value = value;
			slider.value = value;
			let numericValue = parseFloat(value);

			if(numericValue < 2){
				numericValue = 2;
				this.value = numericValue;
			} else if(numericValue > 1000){
				numericValue = 1000;
				this.value = numericValue;
			}
		});

		input.addEventListener('keydown', function(event) {
			if (event.key === 'Enter') {
				this.blur();
			}
		});

        slider.addEventListener('input', function() {
            const value = parseFloat(this.value);
            input.value = value.isInteger ? value : value.toFixed(3);
            chartState[stateKey] = value;
            updateChart();
        });
	}

    const param1InputId = "param1Input", param1SliderId = "param1Slider";
    const param2InputId = "param2Input", param2SliderId = "param2Slider";
    const precisionInputId = "precisionInput", precisionSliderId = "precisionSlider";

    initChart();

    setupAdvancedInputSync1(param1InputId, param1SliderId, 'p1');
    setupAdvancedInputSync2(param2InputId, param2SliderId, 'p2');
    setupAdvancedInputSyncP(precisionInputId, precisionSliderId, 'precision');

    showNormalDist(0, 1);
});