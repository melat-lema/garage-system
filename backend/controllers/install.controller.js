// impotr servvices
const installService = require('../services/install.service');
// create function that handle install request
async function install(req, res,next) {
    const installMessage = await installService.install();
    if (installMessage) {
        res.status(200).json({
            message: installMessage,
        });
    } else {        res.status(500).json({
            message: 'Installation failed',
        });
    }
}

module.exports = {
    install,
};