var employees = [];
var filteredEmployees = [];
async function loadEmployee() {
  console.log("Loading employees...");
  console.log(localStorage.getItem("token"));
  if (localStorage.getItem("token")) {
    try {
      const response = await fetch(
        "http://localhost:8081/emp-dept/all/emp-dept-job",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        employees = data.content; // List of EmployeeDto objects

        filteredEmployees = employees;
        console.log(employees);
        // displayEmployee(employees);
      } else {
        document.getElementById("info").textContent =
          "Failed to load employees: " + data.message;
      }
    } catch (error) {
      console.error("Error loading employees:", error);
      document.getElementById("info").textContent =
        "An error occurred. Please try again.";
    }
  } else {
    window.location.href = "/case-study/html/login.html";
  }
}

function displayEmployee(listEmployees) {
  const tableBody = document
    .getElementById("employeeTable")
    .querySelector("tbody");
  tableBody.innerHTML = ""; // Clear any existing rows

  listEmployees.forEach((employee) => {
    const row = document.createElement("tr");
    row.classList.add("employee-row");

    // Create cells for each piece of data in EmployeeDto
    const idCell = document.createElement("td");
    idCell.classList.add("text-center");
    idCell.textContent = employee.id;
    row.appendChild(idCell);

    const nameCell = document.createElement("td");
    nameCell.textContent = employee.first_name + " " + employee.last_name;
    row.appendChild(nameCell);

    const emailCell = document.createElement("td");
    emailCell.textContent = employee.email;
    row.appendChild(emailCell);

    const jobIdCell = document.createElement("td");
    jobIdCell.classList.add("text-center");
    jobIdCell.textContent = employee.job_title;
    row.appendChild(jobIdCell);

    const salaryCell = document.createElement("td");
    salaryCell.classList.add("text-center");
    salaryCell.textContent = employee.salary ?? "N/A";
    row.appendChild(salaryCell);

    const commCell = document.createElement("td");
    commCell.classList.add("text-center");
    commCell.textContent = employee.commission_pct ?? "N/A";
    row.appendChild(commCell);

    const deptCell = document.createElement("td");
    deptCell.classList.add("text-center");
    deptCell.textContent = employee.department_name;
    row.appendChild(deptCell);

    const dateCell = document.createElement("td");
    dateCell.classList.add("text-center");
    dateCell.textContent = employee.hire_date;
    row.appendChild(dateCell);

    const actionCell = document.createElement("td");
    actionCell.classList.add("text-center");
    actionCell.innerHTML = `<button class="btn btn-outline-danger" onclick="deleteEmployee(${employee.id})">Delete</button>
    <button class="btn btn-outline-warning" onclick="updateEmployee(${employee.id})">Update</button>`;
    row.appendChild(actionCell);

    // Add row to table body
    tableBody.appendChild(row);
  });
}

document.getElementById("searchBar").addEventListener("input", searchByName);

async function deleteEmployee(id) {
  console.log(`Deleting employee... ${id}`);
  Swal.fire({
    title: "Are you sure?",
    text: "This action cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch("http://localhost:8081/emp/delete/" + id, {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        if (response.ok) {
          console.log("Employee deleted successfully");
          initializeEmployees();
        } else {
          console.error("Failed to delete employee");
          Swal.fire({
            icon: "error",
            title: data.info.message,
            text: data.info.detailMessage,
          });
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  });
}

async function loadJobs() {
  const response = await fetch("http://localhost:8081/job/all");
  const data = await response.json();
  return data.content;
}

async function loadDepartments() {
  const response = await fetch("http://localhost:8081/dept/all");
  const data = await response.json();
  return data.content;
}

async function showUpdateForm(employeeId) {
  var listJob = await loadJobs();
  var listDepartment = await loadDepartments();

  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("passwordSignup");
  const phoneNumberInput = document.getElementById("phonenumber");
  const hireDateInput = document.getElementById("hireDate");
  const jobIdInput = document.getElementById("jobForm");
  const managerIdInput = document.getElementById("managerId");
  const departmentIdInput = document.getElementById("deptForm");
  const salaryInput = document.getElementById("salary");
  const commissionPctInput = document.getElementById("commissionPct");
  const jobForm = document.getElementById("jobForm");
  const departmentForm = document.getElementById("deptForm");

  jobForm.innerHTML = "";
  departmentForm.innerHTML = "";

  listJob.forEach((job) => {
    const option = document.createElement("option");
    option.value = job.job_id;
    option.text = job.job_title;
    jobForm.appendChild(option);
  });

  listDepartment.forEach((department) => {
    const option = document.createElement("option");
    option.value = department.id;
    option.text = department.name;
    departmentForm.appendChild(option);
  });

  const employee = employees.find((employee) => employee.id === employeeId);

  firstNameInput.value = employee.first_name;
  lastNameInput.value = employee.last_name;
  emailInput.value = employee.email;
  phoneNumberInput.value = employee.phone_number;
  hireDateInput.value = employee.hire_date;
  jobIdInput.value = employee.job_id;
  managerIdInput.value = employee.manager_id;
  departmentIdInput.value = employee.department_id;
  salaryInput.value = employee.salary;
  commissionPctInput.value = employee.commission_pct;

  const modal = new bootstrap.Modal(document.getElementById("updateModal"));
  const submitButton = document.getElementById("submitBtn");
  submitButton.addEventListener("click", () => submitUpdate(employeeId));
  modal.show();
}

