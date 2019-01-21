var path, node_ssh, ssh, fs

fs = require('fs')
path = require('path')
node_ssh = require('node-ssh')
ssh = new node_ssh()

ssh.connect({
        host: '162.243.168.238',
        username: 'ugen',
        privateKey: './node_modules/ssh-key/id_rsa'
    })
    .then(function () {
        // Putting entire directories
        const failed = []
        const successful = []
        ssh.putDirectory('./dist', '/var/www/cssberries/html', {
            recursive: true,
            concurrency: 10,
            validate: function (itemPath) {
                const baseName = path.basename(itemPath)
                return baseName.substr(0, 1) !== '.' && // do not allow dot files
                    baseName !== 'node_modules' // do not allow node_modules
            },
            tick: function (localPath, remotePath, error) {
                if (error) {
                    failed.push(localPath)
                } else {
                    successful.push(localPath)
                }
            }
        }).then(function (status) {
            console.log('the directory transfer was', status ? 'successful' : 'unsuccessful')
            console.log('failed transfers', failed.join(', '))
            console.log('successful transfers', successful.join(', '))
        })
    })