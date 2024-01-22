const officePage = require("../../src/router/user/rz.page");



exports.set = app =>{
    /**
     * userPage url설정*/
    app.use('/', officePage);




}