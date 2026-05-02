
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