let hasToken = Cookies.get("auth_token");
let hasAbilities = Cookies.get("abilities");
let hasName = Cookies.get("name");
let hasEmail = Cookies.get("email");

if (!hasToken) {
  alert("Oops, Something went wrong");
  window.location.href = "/login.html";
}

let headers = {
  Authorization: `Bearer ${hasToken}`,
};

let currentName = document.getElementById("current_name");
let currentEmail = document.getElementById("current_email");
let currentUser = document.getElementById("current_user");

currentName.innerHTML = `${hasName}`;
currentEmail.innerHTML = `${hasEmail}`;
currentUser.innerHTML = `${hasAbilities}`;

// logout

let logout = document.getElementById("logout");

if (logout) {
  logout.addEventListener("click", function () {
    Cookies.remove("name");
    Cookies.remove("email");
    Cookies.remove("auth_token");
    Cookies.remove("abilities");

    alert("Success Logout !");

    window.location.href = "/login.html";
  });
}
