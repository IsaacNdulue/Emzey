const adminModel = require('../model/adminModel')
const validation = require('../middleware/validation')
const merchModel = require('../model/merchModel')

exports.signUp = async (req,res)=>{
    try{
      const {firstName,lastName,email,password} = req.body
      const existingUser = await userModel.findOne({email:email.toLowerCase()})
      if(existingUser){
         return res.status(400).json({
           message:'This admin already exists',
  
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
  
        const admin = await adminModel.create({
          firstName,
          lastName,
          email:email.toLowerCase(),
          password:hash
        })

        
        await admin.save()
  
        
        return res.status(200).json({
          message:'Admin registered',
          data:admin
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
      const adminExist = await userModel.findOne({email:email.toLowerCase()});
  
      if(!adminExist){
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
        adminId:adminExist._id,
        email:adminExist.email
    }, process.env.jwtSecret, { expiresIn: "36500d" })
    
    adminExist.login = true
    userExist.token = token
    await adminExist.save()
     
    res.status(200).json({
    message:'Login successful',
    token,
    data:adminExist
   })
   
    } catch (error) {
      res.status(500).json({
        message:'Error during Login',
        error:error.message
      });
    }
  
  };


exports.postMerch = async (req, res) => {
    try {
      const { type, description } = req.body;
  
      // Extract agent's info from the token
      const agentToken = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(agentToken, process.env.jwtSecret);
      const agentId = decoded.agentId;
  
      // Finding the agent using the extracted agentId
      const user = await adminModel.findById(agentId);
  
      if (!user) {
        return res.status(400).json({ message: 'You are not logged in' });
      }   
      if (user.isAdmin === false) {
        return res.status(400).json({
          message: `Hi, you can't post merchs you are not an admin`
        });
      }

      // Upload images to Cloudinary
      const uploadedImages = await Promise.all(
        req.files.map(async (file) => {
          
          const result = await cloudinary.uploader.upload(file.path, {folder: "EmzeyMerch", resource_type: 'auto' });
          return result.secure_url;
        })
      );
  
      if (uploadedImages.length === 0) {
        return res.status(400).json({ message: 'Please upload at least one image' });
      }
  
  
      const house = await merchModel.create({
        type,
        amount,
        description,
        agentId: agent._id,
        images: uploadedImages
      });
  
    //   category.house.push(house._id);
    //   house.category = categoryId;
  
    //   await Promise.all([category.save(), house.save()]);
    await house.save()
  
      res.status(201).json({
        message: 'House posted successfully',
        data: house
      });
    } catch (error) {
      res.status(500).json({
        message: 'Internal Server Error',
        error: error.message
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
  
      const admin = await adminModel.findById(decodeToken.agentId)

    
      if(!admin){
          return res.status(400).json({
              error: "Admin not found"
          })
      }
      admin.token = null;

      admin.login = false
    //   user.blackList.push(token)
      await admin.save()
    // agent.token=null
  
        res.status(200).json({
          message:`Admin has been logged out `,
          data:admin
        })
    }catch(error){
      res.status(500).json({
        message:error.message
      })
    }
  }
  