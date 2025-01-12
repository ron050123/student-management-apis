"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const enrollment_entity_1 = require("./enrollment.entity");
const enrollment_service_1 = require("./enrollment.service");
const enrollment_resolver_1 = require("./enrollment.resolver");
const class_entity_1 = require("../class/class.entity");
const user_entity_1 = require("../user/user.entity");
let EnrollmentModule = class EnrollmentModule {
};
exports.EnrollmentModule = EnrollmentModule;
exports.EnrollmentModule = EnrollmentModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([enrollment_entity_1.Enrollment, class_entity_1.Class, user_entity_1.User])],
        providers: [enrollment_service_1.EnrollmentService, enrollment_resolver_1.EnrollmentResolver],
    })
], EnrollmentModule);
//# sourceMappingURL=enrollment.module.js.map