import { tonyInfo } from "../globle/tonyInfo";
import { utils } from "../globle/utils";
import { eventManager } from "../globle/eventManager";

export class socket {
    
    private static ince:socket;
    private m_name:string="";
    private m_socket:WebSocket=null;
    public m_isConnect=false;
    private m_socketState=0;

    public constructor(_name:string="LobbySocket")
    {
        this.m_name=_name;
        
    }
    public connectToServer(_url:string)
    {
        let self=this;

        let strarr = _url.split(':')
        tonyInfo.instance().m_port = ":"+strarr[3]

        window.onbeforeunload = function(event) {  
            console.log('您正在刷新网页');  
            self.m_socket.close()
        };

        window.onunload = function(event) {  
            console.log('您正在关闭网页');  
            self.m_socket.close()
        }; 
        let creteNewSocket=0;
        if(this.m_isConnect==null||this.m_isConnect==false)
        {
            creteNewSocket=1;
        }

        if(!this.m_socket&&creteNewSocket==1)
        {
            this.m_socket=new WebSocket(_url);
            utils.instance().consoleLog("CreateNewSocket==========",_url);
        }
        else
        {
            utils.instance().consoleLog("socket重新连接==========","SC"+self.m_name);
           // cc.director.emit("SC"+self.m_name,"Test");
        }
        

        this.m_socket.onopen=function(event)
        {
            console.log("SocketOnOpen====",self.m_name,event);
            self.m_isConnect=true;
            self.m_socketState=1;
            eventManager.emit("SC"+self.m_name,event);
           // cc.director.emit("SC"+self.m_name,event);
           
        }
        this.m_socket.onmessage = function (event) {
            let jsonData=JSON.parse(event.data);
            let protocalID=jsonData.action;
            
           // utils.instance().consoleLog("m_socket______ msg: " + event.data);
            eventManager.emit("DFS"+protocalID,jsonData);
           // cc.director.emit("DFS="+protocalID,jsonData);
        } 

        this.m_socket.onclose = function (event) {
            self.m_isConnect=false;
            self.m_socketState=2;
            eventManager.emit("SocketClose"+self.m_name,null);
           // cc.director.emit("SocketClose",self.m_name);
            self.m_socket=null;
            console.log("SocketClose=====",self.m_name,event);
        }

        this.m_socket.onerror = function (event) {
            self.m_socketState=3;
            console.log("m_socket______ error");
        };

    }
    public sendDataToServer(_data)
    {
        let msg=JSON.stringify(_data);
      
       // console.log("测试====",_data);
        this.m_socket.send(msg);
    }
    public getSocketType()
    {
        return this.m_name;
    }

    public closeSocket(){
        if(this.m_socket){
            this.m_socket.close()
        }
    }

}