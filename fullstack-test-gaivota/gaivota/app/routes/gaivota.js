var jwt = require("jsonwebtoken");
var mongo = require('mongodb');

module.exports = function(app) {

	var Users = app.models.users;
	var controller = app.controllers.gaivota;

	app.get('/fazendas', verificaAutenticacao, controller.getFazendas);
	app.post('/fazendas', verificaAutenticacao, controller.postFazendas);

	app.get('/fazenda/:id?', verificaAutenticacao, controller.getFazenda);
	app.post('/fazenda/:id?', verificaAutenticacao, controller.postFazenda);

	app.get('/buy', verificaAutenticacao, controller.getBuy);
	app.post('/buy', verificaAutenticacao, controller.postBuy);

	app.get('/buy/:id?', verificaAutenticacao, controller.getBuy); 
	app.post('/buy/:id?', verificaAutenticacao, controller.postBuy); 

	app.get('/challenge/encode/:number?', controller.encode);//verificaAutenticacao
	app.get('/challenge/decode/:code?', controller.decode);//verificaAutenticacao

	app.post("/login", async (req, res) => {
	  const { email, password } = req.body;
	  Users.findOne({'email': email}, function (err, user) {
            if(user){
              if(user.senha != password) { return err; }
              if(user.senha == password){
	            const token = jwt.sign(user, app.JWT_PW);
	            res.status(200).send({ userData: user, token });
              }
            } else {
               return err;
            }
            if (err) { console.log('not'); return err; }
      }).lean();
    });
    
    app.get("/auth", (req, res) => {
    	let token = req.header("Authorization");
    	token = token.split(" ")[1];
    	const ok = jwt.verify(token, app.JWT_PW);
    	res.status(200).send(ok);
    });


	// Algoritimos de refatoração de dados

	app.get('/refactor', controller.refactorDate);
	app.get('/refactorgeo', controller.refactorGeo);


	function verificaAutenticacao(req, res, next){
		let token = req.header("Authorization");
        if(token != undefined){
        	token = token.split(" ")[1];
            var ok = jwt.verify(token, 'ganiwjowko');
        } else {
        	var ok = false
        }
	    if (ok){
	    	
	    	return next();
	    };
	    if (!req.isAuthenticated()){
	    	console.log('not' + req.connection.remoteAddress)
	    	res.status(404);
	    	res.json(['acesso negado']);
	    }
    };
	
}