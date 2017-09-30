let Mongo = require('mongodb');
let MongoClient = Mongo.MongoClient;
let url = 'mongodb://localhost:27017/Cantiques';
var database;

exports.connexion = function (callback) {
    MongoClient.connect(url, {
        poolSize: 10
    }, function (err, db) {
        console.log(err);
        console.log("Connected correctly to server");
        database = db;
        createCollection();
        callback();
    });

};
exports.deconnexion = function () {
    database.close();

};

function createCollection() {
    database.collection("User", function () {
        console.log('collection User created');
        database.collection("Cantiques", function () {
            console.log('collection Cantiques created');
            database.collection("Confirmation", function () {
                console.log('collection Confirmation created');
                database.collection("Invitation", function () {
                    console.log('collection Invitation created');
                });
            });
        });
    });



}

exports.saveInvitation = function (codeInvitation) {
    database.collection("Invitation").insertOne({'codeInvitation': codeInvitation});

};

exports.findAndDeleteInvitation = function (codeInvitation, callback) {
    database.collection("Invitation").findOne({'codeInvitation': codeInvitation},
            function (error, result) {
                if (error) {
                    console.log(error);
                }
                if (result) {
                    database.collection("Invitation").deleteOne(
                            {'codeInvitation': codeInvitation}, function (error, result) {
                        if (error) {
                            console.log(error);
                        }
                        callback(true);
                    });
                } else {
                    callback(false);
                }
            });
};

exports.insertOneCantiquesAnglais = function (Cantiques, callback) {
    database.collection("Cantiques_Anglais").findOne({'numero': Cantiques.numero}, function (error, result) {
        if (error) {
            console.log(error);
        }
        if (result) {
            callback(false);
        } else {
            database.collection("Cantiques_Anglais").insertOne(Cantiques);
            callback(true);
        }
    });

};
exports.insertOneCantiquesFrancais = function (Cantiques, callback) {
    database.collection("Cantiques_Francais").findOne({'numero': Cantiques.numero}, function (error, result) {
        if (error) {
            console.log(error);
        }
        if (result) {
            callback(false);
        } else {
            database.collection("Cantiques_Francais").insertOne(Cantiques);
            callback(true);
        }
    });
};
exports.insertOneCantiquesGoun = function (Cantiques, callback) {
    database.collection("Cantiques_Goun").findOne({'numero': Cantiques.numero}, function (error, result) {
        if (error) {
            console.log(error);
        }
        if (result) {
            callback(false);
        } else {
            database.collection("Cantiques_Goun").insertOne(Cantiques);
            callback(true);
        }
    });
};
exports.insertOneCantiquesYoruba = function (Cantiques, callback) {
    database.collection("Cantiques_Yoruba").findOne({'numero': Cantiques.numero}, function (error, result) {
        if (error) {
            console.log(error);
        }
        if (result) {
            callback(false);
        } else {
            database.collection("Cantiques_Yoruba").insertOne(Cantiques);
            callback(true);
        }
    });
};
exports.insertOneCantiquesEspagnol = function (Cantiques, callback) {
    database.collection("Cantiques_Espagnol").findOne({'numero': Cantiques.numero}, function (error, result) {
        if (error) {
            console.log(error);
        }
        if (result) {
            callback(false);
        } else {
            database.collection("Cantiques_Espagnol").insertOne(Cantiques);
            callback(true);
        }
    });
};
exports.insertCommandements = function (commandement, callback) {
    database.collection("Commandements").findOne({'numero': commandement.numero}, function (error, result) {
        if (error) {
            console.log(error);
        }
        if (result) {
            callback(false);
        } else {
            database.collection("Commandements").insertOne(commandement);
            callback(true);
        }
    });
};
exports.insertOnePreceptes = function (preceptes, callback) {
    database.collection("Preceptes").findOne({'numero': preceptes.numero}, function (error, result) {
        if (error) {
            console.log(error);
        }
        if (result) {
            callback(false);
        } else {
            database.collection("Preceptes").insertOne(preceptes);
            callback(true);
        }
    });
};
exports.insertOneInterdits = function (interdits, callback) {
    database.collection("Interdits").findOne({'numero': interdits.numero}, function (error, result) {
        if (error) {
            console.log(error);
        }
        if (result) {
            callback(false);
        } else {
            database.collection("Interdits").insertOne(interdits);
            callback(true);
        }
    });
};
exports.insertOneCantiques = function (Cantiques, callback) {
    database.collection("Cantiques").findOne({'numero': Cantiques.numero}, function (error, result) {
        if (error) {
            console.log(error);
        }
        if (result) {
            callback(false);
        } else {
            database.collection("Cantiques").insertOne(Cantiques);
            callback(true);
        }
    });

};

exports.updateOneCantiques = function (cantiques, callback) {
    try {
        database.collection('Cantiques').updateOne({"numero": cantiques.numero},
                {$set: cantiques});
        callback();
    } catch (e) {

    } finally {

    }

};

exports.getCantiques = function (callback) {
    database.collection("Cantiques").find().toArray(function (error, result) {
        if (error) {
            console.log(error);
        }
        if (result) {
            callback(result);
        }
    });
};
exports.getCantique = function (numero, callback) {
    database.collection("Cantiques").findOne({'numero': numero}, function (error, result) {
        if (error) {
            console.log(error);
        }
        if (result) {
            callback(result);
        }
    });
};

exports.deleteOneCantiques = function (numero, callback) {
    database.collection("Cantiques").deleteOne({'numero': numero},
            function (error, result) {
                if (error) {
                    console.log(error);
                    callback(false);
                } else {
                    callback(true);
                }

            });
};

exports.insertOneUser = function (user, callback) {
    database.collection('User').insert(user);
    callback();
};

exports.findUser = function (email, callback) {
    database.collection("User").findOne({'email': email},
            function (error, result) {
                if (error) {
                    console.log(error);
                }
                if (result) {

                    callback(result);
                } else {
                    callback(result);
                }
            });
};

exports.UpdateUser = function (user, callback) {
    database.collection("User").updateOne({'email': user.email}, {$set: user},
            function (error, result) {
                if (error) {
                    console.log(error);
                    callback(false);
                } else {
                    callback(true);
                }
            });
};

exports.countUser = function (callback) {
    database.collection("User").find().toArray(function (error, results) {
        console.log("11111");
        if (error) {
            console.log(error);
        }
        callback(results);
    });
};
exports.deleteInvitation = function(callback){
    database.collection("Invitation").removeMany();
    callback();
};
