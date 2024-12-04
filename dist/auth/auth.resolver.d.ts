import { AuthService } from './auth.service';
export declare class AuthResolver {
    private authService;
    constructor(authService: AuthService);
    checkAuth(): string;
    login(username: string, password: string): Promise<string>;
    register(username: string, password: string, role: string): Promise<boolean>;
}
