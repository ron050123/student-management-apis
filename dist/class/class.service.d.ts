import { Repository } from 'typeorm';
import { Class } from './class.entity';
import { User } from '../user/user.entity';
export declare class ClassService {
    private classRepository;
    constructor(classRepository: Repository<Class>);
    createClass(name: string, subject: string, teacher: User, classLeader: User): Promise<Class>;
    findAllClasses(): Promise<Class[]>;
    findClassById(id: number): Promise<Class>;
    updateClass(id: number, name: string, subject: string, classLeader: User): Promise<Class>;
    deleteClass(id: number): Promise<void>;
    searchClasses(name?: string, teacherName?: string, classLeaderName?: string): Promise<Class[]>;
}
