
    const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");


const userSchema = new mongoose.Schema(
{

 name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [3, "Name must be at least 3 characters"],
    maxlength: [50, "Name cannot exceed 50 characters"]
},


  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
        /^\S+@\S+\.\S+$/,
        "Please enter a valid email"
    ]
},

    password:{

        type:String,

        required:true,

        minlength:8,

        select:false

    },


    role: {
    type: String,
    enum: {
        values: ["user", "admin"],
        message: "Role must be user or admin"
    },
    default: "user"
},


    avatar:{

        type:String,

        default:null

    },


bio:{

    type:String,

    maxlength:200,

    default:""

},



phone: {
    type: String,
    match: [
        /^\+[1-9]\d{7,14}$/,
        "Invalid international phone number"
    ],
    default: ""
},

status:{

    type:String,

    enum:[
        "active",
        "blocked"
    ],

    default:"active"

},


permissions:[{

    type:String

}],

emailVerified:{
    type:Boolean,
    default:false
},

emailVerificationToken:{
    type:String
},

emailVerificationExpires:{
    type:Date
},

passwordResetToken: {
    type: String,
    default: null
},

passwordResetExpires: {
    type: Date,
    default: null
},

refreshToken: {
    type: String,
    default: null
},

bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
}]

},

{
    timestamps:true
});


// Hash password before saving

userSchema.pre(
"save",
async function(){

    if(!this.isModified("password")){

        return ;

    }


    const salt = await bcrypt.genSalt(10);


    this.password =
        await bcrypt.hash(
            this.password,
            salt
        );


    

});



// Compare password

userSchema.methods.comparePassword =
async function(password){

    return await bcrypt.compare(
        password,
        this.password
    );

};


//userSchema.index({ email: 1 }, { unique: true });

userSchema.index({ role: 1 });

userSchema.index({ createdAt: -1 });

module.exports =
mongoose.model(
    "User",
    userSchema
);