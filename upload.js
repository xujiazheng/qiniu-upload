/**
 * 七牛云服务器上传函数
 */

const qiniu = require('qiniu');
const config = require('./config');

const {accessKey, secretKey, scope, scopeBashSource} = config;

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);   

const options = {
    scope
};
const createUUID = () => {
    return (Math.random()).toString(16).slice(-10);
}

const putPolicy = new qiniu.rs.PutPolicy(options);

const upload = (fname, fpath) => {
    return new Promise((resolve, reject) => {
        const uploadToken = putPolicy.uploadToken(mac);
        const formUploader = new qiniu.form_up.FormUploader({uploadToken});
        const putExtra = new qiniu.form_up.PutExtra();
        fname = createUUID() + '.' + fname.split('.')[1];
 
        formUploader.putFile(uploadToken, fname, fpath, putExtra, (respErr, respBody, respInfo)=> {
            if (respErr) {
                reject(respErr);
            } else {
                if (respInfo.statusCode === 200) {
                    const filePath = scopeBashSource + respBody.key;
                    resolve(filePath);
                } else {
                    reject(respBody);
                }
            }
        });
    })
};

module.exports = upload;
