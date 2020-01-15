import { utils } from "../globle/utils";
import { fishnetManager } from "./fishnetManager";
import { net } from "../net/net";
import { PROTOCOL_SEND } from "../net/protocal";

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
export default class bullet extends cc.Component {

   
    private m_power:number=0;
    private m_speed:number=5000;
    private m_id:number=0;
    private m_degree:number=0;
    private m_speedX:number=700;
    private m_speedY:number=700;
    private m_offsetY:number=90;
    private m_reboundMaxCnt=3;
    private m_curRebound=0;
    private m_collisionX:number=0;
    private m_collisionY:number=0;
    private m_posX:number=0;
    private m_posY:number=0;
    private m_skinID:number=0;
    private m_curreboundCnt=0;
    private m_dir:cc.Vec2;

    private m_totalTime=0;
    private m_fps=0;
    private m_bulletState=0;
    public m_targetID=-1;
    public m_targetPos= null;
    private m_bulletID:number=0;
    private m_isSelf=0;
    private m_isCollider=0;
    private netDbType:number = 0
    private netAniType:number = 0
    private m_bulletActPower=0;//子弹的攻击力
    private m_ap=0;//子弹的穿甲

    @property(cc.SpriteAtlas)
    public m_bulletCT:cc.SpriteAtlas = null;
    @property(cc.AnimationClip)
    public m_bulletAni:Array<cc.AnimationClip> = [];
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        // let power=10;

