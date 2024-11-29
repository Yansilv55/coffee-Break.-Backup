// Função para exibir uma seção específica
function showSection(sectionId) {
    // Seleciona todas as seções e esconde todas
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.display = 'none';  // Esconde todas as seções
    });

    // Exibe a seção que foi clicada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';  // Exibe a seção desejada
    }
}

// Executa quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    const sideMenu = document.getElementById('sideMenu');
    const loginForm = document.getElementById('loginForm');
    const addProductButton = document.getElementById('addProductButton');
    const logoutButton = document.getElementById('logoutButton');

    // Exibe a seção Carrinho no início da página
    showSection('carrinho-certo');  // Exibe a seção de Carrinho inicialmente

    // Alterna o menu lateral
    window.toggleMenu = function () {
        sideMenu.classList.toggle('open');
    };

    // Fecha o menu ao clicar fora dele
    document.addEventListener('click', (event) => {
        if (!sideMenu.contains(event.target) && !event.target.closest('.menu-toggle') && sideMenu.classList.contains('open')) {
            sideMenu.classList.remove('open');
        }
    });

    // Adiciona evento aos botões com a classe "button-coffe" para exibir notificação
    document.querySelectorAll('.button-coffe').forEach(button => {
        button.addEventListener('click', () => {
            showNotification("Adicionado com sucesso!");
        });
    });

    // Botão "Adicionar Produto" - exibe a seção "Fazer Pedido"
    if (addProductButton) {
        addProductButton.addEventListener('click', () => {
            showSection('lista-itens');  // Exibe a lista de itens (Fazer Pedido)
            showNotification("Adicionado com sucesso!");
        });
    }

    // Evento para o botão "Sair"
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            window.location.href = 'login.html';  // Redireciona para a página de login
        });
    }

    // Evento do formulário de login
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Inicializa os itens de funcionários e produtos
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

// Função para gerenciar o login
document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://localhost:7073/employees/login', { // Substitua pelo URL da sua API
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const result = await response.json();
            //alert('Login bem-sucedido!');
            window.location.href = 'index.html';
            // Redirecione ou armazene o token, se necessário
        } else {
            const error = await response.text();
            alert(`Erro: ${error}`);
        }
    } catch (err) {
        console.error('Erro ao fazer login:', err);
        alert('Erro ao conectar-se à API.');
    }
});

// Função para gerenciar itens (funcionário, produto, etc.)
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

// Exemplo de chamada para abrir uma seção com 'Fazer Pedido'
document.getElementById('btnSalvar-funcionario').onclick = () => saveItem('funcionario');
document.getElementById('btnSalvar-item').onclick = () => saveItem('item');
