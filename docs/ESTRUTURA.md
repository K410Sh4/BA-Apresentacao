# Estrutura do site

- `index.html`: semântica, conteúdo e componentes da página, incluindo o canvas decorativo do hero e o diagrama SVG das camadas.
- `assets/css/styles.css`: identidade visual, layout responsivo, estados, acessibilidade, feedback tátil e animações.
- `assets/js/main.js`: navegação, acessibilidade, explorador de arquitetura, FAQ, cena procedural Canvas 2D e interações contextuais.
- `assets/icons/ba-mark.svg`: marca vetorial original do site.
- `assets/images/`: ilustrações vetoriais originais de ambientação e fallback visual.

## Renderização e desempenho

A cena do hero é uma ilustração procedural executada no Canvas 2D do navegador. Ela não lê telemetria, não representa atividade real do BA Core e não apresenta métricas operacionais. A quantidade de nós acompanha a largura da área visual; o canvas limita o pixel ratio, suspende a animação quando fica fora da tela ou quando a aba perde visibilidade e respeita `prefers-reduced-motion`.

A implementação não inclui Rust/WebAssembly porque a carga de trabalho atual é renderização de interface, já atendida pelas APIs nativas do navegador. Um módulo WASM só deve ser considerado quando existir uma tarefa computacional mensurável que justifique a compilação, a distribuição do binário e a manutenção adicional.

O site permanece estático, sem framework, sem fonte externa e sem bibliotecas JavaScript de terceiros.