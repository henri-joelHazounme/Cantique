document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("submit").addEventListener("click", function () {
        var data = getData();        
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {

                    var html = '<div class="alert alert-success">';
                    html += ' <strong>Success!</strong> le  cantique ' + document.getElementById("numero").value + ' a été bien ajouté Merci';
                    html += '</div>';
                    document.getElementById("formulaire").style.visibility = "hidden";
                    document.getElementById("success").innerHTML = html;

                } else {
                    var html = '<div class="alert alert-danger">';
                    html += ' <strong>Error!</strong> le  cantique ' + document.getElementById("numero").value + " n'a pas été ajouté car ";
                    html += ' numero cantique existe déjà dans la base de données</div>';
                    document.getElementById("error").innerHTML = html;
                }
            }
        };
        xhttp.open("POST", "http://localhost:80/cantique", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(data);
    });
});


function getData() {
    var couplet = [];
    var data;
    var refrain = document.getElementById('refrain');
    var nombre = document.getElementById("nombre").value;
    for (var i = 1; i <= nombre; i++) {
        couplet[i] = document.getElementById("" + i).value;
    }
    if (refrain) {
        data = JSON.stringify({
            numero: document.getElementById("numero").value,
            couplet: couplet,
            nombre: nombre,
            refrain: refrain.value
        });
    } else {
        data = JSON.stringify({
            numero: document.getElementById("numero").value,
            nombre: nombre,
            couplet: couplet
        });
    }

    return data;
}


