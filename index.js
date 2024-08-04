const express = require("express");
const bodyParser = require("body-parser");
const { WebhookClient } = require("dialogflow-fulfillment");
const port = 4000;

// สร้างเซิร์ฟเวอร์
const app = express();

// Middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("<h1>ยินดีต้อนรับ นี่คือ webhook สำหรับ Line Chatbot</h1>");
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
    agent.add("ยินดีต้อนรับสู่แชทบอท!");
  }

  function fallback(agent) {
    agent.add("ขออภัย, ฉันไม่เข้าใจที่คุณพูด.");
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
    agent.add(result);
  }

  function calculateRectangle(agent) {
    let width = agent.parameters.width;
    let length = agent.parameters.length;
    let result = width * length;
    agent.add("พื้นที่ของสี่เหลี่ยมผืนผ้าขนาดกว้าง " + width + " ซม. และยาว " + length + " ซม. คือ " + result + " ตร.ซม.");
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
  console.log("เซิร์ฟเวอร์ทำงานที่ http://localhost:" + port);
});
