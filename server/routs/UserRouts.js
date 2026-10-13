const express = require("express");
const router = express.Router();
const userService = require("../services/UserServices");

//LOGIN
router.post("/login", async (req, res) => {
    console.log("LOGIN REQUEST");
    const { userName, passwordHash } = req.body;
    const users = await userService.login(userName, passwordHash);
    if (users.length === 0) {
        return res.json({
            success: false,
            message: "Invalid username or password"
        });
    }
    res.json({
        success: true,
        user: users[0]
    });
});

//GET ALL USERS
router.get("/", async (req, res) => {
    console.log("GET_ALL_USERS REQUEST");
    const users = await userService.getAllUsers();
    res.json(users);
});

//GET USER BY ID
router.get("/:id", async (req, res) => {
    console.log("GET_USER_BY_ID REQUEST");
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    res.json(user);
});
router.post("/register", async (req, res) => {
    console.log("REGISTER_USER REQUEST");
    const { userName, email, phone, passwordHash, userRole } = req.body;
    const userId  = await userService.addUser(
        userName,
        email,
        phone,
        userRole,
        passwordHash
    );
    const user = {
        userId,
        userName,
        email,
        phone,
        userRole
    }; 
    res.json({
        success: true,
        user
    });
});

//ADD USER
router.post("/addUser", async (req, res) => {
    console.log("ADD_USER REQUEST");
    const { userName, email, phone, passwordHash, userRole } = req.body;
    const result = await userService.addUser(
        userName,
        email,
        phone,
        userRole,
        passwordHash
    );
    res.json({
        success: true,
        result
    });
});

//UPDATE USER
router.put("/update/:id", async (req, res) => {
    console.log("UPDATE_USER REQUEST");
    const userId = req.params.id;
    const { userName, email, phone, password, userRole } = req.body;
    await userService.updateUser(
        userId,
        userName,
        email,
        phone,
        password,
        userRole
    );

    res.json({
        success: true
    });
});

//DELETE USER
router.delete("/:id", async (req, res) => {
    console.log("DELETE_USER REQUEST");

    const userId = req.params.id;

    await userService.deleteUser(userId);

    res.json({
        success: true
    });
});
module.exports = router;