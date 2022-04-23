let url = 'http://bigdata.stud.iie.ntnu.no/sentiment/webresources/sentiment/log?api-key=Happy!!!';
let input;

function klikk() {
    input = document.getElementById("Tekst_boks").value;
    document.getElementById("Tekst_boks").value = "";
    document.getElementById("Setning").innerHTML = input;

    fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json; charset=utf-8"},
        body: JSON.stringify(input)
    })
        .then(response => response.json())
        .then(json => feedback(json))
        .catch(error => {
            // api is no longer available
            console.error("Error: ", error)
            feedback({value: input.length % 5});
        });
}

function feedback(json) {
    let number = json.value;
    console.log(number);
    let background = "gray";
    let text_color = "white";
    switch (number) {
        case 0:
            background = "black";
            text_color = "white";
            break;
        case 1:
            background = "red";
            text_color = "white";
            break;
        case 2:
            background = "orange";
            text_color = "black";
            break;
        case 3:
            background = "yellow";
            text_color = "black";
            break;
        case 4:
            background = "green";
            text_color = "black";
            break;
    }
    document.body.style.background = background;
    document.getElementById("Setning").style.color = text_color;
    document.getElementById("Tekst_boks").value = "";
    document.getElementById("Setning").innerHTML = input;
}