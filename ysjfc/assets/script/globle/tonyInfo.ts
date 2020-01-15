
import { globleData } from "./globle";

import { config } from "./config";
import { preloadRes } from "./preloadRes";
export enum StateType {
    StartState = 1,
    EndState = 0,
    ChangeState = -1,
}
export class tonyInfo {

    private static ince:tonyInfo;
    public static instance(): tonyInfo{
        if(this.ince == undefined){
            this.ince = new tonyInfo();
        }
        return this.ince;
    }
    public m_port="";
    public m_playerName="七个小黄人";
    public m_playerMoney=100;
    public m_playerDiamond=100;
    public m_playerUID=0;
    public m_gameLevel=1;//玩家游戏等级
    public m_curGameExp=0;//当前玩家优先等级经验
    public m_loginState=0;
    public m_headIndex=1;
    public m_loadingType=0;
    public m_topTipPrefab=null;
    public m_tipsState=0;
    public m_clasicState=0;
    public m_btnClickInterval=1;
    public m_playerSeatID=0;
    public m_fishSchoolIsComingState=0;
    public m_curGameRoomID=-1;
    public m_gameRoomID=-1;
    public m_isOnLine=1;//是否是单机游戏 1==联网
    public m_gameLogicObj=null;
    public m_myServerSeat=0;
    public m_tili=0;
    public m_actPower=0;
    public m_actSpeed=0;
    public m_angryPower=0;
    public m_actPoint=0;
    public m_actSpeedPoint=0;
    public m_hp=0;
    public m_hpPoint=0;
    public m_def=0;
    public m_defPoint=0;
    public m_leftPoint=0;
    public m_nextLvExp=0;
    public m_cannonArr={};
    public m_equipGunID=-1;
    public m_cannonID=-1;
    public m_lockState=0;
    public m_lockTargetID=[-1,-1,-1];
    public m_mutiGunPos=[null,null];
    
    public m_freezeState=0;//是否使用冰冻
    private m_saveSwitch=0;
    private m_bulletSpwanPoint:cc.Vec2=new cc.Vec2(0,0);
    public m_playerLock={};
    public m_exit=0;
    public m_taskState=-1;
    public m_taskIndex=-1;
    public m_taskName="";
    public m_taskTD=0;
    public m_taskTotalNum=0;
    public m_taskCurNum=0;
    public showTopTips(_txt)
    {
        let self=this;
        if(!this.m_topTipPrefab)
        {
            
            this.m_topTipPrefab=preloadRes.instance().getTopTipPrefab();
        }
        if(this.m_tipsState==1)
        {
            return ;
        }
        if(!this.m_topTipPrefab)
            return;
        this.m_tipsState=1;
        
        let tips:cc.Node=cc.instantiate(this.m_topTipPrefab);
        if(!tips)
        return
        let parent= cc.director.getScene();
        tips.parent=parent;
        tips.x=cc.winSize.width/2;
        tips.y=cc.winSize.height/2;
        tips.opacity=0.0;
        tips.zIndex=1000;
        tips.group="UI";

        let txtStr = tips.getChildByName("word").getComponent("cc.Label")
        txtStr.string = _txt

        let act=cc.fadeIn(0.3);
        let delay=cc.delayTime(2);
        let act02=cc.fadeOut(0.3);
        let callBack=cc.callFunc(()=>{
            tips.destroy();
            self.m_tipsState=0;
        },this);
        let seq=cc.sequence(act,delay,act02,callBack)
        tips.runAction(seq);
    }
    setPlayerMoney(_money:number=0,_type:number=0)
    {
        if(_type==0)
        {
            this.m_playerMoney=_money;
        }
        else if(_type==1)
        {
            this.m_playerMoney+=_money;
        }
        else if(_type==2)
        {
            this.m_playerMoney-=_money;
        }
        this.saveToLoal("fcMoney",this.m_playerMoney);
      
        
    }
    setPlayerDiamond(_num,_type:number=0)
    {
        if(_type==0)
        {
            this.m_playerDiamond=_num;
        }
        else if(_type==1)
        {
            this.m_playerDiamond+=_num;
        }
        else if(_type==2)
        {
            this.m_playerDiamond-=_num;
        }
       // this.saveToLoal("fcDiamond",this.m_playerDiamond);
       
    }
    setPlayerName(_name)
    {
        this.m_playerName=_name;
       // this.saveToLoal("fcName",this.m_playerName);
       
    }
    setPlayerUID(_uid)
    {
        this.m_playerUID=_uid;
       // this.saveToLoal("fcUID",this.m_playerUID);
       
    }
    setPlayerGL(_gameLevel)
    {
        this.m_gameLevel=_gameLevel;
        //this.saveToLoal("fcGL",this.m_gameLevel);
        
    }
    setPlayerHeadIndex(_index)
    {
        this.m_headIndex=_index;
       // this.saveToLoal("fcHeadIcon",this.m_headIndex);
    }
    setPlayerCurGLExp(_type:number=0,_glExp:number=0)
    {
        if(_type==0)
        {
            this.m_curGameExp=_glExp
        }
        else if(_type==1)
        {
            this.m_curGameExp+=_glExp
        }
        else if(_type==2)
        {
            this.m_curGameExp-=_glExp
        }
        this.saveToLoal("fcGLExp",this.m_curGameExp);
       
    }
    public setBSpawnPoint(_point:cc.Vec2)
    {
        this.m_bulletSpwanPoint=_point;
    }
    public getBSpawnPoint():cc.Vec2
    {
        return this.m_bulletSpwanPoint;
    }
    saveToLoal(_key,_value,_type:number=0)
    {
        if(this.m_saveSwitch==0||_type>0)
        {
            localStorage.setItem(_key,""+_value)
        }
        
    }
   
}