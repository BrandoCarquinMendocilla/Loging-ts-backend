"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const username = yield User_1.default.findOne({ username: req.body.username });
            if (!username) {
                if (req.body.username && req.body.password && req.body.fullname) {
                    if (req.body.username != "" && req.body.password != "" && req.body.fullname != "") {
                        console.log(req.body);
                        const SALT_ROUND = 12;
                        bcrypt_1.default.hash(req.body.password, SALT_ROUND).then((hashedPassword) => __awaiter(this, void 0, void 0, function* () {
                            const usuario = {
                                username: req.body.username,
                                password: hashedPassword,
                                fullname: req.body.fullname
                            };
                            console.log(hashedPassword);
                            const newUser = new User_1.default(usuario);
                            yield newUser.save();
                            res.json({ data: usuario });
                        }));
                    }
                    else {
                        res.json({ response: 'Ingrese datos' });
                    }
                }
                else {
                    res.json({ response: 'Ingrese datos' });
                }
            }
            else {
                res.json({ response: 'El usuario ya existe' });
            }
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.find();
            res.json(user);
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ user: req.params.user });
            res.json(user);
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req.params;
            const users = yield User_1.default.findOneAndUpdate({ user }, req.body, { new: true });
            res.json(users);
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { users } = req.params;
            yield User_1.default.findOneAndDelete({ users });
            res.json({ response: 'Eliminacion Ejecutada' });
        });
    }
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const username = yield User_1.default.findOne({ username: req.body.username });
            console.log(username);
            if (username != null) {
                if (bcrypt_1.default.compareSync(req.body.password, username.password)) {
                    res.json({ response: 'Bienvenido Usuario: ' + username.fullname });
                }
                else {
                    res.json({ response: 'Contraseña incorrecta' });
                }
            }
            else {
                res.json({ response: 'Usuario no encontrado' });
            }
        });
    }
    routes() {
        this.router.get('/', this.getUsers);
        this.router.get('/:username', this.getUser);
        this.router.post('/', this.createUser);
        this.router.post('/login', this.loginUser);
        this.router.put('/:username', this.updateUser);
        this.router.delete('/:username', this.deleteUser);
    }
}
const userRoutes = new UserRoutes();
exports.default = userRoutes.router;
