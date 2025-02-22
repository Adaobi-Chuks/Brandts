"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const campaign_controller_1 = __importDefault(require("../controllers/campaign.controller"));
const { createCampaign, getACampaign, getAllCampaign, getDashboardInfo, closeCampaign, deleteCampaign, payOut, openCampaign } = new campaign_controller_1.default();
const router = express_1.default.Router();
//create campaign
router.post("/", createCampaign);
//get a campaign details
router.get("/:id", getACampaign);
//get all campaigns
router.get("/", getAllCampaign);
//get dashboard details
router.get("/dashboard/:userId", getDashboardInfo);
//pay creators
router.patch("/pay/:id", payOut);
//open a campaign
router.patch("/open/:id", openCampaign);
//close a campaign
router.patch("/:id", closeCampaign);
//delete a campaign
router.delete("/:id", deleteCampaign);
exports.default = router;
