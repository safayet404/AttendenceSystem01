const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test',{
    serverSelectionTimeoutMS : 1000,
})

.then(()=>{
    console.log('Database Conncted')
    createUser({name:'Safayet', email:'safayet@gmail.com'}) 
    createUser({name:'Araf', email:'araf@gmail.com'})
    createUser({name:'Galib', email:'Galib@gmail.com'})
}).catch((e)=>{
    console.log(e)
})

const userSchema = new mongoose.Schema({ name: String,email: String})

const User = mongoose.model('User', userSchema)

async function createUser(data){
    const user = new User({...data})
    await user.save()
    return user
}