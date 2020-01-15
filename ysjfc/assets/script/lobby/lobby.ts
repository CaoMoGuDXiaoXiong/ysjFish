import { net } from "../net/net";
import { PROTOCOL_RET, PROTOCOL_SEND } from "../net/protocal";
import { utils } from "../globle/utils";
import { sceneCtrl } from "../globle/sceneCtrl";
import { tonyInfo } from "../globle/tonyInfo";
import { btnCtrl } from "../globle/btnCtrl";
import { preloadRes } from "../globle/preloadRes";
import { soundManager } from "../globle/soundManager";
import { mathUtils } from "../globle/mathUtils";
import { playerInfo } from "../ui/playerInfo";
import { gunInfo } from "../ui/gunInfo";
import { taskUI } from "../ui/taskUI";

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
export default class lobby extends cc.Component {

    private _view: fgui.GComponent;
    private mPanel: fgui.GComponent;
    private m_classicalPanel:fgui.GComponent=null;
    private m_userInfo:fgui.GComponent;
    
    private m_isAddPoint=0;
    private m_playerInfoPanel=null;
    @property(dragonBones.DragonBonesAsset)
    public m_dbAssets:Array<dragonBones.DragonBonesAsset>=[];
    @property(dragonBones.DragonBonesAtlasAsset)
    public m_dbAtlasAsset:Array<dragonBones.DragonBonesAtlasAsset>=[];

    onLoad () {

        fgui.addLoadHandler();
        fgui.GRoot.create();
        fgui.UIPackage.loadPackage("fgui/lobby",this.onUILoaded.bind(this));

        tonyInfo.instance().m_exit=0;
        
    }
    onUILoaded()
    {
        fgui.UIPackage.addPackage("fgui/lobby");
        this._view = fgui.UIPackage.createObject("lobby", "lobby").asCom;
        this._view.makeFullScreen();
      
        fgui.GRoot.inst.addChild(this._view);
       

        this.addListener();
        this.initUI();
    }

