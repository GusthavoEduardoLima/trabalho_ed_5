
let arquivoCarregado = false;
let nomesOriginaisArray = [];
let nomesOrdenadosArray = [];
let meuGrafico = null;

document.getElementById('btnCarregar').addEventListener('click', function () {
    const fileInput = document.getElementById('fileInput');

    if (fileInput.files.length === 0) {
        alert("Selecione um arquivo .txt!");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const conteudo = e.target.result;
        nomesOriginaisArray = conteudo
            .split(/\r?\n/)
            .filter(nome => nome.trim() !== "");

        exibirDadosOriginais();

        arquivoCarregado = true;
        new bootstrap.Tab(document.getElementById('tab-executar')).show();
    };

    reader.readAsText(fileInput.files[0]);
});

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

document.getElementById('btnIrParaCarregar').addEventListener('click', function () {
    const btnCarregarTab = document.querySelector('[data-bs-target="#carregar"]');
    new bootstrap.Tab(btnCarregarTab).show();
});


document.getElementById('btnIniciarOrdenacao').addEventListener('click', async function () {
    // Guarda de segurança: impede envio de array vazio
    if (nomesOriginaisArray.length === 0) {
        alert("Nenhum dado carregado. Volte e carregue um arquivo .txt.");
        return;
    }

    const loadingModalEl = document.getElementById('loadingModal');
    const loadingModal = new bootstrap.Modal(loadingModalEl);
    const barra = document.getElementById('loading-bar');

    barra.style.width = "0%";
    barra.innerText = "0%";
    loadingModal.show();

    let progressoSimulado = 0;
    const timerBarra = setInterval(() => {
        if (progressoSimulado < 90) {
            progressoSimulado += 5;
            barra.style.width = progressoSimulado + "%";
            barra.innerText = progressoSimulado + "%";
        }
    }, 300);

    try {
        const response = await fetch('http://localhost:5000/ordenar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nomes: nomesOriginaisArray })
        });

        if (!response.ok) {
            const errTexto = await response.text();
            throw new Error(`Servidor retornou erro ${response.status}: ${errTexto}`);
        }

        const dados = await response.json();

        clearInterval(timerBarra);
        barra.style.width = "100%";
        barra.innerText = "100% - Concluído!";

        setTimeout(() => {
            loadingModal.hide();
            nomesOrdenadosArray = dados.nomes_ordenados;
            atualizarInterfaceOrdenada();
            atualizarDashboard(
                dados.total_nomes,
                dados.comparacoes,
                dados.trocas,
                dados.tempo_ns
            );

            const abaOrdenados = document.querySelector('[data-bs-target="#ordenados"]');
            if (abaOrdenados) new bootstrap.Tab(abaOrdenados).show();
        }, 600);

    } catch (erro) {
        clearInterval(timerBarra);
        loadingModal.hide();
        // Mensagem de erro detalhada no console para facilitar depuração
        console.error("Erro na ordenação:", erro);
        alert(`Erro ao conectar com o servidor.\n\nDetalhe: ${erro.message}\n\nVerifique se o Python está rodando na porta 5000.`);
    }
});


document.getElementById('btnBaixar').addEventListener('click', function () {
    window.location.href = 'http://localhost:5000/baixar';
});


function exibirDadosOriginais() {
    const container = document.getElementById('container-lista-originais');
    const msgVazia = document.getElementById('msg-originais-vazia');
    const ul = document.getElementById('lista-nomes-originais');
    const badgeTotal = document.getElementById('total-nomes-originais');

    if (nomesOriginaisArray.length > 0) {
        msgVazia.classList.add('d-none');
        container.classList.remove('d-none');
        ul.innerHTML = "";

        nomesOriginaisArray.forEach((nome, i) => {
            const li = document.createElement('li');
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.innerHTML = `<span>${nome}</span><small class="text-muted">Posição ${i + 1}</small>`;
            ul.appendChild(li);
        });

        if (badgeTotal) badgeTotal.innerText = `${nomesOriginaisArray.length} nomes`;
    }
}

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
            li.innerHTML = `<span>${nome}</span><small class="text-primary fw-bold">#${i + 1}</small>`;
            listaUl.appendChild(li);
        });

        if (badgeTotal) badgeTotal.innerText = `${nomesOrdenadosArray.length} nomes`;
    }
}
let graficoComparacoes = null;
let graficoTempo = null;

function atualizarDashboard(total, comparacoes, trocas, tempo) {
    document.getElementById('container-estatisticas').classList.remove('d-none');
    document.getElementById('msg-stats-vazia').classList.add('d-none');

    document.getElementById('stat-total').innerText = total.toLocaleString('pt-BR');
    document.getElementById('stat-comparacoes').innerText = comparacoes.toLocaleString('pt-BR');
    document.getElementById('stat-trocas').innerText = trocas.toLocaleString('pt-BR');
    document.getElementById('stat-tempo').innerText = tempo.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

    if (graficoComparacoes) graficoComparacoes.destroy();
    if (graficoTempo) graficoTempo.destroy();

    // --- Gráfico 1: Comparações e Trocas ---
    const ctx1 = document.getElementById('graficoComparacoes').getContext('2d');
    graficoComparacoes = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['Comparações', 'Trocas'],
            datasets: [{
                data: [comparacoes, trocas],
                backgroundColor: ['#0d6efd', '#198754'],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const unidades = ['comparações', 'trocas'];
                            return ` ${context.raw.toLocaleString('pt-BR')} ${unidades[context.dataIndex]}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'logarithmic',
                    title: { display: true, text: 'Escala logarítmica' },
                    ticks: {
                        callback: function (valor) {
                            return valor.toLocaleString('pt-BR');
                        }
                    }
                }
            }
        }
    });

    // --- Gráfico 2: Tempo ---
    const ctx2 = document.getElementById('graficoTempo').getContext('2d');
    graficoTempo = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['Tempo de Execução'],
            datasets: [{
                data: [tempo],
                backgroundColor: ['#ffc107'],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return ` ${context.raw.toLocaleString('pt-BR')} ns`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Nanossegundos (ns)' },
                    ticks: {
                        callback: function (valor) {
                            return valor.toLocaleString('pt-BR');
                        }
                    }
                }
            }
        }
    });
}