<div align="center">
  <h1>Portal Comunitário - Bairro Volta Grande</h1>
  <p><strong>Projeto de Extensão - Sistemas de Informação (UNIUBE)</strong></p>

  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" alt="JavaScript">
  <img src="https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white" alt="Leaflet">
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase">
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=Cloudinary&logoColor=white" alt="Cloudinary">
</div>

<br>

Este repositório contém o código-fonte do portal desenvolvido como **Projeto de Extensão** para a disciplina de **PROJETO INTEGRADO - EXTENSÃO** do curso de **Sistemas de Informação** da **Universidade de Uberaba (UNIUBE)**.

---

## 🎯 Objetivo
O projeto visa facilitar a comunicação entre a Associação de Moradores e a comunidade do bairro Volta Grande. Através de uma interface web moderna e acessível, o portal centraliza informações de utilidade pública, promove a transparência dos serviços locais e permite a gestão dinâmica de eventos e espaços da comunidade.

---

## 🚀 Principais Funcionalidades

- **Autenticação de Administrador:** Sistema de login seguro para a direção da Associação gerenciar o conteúdo do portal.
- **Gestão de Eventos e Galeria:** 
  - Criação de álbuns de eventos.
  - Upload direto de fotografias (otimizadas via Cloudinary).
  - Visualização de imagens (tela cheia).
- **Mapa Georreferenciado Dinâmico:** 
  - Visualização interativa via *Leaflet.js*.
  - O administrador pode adicionar novos pontos de interesse diretamente clicando no mapa, atribuindo categorias através de ícones visuais (Emojis).
- **Monitoramento Meteorológico:** Integração com a *API Open-Meteo* para fornecer dados precisos (temperatura e umidade) em tempo real da região de Uberaba.
- **Painel de Serviços:** Guias de coleta de resíduos, agenda cultural local e contatos de emergência.

---

## 🛠️ Tecnologias e Serviços Integrados

**Front-end:**
- **HTML5, CSS3** (com Flexbox/Grid e variáveis CSS) e **JavaScript** (ES6 Modules).
- **Mapas:** [Leaflet.js](https://leafletjs.com/) para georreferenciação interativa.

**Back-end as a Service (BaaS) & APIs:**
- **[Firebase](https://firebase.google.com/):** 
  - *Firestore Database:* Banco de dados NoSQL para salvar a agenda, eventos, coordenadas do mapa e links das fotos.
  - *Firebase Authentication:* Controle de acessos e permissões do administrador.
- **[Cloudinary](https://cloudinary.com/):** API para hospedagem e otimização de imagens na nuvem.
- **[Open-Meteo API](https://open-meteo.com/):** API meteorológica de código aberto.

---

## 📁 Estrutura de Diretórios e Arquivos

```text
PORTAL-VOLTA-GRANDE/
├── assets/             # Recursos de mídia e imagens estáticas
│   └── icon/           # Ícones locais do sistema
├── js/                 # Lógica de negócio e integração com APIs
│   ├── script.js             # Lógica global e API de meteorologia
│   ├── galeria-firebase.js   # CRUD da galeria de fotos e envio para Cloudinary
│   ├── mapa-firebase.js      # Integração do Leaflet com o Firestore
│   └── agenda-firebase.js    # CRUD do sistema de agenda
├── pages/              # Módulos e páginas secundárias
│   ├── agenda.html     # Agenda cultural e formulários de gestão
│   ├── coleta.html     # Informações de coleta de resíduos
│   └── telefones.html  # Contatos úteis e de emergência
├── index.html          # Dashboard principal (Home, Mapa e Galerias)
├── style.css           # Estilização global, UI/UX e responsividade
└── README.md           # Documentação do projeto
