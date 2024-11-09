var listJob = [];
var filteredListJob = [];

async function loadJob() {
  console.log(localStorage.getItem("token"));
  if (localStorage.getItem("token")) {
    try {
      const response = await fetch("http://localhost:8081/job/all", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const data = await response.json();

      if (response.ok) {
        listJob = data.content;

        filteredListJob = listJob;
        console.log(listJob);
      } else {
        document.getElementById("info").textContent =
          "Failed to load job: " + data.message;
      }
    } catch (error) {
      console.error("Error loading job:", error);
      document.getElementById("info").textContent =
        "An error occurred. Please try again.";
    }
  } else {
    window.location.href = "/case-study/html/login.html";
  }
}

function displayJob(list) {
  const tableBody = document.getElementById("jobTable").querySelector("tbody");
  tableBody.innerHTML = "";

  list.forEach((job) => {
    const row = document.createElement("tr");

    // Create cells for each piece of data in EmployeeDto
    const idCell = document.createElement("td");
    idCell.classList.add("text-center");
    idCell.textContent = job.job_id;
    row.appendChild(idCell);

    const titleCell = document.createElement("td");
    titleCell.classList.add("text-center");
    titleCell.textContent = job.job_title;
    row.appendChild(titleCell);

    const minCell = document.createElement("td");
    minCell.classList.add("text-center");
    minCell.textContent = job.min_salary;
    row.appendChild(minCell);

    const maxCell = document.createElement("td");
    maxCell.classList.add("text-center");
    maxCell.textContent = job.max_salary;
    row.appendChild(maxCell);

    const actionCell = document.createElement("td");
    actionCell.classList.add("text-center");
    actionCell.innerHTML = `<button class="btn btn-outline-danger" onclick="deleteJob('${job.job_id}')">Delete</button>
      <button class="btn btn-outline-warning" onclick="showUpdateForm('${job.job_id}')">Update</button>`;
    row.appendChild(actionCell);

    tableBody.appendChild(row);
  });
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userDetail");
  window.location.href = "/case-study/html/login.html";
}

let currentPage = 1;
const itemsPerPage = 2;

function loadPage(pageNumber, list) {
  console.log(pageNumber + "AAAAAAAAAAAAAA");
  currentPage = pageNumber;
  const startIndex = (pageNumber - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const jobForPage = list.slice(startIndex, endIndex);

  displayJob(jobForPage);
  updatePaginationControls(pageNumber, list.length);
}

function updatePaginationControls(pageNumber, totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  document.getElementById("prevButton").disabled = pageNumber === 1;
  document.getElementById("pageCount").textContent = pageNumber;
  document.getElementById("nextButton").disabled = pageNumber === totalPages;
}

async function initializeJob() {
  try {
    await loadJob();

    loadPage(1, listJob);
  } catch (error) {
    console.error("Error fetching job:", error);
  }
}

async function deleteJob(id) {
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
      console.log(`Deleting job... ${id}`);
      try {
        const response = await fetch("http://localhost:8081/job/delete/" + id, {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        const data = await response.json();
        console.log(data);
        if (response.ok) {
          console.log("Job deleted successfully");
          initializeJob();
        } else {
          console.log("Failed to delete job ", response);
          Swal.fire({
            icon: "error",
            title: data.info.message,
            text: data.info.detailMessage,
          });
        }
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    }
  });
}

function showUpdateForm(id) {
  console.log(`Showing update form... ${id}`);
  const job = listJob.find((job) => job.job_id === id);
  const jobIdField = document.getElementById("jobId");
  jobIdField.parentElement.style.display = "none";
  document.getElementById("jobTitle").value = job.job_title;
  document.getElementById("jobMinSalary").value = job.min_salary;
  document.getElementById("jobMaxSalary").value = job.max_salary;

  const modal = new bootstrap.Modal(document.getElementById("updateModal"));
  const submitButton = document.getElementById("submitBtn");
  submitButton.addEventListener("click", () => submitUpdate(id));
  modal.show();
}

async function submitUpdate(id) {
  console.log(currentPage);
  console.log(`Submitting changes... ${id}`);
  const job = listJob.find((job) => job.job_id === id);
  const title = document.getElementById("jobTitle").value;
  const minSalary = document.getElementById("jobMinSalary").value;
  const maxSalary = document.getElementById("jobMaxSalary").value;
  try {
    const response = await fetch("http://localhost:8081/job/update/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        job_title: title,
        min_salary: minSalary,
        max_salary: maxSalary,
      }),
    });
    if (response.ok) {
      console.log(currentPage + "NOWW");
      console.log("Job updated successfully");
      initializeJob();
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("updateModal")
      );
      modal.hide();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Job updated successfully",
      });
    } else {
      console.error("Failed to update job");
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update job",
      });
    }
  } catch (error) {
    console.error("Error updating job:", error);
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: `Error updating job: ${error.message}`,
    });
  }
}

function showAddForm() {
  const modal = new bootstrap.Modal(document.getElementById("updateModal"));
  const jobIdField = document.getElementById("jobId");
  jobIdField.parentElement.style.display = "block";
  const submitButton = document.getElementById("submitBtn");
  submitButton.addEventListener("click", () => submitAdd());
  modal.show();
}

async function submitAdd() {
  console.log(`Submitting changes...`);

  const jobId = document.getElementById("jobId").value;
  const title = document.getElementById("jobTitle").value;
  const minSalary = document.getElementById("jobMinSalary").value;
  const maxSalary = document.getElementById("jobMaxSalary").value;

  try {
    const response = await fetch("http://localhost:8081/job/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        job_id: jobId,
        job_title: title,
        min_salary: minSalary,
        max_salary: maxSalary,
      }),
    });
    if (response.ok) {
      console.log("Job added successfully");
      initializeJob();
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("updateModal")
      );
      modal.hide();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Job Added successfully",
      });
    } else {
      console.error("Failed to add Job");
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to add job",
      });
    }
  } catch (error) {
    console.error("Error adding Job:", error);
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: `Error adding job: ${error.message}`,
    });
  }
}

/**
 * Handles the input event for the search bar.
 * Filters the list of jobs based on the current search text and loads the first page of the filtered list.
 * @param {Event} event The input event.
 * @returns {void}
 */
function searchByName() {
  const searchText = document.getElementById("searchBar").value.toLowerCase();
  filteredListJob = listJob.filter((job) =>
    job.job_title.toLowerCase().includes(searchText)
  );
  loadPage(1, filteredListJob);
}

window.addEventListener("load", function () {
  initializeJob();
  document.getElementById("searchBar").addEventListener("input", searchByName);

  function handlePrevButtonClick() {
    console.log(
      `currently on page ${currentPage} next will be ${currentPage - 1}`
    );
    loadPage(currentPage - 1, filteredListJob);
  }

  function handleNextButtonClick() {
    console.log(
      `currently on page ${currentPage} next will be ${currentPage + 1}`
    );
    loadPage(currentPage + 1, filteredListJob);
  }

  document
    .getElementById("prevButton")
    .addEventListener("click", handlePrevButtonClick);
  document
    .getElementById("nextButton")
    .addEventListener("click", handleNextButtonClick);
});
