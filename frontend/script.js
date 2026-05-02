
let arquivoCarregado = false;

document.getElementById('btnCarregar').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    
    if (fileInput.files.length > 0) {
        
        arquivoCarregado = true;

        // Muda para a aba de execução
        const triggerEl = document.getElementById('tab-executar');
        const tabInstance = new bootstrap.Tab(triggerEl);
        tabInstance.show();
    } else {
        alert("Selecione um arquivo .txt!");
    }
});

// 2. Lógica para verificar o estado SEMPRE que a aba de execução abrir
document.getElementById('tab-executar').addEventListener('shown.bs.tab', function () {
    const divComDados = document.getElementById('com-dados');
    const divSemDados = document.getElementById('sem-dados');

    if (arquivoCarregado) {
        divComDados.classList.remove('d-none');
        divSemDados.classList.add('d-none');
    } else {
        divComDados.classList.add('d-none');
        divSemDados.classList.remove('d-none');
    }
});

// 3. Botão de redirecionamento (caso ele entre na aba sem dados)
document.getElementById('btnIrParaCarregar').addEventListener('click', function() {
    // Procura o botão da aba de carregar (ajuste o seletor se o ID for diferente)
    const btnCarregarTab = document.querySelector('[data-bs-target="#carregar"]');
    const tabInstance = new bootstrap.Tab(btnCarregarTab);
    tabInstance.show();
});
document.getElementById('btnIniciarOrdenacao').addEventListener('click', function() {
    // 1. Inicializa o Modal do Bootstrap
    const loadingModalEl = document.getElementById('loadingModal');
    const loadingModal = new bootstrap.Modal(loadingModalEl);
    const barra = document.getElementById('loading-bar');
    
    let progresso = 0;
    
    // 2. Mostra o modal (isso já deixa o fundo cinza e trava a tela)
    loadingModal.show();

    // 3. Simula o carregamento
    const intervalo = setInterval(() => {
        progresso += 10; // Sobe de 10 em 10%
        barra.style.width = progresso + "%";
        barra.innerText = progresso + "%";

        if (progresso >= 100) {
            clearInterval(intervalo);
            
            // Pequena pausa para o usuário ver o 100%
            setTimeout(() => {
                // 4. Esconde o modal
                loadingModal.hide();
                
                // 5. Muda automaticamente para a aba de Dados Ordenados
                // Verifique se o seu botão da nav-bar tem o atributo data-bs-target="#ordenados"
                const abaOrdenados = document.querySelector('[data-bs-target="#ordenados"]');
                const tabInstance = new bootstrap.Tab(abaOrdenados);
                tabInstance.show();
                
                // Reseta a barra para uma próxima execução
                setTimeout(() => {
                    barra.style.width = "0%";
                    progresso = 0;
                }, 500);
                
            }, 600);
        }
    }, 200); // Velocidade do carregamento
});
let nomesOrdenadosArray = ["nome 1", "nome 2"]; // Seus exemplos iniciais

// 1. Botão de Carregar
document.getElementById('btnCarregar').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length > 0) {
        arquivoCarregado = true;
        const triggerEl = document.getElementById('tab-executar');
        new bootstrap.Tab(triggerEl).show();
    } else {
        alert("Selecione um arquivo .txt!");
    }
});

// 2. Lógica de Iniciar Ordenação (Unificada)
document.getElementById('btnIniciarOrdenacao').addEventListener('click', function() {
    const loadingModalEl = document.getElementById('loadingModal');
    const loadingModal = new bootstrap.Modal(loadingModalEl);
    const barra = document.getElementById('loading-bar');
    let progresso = 0;
    
    loadingModal.show();

    const intervalo = setInterval(() => {
        progresso += 10;
        barra.style.width = progresso + "%";
        barra.innerText = progresso + "%";

        if (progresso >= 100) {
            clearInterval(intervalo);
            
            setTimeout(() => {
                loadingModal.hide();
                
                // --- A MÁGICA ACONTECE AQUI ---
                // Definimos os nomes que queremos exibir
                nomesOrdenadosArray = ["Neymar Jr","hjjhds","jdsjh","hjfhjsj", "Lionel Messi", "Cristiano Ronaldo", "Vini Jr","joao","carl","tete", "geuse"];
                
                // Chamamos a função para construir a lista no HTML
                atualizarInterfaceOrdenada();
                atualizarDashboard(20000, 199990000, 150000000,142005000.00);
                // Mudamos para a aba de resultados
                const abaOrdenados = document.querySelector('[data-bs-target="#ordenados"]');
                new bootstrap.Tab(abaOrdenados).show();
                
                // Reset da barra
                setTimeout(() => {
                    barra.style.width = "0%";
                    progresso = 0;
                }, 500);
            }, 600);
        }
    }, 100); 
});

