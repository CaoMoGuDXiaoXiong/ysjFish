import { utils } from "../globle/utils";
import { bulletManager } from "./bulletManager";

import { PROP_ID } from "../globle/globle";

import { tonyInfo } from "../globle/tonyInfo";
import { mathUtils } from "../globle/mathUtils";
import { net } from "../net/net";
import { PROTOCOL_SEND } from "../net/protocal";
import { preloadRes } from "../globle/preloadRes";
import { soundManager } from "../globle/soundManager";
import { CONSTITEM } from "../globle/constItem";
import { fishManager } from "./fishManager";


export class player {
   
    private m_seatID:number=-1;//玩家在渔场的座位号(0-3)
    private m_goldMoney:number=0;//玩家的金币
    private m_bulletPower:number=0;//玩家的炮倍
    private m_maxBulletPower:number=0;//玩家的最大炮倍
    private m_headIconID:number=0;//玩家头像ID
    private m_nickName:string="草蘑菇的小熊";//玩家昵称
    private m_vipLevel:number=0;//玩家的VIP等级
    private m_cannonID:number=2008001;//玩家的炮的ID
    private m_gender:number=0;//玩家的性别
    private m_gameLevel:number=0;//玩家在渔场里面的游戏等级
    private m_lotteryN:number=0;//玩家的奖券数量
    private m_diamondN:number=0;//玩家的钻石数量
    private m_bulletReboundN:number=3;//玩家的子弹反弹次数
    private m_bulletSpeed:number=700;//玩家的子弹
    private m_uid:number=-1;//玩家的UID
    
    private m_player=null;
    private m_playerGunDB:dragonBones.ArmatureDisplay=null;
    private m_playerGunAdd=null;
    private m_playerGun=null;
    private m_playerGunUI:fgui.GComponent;
    private m_playerInfoUI:fgui.GComponent;
    private m_playerGunNode=null;
    private m_spwanBulletPos:cc.Vec2=new cc.Vec2(0,0);
    private m_bulletPrafab:cc.Prefab=null;
    private m_bulletParent=null;
    private m_gunPrafab:cc.Prefab=null;
    private m_createBulletN=0;
    private m_bulletResID=0;
    private m_playerFirePoint:cc.Vec2=new cc.Vec2(0,0);
    private m_curLockedFishRoomID=[-1,-1,-1];
    private m_bulletArr=[];
    private m_uiIndex:number=0;
    private m_apLeftTime=0;
    private m_apScore=0;
    private m_apFirePower=0;
    private m_apRank:any;
    public curUsingSkillState:number = 0
    public startPoint:any
    public m_lockState=-1;
    public m_lockPropID=-1;
    private m_netPropID = -1;
    public m_waitingForFish=0;
    public m_lockChangeTime=0;
    public m_lockIsStop=0;
    public m_lockPrefab=null;
    public m_lockArr=[null,null,null];
    public m_gunArr=[];
    public m_lockFishArr=[-1,-1,-1];
    
    public m_mutiGunPos=[-1,-1];
    public m_secondGunPos=null;
    public m_mutiState=0;


    public m_curTimeLock=0;
    public m_lockTargetID=-1;
    private m_playerUI:cc.Node=null;

    private m_ap:number=0;//玩家穿甲
    private m_attackPower=50;//玩家攻击力
    private m_curHP=0;
    private m_maxHP=0;
    private m_angryN=0;
    private m_curMP=0;
    private m_maxMP=0;
    private m_def=0;
    private m_recoverSpeed=1;
    private m_moneyLabel:fgui.GTextField=null;
    private m_bulletIDArr:any=null;


