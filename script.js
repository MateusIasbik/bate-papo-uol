let messages = [];
let userName;
const link = "https://mock-api.driven.com.br/api/v6/uol/";
let selectedElement = null;
let visibility = null;
let eventClicked;
let visibilityText = "Público"

let typedMessage = {
    from: "",
    to: "Todos",
    text: "",
    type: "message" 
};

function showMessages() {
    let messageList = document.querySelector(".container ul");
    messageList.innerHTML = "";

    messages.forEach(message => {
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
        } else if (message.type === "private_message") {
            messageList.innerHTML += `
            <li class="messageItem">
                <p class="privateChat"><span>(${message.time}) </span> <em>${message.from}</em> para <em>${message.to}</em>: ${message.text}</p>
            </li>
        `;
        }
    });

    let lastMessageItem = document.querySelector(".messageItem:last-child");
    if (lastMessageItem) {
        lastMessageItem.scrollIntoView();
    }
}

function responseData(serverData) {
    messages = serverData.data.filter(message => {
        if (message.to === userName || message.to === "Todos" || message.type === "message" || message.from === userName) {
            return message;
        }
    })
    showMessages();
}

function statusOk() {
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
    const configData = JSON.parse(response.config.data);
    const name = configData.name;
    alert(`${name} foi adicionado com sucesso.`);
    getMessages();
}

