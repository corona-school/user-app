const Express = require("express");
const app = Express();

// Enforce HTTPS - The backend will reject requests from HTTP frontends anyways
app.use((req, res, next) => {
    if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
        return res.redirect('https://' + req.get('host') + req.url);
      }
      next();
});

// Aggressively cache assets as js and css files are different for each build anyways
//  and logos, manifest et. al. also won't change often
app.use(Express.static(__dirname + '/build', {
    immutable: true,
    maxAge: '7 days',
    fallthrough: true
}));

// Entrypoint of the PWA - Do not cache to be able to invalidate logic changes fast
app.use((req, res) => res.sendFile(__dirname + '/build/index.html'));

// Serve on the PORT Heroku wishes
app.listen(process.env.PORT ?? 5000, () => console.info(`Express started and listening`));