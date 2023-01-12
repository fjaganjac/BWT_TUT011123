const fs = require('fs');
const express = require('express');
const parser = require('body-parser');
const url = require('url');
const querystring = require('querystring');
const app = express();

app.use(express.static(__dirname));
app.use(express.static('public'));


app.use(parser.json());
app.use(parser.text());

app.get('/student', (req, res) => {
    const Student = req.body;
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
    fs.readFile('zapisi/studenti.csv', (err, data) => {
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
//OVO JE TVOJA RUTA//
//     |
//     |
//    \ /
//     ˇ
app.get("/prisustvo", (req, res) => {               
    let parsedUrl = url.parse(req.url)
    let parsedQuery = querystring.parse(parsedUrl.query);
    const code = parsedQuery.kodPredmeta;
    const index = parsedQuery.indexStudenta;
    const week = parsedQuery.sedmica;
    if(!(code && index && week)) {
        res.writeHead("500", {'content-type': 'application/json'});
        res.end(JSON.stringify({status: "Neispravni parametri za prisustvo!"}))
        return 
    }
    fs.readFile("csv/prisustva.csv", 'utf-8', (error, data) => {
        const rows = data.split('\n');
        const help = [];
        for(let i=0; i<rows.length; i++){
            const values = rows[i].split(',');
            if(values[2] == week && values[3] == code && values[4] == index) {
                help.push(rows[i]);
            }
        }
        if(help.length!==0) {
            const result = {
                "prisustvoZaSedmicu": week,
                "prisutan": 0,
                "odsutan": 0,
                "nijeUneseno": 0
            }
            for(let i=0; i<help.length; i++){
                const values = help[i].split(',');
                result[values[5]]++;
            }
            res.writeHead("200", {'content-type': 'application/json'});
            res.end(JSON.stringify(result))
            return
            
        }
        else {
            res.writeHead("404", {'content-type': 'application/json'});
            res.end(JSON.stringify({status: "Prisustvo ne postoji!"}))
            return
        }
    });
});
//     ^
//    / \
//     |
//     |  







app.listen(8080);
console.log("PORT: 8080");