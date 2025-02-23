const express = require("express");
const bodyParser = require("body-parser");
const { WebhookClient } = require("dialogflow-fulfillment");
const port = 4000;

// สร้างเซิร์ฟเวอร์
const app = express();

// Middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("<h1>Welcome, this is a webhook for Line Chatbot</h1>");
});

app.post("/webhook", (req, res) => {
  // สร้าง Webhook Client
  const agent = new WebhookClient({
    request: req,
    response: res,
  });

  console.log("Dialogflow Request headers: " + JSON.stringify(req.headers));
  console.log("Dialogflow Request body: " + JSON.stringify(req.body));

  function welcome(agent) {
    agent.add("Welcome to the chatbot!");
  }

  function fallback(agent) {
    agent.add("Sorry, I didn't understand that.");
  }

  function bodyMassIndex(agent) {
    let weight = agent.parameters.weight;
    let height = agent.parameters.height / 100;
    let bmi = (weight / (height * height)).toFixed(2);
    let result = "ขออภัย, ฉันไม่เข้าใจ.";

    if (bmi < 18.5) {
      result = "คุณผอมเกินไป, โปรดทานอาหารมากขึ้น.";
    } else if (bmi >= 18.5 && bmi <= 22.9) {
      result = "คุณมีรูปร่างดี.";
    } else if (bmi >= 23 && bmi <= 24.9) {
      result = "คุณเริ่มมีน้ำหนักเกิน.";
    } else if (bmi >= 25 && bmi <= 29.9) {
      result = "คุณอ้วนเกินไป, ควรออกกำลังกาย.";
    } else if (bmi > 30) {
      result = "คุณอ้วนเกินไป, ควรปรึกษาหมอ.";
    }
     const flexMessage = {
  "type": "bubble",
  "hero": {
    "type": "image",
    "url": "https://bucket.ex10.tech/images/b9157603-527e-11ef-891c-0242ac120003/originalContentUrl.jpg",
    "size": "full",
    "aspectRatio": "20:13",
    "aspectMode": "cover",
    "action": {
      "type": "uri",
      "uri": "https://line.me/"
    }
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": "BMI",
        "weight": "bold",
        "size": "xl"
      },
      {
        "type": "box",
        "layout": "vertical",
        "margin": "lg",
        "spacing": "sm",
        "contents": []
      }
    ]
  }
}
    agent.add(result);
  }

  function calculateRectangle(agent) {
    let width = agent.parameters.width;
    let length = agent.parameters.length;
    let result = width * length;
    agent.add("พื้นที่ของสี่เหลี่ยมขนาดกว้าง " + width + " ซม. และยาว " + length + " ซม. คือ " + result + " ตร.ซม.");
  }

  function calculateTriangle(agent) {
    let base = agent.parameters.base;
    let height = agent.parameters.height;
    let result = 0.5 * base * height;
    agent.add("พื้นที่ของรูปสามเหลี่ยมขนาดฐาน " + base + " ซม. และสูง " + height + " ซม. คือ " + result + " ตร.ซม.");
  }

  function calculateCircle(agent) {
    let radius = agent.parameters.radius;
    let pi = Math.PI;
    let result = pi * Math.pow(radius, 2);
    agent.add("พื้นที่ของวงกลมที่มีรัศมี " + radius + " ซม. คือ " + result.toFixed(2) + " ตร.ซม.");
  }

  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("BMI - custom - yes", bodyMassIndex);
  intentMap.set('area - rectangle - custom - yes', calculateRectangle);
  intentMap.set('area - circle - custom - yes', calculateCircle);
  intentMap.set('area - triangle - custom - yes', calculateTriangle);

  agent.handleRequest(intentMap);
});

app.listen(port, () => {
  console.log("Server is running at  http://localhost:" + port);
});
