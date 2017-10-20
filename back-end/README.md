# Back-end

A ideia é que você desenvolva uma API REST que forneça os dados dos usuários e channels através dos seguintes endpoints:

## `GET /users`

Retorna uma lista com todos os `Users`.

### Requisitos:

- Deve ler [`users.json`](users.json) e retornar um array de objetos com a estrutura de um [`User`](#user)
- O atributo `name` deve ser a junção dos valores `first_name` e `last_name`
- A lista deve estar em ordem alfabética de `name`

## `GET /channels`

Retorna uma lista com todos os `Channels`.

### Requisitos:

- Deve ler [`channels.json`](channels.json) e retornar um array de objetos com a estrutura de um [`Channel`](#channel)
- A lista deve estar em ordem alfabética de `name`

## `POST /channels/:channelId/messages`

Envia uma mensagem para o `Channel` especificado.

### Requisitos:

**Request:**

- Aceita um objeto do tipo `json` com as chaves `message (string contendo a mensagem)` e `author_id (string contendo o ID do User autor)`
- O parâmetro `message` é obrigatório, se não estiver presente deve ser um retornado um [`BadRequestError`](#badrequesterror)
- O parâmetro `author_id` é obrigatório, se não estiver presente deve ser um retornado um [`BadRequestError`](#badrequesterror)
- Deve existir um `Channel` com `id` igual a `channelId`, caso contrário deve ser um retornado um [`NotFoundError`](#notfounderror)
- Deve existir um `User` com `id` igual a `author_id`, caso contrário deve ser um retornado um [`NotFoundError`](#notfounderror)

**Response:**

- Um objeto [`Message`](#message) com a mensagem criada

## `GET /channels/:channelId/messages`

Retorna uma lista com todas as Messages do Channel especificado.

### Requisitos:

**Request:**

- Deve existir um `Channel` com `id` igual a `channelId`, caso contrário deve ser um retornado um [`NotFoundError`](#notfounderror)

**Response:**

- Deve ser uma lista de objetos com a estrutura de um [`Message`](#message)
- Deve ser ordenada em ordem decrescente de `created_at`

## Models
### User
- **id\***: `string`
- **name\***: `string`
- **avatar\*** (URL da foto do usuário): `string`

### Channel
- **id\***: `string`
- **name\***: `string`

### Message
- **id\***: `string`
- **content\*** (conteúdo da mensagem): `string`
- **created_at\*** (data de envio no formato ISO 8601): `string`
- **author\*** (usuário autor da mensagem): [`User`](#user)

### BadRequestError
Status code da resposta: 400

- **type\***(`string`): `bad_request`
- **message\***(`string`): `Parameter "nome do parâmetro" is invalid`

### NotFoundError
Status code da resposta: 404

- **type\***(`string`): `not_found`
- **message\***(`string`): `"*nome do Model*" not found`

## Linguagens aceitas
Você pode usar as bibliotecas e frameworks que preferir desde que a linguagem de programação esteja entre:

- Java
- Javascript
- PHP
- Python
- Ruby

Se você preferir *não precisa persistir as mensagens ou qualquer outro dado* em um banco de dados, você pode manter as informações em memória.