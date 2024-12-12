import { EnrollmentService } from './enrollment.service';
import { Enrollment } from './enrollment.entity';
import { User } from '../user/user.entity';
export declare class EnrollmentResolver {
    private enrollmentService;
    constructor(enrollmentService: EnrollmentService);
    enrollStudent(studentId: number, classId: number, user: User): Promise<Enrollment>;
    enrollmentsByStudent(studentId: number): Promise<Enrollment[]>;
    enrollmentsByClass(classId: number): Promise<Enrollment[]>;
    removeEnrollment(id: number): Promise<boolean>;
}
