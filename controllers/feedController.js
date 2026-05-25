const Feed = require('../models/feedModel');

const uploadToCloudinary = require('../utils/upload');

module.exports.createPost = async function(req,res){

    try{

        let imageUrl = "";

        if(req.file){

            const result = await uploadToCloudinary(req.file.buffer);

            imageUrl = result.secure_url;
        }

        const post = await Feed.create({

            content:req.body.content,

            category:req.body.category,

            image:imageUrl,

            postedBy:req.userId,
        });

        return res.status(201).json({

            message:"Post created successfully",

            post
        });

    } catch(error){

        return res.status(500).json({

            error:error.message
        });
    }
};
module.exports.getAllFeed = async function(req,res){

    try{

        const posts = await Feed.find()

        .populate("postedBy")

        .populate("comments.user")

        .sort({createdAt:-1});

        return res.status(200).json(posts);

    } catch(error){

        return res.status(500).json({

            error:error.message
        });
    }
};
module.exports.likePost = async function(req,res){

    try{

        const post = await Feed.findById(req.params.id);

        if(!post){

            return res.status(404).json({

                message:"Post not found"
            });
        }

        const alreadyLiked = post.likes.includes(req.userId);

        if(alreadyLiked){

            post.likes = post.likes.filter(

                id => id.toString() !== req.userId
            );

        } else {

            post.likes.push(req.userId);
        }

        await post.save();

        return res.status(200).json({

            message:"Post updated",

            likes:post.likes.length
        });

    } catch(error){

        return res.status(500).json({

            error:error.message
        });
    }
};
module.exports.addComment = async function(req,res){

    try{

        const post = await Feed.findById(req.params.id);

        if(!post){

            return res.status(404).json({

                message:"Post not found"
            });
        }

        post.comments.push({

            user:req.userId,

            text:req.body.text
        });

        await post.save();

        return res.status(200).json({

            message:"Comment added successfully",

            comments:post.comments
        });

    } catch(error){

        return res.status(500).json({

            error:error.message
        });
    }
};
module.exports.deleteComment = async function(req,res){

    try{

        const post = await Feed.findById(req.params.postId);

        if(!post){

            return res.status(404).json({

                message:"Post not found"
            });
        }

        const comment = post.comments.id(req.params.commentId);

        if(!comment){

            return res.status(404).json({

                message:"Comment not found"
            });
        }

        if(comment.user.toString() !== req.userId){

            return res.status(403).json({

                message:"Not authorized"
            });
        }

        comment.deleteOne();

        await post.save();

        return res.status(200).json({

            message:"Comment deleted successfully"
        });

    } catch(error){

        return res.status(500).json({

            error:error.message
        });
    }
};
module.exports.deleteFeed = async function(req,res){

    try{

        const post = await Feed.findById(req.params.id);

        if(!post){

            return res.status(404).json({

                message:"Post not found"
            });
        }

        if(post.postedBy.toString() !== req.userId){

            return res.status(403).json({

                message:"Not authorized"
            });
        }

        await post.deleteOne();

        return res.status(200).json({

            message:"Post deleted successfully"
        });

    } catch(error){

        return res.status(500).json({

            error:error.message
        });
    }
};