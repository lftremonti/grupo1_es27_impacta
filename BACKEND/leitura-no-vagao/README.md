Atenção.

Para que o projeto funcione corretamente algumas configurações são necessarias:

1. Sempre atualize a branch e o arquivo package.json para buscar todas as novas melhorias. 
    a) Rode os comandos do git para atualizar o seu projeto: "git fetch" e depois "git pull".
    b) Logo apos no terminal rode o comando "npm install" isso ira installar todas as novas bibliotecas que estamos utilizando.

2. Crie o arquivo .env .
    a) O arquivo .env é um arquivo de texto utilizado para armazenar variáveis de ambiente em um projeto. Essas variáveis são valores que podem mudar de acordo com o ambiente em que a aplicação está rodando (como desenvolvimento, teste ou produção), sem que seja necessário alterar o código-fonte. Ele é amplamente usado para armazenar informações sensíveis ou que não devem ser incluídas diretamente no código, como chaves de API, credenciais de banco de dados, URLs de serviços externos, entre outros.

    b) Usar como exemplo o o arquivo .env-example ele contem as variáveis que devem ser colocadas no arquivo .env a serem preenchidas.

    c) para obter o que deve ser preenchido no arquivo e só me consultar.

3. Atualizar a variavel "URL_API" dentro do arquivo app.json .
    a) Entre no arquivo app.json e procure pela varievel URL_API, ela e responsavel pela url das nossas Apis, Caso rode na sua maquina local sempre coloque o ip da sua maquina assim rodando o expo em seu smartphone as chamadas as apis funcionaram normalmente.

    b) Caso um dia for feito o deploy iremos mudar para url aonde a APi foi hospedada.


4. Para que a API funcione corretamente, é necessário ter o PostgreSQL instalado em sua máquina.
    a) Instalar o PostgreSQL Se você ainda não tem o PostgreSQL instalado, faça o download e instalação a partir do site oficial.
    Durante a instalação, anote o nome de usuário e a senha do PostgreSQL, pois eles serão necessários para a configuração do banco de dados.
    
    b) Criar o Banco de Dados, Após instalar o PostgreSQL, crie o banco de dados chamado leituranovagao. Para isso, siga os seguintes passos:
    Abra o terminal ou o pgAdmin (ferramenta gráfica do PostgreSQL). 
    Geralmente pode ser acessado abrindo o terminal e rodando o comando "psql -U postgres".
    Execute o comando: "CREATE DATABASE leituranovagao;".

    c) Configurações de Usuário.
    Certifique-se de configurar um usuário do PostgreSQL com as permissões adequadas para acessar e modificar o banco de dados
    Crie um usuário para a aplicação, caso ainda não tenha um:
    "CREATE USER seu_usuario WITH PASSWORD 'sua_senha';"
    Dê permissões ao usuário criado para acessar e modificar o banco de dados leituranovagao:
    "GRANT ALL PRIVILEGES ON DATABASE leituranovagao TO seu_usuario;"

    d) Execute os scripts de criação das tabelas
    Para facilitar a execução dos scripts de criação do banco de dados e a realização de consultas ou configurações, recomendo a instalação do DBeaver. Essa ferramenta fornece uma interface amigável e robusta para gerenciar bancos de dados, incluindo a criação de tabelas, visualização de dados e administração do seu banco PostgreSQL.

    
Não se esqueça de fazer todas essas configurações para que o app funcione corretamente.
Qualquer duvida pode me chamar que ajudo a configurar.