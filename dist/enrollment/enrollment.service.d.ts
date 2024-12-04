import { Repository } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { User } from '../user/user.entity';
import { Class } from '../class/class.entity';
export declare class EnrollmentService {
    private enrollmentRepository;
    constructor(enrollmentRepository: Repository<Enrollment>);
    enrollStudent(student: User, classEntity: Class): Promise<Enrollment>;
    findEnrollmentsByStudent(student: User): Promise<Enrollment[]>;
    findEnrollmentsByClass(classEntity: Class): Promise<Enrollment[]>;
    removeEnrollment(id: number): Promise<void>;
    searchEnrollmentsByStudent(studentId: number, className: string, teacherName: string): Promise<Enrollment[]>;
}
