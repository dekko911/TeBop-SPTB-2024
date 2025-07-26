let hasToken = Cookies.get("auth_token");
let hasAbilities = Cookies.get("abilities");

if (!hasToken || !hasAbilities) {
	alert("Oops, Something went wrong");
	window.location.href = "/login.html";
}

let headers = {
	Authorization: `Bearer ${hasToken}`,
};

let current_user = document.getElementById("current_user");

current_user.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="14" width="12.25" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/></svg> ${hasAbilities}`;

// show data
async function getData() {
	let search = document.getElementById("search").value;

	let urlParam = search ? `?search=${search}` : "";

	const res = await axios.get(
		"http://127.0.0.1:8000/api/user/t_tickets" + urlParam,
		{ headers }
	);

	let data = res.data;

	if (data) {
		if (data.status && data.status == "failed") {
			alert(data.message);
		}
	}

	let data_tickets_entry = document.getElementById("data-tickets-entry");

	if (data_tickets_entry) {
		let tickets = data.tickets;

		if (tickets.length > 0) {
			let elementForTbody = "";

			tickets.forEach((ticket, key) => {
				elementForTbody += `
                  <tr class="text-center">
                      <td class="align-middle text-sm">${key + 1}</td>
                      <td class="align-middle text-sm">
                      ${ticket?.seat?.seat_number}
                      </td>
                      <td class="align-middle text-sm">${
												ticket?.user?.name
											}</td>
                      <td class="align-middle text-sm">
                      ${ticket?.movie?.title}
                      </td>
                      <td class="align-middle text-sm">${
												ticket.code_ticket
											}</td>
                      <td class="align-middle text-sm">
                      ${ticket.purchase_date}
                        </td>
                  </tr>`;
			});

			data_tickets_entry.innerHTML = elementForTbody;
		}
	}
}

getData();

// get search table tickets

let input_search = document.getElementById("search");

if (input_search) {
	input_search.addEventListener("keyup", function () {
		getData();
	});
}

// get select data seats
async function loadSeats(selectedSeats = []) {
	const url = await axios.get("http://127.0.0.1:8000/api/user/t_seats", {
		headers,
	});
	let seats = url.data.seats;
	let dropdown = document.getElementById("input_seat");

	if (dropdown) {
		dropdown.innerHTML = seats
			.map((seat) => {
				const isSelected = selectedSeats.includes(seat.id) ? "selected" : "";
				return `<option value="${seat.id}" ${isSelected}>${seat.seat_number}</option>`;
			})
			.join("");
	}
}

loadSeats();

// get select data users
// async function loadUsers(selectedUsers = []) {
// 	const url = await axios.get("http://127.0.0.1:8000/api/user/users", {
// 		headers,
// 	});
// 	let users = url.data.users;
// 	let dropdown = document.getElementById("input_user");

// 	if (dropdown) {
// 		dropdown.innerHTML = users
// 			.filter((user) => user.id !== 1)
// 			.map((user) => {
// 				const isSelected = selectedUsers.includes(user.id) ? "selected" : "";
// 				return `<option value="${user.id}" ${isSelected}>${user.name}</option>`;
// 			})
// 			.join("");
// 	}
// }

// loadUsers();

// get select data movies
async function loadMovies(selectedMovies = []) {
	const url = await axios.get("http://127.0.0.1:8000/api/user/t_movies", {
		headers,
	});
	let movies = url.data.movies;
	let dropdown = document.getElementById("input_title");

	if (dropdown) {
		dropdown.innerHTML = movies
			.map((movie) => {
				const isSelected = selectedMovies.includes(movie.id) ? "selected" : "";
				return `<option value="${movie.id}" ${isSelected}>${movie.title}</option>`;
			})
			.join("");
	}
}

loadMovies();

// store data tickets
let ticket_form = document.getElementById("ticket-form");

if (ticket_form) {
	ticket_form.addEventListener("submit", async function (event) {
		event.preventDefault();

		let seat = document.getElementById("input_seat");
		// let user = document.getElementById("input_user");
		let title = document.getElementById("input_title");
		let code_ticket = document.getElementById("input_code_ticket").value;
		let purchase_date = document.getElementById("input_date").value;

		let seat_error = document.getElementById("seat_error");
		seat_error.innerHTML = " ";
		// let user_error = document.getElementById("user_error");
		// user_error.innerHTML = " ";
		let title_error = document.getElementById("title_error");
		title_error.innerHTML = " ";
		let code_ticket_error = document.getElementById("code_ticket_error");
		code_ticket_error.innerHTML = " ";
		let purchase_date_error = document.getElementById("date_error");
		purchase_date_error.innerHTML = " ";

		try {
			const data = {
				seat_id: seat.value,
				movie_id: title.value,
				code_ticket,
				purchase_date,
			};

			await axios.post("http://127.0.0.1:8000/api/user/t_tickets", data, {
				headers,
			});

			alert("data has added.");

			ticket_form.reset();
			loadSeats();
			// loadUsers();
			loadMovies();
			getData();
		} catch (error) {
			console.error(error);

			let errors = error.response?.data?.errors;

			if (errors) {
				if (errors.seat_id) {
					seat_error.innerHTML = errors.seat_id;
				}

				if (errors.user_id) {
					user_error.innerHTML = errors.user_id;
				}

				if (errors.movie_id) {
					title_error.innerHTML = errors.movie_id;
				}

				if (errors.code_ticket) {
					code_ticket_error.innerHTML = errors.code_ticket;
				}

				if (errors.purchase_date) {
					purchase_date_error.innerHTML = errors.purchase_date;
				}
			}
		}
	});
}

// logout

let logout = document.getElementById("logout");

if (logout) {
	logout.addEventListener("click", function () {
		Cookies.remove("auth_token");
		Cookies.remove("abilities");
		Cookies.remove("name");
		Cookies.remove("email");

		alert("Success Logout !");

		window.location.href = "/login.html";
	});
}
