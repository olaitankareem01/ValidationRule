const express = require("express");
// const { Jsend } = require("jsend-express");
// const jsend = new Jsend();
const bodyParser = require("body-parser");
const validator = require("validatorjs");
const payloadValidator = require('payload-validator');
const jsendie = require("jsendie");
const cors = require("cors");
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 100000,
  })
);
app.use(jsendie());

app.get("/", (req, res) => {
  res.success({
    message: "My Rule-Validation API",
    status: "success",
    data: {
      name: "Kareem Abdurrahman Taiwo",
      github: "@https://github.com/olaitankareem01",
      email: "olaitankareem01@gmail.com",
      mobile: "09020771581"
      //   twitter: "",
    },
  });
});

function checkCondition(field,condition,condition_value) {
  var result;
  
  if (condition === "eq") {
    if (field == condition_value) {
      result = true;
    }
  }
  else if (condition === 'neq') {
    if (field !== condition_value) {
      result = true;
    }
  }
  else if (condition === 'gt') {
    if (field > condition_value) {
      result = true;
    }
  }
  else if (condition = 'gte') {
    if (field >= condition_value) {
     result = true;
    }
  }
  else if (condition === 'contains') {
    if (field === condition_value) {
      result = true;
    };
  }
  else {
    result = false;
  }

  return result;

}
checkCondition()
var expectedPayload = {
  rule: {},
  data: {},
};

app.post("/validate-rule", (req, res) => {
  let rule = req.body.rule;
  let data = req.body.data;
  console.log(rule);
  console.log(data);
  let field_specified;

  if (rule) {
    field_specified = req.body.rule.field;
  }

  if (req.body) {
    var result = payloadValidator.validator(
      req.body,
      expectedPayload,
      ["rule", "data"],
      false
    );
    if (!result.success) {
      res.status(400).send({
        message: "Invalid JSON payload passed.",
        status: "error",
        data: null,
      });
    }
  }
    
  if (((field_specified == undefined) || !(JSON.stringify(data).includes(field_specified)))) {
    res.status(400).send({
      message: ` field ${field_specified} is missing.`,
      data: null,
      status: "error"
    });
  }

  if (typeof (rule) !== 'object') {
    res.status(400).send({
      message: `rule should be an object`,
      data: null,
      status: "error",
    });
  }

  let condition = req.body.rule.condition;
  let condition_value = req.body.rule.condition_value;
  let compared_field = req.body.data.missions;

  let validate = checkCondition(compared_field, condition, condition_value);
  console.log(validate);
  if (validate != true) {
    res.status(400).send({
      "message": "field failed validation.",
      "status": "error",
      "data": {
        "validation": {
          "error": true,
          "field": `${compared_field}`,
          "field_value": `${compared_field}`,
          "condition": `${condition}`,
          "condition_value": `${condition_value}`
        }
      }
    });
  }
  else {
      res.status(400).send({
        message: "field failed validation.",
        status: "error",
        data: {
          validation: {
            error: false,
            field: `${compared_field}`,
            field_value: `${compared_field}`,
            condition: `${condition}`,
            condition_value: `${condition_value}`,
          },
        },
      });
  }
  
});



app.listen(port, console.log(`App listening at ${port}`));
