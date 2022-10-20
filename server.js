
const express = require('express');
const app = express()
app.use(express.json());
const User = require('./models/User')
const connectDB = require('./db')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



app.post('/register', async (req, res, next) => {
    /**
     * request input sources:
     * -request body
     * -request params
     * -request query strings
     * -request cookies
     */

    const { name, email, password } = req.body


    if (!name) {
        return res.status(400).json({ message: 'name required' })
    }
    else if (!email) {
        return res.status(400).json({ message: 'email required' })
    }
    else if (!password) {
        return res.status(400).json({ message: 'password required' })
    }

    try {
        let user = await User.findOne({ email })

        if (user) {
            return res.status(400).json({ message: 'User already exist' })

        }

        user = new User({ name, email, password });
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        user.password = hash
        await user.save();

        return res.status(201).json({ message: "User Created Successfully", user })

    } catch (e) {
        next(e)
    }
})


app.post('/login', async (req, res, next) => {
    const { email, password } = req.body

    try {

        const user = await User.findOne({ email })

        if(!user)
        {
            return res.status(404).json({message: 'Invalid Credentials'});
        }

        const isValidPassword = await bcrypt.compare(password,user.password)

        if(!isValidPassword)
        {
            return res.status(404).json({message: 'Invalid Credentials'});
        }

        delete user._doc.password;

        const token = jwt.sign(user._doc,'secret-key', {expiresIn : '2h'})
        return res.status(200).json({message: 'Login Successfully',token})


    } catch (e) {
        next(e)
    }

})



app.get('/private',(req, res) => {

    const token = req.headers.authorization;

    if(!token)
    {
        return res.status(401).json({message: 'Unauthorized'})
    }

    try{
        const user = jwt.verify(token)
        console.log(user)


    }catch (e) {
        return res.status(400).json({message: 'Invalid token'})
    }
    console.log(token)

  
    
    
    return res.status(200).json({message: ' I am a private route '})
})


app.get('/', (_, res) => {
    const obj = {
        name: "Safayet",
        email: "hossainsafayet187@gmail.com"
    }
    res.json(obj);

})

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({ message: "Server error Occured" })
})

connectDB('mongodb://localhost:27017/attendance-db').then(() => {
    console.log("Database connected")
    app.listen(3000, () => {
        console.log('listening on port 3000 ')
    })

}).catch(err => {
    console.error(err)
})

