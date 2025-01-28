// another method update data

// try {
//   const url = "http://127.0.0.1:8000/api/users${id ? '/' + id : ''}";
//   const method = id ? "patch" : "post";
//   await axios[method](url, { name, email, password });

//   alert("Data has been stored!");
//   user_form.reset();
//   getData();
// } catch (error) {
//   const errors = error.response?.data?.errors || {};
//   name_error.innerHTML = errors.name || "";
//   email_error.innerHTML = errors.email || "";
//   password_error.innerHTML = errors.password || "";
// }
