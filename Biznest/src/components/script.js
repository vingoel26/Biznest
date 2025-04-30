const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});
let username=["test"];
let email=["abc@gmail.com"];
let pw=["12345678"];
function reg(){
    var name=document.getElementById('name');
    var mail=document.getElementById('mail'); 
    var pass=document.getElementById('pass');  
    if(name.value == null || name.value == ""){
        alert("User Name can not be empty");
        return false;
    }
    else if(pass.value.length <8){
        alert("password need to be more than 7 charter long !");
    }
    else{
        alert("Registered! Please Login");
        username.push(name.value);
        email.push(mail.value);
        pw.push(pass.value);
    }
}
function log(){
    var name=document.getElementById('name1');
    var pass=document.getElementById('pass1');  
    if(name.value == null || name.value == ""){
        alert("User Name can not be empty");
        return false;
    }
    else if(pass.value.length <8){
        alert("password need to be more than 7 charter long !");
    }
    else if(username.indexOf(name.value) != -1 ){
        window.location.replace("/WDA-assignment/home-page/homepage.html");
    }
    else{
        alert("try again");
    }
}
