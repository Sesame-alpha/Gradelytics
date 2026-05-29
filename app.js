let data = JSON.parse(localStorage.getItem("grades")) || [];

let lineChart, barChart, pieChart;

function save() {
  localStorage.setItem("grades", JSON.stringify(data));
}

/* prevent duplicate module per year + semester */
function isDuplicate(item) {
  return data.some(d =>
    d.module.toLowerCase() === item.module.toLowerCase() &&
    d.year === item.year &&
    d.semester === item.semester
  );
}

function addGrade() {

  const module = document.getElementById("module").value.trim();
  const marks = Number(document.getElementById("marks").value);
  const year = Number(document.getElementById("year").value);
  const semester = Number(document.getElementById("semester").value);

  if (!module || isNaN(marks)) return;

  const newItem = { module, marks, year, semester };

  if (isDuplicate(newItem)) {
    alert("This module already exists for this semester/year!");
    return;
  }

  data.push(newItem);
  save();
  update();
}

function calculate() {

  if (data.length === 0) return;

  const avg = data.reduce((a,b)=>a+b.marks,0)/data.length;

  document.getElementById("avg").innerText = avg.toFixed(2);

  const best = data.reduce((a,b)=>a.marks>b.marks?a:b);
  const lowest = data.reduce((a,b)=>a.marks<b.marks?a:b);

  document.getElementById("best").innerText = best.module;
  document.getElementById("avgModule").innerText = lowest.module;

  // GOAL
  let progress = (avg / 80) * 100;
  document.getElementById("progressBar").style.width = progress + "%";

  // INSIGHTS
  let weak = data.filter(d => d.marks < 70).length;

  document.getElementById("insightText").innerText =
    `Weak modules: ${weak}. Improve consistency for better results.`;

  // SEMESTER COMPARISON
  let sem1 = data.filter(d => d.semester == 1);
  let sem2 = data.filter(d => d.semester == 2);

  let avg1 = sem1.length ? sem1.reduce((a,b)=>a+b.marks,0)/sem1.length : 0;
  let avg2 = sem2.length ? sem2.reduce((a,b)=>a+b.marks,0)/sem2.length : 0;

  document.getElementById("comparison").innerText =
    `Sem 1: ${avg1.toFixed(1)} | Sem 2: ${avg2.toFixed(1)}`;

  // ACHIEVEMENTS
  let ach = [];

  if (data.filter(d=>d.marks>=85).length >= 1)
    ach.push("🏆 High Performer");

  if (data.filter(d=>d.marks<70).length === 0)
    ach.push("🌸 No Danger Modules");

  document.getElementById("achievementsBox").innerHTML =
    ach.map(a=>`<div class="card">${a}</div>`).join("");
}

function charts() {

  const labels = data.map(d=>d.module);
  const marks = data.map(d=>d.marks);

  if (lineChart) lineChart.destroy();
  if (barChart) barChart.destroy();
  if (pieChart) pieChart.destroy();

  lineChart = new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
      labels,
      datasets: [{
        data: marks,
        borderColor: "#ff4fa3",
        fill: false
      }]
    }
  });

  barChart = new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data: marks,
        backgroundColor: "#ff8ccf"
      }]
    }
  });

  let zones = {super:0,good:0,pass:0,danger:0};

  data.forEach(d=>{
    if(d.marks>=85) zones.super++;
    else if(d.marks>=75) zones.good++;
    else if(d.marks>=70) zones.pass++;
    else zones.danger++;
  });

  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels:["Super","Good","Pass","Danger"],
      datasets:[{ data:Object.values(zones) }]
    }
  });
}

function update() {
  calculate();
  charts();
}

update();
