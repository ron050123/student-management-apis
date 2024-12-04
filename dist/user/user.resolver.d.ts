import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
export declare class UserResolver {
    private userService;
    constructor(userService: UserService);
    createUser(createUserDto: CreateUserDto): Promise<User>;
    user(id: number): Promise<User>;
    updateUser(id: number, username: string, password: string): Promise<User>;
}
