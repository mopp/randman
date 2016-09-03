'use strict';

module.exports = (...args) => {
    const [Router] = args;
    const Fs = require('fs');

    function get_random_files(target_dir, count, callback) {
        Fs.readdir(target_dir, (err, files) => {
            if (err) {
                callback(err, null)
                return;
            }

            files            = files.filter(file => Fs.statSync(target_dir + '/' + file).isFile());
            let random_files = Array.from(Array(count).keys()).map(() => files[Math.floor(Math.random() * files.length)]);

            callback(null, random_files);
        });
    }

    Router.param('directory_name', (req, res, next, directory_name) => {
        req.directory_name = directory_name;
        req.target_dir     = req.app.get('base_path') + directory_name;
        next();
    });

    Router.route('/:directory_name')
        .get((req, res) => {
            const directory_name = req.directory_name;
            const target_dir     = req.target_dir;
            const count          = Number(req.query.count) || 1;
            get_random_files(target_dir, count,
                (err, files) => {
                    res.json(files.map((file) => directory_name + '/' + file))
                }
            );
        })
        .post((req, res) => {
            // TODO
        });


    return Router;
}
