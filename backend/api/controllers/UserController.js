/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const uploadImage = require("../helpers/upload-image")

const id = sails.config.custom.uuid
// const Message = sails.config.getMessage;
const bcrypt = sails.config.custom.bcrypt
const jwt = sails.config.custom.jwt
const Statuscode = sails.config.constant.HttpStatusCode
module.exports = {
    /**
     * @description register user in database
     * @route (POST /user/signup)
     */
    signup: async (req,res) => {
        try {
            // const lang = req.getLocale();
            let { firstName,lastName, email, password, confirmPassword } = req.body
    
            let findUser = await User.findOne({email : email,isDeleted: false})
            if(findUser){
                return res.status(Statuscode.CONFLICT).json({
                    // msg : Message("User.UserNotFoud",lang)
                    status: Statuscode.CONFLICT,
                    msg: "user already exist"
                })
            }
            if(password !== confirmPassword) {
                return res.status(Statuscode.BAD_REQUEST).json({
                    status : Statuscode.BAD_REQUEST,
                    mgs: "confirmPassword must match with password"
                })
            } else {
                const pass = await bcrypt.hash(password, 10)
                if(!pass) {
                    return res.status(Statuscode.SERVER_ERROR).json({
                        status: Statuscode.SERVER_ERROR,
                        msg: "Serverr Error"
                    })
                }
                const data = {
                    id : id(),
                    firstName : firstName,
                    lastName: lastName,
                    email : email,
                    password : pass
                }   
                const createUser = await User.create(data).fetch()
                await sails.helpers.sendMail(email,firstName)
                return res.status(Statuscode.CREATED).json({
                    msg : 'user created',
                    User : createUser
                })
            }
        } catch (error) {
            return res.status(Statuscode.SERVER_ERROR).json({
                status: Statuscode.SERVER_ERROR,
                msg: "Serverr Error"
            })
        }
    },
    /**
     * @description login user
     * @route (POST /user/login)
     */
    login: async (req,res) => {
        let {email, password} = req.body
        try {
            let findUser = await User.findOne({
                email: email,
                isDeleted: false
            })
            if(!findUser) {
                return res.status(Statuscode.NOT_FOUND).json({
                    status:Statuscode.NOT_FOUND,
                    message: 'Email is Invalid'
                })
            } 
            bcrypt.compare(password,findUser.password,async(err,success)=>{
                if(err) {
                    return res.status(Statuscode.SERVER_ERROR).json({
                        status: Statuscode.SERVER_ERROR,
                        message: 'Email or password invalid'
                    })
                }
                if(success) {
                    const token = jwt.sign(
                        {
                            email: findUser.email,
                            userId: findUser.id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "8h"
                        }
                    )
                    await User.update({email:findUser.email},{token: token})
                    return res.status(Statuscode.OK).json({
                        status: Statuscode.OK,
                        message: 'Login Successfully',
                        token: token
                    })
                }
            })
        } catch (error) {
            return res.status(Statuscode.SERVER_ERROR).json({
                status: Statuscode.SERVER_ERROR,
                message: 'server error'
            })
        }
    },
    /**
     * @description Logout user
     * @route (POST /user/logout)
     */
    logout: async (req,res) => {
        try {
            const userId =  req.userData.userId
            const findUser = await User.findOne({id: userId})
            if(!findUser) {
                return res.status(Statuscode.NOT_FOUND).json({
                    status: Statuscode.NOT_FOUND,
                    message: 'User not found'
                })
            }
            const deleteUser = await User.update({id:userId},{isDeleted:true, token:null}).fetch()
            console.log(deleteUser);
            if(deleteUser){
                return res.status(Statuscode.OK).json({
                    status: Statuscode.OK,
                    message:'Logout Successfully'
                })
            } else {
                return res.status(Statuscode.SERVER_ERROR).json({
                    status: Statuscode.SERVER_ERROR,
                    message: 'Server error'
                })
            }
        } catch (error) {
            return res.status(Statuscode.SERVER_ERROR).json({
                status: Statuscode.SERVER_ERROR,
                message: 'Server error'
            })
        }
    },
    /**
     * @description see profile of user
     * @route (GET /user/profile)
     */
    profile: async (req,res) => {
        const userId = req.userData.userId
        try {
            const user = await sails.helpers.commonFun(userId);
            res.status(Statuscode.OK).json({
                status: Statuscode.OK,
                user: user
            })
        } catch (error) {
            
        }
    },
    /**
     * @description upload profile picture
     * @route (POST /user/uploadImage)
     */
    uploadImage: async (req,res) => {
        const userId = req.userData.userId
        try {
            const findUser = await User.findOne({id: userId})
            if(!findUser) {
                return res.status(Statuscode.NOT_FOUND).json({
                    status: Statuscode.NOT_FOUND,
                    message: 'User not found'
                })
            }
            let fileUpload = await sails.helpers.uploadImage(req,'image',`profile/${findUser.firstName}`)
            if (fileUpload.type.includes('image/')) {
                fileUpload = fileUpload.fd
            } else {
                return res.status(Statuscode.UNAUTHORIZED).json({
                    status: Statuscode.UNAUTHORIZED,
                    message : 'you can upload images only'
                })
            }
            let upload = await User.update({id : userId},{imageUrl : fileUpload}).fetch()
            if(upload) {
                return res.status(Statuscode.OK).json({
                    status: Statuscode.OK,
                    message: 'uploaded successfully'
                })
            } else {
                return res.status(Statuscode.SERVER_ERROR).json({
                    status: Statuscode.SERVER_ERROR,
                    message: 'Server error'
                })
            }
        } catch (error) {
            return res.status(Statuscode.SERVER_ERROR).json({
                status: Statuscode.SERVER_ERROR,
                message: 'Server error'
            })
        }
    }
}

