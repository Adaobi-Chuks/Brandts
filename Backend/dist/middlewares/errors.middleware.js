"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_middleware_1 = __importDefault(require("./logger.middleware"));
const response_util_1 = __importDefault(require("../utils/helpers/response.util"));
const statusCodes_util_1 = require("../utils/statusCodes.util");
exports.default = (error, req, res, next) => {
    logger_middleware_1.default.error(error);
    return new response_util_1.default(statusCodes_util_1.INTERNAL_SERVER_ERROR, false, error.message, res);
};
