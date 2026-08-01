const User=require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validate=require("../utils/validate");
const redisClient = require("../config/redis");
const Submission=require("../models/submission")
const crypto=require("crypto");
const nodemailer = require("nodemailer");
//google-login
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
//for upldating loginStreak
const updateLoginStreak = async (user) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day
  
  // If no last login date (new user), set streak to 1
  if (!user.lastLoginDate) {
    user.loginStreak = 1;
    user.lastLoginDate = today;
    await user.save();
    return;
  }

  const lastLogin = new Date(user.lastLoginDate);
  lastLogin.setHours(0, 0, 0, 0); // Normalize to start of day

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // If logged in today already, don't update
  if (lastLogin.getTime() === today.getTime()) {
    return;
  }

  // If logged in yesterday, increment streak
  if (lastLogin.getTime() === yesterday.getTime()) {
    user.loginStreak += 1;
  } 
  // If not consecutive, reset streak
  else if (lastLogin.getTime() < yesterday.getTime()) {
    user.loginStreak = 1;
  }

  user.lastLoginDate = today;
  await user.save();
};

const register=async(req,res)=>{
    try{
        //validate the data ie necessary thing there and rest validation
        // console.log(req.body);  
        // console.log("check1");
        validate(req.body);
        //done emailId unique so if already in DB dont need to check automatic error
        //before storing password hashing 
        const{password,emailId}=req.body;
        //////////////////////
        //not allowing google login method one to register
        const existingUser=await User.findOne({emailId});
        // console.log("check2");
        if(existingUser)
          if(existingUser.loginMethod==="google")
            throw new Error("This account was already created via Google. Please use Google Sign-In");
          else 
            throw new Error("User already registered");
        ////////////////////////////////////////////////////
        req.body.password=await bcrypt.hash(password,10);
        //role user fixed to that no one without authority can register as admin
        req.body.role="user";
        const user=await User.create(req.body);
        user.loginStreak=1;
        user.lastLoginDate=new Date();
        await user.save();
        //once registered create a token for user directly and can access home or else can generate token only when do login so after register login req to do,am giving direct access 
      const token= jwt.sign({id:user._id,emailId:emailId,role:"user"},process.env.JWT_KEY,{expiresIn:60*60})//expiry setting an hour of token 
      // console.log("check3");
      res.cookie('token',token,{maxAge:60*60*1000, httpOnly: true,
  secure: true,           // required on Render (HTTPS)
  sameSite: "None"});
      const reply={
        firstName:user.firstName,
        emailId:user.emailId,
        _id:user._id,
        role:user.role,
        profile:user.profile.url,
        streak: user.loginStreak, // Include streak in response
        problemSolved:user.problemSolved,
      }
      res.status(201).json({
        user:reply,
        message:"Successfully Registered"
      });
    }
 catch(err){
  // console.log(err.message);
  res.status(401).json({
    message:err.message 
});
}
}

const login=async(req,res)=>{
    try{
  
        const{emailId,password}=req.body;
        //if something not entered
        if(!emailId||!password)
            throw new Error("Invalid Credentials");
        //find user in db and check if given login details match 
        const user=await User.findOne({emailId});
        //user not exists
        if (!user) {
          throw new Error("User not found");
        }
        ////////////////////////////////////
        // if registered via google tell him
        if(user.loginMethod==="google")
          throw new Error("This account was created via Google. Please use Google Sign-In.")
        //////////////////////////////////
      
        const match=await bcrypt.compare(password,user.password)
        if(!match)
            throw new Error("Invalid Credentials");
          //before giving jwt inc loginStreak
        await updateLoginStreak(user);
        //if passwords matched create jwt token and return it to user
         const token= jwt.sign({id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60})//expiry setting an hour of token 
      res.cookie('token',token,{maxAge:60*60*1000,
         httpOnly: true,
  secure: true,           // required on Render (HTTPS)
  sameSite: "None"
      });
      const reply={
        firstName:user.firstName,
        emailId:user.emailId,
        _id:user._id,
        role:user.role,
        profile:user.profile.url,
        streak: user.loginStreak, // Include streak in response
         problemSolved:user?.problemSolved,
      }
    //updating loginStreak and last login 

      // console.log(reply);
       res.status(201).json({
        user:reply,
        message:"Logged In Successfully"
      });

    }
   catch(err){
  // console.log(err.message);
  res.status(401).json({
    message:err.message 
});
}
}

