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
let ClassResolver = class ClassResolver {
    constructor(classService) {
        this.classService = classService;
    }
    async createClass(createClassDto) {
        const { name, subject, teacherId } = createClassDto;
        const teacher = new user_entity_1.User();
        teacher.id = teacherId;
        return this.classService.createClass(name, subject, teacher);
    }
    async classes() {
        return this.classService.findAllClasses();
    }
    async class(id) {
        return this.classService.findClassById(id);
    }
    async updateClass(id, name, subject) {
        return this.classService.updateClass(id, name, subject);
    }
    async deleteClass(id) {
        await this.classService.deleteClass(id);
        return true;
    }
};
exports.ClassResolver = ClassResolver;
__decorate([
    (0, graphql_1.Mutation)(() => class_entity_1.Class),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, graphql_1.Args)('createClassDto')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_class_dto_1.CreateClassDto]),
    __metadata("design:returntype", Promise)
], ClassResolver.prototype, "createClass", null);
__decorate([
    (0, graphql_1.Query)(() => [class_entity_1.Class]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClassResolver.prototype, "classes", null);
__decorate([
    (0, graphql_1.Query)(() => class_entity_1.Class),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ClassResolver.prototype, "class", null);
__decorate([
    (0, graphql_1.Mutation)(() => class_entity_1.Class),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, graphql_1.Args)('id')),
    __param(1, (0, graphql_1.Args)('name')),
    __param(2, (0, graphql_1.Args)('subject')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], ClassResolver.prototype, "updateClass", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ClassResolver.prototype, "deleteClass", null);
exports.ClassResolver = ClassResolver = __decorate([
    (0, graphql_1.Resolver)(() => class_entity_1.Class),
    __metadata("design:paramtypes", [class_service_1.ClassService])
], ClassResolver);
//# sourceMappingURL=class.resolver.js.map