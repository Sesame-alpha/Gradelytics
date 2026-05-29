// ==============================
// LOAD DATA (FROM LOCALSTORAGE)
// ==============================
let data = JSON.parse(localStorage.getItem("grades")) || [];

// ==============================
// SAVE GRADE (FIXED: NO DUPLICATES / CT FIX)
// ==============================
function saveGrade(module, marks) {
  let current = JSON.parse(localStorage.getItem("grades")) || [];

  // prevent duplicate modules (CT spam fix)
  const map = new Map();

  current.forEach(d => {
    map.set(d.module.toUpperCase().trim(), d);
  });

  map.set(module.toUpperCase().trim(), {
    module: module.trim(),
    marks: Number(marks)
  });

  const updated = [...map.values()];

  localStorage.setItem("grades", JSON.stringify(updated));
  data = updated;

  renderAll(); // refresh UI after save
}

// ==============================
// GROUP DATA (AVERAGE PER MODULE)
// ==============================
function groupData() {
  const grouped = {};

  data.forEach(d => {
    const key = d.module.toUpperCase().trim();

    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(d.marks);
  });

  const labels = Object.keys(grouped);

  const marks = labels.map(m => {
    const arr = grouped[m];
    return arr.length
      ? arr.reduce((a, b) => a + b, 0) / arr.length
      : 0;
  });

  return { labels, marks };
}

// ==============================
// PIE CHART ZONES
// ==============================
function getZones() {
  let zones = { super: 0, good: 0, pass: 0, danger: 0 };

  data.forEach(d => {
    if (d.marks >= 85) zones.super++;
    else if (d.marks >= 75) zones.good++;
    else if (d.marks >= 70) zones.pass++;
    else zones.danger++;
  });

  return zones;
}

// ==============================
// RENDER BAR CHART
// ==============================
function renderChart() {
  const { labels, marks } = groupData();

  const ctx = document.getElementById("chart");

  if (!ctx) return;

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Module Average",
        data: marks,
        borderWidth: 1
      }]
    }
  });
}

// ==============================
// MAIN RENDER FUNCTION
// ==============================
function renderAll() {
  renderChart();
  // If you have pie chart, call it here:
  // renderPieChart(getZones());
}

// ==============================
// INITIAL LOAD
// ==============================
renderAll();
