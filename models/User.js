const mongoose=require('mongoose');
const {isEmail}=require('validator')
const bcrypt=require('bcrypt');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:[true,"Please Enter An Email"],
        lowercase:true,
        validate:[isEmail,"The Email Is Not Valid"]
    },
    password:{
        type:String,
        required:[true,"Please Enter A Password"],
        minLength:[6,"Minimum Password Length Is 6 Characters"]
    }
})

userSchema.pre('save',async function(next){
    const salt=await bcrypt.genSalt();
    this.password=await bcrypt.hash(this.password,salt);
    next()
})

userSchema.statics.login=async function (email,password){
    const user = await this.findOne({email});
    if(user){
        const auth=await bcrypt.compare(password,user.password);
        if(auth)
            return user;
        throw Error("incorrect password");
    }
    throw Error("incorrect email")
}
module.exports=mongoose.model("User",userSchema)
