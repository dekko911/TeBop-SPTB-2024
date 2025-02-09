let user_form = document.querySelector("#user-form");

if (user_form) {
  const res = "http://127.0.0.1:8000/api/sign_up";

  user_form.addEventListener("submit", async function (e) {
    e.preventDefault();

    let name = document.querySelector("#name").value;
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;

    try {
      const data = {
        name,
        email,
        password,
      };

      await axios.post(res, data);

      alert("data has added !");
      window.location.href = "login.html";
    } catch (error) {
      let emailError = error.response?.data?.message;

      alert(emailError);
    }
  });
}