// 3. Função de Renderização (A que você já tinha, mas agora sendo chamada)
function atualizarInterfaceOrdenada() {
    const containerLista = document.getElementById('container-lista-ordenada');
    const msgVazia = document.getElementById('msg-sem-dados');
    const listaUl = document.getElementById('lista-nomes-ordenados');
    const badgeTotal = document.getElementById('total-nomes');

    if (nomesOrdenadosArray.length > 0) {
        msgVazia.classList.add('d-none');
        containerLista.classList.remove('d-none');

        listaUl.innerHTML = "";
        nomesOrdenadosArray.forEach((nome, i) => {
            const li = document.createElement('li');
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.innerHTML = `
                <span>${nome}</span>
                <small class="text-primary fw-bold">#${i + 1}</small>
            `;
            listaUl.appendChild(li);
        });

        if(badgeTotal) badgeTotal.innerText = `${nomesOrdenadosArray.length} nomes`;
    }
}
let nomesOriginaisArray = [];

document.getElementById('btnCarregar').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    
    if (fileInput.files.length > 0) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const conteudo = e.target.result;
            // Divide o texto por quebras de linha e remove espaços extras
            nomesOriginaisArray = conteudo.split(/\r?\n/).filter(nome => nome.trim() !== "");
            
            // Preenche a aba de dados originais imediatamente
            exibirDadosOriginais();
            
            arquivoCarregado = true;
            const triggerEl = document.getElementById('tab-executar');
            new bootstrap.Tab(triggerEl).show();
        };
        
        reader.readAsText(fileInput.files[0]);
    } else {
        alert("Selecione um arquivo .txt!");
    }
});

function exibirDadosOriginais() {
    const container = document.getElementById('container-lista-originais');
    const msgVazia = document.getElementById('msg-originais-vazia');
    const ul = document.getElementById('lista-nomes-originais');
    const badgeTotal = document.getElementById('total-nomes-originais'); // Referência ao novo badge

    if (nomesOriginaisArray.length > 0) {
        msgVazia.classList.add('d-none');
        container.classList.remove('d-none');

        ul.innerHTML = "";
        nomesOriginaisArray.forEach((nome, i) => {
            const li = document.createElement('li');
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.innerHTML = `
                <span>${nome}</span>
                <small class="text-muted">Posição ${i + 1}</small>
            `;
            ul.appendChild(li);
        });

        // Atualiza o texto do badge com a contagem real
        if (badgeTotal) badgeTotal.innerText = `${nomesOriginaisArray.length} nomes`;
    }
}
let meuGrafico = null; // Variável global para o gráfico

function atualizarDashboard(total, comparacoes, trocas, tempo) {
    // 1. Mostrar container e esconder mensagem
    document.getElementById('container-estatisticas').classList.remove('d-none');
    document.getElementById('msg-stats-vazia').classList.add('d-none');

    // 2. Atualizar os Cards (Formatação brasileira)
    document.getElementById('stat-total').innerText = total.toLocaleString('pt-BR');
    document.getElementById('stat-comparacoes').innerText = comparacoes.toLocaleString('pt-BR');
    document.getElementById('stat-trocas').innerText = trocas.toLocaleString('pt-BR');
    document.getElementById('stat-tempo').innerText = tempo.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

    // 3. Gerar ou Atualizar o Gráfico
    const ctx = document.getElementById('graficoStatus').getContext('2d');
    
    if (meuGrafico) {
        meuGrafico.destroy(); // Destrói o gráfico anterior para criar um novo
    }

    meuGrafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Comparações', 'Trocas', 'Tempo(ns)'],
            datasets: [{
                label: 'Métricas do Algoritmo',
                data: [comparacoes, trocas,tempo],
                backgroundColor: ['#0d6efd', '#198754', '#ffc107'],
                borderRadius: 10
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// INTEGRAÇÃO: Chame isso no final da sua barra de carregamento
// Exemplo: atualizarDashboard(20000, 199990000, 150000000, 14200.50);