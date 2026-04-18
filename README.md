# Portal Comunitário - Volta Grande (Uberaba/MG)

Este repositório contém o código-fonte do portal desenvolvido como **Projeto de Extensão** para a disciplina de **PROJETO INTEGRADO - EXTENSÃO** do curso de **Sistemas de Informação** da **Universidade de Uberaba (UNIUBE)**.

## 🎯 Objetivo
O projeto visa facilitar a comunicação entre a Associação de Moradores e a comunidade do bairro Volta Grande, centralizando informações de utilidade pública e promovendo a transparência de serviços locais através de uma interface web moderna e acessível.

## ⚙️ Principais Funcionalidades
- **Mapa Georreferenciado:** Visualização interativa de escolas, unidades de saúde e áreas de lazer via *Leaflet.js*.
- **Monitorização Meteorológica:** Integração com a *API OpenWeatherMap* para dados em tempo real.
- **Painel de Serviços:** Guias de coleta de resíduos e agenda cultural local.
- **Central de Contatos:** Telefone para serviços de emergência e atendimento municipal.

## 🛠️ Tecnologias e Dependências
- **Linguagens:** HTML5, CSS3 e JavaScript.
- **Mapas:** [Leaflet.js](https://leafletjs.com/) (CDN).
- **Dados:** [OpenWeatherMap API](https://openweathermap.org/api).
- **Iconografia:** [Icons8](https://icons8.com.br/) (Recursos locais em `assets/icon`).

## 📁 Estrutura de Diretórios
```text
PORTAL-VOLTA-GRANDE/
├── assets/             # Recursos de média e imagens
│   ├── icon/           # Ícones locais do sistema
│   └── ...             # Galeria de fotos do bairro
├── pages/              # Módulos internos do portal
│   ├── agenda.html     # Agenda cultural
│   ├── coleta.html     # Gestão de resíduos
│   └── telefones.html  # Contactos de emergência
├── index.html          # Dashboard principal (Home)
├── script.js           # Lógica de integração e mapas
└── style.css           # Estilização global e responsividade
