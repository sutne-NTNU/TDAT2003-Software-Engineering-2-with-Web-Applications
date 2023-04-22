const url_login = "/login";
const url_api_person = "/api/person/1";
const url_token = "/token";

function klikk() {
  let brukernavn = document.getElementById("Brukernavn").value;
  let passord = document.getElementById("Passord").value;
  let info = { brukernavn: brukernavn, passord: passord };
  console.log(JSON.stringify(info));
  document.getElementById("Passord").value = "";

  fetch(url_login, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(info),
  })
    .then((response) => response.json())
    .then((response_json) => login(response_json))
    .catch((error) => console.error("Error: ", error));
}

function login(response_json) {
  if (response_json.jwt != null) {
    window.localStorage.setItem("token", response_json.jwt);
    console.log(window.localStorage.getItem("token"));
  } else {
    document.getElementById("Setning").innerHTML = response_json.error;
  }

  fetch(url_api_person, {
    method: "GET",
    headers: {
      "x-access-token": window.localStorage.getItem("token"),
      "Content-Type": "application/json; charset=utf-8",
    },
  })
    .then((response) => response.json())
    .then((json) => (document.getElementById("Setning").innerHTML = json.name))
    .catch((error) => console.error("Error: ", error));
}

function refresh() {
  fetch(url_token, {
    method: "GET",
    headers: {
      "x-access-token": window.localStorage.getItem("token"),
      "Content-Type": "application/json; charset=utf-8",
    },
  })
    .then((response) => response.json())
    .then((json) => window.localStorage.setItem("token", json.jwt))
    .catch((error) => console.error("Error: ", error));

  console.log(window.localStorage.getItem("token"));
  document.getElementById("Setning").innerHTML += "\ntoken refreshed";
}
