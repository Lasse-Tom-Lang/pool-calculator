import express from "express"
const app = express()

import fs from "fs"

app.listen(80, () => {
  console.log("Server listens on port 80")
})

app.get("/", (req, res) => {
  res.write(fs.readFileSync("./public/index.html"));
  res.end();
})

app.get("/style.css", (req, res) => {
  res.write(fs.readFileSync("./public/style.css"));
  res.end();
})

app.get("/calculator.js", (req, res) => {
  res.write(fs.readFileSync("./public/calculator.js"));
  res.end();
})

app.get("/saveData", (req, res) => {
  let data =  "\n" + req.query.data as string
  if (data) {
    fs.writeFileSync("./data.csv", data, {flag: "a+"})
  }
  res.end()
})