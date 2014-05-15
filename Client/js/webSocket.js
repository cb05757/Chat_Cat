
    var username;
    var roomName;
    var roomChoice;

        var ws = new WebSocket("ws://localhost:8080","echo-protocol");
       
        var connectionString;

        ws.onopen = function(){ 
            // send client to their chatroom
            // check to see if username is already in use  
                var locate = window.location
                document.forms[0].url.value = locate

                var text = document.forms[0].url.value

                roomChoice = delineateRoomChoice(text);
                username = delineateUserName(text);
                roomName = delineateRoomName(text);


            if(roomName !=""){
                 connectionString = username + ":" + roomName;
            } else{
                 connectionString = username + ":" + roomChoice;
            }
           

            ws.send("cmd:" + connectionString); // send string to server with username and chatroom on connect
            ws.send("msg:" + username +" " + "joined the chatroom");
        };

        ws.onmessage = function(message){ 

            var recievedMSG = message.data;

            switch(recievedMSG.substring(0, recievedMSG.indexOf(":"))){
                case "cmd":
                        if(recievedMSG.substring(4,recievedMSG.length) == "username"){
                            alert("The username " + username + " is already in use please choose another.");

                            closeConnection();
                            self.location="index.html";
                        }
                break;
                case "msg":
                    document.getElementById("recievedMSG").textContent += message.data.substring(4,message.length) + "\n";
                    scrollToBottom();
                break;
                case "data":
                    writeToPaint(message.data);
                break;
                    
                default:
            }
        };
        

        ws.onclose = function(){

        };

        function sendToServer(){
            if(document.getElementById("sentMSG").value != ""){
                ws.send("msg:" + username +": " + document.getElementById("sentMSG").value);
                document.getElementById("sentMSG").value = "";
                document.getElementById("sentMSG").focus();
            }

        }

        function sendToServerPaint(){ /* Sends the canvas data to the server */
            
            var c=document.getElementById("myCanvas");
            var ctx=c.getContext("2d");

            var canvas = document.getElementById("myCanvas");
            var b64png = canvas.toDataURL();

            ws.send(b64png);
            ctx.clearRect(0, 0, c.width, c.height);

            
        }

        function writeToPaint(url){

            var myCanvas = document.getElementById('myCanvas');
            var ctx = myCanvas.getContext('2d');
            var img = new Image;
            img.onload = function(){
              ctx.drawImage(img,0,0);
            };
            img.src = url;
        }

        function closeConnection(){
            ws.close();
        }


//------------------------------------------------------------------------------------------------------------------
        function delineateRoomChoice(str){
            theleft = str.indexOf("=") + 1;
            theright = str.indexOf("&");
            return(str.substring(theleft, theright));
        }

        function delineateUserName(str){
            point = str.lastIndexOf("=");
            return(str.substring(point+1,str.length));
        }

        function delineateRoomName(str){
            theleft = str.indexOf("=",str.indexOf("=") + 1) + 1;
            theright = str.lastIndexOf("&");
            return(str.substring(theleft, theright));
        }

        function pageLoaded(){ 

        }

        function delineate(){   
            if(roomName !=""){
                document.write("Chatroom: " + roomName + "<br>");  
            } else{
                document.write("Chatroom: "+ roomChoice + "<br>");
            }
            if(username !=""){
                document.write("Username: " + username);
            }
        }

        function scrollToBottom() {
            var textarea = document.getElementById('recievedMSG');
            textarea.scrollTop = textarea.scrollHeight;
        }

