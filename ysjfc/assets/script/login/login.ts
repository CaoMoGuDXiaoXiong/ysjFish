import { utils } from "../globle/utils";
import { net } from "../net/net";
import { PROTOCOL_RET, PROTOCOL_SEND } from "../net/protocal";
import { sceneCtrl } from "../globle/sceneCtrl";
import { tonyInfo } from "../globle/tonyInfo";
import { preloadRes } from "../globle/preloadRes";
import { btnCtrl } from "../globle/btnCtrl";
import { eventEmit } from "../game/eventEmit";
import { soundManager } from "../globle/soundManager";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class login extends cc.Component {

    private _view: fgui.GComponent;
    private mPanel: fgui.GComponent;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        fgui.addLoadHandler();
        fgui.GRoot.create();
        fgui.UIPackage.loadPackage("fgui/login",this.onUILoaded.bind(this));


        
    }
    onUILoaded()
    {
        fgui.UIPackage.addPackage("fgui/login");
        this._view = fgui.UIPackage.createObject("login", "login").asCom;
        this._view.makeFullScreen();
       //this.mPanel = this._view.getChild("huodong").asCom;
        fgui.GRoot.inst.addChild(this._view);

        this.addListener();

    }
    start () {

       // preloadRes.instance().loadCommonHintBar();
        
        this.initUI();
    }
    addListener()
    {
        let btnStart=this._view.getChild("btnStart").asCom;
        btnStart.onClick(this.btnStartFunc,this);
        cc.director.on("test",(event)=>{
            let data=event.getUserData();
            console.log("测试Dat==",event,data);
        },this);
        this.onprotocal();
    }
    changeScene()
    {
        let btnStart=this._view.getChild("btnStart").asCom;
        btnStart.offClick(this.btnStartFunc,this);
    }
    initUI()
    {
        // let acctObj:cc.Node=cc.find("gameUI/acctIB");
        // let btnStart:cc.Node=cc.find("gameUI/btnStart");
    
        // acctObj.active=false;
        // let acct=localStorage.getItem("account");

        // if(acct)
        // {
        //     utils.instance().consoleLog("有账号");
        //     let tmpAcct=acctObj.getChildByName("acct");
        //     let acctLabel:cc.Label=tmpAcct.getComponent("cc.Label");
        //     acctLabel.string=""+acct;
        //     acctObj.active=true;
        //     tonyInfo.instance().m_loginState=1;
        //     tonyInfo.instance().m_playerUID=parseInt(acct);
        // }
        // else
        // {
        //     utils.instance().consoleLog("改变位置01====",btnStart.position);
        //     btnStart.y=btnStart.y+80;
        //     utils.instance().consoleLog("改变位置====",btnStart.position);
        // }

        soundManager.instance().playBg("shopView");
       
    }
    onprotocal()
    {
        
        let self=this;
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK100, self.registenCallBack, self);//玩家登陆返回
    //    cc.director.once("LoginSuccess",(data)=>{
    //     self.registenCallBack(data);
    //    });
    }
    offprotocal()
    {
        let self=this;
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK100,self.registenCallBack,self);
    }
    btnStartFunc(_data)
    {
    
      
       
        let tmpState=btnCtrl.instance().getBtnState();
        if(tmpState<=0)
        {
            return ;
        }
        let self=this;
        let isNewPlayer=localStorage.getItem("account");
        //isNewPlayer=null;
        if(isNewPlayer)
        {
            let userID=parseInt(localStorage.getItem("account"));
            let Sdata = {
                "action":PROTOCOL_SEND.MSGID_CTS_101LOGIN,
                "userID":userID
            }
            net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_101LOGIN,Sdata);
            utils.instance().consoleLog("玩家登录====101");
        }
        else
        {
            
            let Sdata = {
                "action":PROTOCOL_SEND.MSGID_CTS_100LOGIN,
            }
            net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_100LOGIN,Sdata);
            console.log("注册账号==");
        }
    }
    registenCallBack(event)
    {
        let self=this;
        let tmpData=event;
        let userID=tmpData.userID;
        let userMoney=tmpData.userMoney;
        let userDiamond=tmpData.userDiamond;
        let userVipLevel=tmpData.userVipLevel;
        let userVipExp=tmpData.userVipExp;
        let gameLevel=tmpData.gameLevel;
        let curGameLevelExp=tmpData.curGLExp;
        let name=tmpData.name;

        let tili=tmpData.tili;
        let act=tmpData.act;
        let actPoint=tmpData.actPoint;
        let actSpeed=tmpData.actSpeed;
        let actSpeedPoint=tmpData.actSpeedPoint;
        let angryPower=tmpData.angryPower;
        let hp=tmpData.hp;
        let hpPoint=tmpData.hpPoint;
        let leftPiont=tmpData.leftPoint;
        let nextLvExp=tmpData.nextLvExp;
        let defPoint=tmpData.defPoint;
        let def=tmpData.def;
       
        



        tonyInfo.instance().m_cannonID=tmpData.cannonID;
        tonyInfo.instance().m_playerUID=userID;
        tonyInfo.instance().m_playerMoney=userMoney;
        tonyInfo.instance().m_playerDiamond=userDiamond;
        tonyInfo.instance().m_gameLevel=gameLevel;
        tonyInfo.instance().m_curGameExp=curGameLevelExp;
        tonyInfo.instance().m_playerName=name;
        tonyInfo.instance().m_headIndex=tmpData.headID+1;

        tonyInfo.instance().m_hp=hp;
        tonyInfo.instance().m_hpPoint=hpPoint;
        tonyInfo.instance().m_actPoint=actPoint;
        tonyInfo.instance().m_actPower=act;
        tonyInfo.instance().m_tili=tili;
        tonyInfo.instance().m_actSpeed=actSpeed;
        tonyInfo.instance().m_actSpeedPoint=actSpeedPoint;
        tonyInfo.instance().m_defPoint=defPoint;
        tonyInfo.instance().m_def=def;

        tonyInfo.instance().m_angryPower=angryPower;
        tonyInfo.instance().m_leftPoint=leftPiont;
        tonyInfo.instance().m_nextLvExp=nextLvExp;

        localStorage.setItem("account",""+userID);

        utils.instance().consoleLog("玩家登录成功返回2000==",event,tonyInfo.instance().m_leftPoint);
        self.offprotocal();
        sceneCtrl.instance().changeScene(1);
    }

     update (dt) {
         btnCtrl.instance().loop(dt);
     }
}
