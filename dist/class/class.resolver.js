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
exports.ClassResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const class_service_1 = require("./class.service");
const class_entity_1 = require("./class.entity");
const user_entity_1 = require("../user/user.entity");
const create_class_dto_1 = require("../dto/create-class.dto");
const common_1 = require("@nestjs/common");
const gql_auth_guard_1 = require("../auth/gql-auth.guard");
const role_enum_1 = require("../user/role.enum");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
let ClassResolver = class ClassResolver {
    constructor(classService) {
        this.classService = classService;
    }
    async createClass(createClassDto) {
        const { name, subject, teacherId, classLeaderId } = createClassDto;
        const teacher = new user_entity_1.User();
        teacher.id = teacherId;
        let classLeader = null;
        if (classLeaderId) {
            classLeader = new user_entity_1.User();
            classLeader.id = classLeaderId;
        }
        return this.classService.createClass(name, subject, teacher, classLeader);
    }
    async classes() {
        return this.classService.findAllClasses();
    }
    async class(id) {
        return this.classService.findClassById(id);
    }
    async updateClass(id, name, subject, classLeaderId) {
        let classLeader = null;
        if (classLeaderId) {
            classLeader = new user_entity_1.User();
            classLeader.id = classLeaderId;
        }
        return this.classService.updateClass(id, name, subject, classLeader);
    }
    async deleteClass(id) {
        await this.classService.deleteClass(id);
        return true;
    }
    async searchClasses(name, teacherName, classLeaderName) {
        return this.classService.searchClasses(name, teacherName, classLeaderName);
    }
};
exports.ClassResolver = ClassResolver;
__decorate([
    (0, graphql_1.Mutation)(() => class_entity_1.Class),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.TEACHER),
    __param(0, (0, graphql_1.Args)('createClassDto')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_class_dto_1.CreateClassDto]),
    __metadata("design:returntype", Promise)
], ClassResolver.prototype, "createClass", null);
__decorate([
    (0, graphql_1.Query)(() => [class_entity_1.Class]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.TEACHER, role_enum_1.Role.STUDENT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClassResolver.prototype, "classes", null);
__decorate([
    (0, graphql_1.Query)(() => class_entity_1.Class),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.TEACHER, role_enum_1.Role.STUDENT),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ClassResolver.prototype, "class", null);
__decorate([
    (0, graphql_1.Mutation)(() => class_entity_1.Class),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.TEACHER),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Args)('name')),
    __param(2, (0, graphql_1.Args)('subject')),
    __param(3, (0, graphql_1.Args)('classLeaderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Number]),
    __metadata("design:returntype", Promise)
], ClassResolver.prototype, "updateClass", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.TEACHER),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ClassResolver.prototype, "deleteClass", null);
__decorate([
    (0, graphql_1.Query)(() => [class_entity_1.Class]),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.TEACHER, role_enum_1.Role.STUDENT),
    __param(0, (0, graphql_1.Args)('name', { nullable: true })),
    __param(1, (0, graphql_1.Args)('teacherName', { nullable: true })),
    __param(2, (0, graphql_1.Args)('classLeaderName', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ClassResolver.prototype, "searchClasses", null);
exports.ClassResolver = ClassResolver = __decorate([
    (0, graphql_1.Resolver)(() => class_entity_1.Class),
    __metadata("design:paramtypes", [class_service_1.ClassService])
], ClassResolver);
//# sourceMappingURL=class.resolver.js.map