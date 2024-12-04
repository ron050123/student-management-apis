import { Enrollment } from '../enrollment/enrollment.entity';
export declare class User {
    id: number;
    username: string;
    password: string;
    role: string;
    enrollments: Enrollment[];
}
