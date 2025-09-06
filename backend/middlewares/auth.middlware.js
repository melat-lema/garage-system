require ('dotenv').config();
const employeeService = require('../services/employee.service');
const jwt= require("jsonwebtoken");

const verifyToken= async(req, res, next)=>{
    let token=req.headers['x-access-token'];
    if(!token){
        return res.status(403).send({
            status:"fail",
        message: "No token provided!"
        });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
        if(err){
            return res.status(401).send({
                status: "fail",
                message: "unauthorized!"
            })
        }
        req.employee_email= decoded.employee_email;
        next();
    })
}
const isAdmin = async (req, res, next) => {
    let token = req.headers['x-access-token'];
    const employee_email = req.employee_email;
    const employee = await employeeService.getEmployeeByEmail(employee_email);
    if (employee[0].company_role_id === 3) {
        next();
    } else {
        return res.status(403).send({
            status: "fail",
            message: "You are not authorized to perform this action!"
        });
    }
};
const authMiddleware = {
    verifyToken,
    isAdmin
};
module.exports = authMiddleware;