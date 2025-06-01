let hasToken = Cookies.get("auth_token");
let hasAbilities = Cookies.get("abilities");

if (!hasToken) {
	alert("Oops, Something went wrong");
	window.location.href = "/login.html";
}

let headers = {
	Authorization: `Bearer ${hasToken}`,
};

let current_user = document.getElementById("current_user");

current_user.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="14" width="12.25" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/></svg> ${hasAbilities}`;

//get data
async function getAllData() {
	const res_users = await axios.get("http://127.0.0.1:8000/api/admin/users", {
		headers,
	});
	const res_movies = await axios.get(
		"http://127.0.0.1:8000/api/admin/t_movies",
		{
			headers,
		}
	);
	const res_studios = await axios.get(
		"http://127.0.0.1:8000/api/admin/t_studios",
		{
			headers,
		}
	);
	const res_roles = await axios.get("http://127.0.0.1:8000/api/admin/roles", {
		headers,
	});

	const users = res_users.data.users;
	const movies = res_movies.data.movies;
	const studios = res_studios.data.studios;
	const roles = res_roles.data.roles;

	function filterDuplicates(array) {
		return array.filter(
			(role, index, array) =>
				index === array.findIndex((item) => item.name === role.name)
		);
	}

	let count_users = document.getElementById("user-count");
	let count_movies = document.getElementById("movie-count");
	let count_studios = document.getElementById("studio-count");
	let count_roles = document.getElementById("role-count");

	if (count_users) {
		count_users.innerHTML = `<h5 class="text-white font-weight-bolder mb-0 mt-3">${users.length}</h5>`;
	}

	if (count_movies) {
		count_movies.innerHTML = `<h5 class="text-white font-weight-bolder mb-0 mt-3">${movies.length}</h5>`;
	}

	if (count_studios) {
		count_studios.innerHTML = `<h5 class="text-white font-weight-bolder mb-0 mt-3">${studios.length}</h5>`;
	}

	if (count_roles) {
		count_roles.innerHTML = `<h5 class="text-white font-weight-bolder mb-0 mt-3">${
			filterDuplicates(roles).length
		}</h5>`;
	}
}

getAllData();

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
