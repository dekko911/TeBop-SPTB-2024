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

// show data
async function getData() {
	let search = document.getElementById("search").value;

	let urlParam = search ? `?search=${search}` : "";

	const res = await axios.get(
		"http://127.0.0.1:8000/api/user/t_payments" + urlParam,
		{ headers }
	);

	let data = res.data;

	if (data) {
		if (data.status && data.status == "failed") {
			alert(data.message);
		}
	}

	let data_payments_entry = document.getElementById("data-payments-entry");

	if (data_payments_entry) {
		let payments = data.payments;

		if (payments.length > 0) {
			let elementForTbody = "";

			payments.forEach((payment, key) => {
				elementForTbody += `
                    <tr class="text-center">
                        <td class="align-middle text-sm">${key + 1}</td>
                        <td class="align-middle text-sm">
                        ${payment?.ticket?.code_ticket}
                        </td>
                        <td class="align-middle text-sm">
                        ${payment?.user?.name}
                        </td>
                        <td class="align-middle text-sm">
                        ${payment.payment_date_iso} WITA
                        </td>
                        <td class="align-middle text-sm">${payment.price}</td>
                        <td class="align-middle text-sm">${payment.status}</td>
                    </tr>`;
			});

			data_payments_entry.innerHTML = elementForTbody;
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

// get data select tickets
async function loadTickets(selectedTickets = []) {
	const url = await axios.get("http://127.0.0.1:8000/api/user/t_tickets", {
		headers,
	});
	let tickets = url.data.tickets;
	let dropdown = document.getElementById("input_ticket");

	if (dropdown) {
		dropdown.innerHTML = tickets
			.map((ticket) => {
				const isSelected = selectedTickets.includes(ticket.id)
					? "selected"
					: "";
				return `<option value="${ticket.id}" ${isSelected}>${ticket.code_ticket}</option>`;
			})
			.join("");
	}
}

loadTickets();

//get data select users
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

// store data tickets
let payment_form = document.getElementById("payment-form");

if (payment_form) {
	payment_form.addEventListener("submit", async function (event) {
		event.preventDefault();

		let ticket = document.getElementById("input_ticket");
		// let user = document.getElementById("input_user");
		let payment_date = document.getElementById("input_date").value;
		let price = document.getElementById("input_price").value;
		let status = document.getElementById("input_status").value;

		let ticket_error = document.getElementById("ticket_error");
		ticket_error.innerHTML = " ";
		// let user_error = document.getElementById("user_error");
		// user_error.innerHTML = " ";
		let date_error = document.getElementById("date_error");
		date_error.innerHTML = " ";
		let price_error = document.getElementById("price_error");
		price_error.innerHTML = " ";
		let status_error = document.getElementById("status_error");
		status_error.innerHTML = " ";

		try {
			const data = {
				ticket_id: ticket.value,
				payment_date,
				price,
				status,
			};
			await axios.post("http://127.0.0.1:8000/api/user/t_payments", data, {
				headers,
			});

			alert("data has added.");

			payment_form.reset();

			loadTickets();
			// loadUsers();
			getData();
		} catch (error) {
			let errors = error.response?.data?.errors;

			if (errors) {
				if (errors.ticket_id) {
					ticket_error.innerHTML = errors.ticket_id;
				}

				if (errors.user_id) {
					user_error.innerHTML = errors.user_id;
				}

				if (errors.payment_date) {
					date_error.innerHTML = errors.payment_date;
				}

				if (errors.price) {
					price_error.innerHTML = errors.price;
				}

				if (errors.status) {
					status_error.innerHTML = errors.status;
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
