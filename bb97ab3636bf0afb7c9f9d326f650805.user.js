// ==UserScript==
// @name         Scania SWS
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Preenchimento de planilhas e checklist do Scania SWS.
// @author       @11
// @match        https://sws.scania.com/maintenanceform/*/form
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function clickIcons() {
        const icons = document.querySelectorAll('[autotest-id="checkBox-protocolOk"]');
        icons.forEach(function(icon) {
            if (icon.tagName.toLowerCase() === 'input' && icon.type === 'checkbox') {
                if (!icon.checked) {
                    icon.click();
                }
            } else {
                icon.click();
            }
        });
    }

    function createButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'tm-button-container';
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.bottom = '5%';
        buttonContainer.style.right = '5%';
        buttonContainer.style.zIndex = '1000';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'row';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.maxWidth = '300px';
        buttonContainer.style.width = '80%';
        buttonContainer.style.padding = '10px';
        buttonContainer.style.boxSizing = 'border-box';

        const buttonInferior = createButton("inferior", "#333", "❌");
        const buttonModerado = createButton("moderado", "#333", "⚠️");
        const buttonSuperior = createButton("superior", "#333", "✅");

        buttonContainer.appendChild(buttonInferior);
        buttonContainer.appendChild(buttonModerado);
        buttonContainer.appendChild(buttonSuperior);

        document.body.appendChild(buttonContainer);
    }

    function createButton(value, bgColor, icon) {
        const button = document.createElement('button');
        button.innerHTML = icon;

        button.style.flex = '1';
        button.style.padding = '10px';
        button.style.fontSize = '15px';
        button.style.backgroundColor = bgColor;
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.margin = '0 5px';
        button.style.textAlign = 'center';

        button.addEventListener('click', function() {
            fillFieldsBasedOnButton(value);
            setTimeout(clickIcons, 1000);
        });

        return button;
    }

    function fillBrakeThickness(appInput, valueLeft, valueRight) {
        const inputs = appInput.querySelectorAll('input.text-field-input');

        if (inputs.length === 2) {
            inputs[0].value = valueLeft;
            inputs[1].value = valueRight;

            inputs.forEach(input => {
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            });
        } else {
            console.warn("Número de inputs não esperado para a espessura da lona de freio.");
        }
    }

    function fillTireTreadDepth(appInput, valueLeft, valueRight) {
        const inputs = appInput.querySelectorAll('input.text-field-input');

        if (inputs.length === 2) {
            inputs[0].value = valueLeft;
            inputs[1].value = valueRight;

            inputs.forEach(input => {
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            });
        } else {
            console.warn("Número de inputs não esperado para a profundidade da banda de rodagem do pneu.");
        }
    }

    function fillFreezingPoint(appInput, value) {
        const inputs = appInput.querySelectorAll('input.text-field-input');

        if (inputs.length === 1) {
            inputs[0].value = value;

            inputs.forEach(input => {
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            });
        } else {
            console.warn("Número de inputs não esperado para o ponto de congelamento do líquido de arrefecimento.");
        }
    }

    function fillFieldsBasedOnButton(buttonValue) {
        const manualInputElements = document.querySelectorAll('app-manual-input');

        manualInputElements.forEach(appInput => {
            const headerTextElement = appInput.querySelector('.tds-row.header-text');
            if (!headerTextElement) return;

            const headerText = headerTextElement.textContent.trim().toLowerCase();

            if (headerText.includes('lona') || headerText.includes('freio')) {
                if (buttonValue === 'inferior') {
                    fillBrakeThickness(appInput, "12", "12");
                } else if (buttonValue === 'moderado') {
                    fillBrakeThickness(appInput, "15", "15");
                } else if (buttonValue === 'superior') {
                    fillBrakeThickness(appInput, "19", "19");
                }
            }

            else if (headerText.includes('rodagem') || headerText.includes('pneu')) {
                if (buttonValue === 'inferior') {
                    fillTireTreadDepth(appInput, "12", "12");
                } else if (buttonValue === 'moderado') {
                    fillTireTreadDepth(appInput, "13", "13");
                } else if (buttonValue === 'superior') {
                    fillTireTreadDepth(appInput, "14", "14");
                }
            }

            else if (headerText.includes('líquido') || headerText.includes('arrefecimento')) {
                if (buttonValue === 'inferior') {
                    fillFreezingPoint(appInput, "-32");
                } else if (buttonValue === 'moderado') {
                    fillFreezingPoint(appInput, "-32");
                } else if (buttonValue === 'superior') {
                    fillFreezingPoint(appInput, "-32");
                }
            }
        });
    }

    function adjustResponsiveness() {
        const container = document.getElementById('tm-button-container');
        if (!container) return;

        if (window.innerWidth < 600) {
            container.style.bottom = '10px';
            container.style.right = '10px';
            container.style.maxWidth = '100%';
        } else {
            container.style.bottom = '5%';
            container.style.right = '5%';
            container.style.maxWidth = '350px';
        }
    }

    window.addEventListener('load', function() {
        createButtons();
        adjustResponsiveness();
    });

    window.addEventListener('resize', adjustResponsiveness);

})();
