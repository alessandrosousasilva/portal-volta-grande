import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
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

// SUAS CHAVES DO CLOUDINARY
const CLOUD_NAME = "dmcnphgaw";
const UPLOAD_PRESET = "j59zcgh6";

let isAdmin = false;
let albumAtual = "";

// Elementos HTML (Álbuns/Capa)
const gridAlbuns = document.getElementById("grid-albuns");
const btnNovoAlbum = document.getElementById("btn-novo-album");
const modalAlbum = document.getElementById("modal-album");
const tituloModalAlbum = document.getElementById("titulo-modal-album");
const inputAlbumId = document.getElementById("album-id");
const inputAlbumCapaAntiga = document.getElementById("album-capa-antiga");
const inputAlbumTitulo = document.getElementById("album-titulo");
const inputAlbumDescricao = document.getElementById("album-descricao"); // <--- NOVO CAMPO AQUI
const inputAlbumCapa = document.getElementById("album-capa");
const btnSalvarAlbum = document.getElementById("btn-salvar-album");

// Elementos HTML (Fotos Internas)
const modalGaleria = document.getElementById("modal-galeria");
const tituloGaleria = document.getElementById("titulo-galeria");
const areaUpload = document.getElementById("area-upload-admin");
const gridInterna = document.getElementById("grid-fotos-interna");
const inputFoto = document.getElementById("input-foto");
const btnUploadFoto = document.getElementById("btn-upload");
const modalLightbox = document.getElementById("modal-lightbox");
const imgLightbox = document.getElementById("img-lightbox");
const btnSair = document.getElementById("btn-sair");

// 1. Verifica login do Admin
onAuthStateChanged(auth, (user) => {
  isAdmin = !!user;
  btnNovoAlbum.style.display = isAdmin ? "inline-block" : "none";
  if (btnSair) btnSair.style.display = isAdmin ? "inline-block" : "none";
  carregarAlbuns();
});

// ==========================================
// PARTE 1: CRUD DOS ÁLBUNS (CARTÕES DA HOME)
// ==========================================

async function carregarAlbuns() {
  gridAlbuns.innerHTML = "<p>Carregando eventos...</p>";
  const querySnapshot = await getDocs(collection(db, "albuns"));
  gridAlbuns.innerHTML = "";

  querySnapshot.forEach((documento) => {
    const album = documento.data();
    const id = documento.id;

    // Tratamento para evitar que álbuns antigos sem descrição deem erro
    const textoDescricao = album.descricao ? album.descricao : "";

    // O HTML do cartão agora inclui a descrição
    let html = `
      <div class="foto-item">
        <div class="imagem-container album-clicavel" data-album="${id}" data-titulo="${album.titulo}" style="cursor: pointer;">
          <img src="${album.capaUrl}" alt="${album.titulo}">
        </div>
        <p style="font-weight: bold; margin-top: 10px; margin-bottom: 5px;">${album.titulo}</p>
        <p style="font-size: 0.85rem; color: #666; padding: 0 10px 15px 10px;">${textoDescricao}</p>
    `;

    if (isAdmin) {
      html += `
        <div style="display:flex; justify-content:center; gap:10px; margin-bottom:10px;">
          <button class="btn-editar-album" data-id="${id}" data-titulo="${album.titulo}" data-descricao="${textoDescricao}" data-capa="${album.capaUrl}" style="background:#3498db; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Editar</button>
          <button class="btn-excluir-album" data-id="${id}" style="background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Excluir</button>
        </div>
      `;
    }

    html += `</div>`;
    gridAlbuns.insertAdjacentHTML("beforeend", html);
  });

  configurarAcoesDosAlbuns();
}

function configurarAcoesDosAlbuns() {
  document.querySelectorAll(".album-clicavel").forEach((cartao) => {
    cartao.addEventListener("click", () => {
      albumAtual = cartao.getAttribute("data-album");
      tituloGaleria.innerText = "Álbum: " + cartao.getAttribute("data-titulo");
      areaUpload.style.display = isAdmin ? "block" : "none";
      modalGaleria.style.display = "flex";
      carregarFotosDoAlbum(albumAtual);
    });
  });

  // Editar: preenche o título e a descrição
  document.querySelectorAll(".btn-editar-album").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      inputAlbumId.value = e.target.getAttribute("data-id");
      inputAlbumTitulo.value = e.target.getAttribute("data-titulo");
      inputAlbumDescricao.value = e.target.getAttribute("data-descricao"); // Puxa a descrição do banco
      inputAlbumCapaAntiga.value = e.target.getAttribute("data-capa");
      tituloModalAlbum.innerText = "Editar Evento";
      modalAlbum.style.display = "flex";
    });
  });

  document.querySelectorAll(".btn-excluir-album").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      if (!confirm("Excluir este evento? (As fotos internas ficarão órfãs)"))
        return;
      const id = e.target.getAttribute("data-id");
      await deleteDoc(doc(db, "albuns", id));
      carregarAlbuns();
    });
  });
}

btnNovoAlbum.addEventListener("click", () => {
  inputAlbumId.value = "";
  inputAlbumTitulo.value = "";
  inputAlbumDescricao.value = ""; // Limpa a descrição ao criar um novo
  inputAlbumCapa.value = "";
  tituloModalAlbum.innerText = "Novo Evento";
  modalAlbum.style.display = "flex";
});

