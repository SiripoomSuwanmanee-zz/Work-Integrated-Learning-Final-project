const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('./scripts/dbConfig.js');
const mysql = require('mysql');
const formidable = require('formidable');
const fs = require('fs');   
const bcrypt = require('bcryptjs');
const session = require('express-session');
const requestIp = require('request-ip');


let connection = mysql.createConnection(config);

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use("/scripts",express.static(__dirname+"/scripts"));
app.use("/styles",express.static(__dirname+"/styles"));
app.use("/DataTables",express.static(__dirname+"/DataTables"));
app.use("/images",express.static(__dirname+"/images"));
app.use(session({
    //cookie: { maxAge: 24*60*60*1000 },  //1 day in millisec
    secret: 'mysecretcode'
}));

app.use(requestIp.mw());

let sess;

//-------------------- Routes ---------------------//
//-------------------- Front-end -----------------//
app.get("/cabinet/:id", function(req, res){
    res.sendFile(__dirname + "/views/cabinet.html");
});
app.get("/cabinet/:id/:lang", function(req, res){
    res.sendFile(__dirname + "/views/cabinet.html");
});
app.get("/artifact/:id", function(req, res){
    res.sendFile(__dirname + "/views/artifact.html");
});
app.get("/artifact/:id/:lang", function(req, res){
    res.sendFile(__dirname + "/views/artifact.html");
});
app.get("/map", function(req, res){
    res.sendFile(__dirname + "/views/map.html");
});
app.get("/map/:lang", function(req, res){
    res.sendFile(__dirname + "/views/map.html");
});
//--------------------Back-end-----------------------//
app.get("/manage", function(req, res){
    sess = req.session;
    if(sess.username)
        res.redirect("/manage/dashboard");
    else 
        res.sendFile(__dirname + "/views/manage/login.html");

});


app.get("/manage/dashboard", function(req, res){
    sess = req.session;
    if(sess.username) 
        res.sendFile(__dirname + "/views/manage/dashboard.html");
    else 
        res.redirect("/manage");
});

app.get("/manage/cabinet", function(req, res){
    sess = req.session;
    if(sess.username) 
        res.sendFile(__dirname + "/views/manage/cabinet.html");
    else 
        res.redirect("/manage");
});

app.get("/manage/cabinet/add", function(req, res){
    sess = req.session;
    if(sess.username) 
        res.sendFile(__dirname + "/views/manage/cabinet_add.html");
    else 
        res.redirect("/manage");
});

app.get("/manage/cabinet/edit/:cabinet_id", function(req, res){
    sess = req.session;
    if(sess.username) 
        res.sendFile(__dirname + "/views/manage/cabinet_edit.html");
    else 
        res.redirect("/manage");
});

app.get("/manage/cabinet/view/:cabinet_id", function(req, res){
    sess = req.session;
    if(sess.username) 
        res.sendFile(__dirname + "/views/manage/cabinet_view.html");
    else 
        res.redirect("/manage");
});

app.get("/manage/artifact", function(req,res){
    sess = req.session;
    if(sess.username) 
        res.sendFile(__dirname + "/views/manage/artifact.html");
    else 
        res.redirect("/manage");
})

app.get("/manage/artifact/add", function(req,res){
    sess = req.session;
    if(sess.username) 
        res.sendFile(__dirname + "/views/manage/artifact_add.html");
    else 
        res.redirect("/manage");
})

app.get("/manage/artifact/edit/:artifact_id", function(req,res){
    sess = req.session;
    if(sess.username) 
        res.sendFile(__dirname + "/views/manage/artifact_edit.html");
    else 
        res.redirect("/manage");
})

app.get("/manage/type", function(req,res){
    sess = req.session;
    if(sess.username) 
        res.sendFile(__dirname + "/views/manage/type.html");
    else 
        res.redirect("/manage");
})

app.get("/manage/type/add", function(req,res){
    sess = req.session;
    if(sess.username) 
        res.sendFile(__dirname + "/views/manage/type_add.html");
    else 
        res.redirect("/manage");
})

