let express = require('express');
let multer = require('multer'); // v1.0.5
let bodyParser = require('body-parser');
let database = require('./database');
let passwordHash = require("password-hash");
var randomstring = require("randomstring");
let cookie_parser = require('cookie-parser');
let session = require("express-session");
let upload = multer(); // for parsing multipart/form-data
let random = require("random-number-generator");
let nodemailer = require('nodemailer');
let MongoStore = require('connect-mongodb-session')(session);
let useremail = "adjahojulios3@gmail.com";
let app = express();
var store = new MongoStore({
    uri: 'mongodb://localhost:27017/Cantiques',
    collection: 'Sessions'
});
app.use(express.static(__dirname + '/public'));
app.set('port', (process.env.PORT || 8080));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
//app.use(expressValidator);
app.use(cookie_parser());

app.use(session({
    path: '/connect',
    secret: "nrkhfkjherwb4vghhg31p4235i6po452v2cn12",
    store: store,
    resave: false,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');
database.connexion(function () {
    app.get("/", function (req, res) {
        database.getCantiques(function (cantiques) {
            if (cantiques.length === 0) {
                res.render("index");
            } else {
                res.render("index", {cantiques: cantiques});
            }

        });
    });
    app.all('/inscription/:code', upload.array(), function (req, res) {
        if (req.method === "GET") {
            var code = req.params.code;
            console.log("code :" + code);
            database.findAndDeleteInvitation(code, function (results) {
                if (results) {
                    res.render("formulaireUser");
                } else {
                    res.status(403).send("vous n'êtes pas authoriser à créer un compte");
                }
            });

        }
        if (req.method === "POST") {
            var salt = randomstring.generate();
            var password = req.body.password;
            var passwordtemp = passwordHash.generate(password + salt);
            var user =
                    {
                        email: req.body.email,
                        passwordHash: passwordtemp,
                        salt: salt
                    };
            database.insertOneUser(user, function () {
                database.getCantiques(function (cantiques) {
                    res.render("admin", {cantiques: cantiques});
                });
            });
        }
    });
    app.get("/admin", function (req, res) {
        store.get(req.sessionID, function (error, results) {
            if (results === null || results === undefined) {
                res.render("connexion", {error: "vous devez vous inscrire :("});
            } else {
                database.getCantiques(function (cantiques) {
                    res.render("admin", {cantiques: cantiques});
                });
            }
        });

    });
    app.get("/deconnexion", function (req, res) {
        store.get(req.sessionID, function (error, results) {
            if (results === null || results === undefined) {
                res.status(404).send("vous n'êtes pas autorisés");
            } else {
                store.destroy(req.sessionID, function () {
                    req.session.destroy(function (err) {
                        // cannot access session here
                        res.send("bye bye !!!");
                    });
                });

            }
        });
    });
    app.all('/connect', upload.array(), function (req, res) {
        if (req.method === "GET") {
            res.render('connexion');
        } else if (req.method === "POST") {

            var email = req.body.email;
            var password = req.body.password;
            console.log("p :" + password);

            database.findUser(email, function (results) {

                if (results) {
                    res.redirect('/admin');
                    if (passwordHash.verify(password + results.salt, results.passwordHash)) {

                        res.redirect('/admin');
                    } else {
                        res.render("connexion",
                                {error: " password  is not  correct"});
                    }
                } else {
                    store.get(req.sessionID, function (error, results) {
                        if (error) {
                            console.log(error);
                        }
                        res.render("connexion", {error: " email is not correct"});
                    });

                }
            });
        }

    });

    app.all('/cantique', upload.array(), function (req, res) {
        store.get(req.sessionID, function (error, result) {
            if (result === null || result === undefined) {
                res.render("connexion", {error: "vous devez vous inscrire :("});
            } else {
                if (req.method === "GET") {
                    res.render('refrain');
                } else if (req.method === "POST") {
                    console.log(req.body);
                    database.insertOneCantiques(req.body, function (reponse) {
                        if (reponse) {
                            res.json("ok");
                        } else {
                            res.status(404).send("numero cantique existe deja");
                        }
                    });
                } else if (req.method === "DELETE") {
                    database.deleteOneCantiques(req.body.numero, function () {
                        database.getCantiques(function (cantiques) {
                            res.render("admin",
                                    {success: "cantique " + req.body.numero + "a été bien supprime",
                                        cantiques: cantiques});
                        });
                    });
                }
            }
        });

    });
    app.get('/refrain', upload.array(), function (req, res) {
        store.get(req.sessionID, function (error, results) {
            if (results === null || results === undefined) {
                res.redirect("/connect", {error: "vous devez vous inscrire :("});
            } else {
                var refrain = req.query.refrain;
                var nombre = req.query.nombre;
                console.log("refrain " + refrain + "*** nombre" + nombre);
                res.render("cantique", {refrain: refrain, nombre: nombre});
            }
        });
    });
    app.all("/modificationCantiques/:numero", upload.array(),function (req, res) {
        store.get(req.sessionID, function (error, results) {
            var numero = req.params.numero;
            if (req.method === "GET") {
                database.getCantique(numero, function (results) {
                    if (results) {
                        req.render("modifier", {cantique: results});
                    } else {
                        database.getCantiques(function(results){
                            if(results){
                                req.render("admin", {error: "cantique " + numero + " inexistant",cantiques:results});
                            }else{
                                req.render("admin", {error: "cantique " + numero + " inexistant"});
                            }
                        });
                        
                    }
                });
            } else if (req.method === "POST") {
                database.updateOneCantiques(req.body, function (results) {
                    res.json("ok");
                });
            } else {
                 res.status(401).send("error");
            }

        });
    });
    app.get('/api/cantiques', function (req, res) {
        database.getCantiques(function (documents) {
            res.json(documents);
        });
    });
    app.get("/demande/modification",function(req,res){
        
    });
    app.get('/api/cantique/:numero', function (req, res) {
        var numero = req.params.numero;
        database.getCantique(numero, function (document) {
            res.json(document);
        });
    });
    app.on('listenning', function () {
        console.log("marche");
    });
    app.listen(app.get('port'), function () {
        console.log("Cantique online " + app.get('port'));
        database.countUser(function (document) {
           
            if (document !== null && (document.length === 0)) {
                
                var code = randomstring.generate();
                sendMail(useremail, "http://159.203.22.37:8080/inscription/" + code,
                        "creation de compte pour cantiques");
                database.saveInvitation(code);
            }
        });
    });
});
function sendMail(destinataire, message, subject) {
    let sender = "confirmationinscriptionrestapp@gmail.com";
    let password = 'restapp2017';
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: sender,
            pass: password
        }
    });

    var mailOptions = {
        from: '"Cantique" <confirmationinscriptionrestapp@gmail.com',
        to: destinataire,
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}

