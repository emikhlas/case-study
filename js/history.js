var listHistory = [];
var filterdListHistory = [];

async function searchHistory() {
  const searchText = document.getElementById("searchBar").value.toLowerCase();
  filterdListHistory = listHistory.filter(
    (history) =>
      history.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      history.jobTitle.toLowerCase().includes(searchText.toLowerCase()) ||
      history.departmentName.toLowerCase().includes(searchText.toLowerCase())
  );
  loadPage(1, filterdListHistory);
}

async function loadHistory() {
  console.log(localStorage.getItem("token"));
  if (localStorage.getItem("token")) {
    try {
      const response = await fetch(
        "http://localhost:8081/job-hist/all/detail",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        listHistory = data.content;

        filterdListHistory = listHistory;
        console.log(listHistory);
      } else {
        document.getElementById("info").textContent =
          "Failed to load history: " + data.message;
      }
    } catch (error) {
      console.error("Error loading history:", error);
      document.getElementById("info").textContent =
        "An error occurred. Please try again.";
    }
  } else {
    window.location.href = "/case-study/html/login.html";
  }
}

function displayHistory(list) {
  const tableBody = document
    .getElementById("historyTable")
    .querySelector("tbody");
  tableBody.innerHTML = "";

  list.forEach((history) => {
    const row = document.createElement("tr");

    // Create cells for each piece of data in EmployeeDto
    const idCell = document.createElement("td");
    idCell.classList.add("text-center");
    idCell.textContent = history.employeeId;
    row.appendChild(idCell);

    const nameCell = document.createElement("td");
    nameCell.classList.add("text-center");
    nameCell.textContent = history.fullName;
    row.appendChild(nameCell);

    const startDateCell = document.createElement("td");
    startDateCell.classList.add("text-center");
    startDateCell.textContent = history.startDate;
    row.appendChild(startDateCell);

    const endDateCell = document.createElement("td");
    endDateCell.classList.add("text-center");
    endDateCell.textContent = !history.endDate ? "Active" : history.endDate;
    row.appendChild(endDateCell);

    const jobTitleCell = document.createElement("td");
    jobTitleCell.classList.add("text-center");
    jobTitleCell.textContent = history.jobTitle;
    row.appendChild(jobTitleCell);

    const departmentCell = document.createElement("td");
    departmentCell.classList.add("text-center");
    departmentCell.textContent = history.departmentName;
    row.appendChild(departmentCell);

    tableBody.appendChild(row);
  });
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
  const historyForPage = list.slice(startIndex, endIndex);

  displayHistory(historyForPage);
  updatePaginationControls(pageNumber, list.length);
}

function updatePaginationControls(pageNumber, totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  document.getElementById("prevButton").disabled = pageNumber === 1;
  document.getElementById("pageCount").textContent = pageNumber;
  document.getElementById("nextButton").disabled = pageNumber === totalPages;
}

async function initializeHistory() {
  try {
    await loadHistory();

    loadPage(1, listHistory);
  } catch (error) {
    console.error("Error fetching job history:", error);
  }
}

window.addEventListener("load", function () {
  initializeHistory();

  document.getElementById("searchBar").addEventListener("input", searchHistory);

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
