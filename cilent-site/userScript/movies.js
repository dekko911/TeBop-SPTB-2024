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

current_user.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="14" width="12.25" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @font awesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/></svg> ${hasAbilities}`;

async function getData() {
  let search = document.getElementById("search").value;

  let urlParam = search ? `?search=${search}` : "";

  const res = await axios.get(
    "http://127.0.0.1:8000/api/user/t_movies" + urlParam,
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
                    <td class="align-middle text-sm">${movie.duration_iso}</td>
                    <td class="align-middle text-sm">${
                      movie.release_date_iso
                    }</td>
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
