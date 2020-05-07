axios.get('https://apidosetoreletrico.com.br/api/energy-providers')
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.warn(error);
    });
