// ==UserScript==
// @name         Clicar nos ícones de Check (Tick)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Clica nos ícones de check (tick) na página
// @author       Você
// @match        https://sws.scania.com/maintenanceform/*/form
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Função para clicar nos ícones
    function clickIcons() {
        const icons = document.querySelectorAll('[autotest-id="checkBox-protocolOk"]');
        icons.forEach(function(icon) {
            icon.click();
        });
    }

    // Função para criar o botão no canto superior direito
    function createButton() {
        const button = document.createElement('button');
        button.innerText = 'Iniciar';
        button.style.position = 'fixed';
        button.style.top = '92px';
        button.style.right = '14%';
        button.style.left = '81%';
        button.style.padding = '10px';
        button.style.fontSize = '14px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';

        // Quando o botão for clicado, executa a função clickIcons
        button.addEventListener('click', function() {
            clickIcons();
        });

        // Adiciona o botão à página
        document.body.appendChild(button);
    }

    // Executa a criação do botão quando a página carregar
    window.addEventListener('load', function() {
        createButton();
    });
})();