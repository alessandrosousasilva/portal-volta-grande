// O evento DOMContentLoaded garante que o código só corre após o HTML estar pronto
document.addEventListener("DOMContentLoaded", function () {
  
  // Chama a função do clima
  atualizarClima();

});

// ==========================================
// WIDGET DE CLIMA (Open-Meteo API)
// ==========================================
async function atualizarClima() {
    const divClima = document.getElementById('widget-clima');
    if (!divClima) return;

    try {
        const lat = -19.747;
        const lon = -47.939;
        
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code`;

        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error("Falha na comunicação com a API");
        
        const dados = await resposta.json();

        const temp = Math.round(dados.current.temperature_2m);
        const umidade = Math.round(dados.current.relative_humidity_2m);
        const codigoTempo = dados.current.weather_code;

        let descricao = "Céu limpo";
        let icone = "☀️";

        if (codigoTempo === 1 || codigoTempo === 2 || codigoTempo === 3) {
            descricao = "Parcialmente nublado"; icone = "⛅";
        } else if (codigoTempo >= 45 && codigoTempo <= 48) {
            descricao = "Neblina"; icone = "🌫️";
        } else if (codigoTempo >= 51 && codigoTempo <= 67) {
            descricao = "Chuva leve/moderada"; icone = "🌧️";
        } else if (codigoTempo >= 80 && codigoTempo <= 82) {
            descricao = "Pancadas de chuva"; icone = "🌦️";
        } else if (codigoTempo >= 95) {
            descricao = "Tempestade"; icone = "⛈️";
        }

        divClima.innerHTML = `${icone} <strong>${temp} ºC </strong>em Uberaba — ${descricao} &nbsp;|&nbsp; 💧 ${umidade}% de humidade`;

    } catch (erro) {
        console.error("Erro ao buscar clima:", erro);
        divClima.innerHTML = "⚠️ Clima indisponível no momento";
    }
}