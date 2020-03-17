# INSTRUÇÕES

## Para acessar o servidor

http://34.225.114.208:4000/login

usuario: admin@gaivota | senha: admin

# TESTE TÉCNICO FULLSTACK

## Introduction
O repositório que você recebeu contém um projeto inicial com o código do frontend. Ele
já possui uma rota configurada para o login que está fazendo autenticação com o backend
usando JWT.
Segue, em anexo, wireframes e uma série de dados que pode ser consumida em forma
de JSON. Implemente o sistema exposto usando React. A API deve ser implementada
utilizando Node e o banco utilizando MongoDB - que já está pré configurado - ou MySQL se
preferir mudar as configurações.
Será necessário implementar o mapa utilizando o pacote Leaflet com GEOJson. O
sistema desenhado simula um cenário de leilão de produção das fazendas. Na primeira tela
será mostrado um mapa com diversas fazendas e informações sobre elas. Também será
necessário criar um CRUD para os dados das fazendas fornecidas nos CSV’s (farms.csv,
farms_ndvi.csv, farms_precipitation.csv) e consumir as rotas no frontend.
Ao clicar em uma das fazendas, o sistema terá que redirecionar o usuário para a
segunda tela, onde há mais detalhes sobre a fazenda escolhida. Nessa segunda tela, o usuário
poderá optar por fazer a compra ou um lance (bid) parcial ou total da produção estimada da
fazenda. A oferta é sempre feita em preço por sacas e/ou quantia de sacas desejadas.
Para a apresentação final, você precisará mostrar o sistema do frontend e backend em
funcionamento completo e apresentar sua estrutura e código.
Além do desenvolvimento acima, você deverá resolver um dos desafios descritos
abaixo:
 

## Desafio 1

Desafio 1
Construir um gerador de gráfico dinâmico (usando qualquer biblioteca de gráficos)
controlado por um select que deve ser montado a partir do arquivo
client/src/config/chart_selector.json. Os dados que serão representados no gráfico estão nos
arquivos data/farms_ndvi.csv e data/farms_precipitation.csv.

Regras:
- Todas as informações contidas no arquivo JSON deverão ser utilizadas para montar o
select;
- É permitido transformar os dados CSV em JSON e salvá-lo (prefetch dos dados) ou
fazer o parser em tempo real;
- Pode ser feito um HTTP request para o backend ou a importação dos dados em uma
pasta no projeto;
- O código deverá ser o mais dinâmico possível, pois a avaliação será feita com outras
fontes de dados.

## Desafio 2

Construa uma rota GET /challenge/encode/:number que deverá transformar a variável
number em um código com um número fixo de seis caracteres. E uma rota GET
/challenge/decode/:code que irá decodificar o resultado da primeira rota e retornar o number
inicial.

Regras:
- Considere uma variável number inteira com oito dígitos no máximo.
- O alfabeto pode conter os seguintes códigos: a-z, A-Z, 0-9, !@#$%*()|-_=+^/?

Exemplo:

GET /challenge/encode/1234
return ABCDEF

GET /challenge/decode/ABCDEF
return 1234

