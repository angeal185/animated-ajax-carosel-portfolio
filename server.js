const static = require('node-static'),
chalk = require('chalk'),
config  = require('./config'),
fileServer = new static.Server(config.serve, { cache: config.cache });

console.log(chalk.magentaBright("Starting: ") + chalk.cyanBright(config.name));
require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response, function (err, result) {
            if (err) {
                console.log(chalk.redBright("Error serving " + request.url + " - " + err.message));

                response.writeHead(err.status, err.headers);
                response.end();
            } else {
              if (config.debug) {
              console.log(chalk.magentaBright(request.method) + ' ' +
                          chalk.greenBright(request.url) + ' ' +
                          chalk.blueBright(result.message)
                        );
                      }
            }
        });
    }).resume();
}).listen(config.port);
console.log(chalk.greenBright("Server listening on port: ") + chalk.cyanBright(config.port));
console.log(chalk.greenBright("Working DIR: ") + chalk.cyanBright(process.cwd()));
