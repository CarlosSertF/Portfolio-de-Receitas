module.exports = {
    logRegister(req, res, next){
        console.log(`${req.method} ${req.url} ${new Date().toISOString()}`);
        next();
    },
    sessionControl(req, res, next){
        res.locals.login = req.session.login;
        res.locals.admin = req.session.admin;
        res.locals.isAdmin = req.session.admin === true;

        if (req.session.login != undefined) 
            next();

        else if ((req.url == '/') && (req.method == 'GET'))
            next();

        else if ((req.url == '/login') && (req.method == 'POST'))
            next();

        else if ((req.url).split('/')[1] == 'recuperarSenha')
            next();
        else
            res.redirect('/');
    },
    onlyAdmin(req, res, next){
        if (req.session.admin === true) 
            next();
        else
            res.send("Acesso negado");
    }
};
    // sessionControl(req, res, next){
    //     if (req.session.login != undefined) next();
    //     else if ((req.url=='/') && (req.method == 'GET')) next();
    //     else if ((req.url == '/login') && (req.method == 'POST')) next();
    //     else if ((req.url).split('/')[1] == 'recuperarSenha') next();
    //     else res.redirect('/');
    // }