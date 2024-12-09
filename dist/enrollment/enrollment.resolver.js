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
exports.EnrollmentResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const enrollment_service_1 = require("./enrollment.service");
const enrollment_entity_1 = require("./enrollment.entity");
const user_entity_1 = require("../user/user.entity");
const class_entity_1 = require("../class/class.entity");
const role_enum_1 = require("../user/role.enum");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const gql_auth_guard_1 = require("../auth/gql-auth.guard");
let EnrollmentResolver = class EnrollmentResolver {
    constructor(enrollmentService) {
        this.enrollmentService = enrollmentService;
    }
    async enrollStudent(studentId, classId) {
        const student = new user_entity_1.User();
        student.id = studentId;
        const classEntity = new class_entity_1.Class();
        classEntity.id = classId;
        return this.enrollmentService.enrollStudent(student, classEntity);
    }
    async enrollmentsByStudent(studentId) {
        const student = new user_entity_1.User();
        student.id = studentId;
        return this.enrollmentService.findEnrollmentsByStudent(student);
    }
    async enrollmentsByClass(classId) {
        const classEntity = new class_entity_1.Class();
        classEntity.id = classId;
        return this.enrollmentService.findEnrollmentsByClass(classEntity);
    }
    async removeEnrollment(id) {
        await this.enrollmentService.removeEnrollment(id);
        return true;
    }
};
exports.EnrollmentResolver = EnrollmentResolver;
__decorate([
    (0, graphql_1.Mutation)(() => enrollment_entity_1.Enrollment),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.TEACHER, role_enum_1.Role.STUDENT),
    __param(0, (0, graphql_1.Args)('studentId')),
    __param(1, (0, graphql_1.Args)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], EnrollmentResolver.prototype, "enrollStudent", null);
__decorate([
    (0, graphql_1.Query)(() => [enrollment_entity_1.Enrollment]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.TEACHER, role_enum_1.Role.STUDENT),
    __param(0, (0, graphql_1.Args)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EnrollmentResolver.prototype, "enrollmentsByStudent", null);
__decorate([
    (0, graphql_1.Query)(() => [enrollment_entity_1.Enrollment]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.TEACHER, role_enum_1.Role.STUDENT),
    __param(0, (0, graphql_1.Args)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EnrollmentResolver.prototype, "enrollmentsByClass", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.TEACHER, role_enum_1.Role.STUDENT),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EnrollmentResolver.prototype, "removeEnrollment", null);
exports.EnrollmentResolver = EnrollmentResolver = __decorate([
    (0, graphql_1.Resolver)(() => enrollment_entity_1.Enrollment),
    __metadata("design:paramtypes", [enrollment_service_1.EnrollmentService])
], EnrollmentResolver);
//# sourceMappingURL=enrollment.resolver.js.map