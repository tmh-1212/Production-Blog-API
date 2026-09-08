const mongoose = require("mongoose");


const postSchema = new mongoose.Schema(
{

    title:{

        type:String,

        required:true,

        trim:true,

        maxlength:100

    },


    description:{

        type:String,

        required:true

    },


    image:{

        type:String,

        default:null

    },


    category:{

        type:String,

        default:"General"

    },


    author:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true

    },


    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },


    status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "published"
    },


    readingTime: {
        type: Number,
        default: 1
    },


    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    commentsCount: {
        type: Number,
        default: 0
    },

    views: {
        type: Number,
        default: 0
    },

    bookmarksCount: {
        type: Number,
        default: 0
    },

    tags: [{
        type: String,
        lowercase: true,
        trim: true
    }]
},
{
    timestamps: true
});


postSchema.index({ author: 1 });

postSchema.index({ createdAt: -1 });

postSchema.index({ title: "text", description: "text", tags: "text" });

postSchema.index({ tags: 1 });

postSchema.index({ views: -1 });

postSchema.index({ status: 1 });

module.exports =
mongoose.model(
    "Post",
    postSchema
);
