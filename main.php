<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Distribuições</title>
    <meta name="theme-color" content="#bbbbbb" />
    
    <link rel="stylesheet" type="text/css" href="/public/css/core.css?v=1.74">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;700&family=Nova+Square&family=Prompt:wght@200;400&display=swap" rel="stylesheet">
    
    <link rel="icon" href="/public/res/icon.ico?v=1.74" type="image/x-icon">
    <link rel="shortcut icon" href="/public/res/icon.ico?v=1.74" type="image/x-icon">
    
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <nav id="header">
         <div id="headerLeft">
             <img id="logo" src="/public/res/logo.png?v=1.70" alt="Logo" onclick="window.location.assign(window.location.origin + `/`)">
         </div>
         <div id="headerMiddle">
             <p id="pageTitle">Distribuições</p>
         </div>
         <div id="headerRight">
             <input id="logicMenu" type="checkbox" placeholder="."/>
             <label id="labelMenu" for="logicMenu">
                 <div class="visualMenu" id="line1"></div>
                 <div class="visualMenu" id="line2"></div>
                 <div class="visualMenu" id="line3"></div>
             </label>
             <ul id="menuList">
                 <li class="menuElement">
                     <button class="menuButton" onclick="showNormalDist(0, 1); toggleMenuCheckbox();">Normal</button>
                 </li>
                 <li class="menuElement">
                     <button class="menuButton" onclick="showChiSquaredDist(5); toggleMenuCheckbox();">Qui-Quadrado</button>
                 </li>
                 <li class="menuElement">
                     <button class="menuButton" onclick="showFDist(5, 2); toggleMenuCheckbox();">Distribuição F</button>
                 </li>
                 <li class="menuElement">
                     <button class="menuButton" onclick="showBetaDist(2, 3); toggleMenuCheckbox();">Beta</button>
                 </li>
                 <li class="menuElement">
                     <button class="menuButton" onclick="showGammaDist(3, 2); toggleMenuCheckbox();">Gama</button>
                 </li>
                 <li class="menuElement">
                     <button class="menuButton" onclick="showExpDist(1); toggleMenuCheckbox();">Exponencial</button>
                 </li>
                 <li class="menuElement">
                     <button class="menuButton" onclick="showUnifDist(0, 1); toggleMenuCheckbox();">Uniforme</button>
                 </li>
             </ul>
         </div>
    </nav>
      
    <div id="content">
        <div class="distribution-container">
            <h2 class="distribution-title" id="info1">Distribuição Normal</h2>
            <p class="distribution-description" id="info2">
                A Distribuição Normal é a mais importante e mais usada distribuição de probabilidade, tendo seus parâmetros como sua média e desvio padrão. Veja que visualmente, normais distintas são análogas a menos de uma distorção de eixos ou translação da média.
            </p>
            
            <div class="main-content-area">

                <div class="graph-wrapper">
                    <div class="graph-container">
                        <canvas id="distributionChart"></canvas>
                    </div>
                </div>
                
                <div class="controls-container">
                    <div class="control-item" id="param1Container">
                        <div class="label-and-slider">
                            <label class="distribution-text" for="param1Input" id="param1Label">Média (μ):</label>
                            <input type="range" id="param1Slider" min="-10" max="10" step="0.001" value="0">
                        </div>
                        <input type="text" class="numeric-input" id="param1Input" size=4 min="-1000000" max="1000000" step="0.001" value="0">
                    </div>
                
                    <div class="control-item" id="param2Container">
                        <div class="label-and-slider">
                            <label class="distribution-text" for="param2Input" id="param2Label">Desvio Padrão (σ):</label>
                            <input type="range" id="param2Slider" min="0.1" max="10" step="0.001" value="1">
                        </div>
                        <input type="text" class="numeric-input" id="param2Input" size=4 min="0.001" max="50" step="0.001" value="1">
                    </div>
                
                    <div class="control-item" id="precisionContainer">
                        <div class="label-and-slider">
                            <label class="distribution-text" for="precisionInput">Quantidade dos Dados:</label>
                            <input type="range" id="precisionSlider" min="2" max="1000" step="1" value="200">
                        </div>
                        <input type="text" class="numeric-input" id="precisionInput" size=4 min="2" max="1000" step="1" value="200">
                    </div>
                </div>

            </div>
        </div>
    </div>

    <footer id="footer">
        <p class="footerText">Distribuições de Estatística.</p>
        <p class="footerText">Contato: vitordenoyr@gmail.com</p>
    </footer>

    <script src="/public/script/drawings.js?v=1.74"></script>
</body>
</html>