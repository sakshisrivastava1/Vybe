import jwt from 'jsonwebtoken'

export const isAuth = async(req,res,next) =>{
  try {
    const token = req.cookies.token

    if(!token){
      return res.status(401).json({success:false,message:'Token not found!'})
    }

    const decode = jwt.verify(token,process.env.JWT_SECRET_KEY)
    req.userId = decode.id
    next()

    } catch (error) {
      console.log(error)
      return res.status(401).json({success:false,message:'Authentication Failed!'})
    }
}