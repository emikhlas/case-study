var departments = [];
var filteredDepartments = [];
async function loadDepartments() {
  console.log("Loading departments...");
  console.log(localStorage.getItem("token"));
  if (localStorage.getItem("token")) {
    try {
      const response = await fetch("http://localhost:8081/dept/all", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const data = await response.json();

      if (response.ok) {
        departments = data.content; // List of EmployeeDto objects

        filteredDepartments = departments;
        console.log(departments);
      } else {
        document.getElementById("info").textContent =
          "Failed to load departments: " + data.message;
      }
    } catch (error) {
      console.error("Error loading departments:", error);
      document.getElementById("info").textContent =
        "An error occurred. Please try again.";
    }
  } else {
    window.location.href = "/case-study/html/login.html";
  }
}

function displayDepartments(listDepartments) {
  const tableBody = document
    .getElementById("departmentTable")
    .querySelector("tbody");
  tableBody.innerHTML = ""; // Clear any existing rows

  listDepartments.forEach((department) => {
    const row = document.createElement("tr");

    // Create cells for each piece of data in EmployeeDto
    const idCell = document.createElement("td");
    idCell.classList.add("text-center");
    idCell.textContent = department.id;
    row.appendChild(idCell);

    const nameCell = document.createElement("td");
    nameCell.textContent = department.name;
    row.appendChild(nameCell);

    const managerIdCell = document.createElement("td");
    managerIdCell.textContent = department.manager_id;
    row.appendChild(managerIdCell);

    const locationIdCell = document.createElement("td");
    locationIdCell.classList.add("text-center");
    locationIdCell.textContent = department.location_id;
    row.appendChild(locationIdCell);

    const actionCell = document.createElement("td");
    actionCell.classList.add("text-center");
    actionCell.innerHTML = `<button class="btn btn-outline-danger" onclick="deleteDepartment(${department.id})">Delete</button>
      <button class="btn btn-outline-warning" onclick="updateDepartment(${department.id})">Update</button>`;
    row.appendChild(actionCell);

    // Add row to table body
    tableBody.appendChild(row);
  });
}

async function deleteDepartment(id) {
  console.log(`Deleting department... ${id}`);
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
        const response = await fetch(
          "http://localhost:8081/dept/delete/" + id,
          {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          console.log("Department deleted successfully");
          initializeDepartments();
        } else {
          console.error("Failed to delete department");
          Swal.fire({
            icon: "error",
            title: data.info.message,
            text: data.info.detailMessage,
          });
        }
      } catch (error) {
        console.error("Error deleting department:", error);
      }
    }
  });
}

function updateDepartment(id) {
  console.log(`Updating department... ${id}`);
  showUpdateForm(id);
}

function showUpdateForm(id) {
  const department = departments.find((department) => department.id === id);
  document.getElementById("departmentName").value = department.name;
  document.getElementById("departmentManagerId").value = department.manager_id;
  document.getElementById("departmentLocationId").value =
    department.location_id;

  const modal = new bootstrap.Modal(document.getElementById("updateModal"));
  const submitButton = document.getElementById("submitBtn");
  submitButton.addEventListener("click", () => submitUpdate(id));
  modal.show();
}

async function submitUpdate(departmentId) {
  console.log(`Submitting changes... ${departmentId}`);
  const department = departments.find(
    (department) => department.id === departmentId
  );
  const id = departmentId;
  const name = department.name;
  const managerId = department.manager_id;
  const locationId = department.location_id;

  try {
    const response = await fetch(
      "http://localhost:8081/dept/update/" + departmentId,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          id: departmentId,
          name: document.getElementById("departmentName").value,
          manager_id: document.getElementById("departmentManagerId").value,
          location_id: document.getElementById("departmentLocationId").value,
        }),
      }
    );
    if (response.ok) {
      console.log("Department updated successfully");
      initializeDepartments();
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("updateModal")
      );
      modal.hide();
    } else {
      console.error("Failed to update department");
    }
  } catch (error) {
    console.error("Error updating department:", error);
  }
}

function addDepartment() {
  console.log(`Adding department...`);
  showAddForm();
}

function showAddForm() {
  const modal = new bootstrap.Modal(document.getElementById("updateModal"));
  const submitButton = document.getElementById("submitBtn");
  submitButton.addEventListener("click", () => submitAdd());
  modal.show();
}

async function submitAdd() {
  console.log(`Submitting changes...`);

  const name = document.getElementById("departmentName").value;
  const managerId = document.getElementById("departmentManagerId").value;
  const locationId = document.getElementById("departmentLocationId").value;

  try {
    const response = await fetch("http://localhost:8081/dept/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        name: name,
        manager_id: managerId,
        location_id: locationId,
      }),
    });
    if (response.ok) {
      console.log("Department added successfully");
      initializeDepartments();
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("updateModal")
      );
      modal.hide();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Department Added successfully",
      });
    } else {
      console.error("Failed to add department");
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to add department",
      });
    }
  } catch (error) {
    console.error("Error adding department:", error);
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: `Error adding department: ${error.message}`,
    });
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userDetail");
  window.location.href = "/case-study/html/login.html";
}

let currentPage = 1;
const itemsPerPage = 5;

function loadPage(pageNumber, list) {
  currentPage = pageNumber;
  const startIndex = (pageNumber - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const jobForPage = list.slice(startIndex, endIndex);

  displayDepartments(jobForPage);
  updatePaginationControls(pageNumber, list.length);
}

function updatePaginationControls(pageNumber, totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  document.getElementById("prevButton").disabled = pageNumber === 1;
  document.getElementById("pageCount").textContent = pageNumber;
  document.getElementById("nextButton").disabled = pageNumber === totalPages;
}

async function initializeDepartments() {
  try {
    await loadDepartments();

    loadPage(1, departments);
  } catch (error) {
    console.error("Error fetching department:", error);
  }
}

function searchByName() {
  const searchText = document.getElementById("searchBar").value.toLowerCase();
  filteredListJob = departments.filter((department) =>
    department.name.toLowerCase().includes(searchText)
  );
  loadPage(1, filteredListJob);
}

window.addEventListener("load", function () {
  initializeDepartments();
  document.getElementById("searchBar").addEventListener("input", searchByName);
  document
    .getElementById("prevButton")
    .addEventListener("click", () =>
      loadPage(currentPage - 1, filteredDepartments)
    );
  document
    .getElementById("nextButton")
    .addEventListener("click", () =>
      loadPage(currentPage + 1, filteredDepartments)
    );
});
