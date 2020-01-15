import { socket } from "./socket";
import { PROTOCOL_SEND, PROTOCOL_RET } from "./protocal";
import { globleData } from "../globle/globle";
import { tonyInfo } from "../globle/tonyInfo";
import { errCode } from "../globle/errCode";
import { utils } from "../globle/utils";
import { eventManager } from "../globle/eventManager";

export class net {
    
    private static ince:net;
    public  m_lobbySocket:socket=null;
    public m_gameSocket:socket=null;
    public m_arenaSocket:socket=null;
    public m_curSocket:socket=null;
    private m_isRelogin=[];
    private m_reloginF=-1;
    private netIdList = {};

    public static instance(): net{
        if(this.ince == undefined){
            this.ince = new net();
        }
        return this.ince;
    }
    public connectToServer(_url:string,_socketType:string="Lobby")
    {
        if(_socketType=="Lobby")
        {
            if(!this.m_lobbySocket)
            {
                this.m_lobbySocket=new socket(_socketType);
                this.m_curSocket=this.m_lobbySocket;
                utils.instance().consoleLog("创建LobbySocket=======");
            }
            else
            {
                this.m_curSocket=this.m_lobbySocket;
            }
        }   
        // else if(_socketType=="arena"){
        //     if(!this.m_arenaSocket)
        //     {
        //         this.m_arenaSocket=new socket();
        //         this.m_curSocket=this.m_arenaSocket;
        //     }
        // }
        else
        {
            if(!this.m_gameSocket)
            {
                this.m_gameSocket=new socket(_socketType);
                this.m_curSocket=this.m_gameSocket;
                utils.instance().consoleLog("创建GameSocket=======");
            }
            else
            {
                this.m_curSocket=this.m_gameSocket;
            }
            
        }
        this.m_curSocket.connectToServer(_url);
        console.log("链接服务器======"+_socketType+"====="+_url)
    }
    public sendDataToServer(_protocalID:number=0,_data,_socketType:number=0)
    {
        //console.log("SendDataToServer======",_protocalID);
        let curSocket=null;
        if(_socketType==0)
        {
            curSocket=this.m_lobbySocket;
        }
        else if(_socketType==1)
        {
            curSocket=this.m_gameSocket;
        }
        // else if(_socketType==2)
        // {
        //     curSocket=this.m_arenaSocket;
        // }
        
        if(curSocket)
        {
            if(curSocket.m_isConnect)
            {
                curSocket.sendDataToServer(_data);
            }
            else
            {
               
            }
        }
        else
        {
            utils.instance().consoleLog("SocketIsNull");
        }
    }
    //获取OpneID
    private getMyOpenID() {
        
        let openId = localStorage.getItem("openId");
        if(openId == null)
        {
            return null
        }
        else{
            return openId
        }
    }
    //获取token
    public getToken(){
        let _token = localStorage.getItem("tokenId");
        if(_token == null)
        {
            return null
        }
        else{
            return _token
        }
    }
    //设置OpneID
    private setMyOpenID(openId:any) {
        
        if(openId && openId != "")
            localStorage.setItem("openId",openId.toString());
    }

    public getDataFromServer(_protocalID,_callBack, t)
    {
       
        if(t)
        {
            eventManager.on("DFS"+_protocalID,_callBack,t);
        }
        else
        {
            eventManager.on("DFS"+_protocalID,_callBack);
        }
       // cc.director.on("DFS="+_protocalID,_callBack:t);
        // if(t)
        // {
        //     cc.director.on("DFS="+_protocalID,_callBack:t);
          
        // }
        // else
        // {
        //     cc.director.on("DFS="+_protocalID,_callBack);
        // }
       
    }

    

   
    public offProtocal(_protocalID,callBack=null,target=null)
    {
        eventManager.off("DFS"+_protocalID);
    }
    public socketConnected(_socketType,_callBack)
    {
        eventManager.on("SC"+_socketType,_callBack);
       // cc.director.on("SC"+_socketType,_callBack);
    }
    public socketOff(_socketType)
    {
        eventManager.off("SC"+_socketType);
        //cc.director.off("SC"+_socketType);
    }
    public socketGameClosed()
    {
        if(this.m_gameSocket)
        {
            this.m_gameSocket.closeSocket()
        }
    }
    public socketLobbyClosed()
    {
        if(this.m_lobbySocket)
        {
            this.m_lobbySocket.closeSocket()
        }
    }
  
}