    public constructor(_playerInfo)
    {
        this.m_seatID=_playerInfo.seatID;
        this.m_goldMoney=_playerInfo.goldMoney;
        this.m_bulletPower=_playerInfo.bulletPower;
        this.m_maxBulletPower = _playerInfo.bulletPower
        this.m_headIconID=_playerInfo.headIconID;
        this.m_nickName=_playerInfo.nickName;
        this.m_vipLevel=_playerInfo.vipLevel;
        this.m_cannonID=_playerInfo.cannonID;
        this.m_gender=_playerInfo.gender;
        this.m_gameLevel=_playerInfo.gameLevel;
        this.m_lotteryN=_playerInfo.lotteryN;
        this.m_diamondN=_playerInfo.diamondN;
        this.m_bulletReboundN=_playerInfo.bulletReboundN;
        this.m_bulletSpeed=_playerInfo.bulletSpeed;
        this.m_gunPrafab=_playerInfo.gunPrafab;
        this.m_bulletPrafab=_playerInfo.bulletPrafab;
        this.m_uiIndex=_playerInfo.uiIndex;

        this.m_playerGunUI=_playerInfo.gunUI;
        this.m_playerInfoUI=_playerInfo.userInfo;
       
        this.m_bulletParent=cc.find("bulletCenter");
        this.m_apLeftTime=_playerInfo.apLeftTime;
        this.m_apScore=_playerInfo.apScore;
        this.m_apFirePower=_playerInfo.apFirePower;
        this.m_apRank=_playerInfo.apRank;
        this.m_uid = _playerInfo.uid
        this.m_curHP=_playerInfo.curHP;
        this.m_maxHP=_playerInfo.maxHP;
        this.m_angryN=_playerInfo.angryN;
        this.m_def=_playerInfo.def;
        this.m_recoverSpeed=_playerInfo.recoverSpeed;

        this.curUsingSkillState = 0

        // this.m_playerUI=cc.find("player"+(this.m_seatID+1));
        // this.m_playerGun=this.m_playerUI.getChildByName("gun1");
        // this.m_playerGunDB=this.m_playerGun.getComponent("dragonBones.ArmatureDisplay");
        this.m_moneyLabel=this.m_playerInfoUI.getChild("money").asCom.getChild("num").asTextField;
       
        this.addGun(this.m_cannonID);
        this.setBulletResID();


        
    }
    public setBulletResID()
    {
        // 1 2 BoxSize 3 4 offset 5=IsRota
        this.m_bulletIDArr = {        
           //[0] : [75,30,0,0,0],
           [10001]:[100011],
           [10002]:[100021],
           [10003]:[100031],
           [10004]:[100041],
           [10005]:[100051],
           [10006]:[100061],
           [20001]:[200011,200012]
            
        }
    }
    getBulletResID(_gunID,_type:number=0)
    {
        let bulletArr=[];;

        bulletArr= this.m_bulletIDArr[_gunID];

        return bulletArr[_type];
    }
    
