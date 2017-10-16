const port = process.env.PORT || 3000;

const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuid = require("uuid/v4");
const { isNil, isEmpty, pick, prop, propEq, takeLast } = require("ramda");
const { Maybe } = require("ramda-fantasy");

const isPresent = val => !isNil(val) && !isEmpty(val);
const isBlank = val => !isPresent(val);

const app = express();

const countingBot = [{ id: "counting", name: "Counting" }];
const me = [{ id: "me", name: "Human" }];
const users = [countingBot, me];

const channelId = id => String(id);

const channels = [
    ["general", "Geral"],
    ["random", "Random"],
    ["javascripty", "Javascript"],
    ["ruby", "Ruby"],
    ["ajuda", "Ajuda"],
    ["entrevista", "Entrevista"],
  ]
  .map(([id, name]) => ({ id, name, messages: [] }));

app.use(cors());
app.use(bodyParser.json());

app.get("/me", (req, res) => res.json(me));

app.get("/users", (req, res) => res.json(users));

app.get("/channels", (req, res) =>
  res.json(channels.map(pick(["id", "name"]))));

app.get("/channels/:id/messages", (req, res) => {
  const id = channelId(req.params.id);

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
  const id = channelId(req.params.id);
  const channel = channels.find(propEq("id", id));

  if (isPresent(channel) && isPresent(req.body.message)) {
    const message = { id: uuid(), content: req.body.message };
    channel.messages.push(message);
    res.json(message);
  } else if (isBlank(req.body.message)) {
    res.status(400).json({ type: "missing_property", error: `Property "message" is required`, properties: ["message"] });
  } else {
    res.status(404).json({ type: "channel_not_found", error: "Channel not found", channel: id });
  }
});

const server = http.createServer(app);

server.listen(port, () => console.log("App listening on port", port));
