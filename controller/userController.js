const userModel = require('../model/userModel')
const validation = require('../middleware/validation')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



exports.signUp = async (req,res)=>{
  try{
    const {firstName,lastName,email,password} = req.body
    const existingUser = await userModel.findOne({email:email.toLowerCase()})
    if(existingUser){
       return res.status(400).json({
         message:'this user already exists',

       })
    }
    await validation.validateAsync({firstName,lastName,email,password},(err,data)=>{
        if(err){
          res.json(err.message)
        }else{
          res.json(data)
        }
      })
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const user = await userModel.create({
        firstName,
        lastName,
        email:email.toLowerCase(),
        password:hash
      })
      await user.save()

      
      return res.status(200).json({
        message:'User registered',
        data:user
    })
  }catch(error){
        return res.status(500).json({
            message:'user not created',
            error:error.message
        })
  }
}

exports.login = async (req,res) => {
    try {
      const {email,password} = req.body;
      const userExist = await userModel.findOne({email:email.toLowerCase()});
  
      if(!userExist){
        return res.status(401).json({
          message:'Invalid email or password',
        });
      }
  
      const checkPassword = bcrypt.compareSync(password, userExist.password)
      if(!checkPassword){
        return res.status(400).json({
            error: "Incorrect password"
        })
    }

    const token = jwt.sign({
        agentId:userExist._id,
        email:userExist.email
    }, process.env.jwtSecret, { expiresIn: "36500d" })
    
    userExist.login = true
    userExist.token = token
    await userExist.save()
     
    res.status(200).json({
    message:'Login successful',
    token,
    data:userExist
   })
   
    } catch (error) {
      res.status(500).json({
        message:'Error during Login',
        error:error.message
      });
    }
  
  };


  
exports.logOut= async (req,res)=>{
    try{
      const hasAuthorization = req.headers.authorization
  
      if(!hasAuthorization){
          return res.status(400).json({
              error:"Authorization token not found"
          })
      }
  
      const token = hasAuthorization.split(" ")[1]
    //   console.log(token)
      if(!token){
          return res.status(400).json({
              error: "Authorization not found"
          })
      }
  
      const decodeToken = jwt.verify(token, process.env.jwtSecret)
  
      const user = await userModel.findById(decodeToken.agentId)

    
      if(!user){
          return res.status(400).json({
              error: "User not found"
          })
      }
      user.token = null;

      user.login = false
    //   user.blackList.push(token)
      await user.save()
    // agent.token=null
  
        res.status(200).json({
          message:`User has been logged out `,
          data:user
        })
    }catch(error){
      res.status(500).json({
        message:error.message
      })
    }
  }