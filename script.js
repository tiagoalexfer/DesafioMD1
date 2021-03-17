const baseUrl = "http://localhost:3000";
let employees = [];
let roles = [];
let roleSelected = [];
let tbody = document.querySelector("tbody");
const selectOrder = document.querySelector("select");

async function init() {
  [employees, roles] = await Promise.all([listEmployees(), listRoles()]);
  renderRoles();
  SortyBy();
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

function renderData(newEmployees) {
  tbody.innerHTML = "";
  for (const employee of newEmployees) {
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
  document.querySelector('#listaEmp h2').textContent = `Employees (${newEmployees.length})`
}

function renderRoles() {

  for (const role of roles) {
    let checkBox = document.querySelector('fieldset .filtro').cloneNode(true);
    checkBox.style = 'block';
    checkBox.querySelector('div .role').setAttribute('name', role.id)
    checkBox.querySelector('div .role').setAttribute('id', role.id)
    checkBox.querySelector('div  label').setAttribute('for', role.id)
    checkBox.querySelector('div  label').innerText = role.name
    document.querySelector('fieldset').appendChild(checkBox)
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

function SortyBy() {
  let dadoSelecionado = selectOrder.value
  let newEmployees = [];
  if (roleSelected.length) {
    newEmployees = [...employees.filter(ordenar => roleSelected.includes(ordenar['role_id'].toString()))];
    if (dadoSelecionado == "ND") {
      newEmployees.sort((a, b) => a.name > b.name ? -1 : 1);
    } else if (dadoSelecionado == "SA") {
      newEmployees.sort((a, b) => a.salary > b.salary ? 1 : -1);
    } else if (dadoSelecionado == "SD") {
      newEmployees.sort((a, b) => a.salary > b.salary ? -1 : 1);
    } else {
      newEmployees.sort((a, b) => a.name > b.name ? 1 : -1);
    }
    renderData(newEmployees);
  } else {

    if (dadoSelecionado == "ND") {
      employees.sort((a, b) => a.name > b.name ? -1 : 1);
    } else if (dadoSelecionado == "SA") {
      employees.sort((a, b) => a.salary > b.salary ? 1 : -1);
    } else if (dadoSelecionado == "SD") {
      employees.sort((a, b) => a.salary > b.salary ? -1 : 1);
    } else {
      employees.sort((a, b) => a.name > b.name ? 1 : -1);
    }
    renderData(employees);
  }
}
function FilterChecked() {
  roleSelected = [...document.querySelectorAll('.role')]
    .filter(el => el.checked)
    .map(el => el.name);
  // console.log(roleSelected);
  document.querySelector('select').addEventListener('change', SortyBy());
}
