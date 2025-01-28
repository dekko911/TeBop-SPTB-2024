let hasToken = Cookies.get("auth_token");
let hasAbilities = Cookies.get("abilities");

if (hasToken) {
  console.log("Has Token : " + hasToken);
}

if (hasAbilities) {
  console.log("Has Abilities : " + hasAbilities);
}

let formLogin = document.getElementById("formLogin");

if (formLogin) {
  formLogin.addEventListener("submit", async function (e) {
    e.preventDefault();
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;

    try {
      let url = "http://127.0.0.1:8000/api/login";
      const res = await axios.post(url, { email, password });
      // console.log(res.data);

      if (res.data) {
        if (res.data.status && res.data.status == "success") {
          let plainTextToken = res.data.token.plainTextToken;

          let token = plainTextToken.split("|")[1];

          let abilities = res.data.token.accessToken.abilities;

          Cookies.set("auth_token", token);
          Cookies.set("abilities", abilities);
          // console.log(abilities);

          if (abilities == "admin") {
            window.location.href = "/admin/dashboard.html";
          } else {
            window.location.href = "/user/dashboard.html";
          }

          alert("Success Login !");
        }

        if (res.data.status && res.data.status == "fail") {
          alert("Your credentials is not match of our record!");
        }

        if (res.data.status && res.data.status == "error") {
          alert("You do not have any roles assigned!");
        }
      }
    } catch (error) {
      console.error(error);
    }
  });
}
