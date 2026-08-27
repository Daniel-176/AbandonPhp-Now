const express = require('express');
const path = require('path');
const fs = require('fs');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const PORT = 3000;
const FRONTEND = path.join(__dirname, 'frontend');

app.set('view engine', 'ejs');
app.set('views', [path.join(__dirname, 'partials'), FRONTEND]);

app.use(expressLayouts);
app.set('layout', 'layout');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res) => {
    let urlPath = req.path;

    if (urlPath === '/') {
        urlPath = '/index';
    }

    const exactPath = path.join(FRONTEND, urlPath);
    const ejsPath = path.join(FRONTEND, `${urlPath}.ejs`);

    if (fs.existsSync(exactPath) && fs.lstatSync(exactPath).isFile()) {
        return res.sendFile(exactPath);
    }

    if (fs.existsSync(ejsPath)) {
        return res.render(ejsPath, { request: req });
    }

    if (fs.existsSync(exactPath) && fs.lstatSync(exactPath).isDirectory()) {
        const dirIndex = path.join(exactPath, 'index.ejs');
        if (fs.existsSync(dirIndex)) {
            return res.render(dirIndex, { request: req });
        }
    }

    res.status(404).send('Page not found');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});