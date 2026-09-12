const checkPermission =
(permission)=>{


return(req,res,next)=>{


if (
    !req.user ||
    !Array.isArray(req.user.permissions) ||
    !req.user.permissions.includes(permission)
) {
    return res.status(403).json({
        success: false,
        message: "Permission denied"
    });
}


next();


};


};


module.exports =
checkPermission;
