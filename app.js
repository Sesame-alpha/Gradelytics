let data = JSON.parse(localStorage.getItem("grades")) || [

  { year: 1, semester: 1, module: "BPA", marks: 76 },
  { year: 1, semester: 1, module: "CT", marks: 86 },
  { year: 1, semester: 1, module: "CMS", marks: 73 },
  { year: 1, semester: 1, module: "CSS", marks: 68 }

];

const yearFilter = document.getElementById("yearFilter");
const semFilter = document.getElementById("semFilter");

let lineChart;
let barChart;
let pieChart;

function saveData() {
  localStorage.setItem("grades", JSON.stringify(data));
}

function getZone(mark) {

  if (mark >= 85) return "super";

  if (mark >= 75) return "good";

  if (mark >= 70) return "pass";

  return "danger";
}

function addGrade() {

  const module = document.getElementById("module").value;

  const marks = Number(document.getElementById("marks").value);

  const year = Number(document.getElementById("year").value);

  const semester = Number(document.getElementById("semester").value);

  if (!module || isNaN(marks)) return;

  data.push({
    module,
    marks,
    year,
    semester
  });

  saveData();

  update();

}

function filterData() {

  return data.filter(item => {

    const yearMatch =
      yearFilter.value === "all" ||
      item.year == yearFilter.value;

    const semMatch =
      semFilter.value === "all" ||
      item.semester == semFilter.value;

    return yearMatch && semMatch;

  });

}

function updateStats(filtered) {

  if (filtered.length === 0) return;

  const total =
    filtered.reduce((sum, item) => sum + item.marks, 0);

  const average = total / filtered.length;

  document.getElementById("avg").innerText =
    average.toFixed(2);

  const best =
    filtered.reduce((a, b) =>
      a.marks > b.marks ? a : b
    );

  const worst =
    filtered.reduce((a, b) =>
      a.marks < b.marks ? a : b
    );

  document.getElementById("best").innerText =
    `${best.module} (${best.marks})`;

  document.getElementById("worst").innerText =
    `${worst.module} (${worst.marks})`;

}

function aiInsights(filtered) {

  if (filtered.length === 0) return;

  const weakModules =
    filtered.filter(item => item.marks < 70).length;

  const strongModules =
    filtered.filter(item => item.marks >= 85).length;

  const weakest =
    filtered.reduce((a, b) =>
      a.marks < b.marks ? a : b
    );

  let message =
    `Weak modules: ${weakModules}. `;

  message +=
    `Strong modules: ${strongModules}. `;

  message +=
    `Focus more on ${weakest.module} (${weakest.marks}).`;

  document.getElementById("insights").innerText =
    message;

}

function updateCharts(filtered) {

  const labels =
    filtered.map(item => item.module);

  const marks =
    filtered.map(item => item.marks);

  const zones = {
    super: 0,
    good: 0,
    pass: 0,
    danger: 0
  };

  filtered.forEach(item => {
    zones[getZone(item.marks)]++;
  });

  if (lineChart) lineChart.destroy();
  if (barChart) barChart.destroy();
  if (pieChart) pieChart.destroy();

  lineChart = new Chart(
    document.getElementById("lineChart"),
    {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "Marks",
          data: marks,
          borderColor: "blue"
        }]
      }
    }
  );

  barChart = new Chart(
    document.getElementById("barChart"),
    {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Modules",
          data: marks,
          backgroundColor: "green"
        }]
      }
    }
  );

  pieChart = new Chart(
    document.getElementById("pieChart"),
    {
      type: "pie",
      data: {
        labels: [
          "Super",
          "Good",
          "Pass",
          "Danger"
        ],
        datasets: [{
          data: [
            zones.super,
            zones.good,
            zones.pass,
            zones.danger
          ]
        }]
      }
    }
  );

}

function update() {

  const filtered = filterData();

  updateStats(filtered);

  aiInsights(filtered);

  updateCharts(filtered);

}

yearFilter.addEventListener("change", update);

semFilter.addEventListener("change", update);

update();
