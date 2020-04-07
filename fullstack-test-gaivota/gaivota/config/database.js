var mongoose = require('mongoose');

module.exports = function(uri) {

  process.stdin.resume();

	mongoose.set('debug', true);

	mongoose.connect(uri, { useNewUrlParser: true });
    
    mongoose.connection.on('connected', function() {
    	console.log('Mongoose! conctado em ' + uri);
    });

    mongoose.connection.on('disconnected', function() {
    	console.log('Mongoose! Desconectado em ' + uri);
    });

    mongoose.connection.on('erro', function() {
    	console.log('Mongoose! Erro na conexão: ' + erro);
    });

    process.on('SIGINT', function() {
    	mongoose.connection.close(function() {
        console.log('Mongoose! Desconectado pelo término da aplicação');
        process.exit(0)
    	});
    });

    //do something when app is closing
    process.on('exit', function() {console.log('exit'); process.exit(0)});

    //catches ctrl+c event
    //process.on('SIGINT', exitHandler.bind(null, {exit:true}));

    //catches uncaught exceptions
    process.on('uncaughtException', function() {console.log('uncaughtException'); process.exit(0)});

};