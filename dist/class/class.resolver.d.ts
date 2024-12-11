import { ClassService } from './class.service';
import { Class } from './class.entity';
import { CreateClassDto } from '../dto/create-class.dto';
export declare class ClassResolver {
    private classService;
    constructor(classService: ClassService);
    createClass(createClassDto: CreateClassDto): Promise<Class>;
    classes(): Promise<Class[]>;
    class(id: number): Promise<Class>;
    updateClass(id: number, name: string, subject: string, classLeaderId: number): Promise<Class>;
    deleteClass(id: number): Promise<boolean>;
    searchClasses(name?: string, teacherName?: string, classLeaderName?: string): Promise<Class[]>;
}
