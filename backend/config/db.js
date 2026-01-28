import mongoose from "mongoose";

export const connectToDb = async () => {
    await mongoose.connect(process.env.MONGO).then((data)=>{
    console.log('MONGODB CONNECTED WITH SERVER')
}).catch(err => {console.log('MONGODB DIDNOT CONNECTED WITH SERVER',err.message)})
} 