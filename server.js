const port = process.env.PORT || 3000;
const parseInt10 = string => parseInt(string, 10);
const pollingInterval = (process.env.POLLING_INTERVAL && parseInt10(process.env.POLLING_INTERVAL)) || 2000;
const messagesLimit = (process.env.MESSAGES_LIMIT && parseInt10(process.env.MESSAGES_LIMIT)) || 200;
const apiDocs = require("./swagger.json");
const successPercentage = parseFloat(process.env.SUCCESS_PERCENTAGE) || 0.75;

const http = require("http");
const express = require("express");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuid = require("uuid/v4");
const { all, isNil, isEmpty, pick, prop, propEq, takeLast, times, merge } = require("ramda");
const { Maybe } = require("ramda-fantasy");
const faker = require("faker");
const titleize = require("titleize");
const random = require("random-js");

const isPresent = val => !isNil(val) && !isEmpty(val);
const isBlank = val => !isPresent(val);
const toId = id => String(id);

const app = express();

const buildUser = ({ id, name, avatar } = {}) => {
  const userId = isPresent(id) ? toId(id) : uuid();

  return {
    id: userId,
    name: name || titleize(faker.fake("{{hacker.adjective}} {{name.firstName}}")),
    avatar: avatar || `https://robohash.org/size_100x100/${userId}.png`,
  };
};

const buildMessage = ({ id, content, author, created_at, has_parrot } = {}) => ({
  id: isPresent(id) ? toId(id) : uuid(),
  content: content || faker.hacker.phrase(),
  author: buildUser(author),
  created_at: created_at || faker.date.past(),
  has_parrot: isPresent(has_parrot) ? has_parrot : false,
});

const users = [
  "laverne_jacobi11",
  "noelia_christiansen",
  "kevin_heaney",
  "ulises.rath",
  "mona_mueller",
  "elinor.klein17",
  "gunnar_gerhold",
  "ramona_davis74",
  "gerald47",
  "kieran56",
]
  .map(id => buildUser({ id }));

let messages = times(() => buildMessage({ author: faker.random.arrayElement(users) }), 5)
  .sort((a, b) => b.created_at - a.created_at);

setInterval(() => {
  const author = faker.random.arrayElement(users);
  const message = buildMessage({ author, created_at: new Date() });
  messages = takeLast(messagesLimit, [...messages, message]);
}, pollingInterval);

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("combined"));

app.get("/me", (req, res) => res.json(faker.random.arrayElement(users)));

app.get("/users", (req, res) => res.json(users));

app.get("/messages", (req, res) => {
  const id = toId(req.params.id);

  res.status(200).json(takeLast(messagesLimit, messages));
});

app.post("/messages", (req, res) => {
  const userId = toId(req.body.author_id);
  const user = users.find(propEq("id", userId));
  const shouldSucceed = /true/i.test(req.query.stable) || random.bool(successPercentage)(random.engines.nativeMath)

  if (all(isPresent, [user, req.body.message])) {
    if (shouldSucceed) {
      const message = buildMessage({ content: req.body.message, author: user, created_at: new Date() });
      messages.push(message);
      res.json(message);
    } else {
      res.status(500).json({ type: "internal_error", error: "Unexpected error" });
    }
  } else if (isBlank(req.body.message)) {
    res.status(400).json({
      type: "missing_property",
      error: 'Property "message" is required',
      properties: ["message"],
    });
  } else if (isBlank(req.body.author_id)) {
    res.status(400).json({
      type: "missing_property",
      error: 'Property "author_id" is required',
      properties: ["author_id"],
    });
  } else if (isBlank(user)) {
    res.status(404).json({ type: "user_not_found", error: "User not found", user: userId });
  }
});

app.put("/messages/:id/parrot", (req, res) => {
  const id = toId(req.params.id);
  const message = messages.find(propEq("id", id));

  if (isPresent(message)) {
    const messageWithParrot = buildMessage(merge(message, { has_parrot: true }));

    messages = messages.map(message => message.id === id ? messageWithParrot : message);

    res.json(messageWithParrot);
  } else {
    res.status(404).json({ type: "message_not_found", error: "Message not found", message: id });
  }
});

app.put("/messages/:id/unparrot", (req, res) => {
  const id = toId(req.params.id);
  const message = messages.find(propEq("id", id));

  if (isPresent(message)) {
    const messageWithoutParrot = buildMessage(merge(message, { has_parrot: false }));

    messages = messages.map(message => message.id === id ? messageWithoutParrot : message);

    res.json(messageWithoutParrot);
  } else {
    res.status(404).json({ type: "message_not_found", error: "Message not found", message: id });
  }
});

app.get("/messages/parrots-count", (req, res) => {
  const parrotsCount = messages.filter(propEq("has_parrot", true)).length;

  res.json(parrotsCount);
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(apiDocs));

const server = http.createServer(app);

server.listen(port, () => console.log("App listening on port", port));
