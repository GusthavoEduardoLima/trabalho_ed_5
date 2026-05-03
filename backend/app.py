import time
import subprocess
import sys

def verificar_e_instalar_flask():
    try:
        import flask
        import flask_cors
        print("Flask e Flask-CORS já estão instalados.")
    except ImportError:
        print("Flask ou Flask-CORS não encontrados. Instalando agora...")
        # Executa o comando de instalação do pip
        subprocess.check_call([sys.executable, "-m", "pip", "install", "flask", "flask-cors"])
        print("Instalação concluída com sucesso!")

# Chama a função antes de iniciar o seu app.py
verificar_e_instalar_flask()
from flask import Flask, jsonify, request
from flask_cors import CORS
app = Flask(__name__)
CORS(app) 


class Node:
    def __init__(self, dado):
        self.dado = dado
        self.next = None

class Cliente:
    def __init__(self):
        self.head = None
        self.total_nomes = 0
        self.comparacoes = 0
        self.trocas = 0
        self.tempo_ns = 0.0

    def adicionar(self, dado):
        novo = Node(dado)
        self.total_nomes += 1
        if self.head is None:
            self.head = novo
        else:
            atual = self.head
            while atual.next:
                atual = atual.next
            atual.next = novo

    def insertion_sort(self):
        if self.head is None or self.head.next is None: return
        ordenada = None
        atual = self.head
        self.comparacoes = 0
        self.trocas = 0

        while atual is not None:
            proximo = atual.next
            if ordenada is None or atual.dado < ordenada.dado:
                self.comparacoes += 1
                atual.next = ordenada
                ordenada = atual
                self.trocas += 1
            else:
                busca = ordenada
                while busca.next is not None and busca.next.dado < atual.dado:
                    self.comparacoes += 1
                    busca = busca.next
                atual.next = busca.next
                busca.next = atual
                self.trocas += 1
            atual = proximo
        self.head = ordenada

    
    def para_lista_python(self):
        """
        Converte lista encadeada para lista Python apenas para retornar no JSON
        (Isso NÃO é usar lista Python para ordenar, apenas para retornar)
        """
        resultado = []
        atual = self.head
        while atual:
            resultado.append(atual.dado)
            atual = atual.next
        return resultado

import os
from flask import send_file

# Caminho onde o arquivo será salvo temporariamente no seu sistema

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 2. Une esse caminho ao nome do arquivo
# O resultado será: C:\...\backend\nomes_ordenados.txt
CAMINHO_ARQUIVO = os.path.join(BASE_DIR, 'nomes_ordenados.txt')
@app.route('/ordenar', methods=['POST'])
def rota_ordenar():
    dados_recebidos = request.json.get('nomes', [])
    lista_encadeada = Cliente()
    for nome in dados_recebidos:
        lista_encadeada.adicionar(nome)

    inicio = time.perf_counter()
    lista_encadeada.insertion_sort()
    fim = time.perf_counter()
    
    tempo_ns = (fim - inicio) * 1_000_000_000

    # --- NOVO: Python cria o arquivo no disco ---
    nomes_ordenados = lista_encadeada.para_lista_python()
    with open(CAMINHO_ARQUIVO, "w", encoding="utf-8") as f:
        f.write("\n".join(nomes_ordenados))

    return jsonify({
        "total_nomes": lista_encadeada.total_nomes,
        "comparacoes": lista_encadeada.comparacoes,
        "trocas": lista_encadeada.trocas,
        "tempo_ns": int(tempo_ns),
        "nomes_ordenados": nomes_ordenados
    })

# --- NOVA ROTA: Envia o arquivo criado ---
@app.route('/baixar', methods=['GET'])
def baixar_arquivo():
    if os.path.exists(CAMINHO_ARQUIVO):
        return send_file(CAMINHO_ARQUIVO, as_attachment=True)
    return jsonify({"erro": "Arquivo não encontrado"}), 404
if __name__ == '__main__':
    app.run(port=5000, debug=True)
   