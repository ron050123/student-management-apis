import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    createUser(username: string, password: string, role: string): Promise<User>;
    findUserById(id: number): Promise<User>;
    findByUsername(username: string): Promise<User>;
    updateUser(id: number, username: string, password: string): Promise<User>;
}
