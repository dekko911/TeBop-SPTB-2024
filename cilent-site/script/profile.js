let hasToken = Cookies.get("auth_token");
let hasAbilities = Cookies.get("abilities");
let hasName = Cookies.get("name");
let hasEmail = Cookies.get("email");
let hasProfile = Cookies.get("profile");

if (!hasToken) {
	alert("Oops, Something went wrong");
	window.location.href = "/login.html";
}

let currentName = document.getElementById("current_name");
let currentEmail = document.getElementById("current_email");
let currentUser = document.getElementById("current_user");
let images = document.querySelectorAll("#current_profile");

currentName.innerHTML = `${hasName}`;
currentEmail.innerHTML = `${hasEmail}`;
currentUser.innerHTML = `${hasAbilities}`;
images.forEach((image) => {
	image.src = `${
		hasProfile
			? `http://127.0.0.1:8000/storage/users/profile/${hasProfile}`
			: "/assets/img/pngegg.png"
	}`;
});
//console.log(hasProfile);

// logout

let logout = document.getElementById("logout");

if (logout) {
	logout.addEventListener("click", function () {
		Cookies.remove("name");
		Cookies.remove("email");
		Cookies.remove("auth_token");
		Cookies.remove("abilities");
		Cookies.remove("profile");

		alert("Success Logout !");

		window.location.href = "/login.html";
	});
}