        // let src=new cc.Vec2(200,200);
        // let touchp=new cc.Vec2(200,500);
        // let dir=new cc.Vec2(touchp.x-src.x,touchp.y-src.y);
        // let dirNormlize=dir.normalize(dir);
     


    }
    public resetBullet(_power:number,_x:number,_y:number,_dir:cc.Vec2,_id:number,_speed:number,_offsetY:number,_skinID:number,_degree:number,_max:number=0,netDbType:number=0,netAniType:number=0,bulletIconID:number = 1000)
    {
        this.m_power=_power;
        this.m_posX=_x;
        this.m_posY=_y;
        this.m_dir=_dir;
        this.m_id=_id;
        this.m_speed=_speed;
        this.m_offsetY=_offsetY;
        this.m_skinID=_skinID;
        this.m_curRebound=_max;
        this.m_degree=_degree;
        this.netDbType = netDbType
        this.netAniType = netAniType
        
        
        this.setBulletState(1);
        this.setBulletDir();
    }
    public resetBulletProperty(_actPower:number=0,_ap:number=0)
    {
        this.m_bulletActPower=_actPower;
        this.m_ap=_ap;
    }

    public setBulletId(_bulletID:number=0,_isSelf:number=0)
    {
        this.m_bulletID=_bulletID;
        this.m_isSelf=_isSelf;
    }
    public removeFromParentFunc()
    {
        this.node.removeFromParent();
        this.m_curreboundCnt=0;
        cc.director.targetOff(this);
        this.m_targetID=-1;
       
        this.m_targetPos = null
        this.m_bulletActPower=0;
        this.m_isCollider=0;
        this.setBulletId(0);
        this.setBulletState(0);
    }
    public getBulletState()
    {

        return this.m_bulletState;
    }
    public setBulletState(_state:number=0)
    {
        this.m_bulletState=_state
    }
    public setBulletDir()
    {
        this.node.angle=180+(this.m_degree-90);
        this.node.x=this.m_posX;
        this.node.y=this.m_posY;
        this.m_speedX=this.m_dir.x*this.m_speed;
        this.m_speedY=this.m_dir.y*this.m_speed;
        
    }
    /**检测屏幕 */
    private checkHitScreen(): void {
        let winSize=utils.instance().getVisibleSize();
        
        if (this.m_posX < 0 || this.m_posX > winSize.width) {
            //反弹  x 反弹
            this.m_speedX *= -1;
            let angle = Math.atan2(this.m_speedX, this.m_speedY) * 180 / Math.PI;
            this.node.angle=180+(-angle-this.m_offsetY);
            this.m_curreboundCnt++;
        }
        if (this.m_posY < 0 || this.m_posY > winSize.height) {
            //反弹  y 反弹
            if(this.m_posY<0)
            {
                this.m_posY=0;
            }
            else if(this.m_posY>winSize.height)
            {
                this.m_posY=winSize.height;
            }

            this.m_speedY *= -1;
            let angle = Math.atan2(this.m_speedX, this.m_speedY) * 180 / Math.PI;
            this.node.angle=180+(-angle-this.m_offsetY);
            this.m_curreboundCnt++;
        }
        if(this.m_curreboundCnt>this.m_reboundMaxCnt)
        {
            this.removeFromParentFunc();
        }

        // if(this.curRebound >= this.reboundMaxCount){
        //     this.removeToParent();
        // }
    }
    public setTargetID(_targetID:number=-1)
    {
        this.m_targetID=_targetID;
        // let self=this;
        // if(_targetID>=0)
        // {
        //     // cc.director.once(""+_targetID,(data)=>{
        //     //     self.m_targetID=-1;
        //     //     // console.log("鱼被击杀====================================",data,self.m_id);

        //     // },self);
        // }
        
    }
    public onClilderFunc(other,self)
    {
        let fishPrefab:cc.Node=other;
        let fishScript=fishPrefab.getComponent("fish");
        let fishRoomID=fishScript.getFishRoomID();
        let fishdeadState=fishScript.m_deadState;
        // console.log("当前锁定的鱼ID======",fishRoomID,this.m_targetID,this.m_isCollider,fishdeadState);
        if(this.m_isCollider>=1)
        {
            return ;
        }
        let fishId = fishScript.getFishID();
       
        if(fishdeadState>=1)
        {
            return ;
        }
      //  console.log("当前测试子弹=02===",fishRoomID,this.m_targetID)
        if(this.m_targetID>=0)
        {
           
           
            if(fishRoomID==this.m_targetID)
            {
                this.m_isCollider=1;
	
                let fishNode=other.getChildByName("fishNode");
                let spri:cc.Sprite=fishNode.getComponent("cc.Sprite");
             
                
                
                let delay=cc.delayTime(0.1);
             
             
                this.clearBullet(fishRoomID);
                
            }
        }
        else if(this.m_targetPos){
            console.log("==============特殊子弹追踪=========")
        }
        else
        {
            
            // let isCollider=this.checkBottomCollider();
            // if(isCollider>=1)
            // {
            //     return ;
            // }
            this.m_isCollider=1;
            //macro.BlendFactor;		
            let fishNode=other.getChildByName("fishNode");
            let spri:cc.Sprite=fishNode.getComponent("cc.Sprite");
            //fishScript.setFishHit(this.m_bulletActPower,1.0-this.m_ap);
            fishScript.setFishHit();
            this.clearBullet(fishRoomID);
        }
       
    }
    private checkBottomCollider()
    {
        let isCollider=0;

        let tonyRect=[230,200,90];
        let x=this.node.x;
        let y=this.node.y;
        let width=tonyRect[0]+tonyRect[1];
        let height=tonyRect[2];
        if(cc.winSize.height<640)
        {
            height=height*cc.winSize.height/640;
        }
        if(x>=tonyRect[0]&&x<=width)
        {
            if(y<=height)
            {
                isCollider=1;
            }
        }
        
        let x1=740*cc.winSize.width/1136;
        width=x1+tonyRect[1];
        if(isCollider==0)
        {
            if(x>=x1&&x<=width)
            {
                if(y<=height)
                {
                    isCollider=1;
                }
            }
        }

        return isCollider;

    }
    private clearBullet(_fishRoomID:number=-1)
    {
        if(_fishRoomID>=0&&this.m_isSelf==1)
        {
            let Sdata = {
                "action":PROTOCOL_SEND.MSGID_CTS_206BULLETCOLLIDER,
                "fishId":_fishRoomID
            }
            
            net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_206BULLETCOLLIDER,Sdata);
        }
        let posX=0;
        let posY=0;
        if (this.m_offsetY >0) {
            posX = this.node.x + this.m_speedX*0.05;
            posY = this.node.y + this.m_speedY*0.05;
        } else {
            posX = this.node.x - this.m_speedX*0.05;
            posY = this.node.y - this.m_speedY*0.05;
        }
       // cc.director.emit("bulletCollider");
       //console.log("子弹ID=======",this.m_id,this.m_skinID);
        fishnetManager.instance().createFishnet(posX,posY,this.m_skinID,this.netAniType);
        this.removeFromParentFunc();
    }
     update (dt) {
        let v =dt;
        if (this.m_offsetY >0) {
            this.m_posX += this.m_speedX*v;
            this.m_posY += this.m_speedY*v;
        } else {
            this.m_posX -= this.m_speedX*v;
            this.m_posY -= this.m_speedY*v;
        }
        this.node.x=this.m_posX;
        this.node.y=this.m_posY;
        this.checkHitScreen();
        // this.showSkillBullet()
     }
}
