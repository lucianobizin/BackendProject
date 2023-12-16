const executePolicies = (policies) => {

    return (req, res, next) => { 
        
        if(policies[0]==="PUBLIC") return next(); 
        else if(policies[0]==="NO_AUTH" && !req.user) return next();
        else if(policies[0]==="NO_AUTH" && req.user) return res.sendUnauthorized("Already Logged In");
        else if(policies[0]==="AUTH" && req.user) {

            // To avoid A01:2021 - Broken Access Control
            if(req?.cid && req?.cid === req.user?.cart) return next(); 
            else if ((req?.cid && req?.cid !== req.user?.cart)) return res.sendUnauthorized("Illegal action");

        } 
        else if(policies[0]==="AUTH" && !req.user) return res.sendUnauthorized('Not logged'); 
        else if(policies[0]==="PREMIUM" && policies[1]==="ADMIN" && req.user) return next();
        else if(policies[0]==="AUTH" && policies[1]==="PREMIUM" && req.user) return next();
        else if(policies[0]==="ADMIN" && req.user) return next();

        req.warningLog("No authorization policy matched... may it be a vulnerable entrance?")
        
        next();
        
    }
}

export default executePolicies;