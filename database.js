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
exports.deconnexion = function (){
    database.close();
    
};

function createCollection(){
   database.collection("User",function(){
      console.log('collection User created');
   });
   database.collection("Cantiques",function(){
      console.log('collection Cantiques created');
   });
   database.collection("Confirmation",function(){
      console.log('collection Confirmation created');
   });
   database.collection("Invitation",function(){
      console.log('collection Invitation created');
   });
}

exports.saveInvitation =  function(codeInvitation){
    database.collection("Invitation").insertOne({'codeInvitation':codeInvitation});
    
};

exports.findAndDeleteInvitation = function (codeInvitation,callback) {
  database.collection("Invitation").findOne({'codeInvitation':codeInvitation},
  function(error,result){
    if(error){
      console.log(error);
    }
    if(result){
      database.collection("Invitation").deleteOne(
        {'codeInvitation':codeInvitation},function (error,result) {
         if(error){
           console.log(error);
         }
         callback(true);
      });
    }else{
        callback(false);
    }
  });
};

exports.insertOneCantiques = function (Cantiques,callback){
    database.collection("Cantiques").findOne({'numero':Cantiques.numero},function(error,result){
        if(error){
            console.log(error);
        }        
        if (result){
            callback(false);            
        }else{
            database.collection("Cantiques").insertOne(Cantiques);
             callback(true);
        }
    });
  
};

exports.updateOneCantiques = function(cantiques,callback){
  try {
    database.collection('Cantiques').updateOne({"numero": cantiques.numero},
    {$set: cantiques});
    callback();
  } catch (e) {

  } finally {

  }

};

exports.getCantiques = function (callback){
  database.collection("Cantiques").find().toArray(function(error,result){
    if(error){
      console.log(error);
    }
    if(result){
      callback(result);
    }
  });
};
exports.getCantique = function (numero,callback){
  database.collection("Cantiques").findOne({'numero':numero},function(error,result){
    if(error){
      console.log(error);
    }
    if(result){
      callback(result);
    }
  });
};

exports.deleteOneCantiques = function(numero,callback){
  database.collection("Cantiques").deleteOne({'numero':numero},
  function(error,result){
    if (error){
      console.log(error);
      callback(false);
    }else{
      callback(true);
    }

  });
};

exports.insertOneUser = function(user,callback){
  database.collection('User').insert(user);
  callback();
};

exports.findUser = function(email,callback){
  database.collection("User").findOne({'email':email},
  function(error,result){
    if(error){
      console.log(error);
    }
    if(result){
        
      callback(result);
    }else{
        callback(result);
    }
  });
};

exports.UpdateUser = function(user,callback){
  database.collection("User").updateOne({'email':user.email},{$set:user},
  function(error,result){
    if(error){
      console.log(error);
      callback(false);
    }else{
      callback(true);
    }
  });
};

exports.countUser = function(callback){
    database.collection("User").find().toArray(function(error,results){
        if(error){
            console.log(error);
        }
        callback(results);
    });
};
