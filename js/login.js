const messageElement = document.getElementById("message");

async function signIn(event) {
  console.log("Signing in...");
  event.preventDefault();

  const username = document.getElementById("usernameSignin").value;
  const password = document.getElementById("passwordSignin").value;

  const response = await fetch("http://localhost:8081/auth/sign-in", {
    method: "GET",
    headers: {
      Authorization: "Basic " + btoa(username + ":" + password),
    },
  });

  console.log(response);
  if (response.ok) {
    const data = await response.json();
    var token = await response.headers.get("Authorization");
    console.log(data.content);
    localStorage.setItem("token", token);
    localStorage.setItem("userDetail", JSON.stringify(data.content));
    // messageElement.innerText =
    //   "Sign-in successful! Welcome, " +
    //   data.content.firstName +
    //   " " +
    //   data.content.lastName;
    window.location.href = "/case-study/html/employee.html";
  } else {
    messageElement.style.color = "red";
    messageElement.classList = "text-center";
    messageElement.innerText = "Invalid Username or password";
  }
}

function register() {
  window.location.href = "/case-study/html/register.html";
}

window.onload = function () {
  const token = localStorage.getItem("token");
  const userDetail = localStorage.getItem("userDetail");
  if (token) {
    window.location.href = "/case-study/html/employee.html";
  }
  if (userDetail) {
    document.getElementById("usernameSignin").value =
      JSON.parse(userDetail).email;
  }
};
