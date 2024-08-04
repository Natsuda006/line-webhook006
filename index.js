const express = require("express");
const bodyParser = require("body-parser");
const { WebhookClient, Payload } = require("dialogflow-fulfillment");
const port = 4000;

//create server
const app = express();

//middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("<h1>Welcome, this is a webhook for Line Chatbot</h1>");
});

app.post("/webhook", (req, res) => {
  //create webhook client
  const agent = new WebhookClient({
    request: req,
    response: res,
  });

  console.log("Dialogflow Request headers: " + JSON.stringify(req.headers));
  console.log("Dialogflow Request body: " + JSON.stringify(req.body));
  function welcome(agent) {
    agent.add();
  }
  function fallback(agent) {
    agent.add();
    agent.add();
  }

  function bodyMassIndex(agent) {
    let weight = agent.parameters.weight;
    let height = agent.parameters.height / 100;
    let bmi = (weight / (height * height)).toFixed(2);
    let result = "ขออภัย หนูไม่เข้าใจ";

    if (bmi < 18.5) {
      result = "คุณผอมไป กินข้าวบ้างนะ";
    } else if (bmi >= 18.5 && bmi <= 22.9) {
      result = "คุณหุ่นดีจุงเบย";
    } else if (bmi >= 23 && bmi <= 24.9) {
      result = "คุณเริ่มจะท้วมแล้วนะ";
    } else if ((bmi >= 25.8) & (bmi <= 29.9)) {
      result = "คุณอ้วนละ ออกกำลังกายหน่อยนะ";
    } else if (bmi > 30) {
      result = "คุณอ้วนเกินไปละ หาหมอเหอะ";
    }
    const flexMessage = {};
    agent.add(result);
}


   function calculateRectangle (agent)  {
        let width = agent.parameters.width;
        let lengths = agent.parameters.lengths;
        let result = width * lengths;
        agent.add("พื้นที่รูปสี่เหลี่ยมขนาด กว้าง" + width + "ซม. สูง" + height + "=" + result + "ตร.ซม.")
    }


    function calculateTriangle  (agent) {
        let base = agent.parameters.base;
        let lengths = agent.parameters.height;
        let result = 1 / 2 * base * height;
        agent.add("พื้นที่รูปสามเหลี่ยมขนาด ฐาน" + base + "ซม. สูง" + height + "=" + result + "ตร.ซม.")
}


function calculateCircl (agent) {
    let radius = agent.parameters.radius;  // ใช้รัศมีแทนฐานและความสูง
    let pi = Math.PI;  // ใช้ค่า π (pi) ของ JavaScript
    let result = pi * Math.pow(radius, 2);  // คำนวณพื้นที่วงกลม
    agent.add("พื้นที่วงกลมที่มีรัศมี " + radius + " ซม. = " + result.toFixed(2) + " ตร.ซม.");  // แสดงผลลัพธ์
}
  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);

  intentMap.set("BMI - custom - yes", bodyMassIndex);

  intentMap.set('area - rectangle - custom - yes', calculateRectangleArea);
  intentMap.set('area - circle - custom - yes', calculateCircleArea);
  intentMap.set('area - triangle - custom - yes', calculateTriangleArea);

  agent.handleRequest(intentMap);
});
app.listen(port, () => {
  console.log("Server is running at http://localhost:" + port);
});