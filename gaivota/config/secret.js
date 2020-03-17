var schedule = require('node-schedule');
 

module.exports = function() {
    var secret = ''

    var makeid = function (length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    secret = makeid(5)

    var hashPass = schedule.scheduleJob('0 0 * * *', function(){
      secret = makeid(5)
    });

    return secret;
};