app.get("/manage/type/edit/:type_id", function(req,res){
    sess = req.session;
    if(sess.username) 
        res.sendFile(__dirname + "/views/manage/type_edit.html");
    else 
        res.redirect("/manage");
})

app.get("/manage/map", function (req, res) {
    sess = req.session;
    if(sess.username) 
        res.sendFile(__dirname + "/views/manage/map.html");
    else 
        res.redirect("/manage");
});

app.get("/manage/printqr", function(req, res){
    sess = req.session;
    if(sess.username) 
        res.sendFile(__dirname + "/views/manage/qr.html");
    else 
        res.redirect("/manage");
});

app.get("/manage/qrcode", function(req, res){
    sess = req.session;
    if(sess.username) 
        res.sendFile(__dirname + "/views/manage/qrcode.html");
    else 
        res.redirect("/manage");
});

//===================== Login =============================//
/*app.get("/password/:pass", function (req, res) {
    let password = req.params.pass;
    let saltRounds = 10;    
    bcrypt.hash(password, saltRounds, function(err, hash) {
        //return hashed password, 60 characters
        res.end(hash);
    });
});*/

app.post("/manage/login", function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let remember = req.body.remember;
    
    let sql = "SELECT * FROM tb_admin WHERE ad_user=?";
    connection.query(sql, [username], function (err, result, fields) {
        if (err) {
            return console.error(err.message);
        }           
 
        let numrows = result.length;
        if(numrows != 1) {
            //login failed
            res.status(401).end();
        }
        else {
            bcrypt.compare(password, result[0].ad_pass, function(err, resp) {
                if (err) {
                    return console.error(err.message);
                }

                if(resp == true) {
                    sess = req.session;
                    
                    if(remember == "true"){
                        sess.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
                    }else {
                        sess.cookie.expires = false;
                    }

                    //set session variable
                    sess.username = result[0].ad_user;
                    //go to dashboard
                    res.end("/manage/dashboard");
                }
                else {
                    //wrong username or password
                    res.status(403).end();
                }
            });                       
        }
    });
});

app.get("/manage/logout", function (req, res) {
    //clear session variable
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        }
        res.redirect("/manage");
    });
});



//===================== Start Cabinet =====================//

app.get("/manage/artifact/cabinet/:id", function(req, res){ //  เรียกวัตถุที่อยู่ในตู้ตาม id
    let cabId = req.params.id;
    let sql = "SELECT ar_id, ar_number, ar_image, ar_th_name, ar_en_name FROM tb_artifact WHERE cab_id = ?";
    connection.query(sql, [cabId], function(err, result, fields){
        if(err){
            console.log(err.message);
            res.status(400).end();
            return;
        }

        if(result.length == 0){
            //login failed
            res.status(401).end();
        }
        else{
            res.json(result);
        }
    });
});

//-------------------- Get All Cabinet --------------------// 

app.get("/manage/cabinet/all", function(req, res){

    let sql = "SELECT cab_id, cab_number,cab_image,cab_en_detail,cab_th_detail,cab_active_flag, (SELECT count(ar_id) FROM tb_artifact WHERE cab_id = c.cab_id) AS ar_count FROM tb_cabinet c WHERE cab_id != 99";
    connection.query(sql, function(err, result, fields){
        if(err){
            console.log(err.message);
            res.status(400).end();
            return;
        }

        if(result.length == 0){
            //login failed
            res.status(401).end();
        }
        else{
            res.json(result);
        }
    });
});

//-------------------- Get Cabinet By Id --------------------// 

app.get("/manage/cabinet/:id", function(req, res){
    let cabId = req.params.id;
    let sql = "SELECT cab_id, cab_number,cab_image,cab_en_detail,cab_th_detail,cab_active_flag, (SELECT count(ar_id) FROM tb_artifact WHERE cab_id = c.cab_id) AS ar_count FROM tb_cabinet c WHERE cab_id = ?";
    connection.query(sql, [cabId], function(err, result, fields){
        if(err){
            console.log(err.message);
            res.status(400).end();
            return;
        }

        if(result.length == 0){
            //login failed
            res.status(401).end();
        }
        else{
            res.json(result[0]);
        }
    });
});

