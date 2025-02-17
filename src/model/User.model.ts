import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document{
    _id: string;
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required : true,
        default : Date.now
    }
});

export interface User extends Document {
    username : string;
    email : string;
    password : string;
    verifyCode : string;
    verifyCodeExpiry : Date;
    isVerified : boolean;
    isAccepting : boolean;
    messages : Message[];
}

const UserSchema: Schema<User> = new Schema({
    username : {
        type : String,
        required : [true,"UserName is required!!"],
        unique : true,
        trim : true,
    },
    email : {
        type : String,
        required : [true, "Email is required!!"],
        unique : true,
        match: [/.+\@.+\..+/, "Please enter a valid email address!!"],
    },
    password:{
        type: String,
        required: [true, "Password is required!!"]
    },
    verifyCode:{
        type:String,
        required: [true, "Code is required to verify the user"],
    },
    verifyCodeExpiry:{
        type:Date,
        required: [true, "Code expiry is required to verify the user"],
    },
    isVerified : {
        type : Boolean,
        default : false,
    },
    isAccepting : {
        type : Boolean,
        default : true,
    },
    messages :{
        type : [MessageSchema],
    }
    // messages : [MessageSchema]  this can also be done
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;