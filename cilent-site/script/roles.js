let hasToken = Cookies.get("auth_token");
let hasAbilities = Cookies.get("abilities");

if (!hasToken || !hasAbilities) {
	alert("Oops, Something went wrong");
	window.location.href = "/login.html";
}

let headers = {
	Authorization: `Bearer ${hasToken}`,
};

// show data
async function getData() {
	let search = document.querySelector("#search").value;

	let urlParam = search ? `?search=${search}` : "";

	const res = await axios.get(
		"http://127.0.0.1:8000/api/admin/roles" + urlParam,
		{
			headers,
		}
	);

	let data = res.data;

	if (data) {
		if (data.status && data.status == "failed") {
			alert(data.message);
		}
	}

	let data_roles_entry = document.querySelector("#data-roles-entry");

	if (data_roles_entry) {
		let roles = data.roles;

		if (roles.length > 0) {
			let elementForTbody = "";

			roles.forEach((role, key) => {
				elementForTbody += `
				<tr class="text-center">
					<td class="align-middle text-sm">${key + 1}</td>
					<td class="align-middle text-sm">${role?.user?.name}</td>
					<td class="align-middle text-sm">${role.name}</td>
					<td class="ps-2">
						<button type="button" class="btn btn-sm btn-danger my-auto" onclick="delete_role(${
							role.id
						})">Delete</button>
					</td>
				</tr>
			`;

				if (role.name == "admin") {
					elementForTbody = `
				<tr class="text-center">
					<td class="align-middle text-sm">${key + 1}</td>
					<td class="align-middle text-sm">${role?.user?.name}</td>
					<td class="align-middle text-sm">${role.name}</td>
					<td class="ps-2">
						<button type="button" class="btn btn-sm btn-secondary my-auto" disabled>Delete
						</button>
					</td>
				</tr>
			`;
				}
			});

			data_roles_entry.innerHTML = elementForTbody;
		}
	}
}

getData();

// get search data roles
let input_search = document.querySelector("#search");

if (input_search) {
	input_search.addEventListener("keyup", function () {
		getData();
	});
}

// get select users data
async function loadUsers(selectedUsers = []) {
	const url = await axios.get("http://127.0.0.1:8000/api/admin/users", {
		headers,
	});
	let users = url.data.users;
	let dropdown = document.querySelector("#select_user");

	if (dropdown) {
		dropdown.innerHTML = users
			.map((user) => {
				const isSelected = selectedUsers.includes(user.id) ? "selected" : "";
				return `<option value="${user.id}" ${isSelected}>${user.name}</option>`;
			})
			.join("");
	}
}

loadUsers();

// store data
let role_form = document.querySelector("#role-form");

if (role_form) {
	role_form.addEventListener("submit", async function (e) {
		e.preventDefault();

		let user = document.querySelector("#select_user");
		let name = document.querySelector("#input_name").value;

		let user_error = document.querySelector("#user_error");
		user_error.innerHTML = " ";
		let name_error = document.querySelector("#name_error");
		name_error.innerHTML = " ";

		try {
			const data = { user_id: user.value, name };

			if (data.user_id == 1) {
				alert("You can't add admin role.");
				return;
			}

			if (data.name == "admin") {
				alert("You can't add admin role.");
				return;
			}

			await axios.post("http://127.0.0.1:8000/api/admin/roles", data, {
				headers,
			});

			alert("data has added !");

			role_form.reset();

			loadUsers();
			getData();
		} catch (error) {
			let errors = error.response?.data?.errors;

			if (errors) {
				if (errors.user_id) {
					user_error.innerHTML = errors.user_id;
				}

				if (errors.name) {
					name_error.innerHTML = errors.name;
				}
			}
		}
	});
}

// delete data roles
async function delete_role(id) {
	if (!confirm("Are you sure for delete this data?")) {
		return alert("Cancel delete");
	}

	try {
		await axios.delete("http://127.0.0.1:8000/api/admin/roles/" + id, {
			headers,
		});
		alert("data has deleted !");
		getData();
	} catch (error) {
		console.log(error);
	}
}

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
