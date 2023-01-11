const fs = require('fs');
const express = require('express');
const parser = require('body-parser');
const app = express();

app.use(express.static(__dirname));
app.use(express.static('public'));


app.use(parser.json());
app.use(parser.text());

app.get('/student', (req, res) => {
    const Student = req.body;
    //console.log(Student);
    //console.log(`Novi student se zove: ${Student.naziv} a broj indeksa je ${Student.index}`);
    res.status(200).send({ status: `Novi student se zove: ${Student.naziv} a broj indeksa je ${Student.index}` });
});

app.post('/student', (req, res) => {
    const Student = req.body;

    if (Student.naziv.includes(" ") == false) {
        res.status(400).send({ status: "Greška: naziv nije ispravan" })
    }
    else {
        fs.readFile('zapisi/studenti.csv', (error, data) => {

            if (data.includes(Student.index)) {
                res.status(400).send({ status: "Greška: student sa tim indexom vec postoji!" });
            }
            else {
                fs.appendFile('zapisi/studenti.csv', Student.naziv + "," + Student.index + "\n", (error, data) => {
                    res.status(200).send({ status: "Student uspješno dodan!" });
                });
            }

        })
    }
});


app.get('/studentSaIndexom', (req, res) => {
    const Parametri = req.query;
    var ImeTrazenogStudenta;
    //console.log(Parametri);
    fs.readFile('zapisi/studenti.csv', (err, data) => {
        //console.log(data.toString());
        var nizRedova = data.toString().split("\n");
        for (var i = 0; i < nizRedova.length; i++) {
            if (Parametri.index == nizRedova[i].split(",")[1]) {
                ImeTrazenogStudenta = nizRedova[i].split(",")[0];
                break;
            }
        }
        res.status(200).send({ status: `student sa indexom: ${Parametri.index} se zove ${ImeTrazenogStudenta}` });
    });

});







app.listen(8080);
console.log("PORT: 8080");