import { utils } from "../globle/utils";
import { preloadRes } from "../globle/preloadRes";
import { config } from "../globle/config";
import { tonyInfo } from "../globle/tonyInfo";
export class fishManager {
    private static ince:fishManager;
    private m_fishprefab:cc.Prefab=null;
    private m_fishPool:cc.NodePool=null;
    private m_fishArr:Array<cc.AnimationClip>=[];
    private m_allFishList = {};
    private m_allFishCnt=0;
    private m_lastMC=-1;
    private m_fishParent:cc.Node=null;
    private m_bossParent:cc.Node=null;
    private m_shadowParent:cc.Node=null;
    private m_isBoomState=0; //给所有鱼加核弹状态 是否在核弹准备状态 1==是 0==不是
    private m_screenBoundary=50;
    private testDB:dragonBones.ArmatureDisplay=null;
    private m_fishDef=null;
    public static instance(): fishManager{
        if(this.ince == undefined){
            
            this.ince = new fishManager();
            
        }
        return this.ince;
    }
    public initFishManager()
    {
        console.log("初始化FishPool=======",this.m_fishPool);
        this.m_fishprefab=preloadRes.instance().m_fishPrefab;
        this.m_fishPool=new cc.NodePool();
        // this.m_bossParent=cc.find("bossCenter");
        // this.m_shadowParent=cc.find("shadowCenter");
        
    }
    public pushFishToPool(_fish)
    {
        if(this.m_fishPool)
            this.m_fishPool.put(_fish);
    }
    public createFish(_type:number,_roomFishID:number,_fishID:number=0,_fileLine:number,moveTime:number,_delayTime:number=0,_fishData):cc.Node
    {
        //let fish=
        let isFishExit = this.m_allFishList[_roomFishID]
        if(isFishExit){
            utils.instance().consoleLog("=======鱼重复创建======"+_roomFishID);
            return null
        }
        let isFromCache=0;
       
        let poolSize= this.m_fishPool == null ? 0 : this.m_fishPool.size();
        let tmpFish=null;
        if(poolSize<=0)
        {
            tmpFish=cc.instantiate(this.m_fishprefab);
        }
        else
        {
           tmpFish=this.m_fishPool.get();
           // isFromCache=1;
           // console.log("getFishFromCache=============",_roomFishID,poolSize,tmpFish);
            //重置鱼信息
        }
        // _fishID =4;
        let resFishID=_fishID;//config.instance().getFihsResID(_fishID);
        let fishClisp02:cc.AnimationClip=preloadRes.instance().getFishRes(resFishID);
        if(!fishClisp02)
        {   
            utils.instance().consoleLog("找不到鱼======"+resFishID);
        }
        let fishNode=tmpFish.getChildByName("fishNode");
    
        
        if(_type!=8)
        {   
            tmpFish.parent=this.m_fishParent;
        }
        else
        {
            tmpFish.parent=this.m_bossParent;
        }
        
        let animation:cc.Animation=fishNode.getComponent("cc.Animation");
        //console.log("当前MC数量======",animation.getClips());
        if(fishClisp02){
            animation.addClip(fishClisp02);
            animation.play("fish_"+resFishID);
        }
        
        // console.log("+++++++++++++++++++++++"+resFishID)
      
       
        
        let fishSize=config.instance().getFishColliderSize(resFishID);
        let boxSize:cc.BoxCollider=fishNode.getComponent("cc.BoxCollider");
        boxSize.size=cc.size(fishSize[0],fishSize[1]);
        boxSize.offset.x=fishSize[2];
        boxSize.offset.y=fishSize[3];


        let fishScript=tmpFish.getComponent("fish");
        let isRota=fishSize[4];
        fishScript.resestFish(_type,_roomFishID,resFishID,_fileLine,moveTime,fishClisp02,_delayTime,isRota,_fishData);
       
        this.m_allFishList[_roomFishID]=tmpFish;
        this.m_allFishCnt++;
        let logLable:cc.Node=tmpFish.getChildByName("log");
         
        let logCom=logLable.getComponent("cc.Label");
        logCom.string=_roomFishID+"=="+_fishID+"=="+_fileLine;
        //logCom.string="Dealy=="+_delayTime;

        
    

       logLable.active=false;

       let hpLable:cc.Node=tmpFish.getChildByName("HP");
       let hpCom=hpLable.getComponent("cc.Label");
       hpCom.string="HP="+_fishData.HP+"DF="+_fishData.def;
      // hpLable.active=false;
        //--去掉FishTrim开始--
        let trimArr=[103,10,15,28,0,108,7,4];
        let len01=trimArr.length;
        let isTrim=0;
        for(let i=0;i<len01;i++)
        {
            let tmpID=trimArr[i];
            if(tmpID==resFishID)
            {
                isTrim=1;
                break;
            }
        }
        let sprSizeMode=cc.Sprite.SizeMode.TRIMMED;
        let sprTrim=true;
        if(isTrim==1)
        {
            sprSizeMode=cc.Sprite.SizeMode.RAW;
            sprTrim=false;
        }

        let spr:cc.Sprite=fishNode.getComponent("cc.Sprite");
        spr.sizeMode=sprSizeMode;
        spr.trim=sprTrim;
        //--去掉FishTrim结束--


        //let fishImageNode=this.createFishImg(202,null);

        return tmpFish;

    }
    public setFishPrefab(_parent:cc.Node)
    {
        this.m_fishParent=_parent;
        
    }
    public getAllFishCnt()
    {
        return this.m_allFishCnt;
    }
    public checkBulletIsCollider(_x:number=0,_y:number=0,_isLock:number=-1)
    {
        let colliderArr=[];
        if(this.m_allFishCnt<=0)
        {
            return colliderArr;
        }
        let isCollider=0;
        let colliderFish=null;
        
        let i_str;
        let tmpFish:cc.Node=null;
        for(i_str in this.m_allFishList)
        {
            tmpFish=this.m_allFishList[i_str];
            if(tmpFish)
            {
                if(tmpFish.name!="")
                {
                    
                
                    let fishScript=tmpFish.getComponent("fish");
                    let freezState=fishScript.getBeFreeze();
                    let state=fishScript.getFishState();
                    let roomID=fishScript.getFishRoomID();
                   
                    
                    if(state>0)//是否被释放了
                    {
                        let isCheck=0;
                        if(roomID>=0&&roomID==_isLock)
                        {
                            isCheck=1;
                        }
                        else if(_isLock<=0)
                        {
                            isCheck=1;
                        }
                        if(isCheck==1)
                        {
                            let fishX=tmpFish.x;
                            let fishY=tmpFish.y;
                            let fishNode=tmpFish.getChildByName("fishNode");
                            let boxSize:cc.BoxCollider=fishNode.getComponent("cc.BoxCollider");
                            let w=boxSize.size.width;
                            let h=boxSize.size.height;
                            let posX=tmpFish.x-boxSize.offset.x;
                            let posY=tmpFish.y-boxSize.offset.y;
                            let fishID=fishScript.getFishID();
                            if(_x<=posX+w/2 &&_x>=posX-w/2)
                            {
                                if(_y<=posY+h/2&&_y>=posY-h/2)
                                {
                                   
                                    isCollider=1;
                                    colliderFish=tmpFish;
                                    
                                   

                                    colliderArr.push(isCollider);
                                    colliderArr.push(colliderFish);

                                    break;
                                    
                                }
                               
                            }
                            
                        }
                    }
                
                 }
            }
        }
        return colliderArr;
    }
    public gameLoop(dt:number)
    {
        if(this.m_allFishCnt<=0)
        {
            return ;
        }
        let i_str;
        let tmpFish:cc.Node=null;
        let isFreez=tonyInfo.instance().m_freezeState;
        let nuclearState=this.getBoomState();
        for(i_str in this.m_allFishList)
        {
            tmpFish=this.m_allFishList[i_str];
            if(tmpFish)
            {
                if(tmpFish.name!="")
                {
                    
                    
                    let fishScript=tmpFish.getComponent("fish");
                    let freezState=fishScript.getBeFreeze();
                    let state=fishScript.getFishState();
                    let delayTime=fishScript.getDelayTime();
                   
                    if(state<=0&&delayTime<=0)//是否被释放了
                    {
                       
                        // console.log("删除当前鱼=01====",state,tmpFish.uuid);
                        this.pushFishToPool(tmpFish);
                        delete this.m_allFishList[i_str];
                        this.m_allFishCnt--;
                        break;
                    }

                    if(isFreez==1)
                    {               
                        if(freezState==0)
                        {
                            fishScript.setBeFreeze(1);
                        }              
                            
                        }
                        else if(isFreez==0)
                        {
                            if(freezState==1)
                            {
                                fishScript.setBeFreeze(0);
                            }
                            
                        }
                 }
                 else
                 {
                    delete this.m_allFishList[i_str];
                    this.m_allFishCnt--;
                 }
            }
        }

    }
    public getSelectFishID(_touchPoint:cc.Vec2)
    {
        let fishID=-1;
        let i_str;
        let tmpFish:cc.Node=null;
        let self=this;
        for(i_str in this.m_allFishList)
        {
            tmpFish=this.m_allFishList[i_str];
            if(tmpFish)
            {
                let fishNode=tmpFish.getChildByName("fishNode");
                let boxSize:cc.BoxCollider=fishNode.getComponent("cc.BoxCollider");
                let w=boxSize.size.width;
                let h=boxSize.size.height;
                let posX=tmpFish.x;
                let posY=tmpFish.y;
                if(_touchPoint.x<=posX+w/2 &&_touchPoint.x>=posX-w/2)
                {
                    if(_touchPoint.y<=posY+h/2&&_touchPoint.y>=posY-h/2)
                    {
                        
                        let fishScript=tmpFish.getComponent("fish");
                        fishID=fishScript.getFishRoomID();
                        if(fishScript.m_deadState == 1){
                           fishID = -1
                        }
                        //eftManager.instance().createEft(posX,posY)

                        utils.instance().consoleLog("当前碰撞的鱼8888888888==="+fishID);
                        break;
                    }
                }
                
            }
        }
        return fishID;
    }
    public getSelectFishScript(_touchPoint:cc.Vec2)
    {
        let fishID=-1;
        let i_str;
        let fishScript = null
        let tmpFish:cc.Node=null;
        let self=this;
        for(i_str in this.m_allFishList)
        {
            tmpFish=this.m_allFishList[i_str];
            if(tmpFish)
            {
                let fishNode=tmpFish.getChildByName("fishNode");
                let boxSize:cc.BoxCollider=fishNode.getComponent("cc.BoxCollider");
                let w=boxSize.size.width;
                let h=boxSize.size.height;
                let posX=tmpFish.x;
                let posY=tmpFish.y;
                if(_touchPoint.x<=posX+w/2 &&_touchPoint.x>=posX-w/2)
                {
                    if(_touchPoint.y<=posY+h/2&&_touchPoint.y>=posY-h/2)
                    {
                        
                        let fishScript=tmpFish.getComponent("fish");
                        fishID=fishScript.getFishRoomID();
                        
                        //eftManager.instance().createEft(posX,posY)

                        utils.instance().consoleLog("当前碰撞的鱼==="+fishID);
                        break;
                    }
                }
                
            }
        }
        return fishScript;
    }
    public getLockTargetFishID()
    {
        let len=this.m_allFishCnt;
        let fishID=null;
        let ranN=Math.floor(Math.random()*len);
        let index=0;
        if(ranN>0)
        {
            ranN=ranN-1;
        }
        for(let i_str in this.m_allFishList)
        {
            if(index==ranN)
            {
                let isOUt=this.checkFishIsOutOfScreen(i_str);
                if(isOUt!=1)
                {
                    fishID=i_str;
                }
                //console.log('鱼是否游出屏幕======',isOUt);
                
            }
            index++;
        }
        if(!fishID)
        {
            fishID=-1;
        }
        return fishID;

    }
    public getFishByRoomID(_roomID:number):cc.Node
    {
        let fish:cc.Node=null;

        fish=this.m_allFishList[_roomID];

        return fish;
    }
    public checkFishIsInFishery()
    {
        
        let i_str;
        let tmpFish:cc.Node=null;
        let isHave=0;
        for(i_str in this.m_allFishList)
        {
            tmpFish=this.m_allFishList[i_str];
            if(tmpFish)
            {
                let posX=tmpFish.x;
                let posY=tmpFish.y;
                if(posX>this.m_screenBoundary&&posX<cc.winSize.width-this.m_screenBoundary)
                {
                    if(posY>this.m_screenBoundary&&posY<=cc.winSize.height-this.m_screenBoundary)
                    {
                        
                        isHave=1;
                        break;
                    }
                }
            
            }
        }
        return isHave;
    }
    public checkFishIsOutOfScreen(_roomID)
    {
        let isOut=0;

        let fish=this.m_allFishList[_roomID];
        if(fish)
        {
            let posX=fish.x;
            let posY=fish.y;
            if(posX<this.m_screenBoundary||posX>cc.winSize.width-this.m_screenBoundary)
            {
                isOut=1;
               
            }
            if(isOut<=0)
            {
                if(posY<this.m_screenBoundary||posY>=cc.winSize.height-this.m_screenBoundary)
                {
                    isOut=1;
                }
            }
            if(isOut==1)
            {
                // let fishScript=fish.getComponent("fish");
                // fishScript.clearLockEft();
            }
        }
        else
        {
            isOut=1;
        }
        return isOut;
    }
    public getFishScore(_fishID)
    {
        let score=0;
        // if(!this.m_fishDef)
        // {
        //     let fishConfig=preloadRes.instance().getFishConfig();
        //     this.m_fishDef=fishConfig;
        // }
        // if(this.m_fishDef[_fishID])
        // {
        //     score=parseInt(this.m_fishDef[_fishID][2]);
        // }
        let fishCfg =   config.getFishCfgDataByID(_fishID)
        if(fishCfg){
            score = parseInt(fishCfg["Score"])
        }
        return score;
    }
    public getHighScoreFish()
    {
        let highScore=0;
        let i_str;
        let tmpFish:cc.Node=null;
        let fishScript = null
        let isLock = 0
        let fishRoomID=-1;
        
        // if(!this.m_fishDef)
        // {
        //     let fishConfig=preloadRes.instance().getFishConfig();
        //     this.m_fishDef=fishConfig;
        // }
        for(i_str in this.m_allFishList)
        {
            tmpFish=this.m_allFishList[i_str];
            if(tmpFish)
            {
                let posX=tmpFish.x;
                let posY=tmpFish.y;
                
                if(posX>this.m_screenBoundary&&posX<cc.winSize.width-this.m_screenBoundary)
                {
                    if(posY>this.m_screenBoundary&&posY<=cc.winSize.height-this.m_screenBoundary)
                    {   fishScript=tmpFish.getComponent("fish");
                        let tmpState=fishScript.m_fishDeadState;
                        let lockState = fishScript.m_isShowLock;
                        let deadState=fishScript.m_deadState;
                        if(tmpState>0 || !lockState||deadState>0)
                        {
                            continue;
                        }
                        let fishID=fishScript.getFishID(); 
                        // if(this.m_fishDef[fishID])
                        // {
                            // let score=parseInt(this.m_fishDef[fishID][2]);
                            let score = 0
                            let fishCfg =  config.getFishCfgDataByID(fishID)
                            if(fishCfg){
                                score = parseInt(fishCfg["LockRule"])
                            }

                            if(score>highScore)
                            {
                                highScore=score;
                                fishRoomID=fishScript.getFishRoomID();   
                            }
                        //  }
                    }
                }
            
            }
        }
        return fishRoomID;
    }
    public getFishPosByRoomID(_roomID)
    {
        let fish=this.m_allFishList[_roomID];
        let posX=0;
        let posY=0;
        let pos=null;
        if(fish)
        {
            let fishScript= fish.getComponent("fish");
            pos=fishScript.getFishPosAtFishLine();
        }
       
        return pos;
    }
    public getAllFish(){
        return this.m_allFishList
    }

