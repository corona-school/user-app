const Express = require("express");
const compression = require("compression");

const app = Express();

// Enforce the App to be visited under app.lern-fair.de (or whatever is in DOMAIN)
if (process.env.DOMAIN) {
    app.use((req, res, next) => {
        if (req.hostname !== process.env.DOMAIN) {
            res.redirect(req.url.replace(req.hostname, process.env.DOMAIN));
            return;
        }
    });
}

// Enforce HTTPS - The backend will reject requests from HTTP frontends anyways
app.use((req, res, next) => {
    if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
        return res.redirect('https://' + req.get('host') + req.url);
      }
      next();
});


// Provide environment variables from the process,
// so that they can easily be switched in the deployment without rebuilding the app
// Unlike env variables starting with REACT_APP_ which are built into the minified files,
//  variables prefixed with RUNTIME_ are loaded on demand
app.get('/config.js', (req, res) => {
    const runtimeEnvironment = Object.fromEntries(
        Object.entries(process.env)
            .filter(([key]) => key.startsWith("RUNTIME_"))
    );

    res.end(`window.liveConfig = ${ JSON.stringify(runtimeEnvironment) };`);
});

// Compress assets with gzip for smaller responses:
app.use(compression());

// Aggressively cache assets as js and css files are different for each build anyways
//  and logos, manifest et. al. also won't change often
app.use(Express.static(__dirname + '/build', {
    immutable: true,
    maxAge: '365 days',
    fallthrough: true,
    index: false
}));

// Entrypoint of the PWA - Do not cache to be able to invalidate logic changes fast
app.use((req, res) => res.sendFile(__dirname + '/build/index.html', { headers: { 'Cache-Control': 'no-cache' } }));

// Serve on the PORT Heroku wishes
app.listen(process.env.PORT ?? 5000, () => console.info(`Express started and listening`));