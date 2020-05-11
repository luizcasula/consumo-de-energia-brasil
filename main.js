var cbLocationElement = document.getElementById('cbLocation');

axios.get('https://apidosetoreletrico.com.br/api/energy-providers')
    .then(function (response) {
        // console.log(response.data);
        var locations = response.data;
        locations.forEach(element => {
            var locationItem = document.createElement('option');
            locationItem.setAttribute('id', '' + element.id + '');
            locationItem.setAttribute('onselect', 'printId(' + element.id + ')');
            var locationText = document.createTextNode(element.name);
            locationItem.appendChild(locationText);
            cbLocationElement.appendChild(locationItem);
        });
    })
    .catch(function (error) {
        console.warn(error);
    });

function printId(id) {
    console.log(id);
}




