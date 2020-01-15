import { tonyInfo } from "../globle/tonyInfo";
import { preloadRes } from "../globle/preloadRes";
import { utils } from "../globle/utils";
import { PROTOCOL_RET, PROTOCOL_SEND } from "../net/protocal";
import { net } from "../net/net";
import { btnCtrl } from "../globle/btnCtrl";
import { soundManager } from "../globle/soundManager";
import { dropManager } from "./dropManager";
import { CONSTITEM } from "../globle/constItem";

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
export default class gameUI extends cc.Component {

    
    // LIFE-CYCLE CALLBACKS:
    private _view: fgui.GComponent;
    private m_gameLogic=null;
    private m_backState=0;
    private m_uiReward=null;
    private m_levelPanel=null;
    private m_skillCom:fgui.GComponent=null;
   
    @property(cc.Prefab)
    m_gunPrefab:cc.Prefab=null;
    @property(cc.Prefab)
    m_dropItemPrefab:cc.Prefab=null;
 
    onLoad () {
        fgui.addLoadHandler();
        fgui.GRoot.create();
        fgui.UIPackage.loadPackage("fgui/game",this.onUILoaded.bind(this));

    }
    onUILoaded()
    {
        fgui.UIPackage.addPackage("fgui/game");
        this._view = fgui.UIPackage.createObject("game", "game").asCom;
        this._view.makeFullScreen();
      
        fgui.GRoot.inst.addChild(this._view);
       

        this.addListener();
      
        this.initUI();
        this.initViewUI();
        
        
    }
    addListener()
    {
        this.onprotocal();
    }
    start () {

    }
    initUI()
    {
        soundManager.instance().playBg("fcBg1");
        let eftTop=cc.find("eftTop");
        eftTop.zIndex=1000;
        this.m_gameLogic=cc.find("Canvas").getComponent("gameLogic");
        
        //dropsetDropItemPrefab
        dropManager.instance().setDropItemPrefab(this.m_dropItemPrefab);
        
        if(this.m_gameLogic)
        {
            this.m_gameLogic.setViewUI(this._view);
           
        }
        for(let i=0;i<4;i++)
        {
            let index=i+1;
            let hiCom=this._view.getChild("userInfo"+index).asCom;
            hiCom.visible=false;
            let gun=this._view.getChild("player"+index).asCom;
            gun.visible=false;
        }


        this.scheduleOnce(()=>{
            let hallID=tonyInfo.instance().m_curGameRoomID;
            let roomID=tonyInfo.instance().m_gameRoomID;
            
            utils.instance().consoleLog("告诉服务可以刷鱼了",roomID);
            
            let Sdata = {
                "action":PROTOCOL_SEND.MSGID_CTS_202TSREADY,
                "roomID":roomID,
                "hallID":hallID

            }
            net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_202TSREADY,Sdata);
        
        },1);

