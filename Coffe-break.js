


async function excluirFuncionario(id) {
    if (!confirm("Tem certeza que deseja excluir este funcionário?")) {
        return;
    }

    try {
        const response = await fetch(`https://localhost:7073/employees/${id}`, {
            method: 'DELETE',
        });
        
        if (response.ok) {
            alert("Funcionário excluído com sucesso.");
            carregarFuncionarios(); 
        } else if (response.status === 404) {
            alert("Funcionário não encontrado.");
        } else {
            const errorText = await response.text();
            console.error("Erro ao excluir funcionário:", errorText);
            alert("Erro ao excluir o funcionário. Verifique o servidor.");
        }
    } catch (error) {
        console.error("Erro ao conectar à API:", error);
        alert("Erro ao conectar à API. Verifique a URL e o servidor.");
    }
}











// Função para pesquisar funcionários
async function pesquisarFuncionario() {
    const searchInput = document.getElementById('buscar-funcionario').value.trim().toLowerCase();

    try {
        console.log("Pesquisando funcionários com:", searchInput);

        const response = await fetch('https://localhost:7073/employees?page=1&rows=100');
        if (response.ok) {
            const funcionarios = await response.json();

            const tbody = document.getElementById('tbody-funcionario');
            if (!tbody) {
                console.error("Elemento tbody não encontrado.");
                return;
            }

            tbody.innerHTML = ''; // Limpa a tabela antes de exibir os resultados

            // Filtra os funcionários com base no termo de pesquisa
            const resultados = funcionarios.filter(funcionario =>
                funcionario.userName.toLowerCase().includes(searchInput) ||
                funcionario.email.toLowerCase().includes(searchInput)
            );

            if (resultados.length > 0) {
                // Renderiza os funcionários filtrados
                resultados.forEach(funcionario => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${funcionario.userName}</td>
                        <td>${funcionario.email}</td>
                        <td>*****</td>
                        <td><button onclick="editarFuncionario('${funcionario.id}')">Editar</button></td>
                        <td><button onclick="excluirFuncionario('${funcionario.id}')">Excluir</button></td>
                    `;
                    tbody.appendChild(tr);
                });
            } else {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td colspan="5">Nenhum funcionário encontrado.</td>`;
                tbody.appendChild(tr);
            }
        } else {
            console.error("Erro ao buscar dados. Status:", response.status);
            alert("Erro ao buscar os funcionários. Verifique o servidor.");
        }
    } catch (error) {
        console.error("Erro ao conectar à API:", error);
        alert("Erro ao conectar à API. Verifique a URL e o servidor.");
    }
}

// Adiciona o evento ao campo de busca
document.getElementById('buscar-funcionario').addEventListener('input', pesquisarFuncionario);







//  mostrar na tabela

async function carregarFuncionarios() {
    try {
        console.log("Iniciando a requisição para carregar funcionários...");
        const response = await fetch('https://localhost:7073/employees?page=1&rows=100');
        console.log("Resposta da requisição:", response);

        if (response.ok) {
            const funcionarios = await response.json();
            console.log("Funcionários recebidos:", funcionarios);

            const tbody = document.getElementById('tbody-funcionario');
            if (!tbody) {
                console.error("Elemento tbody não encontrado.");
                return;
            }

            tbody.innerHTML = '';
            funcionarios.forEach(funcionario => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${funcionario.userName}</td>
                    <td>${funcionario.email}</td>
                    <td>*****</td>
                    <td><button onclick="editarFuncionario('${funcionario.id}')">Editar</button></td>
                    <td><button onclick="excluirFuncionario('${funcionario.id}')">Excluir</button></td>
                `;
                tbody.appendChild(tr);
            });

            document.querySelectorAll('.btn-editar').forEach(btn => {
                btn.addEventListener('click', () => editarFuncionario(btn.dataset.id));
            });

            document.querySelectorAll('.btn-excluir').forEach(btn => {
                btn.addEventListener('click', () => excluirFuncionario(btn.dataset.id));
            });


        } else {
            console.error("Erro ao buscar dados. Status:", response.status);
            const errorText = await response.text();
            console.error("Mensagem de erro:", errorText);
            alert("Erro ao carregar os funcionários. Verifique o servidor.");
        }
    } catch (error) {
        console.error("Erro ao conectar à API:", error);
        alert("Erro ao conectar à API. Verifique a URL e o servidor.");
    }
}
document.addEventListener('DOMContentLoaded', carregarFuncionarios);





document.addEventListener("DOMContentLoaded", () => {
    const formFuncionario = document.getElementById("form-funcionario");

    if (!formFuncionario) {
        console.error("O formulário de funcionário não foi encontrado.");
        return;
    }

    formFuncionario.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita o recarregamento da página

        // Coletar os dados do formulário
        const userData = {
            name: document.getElementById("nome-funcionario").value.trim(),
            email: document.getElementById("email-funcionario").value.trim(),
            password: document.getElementById("password-funcionario").value.trim(),
            EmployeeCode: "005" // Código fixo (ajuste conforme necessário)
        };

        // Validar os campos obrigatórios
        if (!userData.name || !userData.email || !userData.password) {
            alert("Todos os campos são obrigatórios.");
            return;
        }

        try {
            // Fazer a requisição para a API
            const response = await fetch('https://localhost:7073/employees', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                alert("Funcionário cadastrado com sucesso!");
                this.reset(); // Limpa o formulário após sucesso
                // Atualizar a tabela de funcionários (opcional)
                carregarFuncionarios(); 
            } else {
                // Tratar erros da API
                const errorData = await response.json();
                const errorMessages = errorData.errors
                    ? Object.values(errorData.errors).flat().join("\n")
                    : errorData.title || "Erro ao cadastrar o funcionário.";
                alert(`Erros: \n${errorMessages}`);
            }
        } catch (error) {
            console.error("Erro ao conectar ao servidor:", error);
            alert("Erro ao conectar ao servidor. Verifique a conexão.");
        }
    });
});









// Função para exibir uma seção específica e esconder as demais
function showSection(sectionId) {
    // Seleciona todas as seções que precisam ser gerenciadas
    const sections = document.querySelectorAll('section, div.container');

    sections.forEach(section => {
        // Esconde todas as seções
        section.style.display = 'none';
    });

    // Exibe apenas a seção alvo, se ela existir
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
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
//////////////////////////////////////////////////////////////////////////////////////////
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
        } else {
            const error = await response.text();
            alert(`Erro: ${error}`);
        }
    } catch (err) {
        console.error('Erro ao fazer login:', err);
        alert('Erro ao conectar-se à API.');
    }
});
///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
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





