//-------------------- Create Cabinet --------------------// 

app.post("/manage/cabinet/create", function(req, res){
    sess = req.session;
    if(!sess.username) 
        return;

    var form = new formidable.IncomingForm();

    form.uploadDir = path.join(__dirname, "/images");
    

    form.parse(req, function(err, fields, files) {
        let image = files.image_field;
        let number = fields.txt_number;
        let desc_th = fields.txt_desc_th_cab;
        let desc_en = fields.txt_desc_en_cab;
        let newImageName = "";
        if(image !== undefined){
            newImageName = Date.now() + "_" + image.name; 
        }

        let sql = "INSERT INTO tb_cabinet(cab_number,cab_image,cab_en_detail, cab_th_detail) VALUES (?,?,?,?)";
        
        connection.query(sql, [number, newImageName, desc_en, desc_th], function(err, result, fields){
            if(err) {
                console.log(err.message);
                res.status(400).end();
                return;
            }
            let numrows = result.affectedRows;
            if(numrows != 1){
                res.status(401).end();
            }
            else{
                
                form.on('error', function (err) {
                    console.log('An error has occured: \n' + err);
                    res.status(404).send("Upload failed");
                });

                if(newImageName != ""){
                    fs.rename(image.path, path.join(form.uploadDir, newImageName), function(err) {
                        if(err) {
                            console.log('An error has occured: \n' + err);
                            res.status(404).send("Upload failed");
                        }
                    });
                    
                    res.send("/manage/cabinet");
                }
                else{
                    res.redirect("/manage/cabinet");
                }
            }
        });
    });
    
});

//-------------------- Update Cabinet By Id --------------------// 

app.post("/manage/cabinet/edit/:id", function(req, res){
    sess = req.session;
    if(!sess.username) 
        return;

    let cabId = req.params.id;
    var form = new formidable.IncomingForm();

    form.uploadDir = path.join(__dirname, "/images");
    

    form.parse(req, function(err, fields, files) {
        
        let image = files.image_field;
        let number = fields.txt_number;
        let desc_th = fields.txt_desc_th_cab;
        let desc_en = fields.txt_desc_en_cab;
        let image_old = fields.image_old;
        let image_field_old = fields.image_old_field;
        let cabStatus = fields.cab_active_flag
        let newImageName = "";
        if(image !== undefined){
            newImageName = Date.now() + "_" + image.name; 
        }
        else if(image_old == "yes"){ // ถ้าไม่ได้เปลี่ยนรูปใหม่ ให้ใช้รูปเก่า
            newImageName = image_field_old;
        }

        let sql = "UPDATE tb_cabinet SET cab_number=?,cab_image=?,cab_en_detail=?,cab_th_detail=?,cab_active_flag=? WHERE cab_id=?";
        
        connection.query(sql, [number, newImageName, desc_en, desc_th, cabStatus, cabId], function(err, result, fields){
            if(err) {
                console.log(err.message);
                res.status(400).end();
                return;
            }
            let numrows = result.affectedRows;
            if(numrows != 1){
                res.status(401).end();
            }
            else{
                
                form.on('error', function (err) {
                    console.log('An error has occured: \n' + err);
                    res.status(404).send("Upload failed");
                });

                if(newImageName != "" && image_old == "no"){
                    //ถ้ามีรูปภาพเก่า ให้ลบภาพเก่าก่อน
                    if(image_field_old != ""){
                        let imagePath = path.join(__dirname, "/images");
                        fs.unlink(path.join(imagePath, image_field_old), (err) => {
                            if (err) console.log(err.message);
                        });
                    }

                    fs.rename(image.path, path.join(form.uploadDir, newImageName), function(err) {
                        if(err) {
                            console.log('An error has occured: \n' + err);
                            res.status(404).send("Upload failed");
                        }
                    });
                    
                    res.send("/manage/cabinet");
                }
                else{
                    res.redirect("/manage/cabinet");
                }
            }
        });
    });
    
});

