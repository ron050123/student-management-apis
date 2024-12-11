import { Repository } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { User } from '../user/user.entity';
import { Class } from '../class/class.entity';
export declare class EnrollmentService {
    private enrollmentRepository;
    private classRepository;
    constructor(enrollmentRepository: Repository<Enrollment>, classRepository: Repository<Class>);
    enrollStudent(student: User, classEntity: Class): Promise<Enrollment>;
    findEnrollmentsByStudent(student: User): Promise<Enrollment[]>;
    findEnrollmentsByClass(classEntity: Class): Promise<Enrollment[]>;
    removeEnrollment(id: number): Promise<void>;
}
