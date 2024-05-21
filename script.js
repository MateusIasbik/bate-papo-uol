let messages = [];
let userName;
const link = "https://mock-api.driven.com.br/api/v6/uol/";
let selectedElement = null;
let nameSelected = null;
let visibility = null;

let typedMessage = {
    from: "",
    to: "Todos",
    text: "",
    type: "message" // ou "private_message"
};

function showMessages() {
    let messageList = document.querySelector(".container ul");
    messageList.innerHTML = "";

    for (let i = 0; i < messages.length; i++) {
        let message = messages[i];
        // console.log(messages[i]);
        if (message.type === 'status') {
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

function statusOk() {
    // console.log("O usuário continua on");
}

function statusUser() {
    const promise = axios.post(`${link}status/9b93bd8b-fdc8-47f6-ab3c-dc122a80b154`, { name: userName });
    promise.then(statusOk);
    promise.catch(showError);
}

function getMessages() {
    const promise = axios.get(`${link}messages/9b93bd8b-fdc8-47f6-ab3c-dc122a80b154`);
    promise.then(responseData);
    promise.catch(showError);
}

function showError(erro) {

    if (erro.response && erro.response.status === 400) {
        alert("Verifique se você preencheu corretamente o nome do usuário!");
        reloadPage();
    } else {
        alert("Ocorreu um erro. Tente novamente mais tarde.");
        reloadPage();
    }
}

function receiveResponseName(response) {
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

    for (let i = 0; i < names.data.length; i++) {
        if (userName === names.data[i].name) {
            userExists = true;
            break;
        }
    } if (userExists) {
        alert(`${userName} já existe! Adicione outro nome.`);
        askName();
    } else {
        const promise = axios.post(`${link}participants/9b93bd8b-fdc8-47f6-ab3c-dc122a80b154`, { name: userName });
        promise.then(receiveResponseName);
        promise.catch(showError);
    }
}

function checkName() {
    const promise = axios.get(`${link}participants/9b93bd8b-fdc8-47f6-ab3c-dc122a80b154`);
    promise.then(namesSent);
    promise.catch(showError);
}

function askName() {
    getParticipants();
    userName = prompt("Digite seu nome:");
    typedMessage.from = userName;
    checkName();
}

function exitTheDisplay() {
    // console.log("Funciona!")
    let element = document.querySelector(".boxMenu");
    if (element.style.display !== "none") {
        element.style.display = "none";
    } else {
        element.style.display = "flex";
    }
}

function clickPeople() {
    getParticipants();
    // console.log("Deu certo!");
    let element = document.querySelector(".boxMenu");
    if (element.style.display !== "flex") {
        element.style.display = "flex";
    } else {
        element.style.display = "none";
    }
}

function messageWasSent() {
    // console.log("Mensagem foi!")
    getMessages();
}

function sendMessage() {
    const input = document.getElementById("myInput");
    typedMessage.text = input.value.trim();

    if (typedMessage.text) {
        // console.log(typedMessage.text);
        axios.post(`${link}messages/9b93bd8b-fdc8-47f6-ab3c-dc122a80b154`, typedMessage)
            .then(messageWasSent)
            .catch(reloadPage);
        input.value = ""; // Limpar o input após enviar a mensagem
    } else {
        alert("Digite uma mensagem antes de enviar!");
    }
}

//evento para capturar o clique no menu da direita dentro do display, impedindo o clique para saída do display
document.querySelector(".menuRight").addEventListener("click", (event) => {
    event.stopPropagation();
});

//evento para funcionar o clique de saída do display
document.querySelector(".boxMenu").addEventListener("click", exitTheDisplay);

//evento para funcionar o clique no ínone para abrir o display
document.getElementById("iconPeople").addEventListener("click", clickPeople);

// evento para funcionar o envio da mensagem pelo ícone do avião de papel
document.getElementById("submitButton").addEventListener("click", sendMessage);

//evento para funcionar o envio da mensagem pela tecla enter
document.getElementById("myInput").addEventListener("keyup", events => {
    if (events.key === "Enter") {
        sendMessage();
    }
});

// Adiciona o evento de clique a cada item 'li' dentro do '.visibility ul'
document.querySelectorAll(".visibility ul li").forEach(item => {
    item.addEventListener("click", selectElement);
});

function selectElement(event) {
    // Seleciona todos os elementos com a classe 'iconCheckMenu checked' e a remove
    const allElements = document.querySelectorAll(".visibility .iconCheckMenu.checked");
    allElements.forEach(item => {
        item.classList.remove("checked");
    });

    // Adiciona a classe 'checked' ao 'iconCheckMenu' dentro do 'li' clicado
    const clickedElement = event.currentTarget;
    const visibilityElement = clickedElement.querySelector(".leftVisibility p");
    const iconCheckMenu = clickedElement.querySelector(".iconCheckMenu");
    
    if (iconCheckMenu) {
        iconCheckMenu.classList.add("checked");

        // Se visibilityElement e nameSelected estiverem definidos
        if (visibilityElement && nameSelected) {
            const visibilityText = visibilityElement.textContent;

            document.querySelector(".sendMessage p").innerHTML = `
                <p>Enviando para ${nameSelected} (${visibilityText})</p>
            `;
        }
    }
}

function nameClicked(li, nameWasSelected) {
    const allNames = document.querySelectorAll(".contactMessage .iconCheckMenu.checked");

    // Remove a classe "checked" de todos os elementos que a possuem
    allNames.forEach(item => {
        item.classList.remove("checked");
    });

    // Adiciona a classe "checked" apenas ao elemento clicado
    li.querySelector(".iconCheckMenu").classList.add("checked");

    nameSelected = nameWasSelected;
    // console.log(nameWasSelected);
}

function showNames(names) {
    // console.log(names);
    const positionNames = document.querySelector(".contacts .contactMessage");

    // Verifica se "Todos" está selecionado e define o template adequadamente
    let allTemplate = `
    <li onclick="nameClicked(this, 'Todos')">
        <div class="leftContacts">
            <ion-icon name="people"></ion-icon>
            <p>Todos</p>
        </div>
        <div class="iconCheckMenu ${nameSelected === 'Todos' ? 'checked' : ''}"><ion-icon name="checkmark-sharp"></ion-icon></div>
    </li>
    `;
    positionNames.innerHTML = allTemplate;

    for (let i = 0; i < names.length; i++) {
        let template;
        if (names[i] === nameSelected) {
            template = `
            <li onclick="nameClicked(this, '${nameSelected}')">
                <div class="leftContacts">
                    <ion-icon name="person-circle"></ion-icon>
                    <p>${nameSelected}</p>
                </div>
                <div class="iconCheckMenu checked"><ion-icon name="checkmark-sharp"></ion-icon></div>
            </li>
            `;
        } else {
            template = `
            <li onclick="nameClicked(this, '${names[i]}')">
                <div class="leftContacts">
                    <ion-icon name="person-circle"></ion-icon>
                    <p>${names[i]}</p>
                </div>
                <div class="iconCheckMenu"><ion-icon name="checkmark-sharp"></ion-icon></div>
            </li>
            `;
        }

        if (names[i] !== userName) {
            positionNames.innerHTML += template;
        }
    }
}


function gettingParticipants(response) {
    // console.log(response.data);
    if (response.data.length > 0) {
        const namesIncluded = response.data;
        const names = namesIncluded.map(person => person.name);
        showNames(names);
    } else {
        alert("Não há ninguém na sala!");
    }
}

function getParticipants() {
    axios.get(`${link}participants/9b93bd8b-fdc8-47f6-ab3c-dc122a80b154`)
        .then(gettingParticipants)
        .catch(reloadPage);
}

function reloadPage() {
    window.location.reload();
}

getMessages();
askName();
setInterval(getMessages, 3000);
setInterval(statusUser, 5000);
setInterval(getParticipants, 10000);

