const express = require('express');

const router = express.Router();

const upload = require('../middlewares/multer');

const { auth } = require('../middlewares/auth');

const {

    createPost,

    getAllFeed,

    likePost,

    addComment,

    deleteComment,

    deleteFeed

} = require('../controllers/feedController');
// CREATE POST
router.post("/createPost",auth,upload.single("image"),createPost);
// GET ALL POSTS
router.get("/getAll",auth,getAllFeed);
// LIKE / UNLIKE POST
router.put("/like/:id",auth,likePost);
// ADD COMMENT
router.post("/comment/:id",auth,addComment);
// DELETE COMMENT
router.delete("/comment/:postId/:commentId",auth,deleteComment);
// DELETE POST
router.delete("/:id",auth,deleteFeed);
module.exports = router;