import { EnrollmentService } from './enrollment.service';
import { Enrollment } from './enrollment.entity';
export declare class EnrollmentResolver {
    private enrollmentService;
    constructor(enrollmentService: EnrollmentService);
    enrollStudent(studentId: number, classId: number): Promise<Enrollment>;
    enrollmentsByStudent(studentId: number): Promise<Enrollment[]>;
    enrollmentsByClass(classId: number): Promise<Enrollment[]>;
    removeEnrollment(id: number): Promise<boolean>;
}
