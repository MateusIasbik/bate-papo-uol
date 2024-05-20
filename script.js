let messages = [];
let userName;

let typedMessage = {
	from: "",
	to: "Todos",
	text: "",
	type: "message" // ou "private_message"
};


function showMessages() {
    let messageList = document.querySelector(".container ul");
    messageList.innerHTML = "";
    
    for(let i = 0; i < messages.length; i++) {
        let message = messages[i];
        // console.log(messages[i]);
        if (message.type === 'status'){
            messageList.innerHTML += `
            <li class="messageItem">
                <p class="enterLeaveChat"><span>(${message.time}) </span> <em>${message.from}</em> ${message.text}</p>
            </li>
        `;
        } else if (message.type === 'message') {
            messageList.innerHTML += `
            <li class="messageItem">
                <p><span>(${message.time}) </span> <em>${message.from}</em> para <em>${message.to}</em>: ${message.text}</p>
            </li>
        `;
        }
    }

    let lastMessageItem = document.querySelector(".messageItem:last-child");
    // console.log(lastMessageItem);
    if (lastMessageItem) {
        lastMessageItem.scrollIntoView();
    }
}

function responseData(serverData) {
    // console.log(serverData);
    messages = serverData.data;
    showMessages();
}

// setInterval(statusUser, 5000);

function statusOk() {
    // console.log("O usuário continua on");
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

function showError(erro) {

    if (erro.response && erro.response.status === 400) {
        alert("Verifique se você preencheu corretamente o nome do usuário!");
    } else {
        alert("Ocorreu um erro. Tente novamente mais tarde.");
    }
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

function namesSent(names) {
    let userExists = false; 
    // console.log(names);

    for (let i = 0; i < names.data.length; i++){
        if (userName === names.data[i].name) {
            userExists = true;
            break;
        }
    } if (userExists) {
        alert(`${userName} já existe! Adicione outro nome.`);
        askName();
    } else {
        const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants/9b93bd8b-fdc8-47f6-ab3c-dc122a80b154', {name: userName});
        promise.then(receiveResponse);
        promise.catch(showError);   
    }
}

function checkName() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants/9b93bd8b-fdc8-47f6-ab3c-dc122a80b154");
    promise.then(namesSent);
    promise.catch(showError);
}

function askName(){
    userName = prompt("Digite seu nome:");
    typedMessage.from = userName;
    checkName();     
}

function messageWasSent() {
    console.log("Mensagem foi!")
}

function sendMessage() {
    const input = document.getElementById("myInput");
    typedMessage.text = input.value.trim();

    if (typedMessage.text) {
        console.log(typedMessage.text);
        axios.post("https://mock-api.driven.com.br/api/v6/uol/messages/9b93bd8b-fdc8-47f6-ab3c-dc122a80b154", typedMessage)
            .then(messageWasSent)
            .catch(showError);
        input.value = ""; // Limpar o input após enviar a mensagem
    } else {
        alert("Digite uma mensagem antes de enviar!");
    }
}

document.getElementById("submitButton").addEventListener("click", sendMessage);

document.getElementById("myInput").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

getMessages();
askName();
setInterval(getMessages, 3000);
setInterval(statusUser, 5000);

