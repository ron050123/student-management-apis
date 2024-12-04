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
exports.EnrollmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const enrollment_entity_1 = require("./enrollment.entity");
let EnrollmentService = class EnrollmentService {
    constructor(enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }
    async enrollStudent(student, classEntity) {
        const enrollment = this.enrollmentRepository.create({ student, class: classEntity });
        return this.enrollmentRepository.save(enrollment);
    }
    async findEnrollmentsByStudent(student) {
        return this.enrollmentRepository.find({ where: { student }, relations: ['class'] });
    }
    async findEnrollmentsByClass(classEntity) {
        return this.enrollmentRepository.find({ where: { class: classEntity }, relations: ['student'] });
    }
    async removeEnrollment(id) {
        await this.enrollmentRepository.delete(id);
    }
    async searchEnrollmentsByStudent(studentId, className, teacherName) {
        const query = this.enrollmentRepository.createQueryBuilder('enrollment')
            .leftJoinAndSelect('enrollment.class', 'class')
            .leftJoinAndSelect('class.teacher', 'teacher')
            .where('enrollment.studentId = :studentId', { studentId });
        if (className) {
            query.andWhere('class.name ILIKE :className', { className: `%${className}%` });
        }
        if (teacherName) {
            query.andWhere('teacher.username ILIKE :teacherName', { teacherName: `%${teacherName}%` });
        }
        return query.getMany();
    }
};
exports.EnrollmentService = EnrollmentService;
exports.EnrollmentService = EnrollmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(enrollment_entity_1.Enrollment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EnrollmentService);
//# sourceMappingURL=enrollment.service.js.map