const port = process.env.PORT || 3000;
const apiDocs = require("./swagger.json");

const http = require("http");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuid = require("uuid/v4");
const { all, isNil, isEmpty, pick, prop, propEq, takeLast, times } = require("ramda");
const { Maybe } = require("ramda-fantasy");
const faker = require("faker");
const titleize = require("titleize");

const isPresent = val => !isNil(val) && !isEmpty(val);
const isBlank = val => !isPresent(val);
const toId = id => String(id);

const app = express();

const buildUser = ({ id, name, avatar } = {}) => ({
  id: isPresent(id) ? toId(id) : uuid(),
  name: name || titleize(faker.fake("{{hacker.adjective}}  {{name.firstName}}")),
  avatar: avatar || faker.image.avatar(),
});

const buildMessage = ({ id, content, author, created_at } = {}) => ({
  id: isPresent(id) ? toId(id) : uuid(),
  content: content || faker.hacker.phrase(),
  author: buildUser(author),
  created_at: created_at || faker.date.past(),
});

const users = times(buildUser, 10);
const channels = [
    ["general", "Geral"],
    ["random", "Random"],
    ["javascripty", "Javascript"],
    ["ruby", "Ruby"],
    ["ajuda", "Ajuda"],
    ["entrevista", "Entrevista"],
  ]
  .map(([id, name]) => ({
    id,
    name,
    messages: times(() => buildMessage({ author: faker.random.arrayElement(users) }), 5)
      .sort((a, b) => b.created_at - a.created_at),
  }));

app.use(cors());
app.use(bodyParser.json());

app.get("/me", (req, res) => res.json(faker.random.arrayElement(users)));

app.get("/users", (req, res) => res.json(users));

app.get("/channels", (req, res) =>
  res.json(channels.map(pick(["id", "name"]))));

app.get("/channels/:id/messages", (req, res) => {
  const id = toId(req.params.id);

  const [status, body] = Maybe(channels.find(propEq("id", id)))
    .map(prop("messages"))
    .map(takeLast(50))
    .map(messages => [200, messages])
    .getOrElse([404, {
      type: "channel_not_found",
      error: "Channel not found",
      channel: id,
    }]);

  res.status(status).json(body);
});

app.post("/channels/:id/messages", (req, res) => {
  const channelId = toId(req.params.id);
  const userId = toId(req.body.author_id);
  const channel = channels.find(propEq("id", channelId));
  const user = users.find(propEq("id", userId));

  if (all(isPresent, [channel, user, req.body.message])) {
    const message = buildMessage({ content: req.body.message, author: user, created_at: new Date() });
    channel.messages.push(message);
    res.json(message);
  } else if (isBlank(req.body.message)) {
    res.status(400).json({ type: "missing_property", error: `Property "message" is required`, properties: ["message"] });
  } else if (isBlank(req.body.author_id)) {
    res.status(400).json({ type: "missing_property", error: `Property "author_id" is required`, properties: ["author_id"] });
  } else if (isBlank(user)) {
    res.status(404).json({ type: "user_not_found", error: "User not found", user: userId });
  } else {
    res.status(404).json({ type: "channel_not_found", error: "Channel not found", channel: id });
  }
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(apiDocs));

const server = http.createServer(app);

server.listen(port, () => console.log("App listening on port", port));