    addGun(_gunID,_type:number=0)
    {
        let gun=cc.instantiate(this.m_gunPrafab);
        gun.x=25;
        gun.y=-25;
        if(_type===0)
        {
            this.m_playerGun=gun;
            this.m_playerGunNode=gun.getChildByName("gunSpr");
            this.m_playerGunDB=this.m_playerGunNode.getComponent("dragonBones.ArmatureDisplay");
            if(this.m_uiIndex>2)
            {
                this.m_playerGunNode.angle=180;
            }
        }
        else
        {
           
            let gunNode=gun.getChildByName("gunSpr");
            let gunDB=gunNode.getComponent("dragonBones.ArmatureDisplay");
            if(this.m_uiIndex>2)
            {
                gunNode.angle=180;
            }
            this.m_gunArr.push(gun);
            let gunBase=gun.getChildByName("base");
            gunBase.active=false;

        }
        
        
        
        let gunParent=this.m_playerGunUI.getChild("gun");
        gunParent.node.addChild(gun);
    }
    clearGun()
    {
        for(let i=0;i<this.m_gunArr.length;i++)
        {
            this.m_gunArr[i].removeFromParent(true);
            this.m_gunArr[i].pop();
        }
        this.m_gunArr=[];
        this.m_mutiGunPos=[-1,-1];
        this.m_mutiState=0
    }
    //切换炮台当前播放动画
    private curPlayAniName:string = "Pao"
    public changePaoAnimation(aniName:string = "Pao"){
        if(this.m_playerGunDB){
            if(this.curPlayAniName == aniName)
                return
            this.curPlayAniName = aniName
            let aniState = this.m_playerGunDB.playAnimation(aniName,1)
            if(aniState)
                aniState.stop()
        }
    }

  
   public initUI()
   {
       this.updatePlayerHP();
       this.updatePlayerAngryN();
   }
   public updatePlayerHP()
   {
       let hp=this.m_playerInfoUI.getChild("hp").asProgress;

       let num=hp.getChild("num").asTextField;
       num.text=""+this.m_curHP+"/"+this.m_maxHP;
   }
   public updatePlayerAngryN()
   {
       let mp=this.m_playerInfoUI.getChild("fn").asProgress;
       let num=mp.getChild("num").asTextField;

       num.text=""+this.m_angryN+"/150";
   }
    public getSpwanBulletPos()
    {
        return this.m_spwanBulletPos;
    }
    public mainGunFire(_type:number=0)
    {
        if(this.m_playerGunDB)
        {   
           // console.log("fire======",this.m_spwanBulletPos,this.m_playerFirePoint);
            let spawnNode=this.m_playerGunUI.getChild("gun").node;//this.m_playerUI.getChildByName("bulletSpawnPoint");
            let point=spawnNode.convertToWorldSpaceAR(spawnNode.position);
            point.x=point.x-44;
            point.y=point.y+35;
        
            this.m_spwanBulletPos=point;
            let retVo=mathUtils.instance().degree(this.m_spwanBulletPos,this.m_playerFirePoint);
            let atanTest=retVo.degree;
            if(this.m_uiIndex>=2)
            {
            // atanTest+=-180;
            }
            let screenW=1136;
            let screenH=640;
            let delatX = cc.winSize.width / screenW;
            let delatY = cc.winSize.height / screenH;
            let serverPosX = this.m_playerFirePoint.x / delatX;
            let serverPosY = this.m_playerFirePoint.y / delatY;  //转化后的服务器位置
            if(_type<=0)
            {
            
                let sendData = {
                    action:PROTOCOL_SEND.MSGID_CTS_205FIRE,
                    x:serverPosX,
                    y:serverPosY,
                    type:0
                }
                net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_205FIRE,sendData);
               // console.log("====================发射子弹================",serverPosX,serverPosY)
                
            }
            //SApi.send(protocol.PROTOCOL_SEND.MSGID_CTS_READYTOFIRE, sendData, this.azApp.gameSocket);
            this.m_playerGunDB.playAnimation(this.curPlayAniName,1);
            this.updateBulletAndCannon(atanTest,100,0,0,this.m_playerFirePoint);
        }
    }
    public playGunAniOnec(_type:number=0,_type02:number=-1)
    {
       //console.log('那个跑开始===============',_type,_type02);
        if(_type==0)
        {
           this.mainGunFire(_type);
            
           this.mutipGunFire(_type);
        }
        else if(_type==1)
        {
            if(_type02==0)
            {
                this.mainGunFire(_type);
            }
            else 
            {
                this.secondGunfire(_type02);
            }
        }
       
    }
    public secondGunfire(_index)
    {
        let tmpIndex=_index-1;
        let spawnNode=this.m_playerGunUI.getChild("gun").node;//this.m_playerUI.getChildByName("bulletSpawnPoint");
        let point=spawnNode.convertToWorldSpaceAR(spawnNode.position);
        point.x=point.x-44;
        point.y=point.y+35;
        
        let tmpPoint=this.m_secondGunPos;
        this.m_spwanBulletPos=point;
        let retVo=mathUtils.instance().degree(this.m_spwanBulletPos,tmpPoint);
        let atanTest=retVo.degree;
        if(this.m_uiIndex>=2)
        {
            // atanTest+=-180;
        }
        let screenW=1136;
        let screenH=640;
        let delatX = cc.winSize.width / screenW;
        let delatY = cc.winSize.height / screenH;
        let serverPosX = tmpPoint.x / delatX;
        let serverPosY = tmpPoint.y / delatY;  //转化后的服务器位置
        

        let tmpNode=this.m_gunArr[tmpIndex].getChildByName("gunSpr");
        let tmpDB=tmpNode.getComponent("dragonBones.ArmatureDisplay");
        tmpDB.playAnimation(this.curPlayAniName,1);
        
        this.updateBulletAndCannon(atanTest,100,0,0,tmpPoint,tmpIndex+1);
    }
    public mutipGunFire(_type:number=0)
    {
        for(let i=0;i<this.m_gunArr.length;i++)
        {
            
            let spawnNode=this.m_playerGunUI.getChild("gun").node;//this.m_playerUI.getChildByName("bulletSpawnPoint");
            let point=spawnNode.convertToWorldSpaceAR(spawnNode.position);
            point.x=point.x-44;
            point.y=point.y+35;
            let fishPos=tonyInfo.instance().m_mutiGunPos[i]
            //console.log("技能位置=========================================",fishPos,i,this.m_gunArr);
            if(!fishPos)
            {
                continue;
            }
            
            let tmpPoint=fishPos;
            this.m_spwanBulletPos=point;
            let retVo=mathUtils.instance().degree(this.m_spwanBulletPos,tmpPoint);
            let atanTest=retVo.degree;
            if(this.m_uiIndex>=2)
            {
               // atanTest+=-180;
            }
            let screenW=1136;
			let screenH=640;
			let delatX = cc.winSize.width / screenW;
			let delatY = cc.winSize.height / screenH;
			let serverPosX = tmpPoint.x / delatX;
            let serverPosY = tmpPoint.y / delatY;  //转化后的服务器位置
            if(_type<=0)
            {
               
                let sendData = {
                    action:PROTOCOL_SEND.MSGID_CTS_205FIRE,
                    x:serverPosX,
                    y:serverPosY,
                    type:i+1
                }
                net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_205FIRE,sendData);
                // console.log("====================发射子弹================",this.idx++,"============="+this.curGunSkillNum)
                
            }
            //SApi.send(protocol.PROTOCOL_SEND.MSGID_CTS_READYTOFIRE, sendData, this.azApp.gameSocket);
            let tmpNode=this.m_gunArr[i].getChildByName("gunSpr");
            let tmpDB=tmpNode.getComponent("dragonBones.ArmatureDisplay");
            tmpDB.playAnimation(this.curPlayAniName,1);
            
            this.updateBulletAndCannon(atanTest,100,0,0,tmpPoint,i+1);
        }
    }
    public updateBulletAndCannon(degree: number, power: number, bulletId: number,attackid:number, _touchPoint:cc.Vec2,gunIndex:number=0)
    {
        let gun=this.m_gunArr[gunIndex-1];
        let tmpR=-(90-degree);
        let isMain=0;
        if(gunIndex<=0)
        {
            this.m_playerGunNode.angle=tmpR;
            //console.log("当前炮台01=========",tmpR);
        }
        else
        {
            let gunNode=gun.getChildByName("gunSpr");
            gunNode.angle=tmpR;
            isMain=1;
          //  console.log("当前炮台=========",tmpR,this.m_gunArr,gunIndex);
        }
        this.createBullet(_touchPoint,tmpR,isMain,gunIndex);
    

    }
    //设置子弹 id
    public setBulletId(bulletId){
        //this._bulletId = bulletId
        this.m_bulletArr.push(bulletId);
        
        // console.log("设置子弹 id====",bulletId)
    }
    public setPlayerTouchPoint(_touchPoint:cc.Vec2,_type:number=0)
    {
        this.m_playerFirePoint=_touchPoint;
        //utils.instance().consoleLog("当前测试TouchStart=======",_type);
    }
    public getPlayerTouchPoint()
    {
       return this.m_playerFirePoint;
    }
    public setBulletSpawnPoint(_point:cc.Vec2=new cc.Vec2(0,0))
    {
        this.m_spwanBulletPos=_point;
    }
    public getSpawnBulletPos()
    {
        return this.m_spwanBulletPos;
    }
    public setMoney(_type:number=0,_money:number=0)
    {
        if(_type==0)
        {
            this.m_goldMoney+=_money;
        }
        else
        {
            this.m_goldMoney-=_money;
            if(this.m_goldMoney<=0)
            {
                this.m_goldMoney=0;
            }
        }
        this.updatePlayerMoney();
    }
    public updatePlayerMoney(_type:number=0)
    {
        
        if(_type==0)
        {
            this.m_moneyLabel.text=""+this.m_goldMoney;
        }
        // if(tonyInfo.instance().m_isOnLine==0)
        // {
        //     tonyInfo.instance().setPlayerMoney(this.m_goldMoney);
        // }
    }

  
    public createBullet(_touchPoint:cc.Vec2,_degree:number,isMain:number=0,_gunIndex:number=0)
    {
        //let bullet=cc.instantiate(this.m_bulletPrafab);
        this.m_createBulletN++;
       // console.log("玩家CannodID======",this.m_cannonID);
        let bulletResID=this.getBulletResID(this.m_cannonID,0);
        
        let bullet=bulletManager.instance().createBullet(0,this.m_createBulletN,bulletResID);
        if(isMain==0)
        {
            soundManager.instance().playEft("gun"+this.m_cannonID);    
        }
        
        let bulletScript=bullet.getComponent("bullet");
        let isLock=this.m_lockState;
        let bulletID=0;
        let isSelf=0;
        if(this.m_bulletArr.length>0)
        {
            bulletID=this.m_bulletArr.pop();
            //console.log("当前子弹ID=========",bulletID);
        }
        let curPlayerSeatID=tonyInfo.instance().m_playerSeatID;
        if(this.m_seatID==curPlayerSeatID)
        {
            isSelf=1;
        }
        bulletScript.setBulletId(bulletID,isSelf);
        let uid=this.m_uid;
        
        let state=this.m_lockState;
        let target=this.m_lockFishArr[_gunIndex];//tonyInfo.instance().m_lockTargetID[0];
        if(state>0)
        {
            //let target=tonyInfo.instance().m_lockTargetID[0];
            //console.log("锁定目标ID========",target,_gunIndex);
            bulletScript.setTargetID(target);

        }
        
        bullet.parent=this.m_bulletParent;

        let power=1;
        let _x=this.m_spwanBulletPos.x;
        let _y=this.m_spwanBulletPos.y;

       
        
        let dx =  0;//Math.sin(_degree/180*Math.PI)*80
        let dy =  0;//Math.cos(_degree/180*Math.PI)*80
    
    
        let dirNormlize=utils.instance().getVecNormalize(this.m_spwanBulletPos,_touchPoint);
        let bulletSpeed=this.m_bulletSpeed;
        let netAniType = 0
        let bulletIconId = 100011//普通子弹
        if(this.m_lockPropID==PROP_ID.Skill_Rampage)//狂暴速度
        {
            // bulletSpeed=bulletSpeed*1.5;
           
        }
        if(this.m_netPropID == PROP_ID.Skill_Rampage){
            netAniType = 1001
            bulletSpeed=bulletSpeed*1.5;
            bulletIconId = 1014//
        }
        
        bulletScript.resetBullet(power,_x+dx,_y+dy,dirNormlize,1,bulletSpeed,90,bulletResID,_degree,0,bulletIconId,netAniType,bulletIconId);
        bulletScript.resetBulletProperty(this.m_attackPower,this.m_ap);
        this.setBulletSpeed(bulletSpeed)
    }
    public getLockFishArr()
    {
        return this.m_curLockedFishRoomID;
    }
    public tmpStopLockEFt()
    {
        this.m_lockState=-1;
    } 
    public restartStopLockEft()
    {
        let isStop=this.m_lockIsStop;
        if(isStop>0)
        {
            this.m_lockState=1;
        }
    }
    public userItem(_itemID,_changeTarget:number=-1)
    {
        if(_itemID==CONSTITEM.ITEM_LOCK)
        {
            this.m_lockState=1;
            
            if(_changeTarget<0)
            {
                for(let i=0;i<3;i++)
                {
                    let fishID=this.m_lockFishArr[i];
                    console.log("创建锁定对象========",fishID);
                    if(fishID>=0)
                    {
                        this.setPlayerLock(i);
                    }
                }
            }
            else
            {
                this.setPlayerLock(_changeTarget);
            }
            
            
        }
        else if(_itemID==CONSTITEM.ITEM_SKILL1002)
        {
            console.log("创建双炮技能");
            this.addGun(this.m_cannonID,1);
        }
    }
    public clearLock(_index:number=-1)
    {
        if(_index<0)
        {
            for(let i=0;i<3;i++)
            {
                let lockPrefab=this.m_lockArr[i];
                if(lockPrefab)
                {
                    lockPrefab.removeFromParent();
                    lockPrefab=null;
                }
                this.m_lockArr[i]=null;
            }
        }
        else
        {
            let lockPrefab=this.m_lockArr[_index];
            if(lockPrefab)
            {
                lockPrefab.removeFromParent();
                lockPrefab=null;
            }
            this.m_lockArr[_index]=null;
            
        }
    }
    public setPlayerLock(_gunSeatID)
    {
        let lockPrefab=cc.instantiate(this.m_lockPrefab);
        
        this.m_lockArr[_gunSeatID]=lockPrefab;
        let db:dragonBones.ArmatureDisplay=lockPrefab.getComponent("dragonBones.ArmatureDisplay");
        
        db.animationName="chuxian"
        db.playAnimation("chuxian",1);
        
        db.scheduleOnce(()=>{
            db.animationName="xunhuang";
            db.playAnimation("xunhuang",0);
        },0.5)

        let eftParent=cc.find("eftCenter");
        lockPrefab.x=100;
        lockPrefab.y=100;
        lockPrefab.parent=eftParent;
    }
    public updateLockEftPos()
    {
        if(this.m_lockState==1)
        {
            for(let i=0;i<3;i++)
            {
                let id=this.m_lockFishArr[i];//tonyInfo.instance().m_lockTargetID[i]
                
                if(id>=0)
                {
                    let pos=fishManager.instance().getFishPosByRoomID(id);
                
                    if(this.m_lockArr[i])
                    {
                        if(pos)
                        {
                            this.m_lockArr[i].position=pos;
                        }
                        
                    }
                    else
                    {
                        break;
                    }
                    
                }
            }
        }
    }
    public resetLockFish(_index:number=0)
    {
        this.m_curLockedFishRoomID[_index]=-1;
    }
    private cannonEft01 = null
    private isShowEft:boolean = false
    public showCannonHintSpr(setparent:fgui.GComponent,itemName:string = "bomb_focus_tips",offset_x:number=-130,offset_y:number = 70,seatIndex:number = 0)
    {
        if(this.isShowEft)
            return
        this.isShowEft = true
        if(!this.cannonEft01 && setparent)
        {
            let tmpPoX=this.startPoint.x;
            let tmpPosY=this.startPoint.y;
            let comitem = fgui.UIPackage.createObject("game",itemName).asCom
            this.cannonEft01 = comitem.node
            this.cannonEft01.pivotX=this.cannonEft01.width/2;
            this.cannonEft01.pivotY=this.cannonEft01.height/2;
            this.cannonEft01.x = offset_x 
            this.cannonEft01.y = offset_y
            let c1 = comitem.getController("c1")
            if(c1)
                c1.selectedIndex = seatIndex < 2?0:1
            setparent.node.addChild(this.cannonEft01,-1)
        }
        
    }	
    public deleteCannonHintSpr()
    {		
        if(this.cannonEft01)
        {
            if(this.cannonEft01.parent)
            {
                this.cannonEft01.parent.removeChild(this.cannonEft01);
            }
            this.cannonEft01=null;
            this.isShowEft = false
        }
        //this.m_cmEftArr[_index].parent.removeChild(this.m_cmEftArr[_index]);
    }
    public clearPlayerInfo()
    {
      
        if(this.m_playerGun)
        {
            this.m_playerGun.removeFromParent();
            this.m_playerGun=null;
            
        }
       
        console.log("clearChangeTaraget============");
        

    }
    
    public getBulletPower():number
    {
        return this.m_bulletPower;
    }
    public setMaxBulletPower(_bulletPower:number)
    {
        this.m_maxBulletPower=_bulletPower;
    }
    public getMaxBulletPower():number
    {
        return this.m_maxBulletPower;
    }
    public setHeadIconID(_headIconID:number)
    {
        this.m_headIconID=_headIconID;
    }
    public getHeadIconID():number
    {
        return this.m_headIconID;
    }
    public setNickName(_nickName:string)
    {
        this.m_nickName=_nickName;
    }
    public getNickName():string
    {
        return this.m_nickName;
    }
    public setVipLevel(_vipLevel:number)
    {
        this.m_vipLevel=_vipLevel;
    }
    public getVipLevel():number
    {
        return this.m_vipLevel;
    }
    public setCannonID(_cannonID:number)
    {
        this.m_cannonID=_cannonID;
    }
    public getCannonID():number
    {
        return this.m_cannonID;
    }
    public setGender(_gender:number)
    {
        this.m_gender=_gender;
    }
    public getGender():number
    {
        return this.m_gender;
    }
    public setGameLevel(_gameLevel:number)
    {
        this.m_gameLevel=_gameLevel;
    }
    public getGameLevel():number
    {
        return this.m_gameLevel;
    }
    public setLotteryN(_lotterN:number)
    {
        this.m_lotteryN=_lotterN;
    }
    public getLotteryN():number
    {
        return this.m_lotteryN;
    }
    
    public getDiamondN():number
    {

        return this.m_diamondN;
    }
    public setBulletReboundN(_bulletReboundN:number)
    {
        this.m_bulletReboundN=_bulletReboundN;
    }
    public getBulletReboundN():number
    {
        return this.m_bulletReboundN;
    }
    public setBulletSpeed(_bulletSpeed:number)
    {
        this.m_bulletSpeed=_bulletSpeed;
    }
    public getBulletSpeed():number
    {
        return this.m_bulletSpeed;
    }
    public getUID():number
    {
        return this.m_uid;
    }
    public setUID(uid:number)
    {
        this.m_uid = uid;
    }
    public getUIIndex()
    {
        return this.m_uiIndex;
    }
    public setApLeftTime(data)
    {
        this.m_apLeftTime=data;
    }
    public getApLeftTime()
    {
        return this.m_apLeftTime;
    }
    public setApScore(data)
    {
        this.m_apScore=data;
    }
    public setApAddScore(data)
    {
        this.m_apScore+=data;
    }
    public getApScore()
    {
        return this.m_apScore;
    }
    public setApFirePower(data)
    {
        this.m_apFirePower=data;
    }
    public getApFirePower()
    {
        return this.m_apFirePower;
    }
    public setApRank(data)
    {
        this.m_apRank=data;
    }
    public getApRank()
    {
        return this.m_apRank;
    }
    
   public gameLoop(dt){
    //    if(!this.m_txt_money)
    //         return
    //     if(this.updateInfoTimes > 0 && this.stepMoneyNum> 0){
    //         this.updateInfoTimes --;
    //         this.showJumpNum += this.stepMoneyNum;
    //         if(this.showJumpNum <= this.m_goldMoney){
    //             this.m_txt_money.text =utils.instance().getSetStrNum( this.showJumpNum);
    //             // console.log("=========金币变化==========="+this.lastMoneyNum)
    //         }
    //         else{
    //             this.m_txt_money.text = utils.instance().getSetStrNum(this.m_goldMoney);
    //         }
           
    //     }
   }
}