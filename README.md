# ☕ Delta Café Map

> O mapa colaborativo para descobrir onde beber e comprar Café Delta em Portugal e no Mundo.

## 🚀 Deploy Rápido

### GitHub + Netlify (recomendado)

1. **Cria um repositório no GitHub** com o nome `delta-cafe-map`
2. **Faz upload de todos os ficheiros** desta pasta para o repositório
3. **Vai ao [Netlify](https://netlify.com)** → "Add new site" → "Import an existing project"
4. Escolhe o teu repositório GitHub
5. Em **Build settings**: deixa tudo em branco (site estático puro)
6. Clica **Deploy site** — pronto! ✅

### Alternativa: Drag & Drop no Netlify
1. Vai a [app.netlify.com](https://app.netlify.com)
2. Arrasta a pasta inteira para a zona de deploy
3. O site fica online em segundos!

---

## 🗂️ Estrutura do Projeto

```
delta-cafe-map/
├── index.html          # Página principal
├── netlify.toml        # Configuração Netlify
├── css/
│   └── style.css       # Estilos completos
└── js/
    ├── data.js         # Dados base (seed locations, tipos, produtos)
    ├── gamification.js # Sistema de níveis e prémios
    ├── auth.js         # Autenticação (localStorage)
    ├── map.js          # Lógica do mapa (Leaflet)
    ├── ui.js           # Rendering de perfil, ranking, overlays
    └── app.js          # Bootstrap e estado global
```

---

## ✨ Funcionalidades

### 🗺️ Mapa Colaborativo
- Mapa interativo com mais de 25 locais pré-carregados em Portugal e Europa
- Marcadores coloridos por tipo de local
- Filtros por tipo e país
- Pesquisa em tempo real
- Localização atual do utilizador

### 👤 Perfil e Autenticação
- Registo e login com email/palavra-passe
- Sessão persistente (localStorage)
- Perfil com estatísticas detalhadas
- **Conta demo**: `admin@delta.pt` / `admin1234`

### ➕ Adicionar Locais
- Clica no mapa para marcar coordenadas
- Formulário completo: nome, tipo, país, cidade, morada, horário, produtos
- Pontos atribuídos automaticamente

### 🎮 Gamificação
| Nível | Nome | Pontos | Prémio |
|-------|------|--------|--------|
| 1 | 🌱 Curioso | 0–49 | — |
| 2 | 🗺️ Explorador | 50–149 | 10% desconto online |
| 3 | ☕ Conhecedor | 150–349 | Pack Degustação Delta |
| 4 | ⭐ Embaixador | 350–699 | Máquina Delta Q Compact |
| 5 | 🏆 Expert Delta | 700–1199 | Visita VIP Campo Maior |
| 6 | 🌟 Lenda Delta | 1200+ | Subscrição Anual Ilimitada |

### Como ganhar pontos
- 📍 Adicionar local: **+30 pts**
- ⭐ Primeiro local: **+50 pts bónus**
- 👍 Receber upvote: **+5 pts**
- ✅ Local verificado: **+20 pts**

### 🏆 Ranking
- Ranking global por pontos e por número de locais
- Tabs: Portugal vs Internacional (futuro)

---

## 🔧 Desenvolvimento Local

Não é necessário build! Basta abrir o `index.html` num servidor local:

```bash
# Com Python
python3 -m http.server 8080

# Com Node.js (npx)
npx serve .

# Com VS Code
# Instala "Live Server" extension e clica em "Go Live"
```

Depois abre `http://localhost:8080` no browser.

---

## 📈 Roadmap Futuro

- [ ] Backend real com Supabase ou Firebase (sync entre utilizadores)
- [ ] Upload de fotos dos locais
- [ ] Sistema de reviews e comentários
- [ ] Verificação de locais por moderadores
- [ ] Modo offline (PWA)
- [ ] Notificações push quando um local próximo é adicionado
- [ ] Integração com Google Maps para rotas
- [ ] Dashboard de administração

---

## 🏭 Sobre o Café Delta

O Café Delta é uma marca portuguesa de café fundada em 1961 em Campo Maior, Alentejo.
É a marca de café líder em Portugal e tem presença em todo o mundo, especialmente
nas comunidades de emigrantes portugueses na Europa.

**Website oficial**: [delta-cafes.pt](https://www.delta-cafes.pt)

---

*Este projeto é independente e não oficial. Criado pela comunidade, para a comunidade.*
