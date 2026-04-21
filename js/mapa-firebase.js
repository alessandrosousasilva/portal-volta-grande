import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// SUAS CHAVES DO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyBLuYFqknF8Dd3Hrqm3zmaS1-UJEd7l-pM",
  authDomain: "portal-volta-grande.firebaseapp.com",
  projectId: "portal-volta-grande",
  storageBucket: "portal-volta-grande.firebasestorage.app",
  messagingSenderId: "989196859509",
  appId: "1:989196859509:web:83a6f6e9f62f5f40a7a03c",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let isAdmin = false;
let modoAdicaoAtivo = false;

// Elementos HTML
const btnNovoMarcador = document.getElementById("btn-novo-marcador");
const modalMapa = document.getElementById("modal-mapa");
const inputLat = document.getElementById("mapa-lat");
const inputLng = document.getElementById("mapa-lng");
const inputTitulo = document.getElementById("mapa-titulo");
const inputIcone = document.getElementById("mapa-icone"); // <-- NOVO
const inputDescricao = document.getElementById("mapa-descricao");
const btnSalvarMarcador = document.getElementById("btn-salvar-marcador");

// ==========================================
// CONFIGURAÇÃO DO MAPA LEAFLET
// ==========================================
const mapa = L.map("map").setView(
  [-19.776687974040517, -47.96645880420876],
  16,
);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(mapa);

let marcadoresAtivos = [];

onAuthStateChanged(auth, (user) => {
  isAdmin = !!user;
  if (btnNovoMarcador)
    btnNovoMarcador.style.display = isAdmin ? "inline-block" : "none";
  carregarMarcadores();
});

// ==========================================
// LER DADOS E DESENHAR ÍCONES PERSONALIZADOS
// ==========================================
async function carregarMarcadores() {
  marcadoresAtivos.forEach((marcador) => mapa.removeLayer(marcador));
  marcadoresAtivos = [];

  const querySnapshot = await getDocs(collection(db, "locais_mapa"));

  querySnapshot.forEach((documento) => {
    const local = documento.data();
    const id = documento.id;

    // Se o local for antigo e não tiver ícone, usa o 📍 por padrão
    const iconeEmoji = local.icone || "📍";

    // CRIAÇÃO DO ÍCONE VISUAL DO LEAFLET
    const meuIcone = L.divIcon({
      className: "marcador-personalizado",
      html: `<div>${iconeEmoji}</div>`,
      iconSize: [36, 36], // Tamanho do círculo
      iconAnchor: [18, 36], // Ponto de ancoragem (centro, na parte inferior)
      popupAnchor: [0, -36], // Onde a caixa de texto abre
    });

    // Adiciona ao mapa usando a nossa caixinha com o emoji
    const marcador = L.marker([local.lat, local.lng], { icon: meuIcone }).addTo(
      mapa,
    );

    let popupHTML = `
            <div style="text-align: center;">
                <h4 style="margin: 0 0 5px 0; color: #0b5ed7;">${iconeEmoji} ${local.titulo}</h4>
                <p style="margin: 0; font-size: 13px;">${local.descricao}</p>
        `;

    if (isAdmin) {
      popupHTML += `
                <button onclick="window.excluirMarcadorDoMapa('${id}')" style="margin-top: 10px; background: red; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-weight: bold;">
                    Excluir Local
                </button>
            `;
    }

    popupHTML += `</div>`;
    marcador.bindPopup(popupHTML);
    marcadoresAtivos.push(marcador);
  });
}

// ==========================================
// ADICIONAR NOVO MARCADOR
// ==========================================
btnNovoMarcador.addEventListener("click", () => {
  modoAdicaoAtivo = true;
  document.getElementById("map").style.cursor = "crosshair";
  alert("Clique no ponto exato do mapa onde deseja adicionar o novo local.");
});

mapa.on("click", function (e) {
  if (modoAdicaoAtivo) {
    inputLat.value = e.latlng.lat;
    inputLng.value = e.latlng.lng;

    inputTitulo.value = "";
    inputDescricao.value = "";
    inputIcone.selectedIndex = 0; // Reseta para a primeira opção (📍)

    modalMapa.style.display = "flex";
    modoAdicaoAtivo = false;
    document.getElementById("map").style.cursor = "grab";
  }
});

btnSalvarMarcador.addEventListener("click", async () => {
  if (!inputTitulo.value) return alert("Digite o nome do local!");

  btnSalvarMarcador.innerText = "A guardar...";
  btnSalvarMarcador.disabled = true;

  try {
    // Envia o novo campo 'icone' para a base de dados
    await addDoc(collection(db, "locais_mapa"), {
      titulo: inputTitulo.value,
      descricao: inputDescricao.value,
      icone: inputIcone.value,
      lat: parseFloat(inputLat.value),
      lng: parseFloat(inputLng.value),
    });

    modalMapa.style.display = "none";
    carregarMarcadores();
  } catch (error) {
    alert("Erro ao salvar: " + error.message);
  } finally {
    btnSalvarMarcador.innerText = "Salvar no Mapa";
    btnSalvarMarcador.disabled = false;
  }
});

// ==========================================
// EXCLUIR MARCADOR
// ==========================================
window.excluirMarcadorDoMapa = async function (id) {
  if (confirm("Tem a certeza que deseja apagar este local do mapa?")) {
    try {
      await deleteDoc(doc(db, "locais_mapa", id));
      mapa.closePopup();
      carregarMarcadores();
    } catch (error) {
      alert("Erro ao excluir: " + error.message);
    }
  }
};
