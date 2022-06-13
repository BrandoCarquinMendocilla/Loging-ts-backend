import { Request, Response, Router } from "express";
import User from '../models/User'
import bcrypt from 'bcrypt';

class UserRoutes {
    public router: Router;
    constructor() {
        this.router = Router();
        this.routes();
    }
    public async createUser(req: Request, res: Response): Promise<void> {

        const username = await User.findOne({ username: req.body.username });
        if (!username) {
            if (req.body.username && req.body.password && req.body.fullname) {
                if (req.body.username != "" && req.body.password != "" && req.body.fullname != "") {
                    console.log(req.body);
                    const SALT_ROUND = 12;
                    bcrypt.hash(req.body.password, SALT_ROUND).then(async (hashedPassword) => {
                        const usuario = {
                            username: req.body.username,
                            password: hashedPassword,
                            fullname: req.body.fullname
                        }
                        console.log(hashedPassword);
                        const newUser = new User(usuario);
                        await newUser.save();
                        res.json({ data: usuario });
                    });
                } else {
                    res.json({ response: 'Ingrese datos' });
                }
            } else {
                res.json({ response: 'Ingrese datos' });
            }
        } else {
            res.json({ response: 'El usuario ya existe' });
        }
    }
    public async getUsers(req: Request, res: Response): Promise<void> {
        const user = await User.find();
        res.json(user);
    }
    public async getUser(req: Request, res: Response): Promise<void> {
        const user = await User.findOne({ username: req.params.username });
        res.json(user);
    }
    public async updateUser(req: Request, res: Response): Promise<void> {
        const { user } = req.params;
        const users = await User.findOneAndUpdate({ user }, req.body, { new: true });
        res.json(users);
    }
    public async deleteUser(req: Request, res: Response): Promise<void> {
        const { users } = req.params;
        await User.findOneAndDelete({ users });
        res.json({ response: 'Eliminacion Ejecutada' });
    }

    public async loginUser(req: Request, res: Response) {
        const username = await User.findOne({ username: req.body.username });
        console.log(username);
        if (username != null) {
            if (bcrypt.compareSync(req.body.password, (username as any).password)) {
                res.json({ response: 'Bienvenido Usuario: ' + (username as any).fullname })
            } else {
                res.json({ response: 'Contraseña incorrecta' });
            }
        } else {
            res.json({ response: 'Usuario no encontrado' });
        }
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
export default userRoutes.router;