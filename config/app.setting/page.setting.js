const officePage = require("../../src/router/user/gpjw.page");



exports.set = app =>{
    /**
     * admin office url설정*/
    app.use('/', officePage);




}