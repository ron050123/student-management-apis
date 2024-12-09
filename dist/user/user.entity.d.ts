import { Enrollment } from '../enrollment/enrollment.entity';
import { Role } from './role.enum';
export declare class User {
    id: number;
    username: string;
    password: string;
    role: Role;
    enrollments: Enrollment[];
}
