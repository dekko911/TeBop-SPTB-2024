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
    "http://127.0.0.1:8000/api/admin/t_seats" + urlParam,
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

  let data_seats_entry = document.getElementById("data-seats-entry");

  if (data_seats_entry) {
    let seats = data.seats;

    if (seats.length > 0) {
      let elementForTbody = "";

      seats.forEach((seat, key) => {
        elementForTbody += `
        <tr class="text-center">
            <td class="align-middle text-sm">${key + 1}</td>
            <td class="align-middle text-sm">${seat?.show?.showtime}</td>
            <td class="align-middle text-sm">${seat.seat_number}</td>
            <td class="align-middle text-sm">${seat.seat_status}</td>
              <td class="ps-4">
              <button type="button" class="btn btn-warning my-auto" onclick="update(${
                seat.id
              }, 
              '${seat.show_id}', 
              '${seat.seat_number}', 
              '${seat.seat_status}')"
              >
              Edit
              </button>
              <button type="button" class="btn btn-danger my-auto" onclick="delete_seat(${
                seat.id
              })"
              >
              Delete
              </button>
              </td>
        </tr>`;
      });

      data_seats_entry.innerHTML = elementForTbody;
    }
  }
}

getData();

// get search table seats

let input_search = document.getElementById("search");

if (input_search) {
  input_search.addEventListener("keyup", function () {
    getData();
  });
}

// get select data shows
async function loadShows(selectedShows = []) {
  const url = await axios.get("http://127.0.0.1:8000/api/admin/t_shows", {
    headers,
  });
  let shows = url.data.shows;
  let dropdown = document.getElementById("input_show");

  if (dropdown) {
    dropdown.innerHTML = shows
      .map((show) => {
        const isSelected = selectedShows.includes(show.id) ? "selected" : "";
        return `<option value="${show.id} ${isSelected}">${show.showtime}</option>`;
      })
      .join("");
  }
}

loadShows();

// store data seats

let seat_form = document.getElementById("seat-form");

if (seat_form) {
  seat_form.addEventListener("submit", async function (event) {
    event.preventDefault();

    let id = document.getElementById("input_id").value;
    let show = document.getElementById("input_show");
    let seat_number = document.getElementById("input_seat_number").value;
    let seat_status = document.getElementById("input_seat_status").value;

    let show_error = document.getElementById("show_error");
    show_error.innerHTML = " ";
    let seatNumber_error = document.getElementById("seatNumber_error");
    seatNumber_error.innerHTML = " ";
    let seatStatus_error = document.getElementById("seatStatus_error");
    seatStatus_error.innerHTML = " ";

    try {
      const data = { show_id: show.value, seat_number, seat_status };

      if (id) {
        await axios.patch(
          "http://127.0.0.1:8000/api/admin/t_seats/" + id,
          data,
          {
            headers,
          }
        );

        document.getElementById("input_id").value = "";

        alert("data has changed !");
      } else {
        await axios.post("http://127.0.0.1:8000/api/admin/t_seats", data, {
          headers,
        });

        alert("data has added !");
      }

      seat_form.reset();

      loadShows();
      getData();
    } catch (error) {
      let errors = error.response?.data?.errors;
      // let dataError = error.response?.data?.message;

      // alert(dataError);

      if (errors) {
        if (errors.show_id) {
          show_error.innerHTML = errors.show_id;
        }

        if (errors.seat_number) {
          seatNumber_error.innerHTML = errors.seat_number;
        }

        if (errors.seat_status) {
          seatStatus_error.innerHTML = errors.seat_status;
        }
      }
    }
  });
}

// update data seats
async function update(id, show_id, seat_number, seat_status) {
  let input_show = document.getElementById("input_show");
  let input_seat_number = document.getElementById("input_seat_number");
  let input_seat_status = document.getElementById("input_seat_status");

  input_show.value = show_id;
  input_seat_number.value = seat_number;
  input_seat_status.value = seat_status;

  document.getElementById("input_id").value = id;
}

// delete data seats
async function delete_seat(id) {
  if (!confirm("Are you sure for delete this data ?")) {
    return alert("Cancel delete.");
  }

  try {
    await axios.delete("http://127.0.0.1:8000/api/admin/t_seats/" + id, {
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
    Cookies.remove("auth_token");
    Cookies.remove("abilities");
    Cookies.remove("name");
    Cookies.remove("email");

    alert("Success Logout !");

    window.location.href = "/login.html";
  });
}
