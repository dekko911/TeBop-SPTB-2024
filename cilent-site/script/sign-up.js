let user_form = document.querySelector("#user-form");

if (user_form) {
	const url = "http://127.0.0.1:8000/api/sign_up";

	user_form.addEventListener("submit", async (e) => {
		e.preventDefault();

		try {
			const formData = new FormData(user_form);

			const res = await axios.post(url, formData);

			alert(res.data.message);

			window.location.href = "login.html";
		} catch (error) {
			//console.error(error);

			let emailError = error.response?.data?.message;

			alert(emailError);
		}
	});
}
