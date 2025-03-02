let user_form = document.querySelector("#user-form");

if (user_form) {
  const url = "http://127.0.0.1:8000/api/sign_up";

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

      const res = await axios.post(url, data);

      alert(res.data.message);
      window.location.href = "login.html";
    } catch (error) {
      console.error(error);

      // let emailError = error.response?.data?.message;

      // alert(emailError);
    }
  });
}
