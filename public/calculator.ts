type doseType = "first" | "normal" | "shock"
type state = "dose" | "pH" | "Cl" | "Temp" |  "results"

const poolVolume = 13.3 //In m3
let doseType: doseType;
let state:state = "dose";
let calculatorInputs:any = 0;
let pH = 0
let Cl = 0
let Temp = 0
let phTodo:any
let AlOut: number
let ClOut: number

const chooseDose = document.getElementById("chooseDose") as HTMLDivElement;
const calculator = document.getElementById("calculator") as HTMLDivElement;
const results = document.getElementById("results") as HTMLDivElement;
const calcualtorDisplay = document.querySelector("#calculator h1") as HTMLHeadingElement;
const inputDose = document.getElementById("inputDose") as HTMLParagraphElement;
const inputPH = document.getElementById("inputPH") as HTMLParagraphElement;
const inputCl = document.getElementById("inputCL") as HTMLParagraphElement;
const inputTemp = document.getElementById("inputTemp") as HTMLParagraphElement;
const outputAL = document.getElementById("outputAL") as HTMLParagraphElement;
const outputPH = document.getElementById("outputPH") as HTMLParagraphElement;
const outputCl = document.getElementById("outputCL") as HTMLParagraphElement;

function setDose(type: doseType) {
  doseType = type;
  state = "pH";
  calcualtorDisplay.innerHTML = "pH: 0";
  chooseDose.style.display = "none";
  calculator.style.display = "flex"
}

function calculatorInput(input:number) {
  if (calculatorInputs.toString() != "0" || calculatorInputs.toString() == "0.") {
    switch (state) {
      case "pH":
        if (parseInt(calculatorInputs + "" + input) <= 14) {
          calculatorInputs = (calculatorInputs + "" + input);
        }
        break;
      case "Cl":
        if (parseInt(calculatorInputs + "" + input) <= 3) {
          calculatorInputs = (calculatorInputs + "" + input);
        }
        break;
      case "Temp":
        calculatorInputs = (calculatorInputs + "" + input);
        break;
    }
  }
  else {
    switch (state) {
      case "Cl":
        if (parseInt(calculatorInputs + "" + input) <= 3) {
          calculatorInputs = input;
        }
        break;
      case "pH":
        calculatorInputs = input;
        break;
      case "Temp":
        calculatorInputs = input;
        break;
    }
  }

  updateCalculator();
}
function calculatorClear() {
  calculatorInputs = 0;
  updateCalculator();
}
function calculatorNext() {
  switch (state) {
    case "pH": 
      state = "Cl";
      calcualtorDisplay.innerHTML = "Cl: 0";
      pH = calculatorInputs;
      calculatorInputs = 0;
      break;
    case "Cl":
      state = "Temp";
      calcualtorDisplay.innerHTML = "Temp: 0";
      Cl = calculatorInputs;
      calculatorInputs = 0;
      break;
    case "Temp":
      state = "results";
      results.style.display = "flex";
      calculator.style.display = "none";
      Temp = calculatorInputs;
      calculatorInputs = 0;
      showResults();
      break;
  }
}
function calculatorPrevious() {
  switch (state) {
    case "pH":
      state = "dose";
      chooseDose.style.display = "flex";
      calculator.style.display = "none"
      break;
    case "Cl":
      calcualtorDisplay.innerHTML = "pH: 0";
      state = "pH";
      break;
    case "Temp":
      calcualtorDisplay.innerHTML = "Cl: 0";
      state = "Cl";
      break;
  }
}
function calculatorComma() {
  if (calculatorInputs == 0) {
    calculatorInputs = ("0.");
  }
  else {
    calculatorInputs = (calculatorInputs + ".");
  }
  updateCalculator();
}
function updateCalculator() {
  calcualtorDisplay.innerHTML = state + ": " + calculatorInputs;
}
function showResults() {
  inputDose.innerHTML = "Dose: " + doseType;
  inputPH.innerHTML = "pH: " + pH;
  inputCl.innerHTML = "Cl: " + Cl + " mg/l";
  inputTemp.innerHTML = "Temp: " + Temp + "°C";

  if (pH > 7.4) {
    phTodo = Math.round(((pH - 7.4) * 10 * 100 * (poolVolume / 10)) * 1000) / 1000.0;
  }
  else {
    phTodo = "-";
  }

  switch (doseType) {

    case "normal":
      AlOut = (40 * (poolVolume / 10));
      ClOut = (50 * (poolVolume / 10));
      break;
    case "first":
      AlOut = (100 * (poolVolume / 10));
      ClOut = (100 * (poolVolume / 10));
      break;
    case "shock":
      AlOut = (600 * (poolVolume / 10));
      ClOut = (200 * (poolVolume / 10));
      break;
  }
  outputAL.innerHTML = "Al: " + AlOut + " g";
  outputPH.innerHTML = "pH-: " + phTodo + " g";
  outputCl.innerHTML = "Cl: " + ClOut + " g";
}

function saveData() {
  let d = new Date();
  let date = d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear();
  let string = date + "," + pH + "," + Cl + "," + phTodo + "," + ClOut + "," + AlOut + "," + Temp;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "save_data.php");
  var formData = new FormData();
  formData.append("data", string);
  xhr.send(formData);
}