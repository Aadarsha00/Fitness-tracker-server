"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allUser = exports.onlyUser = exports.onlyAdmin = exports.BodyPart = exports.Role = void 0;
var Role;
(function (Role) {
    Role["user"] = "USER";
    Role["admin"] = "ADMIN";
})(Role || (exports.Role = Role = {}));
var BodyPart;
(function (BodyPart) {
    BodyPart["chest"] = "Chest";
    BodyPart["back"] = "Back";
    BodyPart["legs"] = "Legs";
    BodyPart["shoulders"] = "Shoulders";
    BodyPart["arms"] = "Arms";
    BodyPart["core"] = "Core";
    BodyPart["cardio"] = "Cardio";
    BodyPart["fullBody"] = "Full body";
    BodyPart["other"] = "Other";
})(BodyPart || (exports.BodyPart = BodyPart = {}));
exports.onlyAdmin = [Role.admin];
exports.onlyUser = [Role.user];
exports.allUser = [Role.user, Role.admin];
