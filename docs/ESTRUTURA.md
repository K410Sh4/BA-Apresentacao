# Estrutura do site

- `index.html`: semântica, conteúdo e componentes da página, incluindo o canvas procedural do hero e a semântica dos componentes; as ilustrações de seção são imagens WebP geradas.
- `assets/css/styles.css`: identidade visual, layout responsivo, estados, acessibilidade, feedback tátil e animações.
- `assets/js/main.js`: navegação, acessibilidade, explorador de arquitetura, FAQ, cena procedural Canvas 2D e interações contextuais.
- `assets/icons/ba-mark.svg`: marca vetorial original do site, mantida para nitidez em qualquer escala.
- `assets/images/ba-network-hero.webp`: arte gerada de rede computacional para o destaque.
- `assets/images/ba-architecture-layers.webp`: arte gerada de arquitetura holográfica em camadas.
- `assets/images/ba-planet-horizon.webp`: arte gerada de horizonte planetário para ambientação.

## Renderização e desempenho

A arte de ambientação usa imagens raster WebP geradas e otimizadas; a marca e ícones funcionais continuam vetoriais para manter nitidez e acessibilidade. A cena adicional do hero é uma ilustração procedural executada no Canvas 2D do navegador. Ela não lê telemetria, não representa atividade real do BA Core e não apresenta métricas operacionais. A quantidade de nós acompanha a largura da área visual; o canvas limita o pixel ratio, suspende a animação quando fica fora da tela ou quando a aba perde visibilidade e respeita `prefers-reduced-motion`.

A implementação não inclui Rust/WebAssembly porque a carga de trabalho atual é renderização de interface, já atendida pelas APIs nativas do navegador. Um módulo WASM só deve ser considerado quando existir uma tarefa computacional mensurável que justifique a compilação, a distribuição do binário e a manutenção adicional.

O site permanece estático, sem framework, sem fonte externa e sem bibliotecas JavaScript de terceiros.