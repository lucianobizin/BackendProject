const executePolicies = (policies) => {

    return (req, res, next) => { 
        
        if(policies[0]==="PUBLIC") return next(); 
        else if(policies[0]==="NO_AUTH" && !req.user) return next();
        else if(policies[0]==="NO_AUTH" && req.user) return res.sendUnauthorized("Already Logged In");
        else if(policies[0]==="AUTH" && req.user) return next(); 
        else if(policies[0]==="AUTH" && !req.user) return res.sendUnauthorized('Not logged'); 
        else if(policies[0]==="ADMIN" && req.user) return next();
        
        next();
        
    }
}

export default executePolicies;