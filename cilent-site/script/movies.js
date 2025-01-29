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
    "http://127.0.0.1:8000/api/admin/t_movies" + urlParam,
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

  let data_movies_entry = document.getElementById("data-movies-entry");

  if (data_movies_entry) {
    let movies = data.movies;

    if (movies.length > 0) {
      let elementForTbody = "";

      movies.forEach((movie, key) => {
        elementForTbody += `
              <tr class="text-center">
                  <td class="align-middle text-sm">${key + 1}</td>
                  <td class="align-middle text-sm">${movie.title}</td>
                  <td class="align-middle text-sm">${movie?.genre?.genre}</td>
                  <td class="align-middle text-sm">${movie.duration}</td>
                  <td class="align-middle text-sm">${movie.release_date}</td>
                    <td class="ps-4">
                    <button type="button" class="btn btn-warning my-auto" onclick="update(${
                      movie.id
                    }, 
                    '${movie.title}', 
                    '${movie.genre_id}', 
                    '${movie.duration}', 
                    '${movie.release_date}')"
                    >
                      Edit
                    </button>
                      <button
                      type="button"
                      class="btn btn-danger my-auto"
                      onclick="delete_movie(${movie.id})"
                      >
                      Delete
                      </button>
                    </td>
              </tr>`;
      });

      data_movies_entry.innerHTML = elementForTbody;
    }
  }
}

getData();

// get search table movies

let input_search = document.getElementById("search");

if (input_search) {
  input_search.addEventListener("keyup", function () {
    getData();
  });
}

// get select genres data
async function loadGenres(selectedGenres = []) {
  const url = await axios.get("http://127.0.0.1:8000/api/admin/t_genres", {
    headers,
  });
  let genres = url.data.genres;
  let dropdown = document.getElementById("input_genre");

  if (dropdown) {
    dropdown.innerHTML = genres
      .map((genre) => {
        const isSelected = selectedGenres.includes(genre.id) ? "selected" : "";
        return `<option value="${genre.id}" ${isSelected}>${genre.genre}</option>`;
      })
      .join("");
  }
}

loadGenres();

// store data movies

let movie_form = document.getElementById("movie-form");

if (movie_form) {
  movie_form.addEventListener("submit", async function (event) {
    event.preventDefault();

    let id = document.getElementById("input_id").value;
    let title = document.getElementById("input_title").value;
    let duration = document.getElementById("input_duration").value;
    let release_date = document.getElementById("input_date").value;
    let genre = document.getElementById("input_genre");

    let title_error = document.getElementById("title_error");
    title_error.innerHTML = " ";
    let duration_error = document.getElementById("duration_error");
    duration_error.innerHTML = " ";
    let release_date_error = document.getElementById("date_error");
    release_date_error.innerHTML = " ";
    let genre_error = document.getElementById("genre_error");
    genre_error.innerHTML = " ";

    try {
      const data = { title, genre_id: genre.value, duration, release_date };

      if (id) {
        await axios.patch(
          "http://127.0.0.1:8000/api/admin/t_movies/" + id,
          data,
          {
            headers,
          }
        );

        document.getElementById("input_id").value = "";

        alert("data has changed !");
      } else {
        await axios.post("http://127.0.0.1:8000/api/admin/t_movies", data, {
          headers,
        });

        alert("data has added !");
      }

      movie_form.reset();

      loadGenres();
      getData();
    } catch (error) {
      let errors = error.response?.data?.errors;

      if (errors) {
        if (errors.title) {
          title_error.innerHTML = errors.title;
        }

        if (errors.genre_id) {
          genre_error.innerHTML = errors.genre_id;
        }

        if (errors.duration) {
          duration_error.innerHTML = errors.duration;
        }

        if (errors.release_date) {
          date_error.innerHTML = errors.release_date;
        }
      }
    }
  });
}

// update data movies
async function update(id, title, genre_id, duration, release_date) {
  let input_title = document.getElementById("input_title");
  let input_genre = document.getElementById("input_genre");
  let input_duration = document.getElementById("input_duration");
  let input_date = document.getElementById("input_date");

  input_title.value = title;
  input_genre.value = genre_id;
  input_duration.value = duration;
  input_date.value = release_date;

  document.getElementById("input_id").value = id;
}

// delete data movies
async function delete_movie(id) {
  if (!confirm("Are you sure for delete this data ?")) {
    return alert("Cancel delete.");
  }

  try {
    await axios.delete("http://127.0.0.1:8000/api/admin/t_movies/" + id, {
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