const googleLogin=async(req,res)=>{
//token id from frontend

const {id_token}=req.body;

try{
  //verify token by google
  // console.log("check1");
  // got same token as frontend console.log(id_token)
  const ticket=await client.verifyIdToken({
    idToken:id_token,
    audience:process.env.GOOGLE_CLIENT_ID,
  });
 
  const payload=ticket.getPayload();
  // console.log(payload);
  const{email,name,picture,sub:googleId}=payload;
  // console.log("pic",picture)
  //checking if user exist will generate a jwt and send else error
  let user=await User.findOne({emailId:email});
   //user not exist throw error

   const randomPassword = await bcrypt.hash(crypto.randomUUID(), 10); // securely hashed random password


  if(!user){
    user=await User.create({
      firstName:name,
      emailId:email,
      role:"user",
      //for better experience placing google profile image as user on first register through google
      profile:{
        url:picture,
      },
      //something random so let be googletoken only
      password:randomPassword,
      loginMethod:"google",
      loginStreak: 1, // Initialize streak for new Google user
     lastLoginDate: new Date()
    })
  }
  //user exist already generate jwt and give
  //if registered with mail let them use that
  if(user.loginMethod==="email")
    throw new Error("This email is already registered. Please login using email and password.")
   // Update login streak for existing Google user
        await updateLoginStreak(user);
// console.log("check2");
    const token= jwt.sign({id:user._id,emailId:email,role:user.role},process.env.JWT_KEY,{expiresIn:60*60})//expiry setting an hour of token 
      res.cookie('token',token,{maxAge:60*60*1000, httpOnly: true,
  secure: true,         
  sameSite: "None"});
      const reply={
        firstName:user.firstName,
        emailId:user.emailId,
        _id:user._id,
        role:user.role,
        profile:user?.profile?.url,
        streak: user.loginStreak,
        problemSolved:user.problemSolved,
      }
      //  console.log(reply);
       res.status(201).json({
        user:reply,
        message:"Logged In Successfully"
      });



}
catch(err){
  // console.log(err.message);
  res.status(401).json({
    message:err.message 
});

}
}
const logout=async(req,res)=>{
  try{
    //validate the token if its invalid only means already logged out
    //already validated token in middleware not log it out 
    const{token}=req.cookies;
    //we keep token in redis blocked only till token expiry that we can get from payload
    const payload=jwt.decode(token);
    await redisClient.set(`token:${token}`,'Blocked');
    await redisClient.expireAt(`token:${token}`,payload.exp);
    //else add token to redis blocklist
    //than clear the cookie from frontend
  res.cookie("token",null,{expires:new Date(Date.now())});
  res.send("Logged Out Successfully");
  }
  catch(err){
    //ERROR WILL COME ONLY FROM REDIS HERE AS ALREADY CHECK VALID TOKEN SO 503 
   res.status(503).send("Error:"+err.message);
  }

}
  const adminRegister=async(req,res)=>{
   try{
    validate(req.body);
    const{password,emailId}=req.body;
    req.body.password=await bcrypt.hash(password,10);
    req.body.role='admin';
    const user=await User.create(req.body);
    const token= jwt.sign({id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60})
    res.cookie('token',token,{maxAge:60*60*1000});
    res.status(201).send("User Created Successfully");

   }
   catch(err){
     res.status(400).send("Error:"+err.message);
   }
  }

const deleteProfile=async(req,res)=>{
  try{
 const userId=req.result._id;
 await User.findByIdAndDelete(userId);
 //delete submissions by that user
 await Submission.deleteMany({userId});
 res.status(200).send("Deleted Successfully!");
  }
 catch(err){
  res.status(500).send("Internal Server Error")
 
 }
}


