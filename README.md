# Sistema PDV 3D

Um sistema moderno de Ponto de Venda (PDV) construído com [Next.js](https://nextjs.org/), [Prisma](https://www.prisma.io/) e [SQLite](https://www.sqlite.org/).

## 🚀 Como Instalar em Qualquer Computador

Para rodar este sistema em uma nova máquina de forma simples e rápida, preparamos um assistente de instalação com **Interface Gráfica**. Nenhum comando é necessário.

### Pré-requisitos
O computador precisa ter o **Node.js** instalado. Se não tiver, baixe e instale a versão LTS no site oficial: [https://nodejs.org/](https://nodejs.org/)

### Passo a passo da Instalação
1. Copie a pasta completa deste projeto (`Sistema-3D`) para o novo computador.
2. Acesse a pasta do projeto e dê um duplo-clique no arquivo chamado **`Instalador PDV.hta`**.
3. Uma janela bonita e interativa vai se abrir na sua tela. Basta escolher se deseja um atalho na área de trabalho e clicar em **Instalar Sistema**.
4. O assistente instalará as bibliotecas, fará a sincronização dos bancos de dados e mostrará a você as etapas em uma barrinha interativa, fechando a janela quando pronto.

## 🟢 Como Executar o Sistema Diariamente

A forma mais fácil de rodar o sistema no dia a dia é usando o atalho criado na sua Área de Trabalho pelo instalador, chamado **Sistema PDV 3D**.

Se você não tiver marcado para criar o atalho, você pode simplesmente dar um duplo-clique no arquivo **`Abrir PDV.vbs`** na pasta do projeto.

Esse script fará o seguinte:
- Inicia os serviços do sistema de forma silenciosa e invisível em segundo plano.
- Abre o seu navegador padrão acessando de forma automática a tela inicial do PDV (`http://localhost:3000`).

### Iniciando manualmente (Para Programadores)
Caso queira visualizar os logs de código e iniciar o servidor de forma manual para fins de desenvolvimento, execute no seu terminal:
```bash
npm run dev
```

## 🛠️ Tecnologias Utilizadas

- **Next.js** (App Router) e **React** para a interface.
- **Tailwind CSS** para os estilos visuais.
- **Prisma ORM** com banco de dados **SQLite** local (salvo no arquivo `dev.db`).
- Ícones via **Lucide React**.

## 📞 Notas Importantes
- Como o banco de dados é o arquivo `dev.db` que fica na raiz do projeto, tome cuidado para não deletá-lo.
- Não exclua os arquivos `.hta` e `.vbs`, eles são utilizados no visual do instalador e na execução limpa do sistema.
