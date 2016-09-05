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

        try {
            Fs.accessSync(req.target_dir, Fs.F_OK);
        } catch (e) {
            req.target_dir = null;
        }

        next();
    });

    Router.route('/:directory_name')
        .get((req, res) => {
            const directory_name = req.directory_name;
            const target_dir     = req.target_dir;
            const count          = Number(req.query.count) || 1;

            if (target_dir == null) {
                return res.status(404).json({});
            }

            get_random_files(target_dir, count,
                (err, files) => {
                    res.json(files.map((file) => file))
                }
            );
        })
        .post((req, res) => {
            // TODO
        });


    return Router;
}
