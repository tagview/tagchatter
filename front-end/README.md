# Front-end

A ideia é que você desenvolva uma aplicação web para que os usuários consigam conversar entre si através de grupos (channels). Os dados devem ser obtidos através da [API](#api) e você pode usar o [layout](layout) como base para a sua implementação.

## Requisitos funcionais
- A lista de mensagens do Channel que o usuário está visualizando deve ser atualizada a cada 3 segundos
- Ao acessar um channel o usuário deve visualizar a listagem atualizada de mensagens
- O request para enviar mensagens (`POST /channels/:channelId/messages`) falha *intencionalmente* com uma probabilidade de 25%, retornando um erro 500. Você pode desabilitar isso passando o parâmetro `stable` mas idealmente a sua implementação deve tratar esses erros aleatórios, permitindo que o usuário tente enviar a mensagem novamente. Consulte [a documentação da API](https://tagchatter.herokuapp.com/docs/#/channel/post_channels__channelId__messages) para mais detalhes.

## Requisitos técnicos
- *Os requests para a API devem ser feitos client-side*. **Não** queremos que você divida a sua aplicação em várias páginas, seguindo a estrutura Model View Controller.
- Você pode usar um dos seguintes frameworks javascript:
  - [React](https://reactjs.org/)
  - [Angular](https://angularjs.org/)
  - [Vue](https://vuejs.org/)
  - Vanilla (javascript puro)
- Você pode usar qualquer outra biblioteca adicional que achar necessário (jQuery, por exemplo)

### API
Desenvolvemos uma API REST que deve ser usada para obter os dados dos usuários, dos channels e enviar mensagens.

Você pode acessar as informações detalhadas e testar os endpoints acessando [tagchatter.herokuapp.com/docs](https://tagchatter.herokuapp.com/docs/)

## Como envio o meu desafio?
Veja mais detalhes na [seção de subimissão](https://github.com/tagview/tagchatter/blob/master/README.md#submiss%C3%A3o)
