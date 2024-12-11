import { User } from '../user/user.entity';
import { Enrollment } from '../enrollment/enrollment.entity';
export declare class Class {
    id: number;
    name: string;
    subject: string;
    teacher: User;
    classLeader: User;
    currentStudentsCount: number;
    enrollments: Enrollment[];
}
