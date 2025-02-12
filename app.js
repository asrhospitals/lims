require('dotenv').config();
const express=require('express');
const app=express();
const cors=require("cors");
const PORT=process.env.PORT || 2000;
const MasterRoutes=require('./routes/adminRoutes/masterRoute');
const RegistrationRoutes=require('./controller/registrationController/registration');
const ReportDoctor=require('./controller/adminController/masterController/reportDoctor');
const AuthRoutes=require('./routes/authRoutes/authenticationRoute');
const sequelize=require('./db/connectDB');
const verifyToken=require("./middlewares/authMiddileware");
const role=require("./middlewares/roleMiddleware");

app.use(cors());
app.use(express.json());

/// User Authentication Routes
app.use('/lims/authentication',AuthRoutes);

/// All routes
app.use('/lims/master',verifyToken,role("admin"),MasterRoutes,ReportDoctor);

/// Routes used by Phelbotomist
app.use('/lims/ppp',verifyToken,role('phlebotomist'),RegistrationRoutes);

// Test Route
app.get('/',async (req,res) => {
    return res.json({message:"Welcome to the AWS Cloud"});
});

const server=async()=>{
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log("Database Connected");
        
        app.listen(PORT,()=>{ console.log(`${PORT} port is Connected`);});
    } catch (error) {
        console.log(error)
    }
}

server();