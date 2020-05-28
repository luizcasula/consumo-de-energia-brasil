// const data = require('./public/data.json');

// console.log(data);

const cbPowerSupply = document.getElementById('cbPowerSupply');
const inputPowerEletric = document.getElementById('inputPowerEletric');
const inputAmountDevices = document.getElementById('inputAmountDevices');
const inputUseDuration = document.getElementById('inputUseDuration');
const inputPeriod = document.getElementById('inputPeriod');
const inputDeviceName = document.getElementById('inputDeviceName');
const resultText = document.getElementById('resultText');
const resultTable = document.getElementsByTagName('tbody')[0];
const displayRange = document.getElementById('displayRange');



inputPowerEletric.addEventListener('input', function () {
    displayRange.textContent = this.value;
});

var countTable = 1;

axios.get('./public/data.json').then(
    function (response) {
        // console.log(response.data);
        data = response.data;
        data.forEach(element => {
            // console.log(element)
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
        alert("Ocorreu um erro inesperdo! Recarregue e página e tente novamente.")
    }
);


function calculate() {

    var powerEletric = inputPowerEletric.value;
    var amountDevices =inputAmountDevices.value;
    var useDuration = inputUseDuration.value;
    var period = inputPeriod.value;
    var deviceName = inputDeviceName.value;
    var id = cbPowerSupply.value;

    var tariff = null;

    data.forEach(
        element => {
            if (element.ideTarifaFornecimento == id) {
                tariff = element.vlrTotaTRFConvencional;
            }
        }
    );

    if (tariff !== null) {
        var kw = (amountDevices * powerEletric * useDuration * period) / 1000;
        console.log(kw + " kw");

        cost = kw * tariff;

        var kw = (amountDevices * powerEletric * useDuration * period) / 1000;
        console.log(kw + " kw");

        cost = kw * tariff;

        var costFormatted = cost.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });

        resultText.style.display = 'block';
        resultText.textContent = "";

        resultText.textContent = costFormatted
        console.log(cost);

        // style="display: none"
        // resultTable.style.display = 'block';
        var resultRow = document.createElement('tr');

        var tableCount = document.createElement('th');
        var tableCountText = document.createTextNode(countTable);
        tableCount.appendChild(tableCountText);


        var resultName = document.createElement('td');
        var resultNameText;

        if (deviceName !== '') {
            resultNameText = document.createTextNode(deviceName);
        } else {
            resultNameText = document.createTextNode("-");
        }

        resultName.appendChild(resultNameText);

        var resultElectricalConsumption = document.createElement('td');
        var resultElectricalConsumptionText = document.createTextNode(kw + " kw");
        resultElectricalConsumption.appendChild(resultElectricalConsumptionText);

        var resultCost = document.createElement('td');
        resultCost.appendChild(document.createTextNode(costFormatted));


        resultRow.appendChild(tableCount);
        resultRow.appendChild(resultName);
        resultRow.appendChild(resultElectricalConsumption);
        resultRow.appendChild(resultCost);

        resultTable.appendChild(resultRow);

        countTable++;
    }



}
