// Função para exibir uma seção específica
function showSection(sectionId) {
    const containers = document.querySelectorAll('section, div.container');
    containers.forEach(container => {
        container.style.display = 'none'; 
    });

    const targetContainer = document.getElementById(sectionId);
    if (targetContainer) {
        targetContainer.style.display = 'block';  
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////
// Executa quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    const sideMenu = document.getElementById('sideMenu');
    const loginForm = document.getElementById('loginForm');
    const addProductButton = document.getElementById('addProductButton');
    const logoutButton = document.getElementById('logoutButton');

    showSection('carrinho-certo');

    window.toggleMenu = function () {
        sideMenu.classList.toggle('open');
    };

    document.addEventListener('click', (event) => {
        if (!sideMenu.contains(event.target) && !event.target.closest('.menu-toggle') && sideMenu.classList.contains('open')) {
            sideMenu.classList.remove('open');
        }
    });

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }

    loadItens('funcionario');
    loadItens('item');
});

// Função para exibir notificações de sucesso
function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}
//////////////////////////////////////////////////////////////////////////////////////////////
// Evento do formulário de login
// Evento do formulário de login
if (loginForm) {
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Evitar o recarregamento da página ao submeter o formulário

        // Coletar os dados do formulário
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        const loginData = { email, password };

        try {
            // Fazendo a requisição para o endpoint de login
            const response = await fetch('https://127.0.0.1:7073/employees/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                // Login bem-sucedido
                const data = await response.json();
                //alert("Login realizado com sucesso!");
                window.location.href = 'index.html'; // Redirecionar para a página inicial
            } else if (response.status === 400) {
                // Credenciais inválidas
                const error = await response.json();
                alert(error.message || "Email ou senha inválidos.");
            } else {
                // Outros erros
                alert("Erro inesperado. Tente novamente mais tarde.");
            }
        } catch (err) {
            // Erro de conexão ou outro problema inesperado
            alert("Erro ao se conectar ao servidor. Tente novamente mais tarde.");
            console.error(err);
        }
    });
}
//////////////////////////////////////////////////////////////////////////////////////////////////
// Aguardar o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", function () {
    // Adiciona o evento de envio do formulário
    document.querySelector("#form-funcionario").addEventListener("submit", async function (event) {
        event.preventDefault();  // Impede o envio padrão do formulário

        // Coleta os dados do formulário
        const userData = {
            name: document.getElementById("nome-funcionario").value.trim(),
            email: document.getElementById("email-funcionario").value.trim(),
            password: document.getElementById("password-funcionario").value.trim(),
            EmployeeCode: "005"  // Código do funcionário (ajustar conforme necessário)
        };

        // Validação dos campos
        if (!userData.name || !userData.email || !userData.password) {
            alert("Todos os campos são obrigatórios.");
            return;
        }

        try {
            // Requisição POST para a API
            const response = await fetch("https://127.0.0.1:7073/employees", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                // Cadastro bem-sucedido
                alert("Funcionário cadastrado com sucesso!");
                document.querySelector("#form-funcionario").reset();  // Limpa o formulário
                closeModal('modal-funcionario');  // Fecha o modal após o cadastro
                addFuncionarioToTable(userData);  // Adiciona à tabela
            } else {
                // Erros retornados pela API
                const errorData = await response.json();
                if (errorData.errors) {
                    const errorMessages = Object.values(errorData.errors).flat().join("\n");
                    alert(`Erros: \n${errorMessages}`);
                } else {
                    alert(errorData.title || "Erro ao cadastrar o funcionário.");
                }
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao conectar ao servidor. Verifique a conexão.");
        }
    });
});

// Função para adicionar o funcionário à tabela
function addFuncionarioToTable(funcionario) {
    const tableBody = document.getElementById("tbody-funcionario");
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${funcionario.name}</td>
        <td>${funcionario.email}</td>
        <td>********</td> <!-- Não exibe a senha -->
        <td><button onclick="editFuncionario(${funcionario.EmployeeCode})">Editar</button></td>
        <td><button onclick="deleteFuncionario(${funcionario.EmployeeCode})">Excluir</button></td>
    `;
    tableBody.appendChild(row);
}

// Função para fechar o modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "none";  // Fecha o modal
}

//////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////
// Gerenciamento de itens genérico
function openModal(type, edit = false, index = 0) {
    const modal = document.getElementById(`modal-${type}`);
    const sNome = document.getElementById(`nome-${type}`);
    const sEmailOrCategoria = document.getElementById(`${type === 'funcionario' ? 'email' : 'categoria'}-${type}`);
    const sSenha = type === 'funcionario' ? document.getElementById('password-funcionario') : null;

    modal.classList.add('active');
    modal.onclick = e => {
        if (e.target.className.includes('modal-container')) {
            modal.classList.remove('active');
        }
    };

    if (edit) {
        const item = itens[index];
        sNome.value = item.nome;
        sEmailOrCategoria.value = item.email || item.categoria;
        if (sSenha) sSenha.value = item.password;
    } else {
        sNome.value = '';
        sEmailOrCategoria.value = '';
        if (sSenha) sSenha.value = '';
    }
}
////////////////////////////////////////////////////////////////////////////////////
function saveItem(type) {
    const sNome = document.getElementById(`nome-${type}`);
    const sEmailOrCategoria = document.getElementById(`${type === 'funcionario' ? 'email' : 'categoria'}-${type}`);
    const sSenha = type === 'funcionario' ? document.getElementById('password-funcionario') : null;

    if (!sNome.value || !sEmailOrCategoria.value || (sSenha && !sSenha.value)) return;

    if (id !== undefined) {
        itens[id] = { nome: sNome.value, email: sEmailOrCategoria.value };
        if (sSenha) itens[id].password = sSenha.value;
    } else {
        const newItem = { nome: sNome.value, email: sEmailOrCategoria.value };
        if (sSenha) newItem.password = sSenha.value;
        itens.push(newItem);
    }

    setItensBD();
    loadItens(type);
    document.getElementById(`modal-${type}`).classList.remove('active');
    id = undefined;
}

function loadItens(type) {
    itens = getItensBD();
    const tbody = document.getElementById(`tbody-${type}`);
    tbody.innerHTML = '';
    itens.forEach((item, index) => insertItem(item, index, type));
}

function insertItem(item, index, type) {
    const tbody = document.getElementById(`tbody-${type}`);
    const tr = document.createElement('tr');

    if (type === 'funcionario') {
        tr.innerHTML = `
            <td>${item.nome}</td>
            <td>${item.email}</td>
            <td>${item.password}</td>
            <td><button onclick="editItem(${index}, '${type}')">Editar</button></td>
            <td><button onclick="deleteItem(${index}, '${type}')">Excluir</button></td>
        `;
    } else if (type === 'item') {
        tr.innerHTML = `
            <td>${item.nome}</td>
            <td>${item.categoria}</td>
            <td><button onclick="editItem(${index}, '${type}')">Editar</button></td>
            <td><button onclick="deleteItem(${index}, '${type}')">Excluir</button></td>
        `;
    }

    tbody.appendChild(tr);
}

document.getElementById('btnSalvar-funcionario').onclick = () => saveItem('funcionario');
document.getElementById('btnSalvar-item').onclick = () => saveItem('item');
///////////////////////////////////////////////////////////////////////////////////////////