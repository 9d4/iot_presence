const prompt = require('prompt')
prompt.start();
prompt.get('Name', function (err, result) {
    console.log(result)
});
