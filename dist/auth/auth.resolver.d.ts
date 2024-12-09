import { AuthService } from './auth.service';
import { Role } from '../user/role.enum';
export declare class AuthResolver {
    private authService;
    constructor(authService: AuthService);
    checkAuth(): string;
    login(username: string, password: string): Promise<string>;
    register(username: string, password: string, role: Role): Promise<boolean>;
}