//-------------------- Delete Cabinet By Id --------------------// 

app.delete("/manage/cabinet/delete/:id", function(req, res){
    sess = req.session;
    if(!sess.username) 
        return;

    let cabId = req.params.id;
    let sql = "SELECT cab_image FROM tb_cabinet WHERE cab_id=?";
    connection.query(sql, [cabId], function(err, result, fields){
        if(err) {
            console.log(err.message);
            res.status(400).end();
            return;
        }
        
        let imageFile = result[0].cab_image;

        let sql = "DELETE FROM tb_cabinet WHERE cab_id=?";
        connection.query(sql, [cabId], function(err, result, fields){
            if(err) {
                console.log(err.message);
                res.status(400).end();
                return;
            }
            let numrows = result.affectedRows;
            if(numrows != 1){
                res.status(401).end();
            }
            else{
                let imagePath = path.join(__dirname, "/images");

                if(imageFile != ""){
                    fs.unlink(path.join(imagePath, imageFile), (err) => {
                        if (err) console.log(err.message);
                    });
                }
                
                res.send("Delete Success!");
            }
            
        });
    });
});

//===================== End Cabinet =====================//

//===================== Start Artifact =====================//

//-------------------- Show All Artifacts --------------------// 
app.get("/manage/artifact/all", function(req , res) {
    
    let sql = "SELECT ar_id,ar_number,ar_image,ar_th_name,ar_en_name, (SELECT type_th_name from tb_type WHERE type_id = t.type_id ) AS ar_type FROM tb_artifact t";
    connection.query(sql, function(err, result, fields){
        if(err){
            console.log(err.message);
            res.status(400).end();
            return;
        }

        if(result.length == 0){
            res.status(401).end();
        }
        else{
            res.json(result);
        }
    });
});


//-------------------- Get Artifact By Id ---------------------//
app.get("/manage/artifact/:artifact_id", function(req , res) {
    let arId = req.params.artifact_id;
    let sql = "SELECT ar_id,ar_number,ar_image,ar_th_name,ar_en_name, ar_th_detail, ar_en_detail, ar_year, cab_id, type_id, (SELECT cab_number from tb_cabinet WHERE cab_id = t.cab_id ) AS ar_cabinet, (SELECT type_th_name from tb_type WHERE type_id = t.type_id ) AS ar_type, (SELECT type_number from tb_type WHERE type_id = t.type_id ) AS ar_type_number, (SELECT type_en_name from tb_type WHERE type_id = t.type_id ) AS ar_type_en FROM tb_artifact t WHERE ar_id = ?";
    connection.query(sql, [arId], function(err, result, fields){
        if(err){
            console.log(err.message);
            res.status(400).end();
            return;
        }

        if(result.length == 0){
            res.status(401).end();
        }
        else{
            res.json(result[0]);
        }
    });
});

