import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    try {
        // console.log(req.cookies);
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ msg: 'Unauthorized',success: false });
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.log('e',error)
        return res.status(401).json({ message: 'Unauthorize',success: false });
    }
};



