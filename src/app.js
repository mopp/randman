'use strict';

const Config  = require('./config');

// Express settings.
const Express    = require('express');
const Morgan     = require('morgan');
const BodyParser = require('body-parser');
const App        = Express();

const Path = require("path");

App.use(Morgan('dev', { immediate: true }));
App.use(BodyParser.json());
App.use(BodyParser.urlencoded({ extended: true }));
App.set('base_path', Config.base_path);

const V1 = require('./api/v1.js');

App.use(Express.static(Config.base_path))
App.use('/v1', V1(Express.Router()));
App.listen(Config.port);