    public getAllFishRoomID(){
        let fishRoomIDArr=[];
        let i_str;
        for (i_str in this.m_allFishList) {
            let fish = this.m_allFishList[i_str];
            let fishScript= fish.getComponent("fish");
            fishRoomIDArr.push(fishScript.getFishRoomID());
        }
        return fishRoomIDArr;
    }
    
    public userLockItem()
    {
        
    }

    public clearAllFish(_state:number=1,isAll:boolean = false)
    {
        let i_str;
        let fish:cc.Node=null;
       
        for (i_str in this.m_allFishList) {
            fish = this.m_allFishList[i_str];
            let fishScript=fish.getComponent("fish");
            let isClearAll = isAll || fishScript.m_deadState != 1
            if(fish && isClearAll)
            {
                let fishScript=fish.getComponent("fish");
                fishScript.removeFromParentFunc(1);
                fish.destroy();

                delete this.m_allFishList[i_str];
                this.m_allFishCnt--;
            }
        }
        this.m_allFishCnt=0;
        this.m_allFishList = [];
       
        if(_state==1)
        {
            if(this.m_fishPool)
            {
                this.m_fishPool.clear();
            }
            this.m_fishPool=null;
            utils.instance().consoleLog("清楚鱼缓存=======");
        }
        
    }
    public setBoomState(_state)
    {
        this.m_isBoomState=_state;
    }
    public getBoomState()
    {
        return this.m_isBoomState;
    }

    public getThunderFishArr()
    {
        let fishRoomIDArr=[];
        let i_str;
        let cnt=0;
        for (i_str in this.m_allFishList) {
            let fish = this.m_allFishList[i_str];
            let fishScript= fish.getComponent("fish");
            let score = utils.instance().getFishScoreByID(fishScript.getFishID());
            if(cnt<=10 && score <= 20)
            {
                fishRoomIDArr.push(fishScript.getFishRoomID());
                cnt++;
            }
            if(cnt > 10){
                break
            }
        }
        
        return fishRoomIDArr;
    }

    public getHeidongFish(){
        let i_str;
        let fish;
        for (i_str in this.m_allFishList) {
            fish = this.m_allFishList[i_str];
            let fishScript=fish.getComponent("fish");
            let ftype = fishScript.getFishType()
            if(ftype == 3){
                break
            }
        }
        return fish
    }
  
}