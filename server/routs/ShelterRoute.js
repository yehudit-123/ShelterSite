const express = require("express");
const router = express.Router();

const shelterService = require("../services/ShelterServices");
const geocodingService = require("../services/GeocodingService");
//GET ALL SHELTERS
router.get("/", async (req, res) => {
    const shelters = await shelterService.getAllShelters();
    console.log(shelters);
    res.json(shelters);
});

// GET ALL APPROVED SHELTERS
router.get("/approved", async (req, res) => {
    console.log("GET_APPROVED_SHELTERS REQUEST");

    const shelters = await shelterService.getApprovedShelters();

    res.json(shelters);
});

// GET ALL PENDING SHELTERS
router.get("/pending", async (req, res) => {
    console.log("GET_PENDING_SHELTERS REQUEST");

    const shelters = await shelterService.getPendingShelters();

    res.json(shelters);
});
router.get("/:userId", async (req, res) => {
            const { userId } = req.params;
    const shelters = await shelterService.getSheltersByUserId(userId);
    res.json(shelters);
});
//ADD SHELTER
router.post("/", async (req, res) => {
    try {
        const { shelterName, address, type, createdByUserId, status } = req.body;
        const coords = await geocodingService.getCoordinates(address);
        if (!coords) {
            return res.status(400).json({
                success: false,
                message: `${address} -Address not found`
            });
        }
        await shelterService.addShelter({
            shelterName,
            address,
            latitude: coords.latitude,
            longitude: coords.longitude,
            type,
            createdByUserId,
            status
        });
        res.json({
            success: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false
        });
    }
});
// APPROV SHELTER
router.put("/:id/approved", async (req, res) => {
        const { id } = req.params;
        await shelterService.approveShelter(id);
        res.json({
            success: true,
            message: "Shelter approved successfully"
        });
});
// REJECT SHELTER
router.put("/:id/reject", async (req, res) => {
        const { id } = req.params;
        await shelterService.rejectShelter(id);
        res.json({
            success: true,
            message: "Shelter rejected successfully"
        });
});
// DELETE SHELTER
router.delete("/:id", async (req, res) => {
        const { id } = req.params;
        await shelterService.deleteShelter(id);
        res.json({
            success: true,
            message: "Shelter deleted successfully"
        });
});
module.exports = router;
