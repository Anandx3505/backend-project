import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';





const registerUser = asyncHandler(async (req,res,)=>{
     //get user details from frontend
     //validation - not empty, email format
     //check if user already exists in db
     //check for images, check for avatar
     //upload them to cloudinary, avatar
     //create uesr object - create entry in db
     //remove password and refresh token from reponse
     //check for user creation
     //return res

    const {username, email, password, fullName} = req.body
    console.log("email: ",email,"\npassword: ",password);

    if(
        [fullName, email, username, password].some((field)=> field?.trim() === "")
    ){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })
        
    if(existedUser){
        throw new ApiError(409,"User already exists")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path 
    console.log("avatar path: ", avatarLocalPath);
    const coverImageLocalPath = req.files?.coverImage[0]?.path 
    console.log("coverImage path: ", coverImageLocalPath);

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar upload failed")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        username: username.toLowerCase(),
        password
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "User creation failed")
    }

    return res.status(201).json(new ApiResponse(
        200,
        createdUser,
        "User registered successfully"
    ))
    
})


export { registerUser }