//-------------------- Add Artifacts --------------------// 
app.post("/manage/artifact/create", function(req , res) {
    sess = req.session;
    if(!sess.username) 
        return;

    var form = new formidable.IncomingForm();

    form.uploadDir = path.join(__dirname, "/images");
    

    form.parse(req, function(err, fields, files) {
        let image = files.image_field;
        let number = fields.txt_number;
        let desc_th = fields.txt_description_th;
        let desc_en = fields.txt_description_en;
        let name_th = fields.txt_name_th;
        let name_en = fields.txt_name_en;
        let year = fields.txt_year;
        let cabinet = fields.txt_cabinet;
        let type = fields.txt_type;
        
        let newImageName = "";
        if(image !== undefined){
            newImageName = Date.now() + "_" + image.name; 
        }

        let sql = "INSERT INTO tb_artifact(ar_number,ar_image,ar_th_name,ar_en_name,ar_th_detail,ar_en_detail,ar_year,cab_id,type_id) VALUES  (?,?,?,?,?,?,?,?,?)";
        connection.query(sql,[number,newImageName,name_th,name_en,desc_th,desc_en,year,cabinet,type], function(err, result, fields){
            if(err) {
                console.log(err.message);
                res.status(400).end();
                return;
            }

            let numrows = result.affectedRows;
            if(numrows != 1){
                res.status(401).end();
            }
            else{
                
                form.on('error', function (err) {
                    console.log('An error has occured: \n' + err);
                    res.status(404).send("Upload failed");
                });

                if(newImageName != ""){
                    fs.rename(image.path, path.join(form.uploadDir, newImageName), function(err) {
                        if(err) {
                            console.log('An error has occured: \n' + err);
                            res.status(404).send("Upload failed");
                        }
                    });
                    
                    res.send("/manage/artifact");
                }
                else{
                    res.redirect("/manage/artifact");
                }
            }
        });
    });
});
//-------------------- Update Artifacts by ID --------------------// 
app.post("/manage/artifact/update/:id", function(req , res) {
    sess = req.session;
    if(!sess.username) 
        return;

    let artifact_id = req.params.id;
    var form = new formidable.IncomingForm();

    form.uploadDir = path.join(__dirname, "/images");
    

    form.parse(req, function(err, fields, files) {
        let image = files.image_field;
        let number = fields.txt_number;
        let desc_th = fields.txt_description_th;
        let desc_en = fields.txt_description_en;
        let name_th = fields.txt_name_th;
        let name_en = fields.txt_name_en;
        let year = fields.txt_year;
        let cabinet = fields.txt_cabinet;
        let type = fields.txt_type;
        let image_old = fields.image_old;
        let image_field_old = fields.image_old_field;
        
        let newImageName = "";
        if(image !== undefined){
            newImageName = Date.now() + "_" + image.name; 
        }
        else if(image_old == "yes"){ // ถ้าไม่ได้เปลี่ยนรูปใหม่ ให้ใช้รูปเก่า
            newImageName = image_field_old;
        }

        let sql = "UPDATE tb_artifact SET  ar_number = ?, ar_image = ?, ar_th_name = ?, ar_en_name = ?, ar_th_detail = ?, ar_en_detail = ?, ar_year = ?, cab_id = ?, type_id = ? WHERE ar_id = ?";
        connection.query(sql,[number,newImageName,name_th,name_en,desc_th,desc_en,year,cabinet,type,artifact_id], function(err, result, fields){
            if(err) {
                console.log(err.message);
                res.status(400).end();
                return;
            }

            let numrows = result.affectedRows;
            if(numrows != 1){
                res.status(401).end();
            }
            else{
                
                form.on('error', function (err) {
                    console.log('An error has occured: \n' + err);
                    res.status(404).send("Upload failed");
                });

                if(newImageName != "" && image_old == "no"){
                    //ถ้ามีรูปภาพเก่า ให้ลบภาพเก่าก่อน
                    if(image_field_old != ""){
                        let imagePath = path.join(__dirname, "/images");
                        fs.unlink(path.join(imagePath, image_field_old), (err) => {
                            if (err) console.log(err.message);
                        });
                    }

                    fs.rename(image.path, path.join(form.uploadDir, newImageName), function(err) {
                        if(err) {
                            console.log('An error has occured: \n' + err);
                            res.status(404).send("Upload failed");
                        }
                    });
                    
                    res.send("/manage/artifact");
                }
                else{
                    res.redirect("/manage/artifact");
                }
            }
        });
    });
    
});
//-------------------- Delete Artifacts by ID ---------------------//

