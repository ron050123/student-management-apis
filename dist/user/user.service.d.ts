import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.enum';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    createUser(username: string, password: string, role: Role): Promise<User>;
    findUserById(id: number): Promise<User>;
    findByUsername(username: string): Promise<User>;
    updateUser(id: number, username: string, password: string): Promise<User>;
}
