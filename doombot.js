const telegram = require("telegram-bot-api");
const eventbrite = require("eventbrite").default;
const fs = require("fs");

console.log("hi");

// Create configured Eventbrite SDK
const sdk = eventbrite({ token: "YOUR_TOKEN" });
var api = new telegram({
  token: "YOUR_TOKEN"
});

let currentEvents = [];
let previousEvents = [];

if (fs.existsSync("events.json")) {
  fs.readFile("events.json", "utf8", (err, data) => {
    if (err) throw err;
    console.log(data);
    previousEvents = JSON.parse(data);
  });
}

sdk
  .request("/organizers/18697738348/events/?status=live")
  .then(res => {
    console.log(res.events[0], "viene mal");
    res.events.forEach(event => {
      if (previousEvents.length === 0) {
        currentEvents.push({ id: event.id });
        console.log("send the message");
        const message = `Chicas programando publicó un nuevo evento *${
          event.name.text
        }* con fecha *${event.start.local}*. Más info en: [inline URL](${
          event.url
        })`;
        api.sendMessage({
          chat_id: "-376778452",
          text: message,
          parse_mode: "markdown"
        });
      } else {
        previousEvents.forEach(past => {
          if (past.id === event.id) {
            const message = "No hay nuevos eventos";
            api.sendMessage({
              chat_id: "-376778452",
              text: message,
              parse_mode: "markdown"
            });
          } else {
            console.log("send the message");
            const message = `Chicas programando publicó un nuevo evento *${
              event.name.text
            }* con fecha *${event.start.local}*. Más info en: [inline URL](${
              event.url
            })`;
            api.sendMessage({
              chat_id: "-376778452",
              text: message,
              parse_mode: "markdown"
            });
          }
          currentEvents.push({ id: event.id });
        });
      }
    });

    fs.writeFile("events.json", JSON.stringify(currentEvents), () =>
      console.log("json file saved")
    );
  })
  .catch(e => {
    console.log(e);
  });

/*const info = {
    id: event.id,
}
currentEvents.push(JSON.stringify(info)) */
