import { utils } from "../globle/utils";
import { PROTOCOL_SEND, PROTOCOL_RET } from "../net/protocal";
import { net } from "../net/net";
import { tonyInfo } from "../globle/tonyInfo";
import { fishManager } from "./fishManager";
import { config } from "../globle/config";
import { player } from "./player";
import { bulletManager } from "./bulletManager";
import { fishnetManager } from "./fishnetManager";
import { preloadRes } from "../globle/preloadRes";
import { dropManager } from "./dropManager";
import { sceneCtrl } from "../globle/sceneCtrl";
import { mathUtils } from "../globle/mathUtils";
import { eventManager } from "../globle/eventManager";
import { CONSTITEM } from "../globle/constItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class gameLogic extends cc.Component {

    private m_isTouch=false;
    private m_hpPanelList:fgui.GList=null;
    private m_hpPanel:fgui.GComponent=null;
    private _view: fgui.GComponent;
    private m_skillCom:fgui.GComponent=null;
    private playerArr:Array<player>=[null,null,null,null];
    private m_playerLock={};
    private m_curPlayerIndex=0;
    private m_curUIIndex=0;
    private m_fishCfg=null;
    private m_doFireInterval=0;
    private m_doFireSpeed=0.2;////0.35;
    private m_lastPosX=0;
    private m_lastPosY=0;
    private m_wordIndex=0;
    private m_wordSrcPosY=0;
    private m_gameUI=null;
    private m_freezeSpr=null;
    private m_selfPlayer=null;
    public m_item={};
    private m_hpFishArr={};
    private m_hpIsUpdate=-1;
    private m_hpUpdateInterval=1;
    private m_hpItemCnt=0;
    private m_lockPool=[];
    private m_mutiState=0;
    private m_lockTime=10;
    fishTime=1;
    fishRoomID=1;
    fishCnt=5;
    private m_hpPanelState=0;
    private m_hpPanelAlpha=0;
    private m_touchPoint=null;
    // LIFE-CYCLE CALLBACKS:
    @property(cc.Prefab)
    m_bullet:cc.Prefab=null;
    @property(cc.Prefab)
    m_gun:cc.Prefab=null;
    @property(cc.Prefab)
    m_net:cc.Prefab=null;
    @property(cc.Prefab)
    m_coin:cc.Prefab=null;
    @property(cc.Prefab)
    m_word:cc.Prefab=null;
    @property(cc.Prefab)
    m_lockPrefab:cc.Prefab=null;

     onLoad () {
        
        utils.instance().setVisibleSize(cc.winSize);
        fishManager.instance().initFishManager();
        
        let fishParent=cc.find("fishCenter");
        let fishNetParent=cc.find("fishNetCenter");
        fishManager.instance().setFishPrefab(fishParent);
        bulletManager.instance().setBulletPrefab(this.m_bullet);
        fishnetManager.instance().setFishnetPrefab(this.m_net,fishNetParent);
        //加载Json资源开始--
        this.m_fishCfg=preloadRes.instance().m_fishCfg;
        //加载Json资源介绍--
        this.initRes();
         
     }

    start () {

        let self=this;
        if(tonyInfo.instance().m_isOnLine==1)
        {
            this.onprotocal();
        }
        
        this.touchCtrlFunc();
        let gameUI=cc.find("gameUI").getComponent("gameUI");
        this.m_gameUI=gameUI;

        tonyInfo.instance().m_gameLogicObj=this;
       /// this.wordCtrl("小依","欢迎来到异世界捕鱼");
        //this.NPCShow();

    }
    onprotocal()
    {
        
        let self=this;
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_99, self.errorCode,self);//错误信息
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_2003, self.createFishFunc, self);//35002桌子信息返回
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK205, self.doFireFunc,self);//开火
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_2011, self.userLevelFunc,self);//玩家离开
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK206, self.updateFishState,self);//更新鱼信息
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_2012, self.fishBeKillFunc,self);//鱼被击杀
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK219, self.useItemBack,self);//使用道具返回
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_IETMEND2020, self.itemEndFunc,self);//道具使用结束
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK221, self.useSkillBack,self);//使用技能返回
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_SKILLEND2022, self.skillEndFunc,self);//技能使用结束
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK2023, self.lockChangeTarget,self);//锁定切换目标
        

        eventManager.on("fishOut",(data1)=>{
            let roomID=data1.ID;
            let type=data1.type;
            let lockState=tonyInfo.instance().m_lockState;
            if(lockState>0)
            {
                bulletManager.instance().resetBulletState(roomID);
            }
            
    
            
            for(let i=0;i<4;i++)
            {
                let player=this.playerArr[i];
                if(player)
                {
                    for(let j=0;j<3;j++)
                    {
                       
                        if(player.m_lockFishArr[j]==roomID)
                        {
                           
                            player.m_lockFishArr[j]=-1;
                            player.clearLock(j);
                            break;
                        }
                    }
                }
            }
            if(lockState>0||this.m_mutiState>=1)
            {
                for(let i=0;i<3;i++)
                {
                   // console.log("测试玩家信息===========",roomID,tonyInfo.instance().m_lockTargetID[i])
                    if(roomID==tonyInfo.instance().m_lockTargetID[i])
                    {
                    
                        tonyInfo.instance().m_lockTargetID[i]=-1;
                    }
                } 
            }
        });
        

        
    }
    offprotocal()
    {
        let self=this;
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_99, self.errorCode,self)
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_2003,self.createFishFunc,self);
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK205, self.doFireFunc,self)
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_2011, self.userLevelFunc,self)
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK206, self.updateFishState,self)
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_2012, self.fishBeKillFunc,self)
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK219, self.useItemBack,self)
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK221, self.useSkillBack,self)

        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_IETMEND2020, self.itemEndFunc,self)
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_SKILLEND2022, self.skillEndFunc,self)
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK2023, self.lockChangeTarget,self)

        
        eventManager.off("fishOut");
       // net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK206, self.updateFishState,self)

        
    }
    setViewUI(_viewUI)
    {
        this._view=_viewUI;
        // let skillCom=this._view.getChild("skillCom").asCom;
        // let btnLock=skillCom.getChild("btnLock").asButton;
        this.m_skillCom=this._view.getChild("skillCom").asCom;


        let tmpPanel=this._view.getChild("hpPanel").asCom;
        this.m_hpPanel=tmpPanel;
        tmpPanel.touchable=false;
        tmpPanel.alpha=0;
        this.m_hpPanelList=tmpPanel.getChild("list").asList;
        this.m_hpPanelList.removeChildrenToPool();

        let taskPanel=this._view.getChild("taskPanel").asCom;
        taskPanel.y=-150;
        //创建玩家=====
        //this.createNewPlayer(0)

        if(tonyInfo.instance().m_taskState>0)
        {
            
            this.taskPanelAct(0);
        }
    }
    taskPanelAct(_type:number=0)
    {
        let taskPanel=this._view.getChild("taskPanel").asCom;

        let offsetY=-150;
        if(_type==1)
        {
            offsetY=150;
        }

        let act=cc.moveBy(0.2,0,offsetY);

        let callBack=cc.callFunc(()=>{

        },this);

        let seq=cc.sequence(act,callBack);

        taskPanel.node.runAction(seq);

        //初始化Panel
        let taskData=preloadRes.instance().getTaskByID(tonyInfo.instance().m_taskState);

        let winData=taskData.winLimit;
        let titleTxt=taskPanel.getChild("title").asTextField;
        titleTxt.text=""+tonyInfo.instance().m_taskName;

        let nameTxt=taskPanel.getChild("name").asTextField;
        let tdTxt=taskPanel.getChild("time").asTextField;

        

        let type01=Math.floor(winData[0]/100);
        let num01=Math.floor(winData[0]%100);
        
        let name=preloadRes.instance().getFishNameByID(winData[1]);
        let strType=this.getType02(type01);
        tonyInfo.instance().m_taskTotalNum=num01;

        nameTxt.text=""+strType+name;

        this.updateTaskNum();
        let timeStr=utils.instance().second3Time(tonyInfo.instance().m_taskTD);
        tdTxt.text=""+timeStr;
        this.schedule(()=>{
            console.log("任务倒计时=====",tonyInfo.instance().m_taskTD);
            
            if(tonyInfo.instance().m_taskTD>0)
            {
                tonyInfo.instance().m_taskTD--;
                let timeStr=utils.instance().second3Time(tonyInfo.instance().m_taskTD);
                tdTxt.text=""+timeStr;
            }
        },1,tonyInfo.instance().m_taskTD);

        

        // let itemTxt=item.getChild("num").asTextField;
        
        // itemTxt.text=""+strType+num01+"条"+name;
    }
    updateTaskNum()
    {
        let taskPanel=this._view.getChild("taskPanel").asCom;
        let numTxt=taskPanel.getChild("num").asTextField;
        numTxt.text=""+tonyInfo.instance().m_taskCurNum+"/"+tonyInfo.instance().m_taskTotalNum;

    }
    clearGame()
    {
        this.offprotocal();
       // cc.director.off("fishDead");
    }
    getType02(_type:number=0)
    {
        let type="击杀";
        if(_type==2)
        {
            type="收集";
        }
        else if(_type==3)
        {
            type="收集";
        }
        return type;

    }
    setSkillBtnState(_type:number=0,_type02:number=0)
    {
        let self=this;
        console.log("使用Freeze======",_type,_type02);
        if(_type==0)
        {
            let btnLock=this.m_skillCom.getChild("btnLock").asButton;
            let lockCover=this.m_skillCom.getChild("lockCover").asCom;
            if(_type02==1)//使用中
            {
                let leftTime=self.m_lockTime;
                btnLock.enabled=false;
                btnLock.grayed=false;
                lockCover.visible=true;
                let num=lockCover.getChild("num").asTextField;
                num.text="10";
                 
                let tmpSchedule=()=>{
                    leftTime--;
                    num.text=""+leftTime;
                    if(leftTime<1)
                    {
                        self.unschedule(tmpSchedule);
                    }
                    
                }
                self.schedule(tmpSchedule,1,10);
            }
            else
            {
                btnLock.enabled=true;
                lockCover.visible=false;
                //btnLock.grayed=false;
            }
        }
        else if(_type==1)
        {
            let btnFreeze=this.m_skillCom.getChild("btnFreeze").asButton;
            let FreezeCover=this.m_skillCom.getChild("freezeCover").asCom;
            if(_type02==1)//使用中
            {
                let leftTime=self.m_lockTime;
                btnFreeze.enabled=false;
                btnFreeze.grayed=false;
                FreezeCover.visible=true;
                let num=FreezeCover.getChild("num").asTextField;
                num.text="10";
                 
                let tmpSchedule=()=>{
                    leftTime--;
                    num.text=""+leftTime;
                   
                    
                    if(leftTime<1)
                    {
                        self.unschedule(tmpSchedule);
                        btnFreeze.enabled=true;
                        FreezeCover.visible=false;
                    }
                }
                self.schedule(tmpSchedule,1,10);
            }
            else
            {
                btnFreeze.enabled=true;
                FreezeCover.visible=false;
                //btnLock.grayed=false;
            }
        }
    }
    initRes()
    {
        dropManager.instance().m_coinPartical01=this.m_coin;
    }
    wordCtrl(_name,_content)
    {
        let parent=cc.find("NPC/say/base/view/content");
        let bar=cc.find("NPC/say/base/scrollBar");
        let com:cc.Scrollbar=bar.getComponent("cc.Scrollbar")
        // let nameArr=["小依","草蘑菇的小熊","匹诺曹","白雪公主和七个小黄人","金刚互撸娃"];
        // let contentArr=[
        //     "欢迎来到异世界捕鱼，您在这里会体验的异世界捕鱼的欢乐03",
        //     "您好",
        //     "喜洋洋挺好看的",
        //     "海贼王也挺好看的"
        // ];
        
        // let randN=Math.floor(Math.random()*3);
        //randN=0;
        let nameStr=_name;
       
        let contentStr=_content;
        parent.setPosition(-114,32+this.m_lastPosY);
        let word=cc.instantiate(this.m_word);
        word.x=0;
        word.y=-this.m_lastPosY;
        word.parent=parent;
       
        let contentNode=word.getChildByName("content")
       
        let content:cc.RichText=contentNode.getComponent("cc.RichText");
        //content.string="测试01";
        content.string="<color=#ff0000>"+nameStr+"：</c>"+"<color=#0fffff>"+contentStr+"</color>";
        let lineLen=content._linesWidth.length;
       
        this.m_lastPosY+=20*lineLen;
        console.log("测试wordlsize====",lineLen,this.m_lastPosY,com);
        this.m_wordIndex++;
        parent.setContentSize(220,this.m_lastPosY+10);
        
        this.m_wordSrcPosY=parent.position.y;
        
        
    }
    NPCShow()
    {
        let npc=cc.find("NPC");
        let callBack=cc.callFunc(()=>{

        });
        let fadeIn=cc.fadeIn(0.5);
        let delay=cc.delayTime(2);
        let fadeOut=cc.fadeOut(0.5);

        let seq=cc.sequence(fadeIn,delay,fadeOut,callBack);

        npc.runAction(seq);
    }
    NPCOut()
    {
        let npc=cc.find("NPC");
        let callBack=cc.callFunc(()=>{

        });
        let fadeIn=cc.fadeOut(0.5);

        let seq=cc.sequence(fadeIn,callBack);

        npc.runAction(seq);
    }
    
    clearRoomData()
    {
        cc.director.off("fishDead");
        
    }
    touchCtrlFunc()
    {
        let self=this;
        this.node.on(cc.Node.EventType.TOUCH_END,(msg)=>{
            self.m_isTouch=false;
           // console.log("touchENd====");
            // let dropItem=["P100001-2","P200011-2","P100202-2"];
            // let posX=300;
            // let posY=300;
            // let endPosX=100;
            // let endPosY=100;
            // let len=dropItem.length;
            // let tmpDelay=-1;
            // for(let i=0;i<len;i++)
            // {
            //     let reward=mathUtils.instance().getAwardArr(dropItem[i]);
            //     let num=reward[1];
            //     let id=reward[2];
            //     tmpDelay+=1;

            //     dropManager.instance().dropItem(id,num,new cc.Vec2(posX,posY),new cc.Vec2(endPosX,endPosY),tmpDelay);
            // }
        });
        this.node.on(cc.Node.EventType.TOUCH_START,(msg)=>{
            self.m_isTouch=true;
            let touchPoint=msg.touch.getLocation();
            self.m_touchPoint=touchPoint;
           // self.playerArr[self.m_curPlayerIndex].setPlayerTouchPoint(touchPoint);
            utils.instance().consoleLog("touchBegan",touchPoint);

            if(tonyInfo.instance().m_lockState==1)
            {
                let fishId = fishManager.instance().getSelectFishID(touchPoint)
                let fishLockID=tonyInfo.instance().m_lockTargetID[0];//self.playerArr[self.m_curPlayerIndex].getLockFishArr();
                if(fishId == fishLockID){
                    return
                }
                console.log('切换目标======',fishId);

                
                //tonyInfo.instance().m_lockTargetID[0]=fishId;
                let Sdata = {
                    "action":PROTOCOL_SEND.MSGID_CTS_223LOCKCHANGET,
                    "index":0,
                    "fishID":fishId
                }
                net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_223LOCKCHANGET,Sdata);
            }
            
           // fishManager.instance().getSelectFishID(touchPoint);
        })
        this.node.on(cc.Node.EventType.TOUCH_MOVE,(msg)=>{
            let touchPoint=msg.touch.getLocation();
            self.m_touchPoint=touchPoint;
           // utils.instance().consoleLog("touchMOve");
            
        })
    }
    /**子弹到鱼的时间 */
    private bulletToFishNeedTime(_point:cc.Vec2):number{
        let player=this.playerArr[this.m_curPlayerIndex];
        
        let startPoint = player.getSpwanBulletPos();
        let dis:number = utils.instance().distance(startPoint,_point);//azcore.utils.MathUtils.distance(startPoint,p2);
        let bulletSpeed = this.playerArr[this.m_curPlayerIndex].getBulletSpeed()
        let time:number = dis/bulletSpeed;
       return time;  //秒
   }
    dofire(dt)
    {
        
        let self=this;
        if(self.m_isTouch||tonyInfo.instance().m_lockState==1)
        {

        
            self.m_doFireInterval-=dt;

            if(self.m_doFireInterval<=0)
            {
                self.m_doFireInterval=self.m_doFireSpeed;
                let targetPos=null;
                let firstPos=null;
                
                if(tonyInfo.instance().m_lockState==1)
                {
                    let targetID=-1;
                    for(let i=0;i<(this.m_mutiState+1);i++)
                    {
                        targetID=tonyInfo.instance().m_lockTargetID[i]
                        if(targetID<0)
                        {
                            targetID=fishManager.instance().getLockTargetFishID();
                            if(targetID>=0)
                            {
                                let Sdata = {
                                    "action":PROTOCOL_SEND.MSGID_CTS_223LOCKCHANGET,
                                    "index":i,
                                    "fishID":targetID
                                }
                                net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_223LOCKCHANGET,Sdata);
                               
                            }
                        }
                        if(targetID>=0)
                        {
                            tonyInfo.instance().m_lockTargetID[i]=targetID;
                        }
                        if(targetID>=0)
                        {
                            let fish=fishManager.instance().getFishByRoomID(targetID);
                            if(fish)
                            {
                                let time:number=this.bulletToFishNeedTime(new cc.Vec2(fish.x,fish.y));
                                let fishScript=fish.getComponent("fish");
                                targetPos=fishScript.get_DiffTime_FishPos(time);
                            }
                            

                        }
                        if(i>=1)
                        {
                            tonyInfo.instance().m_mutiGunPos[i-1]=targetPos;
                           // console.log("玩家多炮开火====",tonyInfo.instance().m_mutiGunPos,targetID);
                        }
                        if(i==0)
                        {
                            firstPos=targetPos;
                        }
                        if(this.m_mutiState<=0)
                        {
                            break;
                        }
                    }
                    if(this.m_mutiState>0)
                    {
                        targetPos=firstPos;
                    }
                }
                else
                {
                    targetPos=self.m_touchPoint
                }
                if(this.m_mutiState>=1&&tonyInfo.instance().m_lockState==0)//使用多炮技能
                {
                    let targetID=-1;
                    let secondGunPos=null;
                    for(let i=0;i<2;i++)
                    {
                        let tmpIndex=i+1;
                        targetID=tonyInfo.instance().m_lockTargetID[tmpIndex]
                        if(targetID<0)
                        {
                            targetID=fishManager.instance().getLockTargetFishID();
                        }
                        if(targetID)
                        {
                            tonyInfo.instance().m_lockTargetID[tmpIndex]=targetID;
                        }
                        if(targetID>0)
                        {
                            let fish=fishManager.instance().getFishByRoomID(targetID);
                            if(fish)
                            {
                                let time:number=this.bulletToFishNeedTime(new cc.Vec2(fish.x,fish.y));
                                let fishScript=fish.getComponent("fish");
                                secondGunPos=fishScript.get_DiffTime_FishPos(time);
                            }

                         }
                         tonyInfo.instance().m_mutiGunPos[i]=secondGunPos;
                         console.log("使用多炮仅能===",tonyInfo.instance().m_mutiGunPos, tonyInfo.instance().m_lockTargetID,tmpIndex);
                    }
                }
                if(targetPos)
                {
                   
                    self.playerArr[self.m_curPlayerIndex].setPlayerTouchPoint(targetPos);
                    self.playerArr[self.m_curPlayerIndex].playGunAniOnec(0);
                }
               
        
              
               // this.wordCtrl("小依","欢迎来到异世界捕鱼");
            }

        }
        else
        {
            if(self.m_doFireInterval>0)
            {
                self.m_doFireInterval-=dt;

            }
        }
      
        
    }
    createNewPlayer(_index,_playerData)
    {
        
        let self=this;
        let playerUI=this._view.getChild("player"+_index);
        playerUI.visible=true;
        let userInfo=this._view.getChild("userInfo"+_index).asCom;
        userInfo.visible=true;
        console.log("玩家UI位置====",_index,_playerData);
        let playerInfo={
            uiIndex:_index,
            seatID:_playerData.seatID,
            goldMoney:_playerData.money,
            bulletPower:1,
            headIconID:_playerData.headIndex,
            nickName:_playerData.nickName,
            vipLevel:1,
            cannonID:_playerData.cannondID,
            curHP:_playerData.curHP,
            maxHP:_playerData.maxHP,
            angryN:_playerData.angryN,
            def:_playerData.def,
            recoverSpeed:_playerData.recoverSpeed,
            gender:0,
            gameLevel:0,
            lotteryN:1000,
            diamondN:1000,
            bulletReboundN:3,
            bulletSpeed:700,
            bulletPrafab:self.m_bullet,
            gunPrafab:self.m_gun,
            gunUI:playerUI,
            userInfo:userInfo,
            uid:_playerData.uid
        };
        //初始化UI开始--
        let money=userInfo.getChild("money").asCom.getChild("num").asTextField;
        money.text=""+_playerData.money;
        let diamond=userInfo.getChild("diamond").asCom.getChild("num").asTextField;
        diamond.text=""+_playerData.diamond;
        let headIcon=userInfo.getChild("headIcon").asLoader;
        headIcon.texture=preloadRes.instance().getHeadIconByIndex(_playerData.headIndex+1);

        let hp=userInfo.getChild("hp").asProgress;
        hp.max=_playerData.maxHP;
        hp.value=_playerData.curHP;
        let fn=userInfo.getChild("fn").asProgress;
        fn.max=150;
        fn.value=_playerData.angryN;

        
       // waitingJoin.visible=false;


       let waitingJoin=this._view.getChild("waitingJoin"+_index).asCom;
       waitingJoin.visible=false;
        
        //初始化UI结束--
        let playerUID=_playerData.uid;
        let selfUID=tonyInfo.instance().m_playerUID;
        let player01=new player(playerInfo);
        if(selfUID==playerUID)
        {
            this.m_curPlayerIndex=playerInfo.seatID;
            this.m_curUIIndex=_index;
            this.pointMyPos();
            tonyInfo.instance().m_playerSeatID=this.m_curPlayerIndex;

        }
        
        player01.initUI();
        player01.m_lockPrefab=this.m_lockPrefab;
        self.playerArr[playerInfo.seatID]=player01;
    }
    public getCurPlayer()
    {
        return this.playerArr[this.m_curPlayerIndex];
    }
    private comPoint = null
    public pointMyPos(){
        if(!this.comPoint){
            this.comPoint = fgui.UIPackage.createObject("game","here").asCom
            if(!this.comPoint)
            return
            let UiIndex = this.m_curUIIndex;
            let pointPos = this._view.getChild("player"+UiIndex).asCom
            this.comPoint.x = pointPos.x;
            this.comPoint.y = pointPos.y-100;
            this._view.addChild(this.comPoint)
            
            this.comPoint.getTransition("t0").play(function(){
                if(this.comPoint && this.comPoint.parent){
                    this.comPoint.removeFromParent()
                    this.comPoint = null
                    this.setBgMaskShow(false)
                }
                this.isShowPoint = false
            }.bind(this))
           
        }
    }
    gameEnd(_type:number=0)
    {
        this.offprotocal();
        this.m_gameUI.quitGame();
    }
    errorCode(_event)
    {
        let msg=_event.msg;

        tonyInfo.instance().showTopTips(msg);
    }
    exitRoomFunc(_event)
    {
        let seatID=_event.seatID;

        utils.instance().consoleLog("玩家退出2007=========",_event);
    }
    
    fishBeKillFunc(_event)
    {
        let exp=_event.exp;
        let score=_event.score;
        let fishRoomID=_event.fishRoomID;
        let seatID=_event.seatID;
        let dropItem=_event.dropItem;

        let fish=fishManager.instance().getFishByRoomID(fishRoomID);
        let fishScript=fish.getComponent("fish");
        let pos=fishScript.getFishPos();
        let posX=pos.x;
        let posY=pos.y;
        let uiIndex=this.playerArr[seatID].getUIIndex();
        let playerUI=this._view.getChild("player"+uiIndex).asCom;
        let endPosX=playerUI.x+100;
        let endPosY=0;
        
        
        if(uiIndex<=2)
        {
            endPosY=cc.winSize.height-(playerUI.y+50);
        }
        else
        {
            endPosY=cc.winSize.height+(playerUI.y);
        }
        fishScript.removeFromParentFunc(0);

        if(score>0)
        {
            let tmpPlayer=this.playerArr[seatID]
            tmpPlayer.setMoney(0,score);
            dropManager.instance().dropMoney(score,new cc.Vec2(posX,posY),new cc.Vec2(endPosX,endPosY),0,100);
        }
        let len=dropItem.length;
        let delay=-0.5;
        for(let i=0;i<len;i++)
        {
            let reward=mathUtils.instance().getAwardArr(dropItem[i]);
            let num=reward[1];
            let id=reward[2];
            delay+=0.5;
            dropManager.instance().dropItem(id,num,new cc.Vec2(posX,posY),new cc.Vec2(endPosX,endPosY),delay);
        }
        utils.instance().consoleLog("鱼被击杀===2012==",_event);
    }
    private m_lastItem=null;
    updateFishState(_event)
    {
        let hp=_event.hp;
        let resultN=_event.resultN;
        let fishRoomID=_event.fishRoomID;
        let fishID=-1;

        let tmpFish=fishManager.instance().getFishByRoomID(fishRoomID);
        //let fishScript=fish.getComponent("fish");
        let fishScript=tmpFish.getComponent("fish");
        let totalHP=fishScript.getFishTotalHP();
        fishScript.updateFishHP(hp);
        fishID=fishScript.getFishID();
        

        if(!this.m_hpFishArr[fishRoomID])
        {
            this.m_hpFishArr[fishRoomID]=[];
            this.m_hpFishArr[fishRoomID].roomID=fishRoomID;
            this.m_hpFishArr[fishRoomID].curhp=hp;
            this.m_hpFishArr[fishRoomID].totalHP=totalHP;
            this.m_hpFishArr[fishRoomID].timeDown=5;
            let item=<any>this.m_hpPanelList.addItemFromPool();
            
            item.customData=fishRoomID;
            this.m_hpFishArr[fishRoomID].item=item;
            this.m_hpPanelList.scrollPane.scrollDown(10,true);
            // this.scheduleOnce(()=>{
            //     nameTxt.color=cc.color(255,255,255,255);
            // },1);
            
        }
        else
        {
            this.m_hpFishArr[fishRoomID].timeDown=5;
            this.m_hpFishArr[fishRoomID].curhp=hp;
        }

        if(this.m_lastItem)
        {
           
           
            let nameTxt=this.m_lastItem.getChild("name").asTextField;
            nameTxt.color=cc.color(255,255,255,255);
        }

        let tmpItem=this.m_hpFishArr[fishRoomID].item;
        let nameTxt=tmpItem.getChild("name").asTextField;
        nameTxt.text=""+preloadRes.instance().getFishNameByID(fishID);
        nameTxt.color=cc.color(255,0,0,255);
        let hpTxt=tmpItem.getChild("hp").asTextField;
        hpTxt.text="HP:"+hp+"/"+totalHP;

        
        this.m_lastItem=tmpItem;

        this.m_hpIsUpdate=fishRoomID;
       // utils.instance().consoleLog("2006更新鱼状态=====",_event);
    }
    userLevelFunc(_event)
    {
        let uid=_event.uid;
        let seatID=_event.seatID;

        let index=seatID+1;
        let playerUI=this._view.getChild("player"+index).asCom;
        playerUI.visible=false;
    
        let userInfo=this._view.getChild("userInfo"+index).asCom;
        userInfo.visible=false;
        let waitingJoin=this._view.getChild("waitingJoin"+index).asCom;
        waitingJoin.visible=true;
        
        if(this.playerArr[seatID])
        {
            this.playerArr[seatID].clearPlayerInfo();
            this.playerArr[seatID]=null;
        }
        
        utils.instance().consoleLog("玩家离开==2011",uid,seatID);
        if(uid==tonyInfo.instance().m_playerUID)
        {
            sceneCtrl.instance().changeScene(1);
            this.gameEnd();
        }
    }
    doFireFunc(_event)
    {
        let posX=_event.posX;
        let posY=_event.posY;
        let seatID=_event.seatID;
        let type=_event.type;

        let tmpPos=utils.instance().getServerToClient(posX,posY)

        let player=this.playerArr[seatID];

        if(!player)
        {
            return ;
        }

        let uiIndex=player.getUIIndex();
        let touchPoint=new cc.Vec2(tmpPos.x,tmpPos.y);
        if(uiIndex>2)
        {
            touchPoint.y=cc.winSize.height-touchPoint.y;
        }
        if(type==0)
        {
            player.setPlayerTouchPoint(touchPoint);
        }
        else
        {
            player.m_secondGunPos=touchPoint;
        }
        
        player.playGunAniOnec(1,type);



        utils.instance().consoleLog("2005玩家开火===",posX,posY,seatID,type);
    }
    createFishFunc(event)
    {
        let type=event.type;
        let roomiD=event.roomID;
        let fishID=event.fishID;
        let fishLine=event.fishLine;
        let fishMoveTime=event.moveTime;
        let totalTime=event.totalTime;
        let fishHP=event.fishHP;
        let fishDef=event.fishDef;
        let fishData=
        {
            HP:fishHP,
            def:fishDef
        };
       // console.log("203刷鱼====",type,roomiD,fishID,fishLine,fishMoveTime,fishData);
        this.createFish(type,roomiD,fishID,fishLine,fishMoveTime,totalTime,fishData);
        
    }
    createFish(_type,_roomFishId,_fishId,_fineLine,_moveTime,totalTime,_fishData)
    {
        
        let fish=fishManager.instance().createFish(_type,_roomFishId,_fishId,_fineLine,_moveTime,totalTime,_fishData);
       
        if(fish){

           // let fishScript=fish.getComponent("fish");
           // fishScript.setFishCreateFromState(0,totalTime);
        }
        else{
            //roomfishid 已经存在
            console.log("roomfishid is IN",_fishId,_roomFishId);
        }
        return fish;
    }
    refreshFish(dt)
    {
        if(this.fishTime>0)
        {
            this.fishTime-=dt;
        }
        else
        {
            let fishCnt=fishManager.instance().getAllFishCnt();
            if(fishCnt<20)
            {
                
            
                this.fishTime=1;
                let fishLen=this.m_fishCfg.length;
                //let fishArr=[1,3,5,6,7,10,11,19,28,38];
                //let fishLine=[7000,7003,7008,7010,7023,7026,400,410,7016,7019,7027,7030,526,575];
                
                

                let n=Math.floor(Math.random()*fishLen);
                let fishLineNLen=this.m_fishCfg[n].lines.length;
                let fishLineArr=this.m_fishCfg[n].lines;
                let flIndex=Math.floor(Math.random()*fishLineNLen);
            // console.log("当前刷鱼===",n,fishLine[fishLineN]);
                let fishData=this.m_fishCfg[n];
                
                let fishID=this.m_fishCfg[n].id;
                this.createFish(1,this.fishRoomID,fishID,fishLineArr[flIndex][0],0,0,fishData);
                this.fishRoomID++;
            }
        }
    }
    
    public useItem(_id)
    {
        let lockID=[-1,-1,-1];
        if(_id==CONSTITEM.ITEM_LOCK)
        {
            if(this.m_mutiState==0)
            {
                lockID[0]=fishManager.instance().getLockTargetFishID();
            }
            else
            {
                lockID[0]=fishManager.instance().getLockTargetFishID();
                if(this.m_mutiState==1)
                {
                    lockID[1]=fishManager.instance().getLockTargetFishID();
                }
                // for(let i=0;i<3;i++)
                // {
                //     tonyInfo.instance().m_lockTargetID[i]=fishManager.instance().getLockTargetFishID();
                // }
                lockID=tonyInfo.instance().m_lockTargetID;
            }
           
        }
        let Sdata = {
            "action":PROTOCOL_SEND.MSGID_CTS_219USEITEM,
            "itemID":_id,
            "data":lockID
        }
        net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_219USEITEM,Sdata);
    }
    public useSkill(_id)
    {
        let Sdata = {
            "action":PROTOCOL_SEND.MSGID_CTS_221USESKILL,
            "skillID":_id
        }
        net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_221USESKILL,Sdata);
    }
    setFreeze(_type:number=0)
    {
        
        let freeze=cc.find("freeze");
        
        let tmpW=cc.winSize.width;
        let tmpH=cc.winSize.height;
        let tmpScaleX=tmpW/1136;
        let tmpScaleY=tmpH/640;

        freeze.scaleX=tmpScaleX;
        freeze.scaleY=tmpScaleY;
        if(_type==0)
        {
            tonyInfo.instance().m_freezeState=1;
            freeze.active=true;
        }
        else
        {
            tonyInfo.instance().m_freezeState=0;
            freeze.active=false;
        }
        
    }

    lockChangeTarget(_event)
    {
        let idex=_event.index;
        let fishID=_event.fishID;
        let seatID=_event.seatID;
        let player=this.playerArr[seatID];
        
        if(player)
        {
            player.m_lockFishArr[idex]=-1;
            player.clearLock(idex);
            player.m_lockFishArr[idex]=fishID;
            player.userItem(CONSTITEM.ITEM_LOCK,idex);
        }

        utils.instance().consoleLog("2023锁定切换目标==========",_event,player.m_lockFishArr[idex],idex);
    }
    skillEndFunc(_event)
    {
        utils.instance().consoleLog("2022技能使用结束=======");
    }
    itemEndFunc(_event)
    {
        let itemID=_event.id;
        let seatID=_event.seatID;

        if(itemID==CONSTITEM.ITEM_LOCK)
        {
            
        }
        else if(itemID==CONSTITEM.ITEM_FREEZE)
        {
            this.setSkillBtnState(1,0);
            this.setFreeze(1);
        }
        utils.instance().consoleLog("2020道具使用结束=======",_event);
    }
    useSkillBack(_event)
    {
        let id=_event.id;
        let seatID=_event.seatID;
        let errCode=_event.code;
        
        
        if(errCode==100)
        {
            let player=this.playerArr[seatID];
            player.m_mutiState=1;
            if(seatID==this.m_curPlayerIndex)
            {
                this.m_mutiState=1;
            }
            player.userItem(id);

        }
        else if(errCode==99)
        {
            tonyInfo.instance().showTopTips("技能使用失败");
        }
        utils.instance().consoleLog("2021使用技能=======",_event)
    }
    useItemBack(_event)
    {
        let id=_event.id;
        let seatID=_event.seatID;
        let errCode=_event.code;
        let clientData=_event.data;
        let self=this;
        if(errCode==100)
        {
            if(seatID==this.m_curPlayerIndex)
            {
                let num=_event.num;
                this.m_item[id]=num;
                this.updateItemNum();
            }
            
            console.log("使用道具测试======",id,CONSTITEM.ITEM_FREEZE,clientData);
            if(id==CONSTITEM.ITEM_LOCK)//锁定
            {
              
              let player=this.playerArr[seatID];
              player.m_lockFishArr=clientData;
              player.m_lockState=1;
              console.log("玩家锁定测试02===========================",player.m_lockFishArr,clientData);
              player.userItem(id);
              
              
              if(seatID==this.m_curPlayerIndex)
              {
                self.setSkillBtnState(0,1);
                tonyInfo.instance().m_lockTargetID=clientData;
                tonyInfo.instance().m_lockState=1;
              }

              this.scheduleOnce(()=>{

                if(seatID==this.m_curPlayerIndex)
                {
                    tonyInfo.instance().m_lockState=0;
                    tonyInfo.instance().m_lockTargetID=[-1,-1,-1];
                }
                player.m_lockState=-1;
               // player.m_lockFishArr=[-1,-1,-1];
                player.clearLock();
                self.setSkillBtnState(0,0);
              },this.m_lockTime);
            }
            else if(id==CONSTITEM.ITEM_FREEZE)//冰冻
            {
                if(seatID==this.m_curPlayerIndex)
                {
                    self.setSkillBtnState(1,1);
                }
                
                console.log("使用道具测试=02222=====",id,CONSTITEM.ITEM_FREEZE);
                this.setFreeze();
                
            }
        }
        else if(errCode==99)
        {
            tonyInfo.instance().showTopTips("道具不足");
        }
        
       

        utils.instance().consoleLog("2019玩家使用道具==========",_event);
    }
    updateItemNum()
    {
        let skillCom=this._view.getChild("skillCom").asCom;

        
        let lockN=skillCom.getChild("lockNum").asTextField;

        lockN.text=""+this.m_item[CONSTITEM.ITEM_LOCK];
        let freezeN=skillCom.getChild("freezeNum").asTextField;
        freezeN.text=""+this.m_item[CONSTITEM.ITEM_FREEZE];

       
    }
    setItemNum(_id,_num)
    {
        this.m_item[_id]=_num;
    }
    
    public stopLock(_seatID)
    {
        if(this.m_playerLock[_seatID])
        {
            let len=this.m_playerLock[_seatID].length;
            for(let i=0;i<len;i++)
            {
                let eftObj=this.m_playerLock[_seatID][i].eft;
                this.m_playerLock[_seatID][i]=null;
                eftObj.removeFromParent();
            }
            this.m_playerLock[_seatID]=[];
        }
    }
    public clearLock(_seatID)
    {
        if(this.m_playerLock[_seatID])
        {
            this.stopLock(_seatID);
            delete this.m_playerLock[_seatID];
        }
    }
    public updatePlayerLockEft()
    {
        for(let i=0;i<4;i++)
        {
            let p=this.playerArr[i];
            if(p)
            {
                p.updateLockEftPos();
            }
        }
    }
    hpPanelLoop(dt)
    {
        let isUpdate=0;
        this.m_hpUpdateInterval-=dt;
        let timeDownState=0;
        
        if(this.m_hpUpdateInterval<=0||this.m_hpIsUpdate>=0)
        {
            isUpdate=1;
            if(this.m_hpIsUpdate>=0)
            {
                isUpdate=2;
            }
            else
            {
               
                
            }
            if(this.m_hpUpdateInterval<=0)
            {
                this.m_hpUpdateInterval=1;
                timeDownState=1;
            }
            
        }
        if(isUpdate>0)
        {
            for(let item in this.m_hpFishArr)
            {
                let id=this.m_hpFishArr[item].roomID;
                let time=this.m_hpFishArr[item].timeDown;
                
                if(timeDownState==1)
                {
                    time--;
                }
                this.m_hpFishArr[item].timeDown=time;
                if(time<=0)
                {
                    let index=-1;
                    let len=this.m_hpPanelList._children.length;
                    for(let i=0;i<len;i++)
                    {
                        let item=<any>this.m_hpPanelList.getChildAt(i);
                        let id02=item.customData;
                        if(id==id02)
                        {
                            index=i;
                        }
                       
                    }
                    if(index>=0)
                    {
                        this.m_hpPanelList.removeChildToPoolAt(index);
                        delete this.m_hpFishArr[item];
                        let len=this.m_hpPanelList._children.length;
                        if(len<=0)
                        {
                            this.m_hpPanelState=2;
                        }
                    }
                }
                
                

            }
            if(isUpdate==2)
            {
                this.m_hpIsUpdate=-1;
            }
        }
        
    }
    hpPanelAct()
    {
        
        if(this.m_hpIsUpdate>=0||this.m_hpPanelState==1)
        {
            this.m_hpPanelState=1;
            
            if(this.m_hpPanelAlpha<=1)
            {
                this.m_hpPanelAlpha+=0.02;
               // this.m_Hp
              
               if(this.m_hpPanel)
               {
                   if(this.m_hpPanelAlpha>=1)
                   {
                       this.m_hpPanelAlpha=1;
                       this.m_hpPanelState=0;
                   }
                   this.m_hpPanel.alpha=this.m_hpPanelAlpha;
               }
            }
        }
        else
        {
            if(this.m_hpPanelAlpha>0&&this.m_hpPanelState==2)
            {
                this.m_hpPanelAlpha-=0.02;
               // this.m_Hp
               if(this.m_hpPanel)
               {
                   if(this.m_hpPanelAlpha<=0)
                   {
                       this.m_hpPanelAlpha=0;
                       this.m_hpPanelState=0;
                   }
                   this.m_hpPanel.alpha=this.m_hpPanelAlpha;
               }
            }
        }
    }
     update (dt) {

        fishManager.instance().gameLoop(dt);
        if(tonyInfo.instance().m_isOnLine==0)//单机游戏
        {
         //  this.refreshFish(dt);
        }
        this.dofire(dt);
        this.updatePlayerLockEft();
        bulletManager.instance().gameLoop(dt);
        this.hpPanelAct();
        this.hpPanelLoop(dt);
        
     }
}
