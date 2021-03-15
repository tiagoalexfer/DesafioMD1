const baseUrl = "http://localhost:3000";
let employees = [];
let roles = [];
const listEl = document.querySelector("ul");
let tbody = document.querySelector("tbody");

async function init() {
  [employees, roles] = await Promise.all([listEmployees(), listRoles()]);
  renderRoles();
  renderData();
}
init();

function fetchJson(url, options) {
  return fetch(url, options)
    .then((r) => {
      if (r.ok) {
        return r.json();
      } else {
        throw new Error(r.statusText);
      }
    })
    .catch((error) => {
      showError("Error loading data", error);
      throw error;
    });
}

function listEmployees() {
  return fetchJson(`${baseUrl}/employees`);
}

function listRoles() {
  return fetchJson(`${baseUrl}/roles`);
}

function renderData() {
  for (const employee of employees) {
    let role = roles.find((role) => role.id == employee.role_id);
    const tr = document.createElement("tr");
    const tdId = document.createElement("td");
    tdId.textContent = employee.id;
    const tdName = document.createElement("td");
    tdName.textContent = employee.name;
    const tdRole = document.createElement("td");
    tdRole.textContent = role.name;
    const tdSalary = document.createElement("td");
    tdSalary.textContent = employee.salary;
    tr.appendChild(tdId);
    tr.appendChild(tdName);
    tr.appendChild(tdRole);
    tr.appendChild(tdSalary);
    tbody.appendChild(tr);
  }
}

function renderRoles() {
  for (const role of roles) {
    const li = document.createElement("li");
    const input = document.createElement("input");
    const label = document.createElement("label");
    input.type = "checkbox";
    input.value = role.id;
    label.textContent = role.name;

    label.appendChild(input);
    li.appendChild(label);
    listEl.appendChild(li);
  }
}
function showError(message, error) {
  document.getElementById("errors").textContent = message;
  if (error) {
    console.error(error);
  }
}

function clearError() {
  document.getElementById("errors").textContent = "";
}
