const poolVolume = 13.3 //In m3
doseType = "";

chooseDose = document.getElementById("chooseDose");
calculator = document.getElementById("calculator");
results = document.getElementById("results");

calcualtorDisplay = document.querySelector("#calculator h1");

state = "dose"

function setDose(type) {
  doseType = type;
  state = "pH";
  calcualtorDisplay.innerHTML = "pH: 0";
  chooseDose.style.display = "none";
  calculator.style.display = "flex"
}


calculatorInputs = 0;

function calculatorInput(input) {
  if (calculatorInputs.toString() != "0" || calculatorInputs.toString() == "0.") {
    switch (state) {
      case "pH":
        if ((calculatorInputs + "" + input) <= 14) {
          calculatorInputs = calculatorInputs + "" + input;
        }
        break;
      case "Cl":
        if ((calculatorInputs + "" + input) <= 3) {
          calculatorInputs = calculatorInputs + "" + input;
        }
        break;
      case "Temp":
        calculatorInputs = calculatorInputs + "" + input;
        break;
    }
  }
  else {
    switch (state) {
      case "Cl":
        if ((calculatorInputs + "" + input) <= 3) {
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
    calculatorInputs = "0.";
  }
  else {
    calculatorInputs = calculatorInputs + ".";
  }
  updateCalculator();
}
function updateCalculator() {
  calcualtorDisplay.innerHTML = state + ": " + calculatorInputs;
}
function showResults() {
  document.getElementById("inputDose").innerHTML = "Dose: " + doseType;
  document.getElementById("inputPH").innerHTML = "pH: " + pH;
  document.getElementById("inputCL").innerHTML = "Cl: " + Cl + " mg/l";
  document.getElementById("inputTemp").innerHTML = "Temp: " + Temp + "??C";

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
  document.getElementById("outputAL").innerHTML = "Al: " + AlOut + " g";
  document.getElementById("outputPH").innerHTML = "pH-: " + phTodo + " g";
  document.getElementById("outputCL").innerHTML = "Cl: " + ClOut + " g";
}

function saveData() {
  d = new Date();
  date = d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear();
  string = date + "," + pH + "," + Cl + "," + phTodo + "," + ClOut + "," + AlOut + "," + Temp;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "save_data.php");
  var formData = new FormData();
  formData.append("data", string);
  xhr.send(formData);
}