import { UserService } from '../user/user.service';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private userService;
    constructor(userService: UserService);
    validate(payload: any): Promise<{
        role: any;
        id: number;
        username: string;
        password: string;
        enrollments: import("../enrollment/enrollment.entity").Enrollment[];
    }>;
}
export {};
