let dados = [];



function showError() {
    alert("Ocorreu um erro. Tente mais tarde.")
}

function receiveResponse(response) {
    console.log(response);

    // Parseia os dados JSON na configuração da requisição
    const configData = JSON.parse(response.config.data);
    // Acessa o campo 'name' no objeto parseado
    const name = configData.name;
    alert(`${name} foi adicionado com sucesso.`);
}

function askName(){
        userName = prompt("Digite seu nome:");
        const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants/9b93bd8b-fdc8-47f6-ab3c-dc122a80b154', {name: userName});
        promise.then(receiveResponse);
        promise.catch(showError);
}

askName();
