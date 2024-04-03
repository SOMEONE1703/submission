const express = require("express");
const multer = require('multer');

const path=require("path");
const app=express();
const fs=require('fs');

const form_data = require('form-data');
const PORT=3002;
var router = express.Router();

const upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname)));
app.use(express.json());

const { exec } = require('child_process');

const main_tests=[];

function test_case(code,input,expected_out){
    this.code=code;
    this.input=input;
    this.expected_out=expected_out;
    this.result='not-a-value';
    this.out;
    this.test=function(){
        //console.log("me?");
        exec(`${this.code} < ${input}`, (error, stdout, stderr) => {
            //console.log("starting");
            if (error) {
                this.result="exexution error";
                console.error(`execution error: ${error}`);
        
                return;
        
            }
            //console.log(`stdout: ${stdout}`);
            this.out=stdout;
            if (stdout==expected_out){
                //console.log("test reveals true");
                this.result=true;
                //console.log(this);
            }
            else{
                //console.log("test reveals false");
                this.result=false;
                //console.log(this);
            }
            //console.log("end");
        
        });
    }
}

function test(test_id,id){
    this.test_id=test_id;
    this.id=id;
    this.score=0;
    this.tests=[];
    this.code=`${id}.cpp`;
    this.compiled=false;
    this.compile=function(){
        exec(`g++ ${this.code} -o ${this.id}.exe`, (error, stdout, stderr) => {
            if (error) {
                
                console.error(`compile error: ${error}`);
                
                return;
        
            }
            //console.log("compiled");
            this.compiled=true;
        
            
        });
    }
    this.run_tests=function(){
        this.score++;
        for (let i=0;i<this.tests.length;i++){
            this.tests[i].test();
            //this.score+=(100/this.tests.length);
        }
    }
    
}

app.get('/',(request,response)=>{
    const filePath = path.join(__dirname, 'submit.html');
    response.sendFile(filePath);
});



app.post("/submit/:id",upload.single('file'),(request,response)=>{
    if (!request.file){
        response.status(400).send('No files uploaded');
        return;
    }
    let ID=request.params.id;
    let compiled=false;
    
    let filePath=request.file.path;
    var f=`${ID}.cpp`;
    var what;
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err}`);
            response.status(500).send('Error reading file');
            return;
        }

        //console.log(`File contents: ${data}`);
        //console.log(typeof data);
        what=data;
        
        fs.writeFile(f, data, (err) => {
            if (err) {
                console.error(`Error writing to file: ${err}`);
                return;
            }
        
            //console.log(`first write to ${f} successfully`);
        });
        
    });
    
    
    
    //now for the messed up part
    
    let test1=new test("adding",ID);
    test1.compile();
    
    main_tests.push(test1);
    
    response.status(200).send("all good");
    
    
});



app.post("/results",(request,response)=>{
    //console.log("called");
    let ID=request.body.id;
    let name=request.body.name;
    let index=-1;
    //console.log(main_tests);
    for (let i=0;i<main_tests.length;i++){
        if (main_tests[i].test_id==name&&main_tests[i].id==ID){
            index=i;
        }
    }
    if (index===-1){
        response.status(404).send("Test not found");
    }
    else{
        let n_tests=3;
        main_tests[index].tests.push(new test_case(`${ID}`,"tests/adding/1.txt",9));
        main_tests[index].tests.push(new test_case(`${ID}`,"tests/adding/2.txt",604));
        main_tests[index].tests.push(new test_case(`${ID}`,"tests/adding/3.txt",880));
        main_tests[index].run_tests();
        let arr=[];
        for (let i=0;i<n_tests;i++){
            //console.log(main_tests[index].tests[i]);
            //console.log(main_tests[index].tests[i]);
            if (main_tests[index].tests[i].result=="not-a-value"){}
            else if (main_tests[index].tests[i].result){
                arr.push("Passed");
            }
            else{
                arr.push("Failed");
            }
        }
        response.status(200).send({tests:arr,score:main_tests[index].score});
        
    }
});



app.post("/something",(request,response)=>{
    console.log("what");
    
    response.status(200).send("kulungile");
});

app.post("/",(request,response)=>{
    console.log(request.body);
    //plays.push(request.body.choice);
    
    response.status(200).send(request.body);
});

app.listen(PORT,()=>{console.log("we live on "+ PORT)});