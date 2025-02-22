"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const campaignManagerABI_json_1 = __importDefault(require("../ABI/campaignManagerABI.json"));
const response_util_1 = __importDefault(require("../utils/helpers/response.util"));
const httpException_util_1 = __importDefault(require("../utils/helpers/httpException.util"));
const statusCodes_util_1 = require("../utils/statusCodes.util");
const campaign_service_1 = __importDefault(require("../services/campaign.service"));
const submission_service_1 = __importDefault(require("../services/submission.service"));
const CampaignService = new campaign_service_1.default();
const SubmissionService = new submission_service_1.default();
class CampaignController {
    createCampaign(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const campaign = yield CampaignService.create(req.body);
                return new response_util_1.default(statusCodes_util_1.OK, true, "Campaign created successfully", res, campaign);
            }
            catch (error) {
                if (error instanceof httpException_util_1.default) {
                    return new response_util_1.default(error.status, false, error.message, res);
                }
                return new response_util_1.default(statusCodes_util_1.INTERNAL_SERVER_ERROR, false, `Error: ${error.message}`, res);
            }
        });
    }
    getACampaign(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const campaign = yield CampaignService.findById(req.params.id);
                const submissions = yield SubmissionService.find({ campaignId: req.params.id });
                const creatorDetails = yield Promise.all(submissions.map((submission) => __awaiter(this, void 0, void 0, function* () {
                    let traffic = {
                        likes: 0,
                        comments: 0
                    };
                    if (campaign.app === "instagram") {
                        // traffic = await getInstagramDetails(submission.submissionUrl);
                    }
                    else if (campaign.app === "X (twitter)") {
                        // traffic = await getXDetails(submission.submissionUrl);
                    }
                    return {
                        _id: submission._id,
                        name: submission.name,
                        email: submission.email,
                        address: submission.userId,
                        link: submission.submissionUrl,
                        likes: traffic === null || traffic === void 0 ? void 0 : traffic.likes,
                        comments: traffic === null || traffic === void 0 ? void 0 : traffic.comments
                    };
                })));
                return new response_util_1.default(statusCodes_util_1.OK, true, "Campaign fetched successfully", res, {
                    campaignDetails: campaign,
                    creatorDetails
                });
            }
            catch (error) {
                if (error instanceof httpException_util_1.default) {
                    return new response_util_1.default(error.status, false, error.message, res);
                }
                return new response_util_1.default(statusCodes_util_1.INTERNAL_SERVER_ERROR, false, `Error: ${error.message}`, res);
            }
        });
    }
    openCampaign(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const openedCampaign = yield CampaignService.openById(id);
                return new response_util_1.default(statusCodes_util_1.OK, true, "Campaign opened successfully", res, openedCampaign);
            }
            catch (error) {
                if (error instanceof httpException_util_1.default) {
                    return new response_util_1.default(error.status, false, error.message, res);
                }
                return new response_util_1.default(statusCodes_util_1.INTERNAL_SERVER_ERROR, false, `Error: ${error.message}`, res);
            }
        });
    }
    closeCampaign(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const closedCampaign = yield CampaignService.closeById(id);
                return new response_util_1.default(statusCodes_util_1.OK, true, "Campaign closed successfully", res, closedCampaign);
            }
            catch (error) {
                if (error instanceof httpException_util_1.default) {
                    return new response_util_1.default(error.status, false, error.message, res);
                }
                return new response_util_1.default(statusCodes_util_1.INTERNAL_SERVER_ERROR, false, `Error: ${error.message}`, res);
            }
        });
    }
    deleteCampaign(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const deletedCampaign = yield CampaignService.deleteById(id);
                return new response_util_1.default(statusCodes_util_1.OK, true, "Campaign deleted successfully", res, deletedCampaign);
            }
            catch (error) {
                if (error instanceof httpException_util_1.default) {
                    return new response_util_1.default(error.status, false, error.message, res);
                }
                return new response_util_1.default(statusCodes_util_1.INTERNAL_SERVER_ERROR, false, `Error: ${error.message}`, res);
            }
        });
    }
    payOut(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const campaign = yield CampaignService.findById(req.params.id);
                const submissions = yield SubmissionService.find({ campaignId: req.params.id });
                const ownersFee = req.body.ownersFee;
                const campaignId = req.body.userId;
                const addresses = submissions.map(submission => submission.userId);
                campaign.status = "paid";
                yield campaign.save();
                const CampaignABI = campaignManagerABI_json_1.default.abi;
                const CONTRACT_ADDRESS = "0x5F27CC10D7fD2a05294BB4ee4d05973f012fe99D";
                const NodeUrl = process.env.ALCHEMY_KEY;
                const privateKey = process.env.WALLET_KEY;
                const provider = new ethers_1.ethers.JsonRpcProvider(NodeUrl);
                const wallet = new ethers_1.ethers.Wallet(privateKey, provider);
                const contract = new ethers_1.ethers.Contract(CONTRACT_ADDRESS, CampaignABI, wallet);
                // contract.on("Payout", (campaignId, recipient, amount) => {
                //     console.log("Payout event emitted!");
                //     console.log("Campaign ID:", campaignId.toString());
                //     console.log("Recipient:", recipient);
                //     console.log("Amount:", ethers.formatEther(amount));
                // });
                const transactionResponse = yield contract.payout(campaignId, addresses, ownersFee);
                yield transactionResponse.wait();
                return new response_util_1.default(statusCodes_util_1.OK, true, "Creators paid successfully", res);
            }
            catch (error) {
                if (error instanceof httpException_util_1.default) {
                    return new response_util_1.default(error.status, false, error.message, res);
                }
                return new response_util_1.default(statusCodes_util_1.INTERNAL_SERVER_ERROR, false, `Error: ${error.message}`, res);
            }
        });
    }
    getDashboardInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const campaigns = yield CampaignService.findByUserId(req.params.userId);
                const campaignsDetails = yield Promise.all(campaigns.map((campaign) => __awaiter(this, void 0, void 0, function* () {
                    const submissions = yield SubmissionService.find({ campaignId: campaign._id });
                    const creatorDetails = yield Promise.all(submissions.map((submission) => __awaiter(this, void 0, void 0, function* () {
                        let traffic = {
                            likes: 0,
                            comments: 0
                        };
                        ;
                        if (campaign.app === "instagram") {
                            // traffic = await getInstagramDetails(submission.submissionUrl);
                        }
                        else if (campaign.app === "X (twitter)") {
                            // traffic = await getXDetails(submission.submissionUrl);
                        }
                        return {
                            likes: (traffic === null || traffic === void 0 ? void 0 : traffic.likes) || 0,
                            comments: (traffic === null || traffic === void 0 ? void 0 : traffic.comments) || 0
                        };
                    })));
                    const likes = yield creatorDetails.reduce((totalLikes, creatorDetail) => __awaiter(this, void 0, void 0, function* () {
                        return (yield totalLikes) + creatorDetail.likes;
                    }), Promise.resolve(0));
                    const comments = yield creatorDetails.reduce((totalComments, creatorDetail) => __awaiter(this, void 0, void 0, function* () {
                        return (yield totalComments) + creatorDetail.comments;
                    }), Promise.resolve(0));
                    const trafficGenerated = creatorDetails.reduce((total, creatorDetail) => {
                        return total + creatorDetail.likes + creatorDetail.comments;
                    }, 0);
                    const engagementRate = (trafficGenerated / submissions.length) * 100;
                    return {
                        id: campaign._id,
                        name: campaign.title,
                        submissions: submissions.length,
                        likes: likes,
                        comments: comments,
                        trafficGenerated: trafficGenerated,
                        budgetSpent: campaign.budget,
                        engagementRate: engagementRate ? engagementRate : 0,
                        status: campaign.status
                    };
                })));
                const totalSubmissions = yield campaignsDetails.reduce((total, campaignDetail) => __awaiter(this, void 0, void 0, function* () {
                    return (yield total) + campaignDetail.submissions;
                }), Promise.resolve(0));
                const totalBudgetSpent = campaigns.reduce((totalBudget, campaign) => {
                    return totalBudget + campaign.budget;
                }, 0);
                const activeCampaigns = campaigns.filter(campaign => campaign.status === 'open').length;
                const totalTrafficGenerated = campaignsDetails.reduce((total, campaignDetail) => {
                    return total + campaignDetail.trafficGenerated;
                }, 0);
                const averageEngagementRate = (campaignsDetails.reduce((sum, campaignDetail) => {
                    return sum + campaignDetail.engagementRate;
                }, 0)) / campaignsDetails.length;
                const response = {
                    details: {
                        totalCampaigns: campaigns.length,
                        totalSubmissions: totalSubmissions,
                        trafficPercentage: (totalTrafficGenerated / campaignsDetails.length) * 100,
                        totalBudgetSpent: totalBudgetSpent,
                        averageEngagementRate: averageEngagementRate ? averageEngagementRate : 0,
                        activeCampaigns: activeCampaigns
                    },
                    campaigns: campaignsDetails
                };
                return new response_util_1.default(statusCodes_util_1.OK, true, "Dashboard info fetched successfully", res, response);
            }
            catch (error) {
                console.log(error.message);
                if (error instanceof httpException_util_1.default) {
                    return new response_util_1.default(error.status, false, error.message, res);
                }
                return new response_util_1.default(statusCodes_util_1.INTERNAL_SERVER_ERROR, false, `Error: ${error.message}`, res);
            }
        });
    }
    getAllCampaign(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const campaigns = yield CampaignService.findAll();
                return new response_util_1.default(statusCodes_util_1.OK, true, "All campaigns fetched successfully", res, campaigns);
            }
            catch (error) {
                if (error instanceof httpException_util_1.default) {
                    return new response_util_1.default(error.status, false, error.message, res);
                }
                return new response_util_1.default(statusCodes_util_1.INTERNAL_SERVER_ERROR, false, `Error: ${error.message}`, res);
            }
        });
    }
}
exports.default = CampaignController;
