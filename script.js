let messages = [];
let userName;

function scrollToBottom() {
    let container = document.querySelector(".container");
    container.scrollTop = container.scrollHeight;
}

function showMessages() {
    let messageList = document.querySelector(".container ul");
    messageList.innerHTML = "";
    
    for(let i = 0; i < messages.length; i++) {
        let message = messages[i];
        messageList.innerHTML += `
            <li>
                <p class="enterLeaveChat"><span>(${message.time}) </span> <em>${message.from}</em> ${message.text}</p>
            </li>
        `;
    }    
    scrollToBottom();
}

function responseData(serverData) {
    // console.log(serverData);
    messages = serverData.data;
    showMessages();
}

setInterval(statusOk, 5000);

function statusOk() {
    console.log("O usuário continua on");
}

function statusUser() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status/9b93bd8b-fdc8-47f6-ab3c-dc122a80b154", {name: userName});
    promise.then(statusOk);
    promise.catch(showError);
}

function getMessages() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages/9b93bd8b-fdc8-47f6-ab3c-dc122a80b154");
    promise.then(responseData);
    promise.catch(showError);
}

function showError() {
    alert("Ocorreu um erro. Tente mais tarde.")
}

function receiveResponse(response) {
    // console.log(response);
    // Parseia os dados JSON na configuração da requisição
    const configData = JSON.parse(response.config.data);
    // Acessa o campo 'name' no objeto parseado
    const name = configData.name;
    alert(`${name} foi adicionado com sucesso.`);
    getMessages();
}

function askName(){
        userName = prompt("Digite seu nome:");
        const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants/9b93bd8b-fdc8-47f6-ab3c-dc122a80b154', {name: userName});
        promise.then(receiveResponse);
        promise.catch(showError);        
}

getMessages();
askName();


