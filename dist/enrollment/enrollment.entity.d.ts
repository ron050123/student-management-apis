import { User } from '../user/user.entity';
import { Class } from '../class/class.entity';
export declare class Enrollment {
    id: number;
    student: User;
    class: Class;
}
