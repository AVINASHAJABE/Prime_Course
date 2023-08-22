var express=require("express");
var bodyparser=require("body-parser");
var mysql=require("mysql");
var util=require("util");

var conn=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"node_second"
});
var exe=util.promisify(conn.query).bind(conn);

var app=express();
app.use(bodyparser.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.render("home.ejs");
});
app.post("/save_bill",async function(req,res)
{ 
    // await exe(`CREATE TABLE bill (bill_id INT PRIMARY KEY 
    // AUTO_INCREMENT,bill_date VARCHAR(20),customer_name VARCHAR(200))`);
    var d=req.body;
    // await exe(`INSERT INTO bill (bill_date,customer_name) VALUES
    // ('${d.bill_date}','${d.customer_name}')`);
    
    // exe(`CREATE TABLE bill_products (bill_products_id INT 
    //     PRIMARY KEY AUTO_INCREMENT,bill_id INT,product_name VARCHAR(200),
    //     product_price INT, product_qty INT,product_total INT)`);

     var bill=await exe(`INSERT INTO bill (bill_date,customer_name) VALUES
     ('${d.bill_date}','${d.customer_name}')`);
     var bill_id=bill.insertId;

    for(var i=0;i<d.product_name.length;i++)
    {
        var sql=`INSERT INTO bill_products(bill_id,product_name,
            product_price,product_qty,product_total) VALUES ('${bill_id}',
            '${d.product_name[i]}','${d.product_price[i]}','${d.product_qty[i]}',
            '${d.product_total[i]}')`;
            // console.log(sql);
            await exe(sql);

    }
       res.send("Bill Created Successfully");
});

app.get("/bill_list",async function(req,res)
{
    var data=await exe (`SELECT * ,SUM(product_total) as ttl FROM
     bill,bill_products WHERE bill.bill_id = bill_products.bill_id
     GROUP BY bill.bill_id`);
    var obj={"bill":data};
    
    res.render("bill_list.ejs",obj);
})
app.listen(3000);