function updateEmployee(id) {
  console.log(`Updating employee... ${id}`);
  showUpdateForm(id);
}

async function submitUpdate(employeeId) {
  console.log(`Submitting changes... ${employeeId}`);
  const form = document.getElementById("updateEmployeeForm");

  if (form.checkValidity()) {
    console.log("Form is valid, proceeding with submit");
    const employee = employees.find((employee) => employee.id === employeeId);

    const firstName =
      employee.first_name === document.getElementById("firstName").value
        ? null
        : document.getElementById("firstName").value;

    const lastName =
      employee.last_name === document.getElementById("lastName").value
        ? null
        : document.getElementById("lastName").value;

    const email =
      employee.email === document.getElementById("email").value
        ? null
        : document.getElementById("email").value;

    const password = document.getElementById("passwordSignup").value;

    const phoneNumber =
      employee.phone_number === document.getElementById("phonenumber").value
        ? null
        : document.getElementById("phonenumber").value;

    const hireDate =
      employee.hire_date === document.getElementById("hireDate").value
        ? null
        : document.getElementById("hireDate").value;

    const jobId =
      employee.job_id === document.getElementById("jobForm").value
        ? null
        : document.getElementById("jobForm").value;

    const managerId =
      employee.manager_id === document.getElementById("managerId").value
        ? null
        : document.getElementById("managerId").value;

    const departmentId =
      employee.department_id === document.getElementById("deptForm").value
        ? null
        : document.getElementById("deptForm").value;

    const salary =
      employee.salary === document.getElementById("salary").value
        ? null
        : document.getElementById("salary").value;

    const commissionPct =
      employee.commission_pct === document.getElementById("commissionPct").value
        ? null
        : document.getElementById("commissionPct").value;

    try {
      const response = await fetch(
        "http://localhost:8081/emp/update/" + employeeId,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            id: employeeId,
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            phone_number: phoneNumber,
            hire_date: hireDate,
            job_id: jobId,
            manager_id: managerId,
            department_id: departmentId,
            salary: salary,
            commission_pct: commissionPct,
          }),
        }
      );
      if (response.ok) {
        console.log("Employee updated successfully");
        initializeEmployees();
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("updateModal")
        );
        modal.hide();
      } else {
        console.error("Failed to update employee");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  } else {
    form.reportValidity();
  }
}

function searchByName() {
  console.log("Searching employees...");
  const name = document.getElementById("searchBar").value;
  if (!name) {
    filteredEmployees = employees;
    loadPage(1, filteredEmployees);
    return;
  }
  filteredEmployees = employees.filter(
    (employee) =>
      (
        employee.first_name.toLowerCase() +
        " " +
        employee.last_name.toLowerCase()
      ).includes(name.toLowerCase()) ||
      employee.email.toLowerCase().includes(name.toLowerCase()) ||
      employee.job_title.toLowerCase().includes(name.toLowerCase()) ||
      employee.department_name.toLowerCase().includes(name.toLowerCase())
  );
  loadPage(1, filteredEmployees);
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userDetail");
  window.location.href = "/case-study/html/login.html";
}

let currentPage = 1;
const itemsPerPage = 10;

function loadPage(pageNumber, list) {
  currentPage = pageNumber;
  const startIndex = (pageNumber - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const employeesForPage = list.slice(startIndex, endIndex);

  displayEmployee(employeesForPage);
  updatePaginationControls(pageNumber, list.length);
}

function updatePaginationControls(pageNumber, totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  document.getElementById("prevButton").disabled = pageNumber === 1;
  document.getElementById("pageCount").textContent = pageNumber;
  document.getElementById("nextButton").disabled = pageNumber === totalPages;
}

async function initializeEmployees() {
  try {
    await loadEmployee();
    console.log(employees);
    loadPage(1, employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
  }
}

window.addEventListener("load", function () {
  initializeEmployees();
  document
    .getElementById("prevButton")
    .addEventListener("click", () =>
      loadPage(currentPage - 1, filteredEmployees)
    );
  document
    .getElementById("nextButton")
    .addEventListener("click", () =>
      loadPage(currentPage + 1, filteredEmployees)
    );
});
