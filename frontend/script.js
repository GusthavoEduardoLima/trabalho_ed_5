
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