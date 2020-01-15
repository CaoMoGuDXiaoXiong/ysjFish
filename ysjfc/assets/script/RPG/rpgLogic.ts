import { preloadRes } from "../globle/preloadRes";
import { roleManager } from "./roleManager";
import { btnCtrl } from "../globle/btnCtrl";
import { utils } from "../globle/utils";
import { playerInfo } from "../ui/playerInfo";
import { tonyInfo } from "../globle/tonyInfo";
import { PROTOCOL_RET, PROTOCOL_SEND } from "../net/protocal";
import { net } from "../net/net";
import { soundManager } from "../globle/soundManager";
import { eventManager } from "../globle/eventManager";
import { sceneCtrl } from "../globle/sceneCtrl";
import { gunInfo } from "../ui/gunInfo";
import { taskUI } from "../ui/taskUI";
import { popLayer } from "../ui/popLayer";

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
export default class rpgLogic extends cc.Component {
    private m_isTouch=false;
    private m_leftLimit=0;
    private m_rightLimit=1340;//784
    private m_bottomLimit=320;
    private m_topLimit=420;
    private m_startV=700;
    private m_startH=586;
    private m_selfRole=null;
    private m_roleScirpt=null;
    private m_chatPanel:fgui.GComponent=null;
    private m_chatList:fgui.GList=null;
    private m_userInfo:fgui.GComponent;
    private m_taskPanel:fgui.GComponent=null;
    private m_camera:cc.Node=null;
    private m_curChatChannel=0;
    private m_wordChannel:fgui.GList=null;
    private m_otherChannel:fgui.GList=null;
    private m_listType:fgui.GList=null;//队伍 世界
    private m_rpCom:fgui.GComponent=null;
    private m_chatUIState=1;
    private m_rpCount=0;
    private m_taskPanelIndex=0;
    private m_updateSecond=1;
    private m_worldMsgArr={};
    private m_channelMsgArr02={};
    private m_wmIndex=0;
    private m_curChannelIndex=0;
    private m_testUID=1000;
    private m_chatPrefabArr=[];
    private m_otherRoleArr={};
    private m_newPlayrArr={};
    private m_taskPanelArr={};
    @property(cc.Prefab)
    public m_chatPrefab:cc.Prefab=null;
    onLoad () {

        let self=this;
        fgui.addLoadHandler();
        fgui.GRoot.create();
        let rolePrefa=preloadRes.instance().m_rolePrefab;

        roleManager.instance().initFishManager(rolePrefa);
        this.loadPackageUI();
        this.addListener();
        tonyInfo.instance().m_exit=0;
        eventManager.on("exitSquare",(data)=>{
            console.log("碰撞检查，我要出去======",data);
            
            if(tonyInfo.instance().m_taskState<=0)
            {
                if(data==1&&tonyInfo.instance().m_exit==0)
                {
                    tonyInfo.instance().m_exit=1;
                    let sData=
                    {
                        "action":PROTOCOL_SEND.MSGID_CTS_310EXITSQUARE
                    }
                    net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_310EXITSQUARE,sData);
                    sceneCtrl.instance().changeScene(1);
                }
            }
            else
            {
                if(tonyInfo.instance().m_exit==0)
                {
                    tonyInfo.instance().m_exit=1;
                    self.taskConfirm();
                    console.log("准备开始任务=====");
                }
            }
            
        });
       
        
    }

    start () {
        let self=this;
        let camera=cc.find("Canvas/Main Camera");
        soundManager.instance().playBg("sqareBg");
        this.m_topLimit=420-(cc.winSize.height-640);
        this.m_bottomLimit=cc.winSize.height/2;
        this.m_startV=650-(cc.winSize.height-640)/2;
        this.m_rightLimit=1340-(cc.winSize.width-1136)/2;
        this.m_startH=cc.winSize.width/2;
        console.log("测试winSize====",this.m_topLimit,cc.winSize);
        camera.x=528;
        camera.y=192;
        // camera.x=this.m_leftLimit;
        // camera.y=this.m_topLimit;
        self.m_camera=camera;
        this.touchCtrlFunc();
        
        // this.scheduleOnce(()=>{
        //     self.createRoleFunc();
        // },2);
        
        let sData=
        {
            "action":PROTOCOL_SEND.MSGID_CTS_301GETPINFO
        }
        net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_301GETPINFO,sData);

    }
    
    addListener()
    {
     
        this.onprotocal();
    }
    onprotocal()
    {
        let self=this;

        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK213, self.changeHIFunc, self);//切换头像返回
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK214, self.changeNameFunc, self);//切换名字返回
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK215, self.bagInfoFCallBack, self);//背包

        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK301, self.initAllPlayerFunc, self);//玩家登陆返回
       
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK302, self.playerMoveFunc, self);//玩家登陆返回
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK303, self.userLevelFunc, self);//玩家离开广场
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK304, self.newPlayerEnter, self);//获得新玩家信息
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK305, self.worldMsgFunc, self);//世界聊天信息

        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK306, self.getTaskFunc, self);//领取任务返回
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK307, self.giveUpTaskFunc, self);//放弃任务
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK308, self.getNSTFunc, self);//获得未开始的任务
        
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK201, self.enterGameCallBack, self);//玩家进入游戏
    }
    offprotocal()
    {
        let self=this;
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK213,self.changeHIFunc,self);
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK214,self.changeNameFunc,self);
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK215,self.bagInfoFCallBack,self);
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK301,self.initAllPlayerFunc,self);
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK302,self.playerMoveFunc,self);
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK303,self.userLevelFunc,self);
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK304,self.newPlayerEnter,self);
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK305,self.worldMsgFunc,self);
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK306,self.getTaskFunc,self);
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK307,self.giveUpTaskFunc,self);
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK308,self.getNSTFunc,self);
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK201,self.enterGameCallBack,self);
      
    }
    exitSquire()
    {
        this.offprotocal();
    }
    taskConfirm()
    {
        let taskPopLayer=new popLayer();

        taskPopLayer.initUI(1,"确认任务","再想想","开始任务",tonyInfo.instance().m_taskName);
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
    createRoleFunc(_uid,_posX,_posY,_roleID,_name,_title,_isSelf:number=0)
    {
        let self=this;
        let uid=_uid;
        let roleID=_roleID;
        let posX=_posX;
        let posY=_posY;
        if(_isSelf==1)
        {
            self.m_selfRole=roleManager.instance().createRole(uid,roleID,_name,_title,posX,posY);
            let roleScript=self.m_selfRole.getComponent("role");
            this.m_roleScirpt=roleScript;
        }
        else
        {
          let tmpRole=roleManager.instance().createRole(uid,roleID,_name,_title,posX,posY);
          this.m_otherRoleArr[_uid]=tmpRole;
        }
        

        

    }
    touchCtrlFunc()
    {
        let self=this;
        this.node.on(cc.Node.EventType.TOUCH_END,(msg)=>{
            self.m_isTouch=false;
            let touchPoint=msg.touch.getLocation();
        
        });
        this.node.on(cc.Node.EventType.TOUCH_START,(msg)=>{
            self.m_isTouch=true;
            let touchPoint=msg.touch.getLocation();
            self.roleMove(touchPoint);
            let cameraX=this.m_camera.x;
            let cameraY=this.m_camera.y;
           // console.log("touchBegan====",touchPoint,cameraX,cameraY);
           
           // fishManager.instance().getSelectFishID(touchPoint);
        })
        this.node.on(cc.Node.EventType.TOUCH_MOVE,(msg)=>{
            let touchPoint=msg.touch.getLocation();
            self.m_isTouch=true;
            self.roleMove(touchPoint);
           // console.log("touchMove====",touchPoint);
            
        })
    }
    loadPackageUI()
    {
        fgui.UIPackage.loadPackage("fgui/square",this.initUI.bind(this));
    }

    initUI()
    {
        let self=this;
        fgui.UIPackage.addPackage("fgui/square");
        let panel = fgui.UIPackage.createObject("square", "panel").asCom;
        panel.makeFullScreen();
      
        fgui.GRoot.inst.addChild(panel);

        this.m_chatPanel=panel;
        //let chatList=panel.getChild("").
        //打开玩家聊天UI按钮
        let btnMsg=panel.getChild("btnMsg").asButton;
        btnMsg.customData=10;
        btnMsg.onClick(this.btnCallBack,this);

        let chatPanel=panel.getChild("panel").asCom;

        let btnBackMsg=chatPanel.getChild("btnBack").asButton;
        btnBackMsg.customData=11;
        btnBackMsg.onClick(this.btnCallBack,this);

        //发送按钮

        let btnSend=chatPanel.getChild("btnSend").asButton;
        btnSend.customData=12;
        btnSend.onClick(this.btnCallBack,this);

        //初始化List
        let tmpList0=chatPanel.getChild("list0").asList;
        tmpList0.removeChildrenToPool();

        let tmpList1=chatPanel.getChild("list1").asList;
        tmpList1.removeChildrenToPool();
        this.m_wordChannel=tmpList0;
        this.m_otherChannel=tmpList1;
        tmpList1.visible=false;

        let listType=chatPanel.getChild("listType").asList;
        this.m_listType=listType;

        listType.removeChildrenToPool();
        let titleArr=["世界","队伍"];
        for(let i=0;i<2;i++)
        {
            listType.addItemFromPool();
            let item=<any>listType.getChildAt(i);
            item.customData=20+i;
            item.onClick(this.btnCallBack,this);
            if(i==0)
            {
                item.selected=true;
            }
            let num=item.getChild("title").asTextField;
            num.text=""+titleArr[i];
            item.getChild("red").visible=false;

        }
        //世界聊天红点
        let redPoint=btnMsg.getChild("rp").asCom;
        this.m_rpCom=redPoint;
        this.updateRP();
        

        this.chatUIAct(1);
        this.initTopUI();
        this.m_taskPanel=panel.getChild("taskPanel").asCom;
        let tmpTaskList=this.m_taskPanel.getChild("taskList").asList;
        tmpTaskList.removeChildrenToPool();
        this.m_taskPanel.x=-200;
       
        let Sdata = {
            "action":PROTOCOL_SEND.MSGID_CTS_308GETNST
        }
        net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_308GETNST,Sdata);
        
    }
    
    addItemToTaskPanel(_id,_taskID,_td)
    {
        let self=this;
        let list=this.m_taskPanel.getChild("taskList").asList;

        if(_taskID<=0)
        {
            list.removeChildrenToPool();
            return ;
        }
        

        let item=<any>list.addItemFromPool();
        let name=item.getChild("name").asTextField;
        let taskName=preloadRes.instance().getTaskNameByID(_taskID);
        name.text=""+taskName;

        let tdTxt=item.getChild("td").asTextField;
        let str=utils.instance().second3Time(_td);
        tdTxt.text=""+str;
        // this.schedule(()=>{
        //     timeN--;
        //     let str=utils.instance().second3Time(timeN);
        //     tdTxt.text=""+str;
        // },1,_td,0);

        let btnStart=item.getChild("btnStart").asButton;
        btnStart.onClick(()=>{
            let cameraX=this.m_camera.x;
            let cameraY=this.m_camera.y;
            let point=new cc.Vec2(115-cameraX,788-cameraY);
            self.roleMove(point);
        },this);
        if(!this.m_taskPanelArr[_id])
        {
            this.m_taskPanelArr[_id]=[];
            this.m_taskPanelArr[_id].taskID=_taskID;
            this.m_taskPanelArr[_id].td=_td;
            this.m_taskPanelArr[_id].tdTxt=tdTxt;
        }
        else
        {
            this.m_taskPanelArr[_id].taskID=_taskID;
            this.m_taskPanelArr[_id].td=_td;
            this.m_taskPanelArr[_id].tdTxt=tdTxt;
        }


        

    }
    showTaskPanel(_type:number=0,_type02:number=0)
    {
        if(this.m_taskPanel)
        {
            this.m_taskPanel.node.stopAllActions();
        }
        if(_type>0)
        {
            if(this.m_taskPanelIndex<=0)
            {
                this.m_taskPanelIndex=1;
                let act=cc.moveBy(0.2,200,0);

                let callBack=cc.callFunc(()=>{
                    
                },this);
                let seq=cc.sequence(act,callBack);

                this.m_taskPanel.node.runAction(seq);
            }
            
        }
        else if(_type02==1)
        {
            if( this.m_taskPanelIndex>0)
            {
                this.m_taskPanelIndex=0;
                let act=cc.moveBy(0.2,-200,0);
                let callBack=cc.callFunc(()=>{
                
                },this);
                let seq=cc.sequence(act,callBack);
                this.m_taskPanel.node.runAction(seq);
            }
        }
    }
    initTopUI()
    {
        
        let topCom=this.m_chatPanel.getChild("topCom").asCom;
        let userInfo=topCom.getChild("userInfo").asCom;
        let name=userInfo.getChild("name").asTextField;
        name.text=tonyInfo.instance().m_playerName;

        let gameLevel=userInfo.getChild("level").asTextField;
        gameLevel.text="等级："+tonyInfo.instance().m_gameLevel;

        let money=topCom.getChild("money").asCom.getChild("num").asTextField;
        money.text=""+tonyInfo.instance().m_playerMoney;

        let diamond=topCom.getChild("diamond").asCom.getChild("num").asTextField;
        diamond.text=""+tonyInfo.instance().m_playerDiamond;

        //体力
        let tili=topCom.getChild("tili").asCom.getChild("num").asTextField;
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

        let bottomCom=this.m_chatPanel.getChild("bottom").asCom;
        
        let btnOption=bottomCom.getChild("btnOption").asButton;
        btnOption.customData=30;
        btnOption.onClick(this.btnCallBack,this);

        let btnBag=bottomCom.getChild("btnBag").asButton;
        btnBag.customData=31;
        btnBag.onClick(this.btnCallBack,this);
        let btnRank=bottomCom.getChild("btnRank").asButton;
        btnRank.customData=32;
        btnRank.onClick(this.btnCallBack,this);
        let btnTask=bottomCom.getChild("btnTask").asButton;
        btnTask.onClick(this.btnCallBack,this);
        btnTask.customData=33;

        let btnGun=bottomCom.getChild("btnGun").asCom;
        btnGun.customData=34;
        btnGun.onClick(this.btnCallBack,this);
        

        

    }
    updatePlayerHI()
    {
        let hiBtn=this.m_userInfo.getChild("btnHI").asButton
        let headIcon=hiBtn.getChild("icon").asLoader;
        let hiIndex=tonyInfo.instance().m_headIndex;
        let hitex=preloadRes.instance().getHeadIconByIndex(hiIndex);
        headIcon.texture=hitex;
    }
    updateRP()
    {
        if(this.m_rpCount>0)
        {
            this.m_rpCom.visible=true;
            let num=this.m_rpCom.getChild("num").asTextField;
            num.text=""+this.m_rpCount;
        }
        else
        {
            this.m_rpCom.visible=false;
        }
    }
    chatUIAct(_type:number=0)
    {
        let chatPanel=this.m_chatPanel.getChild("panel").asCom;

        let offsetX=-500;

        if(_type==0)
        {
            offsetX=500;
        }
        else if(_type==1)
        {
            offsetX=-500;
        }
        let act=cc.moveBy(0.2,offsetX,0);
        let callBack=cc.callFunc(()=>{

        });
        let seq=cc.sequence(act,callBack);

        chatPanel.node.runAction(seq);
    }
    private testInex=0;
    btnCallBack(_target)
    {
        let target=_target.currentTarget;
        let self=this;

        let obj02=target.$gobj;
        let type=obj02.customData;
        let state=btnCtrl.instance().getBtnState();
        let type02=0;
        if(type>=20||type<=30)
        {
            type02=1;
        }
        if(state<=0&&type02==0)
        {
            return ;
        }
        

        if(type==10)//打开玩家聊天UI
        {
            this.chatUIAct();
            this.m_chatUIState=0;
            this.m_rpCount=0;
            this.updateRP();
        }
        else if(type==11)//关闭聊天UI
        {
            this.chatUIAct(1);
            this.m_chatUIState=1;
        }
        else if(type==12)//发送聊天信息
        {
            this.sendMsgToChannel();
        }
        else if(type==20)//世界聊天频道
        {
            this.m_curChatChannel=0;
            obj02.selected=true;
            this.m_wordChannel.visible=true;
            this.m_otherChannel.visible=false;
            this.resetListTypeRedPoint(0,this.m_curChatChannel);
            
        }
        else if(type==21)//队伍聊天频道
        {
            this.m_curChatChannel=1;
            obj02.selected=true;
            this.m_wordChannel.visible=false;
            this.m_otherChannel.visible=true;
            this.resetListTypeRedPoint(0,this.m_curChatChannel);

        }
        else if(type==30)//设置
        {
            //this.openOptionUI();
            let state=0;
            let state02=1;
            this.testInex++;
            if(this.testInex%2==0)
            {
                state=1;
                state02=0;
            }
            this.showTaskPanel(state,state02);
        }
        else if(type==31)//背包
        {
            fgui.UIPackage.loadPackage("fgui/bag",this.openBagUI.bind(this));
        }
        else if(type==32)//排行
        {

        }
        else if(type==33)//任务
        {
            
            let taskUI01=new taskUI();
            taskUI01.initTaskUI();
        }
        else if(type==34)//炮台信息
        {
            let gunInfoUI=new gunInfo();
            gunInfoUI.initGunInfoUI();
        }
       // utils.instance().consoleLog("RPGLogic====Btn==",type);
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
    resetListTypeRedPoint(_type:number=0,_channelID)
    {
        let item=<any>this.m_listType.getChildAt(_channelID);
        if(_type==0)
        {
            item.getChild("red").visible=false;    
        }
        else
        {
            item.getChild("red").visible=true;    
        }
        
    }
    sendMsgToChannel()
    {
        let chatPanel=this.m_chatPanel.getChild("panel").asCom;
        let txt=chatPanel.getChild("msg").asTextField;
        let str=txt.text;
        if(str=="")
        {
            tonyInfo.instance().showTopTips("消息不能为空");
            return ;
        }
        txt.text="";

        let sData=
        {
            "action":PROTOCOL_SEND.MSGID_CTS_305CHATMSG,
            "msg":str,
            "channelID":this.m_curChatChannel
        }
        net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_302PLAYERMOVE,sData);
    }
    worldChannelRender(_list,_channelID,_name)
    {
        let _index=this.m_channelMsgArr02[_channelID].length-1;
        
        let tmpData=this.m_channelMsgArr02[_channelID][_index];
        _list.addItemFromPool();
        let item=<any>_list.getChildAt(_index);

       
        
        
        let headID=tmpData.uid;
        let msg=tmpData.msg;
        let tex=preloadRes.instance().getHeadIconByIndex(headID);

        let headLoader:fgui.GLoader=item.getChild("icon").asLoader;
        headLoader.texture=tex;
        let msgTxt=item.getChild("content").asTextField;
        msgTxt.text=""+msg;
        let nameTxt=item.getChild("name").asTextField;
        nameTxt.text=""+_name;

        
        _list.scrollPane.scrollDown(10,true);

        if(_channelID>0)
        {
            let msg01=_name+":"+msg;
            this.addChatToScreen(msg01);
        }
        
    }
    addMsgToChannel(_uid,_name,_headID,_msg,_channelID)
    {
        let headID=_headID+1;
        
  
        let msg=_msg;

        this.m_testUID++;
        let tmpData={
            msg:_msg,
            uid:headID
        };
        if(!this.m_channelMsgArr02[_channelID])
        {
            this.m_channelMsgArr02[_channelID]=[];
        }
        this.m_channelMsgArr02[_channelID].push(tmpData);
        console.log("当前频道信息========",this.m_channelMsgArr02,_channelID);
        let maxIndex=8;
        let msgLen=this.m_channelMsgArr02[_channelID].length;
        let curChannelList=null;

        if(_channelID==0)
        {
            curChannelList=this.m_wordChannel;
            console.log("当前频道信息======02");
        }
        else if(_channelID==1)
        {
            curChannelList=this.m_otherChannel;
            console.log("当前频道信息======03");

        }
        if(msgLen>=maxIndex)
        {
            curChannelList.removeChildToPoolAt(0);
            this.m_channelMsgArr02[_channelID].shift();
            
           
            this.worldChannelRender(curChannelList,_channelID,_name);
        }
        else
        {
            this.worldChannelRender(curChannelList,_channelID,_name);
           
        }
        
        

        // this.m_worldMsgArr[this.m_testUID]=[];

        // this.m_worldMsgArr[this.m_testUID].msg=_msg;
        // this.m_worldMsgArr[this.m_testUID].uid=this.m_testUID;

       

        
    }
    addChatToScreen(_msg)
    {
        let self=this;
        let chatCenter=cc.find("ChatCenter");

        let tmpPrefab=null;
        if(this.m_chatPrefabArr.length>0)
        {
            tmpPrefab=this.m_chatPrefabArr.pop();
        }
        else
        {
            tmpPrefab=cc.instantiate(this.m_chatPrefab);
        }
        
        let randY=Math.random()*30+10;

        let tmpRand=(100-randY)/100;
        
        tmpPrefab.x=cc.winSize.width;
        tmpPrefab.y=cc.winSize.height*tmpRand;
        tmpPrefab.parent=chatCenter;
       
        let txt:cc.RichText=tmpPrefab.getChildByName("txt").getComponent("cc.RichText");
        txt.string=""+_msg;
        let act=cc.moveBy(8,-(cc.winSize.width+100),0);
       
        let callBack=cc.callFunc(()=>{
            tmpPrefab.removeFromParent(true);
            self.m_chatPrefabArr.push(tmpPrefab)
        
          
        });

        let seq=cc.sequence(act,callBack);

        tmpPrefab.runAction(seq);
    }
    cameraMove()
    {

    }
    roleMove(_touchPos)
    {
        if(!this.m_selfRole)
        {
            return ;
        }
        let self=this;
        let cameraX=this.m_camera.x;
        let cameraY=this.m_camera.y;
        let targetX=_touchPos.x+cameraX;
        let targetY=_touchPos.y+cameraY;

        let roleScript=self.m_selfRole.getComponent("role");
        roleScript.resetTargetPos(new cc.Vec2(targetX,targetY));
       
        
        let sData=
        {
            "action":PROTOCOL_SEND.MSGID_CTS_302PLAYERMOVE,
            "posX":targetX,
            "posY":targetY
        }
        net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_302PLAYERMOVE,sData);
    }
    
    onCollisionExit(other ,self)
    {
        console.log("碰撞Exit=====",other,self);
    }
    onCollisionEnter(other,self)
    {
        console.log('碰撞加成02',other,self);
    }
    updateBySecond(dt)
    {
        this.m_updateSecond-=dt;

        if(this.m_updateSecond<=0)
        {
            this.m_updateSecond=1;
           

            // this.m_taskPanelArr[_taskID].td=_td;
            // this.m_taskPanelArr[_taskID].tdTxt=tdTxt;
            for(let item in this.m_taskPanelArr)
            {
                let taskItem=this.m_taskPanelArr[item];
                let td=taskItem.td;
                if(td>0)
                {
                    td--;
                    taskItem.td=td;

                    let tdTxt=taskItem.tdTxt;
                    let tdStr=utils.instance().second3Time(td);
                    tdTxt.text=tdStr;
                }
                

            }
        }
    }
    update (dt) {

       // this.roleMove();
       btnCtrl.instance().loop(dt);
       this.updateBySecond(dt);
       if(this.m_roleScirpt)
       {
           let state=this.m_roleScirpt.getMoveState();
           
           if(state>=1)
           {
               let pos=this.m_roleScirpt.getPos();

               let x=pos.x;
               let y=pos.y;
               let dirX=pos.dirX;
               let dirY=pos.dirY;
               
               if(x>=this.m_startH&&x<=this.m_rightLimit)
               {
                    
                   this.m_camera.x+=dirX;
                   
               }
               
               if(y<=this.m_startV&&y>=this.m_bottomLimit)
               {
                
                   this.m_camera.y+=dirY;
               }
           }
       }
    }
    enterGameCallBack(_event)
    {
        utils.instance().consoleLog("2001====玩家进入游戏=",_event);

        tonyInfo.instance().m_curGameRoomID=1;
        tonyInfo.instance().m_gameRoomID=_event.roomID;
        tonyInfo.instance().m_myServerSeat=_event.seatID;


        this.exitSquire();
        sceneCtrl.instance().changeScene(2);
        tonyInfo.instance().m_taskTD=1800;
    }
    getNSTFunc(_event)
    {
        utils.instance().consoleLog("3008====未开始的任务=",_event);

        let taskArr=_event.taskArr;
        let isAct=0;

        for(let i=0;i<taskArr.length;i++)
        {
            let id=taskArr[i].id;
            let td=taskArr[i].td;
            let index=taskArr[i].index;
            if(index>0)
            {
                tonyInfo.instance().m_taskIndex=index;
            }
            td=Math.floor(td/1000)-1;

            this.addItemToTaskPanel(index,id,td);
            tonyInfo.instance().m_taskState=id;
            tonyInfo.instance().m_taskName=preloadRes.instance().getTaskNameByID(id);
            
            if(isAct==0)
            {
                isAct=1;
                this.showTaskPanel(1);
            }
            
        }
        


    }
    giveUpTaskFunc(_event)
    {
        utils.instance().consoleLog("3007==任务放弃====",_event);

        let state=_event.state;
        let td=_event.td;
        let index=_event.index;

        if(state==1)
        {
            
            tonyInfo.instance().showTopTips("未及时完成任务，任务失败");
        }
        else if(state==2)
        {
            tonyInfo.instance().showTopTips("任务成功取消");
        }
        tonyInfo.instance().m_taskState=0;
        this.addItemToTaskPanel(index,0,100);
        this.showTaskPanel(0,1);
        
    }
    getTaskFunc(_event)
    {
        utils.instance().consoleLog("领取任务成功3006=====",_event);

        let id=_event.taskID;
        let code=_event.code;
        let td=_event.td;
    
        if(code==100)
        {
            tonyInfo.instance().m_taskState=id;
            tonyInfo.instance().m_taskIndex=0;
            this.addItemToTaskPanel(0,id,td);
            this.showTaskPanel(1);
            tonyInfo.instance().showTopTips("领取任务成功");
        }
        else
        {
            tonyInfo.instance().showTopTips("领取任务失败");
        }
        


        
    }
    worldMsgFunc(_event)
    {
       
        let uid=_event.uid;
        let name=_event.name;
        let headID=_event.headID;
        let msg=_event.msg;
        let channelID=_event.channelID;
        utils.instance().consoleLog("3005==世界聊天=====",_event,uid,name,headID,msg,channelID);
        this.addMsgToChannel(uid,name,headID,msg,channelID);

        if(channelID!=this.m_curChatChannel)
        {
            this.resetListTypeRedPoint(1,channelID);
        }
        if(this.m_chatUIState==1)
        {
            this.m_rpCount++;
            this.updateRP();
        }
    }
    newPlayerEnter(_event)
    {
        utils.instance().consoleLog("3004=====新玩家加入=====");
        let posX=_event.posX;
        let posY=_event.posY;
        let name=_event.name;
        let title=_event.title;
        let roleID=_event.roleID;
        let uid=_event.userID;

        this.createRoleFunc(uid,posX,posY,roleID,name,title,0);
        delete this.m_newPlayrArr[uid];

    }
    userLevelFunc(_event)
    {
        utils.instance().consoleLog("3003玩家离开广场=======",_event);

        let uid=_event.userID;
        if(this.m_otherRoleArr[uid])
        {
            let role=this.m_otherRoleArr[uid];
            if(role)
            {
                role.removeFromParent(true)
                role=null;
            }
            delete this.m_otherRoleArr[uid];
        }

    }
    playerMoveFunc(_event)
    {
      

        let uid=_event.userID;
        let title=_event.title;
        let posX=_event.posX;
        let posY=_event.posY;
        let roleID=_event.roleID;

        let role=this.m_otherRoleArr[uid];
        if(this.m_otherRoleArr[uid])
        {
       
            let roleScript=role.getComponent("role");
            roleScript.resetTargetPos(new cc.Vec2(posX,posY));
        }
        else
        {
            if(!this.m_newPlayrArr[uid])
            {
                let sData=
                {
                    "action":PROTOCOL_SEND.MSGID_CTS_304GETUSERINFO,
                    "uid":uid
                }
                net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_304GETUSERINFO,sData);
               
                this.m_newPlayrArr[uid]=1;
            }
            
        }
        

    }
    initAllPlayerFunc(_event)
    {
        let playerArr=_event.player;
        let isSelf=0;

        for(let i=0;i<playerArr.length;i++)
        {
            isSelf=0;
            let roleID=playerArr[i].roleID;
            let uid=playerArr[i].userID;
            let name=playerArr[i].name;
            let title=playerArr[i].title;
            let posX=playerArr[i].posX;
            let posY=playerArr[i].posY;
            if(uid==tonyInfo.instance().m_playerUID)
            {
                isSelf=1;
            }
            this.createRoleFunc(uid,posX,posY,roleID,name,title,isSelf);

        }
        console.log("3001更新场景上能看到的所有玩家信息=========",_event);
    }
}