app.delete("/manage/artifact/delete/:id", function(req, res){
    sess = req.session;
    if(!sess.username) 
        return;

    let artifact_Id = req.params.id;
    let sql = "SELECT ar_image FROM tb_artifact WHERE ar_id=?";
    connection.query(sql, [artifact_Id], function(err, result, fields){
        if(err) {
            console.log(err.message);
            res.status(400).end();
            return;
        }
        
        let imageFile = result[0].ar_image;

        let sql = "DELETE FROM tb_artifact WHERE ar_id=?";
        connection.query(sql, [artifact_Id], function(err, result, fields){
            if(err) {
                console.log(err.message);
                res.status(400).end();
                return;
            }

            let numrows = result.affectedRows;
            if(numrows != 1){
                res.status(401).end();
            }
            else{
                let imagePath = path.join(__dirname, "/images");

                if(imageFile != ""){
                    fs.unlink(path.join(imagePath, imageFile), (err) => {
                        if (err) console.log(err.message);
                    });
                }
                
                res.send("Delete Success!");
            }
            
        });
    });
});

//===================== End Artifact =====================//

//===================== Start Type =====================//

//-------------------- Show All Type --------------------// 
app.get("/manage/type/all", function(req , res) {
    
    let sql = "SELECT * FROM tb_type";
    connection.query(sql, function(err, result, fields){
        if(err){
            console.log(err.message);
            res.status(400).end();
            return;
        }

        if(result.length == 0){
            res.status(401).end();
        }
        else{
            res.json(result);
        }
    });
});


//-------------------- Get Type By Id ---------------------//
app.get("/manage/type/:type_id", function(req , res) {
    let typeId = req.params.type_id;
    let sql = "SELECT * FROM tb_type WHERE type_id = ?";
    connection.query(sql, [typeId], function(err, result, fields){
        if(err){
            console.log(err.message);
            res.status(400).end();
            return;
        }

        if(result.length == 0){
            res.status(401).end();
        }
        else{
            res.json(result[0]);
        }
    });
});

//-------------------- Add Type --------------------// 
app.post("/manage/type/create", function(req , res) {
    sess = req.session;
    if(!sess.username) 
        return;

    let number =req.body.txt_number;
    let name_th = req.body.txt_name_th;
    let name_en = req.body.txt_name_en;

    let sql = "INSERT INTO tb_type(type_number, type_en_name, type_th_name) VALUES  (?,?,?);";
    connection.query(sql,[number,name_en,name_th], function(err, result, fields){
        if(err) {
            console.log(err.message);
            res.status(400).end();
            return;
        }

        res.redirect("/manage/type");
    });
});
//-------------------- Update Type by ID --------------------// 
app.post("/manage/type/update/:id", function(req , res) {
    sess = req.session;
    if(!sess.username) 
        return;

    let number =req.body.txt_number;
    let name_th = req.body.txt_name_th;
    let name_en = req.body.txt_name_en;
    let typeId = req.params.id;

    let sql = "UPDATE tb_type SET  type_number = ?, type_en_name = ?, type_th_name = ? WHERE type_id = ?";
    connection.query(sql,[number,name_en,name_th,typeId], function(err, result, fields){
        if(err) {
            console.log(err.message);
            res.status(400).end();
            return;
        }

        res.redirect("/manage/type");
    });
});
//-------------------- Delete Type by ID ---------------------//

app.delete("/manage/type/delete/:id", function(req, res){
    sess = req.session;
    if(!sess.username) 
        return;

    let typeId = req.params.id;
    let sql = "DELETE FROM tb_type WHERE type_id=?";
    connection.query(sql, [typeId], function(err, result, fields){
        if(err) {
            console.log(err.message);
            res.status(400).end();
            return;
        }

        let numrows = result.affectedRows;
        if(numrows != 1){
            res.status(401).end();
        }
        else{
            res.send("Delete Success!");
        }
        
    });
});

//===================== End Type =====================//

