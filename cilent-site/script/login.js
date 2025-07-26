let hasToken = Cookies.get("auth_token");
let hasAbilities = Cookies.get("abilities");
let hasName = Cookies.get("name");
let hasEmail = Cookies.get("email");
let hasProfile = Cookies.get("profile");

if (hasToken) {
	console.log("Has Token : " + hasToken);
}

if (hasAbilities) {
	console.log("Has Abilities : " + hasAbilities);
}

let formLogin = document.getElementById("formLogin");

if (formLogin) {
	formLogin.addEventListener("submit", async function (e) {
		e.preventDefault();
		let email = document.querySelector("#email").value;
		let password = document.querySelector("#password").value;

		try {
			const url = "http://127.0.0.1:8000/api/login";

			const res = await axios.post(url, { email, password });
			// console.log(res.data);

			if (res.data) {
				if (res.data.status && res.data.status == "success") {
					let plainTextToken = res.data.token.plainTextToken;

					let token = plainTextToken.split("|")[1];

					let abilities = res.data.token.accessToken.abilities;

					let name = res.data.user.name;
					let email = res.data.user.email;

					let profile = res.data.user.profile;

					Cookies.set("auth_token", token);
					Cookies.set("abilities", abilities);
					Cookies.set("name", name);
					Cookies.set("email", email);
					Cookies.set("profile", profile);

					if (abilities == "admin") {
						window.location.href = "/admin/dashboard.html";
					} else {
						window.location.href = "/user/dashboard.html";
					}

					alert("Success Login !");
				}

				if (res.data.status && res.data.status == "fail") {
					alert("Your credentials is not match of our record!");
				}

				if (res.data.status && res.data.status == "error") {
					alert("You do not have any roles assigned!");
				}
			}
		} catch (error) {
			//console.error(error);
		}
	});
}
