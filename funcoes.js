const apikey = 'cur_live_yw0AbaGR6jMFvHX64FZusVj0Fv8XDDixgl5erKgg';
let taxas = {};
let taxasFiltradas = {};
let paginaAtual = 1;
const itensPorPagina = 7;

window.converterMoeda = function() {
    const base = document.getElementById("moedas").value;
    const valorEntrada = document.getElementById("valor").value;

    if (isNaN(valorEntrada) || valorEntrada === "") {
        alert("Por favor, insira um valor numérico válido.");
        return;
    }

    const url = `https://api.currencyapi.com/v3/latest?apikey=${apikey}&currencies=&base_currency=${base}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Verifique a resposta da API
            document.getElementById("tabelaConversao").style.display = "table";
            const corpoTabela = document.getElementById("corpoTabela");
            corpoTabela.innerHTML = "";

            if (data && data.data) {
                taxas = data.data;
                taxasFiltradas = { ...taxas };
                atualizarTabela(valorEntrada);
            } else {
                corpoTabela.innerHTML = "<tr><td colspan='2'>Nenhum dado disponível</td></tr>";
            }
        })
        .catch(error => {
            console.error('Erro ao obter taxas de câmbio:', error);
        });
};

function atualizarTabela(valorEntrada) {
    const corpoTabela = document.getElementById("corpoTabela");
    corpoTabela.innerHTML = "";

    const totalPaginas = Math.ceil(Object.keys(taxasFiltradas).length / itensPorPagina);
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;

    const chaves = Object.keys(taxasFiltradas);
    for (let i = inicio; i < fim && i < chaves.length; i++) {
        const moeda = chaves[i];
        const taxa = parseFloat(taxasFiltradas[moeda].value);
        const valorConvertido = (taxa * parseFloat(valorEntrada)).toFixed(8);

        const linha = `<tr>
            <td>${taxasFiltradas[moeda].code}</td>
            <td>${valorConvertido}</td>
        </tr>`;
        corpoTabela.innerHTML += linha;
    }

    atualizarControlesDePaginacao(totalPaginas);
}

function atualizarControlesDePaginacao(totalPaginas) {
    const paginacao = document.getElementById("paginacao");
    paginacao.innerHTML = "";

    const criarBotao = (texto, pagina) => {
        const botao = document.createElement("button");
        botao.textContent = texto;
        botao.onclick = () => {
            paginaAtual = pagina;
            atualizarTabela(document.getElementById("valor").value);
        };
        return botao;
    };

    if (paginaAtual > 1) {
        paginacao.appendChild(criarBotao("Anterior", paginaAtual - 1));
    }

    const totalMostrados = 3;
    let inicio = Math.max(1, paginaAtual - totalMostrados);
    let fim = Math.min(totalPaginas, paginaAtual + totalMostrados);

    for (let i = inicio; i <= fim; i++) {
        const botao = criarBotao(i, i);
        botao.className = (i === paginaAtual) ? 'active' : '';
        paginacao.appendChild(botao);
    }

    if (paginaAtual < totalPaginas) {
        paginacao.appendChild(criarBotao("Próxima", paginaAtual + 1));
    }
}

window.filtrarTabela = function() {
    const filtro = document.getElementById('filtromoeda').value.toLowerCase();
    taxasFiltradas = {};

    for (const chave in taxas) {
        if (taxas[chave].code.toLowerCase().includes(filtro)) {
            taxasFiltradas[chave] = taxas[chave];
        }
    }

    paginaAtual = 1;
    atualizarTabela(document.getElementById("valor").value);
}