btnSalvarAlbum.addEventListener("click", async () => {
  if (!inputAlbumTitulo.value) return alert("Digite um título!");

  btnSalvarAlbum.innerText = "Salvando...";
  btnSalvarAlbum.disabled = true;

  let urlCapaFinal = inputAlbumCapaAntiga.value;

  try {
    if (inputAlbumCapa.files.length > 0) {
      urlCapaFinal = await fazerUploadCloudinary(inputAlbumCapa.files[0]);
    } else if (!urlCapaFinal) {
      alert("É obrigatório colocar uma foto de capa para novos eventos!");
      btnSalvarAlbum.innerText = "Salvar Cartão";
      btnSalvarAlbum.disabled = false;
      return;
    }

    // O OBJETO AGORA SALVA A DESCRIÇÃO NO FIREBASE
    const dadosDoAlbum = {
      titulo: inputAlbumTitulo.value,
      descricao: inputAlbumDescricao.value,
      capaUrl: urlCapaFinal,
    };

    if (inputAlbumId.value) {
      await updateDoc(doc(db, "albuns", inputAlbumId.value), dadosDoAlbum);
    } else {
      await addDoc(collection(db, "albuns"), dadosDoAlbum);
    }

    modalAlbum.style.display = "none";
    carregarAlbuns();
  } catch (error) {
    alert("Erro ao salvar: " + error.message);
  } finally {
    btnSalvarAlbum.innerText = "Salvar Cartão";
    btnSalvarAlbum.disabled = false;
  }
});

// Ação do Botão Sair (Logout)
if (btnSair) {
  btnSair.addEventListener("click", async () => {
    try {
      await signOut(auth);
      alert("Sessão terminada com sucesso!");
      window.location.reload();
    } catch (error) {
      alert("Erro ao sair: " + error.message);
    }
  });
}

// ==========================================
// PARTE 2: FOTOS INTERNAS DO ÁLBUM
// ==========================================

async function carregarFotosDoAlbum(albumId) {
  gridInterna.innerHTML = "<p>Carregando fotos...</p>";
  const q = query(collection(db, "galeria"), where("album", "==", albumId));
  const querySnapshot = await getDocs(q);
  gridInterna.innerHTML = "";

  if (querySnapshot.empty) {
    gridInterna.innerHTML = "<p>Nenhuma foto neste álbum ainda.</p>";
    return;
  }

  querySnapshot.forEach((documento) => {
    const foto = documento.data();
    const id = documento.id;
    let html = `<div class="foto-modal-item"><img src="${foto.url}" alt="Foto" class="img-miniatura">`;
    if (isAdmin)
      html += `<button class="btn-excluir-foto" data-id="${id}">X</button>`;
    html += `</div>`;
    gridInterna.insertAdjacentHTML("beforeend", html);
  });

  configurarBotoesExcluirFotos();
  configurarCliqueNasFotos();
}

btnUploadFoto.addEventListener("click", async () => {
  const arquivo = inputFoto.files[0];
  if (!arquivo) return alert("Selecione uma foto!");

  btnUploadFoto.innerText = "A enviar...";
  btnUploadFoto.disabled = true;

  try {
    const urlDaFoto = await fazerUploadCloudinary(arquivo);
    await addDoc(collection(db, "galeria"), {
      album: albumAtual,
      url: urlDaFoto,
    });
    inputFoto.value = "";
    carregarFotosDoAlbum(albumAtual);
  } catch (error) {
    alert("Erro: " + error.message);
  } finally {
    btnUploadFoto.innerText = "Salvar Foto";
    btnUploadFoto.disabled = false;
  }
});

function configurarBotoesExcluirFotos() {
  document.querySelectorAll(".btn-excluir-foto").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      if (!confirm("Apagar esta foto?")) return;
      await deleteDoc(doc(db, "galeria", e.target.getAttribute("data-id")));
      carregarFotosDoAlbum(albumAtual);
    });
  });
}

function configurarCliqueNasFotos() {
  document.querySelectorAll(".img-miniatura").forEach((img) => {
    img.addEventListener("click", (e) => {
      imgLightbox.src = e.target.src;
      modalLightbox.style.display = "flex";
    });
  });
}

// ==========================================
// FUNÇÃO AJUDANTE: UPLOAD CLOUDINARY
// ==========================================
async function fazerUploadCloudinary(arquivo) {
  const formData = new FormData();
  formData.append("file", arquivo);
  formData.append("upload_preset", UPLOAD_PRESET);
  const resposta = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData },
  );
  const dados = await resposta.json();
  if (dados.secure_url) return dados.secure_url;
  throw new Error("Falha ao gerar link");
}

// AÇÃO DO BOTÃO SAIR (LOGOUT)
if (btnSair) {
  btnSair.addEventListener("click", async () => {
    try {
      await signOut(auth);
      alert("Sessão terminada com sucesso!");
      window.location.reload(); // Recarrega a página para atualizar a interface (esconder botões)
    } catch (error) {
      alert("Erro ao sair: " + error.message);
    }
  });
}
