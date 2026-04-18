// O evento DOMContentLoaded garante que o mapa só carregue após o HTML estar pronto
document.addEventListener("DOMContentLoaded", function () {
  // Inicializa o mapa focado no Volta Grande
  const map = L.map("mapa-volta-grande").setView(
    [-19.7759837033222, -47.96670524331588],
    17,
  );

  // Carrega o visual das ruas (TileLayer) usando o OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap",
  }).addTo(map);

  // Função para criar ícones com Emojis no mapa
  function criarIcone(emoji, corBorda = "#0000009e") {
    return L.divIcon({
      // box-sizing: border-box garante que o tamanho total exato seja 30x30px
      html: `<div style="box-sizing: border-box; font-size: 16px; background: white; border-radius: 50%; border: 2px solid ${corBorda}; display: flex; justify-content: center; align-items: center; width: 30px; height: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${emoji}</div>`,
      className: "custom-div-icon",
      iconSize: [30, 30], // Tamanho exato do HTML acima
      iconAnchor: [15, 15], // Exatamente a metade de 30, apontando o centro na coordenada
      popupAnchor: [0, -15], // Faz o balão abrir logo acima do ícone
    });
  }

  // Array de Locais
  // Cada objeto tem coordenadas, emoji, título e descrição para o popup
  const locais = [
    {
      coords: [-19.776957942678884, -47.968046994211555],
      emoji: "🌳",
      titulo: "Praça Leontina Nascimento",
      desc: "O coração do nosso bairro.",
    },
    {
      coords: [-19.77597553447722, -47.963332882268354],
      emoji: "♻️",
      titulo: "Eco-ponto",
      desc: "Local de coleta de resíduos recicláveis.",
    },
    {
      coords: [-19.77674930629258, -47.96847196556026],
      emoji: "🛹",
      titulo: "Pista de Skate",
      desc: "Local de lazer para os jovens.",
    },
    {
      coords: [-19.77713375088828, -47.968452575121994],
      emoji: "🥗",
      titulo: "Feira Livre",
      desc: "Toda sexta-feira na Av. Argemiro Coelho Silva.",
    },
    {
      coords: [-19.776596825321132, -47.96880069376318],
      emoji: "⚽",
      titulo: "Quadra de Esportes",
      desc: "Lazer e saúde para a comunidade.",
    },
    {
      coords: [-19.77722566680381, -47.967559749832375],
      emoji: "🏥",
      titulo: "UMS Luiz Meneghello",
      desc: "Atendimento médico local.",
    },
    {
      coords: [-19.77713993412404, -47.967300234235836],
      emoji: "⛪",
      titulo: "Paróquia Cristo Bom Pastor",
      desc: "Comunidade religiosa.",
    },
    {
      coords: [-19.77557855207788, -47.96711249948216],
      emoji: "🎒",
      titulo: "Escola Mun. Madre Maria Georgina",
      desc: "Ensino fundamental.",
    },
    {
      coords: [-19.776765827326226, -47.96388511918378],
      emoji: "🧸",
      titulo: "CEMEI Solange Aparecida",
      desc: "Educação infantil.",
    },
    {
      coords: [-19.77453935421161, -47.967935219213594],
      emoji: "🎒",
      titulo: "Escola Est. Carmelita C. Garcia",
      desc: "Ensino médio e fundamental.",
    },
  ];

  // Loop que cria todos os marcadores automaticamente no mapa
  locais.forEach((local) => {
    L.marker(local.coords, { icon: criarIcone(local.emoji) })
      .addTo(map)
      .bindPopup(`<b>${local.emoji} ${local.titulo}</b><br>${local.desc}`);
  });

  // Chama a função do clima aqui dentro para garantir que o HTML já existe
  buscarClima();
});

// === FUNÇÃO DE CLIMA ===
async function buscarClima() {
  const apiKey = "2c51f53e14f402123f518b63cdf4d002"; //API da OpenWeatherMap
  const cidade = "Uberaba,BR";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=metric&lang=pt_br&appid=${apiKey}`;

  try {
    // Busca os dados APENAS UMA VEZ
    const resposta = await fetch(url);

    // Verifica se a API bloqueou antes de tentar ler os dados
    if (!resposta.ok) {
      throw new Error("Falha na comunicação com o servidor de clima.");
    }

    // Converte a resposta recebida para JSON
    const dados = await resposta.json();

    const temp = Math.round(dados.main.temp); // Arredonda a temperatura para o número inteiro
    const desc = dados.weather[0].description; // Descrição do clima
    const icone = dados.weather[0].icon; // Código do ícone para mostrar a imagem correspondente
    const umidade = dados.main.humidity; // Porcentagem de umidade

    // Deixa a primeira letra da descrição do tempo em Maiúscula
    const descFormatada = desc.charAt(0).toUpperCase() + desc.slice(1);

    // Atualiza o conteúdo do elemento HTML com as informações do clima
    document.getElementById("clima-texto").innerHTML = `
        <img src="https://openweathermap.org/img/wn/${icone}.png" alt="clima">
        <strong>${temp}°C</strong> em Uberaba — ${descFormatada} | 💧 ${umidade}% de umidade
    `;

    // Em caso de erro, exibe uma mensagem genérica e registra o erro no console para facilitar o diagnóstico
  } catch (error) {
    console.error("Erro no Widget de Clima:", error); 
    document.getElementById("clima-texto").innerText =
      "Uberaba: Clima indisponível no momento";
  }
}
