"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const Post_1 = require("./entities/Post");
const User_1 = require("./entities/User");
const config = require('config');
exports.default = {
    migrations: {
        path: path_1.default.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Post_1.Post, User_1.User],
    dbName: 'lireddit',
    user: config.postgreSQLU,
    password: config.postgreSQLP,
    debug: process.env.NODE_ENV !== 'production',
    type: 'postgresql',
};
//# sourceMappingURL=mikro-orm.config.js.map