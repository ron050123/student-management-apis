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
const class_entity_1 = require("../class/class.entity");
let EnrollmentService = class EnrollmentService {
    constructor(enrollmentRepository, classRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.classRepository = classRepository;
    }
    async enrollStudent(student, classEntity) {
        if (isNaN(classEntity.currentStudentsCount)) {
            classEntity.currentStudentsCount = 0;
        }
        const enrollment = this.enrollmentRepository.create({ student, class: classEntity });
        classEntity.currentStudentsCount++;
        await this.classRepository.save(classEntity);
        return this.enrollmentRepository.save(enrollment);
    }
    async findEnrollmentsByStudent(student) {
        return this.enrollmentRepository.find({ where: { student }, relations: ['class'] });
    }
    async findEnrollmentsByClass(classEntity) {
        return this.enrollmentRepository.find({ where: { class: classEntity }, relations: ['student'] });
    }
    async removeEnrollment(id) {
        const enrollment = await this.enrollmentRepository.findOne({ where: { id }, relations: ['class'] });
        if (enrollment && enrollment.class) {
            if (isNaN(enrollment.class.currentStudentsCount)) {
                enrollment.class.currentStudentsCount = 0;
            }
            enrollment.class.currentStudentsCount--;
            await this.classRepository.save(enrollment.class);
            await this.enrollmentRepository.delete(id);
        }
    }
};
exports.EnrollmentService = EnrollmentService;
exports.EnrollmentService = EnrollmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(enrollment_entity_1.Enrollment)),
    __param(1, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], EnrollmentService);
//# sourceMappingURL=enrollment.service.js.map