//------------------------------ Upload file Map ---------------------------
app.post("/manage/uploadFile", function (req, res) {
    sess = req.session;
    if(!sess.username) 
        return;

    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, "/images");

    form.on('file', function (field, file) {

        //rename old_name to new_name
        let newFilename = "map.jpg" ;     //file.name is the original upload filename

        fs.rename(file.path, path.join(form.uploadDir, newFilename), function(err) {
            if(err) {
                console.log('An error has occured: \n' + err);
                res.status(404).send("Upload failed");
            }
        });
    });

    // log any errors that occur
    form.on('error', function (err) {
        console.log('An error has occured: \n' + err);
        res.status(404).send("Upload failed");
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function () {
        res.send('Upload is successful');
        
    });

    // parse the incoming request containing the form data
    form.parse(req);
});

//------------------------------ Dashboard ---------------------------
app.get("/manage/count/:table", function(req, res){
    let table = req.params.table;
    let sql;
    if(table == "cabinet")
        sql = "SELECT COUNT(cab_id) AS count_cab FROM tb_cabinet";
    else if(table == "artifact")
        sql = "SELECT COUNT(ar_id) AS count_ar FROM tb_artifact";
    else if(table == "visitor")
        sql = "SELECT COUNT(visit_date_time) AS count_visitor FROM tb_visit_log";

    connection.query(sql, function(err, result, fields){
        if(err){
            console.log(err.message);
            res.status(400).end();
            return;
        }

        if(result.length == 0){
            res.status(401).end();
        }
        else{
            res.json(result[0]);
        }
    });
});

app.get("/manage/visitor/getYear", function(req, res){

    let sql = "SELECT DISTINCT YEAR(visit_date_time) as year FROM tb_visit_log ORDER BY year ASC";
    connection.query(sql, function(err, result, fields){
        if(err){
            console.log(err.message);
            res.status(400).end();
            return;
        }

        if(result.length == 0){
            res.status(401).end();
        }
        else{
            res.json(result);
        }
    });
});

app.get("/manage/visitor/getDay/:year", function(req, res){
    let year = req.params.year;
    let sql = "SELECT DISTINCT MONTH(visit_date_time) as month, (SELECT COUNT(visit_date_time) FROM tb_visit_log WHERE MONTH(visit_date_time) = MONTH(v.visit_date_time) and YEAR(visit_date_time) = YEAR(v.visit_date_time)) AS day FROM tb_visit_log v WHERE YEAR(visit_date_time) = ?";
    connection.query(sql, [year], function(err, result, fields){
        if(err){
            console.log(err.message);
            res.status(400).end();
            return;
        }

        if(result.length == 0){
            res.status(401).end();
        }
        else{
            res.json(result);
        }
    });
});

app.get("/visitor", function(req, res){

    let sql = "INSERT INTO tb_visit_log (visit_date_time) VALUES (CURRENT_TIMESTAMP)";
    connection.query(sql, function(err, result, fields){
        if(err){
            console.log(err.message);
            res.status(400).end();
            return;
        }

        if(result.length == 0){
            res.status(401).end();
        }
        else{
            let sql = "SELECT qr_url FROM tb_qrcode";
            connection.query(sql, function(err, result, fields){
                if(err){
                    console.log(err.message);
                    res.status(400).end();
                    return;
                }
        
                
                res.redirect(result[0].qr_url);
            });
        }
    });
});

app.get("/manage/getQR", function(req, res){
    let sql = "SELECT * FROM tb_qrcode";
    connection.query(sql, function(err, result, fields){
        if(err){
            console.log(err.message);
            res.status(400).end();
            return;
        }

        res.send(result[0]);
    });
});

app.post("/manage/updateQR", function(req, res){
    let url = req.body.url;
    let name = req.body.name;

    let sql = "UPDATE tb_qrcode SET qr_name = ?, qr_url = ? WHERE qr_id = 1";
    connection.query(sql, [name, url], function(err, result, fields){
        if(err){
            console.log(err.message);
            res.status(400).end();
            return;
        }

        res.send("Success");
    });
});


//-------------------- STARTING SERVER ---------------------//
const port = process.env.PORT || 8088;
app.listen(port, function(){
    console.log("Server is running at "+port);
});