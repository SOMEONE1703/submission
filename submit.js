function send_file(){
    var fileInput = document.getElementById("fileInput");
    var resultElement = document.getElementById("result");
    resultElement.innerHTML = "";

    var file = fileInput.files[0];
    if (!file) {
        resultElement.innerHTML = "Please select a file.";
        return;
    }
    //now we post file
    let url="http://localhost:3002"
    fetch(url,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            choice:what,
            identity:id
        })
    }).then(res=>{
        if (res.ok){
            console.log("worked");
            return res.json();
        }
        else{
            console.log("did not work")
        }
    })
    .then(data=>{
        console.log(data);
        id=data.value;
        //console.log(id);
    })
    .catch(error=>console.error('ERROR',error))
    
}

function getRes(){
    let url="http://localhost:3002/results"
    fetch(url,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            id:"1",
            name:"adding"
        })
    }).then(res=>{
        if (res.ok){
            console.log("worked");
            return res.json();
        }
        else{
            console.log("did not work")
        }
    })
    .then(data=>{
        console.log(data);
        
    })
    .catch(error=>console.error('ERROR',error))
}

function sendFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert("Please select a file");
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    let url="http://localhost:3002/submit/1"
    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        console.log("squeeze:");
        console.log(data);
        console.log(":theorem");
        //document.getElementById('response').innerText = data;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('response').innerText = 'An error occurred';
    });
}

 