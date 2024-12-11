import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../user/role.enum';
import { User } from '../user/user.entity';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    validateUser(username: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
    register(username: string, password: string, role: Role): Promise<User>;
    updateUser(id: number, username: string, password: string): Promise<User>;
}
