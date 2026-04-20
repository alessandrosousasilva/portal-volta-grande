// Importando o Firebase moderno (Versão 10) diretamente via CDN da Google
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// COLOQUE AS SUAS CREDENCIAIS AQUI (Geradas no Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBLuYFqknF8Dd3Hrqm3zmaS1-UJEd7l-pM",
  authDomain: "portal-volta-grande.firebaseapp.com",
  projectId: "portal-volta-grande",
  storageBucket: "portal-volta-grande.firebasestorage.app",
  messagingSenderId: "989196859509",
  appId: "1:989196859509:web:83a6f6e9f62f5f40a7a03c",
  measurementId: "G-D2LFWP80M2",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Referências dos elementos HTML
const containerEventos = document.getElementById("container-eventos");
const btnLoginSecreto = document.getElementById("btn-login-secreto");
const modalLogin = document.getElementById("modal-login");
const modalEvento = document.getElementById("modal-evento");
const btnNovoEvento = document.getElementById("btn-novo-evento");

// Variável para saber se o Admin está logado
let isAdmin = false;

const btnSair = document.getElementById("btn-sair"); 

// ==========================================
// 1. AUTENTICAÇÃO (LOGIN E LOGOUT)
// ==========================================
btnLoginSecreto.addEventListener("click", () => {
  modalLogin.style.display = "flex";
});

document.getElementById("btn-entrar").addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const senha = document.getElementById("login-senha").value;
  try {
    await signInWithEmailAndPassword(auth, email, senha);
    modalLogin.style.display = "none";
    alert("Bem-vindo, Administrador!");
  } catch (error) {
    alert("Erro ao entrar. Verifique credenciais.");
  }
});

// === NOVA FUNÇÃO DE LOGOUT ===
btnSair.addEventListener("click", async () => {
  try {
    await signOut(auth); // Desloga do Firebase
    alert("Sessão encerrada com segurança.");
  } catch (error) {
    alert("Erro ao sair: " + error.message);
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    isAdmin = true;
    btnNovoEvento.style.display = "block";
    btnSair.style.display = "block"; // Mostra o botão Sair
  } else {
    isAdmin = false;
    btnNovoEvento.style.display = "none";
    btnSair.style.display = "none"; // Esconde o botão Sair
  }
  carregarEventos(); // Como o isAdmin mudou para false, a tela recarrega sem os botões de editar/excluir
});

// ==========================================
// 2. CRUD: LER EVENTOS
// ==========================================
async function carregarEventos() {
  // TRAVA DE SEGURANÇA: Se não achar o container na tela, para o código aqui e não dá erro!
  if (!containerEventos) return;
  
  containerEventos.innerHTML = "<p>Carregando eventos...</p>";
  const querySnapshot = await getDocs(collection(db, "eventos"));

  containerEventos.innerHTML = "";

  querySnapshot.forEach((documento) => {
    const evento = documento.data();
    const id = documento.id;

    // Verifica se a observação existe. Se sim, coloca em negrito.
    const obsHTML = evento.observacao
      ? `<p style="margin-top: 10px;"><strong>${evento.observacao}</strong></p>`
      : "";

    let cardHTML = `
            <div class="evento-card">
              <div class="evento-icone">
                <img src="../assets/icon/${evento.icone}" alt="${evento.titulo}">
              </div>
              <div class="evento-info">
                <span class="data-badge">${evento.frequencia}</span>
                <h3>${evento.titulo}</h3>
                <p>${evento.descricao}</p>
                ${obsHTML} 
              </div>
        `;

    if (isAdmin) {
      // Adicionado o data-obs para carregar a observação na hora de editar
      cardHTML += `
              <div class="admin-actions">
                <button class="btn-editar" data-id="${id}" data-titulo="${evento.titulo}" data-desc="${evento.descricao}" data-icone="${evento.icone}" data-freq="${evento.frequencia}" data-obs="${evento.observacao || ""}">Editar</button>
                <button class="btn-excluir" data-id="${id}">Excluir</button>
              </div>
            `;
    }

    cardHTML += `</div>`;
    containerEventos.insertAdjacentHTML("beforeend", cardHTML);
  });

  configurarBotoesAcao();
}

// ==========================================
// 3. CRUD: CRIAR E ATUALIZAR
// ==========================================
btnNovoEvento.addEventListener('click', () => {
    document.getElementById('evento-id').value = "";
    document.getElementById('evento-titulo').value = "";
    document.getElementById('evento-desc').value = "";
    document.getElementById('evento-icone').value = "";
    document.getElementById('evento-data').value = "";
    document.getElementById('evento-obs').value = ""; // Limpa a observação
    document.getElementById('modal-titulo').innerText = "Novo Evento";
    modalEvento.style.display = 'flex';
});

document.getElementById('btn-salvar-evento').addEventListener('click', async () => {
    const id = document.getElementById('evento-id').value;
    
    // Captura os dados do formulário, incluindo a nova observação
    const dados = {
        titulo: document.getElementById('evento-titulo').value,
        descricao: document.getElementById('evento-desc').value,
        icone: document.getElementById('evento-icone').value,
        frequencia: document.getElementById('evento-data').value,
        observacao: document.getElementById('evento-obs').value
    };

    try {
        if (id) {
            await updateDoc(doc(db, "eventos", id), dados);
        } else {
            await addDoc(collection(db, "eventos"), dados);
        }
        modalEvento.style.display = 'none';
        carregarEventos();
    } catch (error) {
        alert("Erro ao salvar: " + error.message);
    }
});

// ==========================================
// 4. CRUD: EDITAR E EXCLUIR
// ==========================================
function configurarBotoesAcao() {
    document.querySelectorAll('.btn-excluir').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            if (confirm("Tem certeza que deseja excluir este evento?")) {
                await deleteDoc(doc(db, "eventos", id));
                carregarEventos();
            }
        });
    });

    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.getElementById('evento-id').value = e.target.getAttribute('data-id');
            document.getElementById('evento-titulo').value = e.target.getAttribute('data-titulo');
            document.getElementById('evento-desc').value = e.target.getAttribute('data-desc');
            document.getElementById('evento-icone').value = e.target.getAttribute('data-icone');
            document.getElementById('evento-data').value = e.target.getAttribute('data-freq');
            document.getElementById('evento-obs').value = e.target.getAttribute('data-obs'); // Preenche a observação
            
            document.getElementById('modal-titulo').innerText = "Editar Evento";
            modalEvento.style.display = 'flex';
        });
    });
}