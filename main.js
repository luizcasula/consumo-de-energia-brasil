// const data = require('./public/data.json');

const cbPowerSupply = document.getElementById('cbPowerSupply');
const inputPowerEletric = document.getElementById('inputPowerEletric');
const inputAmountDevices = document.getElementById('inputAmountDevices');
const inputUseDuration = document.getElementById('inputUseDuration');
const inputPeriod = document.getElementById('inputPeriod');
const inputDeviceName = document.getElementById('inputDeviceName');
const resultText = document.getElementById('resultText');
const resultTable = document.getElementsByTagName('tbody')[0];
const displayRange = document.getElementById('displayRange');


var listResults = JSON.parse(localStorage.getItem('listResults')) || [];

renderTable();

inputPowerEletric.addEventListener('input', function () {
    displayRange.textContent = this.value;
});


axios.get('./public/data.json').then(
    function (response) {
        data = response.data;
        data.forEach(element => {
            var locationItem = document.createElement('option');
            locationItem.setAttribute('value', element.ideTarifaFornecimento);
            var locationText = document.createTextNode(element.sigDistribuidora);
            locationItem.appendChild(locationText);
            cbPowerSupply.appendChild(locationItem);
        });
    }
).catch(
    function (error) {
        console.warn(error);
        alert('Ocorreu um erro inesperdo! Recarregue e página e tente novamente.');
    }
);

function calculate() {

    var powerEletric = inputPowerEletric.value;
    var amountDevices = inputAmountDevices.value;
    var useDuration = inputUseDuration.value;
    var period = inputPeriod.value;
    var deviceName = inputDeviceName.value;
    var id = cbPowerSupply.value;
    var powerSupply;
    var tariff = null;



    data.forEach(
        element => {
            if (element.ideTarifaFornecimento == id) {
                tariff = element.vlrTotaTRFConvencional;
                powerSupply = element.sigDistribuidora;
            }
        }
    );

    if (tariff !== null) {

        //parses
        powerEletricScale = document.getElementById('cbPowerEletricScale').value;
        switch (powerEletricScale) {
            case 'Watts':
                powerEletric /= 1000;
                break;
            case 'Mega Watts':
                powerEletric *= 1000;
                break;
        }

        var useDurationNotParsed = useDuration;
        timeUseType = document.getElementById('cbTimeUseType').value;
        switch (timeUseType) {
            case 'Minutos':
                useDuration /= 60;
                break;
            case 'Segundos':
                useDuration /= 3600;
                break;
        }

        var electricalConsumption = (amountDevices * powerEletric * useDuration * period);
        console.log(electricalConsumption + " kw");

        cost = electricalConsumption * tariff;

        var costFormatted = cost.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });

        resultText.style.display = 'block';
        resultText.textContent = "";

        resultText.textContent = costFormatted
        console.log(cost);

        deviceName = deviceName || '-';

        addResult(
            {
                'deviceName': deviceName,
                'amountDevices': amountDevices,
                'useDuration': useDurationNotParsed + ' ' + timeUseType,
                'electricalConsumption': electricalConsumption.toFixed(2),
                'period': period,
                'powerSupply': powerSupply,
                'cost': costFormatted
            }
        );

    }
}


function addResult(result) {
    console.log(result);
    listResults.push(result);
    renderTable();
    saveToStorage();
}

function deleteResult(index) {
    listResults.splice((index), 1);
    renderTable();
    saveToStorage();
}

function saveToStorage() {
    localStorage.setItem('listResults', JSON.stringify(listResults));
}


function renderTable() {
    resultTable.innerHTML = '';
    var index = 0;
    for (result of listResults) {
        var tableCount = document.createElement('th');
        var tableCountText = document.createTextNode((index + 1));
        tableCount.appendChild(tableCountText);

        var resultRow = document.createElement('tr');
        var resultName = document.createElement('td');
        var resultNameText = document.createTextNode(result.deviceName);

        resultName.appendChild(resultNameText);
        var resultAmountDevices = document.createElement('td');
        var resultAmountDevicesText = document.createTextNode(result.amountDevices);
        resultAmountDevices.appendChild(resultAmountDevicesText);

        var resultUseDuration = document.createElement('td');
        var resultUseDurationText = document.createTextNode(result.useDuration);
        resultUseDuration.appendChild(resultUseDurationText);

        var resultElectricalConsumption = document.createElement('td');
        var resultElectricalConsumptionText = document.createTextNode(result.electricalConsumption + ' KW');
        resultElectricalConsumption.appendChild(resultElectricalConsumptionText);

        var resultUsePeriod = document.createElement('td');
        var reusltUsePeriodText = document.createTextNode(result.period + ' dias');
        resultUsePeriod.appendChild(reusltUsePeriodText);

        var resultPowerSupply = document.createElement('td');
        var resultPowerSupplyText = document.createTextNode(result.powerSupply);
        resultPowerSupply.appendChild(resultPowerSupplyText);

        var resultCost = document.createElement('td');
        resultCost.appendChild(document.createTextNode(result.cost));

        var removeIconButton = document.createElement('td');

        var removeButton = document.createElement('a');
        removeButton.setAttribute('onclick', 'deleteResult(' + index + ')');

        var removeIcon = document.createElement('span');
        removeIcon.setAttribute('class', 'material-icons removeButton');
        removeIcon.textContent = 'delete';

        removeButton.appendChild(removeIcon);
        removeIconButton.appendChild(removeButton);

        resultRow.appendChild(tableCount);
        resultRow.appendChild(resultName);
        resultRow.appendChild(resultAmountDevices);
        resultRow.appendChild(resultUseDuration);
        resultRow.appendChild(resultElectricalConsumption);
        resultRow.appendChild(resultUsePeriod);
        resultRow.appendChild(resultPowerSupply);
        resultRow.appendChild(resultCost);
        resultRow.appendChild(removeIconButton);
        resultTable.appendChild(resultRow);
        index++;
    }
}
