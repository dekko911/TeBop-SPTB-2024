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

async function getData() {
	let search = document.getElementById("search").value;

	let urlParam = search ? `?search=${search}` : "";

	const res = await axios.get(
		"http://127.0.0.1:8000/api/admin/t_genres" + urlParam,
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

	let data_genres_entry = document.getElementById("data-genres-entry");

	if (data_genres_entry) {
		let genres = data.genres;

		if (genres.length > 0) {
			let elementForTbody = "";

			genres.forEach((genre, key) => {
				elementForTbody += `
            <tr class="text-center">
                <td class="align-middle text-sm">${key + 1}</td>
                <td class="align-middle text-sm">${genre.genre}</td>
                <td>
                    <button type="button"
                    class="btn btn-danger my-auto"
                    onclick="delete_genre(${genre.id})"
                    >
                    Delete
                    </button>
                </td>
            </tr>`;
			});

			data_genres_entry.innerHTML = elementForTbody;
		}
	}
}

getData();

// get search table genres

let input_search = document.getElementById("search");

if (input_search) {
	input_search.addEventListener("keyup", function () {
		getData();
	});
}

// store data genres

let genre_form = document.getElementById("genre-form");

if (genre_form) {
	genre_form.addEventListener("submit", async function (event) {
		event.preventDefault();

		let genre = document.getElementById("input_genre").value;

		let genre_error = document.getElementById("genre_error");
		genre_error.innerHTML = " ";

		try {
			const data = { genre };
			await axios.post("http://127.0.0.1:8000/api/admin/t_genres", data, {
				headers,
			});

			alert("data has added !");

			genre_form.reset();
			getData();
		} catch (error) {
			//console.error(error);

			let errors = error.response?.data?.errors;

			if (errors) {
				if (errors.genre) {
					genre_error.innerHTML = errors.genre;
				}
			}
		}
	});
}

// delete data genres
async function delete_genre(id) {
	if (!confirm("Are you sure for delete this data ?")) {
		return alert("Cancel delete.");
	}

	try {
		await axios.delete("http://127.0.0.1:8000/api/admin/t_genres/" + id, {
			headers,
		});
		alert("data has deleted !");
		getData();
	} catch (error) {
		console.error(error);
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
