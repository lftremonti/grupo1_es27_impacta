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


Não se esqueça de fazer todas essas configurações para que o app funcione corretamente.
