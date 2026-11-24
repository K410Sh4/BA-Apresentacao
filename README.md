# Brain Artificial — Apresentação

Site institucional estático para apresentar a proposta, a arquitetura experimental e o estado de desenvolvimento do projeto Brain Artificial.

## Estrutura

```text
.
├── index.html
├── assets/
│   ├── css/styles.css
│   ├── js/main.js
│   ├── icons/ba-mark.svg
│   └── images/
├── docs/
└── README.md
```

## Executar localmente

Não há etapa de compilação nem dependências externas. Basta abrir `index.html` em um navegador moderno. Para testar como servidor local:

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Publicação no GitHub Pages

1. Abra **Settings → Pages**.
2. Em **Build and deployment**, escolha **Deploy from a branch**.
3. Selecione `main` e a pasta `/ (root)`.
4. Salve e aguarde a publicação do GitHub Pages.

## Interações

- menu responsivo com controle de acessibilidade;
- navegação com seção ativa;
- barra real de progresso de leitura;
- revelação gradual de conteúdo;
- explorador de mecanismos com descrições atualizadas;
- FAQ expansível;
- rede computacional em Canvas 2D com movimento procedural, conexões e pulsos visuais;
- atração local e parallax discreto no destaque, acionados pelo ponteiro;
- realces contextuais em cartões, feedback de clique e microtransições;
- pausa da animação fora da área visível ou com a aba oculta;
- suporte à preferência de movimento reduzido do sistema.

## Precisão do conteúdo

O site diferencia componentes presentes no BA Core de integração em andamento e pesquisa de longo prazo. Diagramas são ilustrativos; não representam medições operacionais. A apresentação não afirma que a BA já seja um ciclo global autônomo, um produto pronto para instalação universal ou um sistema com controle irrestrito de hardware.

## Repositórios

- Projeto principal: <https://github.com/K410Sh4/BA-Brain-Artificial-by-Kaio>
- Site: <https://github.com/K410Sh4/BA-Apresentacao>