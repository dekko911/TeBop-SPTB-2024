let hasToken = Cookies.get("auth_token");

if (!hasToken) {
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
		"http://127.0.0.1:8000/api/admin/users" + urlParam,
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

	let data_users_entry = document.querySelector("#data-users-entry");

	if (data_users_entry) {
		let users = data.users;

		if (users.length > 0) {
			// jika ada data, lakukan loading data

			// let loading = document.getElementById("loading");
			// if (loading) {
			//   loading.style.display = "none";
			// } else {
			//   loading.style.display = "block";
			// }

			let elementForTbody = "";

			users.forEach((user, key) => {
				elementForTbody += `
          <tr class="text-center">
            <td class="align-middle text-sm">${key + 1}</td>
            <td class="align-middle text-sm">${user.name}</td>
            <td class="align-middle text-sm">${user.email}</td>
            <td class="align-middle text-sm">${user?.roles
							?.map((role) => {
								return `<div>
					${role.name}
					</div>`;
							})
							.join("")}</td>
			<td class="align-middle text-sm"><img src="http://127.0.0.1:8000/storage/users/profile/${
				user.profile
			}" alt="profile" style="width: 85px; border-radius: 5px;"></td>
            <td class="ps-4">
              <button type="button" class="btn btn-sm btn-warning my-auto"
                onclick="update(${user.id}, 
                '${user.name}', 
                '${user.email}')">
                Edit
              </button>
              <button type="button" class="btn btn-sm btn-danger my-auto" onclick="delete_user(${
								user.id
							})">
                Delete
              </button>
            </td>
          </tr>
        `;
			});

			data_users_entry.innerHTML = elementForTbody;
		}
	}
}

getData();

// get search data users
let input_search = document.querySelector("#search");

if (input_search) {
	input_search.addEventListener("keyup", () => {
		getData();
	});
}

// store data users
let user_form = document.querySelector("#user-form");

if (user_form) {
	user_form.addEventListener("submit", async (e) => {
		e.preventDefault();

		let id = document.querySelector("#input_id").value;
		let name = document.querySelector("#input_name").value;
		let email = document.querySelector("#input_email").value;
		let password = document.querySelector("#input_password").value;
		let profile = document.querySelector("#input_profile").files[0];

		let name_error = document.querySelector("#name_error");
		name_error.innerHTML = " ";
		let email_error = document.querySelector("#email_error");
		email_error.innerHTML = " ";
		let password_error = document.querySelector("#password_error");
		password_error.innerHTML = " ";
		let profile_error = document.querySelector("#profile_error");
		profile_error.innerHTML = " ";

		try {
			const formData = new FormData();

			if (
				user_form.name &&
				user_form.email &&
				user_form.password &&
				user_form.profile
			) {
				formData.append("name", name);
				formData.append("email", email);
				formData.append("password", password);
				formData.append("profile", profile);
			}

			const userData = {};

			formData.forEach((value, key) => {
				userData[key] = value;
			});

			if (id) {
				const res = await axios.patch(
					"http://127.0.0.1:8000/api/admin/users/" + id,
					userData,
					{
						headers,
					}
				);

				document.querySelector("#input_id").value = "";

				if (res.data.status && res.data.status == "success") {
					alert("data has changed !");
				}

				if (res.data.status && res.data.status == "error") {
					alert("User Admin Can't Edit !");
				}
			} else {
				await axios.post("http://127.0.0.1:8000/api/admin/users", formData, {
					headers,
				});

				alert("data has added !");
			}

			// and throw some error is kinda like "duplicate data" in this line.

			user_form.reset();
			getData();
		} catch (error) {
			// console.error(error);

			// untuk peringatan tidak ada masukan input
			let errors = error.response?.data?.errors;

			if (errors) {
				if (errors.name) {
					name_error.innerHTML = errors.name;
				}

				if (errors.email) {
					email_error.innerHTML = errors.email;
				}

				if (errors.password) {
					password_error.innerHTML = errors.password;
				}

				if (errors.profile) {
					profile_error.innerHTML = errors.profile;
				}
			}
		}
	});
}

// update data users
async function update(id, name, email) {
	let input_name = document.querySelector("#input_name");
	let input_email = document.querySelector("#input_email");

	input_name.value = name;
	input_email.value = email;

	document.querySelector("#input_id").value = id;
}

// delete data users
async function delete_user(id) {
	if (!confirm("Are you sure for delete this data?")) {
		return alert("Cancel delete");
	}

	try {
		const res = await axios.delete(
			"http://127.0.0.1:8000/api/admin/users/" + id,
			{
				headers,
			}
		);

		if (res.data.status && res.data.status == "User deleted") {
			alert("data has deleted !");
		}

		if (res.data.status && res.data.status == "forbidden") {
			alert("Can't Delete Admin User !");
		}

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