const sendMail = async (req, res) => {
  try {
    const emailId = req.body.emailId;
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).json({ message: "Email ID is not registered." });
    }

    const token = jwt.sign(
      { id: user._id, emailId: emailId, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: 5 * 60 }
    );

    const magicLoginLink = `${process.env.FRONTEND_URL}/magic-login/${token}`;

    const textContent = `Hello,\n\nWe received a request to login to your CODEWINZ account. Click or copy the link below to access your account:\n\n${magicLoginLink}\n\nThis link is valid for 5 minutes. If you did not request this, you can safely ignore this email.\n\nBest regards,\nCODEWINZ Team`;
    
    const htmlContent = `
      <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #060608; padding: 40px 20px; color: #e4e4e7; text-align: center;">
        <div style="background-color: #0f0f11; border: 1px solid #27272a; border-radius: 16px; max-width: 500px; margin: 0 auto; padding: 40px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
          <!-- Logo Header -->
          <div style="margin-bottom: 24px;">
            <h2 style="color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; margin: 0;">
              CODEWINZ
            </h2>
          </div>
          
          <!-- Message Body -->
          <h1 style="font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 16px;">
            🔒 Instant Access Link
          </h1>
          <p style="font-size: 15px; line-height: 24px; color: #a1a1aa; margin-bottom: 32px;">
            We received a request to log in to your account. Click the button below to sign in instantly. This link is valid for <strong>5 minutes</strong>.
          </p>

          <!-- CTA Button -->
          <div style="margin: 32px 0;">
            <a href="${magicLoginLink}"
               style="background-color: #ffffff; color: #000000; padding: 14px 32px; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 10px; display: inline-block; box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1); transition: all 0.2s ease;">
              Sign In to CodeWinz
            </a>
          </div>

          <!-- Footer Details -->
          <p style="font-size: 13px; color: #71717a; margin-top: 32px; border-top: 1px solid #1f1f23; padding-top: 24px;">
            If you didn’t request this email, you can safely ignore it.
          </p>
          <div style="margin-top: 24px; font-size: 11px; color: #52525b;">
            © ${new Date().getFullYear()} CODEWINZ. All rights reserved.
          </div>
        </div>
      </div>
    `;

    // A. If RESEND_API_KEY is configured, use HTTP API (never blocked by Render)
    if (process.env.RESEND_API_KEY) {
      console.log("Sending magic link via Resend API...");
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'CODEWINZ Support <onboarding@resend.dev>',
          to: emailId,
          subject: '🔓 Access Your CODEWINZ Account',
          text: textContent,
          html: htmlContent
        })
      });

      if (!resendRes.ok) {
        const errText = await resendRes.text();
        throw new Error(`Resend API error: ${errText}`);
      }

      const resendData = await resendRes.json();
      console.log("Magic link email sent successfully via Resend API:", resendData.id);
      return res.status(200).json({ message: "Magic link sent successfully!" });
    }

    // B. Fallback to Gmail SMTP (for local development)
    console.log("Sending magic link via Nodemailer SMTP...");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SENDER_MAIL,
        pass: process.env.SENDER_MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"CODEWINZ Support" <${process.env.SENDER_MAIL}>`,
      to: emailId,
      subject: "🔓 Access Your CODEWINZ Account",
      text: textContent,
      html: htmlContent
    });

    console.log("Magic link email sent successfully via SMTP:", info.messageId);
    return res.status(200).json({ message: "Magic link sent successfully!" });

  } catch (err) {
    console.error("Error sending magic link email:", err);
    return res.status(500).json({
      message: err.message,
    });
  }
}
const verifyMail=async(req,res)=>{
  try{
  const check_token=req.body.token;
 const payload=jwt.verify(check_token,process.env.JWT_KEY);
 const {id}=payload;
  const user=await User.findById(id);
    await updateLoginStreak(user);
   const token= jwt.sign({id:user._id,emailId:user.emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60})//expiry setting an hour of token 
      res.cookie('token',token,{maxAge:60*60*1000,
         httpOnly: true,
  secure: true,           // required on Render (HTTPS)
  sameSite: "None"
      });
       const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role: user.role,
            profile: user?.profile?.url,
            streak: user.loginStreak // Include streak in response
        }
res.status(200).json({
            user: reply,
            message: "Logged In Successfully"
})
    }
    catch(err){
      res.status(200).json({message:"Token is Invalid/Expired"});
      console.log("error message")
    }
}
module.exports={register,login,logout,adminRegister,deleteProfile,googleLogin,sendMail,verifyMail}