        //请求桌子信息开始--
        let Sdata = {
            "action":PROTOCOL_SEND.MSGID_CTS_204GETTABLEINFO
        }
        net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_204GETTABLEINFO,Sdata);
        //请求桌子信息结束--

        let skillList=this._view.getChild("skill").asList;
        
    }
    onprotocal()
    {
        
        let self=this;
       
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK204, self.getTableInfoFunc, self);//35002桌子信息返回
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_2010, self.otherPlayerEnter,self);//其他玩家加入
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_88, self.propertyChangeFunc,self);//通用属性变化
    }
    offprotocal()
    {
        let self=this;
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK204,self.getTableInfoFunc,self);
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_2010,self.otherPlayerEnter,self);
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_88, self.propertyChangeFunc,self)
    }
    quitGame()
    {
        this.offprotocal();
        console.log("GameUI退出========");
    }
    initViewUI()
    {
        let exitCom=this._view.getChild("exitCom").asCom;

        let backBtn=exitCom.getChild("btnBack").asButton;
        let act0=exitCom.getTransition("t0");
        let act1=exitCom.getTransition("t1");
        let self=this;
        let archerIcon=backBtn.getChild("icon");
        backBtn.onClick(()=>{

            let state=btnCtrl.instance().getBtnState();
            if(state<=0)
            {
                return ;
            }
            self.m_backState++;

            if(self.m_backState%2==1)
            {
                act0.play(()=>{
                    archerIcon.scaleX=-1;

                });
            }
            else
            {
                act1.play(()=>{
                    archerIcon.scaleX=1;
                });
            }
            

        },this);
        //玩家推出
        let btnExit=exitCom.getChild("comExit").asCom.getChild("btnExit").asButton;
        btnExit.onClick(()=>{
            let state=btnCtrl.instance().getBtnState();
            if(state<=0)
            {
                return ;
            }
            let Sdata = {
                "action":PROTOCOL_SEND.MSGID_CTS_207EXITFROMROOM
            }
            net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_207EXITFROMROOM,Sdata);
            utils.instance().consoleLog("玩家退出");
        },this);

        //锁定按钮
        let skillCom=this._view.getChild("skillCom").asCom;
        let btnLock=skillCom.getChild("btnLock").asButton;
        btnLock.onClick(this.btnFunc,this);
        btnLock.customData=10;

        this.m_skillCom=skillCom;
        

        
        //冰冻按钮
        let btnFreeze=skillCom.getChild("btnFreeze").asButton;
        btnFreeze.onClick(this.btnFunc,this);
        btnFreeze.customData=11;
        let freezeCover=skillCom.getChild("freezeCover").asCom;
        freezeCover.visible=false;
    }
    getUIIndex(_seat:number=0)
    {
        let tmp = [2,3,0,1];
        let myServerSeat=tonyInfo.instance().m_myServerSeat;
        return myServerSeat < 2 ? _seat : tmp[_seat];
    }
    propertyChangeFunc(_event)
    {
        let type=_event.type;
        let data1=_event.data1;
        let data2=_event.data2;
        let data3=_event.data3;
        let data4=_event.data4;
        let data5=_event.data5;
        if(type==1)//玩家升级
        {
            tonyInfo.instance().m_gameLevel=data1;
            tonyInfo.instance().m_curGameExp=data2;
            tonyInfo.instance().m_nextLvExp=data3;
            let leftPoint=data4;
            tonyInfo.instance().m_leftPoint=leftPoint;
            utils.instance().consoleLog("88==玩家升级======",data1,data2,data3);
            this.gameLevelUp(data5);
        }
        utils.instance().consoleLog("88==属性变化======",_event);
    }
    otherPlayerEnter(_data)
    {
        let player=_data.player;
        let seatID=player.seatID;
        let playerUID=player.uid;
        let _uiIndex=this.getUIIndex(seatID);
        let uiID=_uiIndex+1;
        
        this.m_gameLogic.createNewPlayer(uiID,player)
        console.log("其他玩家加入==2010==",_data);
    }
    getTableInfoFunc(data)
    {
        let player=data.player;
        let selfUID=tonyInfo.instance().m_playerUID;
        let skillArr=null;
        let lockN=data.lockN;
        let freezeN=data.freezeN;
        if(tonyInfo.instance().m_taskState<=0)
        {
            for(let i=1;i<=4;i++)
            {
                
                let waitingJoin=this._view.getChild("waitingJoin"+i).asCom;
                waitingJoin.visible=false;
            }
        }
        
        

        for(let i=0;i<player.length;i++)
        {
            let seatID=player[i].seatID;
            let playerUID=player[i].uid;
            let _uiIndex=this.getUIIndex(seatID);
            let uiID=_uiIndex+1;
            let tmpUID=player[i].uid;
            if(tmpUID==tonyInfo.instance().m_playerUID)
            {
                skillArr=player[i].skill;
            }
           
            this.m_gameLogic.createNewPlayer(uiID,player[i])
            console.log("创建玩家")
            // let userInfo=this._view.getChild("userInfo"+uiID).asCom;
            // userInfo.visible=true;
            // let playerUI=this._view.getChild("player"+uiID).asCom;
            // playerUI.visible=true;
           // this.m_uiView.getChild("player_"+_uiIndex).asCom;

        }
        if(skillArr)
        {
            this.initSkillList(skillArr);
        }
        this.m_gameLogic.setItemNum(CONSTITEM.ITEM_FREEZE,freezeN);
        this.m_gameLogic.setItemNum(CONSTITEM.ITEM_LOCK,lockN);

        this.m_gameLogic.updateItemNum();
        utils.instance().consoleLog("2004=====桌子信息=",data);
    }
    initSkillList(skillArr)
    {
        let skillList=this._view.getChild("skill").asList;
        let index=0;
        skillList.removeChildrenToPool();
        for(let str in skillArr)
        {
            skillList.addItemFromPool();
            let item=<any>skillList.getChildAt(index);
            let icon=item.getChild("icon").asLoader;
            let name=item.getChild("name").asTextField;



            let id=skillArr[str].skillID;

            let tex=preloadRes.instance().getSkillIconById(id);
            icon.texture=tex;
            let skillData=preloadRes.instance().getSkillDataByID(id);
            let skillname=skillData.skillName;
            name.text=""+skillname;

            console.log('当前道具ID====',id,tex,skillData);
            index++;
            item.customData=id;
            item.onClick(this.btnFunc,this);

        }
    }
    gameLevelUp(_reward)
    {
        this.m_uiReward=_reward;
        console.log("玩家升级==============",_reward);
        fgui.UIPackage.loadPackage("fgui/levelup",this.levelUpUI.bind(this));
    }
    public btnFunc(_target)
    {
        
        let target=_target.currentTarget;
        
        
        let obj02=target.$gobj;
        let btnType=obj02.customData;
        let leftPoint=tonyInfo.instance().m_leftPoint;
        console.log("玩家点击的类型=====",btnType);
        let state=btnCtrl.instance().getBtnState();
        if(state<=0)
        {
            return ;
        }
        if(btnType==10)
        {
            let cnt=this.m_gameLogic.m_item[CONSTITEM.ITEM_LOCK];
            if(cnt>=1)
            {
                ///let lockCover=skillCom.getChild("lockCover").asCom;
                // lockCover.visible=true;
                

                this.m_gameLogic.useItem(CONSTITEM.ITEM_LOCK);     
            }
            else
            {
                tonyInfo.instance().showTopTips('道具不足');
            }
           
        }
        else if(btnType==11)
        {
            let cnt=this.m_gameLogic.m_item[CONSTITEM.ITEM_FREEZE];
            if(cnt>=1)
            {
                this.m_gameLogic.useItem(CONSTITEM.ITEM_FREEZE);
            }
            else
            {
                tonyInfo.instance().showTopTips("道具不足");
            }
            
        }
        else if(btnType>=1001&&btnType<2000)//使用技能
        {
           
            this.m_gameLogic.useSkill(btnType);
        }
        
    }
    levelUpUI()
    {
       // fgui.UIPackage.loadPackage("fgui/playerInfo",this.openPlayerInfoUI.bind(this));
        // fgui.UIPackage.addPackage("fgui/playerInfo");
        // let panel = fgui.UIPackage.createObject("playerInfo", "panel").asCom;
        // panel.makeFullScreen();
        if(this.m_levelPanel)
        {
            this.m_levelPanel.dispose();
        }

        soundManager.instance().playEft("levelup");
        fgui.UIPackage.addPackage("fgui/levelup");
        let panel = fgui.UIPackage.createObject("levelup", "levelup").asCom;
        panel.makeFullScreen();
        this.m_levelPanel=panel;
      
        fgui.GRoot.inst.addChild(panel);
        let content=panel.getChild("panel").asCom;

        let btn=panel.getChild("btn_ok").asButton;

        btn.onClick(()=>{

         panel.dispose();

        },this);
        let level=content.getChild("txt_level").asTextField;
        level.text=""+tonyInfo.instance().m_gameLevel;
        let reward=this.m_uiReward;
        
        if(reward)
        {
            let rewardData=preloadRes.instance().getPropIconByReward(reward)

            let item=panel.getChild("item").asCom;

            let iocn=item.getChild("m_icon").asLoader;
            let numTxt=item.getChild("txt_num").asTextField;
            iocn.texture=rewardData.tex;
            numTxt.text="X"+rewardData.num;
            this.m_uiReward=null;
        }
    }
    update (dt) {
        btnCtrl.instance().loop(dt);
    }
}
