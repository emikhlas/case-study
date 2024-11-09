var listJob = [];
var listDepartment = [];

async function signUp(event) {
  console.log("Signing up...");
  event.preventDefault();

  const password = document.getElementById("passwordSignup").value;
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("emailSignup").value;
  const phoneNumber = document.getElementById("phonenumber").value;
  const hireDate = new Date(
    document.getElementById("hireDate").value
  ).toISOString();
  const jobId = document.getElementById("jobForm").value;
  const managerId = parseInt(document.getElementById("managerId").value);
  const departmentId = parseInt(document.getElementById("deptForm").value);
  const salary = parseFloat(document.getElementById("salary").value);
  const commissionPct = parseFloat(
    document.getElementById("commissionPct").value
  );

  const response = await fetch("http://localhost:8081/auth/sign-up", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
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
  });

  console.log(response);
  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("userDetail", JSON.stringify(data.content));
    window.location.href = "/case-study/html/login.html";
  } else {
    const data = await response.json();
    console.log(data.message);
    const messageElement = document.getElementById("message");
    messageElement.textContent = data.message;
    messageElement.style.color = "red";
  }
}

async function loadJobs() {
  const response = await fetch("http://localhost:8081/job/all");
  const data = await response.json();
  listJob = data.content;
}

async function loadDepartments() {
  const response = await fetch("http://localhost:8081/dept/all");
  const data = await response.json();
  listDepartment = data.content;
}

window.onload = async function () {
  try {
    await Promise.all([loadJobs(), loadDepartments()]);
    const jobForm = document.getElementById("jobForm");
    const departmentForm = document.getElementById("deptForm");

    listJob.forEach((job) => {
      const option = document.createElement("option");
      option.value = job.job_id;
      option.style.color = "black";
      console.log(job);
      option.text = job.job_title;
      jobForm.appendChild(option);
    });

    console.log(listDepartment);
    listDepartment.forEach((department) => {
      const option = document.createElement("option");
      option.style.color = "black";
      option.value = department.id;
      console.log(department);
      option.text = department.name;
      departmentForm.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading jobs and departments:", error);
  }
};
