
const {model,Schema} = require('mongoose')


const userSchema = new Schema({
    name : String,
    email : { 
        type:String, required: true , 
        validate: {
            validator : function(e){
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e)
            },
            messages: (prop)=> `Invalid email : ${prop.value}`,
        }
    },
    password : {
        type:String,
        minlength: [6, 'password is too short'],
      
        required: true
    },
    roles : {
        type:String,
        required: true, 
        default : 'STUDENT'
    },
    accountStatus :  {
        type:String,
        required: true,
        enum : ['PENDING', 'ACTIVE','REJECTED'],
        default : 'PENDING'
       
        
    }
      
})

const User = model('User', userSchema);
module.exports = User;