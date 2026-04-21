# Portal Comunitário - Volta Grande (Uberaba/MG)

Este repositório contém o código-fonte do portal desenvolvido como **Projeto de Extensão** para a disciplina de **PROJETO INTEGRADO - EXTENSÃO** do curso de **Sistemas de Informação** da **Universidade de Uberaba (UNIUBE)**.

## 🎯 Objetivo
O projeto visa facilitar a comunicação entre a Associação de Moradores e a comunidade do bairro Volta Grande. Através de uma interface web moderna e acessível, o portal centraliza informações de utilidade pública, promove a transparência dos serviços locais e permite a gestão dinâmica de eventos e espaços da comunidade.

## 🚀 Principais Funcionalidades

O sistema evoluiu de um portal estático para uma aplicação web dinâmica (Single Page Application feel), incluindo:

- **Autenticação de Administrador:** Sistema de login seguro para a direção da Associação gerir o conteúdo do portal em tempo real.
- **Gestão de Eventos e Galeria (CRUD):** - Criação de álbuns de eventos na página inicial.
  - Upload direto de fotografias (otimizadas via Cloudinary) para criar um histórico visual do bairro.
  - Visualização de imagens em formato *Lightbox* (ecrã inteiro).
- **Mapa Georreferenciado Dinâmico:** - Visualização interativa de escolas, unidades de saúde e áreas de lazer via *Leaflet.js*.
  - O administrador pode adicionar novos pontos de interesse diretamente clicando no mapa, atribuindo categorias através de ícones visuais (Emojis).
- **Monitorização Meteorológica:** Integração com a *API Open-Meteo* para fornecer dados precisos (temperatura e humidade) em tempo real da região de Uberaba, sem necessidade de chaves de API restritivas.
- **Painel de Serviços:** Guias de recolha de resíduos, agenda cultural local e contactos de emergência.

## 🛠️ Tecnologias e Serviços Integrados

**Front-end:**
- HTML5, CSS3 (com Flexbox/Grid e variáveis CSS) e JavaScript (ES6 Modules).
- **Mapas:** [Leaflet.js](https://leafletjs.com/) (Georreferenciação).

**Back-end as a Service (BaaS) & APIs:**
- **[Firebase](https://firebase.google.com/):** - *Firestore Database:* Base de dados NoSQL para guardar a agenda, eventos, coordenadas do mapa e links das fotos.
  - *Firebase Authentication:* Controlo de acessos e permissões do administrador.
- **[Cloudinary](https://cloudinary.com/):** API para alojamento e otimização de imagens na nuvem.
- **[Open-Meteo API](https://open-meteo.com/):** API meteorológica de código aberto.

## 📁 Estrutura de Diretórios e Ficheiros

```text
PORTAL-VOLTA-GRANDE/
├── assets/             # Recursos de média e imagens estáticas
│   └── icon/           # Ícones locais do sistema
├── js/                 # Lógica de negócio e integração com APIs
│   ├── script.js             # Lógica global e API de meteorologia
│   ├── galeria-firebase.js   # CRUD da galeria de fotos e envio para Cloudinary
│   ├── mapa-firebase.js      # Integração do Leaflet com o Firestore
│   └── agenda-firebase.js    # CRUD do sistema de agenda
├── pages/              # Módulos e páginas secundárias
│   ├── agenda.html     # Agenda cultural e formulários de gestão
│   ├── coleta.html     # Informações de recolha de resíduos
│   └── telefones.html  # Contactos úteis e de emergência
├── index.html          # Dashboard principal (Home, Mapa e Galerias)
├── style.css           # Estilização global, UI/UX e responsividade
└── README.md           # Documentação do projeto
