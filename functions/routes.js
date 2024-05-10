const Router = require('express-promise-router');
const controler = require("./controller/userController")

module.exports = () => {
    const router = Router({ mergeParams: true });
    router.route('/run').post(controler.Run)
    router.route('/status').get(controler.Status)
    router.route('/delete').get(controler.Delete)
    return router;
}
 
