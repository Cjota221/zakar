# Logo e favicon do Zakar

Coloque ou substitua os arquivos de marca dentro da pasta `public/`.

## Arquivos principais

- `public/logo.png`: logo principal do app.
- `public/logo secundaria.png`: versao secundaria da logo, se precisar.
- `public/fivon-zakar.png`: PNG canonico do icone usado pelo app no navegador e no manifest.
- `public/favicon.ico`: favicon classico servido pela raiz do site.
- `src/app/icon.png`: icone do App Router do Next.js.
- `src/app/favicon.ico`: favicon classico.

## Tamanhos recomendados

- Logo: PNG com fundo transparente, preferencialmente 1024x1024 ou maior.
- Favicon PNG: 512x512.
- Favicon ICO: arquivo `.ico` com tamanhos 16x16, 32x32 e 48x48.

## Observacao importante

Use apenas o nome `fivon-zakar.png`, sem espaco, para evitar duplicidade de arquivo e cache confuso no deploy.

O arquivo [src/app/layout.tsx](src/app/layout.tsx) hoje aponta os icones para `/favicon.ico` e `/fivon-zakar.png?v=2`.
Entao, se voce substituir `public/fivon-zakar.png` mantendo o mesmo nome, gere novamente `src/app/favicon.ico` e `public/favicon.ico` a partir dele para evitar o navegador mostrar um favicon antigo.