function namesSent(names) {
    let userExists = false;
    let arrayNames = names.data;

    for (let i = 0; i < arrayNames.length; i++) {
        if (userName === arrayNames[i].name) {
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
    let element = document.querySelector(".boxMenu");
    if (element.style.display !== "none") {
        element.style.display = "none";
    }
}

function clickPeople() {
    getParticipants();
    let element = document.querySelector(".boxMenu");
    if (element.style.display !== "flex") {
        element.style.display = "flex";
    }
}

function messageWasSent() {
    getMessages();
}

function sendMessage() {
    const input = document.getElementById("myInput");
    typedMessage.text = input.value.trim();

    if (typedMessage.text) {
        axios.post(`${link}messages/9b93bd8b-fdc8-47f6-ab3c-dc122a80b154`, typedMessage)
            .then(messageWasSent)
            .catch(reloadPage);
        input.value = ""; 
    } else {
        alert("Digite uma mensagem antes de enviar!");
    }
}

function selectElement(event) {
    const allElements = document.querySelectorAll(".visibility .iconCheckMenu.checked");
    allElements.forEach(item => {
        item.classList.remove("checked");
    });

    const clickedElement = event.currentTarget; 
    const visibilityElement = clickedElement.querySelector(".leftVisibility p");
    const iconCheckMenu = clickedElement.querySelector(".iconCheckMenu");

    iconCheckMenu.classList.add("checked");
    if (typedMessage.to === "Todos" && visibilityElement.innerHTML === "Público") {
        visibilityText = visibilityElement.textContent;
        typedMessage.type = "message";
        typedMessage.to = "Todos";

        document.querySelector(".sendMessage p").innerHTML = `
                    <p>Enviando para ${typedMessage.to} (${visibilityText})</p>
                `;
    } else if (typedMessage.to !== "Todos" && visibilityElement.innerHTML === "Reservadamente") {
        visibilityText = visibilityElement.textContent;
        typedMessage.type = "private_message";
        typedMessage.to = `${typedMessage.to}`;

        document.querySelector(".sendMessage p").innerHTML = `
                    <p>Enviando para ${typedMessage.to} (${visibilityText})</p>
                `;
    } else if (typedMessage.to !== "Todos" && visibilityElement.innerHTML === "Público") {
        visibilityText = visibilityElement.textContent;
        typedMessage.type = "message";
        typedMessage.to = `${typedMessage.to}`;

        document.querySelector(".sendMessage p").innerHTML = `
                    <p>Enviando para ${typedMessage.to} (${visibilityText})</p>
                `;
    } else {
        typedMessage.type = "message";
        const secondLiIconCheckMenu = document.querySelector(".visibility li:nth-child(2) .iconCheckMenu");
        const firstLiIconCheckMenu = document.querySelector(".visibility li:nth-child(1) .iconCheckMenu");

        if (secondLiIconCheckMenu) {
            secondLiIconCheckMenu.classList.remove("checked");
            firstLiIconCheckMenu.classList.add("checked");
        }

        document.querySelector(".sendMessage p").innerHTML = `
                    <p>Enviando para ${typedMessage.to} (Público)</p>
                `;
        alert("Não é possível enviar mensagem reservada para Todos");
    }

}

function nameClicked(li, nameWasSelected) {
    const allNames = document.querySelectorAll(".contactMessage .iconCheckMenu.checked");

    allNames.forEach(item => {
        item.classList.remove("checked");
    });

    li.querySelector(".iconCheckMenu").classList.add("checked");

    document.querySelector(".sendMessage p").innerHTML = `
            <p>Enviando para ${nameWasSelected} (${visibilityText})</p>
        `;

    typedMessage.to = nameWasSelected;

    if (typedMessage.to === "Todos") {
        typedMessage.type = "message";

        visibilityText = "Público";
        document.querySelector(".sendMessage p").innerHTML = `
            <p>Enviando para ${nameWasSelected} (${visibilityText})</p>
        `;
        
        const secondLiIconCheckMenu = document.querySelector(".visibility li:nth-child(2) .iconCheckMenu");
        const firstLiIconCheckMenu = document.querySelector(".visibility li:nth-child(1) .iconCheckMenu");

        if (secondLiIconCheckMenu) {
            secondLiIconCheckMenu.classList.remove("checked");
            firstLiIconCheckMenu.classList.add("checked");
        }
    }
}

function showNames(names) {
    const positionNames = document.querySelector(".contacts .contactMessage");

    let allTemplate = `
    <li onclick="nameClicked(this, 'Todos')">
        <div class="leftContacts">
            <ion-icon name="people"></ion-icon>
            <p>Todos</p>
        </div>
        <div class="iconCheckMenu ${typedMessage.to === 'Todos' ? 'checked' : ''}"><ion-icon name="checkmark-sharp"></ion-icon></div>
    </li>
    `;
    positionNames.innerHTML = allTemplate;

    names.forEach(nameUsed => {
        if (nameUsed === typedMessage.to) {
            template = `
                <li onclick="nameClicked(this, '${typedMessage.to}')">
                <div class="leftContacts">
                <ion-icon name="person-circle"></ion-icon>
                <p>${typedMessage.to}</p>
                </div>
                <div class="iconCheckMenu checked"><ion-icon name="checkmark-sharp"></ion-icon></div>
                </li>
                `;
        } else {
            template = `
                <li onclick="nameClicked(this, '${nameUsed}')">
                <div class="leftContacts">
                <ion-icon name="person-circle"></ion-icon>
                <p>${nameUsed}</p>
                </div>
                <div class="iconCheckMenu"><ion-icon name="checkmark-sharp"></ion-icon></div>
                </li>
                `;
        }
        if (nameUsed !== userName) {
            positionNames.innerHTML += template;
        }
    });
    // }
}

function gettingParticipants(response) {
    if (response.data.length > 0) {
        const namesIncluded = response.data;
        const names = namesIncluded.map(person => person.name);
        showNames(names);
    } else {
        alert("Somente você nesta sala!");
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

document.querySelectorAll(".visibility ul li").forEach(item => {
    item.addEventListener("click", selectElement);
});

document.querySelector(".menuRight").addEventListener("click", (event) => {
    event.stopPropagation();
});

document.querySelector(".boxMenu").addEventListener("click", exitTheDisplay);

document.getElementById("iconPeople").addEventListener("click", clickPeople);

document.getElementById("submitButton").addEventListener("click", sendMessage);

document.getElementById("myInput").addEventListener("keyup", events => {
    if (events.key === "Enter") {
        sendMessage();
    }
});

getMessages();
askName();
setInterval(getMessages, 3000);
setInterval(statusUser, 5000);
setInterval(getParticipants, 10000);

