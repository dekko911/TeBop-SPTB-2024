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
    "http://127.0.0.1:8000/api/admin/t_shows" + urlParam,
    {
      headers,
    }
  );

  let data = res.data;

  if (data) {
    if (data.status && data.status == "failed") {
      alert("Your not provided in this page!");
    }
  }

  let data_shows_entry = document.getElementById("data-shows-entry");

  if (data_shows_entry) {
    let shows = data.shows;

    if (shows.length > 0) {
      let elementForTbody = "";

      shows.forEach((show, key) => {
        elementForTbody += `
                <tr class="text-center">
                    <td class="align-middle text-sm">${key + 1}</td>
                    <td class="align-middle text-sm">${show?.movie?.title}</td>
                    <td class="align-middle text-sm">${
                      show?.studio?.studio
                    }</td>
                    <td class="align-middle text-sm">${show.showtime}</td>
                      <td class="ps-4">
                      <button type="button" class="btn btn-warning my-auto" onclick="update(${
                        show.id
                      }, 
                      '${show.movie_id}',
                      '${show.studio_id}',
                      '${show.showtime}')"
                      >
                      Edit
                      </button>
                      <button type="button" class="btn btn-danger my-auto" onclick="delete_show(${
                        show.id
                      })"
                      >
                      Delete
                      </button>
                      </td>
                </tr>`;
      });

      data_shows_entry.innerHTML = elementForTbody;
    }
  }
}

getData();

// get search table shows

let input_search = document.getElementById("search");

if (input_search) {
  input_search.addEventListener("keyup", function () {
    getData();
  });
}

// get select data movies
async function loadMovies(selectedMovies = []) {
  const url = await axios.get("http://127.0.0.1:8000/api/admin/t_movies", {
    headers,
  });
  let movies = url.data.movies;
  let dropdown = document.getElementById("input_movie");

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

// get select data studios
async function loadStudios(selectedStudios = []) {
  const url = await axios.get("http://127.0.0.1:8000/api/admin/t_studios", {
    headers,
  });
  let studios = url.data.studios;
  let dropdown = document.getElementById("input_studio");

  if (dropdown) {
    dropdown.innerHTML = studios
      .map((studio) => {
        const isSelected = selectedStudios.includes(studio.id)
          ? "selected"
          : "";
        return `<option value="${studio.id}" ${isSelected}>${studio.studio}</option>`;
      })
      .join("");
  }
}

loadStudios();

// store data shows
let show_form = document.getElementById("show-form");

if (show_form) {
  show_form.addEventListener("submit", async function (event) {
    event.preventDefault();

    let id = document.getElementById("input_id").value;
    let movie = document.getElementById("input_movie");
    let studio = document.getElementById("input_studio");
    let showtime = document.getElementById("input_showtime").value;

    let movie_error = document.getElementById("movie_error");
    movie_error.innerHTML = " ";
    let studio_error = document.getElementById("studio_error");
    studio_error.innerHTML = " ";
    let showtime_error = document.getElementById("showtime_error");
    showtime_error.innerHTML = " ";

    try {
      const data = { movie_id: movie.value, studio_id: studio.value, showtime };

      if (id) {
        await axios.patch(
          "http://127.0.0.1:8000/api/admin/t_shows/" + id,
          data,
          {
            headers,
          }
        );

        document.getElementById("input_id").value = "";

        alert("data has changed !");
      } else {
        await axios.post("http://127.0.0.1:8000/api/admin/t_shows", data, {
          headers,
        });

        alert("data has added !");
      }

      show_form.reset();

      loadMovies();
      loadStudios();
      getData();
    } catch (error) {
      let errors = error.response?.data?.errors;

      if (errors) {
        if (errors.movie_id) {
          movie_error.innerHTML = errors.movie_id;
        }

        if (errors.studio_id) {
          studio_error.innerHTML = errors.studio_id;
        }

        if (errors.showtime) {
          showtime_error.innerHTML = errors.showtime;
        }
      }
    }
  });
}

// update data shows
async function update(id, movie_id, studio_id, showtime) {
  let input_movie = document.getElementById("input_movie");
  let input_studio = document.getElementById("input_studio");
  let input_showtime = document.getElementById("input_showtime");

  input_movie.value = movie_id;
  input_studio.value = studio_id;
  input_showtime.value = showtime;

  document.getElementById("input_id").value = id;
}

//delete data shows
async function delete_show(id) {
  if (!confirm("Are you sure for delete this data ?")) {
    return alert("Cancel delete.");
  }

  try {
    await axios.delete("http://127.0.0.1:8000/api/admin/t_shows/" + id, {
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

    alert("Success Logout !");

    window.location.href = "/login.html";
  });
}
