"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const class_entity_1 = require("./class.entity");
let ClassService = class ClassService {
    constructor(classRepository) {
        this.classRepository = classRepository;
    }
    async createClass(name, subject, teacher, classLeader) {
        const classEntity = this.classRepository.create({
            name,
            subject,
            teacher,
            classLeader,
            currentStudentsCount: 0,
        });
        return this.classRepository.save(classEntity);
    }
    async findAllClasses() {
        return this.classRepository.find({
            relations: ['teacher', 'enrollments', 'classLeader'],
        });
    }
    async findClassById(id) {
        return this.classRepository.findOne({
            where: { id },
            relations: ['teacher', 'enrollments', 'classLeader'],
        });
    }
    async updateClass(id, name, subject, classLeader) {
        const classEntity = await this.classRepository.findOne({
            where: { id },
        });
        if (!classEntity) {
            throw new Error('Class not found');
        }
        classEntity.name = name;
        classEntity.subject = subject;
        classEntity.classLeader = classLeader;
        return this.classRepository.save(classEntity);
    }
    async deleteClass(id) {
        const classEntity = await this.classRepository.findOne({
            where: { id },
            relations: ['enrollments'],
        });
        if (!classEntity) {
            throw new Error('Class not found');
        }
        if (classEntity.enrollments.length < 5) {
            await this.classRepository.delete(id);
        }
        else {
            throw new Error('Cannot delete class with 5 or more students');
        }
    }
    async searchClasses(name, teacherName, classLeaderName) {
        const query = this.classRepository.createQueryBuilder('class')
            .leftJoinAndSelect('class.teacher', 'teacher')
            .leftJoinAndSelect('class.classLeader', 'classLeader');
        if (name) {
            query.andWhere('class.name ILIKE :name', { name: `%${name}%` });
        }
        if (teacherName) {
            query.andWhere('teacher.username ILIKE :teacherName', { teacherName: `%${teacherName}%` });
        }
        if (classLeaderName) {
            query.andWhere('classLeader.username ILIKE :classLeaderName', { classLeaderName: `%${classLeaderName}%` });
        }
        return query.getMany();
    }
};
exports.ClassService = ClassService;
exports.ClassService = ClassService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ClassService);
//# sourceMappingURL=class.service.js.map