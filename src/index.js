(function($) {
  var apiUrl = "https://tagchatter.herokuapp.com";

  function fetchParrotsCount() {
    return fetch(apiUrl + "/messages/parrots-count")
      .then(function(response) {
        return response.json();
      })
      .then(function(count) {
        $("#parrots-counter").text(count);
      });
  }

  function listMessages() {
    // Faz um request para a API de listagem de mensagens
    // Atualiza a o conteúdo da lista de mensagens
    // Deve ser chamado a cada 3 segundos
  }

  function parrotMessage(messageId) {
    // Faz um request para marcar a mensagem como parrot no servidor
    // Altera a mensagem na lista para que ela apareça como parrot na interface
  }

  function sendMessage(message, authorId) {
    // Manda a mensagem para a API quando o usuário envia a mensagem
    // Caso o request falhe chama Window.alert para exibir uma mensagem para o usuário
    // Se o request for bem sucedido, atualiza o conteúdo da lista de mensagens
  }

  function getMe() {
    // Faz um request para pegar os dados do usuário atual
    // Exibe a foto do usuário atual na tela e armazena o seu ID para quando ele enviar uma mensagem
  }

  function initialize() {
    fetchParrotsCount();
  }

  initialize();
})(window.jQuery);