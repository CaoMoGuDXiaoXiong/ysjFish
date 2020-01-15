import { utils } from "../globle/utils";
import { preloadRes } from "../globle/preloadRes";
import { tonyInfo } from "../globle/tonyInfo";
import { config } from "../globle/config";
import { PROP_ID } from "../globle/globle";
import { fntManager } from "./fntManager";
import { eventManager } from "../globle/eventManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class fish extends cc.Component {


    // LIFE-CYCLE CALLBACKS:
    private m_lastPosX=-1;
    private m_lastPosY=-1;
    private m_time=0;
    private m_linexoff:number=0;
    private m_lineyoff:number=0;
    private m_xoff:number=0;
    private m_yoff:number=0;
    private m_isFlipX=false;
    private m_fishlineObj=null;
    public m_fishState=0; //0==闲置状态
    private m_fishRoomID=-1;
    private m_fishType=0;
    private m_fishID=0;
    private m_beLocked=-1;
    private m_mc:cc.AnimationClip=null;
    private m_fishNode:cc.Node=null;
    private m_beFreeze=0;
    private m_beStop=0;
    private m_fishDelayTime:number=0;
    private m_testN=0;
    private m_isNew=0;
    private m_testN02=0;
    private m_dirX=0;
    private m_dirY=0;
    private m_isReadyShowBHE=-1; //是否显示核弹准备的鱼身上的提示
    private m_beIsSuccessAdd = 0;//是否已经添加成功
    private m_boomHintEft=null;
    private m_isOutState=0;
    public m_testColliderCnt=0;
    private m_isFirstGame:boolean = true;//是否第一次创建
    public m_isShowBHE:boolean = true;//是否显示核弹状态
    public m_isShowLock:boolean = true;//是否显示锁定状态
    private m_fishDeadState=0;
    private m_deadRotaN=0;
    public m_shadow:cc.Node=null;
    public m_deadState=0;//1==被标记为死亡
    public m_isRota=0;//1==不旋转
    private m_isInit=-1;
    private m_HP=0;
    private m_DEF=0;
    private m_totalHP=0;
    private m_fishData=null;
    private m_hitResult=0;
    @property(cc.Integer)
    public m_fishLineID:number=-1;
    @property(cc.Integer)
    public m_testCnt:number=0;
     onLoad () {

        //this.m_fishLineID=1;
       this.m_fishlineObj=preloadRes.instance().getFishLineVo();
       //console.log("获得鱼线对象====",this.m_fishlineObj);
     }


    start () {
      
    }
    resestFish(_type:number,_roomFishID:number,_fishID:number,_fishLine:number,_moveTime:number,_mc:cc.AnimationClip,_delayTime:number=0,_isRota:number=0,_fishData)
    {
      
      if(!this.m_fishlineObj)
      {
         this.m_fishlineObj=preloadRes.instance().getFishLineVo();
         console.log("重新获得鱼线对象====",this.m_fishlineObj);
      }
      
      this.m_fishType=_type;
      this.m_fishRoomID=_roomFishID;
      this.m_fishID=_fishID;
      this.m_fishLineID=_fishLine;
      this.m_time=_moveTime/1000;    
      this.m_fishState=1;
      this.m_isNew=1;
      this.m_mc=_mc;
      //this.node.opacity=0;
      
      let self=this;
      this.node.x=-150;
      this.node.y=0; 
      this.m_beFreeze=0;
      this.m_beStop = 0
      this.m_testColliderCnt=0;
      // let act=cc.fadeIn(0.5);
      this.node.opacity=255;

      this.m_isRota=_isRota;
      // this.node.runAction(act)
      this.m_fishNode=this.node.getChildByName("fishNode");
      this.node.angle=0;
      if(this.m_fishLineID>0)
      {
         this.m_fishDelayTime=_delayTime/1000;
         this.m_fishDelayTime=0;
         if(this.m_fishDelayTime>0)
         {
            this.changeFishPos(-100, 0);
         }
        // utils.instance().consoleLog("当前鱼线01========",this.m_fishLineID,this.m_fishRoomID);
         let tPosAndDirVo: ML.TPosAndDirVo=  this.m_fishlineObj.getPosAndDir(this.m_fishLineID,0.01);
         //&&this.m_isRota==0
         if(tPosAndDirVo.dirX<0)
         {
            this.m_isFlipX=true;
            this.m_fishNode.scaleX=-1;
           
         }
         if(this.m_fishID==202)
         {
            console.log("我是boss");
         }
      }
      this.m_isFirstGame = true
      
      // let ani:cc.Animation=this.m_fishNode.getComponent("cc.Animation");
      // ani.play("fish_"+this.m_fishID,0);
      this.scheduleOnce(function(){
         this.m_isFirstGame = false
      }.bind(this),0.001)

      this.upDateFish(0.01)
      this.m_isInit=1;
      this.m_fishData=_fishData;
      this.setPropertyData();
      
      //console.log("当前鱼====",this.m_fishDelayTime,this.m_fishRoomID,this.m_fishLineID,this.m_fishState);
    }
    setPropertyData()
    {
      
    
      this.m_HP=this.m_fishData.HP;
      this.m_totalHP=this.m_fishData.HP;
      this.m_DEF=this.m_fishData.def;

    }
    getFishTotalHP()
    {
       return this.m_totalHP;
    }
    fishIsDead(_actPower,_ap)
    {
       let tmpDF=this.m_DEF*_ap;
       let resultN=tmpDF-_actPower;
       if(resultN>=0)
       {
          resultN=1;
       }
       else
       {
          resultN=-resultN;
       }
       this.m_hitResult=resultN;
       this.m_HP-=resultN;
       if(this.m_HP<=0)
       {
          this.m_HP=0;
          this.removeFromParentFunc(0);
       }
       this.updateFishLog();
    }
    updateFishLog()
    {
      let hpLable:cc.Node=this.node.getChildByName("HP");
      let hpCom=hpLable.getComponent("cc.Label");
      hpCom.string="HP="+this.m_HP+"DF="+this.m_DEF;
      //hpCom.active=false;
    }
    updateFishHP(_hp)
    {
       this.m_HP=_hp;
       this.updateFishLog();
    }
    resetPropertyData()
    {
      this.m_HP=0;
      this.m_DEF=0;
      this.m_hitResult=0;
    }
    public getIsNew()
    {
       return this.m_isNew;
    }
    public getDelayTime()
    {
       return this.m_fishDelayTime;
    }
    resetFishData(){
      this.m_beIsSuccessAdd=0;
      this.m_isReadyShowBHE=-1;
      this.m_beLocked = -1
      this.m_isShowBHE = true;//是否显示核弹状态
      this.m_isShowLock = true;//是否显示锁定状态
    }
    getFishStartPos(){
     let pos = this.m_fishlineObj.getPosAndDir(this.m_fishLineID,0.1);
     return pos
    }
    getLockState()
    {
       return this.m_beLocked;
    }
    setFishState(_state:number=0)
    {
      console.log("重新设置fishstate==",this.m_fishRoomID,_state);
      this.m_fishState=_state;
    }
    getFishState()
    {
       return this.m_fishState;
    }
    getFishRoomID()
    {
       return this.m_fishRoomID;
    }
    setFishLineID(_fishLineID)
    {
       this.m_fishLineID=_fishLineID;
    }
    getFishType()
    {
       return this.m_fishType;
    }
    getFishID()
    {
       return this.m_fishID;
    }
    setBeFreeze(_state:number)
    {
       
      let ani:cc.Animation=this.m_fishNode.getComponent("cc.Animation");
      // let shadowAni:cc.Animation=this.m_shadow.getComponent("cc.Animation");
       if(_state==1)
       {
         if(!this.m_isFirstGame){
            ani.stop();   
           // shadowAni.stop();
            this.m_beFreeze=_state;
         }else{
            this.scheduleOnce(function(){
               ani.stop(); 
               // shadowAni.stop();
               this.m_beFreeze = 1; 
            }.bind(this),0.001)
         }       
       }
       else if(_state==0 && this.m_beStop == 0)
       {
         ani.play("fish_"+this.m_fishID,0);
         //shadowAni.play("fishs_"+this.m_fishID,0);
         this.m_beFreeze=_state;
       }
      
    }
    getBeFreeze()
    {
       return this.m_beFreeze;
    }

    setBeStop(_state:number)
    {
      let ani:cc.Animation=this.m_fishNode.getComponent("cc.Animation");
       let shadowAni:cc.Animation=this.m_shadow.getComponent("cc.Animation");
       if(_state==1 )
       {
         if(!this.m_isFirstGame){
            ani.stop();   
            this.m_beStop=_state;
             shadowAni.stop();
         }else{
            this.scheduleOnce(function(){
               ani.stop(); 
                shadowAni.stop();
               this.m_beStop = 1; 
            }.bind(this),0.001)
         }       
       }
       else if(_state==0 && this.m_beFreeze == 0)
       {
         ani.play("fish_"+this.m_fishID,0);
          shadowAni.play("fishs_"+this.m_fishID,0);
         this.m_beStop=_state;
       }
       
    }
    getBeStop()
    {
       return this.m_beStop;
    }
    public setFishCreateFromState(_state:number,_delayTime:number=-1)
    {
      
      this.m_fishDelayTime=_delayTime/1000;
      if(this.m_fishDelayTime>0)
      {
         this.changeFishPos(-2000, 0);
      }
    }
    changeFishPos(_posX,_posY)
    {
      this.node.x=_posX;
      this.node.y=_posY; 
      if(this.m_shadow)
      {
         this.m_shadow.x=_posX;
         this.m_shadow.y=_posY-100;
      }
      
    }
    getFishPos()
    {
      return this.node.position
    }
    setFishDeadState(_state:number=0)
    {
       this.m_deadState=_state;
       
      // cc.director.emit(""+this.m_fishRoomID,2);
    }
    clearFishData()
    {
     // console.log("当前鱼死亡=====",this.m_fishRoomID,this.node.uuid);
      this.node.removeFromParent();
      if(this.m_shadow)
         this.m_shadow.removeFromParent();
      this.node.x=-150;
      this.node.y=0; 
      this.node.opacity=255; 
      this.node.angle=0;
      this.m_testN=0;
      
      this.m_isNew=0;
      this.node.scaleX=1.0;
      this.node.scaleY=1.0;
      this.m_fishNode.scaleX=1;
      this.m_isFlipX=false;
      this.m_beLocked=-1;
      this.m_fishDelayTime=0;
      this.m_fishState=0;
      this.m_deadRotaN=0;
      this.m_fishDeadState=0;
      this.m_isInit=-1;
      this.m_isRota=0;
      this.resetPropertyData();
      if(this.m_isOutState!=3)
      {
         
      }
      this.m_isOutState=0;
      let spr01=this.m_fishNode.getComponent("cc.Sprite");
      //ShaderManager.instance().setShader(spr01,0);
      
      let childLen=this.node.getChildByName("eftPrefab");
      let isHave=1;
      this.m_fishLineID=0;
      this.m_deadState=0;
      
     // cc.director.emit(""+this.m_fishRoomID,2);
      
    }
    
    public setlinexyoff(x: number, y: number): void{
      this.m_linexoff = x;
      this.m_lineyoff = y;
    }
    public setxyoff(x:number, y:number): void{
      this.m_xoff = x;
      this.m_yoff = y;
   }
   public getFishPosAtFishLine()
   {
      let tPosAndDirVo: ML.TPosAndDirVo=  this.m_fishlineObj.getPosAndDir(this.m_fishLineID,this.m_time);

      let pos=new cc.Vec2(tPosAndDirVo.posX,tPosAndDirVo.posY);

      return pos;
   }
    public clearLockEft()
    {
      
    }
    private calOffset(x: number, y: number, xd: number, yd: number, offsetx: number, offsety: number): cc.Vec2{
      let p:cc.Vec2=new cc.Vec2(0,0);
      let t: number = Math.sqrt(xd*xd+yd*yd)
      p.x = x + offsetx*xd/t - offsety*yd/t
      p.y = y + offsetx*yd/t + offsety*xd/t
      return p;
   }
    /** 通过相对于当前时间 与下一时间差 获取位置*/
		public get_DiffTime_FishPos(difTime:number):cc.Vec2{
			let tempPos:Array<number> = [];
			let tempX:number;
			let tempY:number;
			if(!this.m_fishLineID)
				return
         //let tPosAndDirVo: ML.TPosAndDirVo = data.Config.getFishLine().getPosAndDir(this.fishLine, this._time+difTime);
         if(this.m_beFreeze>0)
         {
            difTime=0;
         }
         let tPosAndDirVo: ML.TPosAndDirVo=  this.m_fishlineObj.getPosAndDir(this.m_fishLineID,this.m_time+difTime);
         let playerSeat=tonyInfo.instance().m_playerSeatID;
         let fishRoomID=this.m_fishRoomID;
         let fishX=this.node.x;
         let fishY=this.node.y;
         if(tPosAndDirVo.isBol)
         {
            tempX=tPosAndDirVo.posX;
            tempY=tPosAndDirVo.posY;
            if(this.m_xoff != 0 || this.m_yoff != 0){
               //let tempP = this.calOffset(tempX,tempY,tPosAndDirVo.dirX,tPosAndDirVo.dirY,this.xoff,this.yoff*(seatNum>1?-1:1));
               let tempP = this.calOffset(tempX,tempY,tPosAndDirVo.dirX,tPosAndDirVo.dirY,this.m_xoff,this.m_yoff);
               tempX = tempP.x;
               tempY = tempP.y;
            }

            
            let tmpPos=utils.instance().getServerToClient(tempX,tempY);
            tempX=tmpPos.x;
            tempY=tmpPos.y;
            if(playerSeat>=2)
            {
               tempY=cc.winSize.height-tmpPos.y;
            }
            
         }
         else
         {
            tempX=this.node.x;
            tempY=this.node.y;
         }
         
         

         let pos=new cc.Vec2(tempX,tempY);
			return pos;
		}
    removeFromParentFunc(_type:number=0)
    {

      
      // utils.instance().consoleLog("当前鱼清理======",this.m_fishState,this.m_fishRoomID,this.m_fishLineID);
      this.m_fishDeadState=1;
       let animation:cc.Animation=this.m_fishNode.getComponent("cc.Animation");
       if(this.m_mc)
         animation.removeClip(this.m_mc,true);
       if(this.m_shadow)
       {
         let shadowAni:cc.Animation=this.m_shadow.getComponent("cc.Animation");
         if(this.m_mc)
            shadowAni.removeClip(this.m_mc,true);
       }
       
       
       if(_type==0)
       {
          let score=this.m_fishData.score;
          let itemType=0;
          let fishDropData=
          {
             "ID":this.m_fishID,
            "score":score,
            "itemType":itemType,
            "posX":this.node.x,
            "posY":this.node.y
          };
         // cc.director.emit("fishDead",fishDropData);
          let self=this;
          this.setFishDeadState(1);
          let callBackF=cc.callFunc(()=>{
            //self.clearFishData();
          },this);
          this.node.runAction(cc.sequence(cc.fadeOut(1),callBackF));
          let tmpData=
         {
            type:2,
            ID:this.m_fishRoomID
         }
         eventManager.emit("fishOut",tmpData);//鱼被击杀
          animation.schedule(()=>{
             self.fishrp(self.node.angle)

         },0.05,15);
       }
       else
       {
          this.clearFishData();
       }
    }
    public checkFishIsOutOfScreen(off:number = 0) :number
		{
			let isOutOfScreen=0;
			let curPosX=this.node.x;
			let curPosY=this.node.y;

			let stageW=cc.winSize.width;
			let stageH=cc.winSize.height;
			
			if(curPosX>=stageW || curPosX<=off)
			{
				isOutOfScreen=1;
			}
			if(isOutOfScreen<=0)
			{
				if(curPosY>=stageH||curPosY<=off)
				{
					isOutOfScreen=1;
				}
			}

			return isOutOfScreen;
      }
      
        private nuclearFishType = null
		public isNuclearFish()
        {
            let isNuclearFish=0;
            if(!this.nuclearFishType){
               this.nuclearFishType = []
               let bombData = config.getItemCfgDataByID(PROP_ID.Bullet_Bomb)
               if(bombData){
                  let _addfish = bombData.AddFish.split('-') || []
                  for(let i=0;i<_addfish.length;i++){
                     this.nuclearFishType.push(parseInt(_addfish[i]))
                  }
         
               }
            }
            for(let i=0;i<this.nuclearFishType.length;i++){
               if(this.m_fishType == this.nuclearFishType[i]){
                  isNuclearFish=1;
                     break;
               }
            }
            return isNuclearFish;
        }
      private  addBoomHintEftToFish()
		{
         let state=this.m_isReadyShowBHE;
			if(state >= 0)
			{
               //state ==1 可以添加效果  sucess<=0 没有添加成功
               let isNuclearFish=this.isNuclearFish();
               let isOutOfScreen=this.checkFishIsOutOfScreen();
               if(isNuclearFish==1&&isOutOfScreen==0)
               {

                  if(state==1&&this.m_beIsSuccessAdd<=0 && this.m_isShowBHE)
                  {
                     this.m_beIsSuccessAdd=1;
                     let eftParent=cc.find("eftCenter");
                    // this.m_boomHintEft= eftManager.instance().createEft(0,0,"ge_boom_hint","act_ge_boom_hint",1,"act_ge_boom_hint",eftParent,1,this.m_fishRoomID,9);
                  }
                  
            }
           
			}
		}
     
    
      public emitFishIsOut()
      {
         if(this.m_isOutState==0 || this.m_isOutState==3)
         {
            let isOut= this.checkFishIsOutOfScreen();
            if(isOut==0)
            {
               this.m_isOutState=1;
            }
         }
         else if(this.m_isOutState==1)
         {
            let isOut= this.checkFishIsOutOfScreen();
            if(isOut==1)
            {
               this.m_isOutState=2;
            }
         }
         else if(this.m_isOutState==2)
         {
            this.m_isOutState=3;
            let tmpData=
            {
               type:1,
               ID:this.m_fishRoomID
            }
            eventManager.emit("fishOut",tmpData);
         }
         // console.log("=============鱼游出==状态===="+this.m_fishRoomID+"====="+this.m_isOutState)
      }
      public setFishBHE(_state)
		{
         if(this.m_isShowBHE){
            this.m_isReadyShowBHE=_state;
            // this.upDateFish(0.01)
            if(this.m_fishlineObj)
            {
               this.addBoomHintEftToFish()
            }
         }
         
		}
		public getFishBHE()
		{
			return this.m_isReadyShowBHE;
      }
      
      public fishrp(ro:number):void
      {
         let self=this;
         self.m_deadRotaN ++;
         this.node.angle = ro-90*(self.m_deadRotaN%2);
         if(self.m_deadRotaN >=15){
            this.clearFishData();
         }
      }
      public setFishHit()
      {
         let self=this;
         self.m_fishNode.color=cc.color(100,100,100);
         self.scheduleOnce(()=>{
            self.m_fishNode.color=cc.color(255,255,255);
         },0.2);
         let posX=this.node.x+50;
         let posY=this.node.y;
         
        // this.fishIsDead(_actPower,_ap);
      }

     update (dt) {
        if(this.m_fishState==0||this.m_fishDeadState==1)
        {
           return ;
        }
         if(this.m_beFreeze==0 && this.m_beStop == 0)
         {
            this.upDateFish(dt)
         }
     }
    public upDateFish(dt){

         this.m_time += dt;
               
         if(this.m_fishLineID<=0)
         {
            return ;
         }
         if(this.m_fishlineObj&&this.m_isInit==1)
         {
               this.addBoomHintEftToFish()
               let tPosAndDirVo: ML.TPosAndDirVo=  this.m_fishlineObj.getPosAndDir(this.m_fishLineID,this.m_time);
               if (!tPosAndDirVo.isBol&&this.m_fishDelayTime<=0) {
                  
                  this.m_fishLineID=0;
                  this.removeFromParentFunc(1);
               }
               else if(this.m_fishDelayTime>0)
               {
                 
                  
               }
               else
               {
                  
                  let fishSchoolState=tonyInfo.instance().m_fishSchoolIsComingState;

                  if(fishSchoolState==0)
                  {
                     let playerSeat=tonyInfo.instance().m_playerSeatID;
                     let tempX: number = tPosAndDirVo.posX +this.m_linexoff;
                     let tempY: number = tPosAndDirVo.posY +this.m_lineyoff;

                     if(this.m_xoff != 0 || this.m_yoff != 0){
                        //let tempP = this.calOffset(tempX,tempY,tPosAndDirVo.dirX,tPosAndDirVo.dirY,this.xoff,this.yoff*(seatNum>1?-1:1));
                        let tempP = this.calOffset(tempX,tempY,tPosAndDirVo.dirX,tPosAndDirVo.dirY,this.m_xoff,this.m_yoff);
                        tempX = tempP.x;
                        tempY = tempP.y;
                     }

                     let angle=Math.atan2(tPosAndDirVo.dirX,tPosAndDirVo.dirY);

                     let degre=angle*180/Math.PI;

                     if(playerSeat>1)
                     {
                        //degre-=180;
                        degre=-angle*180/Math.PI;
                     }
                    
                     
                     if(this.m_isFlipX)
                     {
                        degre=degre+90;
                        
                     }
                     else
                     {
                        degre=degre-90;
                     }
                     let fishPos=utils.instance().getServerToClient(tempX,tempY);
                     this.node.x=fishPos.x;
                     this.node.y=fishPos.y; 
                     let isFlipX=playerSeat>1?-1:1;

                     if(isFlipX<0)
                     {
                        degre+=-180;
                        this.node.y=cc.winSize.height-this.node.y;
               
                     }
                    // console.log("fishRota======",degre);
                     if(this.m_isRota==0)
                     {
                        this.node.angle=-degre;
                       
                     }
                     if(this.m_lastPosX<0)
                     {
                        this.m_lastPosX=this.node.x;
                        this.m_lastPosY=this.node.y;
                     }
                     else
                     {
                        let tmpX=this.node.x-this.m_lastPosX;
                        if(tmpX<=0)
                        {
                           if(this.m_isFlipX==false)
                           {
                              this.m_fishNode.scaleX=-1;
                              this.m_isFlipX=true;
                           }
                        }
                        else
                        {
                           if(this.m_isFlipX)
                           {
                              this.m_fishNode.scaleX=1;
                              this.m_isFlipX=false;
                           }
                        }
                        this.m_lastPosX=this.node.x;
                        this.m_lastPosY=this.node.y;
                     }
                     this.emitFishIsOut();
                  }
                  else if(fishSchoolState==1 && this.m_deadState == 0)
                  {
                     if(this.m_dirX==0)
                     {
                        this.m_dirX=tPosAndDirVo.dirX;
                        this.m_dirY=tPosAndDirVo.dirY;
                     }
               
                     let angle=Math.atan2(this.m_dirX,this.m_dirY);

                     let degre=angle*180/Math.PI;
                     degre=degre-90;
                     if(this.m_isFlipX)
                     {
                        degre+=-180;
                     }
                     let isOutOfScreen=this.checkFishIsOutOfScreen();

                     if(isOutOfScreen==1)
                     {
                        this.emitFishIsOut();
                        this.removeFromParentFunc(1);
                     }
                     else
                     {
                        this.node.x+=this.m_dirX*30;
                        this.node.y+=this.m_dirY*30; 
                        this.node.angle=degre;
                        
                        if(this.m_shadow)
                        {
                           this.m_shadow.x=this.node.x;
                           this.m_shadow.y=this.node.y-100;
                           this.m_shadow.angle=degre;
                           this.m_shadow.scaleX=this.m_fishNode.scaleX*3;
                        }
                     }


                  }
               }
         }
     }
}