    start () {

    }
    addListener()
    {
        let room1=this._view.getChild("room1").asCom;
        room1.onClick(this.openRoom1,this);
        this.onprotocal();
    }
    onprotocal()
    {
        let self=this;
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK201, self.enterGameCallBack, self);//玩家登陆返回
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK213, self.changeHIFunc, self);//切换头像返回
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK214, self.changeNameFunc, self);//切换名字返回
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK215, self.bagInfoFCallBack, self);//背包

        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK300, self.enterSquareFunc, self);//进入广场
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK308, self.getNSTFunc, self);//获得未开始的任务
        
    }
    offprotocal()
    {
        let self=this;
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK201,self.enterGameCallBack,self);
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK213,self.changeHIFunc,self);
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK214,self.changeNameFunc,self);
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK215,self.bagInfoFCallBack,self);
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK300,self.enterSquareFunc,self);
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK308,self.getNSTFunc,self);
    }
    initUI()
    {
        soundManager.instance().playBg("lobby");
        let node = new cc.Node('Shayu');
        // node.scale = 0.6
        this._view.getChild("room1").asCom.getChild("ani").node.addChild(node);
        let armatureDisplay = node.addComponent(dragonBones.ArmatureDisplay);

        let shayu_ske= this.m_dbAssets[0];
        let shayu_tex= this.m_dbAtlasAsset[0];

        armatureDisplay.dragonAsset = shayu_ske;
        armatureDisplay.dragonAtlasAsset = shayu_tex;
        armatureDisplay.armatureName = 'Shayu';
        armatureDisplay.playAnimation('newAnimation', 0);

        let userInfo=this._view.getChild("userInfo").asCom;
        let name=userInfo.getChild("name").asTextField;
        name.text=tonyInfo.instance().m_playerName;

        let gameLevel=userInfo.getChild("level").asTextField;
        gameLevel.text="等级："+tonyInfo.instance().m_gameLevel;

        let money=this._view.getChild("money").asCom.getChild("num").asTextField;
        money.text=""+tonyInfo.instance().m_playerMoney;

        let diamond=this._view.getChild("diamond").asCom.getChild("num").asTextField;
        diamond.text=""+tonyInfo.instance().m_playerDiamond;

        //体力
        let tili=this._view.getChild("tili").asCom.getChild("num").asTextField;
        tili.text=""+tonyInfo.instance().m_tili;

        this.m_userInfo=userInfo;
        //头像开始
        let hiBtn=userInfo.getChild("btnHI").asButton
        hiBtn.onClick(()=>{
            let state=btnCtrl.instance().getBtnState();
            if(state<=0)
            {
                return ;
            }
            
           let playerInfo01=new playerInfo();
           playerInfo01.loadUIRes();
            

        },this);
        
       this.updatePlayerHI();
        //头像结束            
        //按钮Click事件开始--
        let bottomCom=this._view.getChild("bottom").asCom;
        let btnOption=bottomCom.getChild("btnOption").asButton;
        btnOption.onClick(this.btnCallBack,this);
        btnOption.customData=21;

        //背包按钮开始--
        let btnBag=bottomCom.getChild("btnBag").asButton;
        btnBag.onClick(this.btnCallBack,this);
        btnBag.customData=22;



        //背包按钮结束--
        //炮台开始--
        let gunCom=bottomCom.getChild("btnGun").asButton;
        gunCom.onClick(this.btnCallBack,this);
        gunCom.customData=23;
        //炮台结束--

        //任务按钮开始--

        let taskCom=bottomCom.getChild("btnTask").asCom;
        taskCom.onClick(this.btnCallBack,this);
        taskCom.customData=24;

        //任务按钮结束--

        //广场按钮开始--
        let squareBtn=this._view.getChild("room2").asButton;
        squareBtn.customData=2;
        squareBtn.onClick(this.btnCallBack,this);
        //广场按钮结束--
        //按钮Click事件结束--

        let item01="P100001-2";

        let tmpData01=mathUtils.instance().getAwardArr(item01);
        console.log('测试奖励01=======',tmpData01);
        
        let Sdata = {
            "action":PROTOCOL_SEND.MSGID_CTS_308GETNST
        }
        net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_308GETNST,Sdata);

    }
    getPlayerInfoFromServer()
    {
        let sData=
        {
            "action":PROTOCOL_SEND.MSGID_CTS_216GETPLAYERINFO
        }
        net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_216GETPLAYERINFO,sData);
    }
    
    
    openRoom1()
    {
        let state=btnCtrl.instance().getBtnState();
        
        if(state<=0)
        {
            return ;
        }
        fgui.UIPackage.loadPackage("fgui/classica",this.onUILoadedClassical.bind(this));

        
        console.log("打开静电场==");
    }
    onUILoadedClassical()
    {
        let self=this;
        fgui.UIPackage.addPackage("fgui/classica");
        this.m_classicalPanel = fgui.UIPackage.createObject("classica", "panel").asCom;
        this.m_classicalPanel.makeFullScreen();
      
        fgui.GRoot.inst.addChild(this.m_classicalPanel);

        let btnBack=this.m_classicalPanel.getChild("btnBack").asButton;
        
        btnBack.onClick(this.btnCallBack,this);
        btnBack.customData=1;

        //initClassical开始--
        let index=0;
        for(let i=0;i<4;i++)
        {
            index=i+1;
            let node = new cc.Node('room'+index);
            let roomBtn=this.m_classicalPanel.getChild("room"+index).asButton;
            let ani=roomBtn.getChild("ani").node.addChild(node);
            let armatureDisplay = node.addComponent(dragonBones.ArmatureDisplay);

            let shayu_ske= this.m_dbAssets[index];
            let shayu_tex= this.m_dbAtlasAsset[index];

            armatureDisplay.dragonAsset = shayu_ske;
            armatureDisplay.dragonAtlasAsset = shayu_tex;
            armatureDisplay.armatureName = 'classic_0'+index;
            armatureDisplay.playAnimation('act_classic_0'+index, 0);
            roomBtn.onClick(self.btnCallBack,self);
            roomBtn.customData=10+i;


        }
        //initClassical结束--

        

    }
    
    openBagUI()
    {
        let Sdata = {
            "action":PROTOCOL_SEND.MSGID_CTS_215GETBAGINFO
        }
        net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_215GETBAGINFO,Sdata);

    }
    openOptionUI()
    {
        let self=this;
        fgui.UIPackage.addPackage("fgui/common");
        let panel = fgui.UIPackage.createObject("common", "option").asCom;
        panel.makeFullScreen();
      
        fgui.GRoot.inst.addChild(panel);

        let com=panel.getChild("com").asCom;
        let btnClose=com.getChild("btnClose").asButton;
        btnClose.onClick(()=>{
            panel.dispose();
        },this);
        let musciSwitch=com.getChild("bgSwitch").asCom;

        let msBtnOpen=musciSwitch.getChild("btnOpen").asButton;

        let bgState=soundManager.instance().getBgState();
        let eftState=soundManager.instance().getEftState();

        if(bgState==1)
        {

        //     let bgState=parseInt(localStorage.getItem("bgState"));
        // let eftState=parseInt(localStorage.getItem("eftState"));
        }

        msBtnOpen.onClick(()=>{
            console.log("玩家开启背景音乐");
            soundManager.instance().resetBgState(0);
        },this);

        let msBtnClose=musciSwitch.getChild("btnClose").asButton;
        msBtnClose.onClick(()=>{
           soundManager.instance().resetBgState(1);
            console.log("玩家关闭背景音乐");
        },this);

        let eftSwitch=com.getChild("eftSwitch").asCom;

        let eftBtnOpen=eftSwitch.getChild("btnOpen").asButton;
        eftBtnOpen.onClick(()=>{
            soundManager.instance().resetEftState(0);
            console.log("玩家打开音效")
        },this);
        let eftBtnClose=eftSwitch.getChild("btnClose").asButton;

        eftBtnClose.onClick(()=>{
            soundManager.instance().resetEftState(1);
            console.log("玩家关闭音效")
        },this);


    }
    btnCallBack(_target)
    {
       
        let state=btnCtrl.instance().getBtnState();
        
        if(state<=0)
        {
            return ;
        }
        let target=_target.currentTarget;
        let self=this;

        let obj02=target.$gobj;
        let type=obj02.customData;
        if(type==1)//返回
        {
            this.m_classicalPanel.dispose();
            this.m_classicalPanel=null;
        }
        else if(type==2)//进入广场
        {

            let Sdata = {
                "action":PROTOCOL_SEND.MSGID_CTS_300ENTERSQUARE,
                "hallID":20
            }
            net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_300ENTERSQUARE,Sdata);
        }
        else if(type==10)//渔场1
        {
           // this.m_classicalPanel.dispose();
           // this.m_classicalPanel=null;
            //self.enterGameCallBack(null);
            
            let Sdata = {
                "action":PROTOCOL_SEND.MSGID_CTS_201LOGIN,
                "hallID":1
            }
            net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_201LOGIN,Sdata);
        }
        else if(type==21)//设置
        {
           this.openOptionUI();
            // fgui.UIPackage.loadPackage("fgui/common",this.openOptionUI.bind(this));

        }
        else if(type==22)//背包
        {   
            fgui.UIPackage.loadPackage("fgui/bag",this.openBagUI.bind(this));
        }
        else if(type==23)//炮台
        {
            
           let gunInfoUI=new gunInfo();
           gunInfoUI.initGunInfoUI();

        }
        else if(type==24)//任务
        {
            let taskUI01=new taskUI();
            taskUI01.initTaskUI();

           
        }
        console.log("大厅按钮========",type);
    }

    updatePlayerHI()
    {
        let hiBtn=this.m_userInfo.getChild("btnHI").asButton
        let headIcon=hiBtn.getChild("icon").asLoader;
        let hiIndex=tonyInfo.instance().m_headIndex;
        let hitex=preloadRes.instance().getHeadIconByIndex(hiIndex);
        headIcon.texture=hitex;
    }
    getNSTFunc(_event)
    {
        utils.instance().consoleLog("3008====未开始的任务=",_event);

        let taskArr=_event.taskArr;
       

        for(let i=0;i<taskArr.length;i++)
        {
            let id=taskArr[i].id;
            let td=taskArr[i].td;
            let index=taskArr[i].index;
            let state=taskArr[i].state;
            if(index>0)
            {
                tonyInfo.instance().m_taskIndex=index;
            }
            td=Math.floor(td/1000)-1;

           
            tonyInfo.instance().m_taskState=id;
            tonyInfo.instance().m_taskTD=td;
            tonyInfo.instance().m_taskName=preloadRes.instance().getTaskNameByID(id);
            if(state==2)//正在进行中的任务
            {
                let taskData=preloadRes.instance().getTaskByID(id);

                let pos=taskData.pos;

                let hallID=20+pos;

                let Sdata = {
                    "action":PROTOCOL_SEND.MSGID_CTS_201LOGIN,
                    "hallID":hallID,
                    "taskID":id
                }
                net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_201LOGIN,Sdata);
                break;
            }
        }
    }
    enterSquareFunc(_event)
    {

        let playerArr=_event.player;
        
        sceneCtrl.instance().changeScene(4);
        console.log("3000进入广场============",_event);
    }
    bagInfoFCallBack(_event)
    {
        console.log("玩家背包信息====2015====",_event);
        let itemArr=_event.item;
        let self=this;
        fgui.UIPackage.addPackage("fgui/bag");
        let panel = fgui.UIPackage.createObject("bag", "panel").asCom;
        panel.makeFullScreen();
      
        fgui.GRoot.inst.addChild(panel);

        let itemList=panel.getChild("itemList").asList;

        itemList.removeChildrenToPool();
       
        let rightPanel=panel.getChild("itemInfo").asCom;
        rightPanel.visible=false;

        //初始化玩家金币开始--

        let money=panel.getChild("money").asCom;
        let moneyTxt=money.getChild("num").asTextField;
        moneyTxt.text=""+tonyInfo.instance().m_playerMoney;

        let diamond=panel.getChild("diamond").asCom;

        let diamondTxt=diamond.getChild("num").asTextField;
        diamondTxt.text=""+tonyInfo.instance().m_playerDiamond;

        //返回按钮

        let btnBack=panel.getChild("btnBack").asButton;
        btnBack.onClick(()=>{
            panel.dispose();
        },this);

        //初始化玩家金币结束--
        let changeItemInfo=(_id)=>{
            let data=preloadRes.instance().getPropDataByID(_id);
            let name=data.name;
            let desc=data.desc;
            let itemIcon01=rightPanel.getChild("icon").asLoader;
            let tmpTexture=preloadRes.instance().getPropIconByID(_id);
            itemIcon01.texture=tmpTexture;
            let rightName=rightPanel.getChild("name").asTextField;
            rightName.text=""+name;
            let txtDesc=rightPanel.getChild("des").asTextField;
            txtDesc.text=""+desc;
            console.log("BagBuffer=====",data.isBubble);
            if(data.isBubble!=null)
            {
                rightPanel.getChild("bubble").visible=false;
            }
            else
            {
                rightPanel.getChild("bubble").visible=true;
            }
        };
       // let itemID=[100001,100003,100004,100005,100007,100008,200011,200012,200001,200002,200015,100016,100015];
       let len=itemArr.length;
        for(let i=0;i<len;i++)
        {
            itemList.addItemFromPool();
            let item=<any>itemList.getChildAt(i);
          
            let itemIcon=item.getChild("icon1").asLoader;
            let texNum=item.getChild("txt_num").asTextField;
            let id=itemArr[i].id;
            let num=itemArr[i].num;

            texNum.text="海龟之魂X1";
            itemIcon.texture=preloadRes.instance().getPropIconByID(id);
            let data=preloadRes.instance().getPropDataByID(id);
            let name=data.name;
            let desc=data.desc;
            texNum.text=""+name+"X"+num;
            if(data.isBubble!=null)
            {
                item.getChild("bubble").visible=false;
            }
            if(i==0)
            {
                item.selected=true;
                rightPanel.visible=true;
                
                changeItemInfo(id);
                
        
            }
            item.customData=id;
            item.onClick((_target)=>{
                

                let target=_target.currentTarget;
                let self=this;

                let obj02=target.$gobj;
                let type=obj02.customData;
                changeItemInfo(type);
                console.log("测试按钮Type=======",type);
            },this);
            
            console.log("当前道具数据======",data);
        
            
        }
    }
    changeNameFunc(_event)
    {
        let name=_event.name;

        tonyInfo.instance().m_playerName=name;

        tonyInfo.instance().showTopTips("恭喜您，昵称修改成功");
        let nameTxt=this.m_userInfo.getChild("name").asTextField;
        nameTxt.text=name;

        utils.instance().consoleLog("玩家切换名字===2014==",_event);
    }
    changeHIFunc(_event)
    {
        let hiIndex=_event.hiIndex;

        tonyInfo.instance().m_headIndex=hiIndex+1;
        this.updatePlayerHI();

        console.log("玩家切换头像=====2013",_event);
    }
    enterGameCallBack(event)
    {
        // let tmpData=event;
        // let userID=tmpData.userID;
        // let userMoney=tmpData.userMoney;
        // let userDiamond=tmpData.userDiamond;
        // let roomID=tmpData.roomID;
        tonyInfo.instance().m_curGameRoomID=1;
        tonyInfo.instance().m_gameRoomID=event.roomID;
        tonyInfo.instance().m_myServerSeat=event.seatID;

        utils.instance().consoleLog('进入游戏==2001',event);
        this.offprotocal();
        sceneCtrl.instance().changeScene(2);
        
    }
    
     update (dt) {
         let btnLeftTime=tonyInfo.instance().m_btnClickInterval;

         if(btnLeftTime>0)
         {
             btnLeftTime-=dt;
             
             tonyInfo.instance().m_btnClickInterval=btnLeftTime;

         }
         btnCtrl.instance().loop(dt);


     }
}
