import { utils } from "../globle/utils";
import { config } from "../globle/config";
import { eventManager } from "../globle/eventManager";
import { tonyInfo } from "../globle/tonyInfo";

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
export default class role extends cc.Component {

    private m_uid=-1;
    private m_roleID=-1;
    private m_targetPos=null;   
    private m_dirX=-1;
    private m_dirY=-1;
    private m_isMove=0;
    private m_speed=2;
    private m_fish=null;
    private m_isRota=0;
    // onLoad () {}

    start () {

    }
    initRole(_uid,_roleID,_posX,_posY,_fish)
    {
        this.m_fish=_fish;
        this.node.x=_posX;
        this.node.y=_posY;
        this.m_uid=_uid;
        this.m_roleID=_roleID;
        console.log("角色ID=====",this.m_roleID);
        let fishSize=config.instance().getFishColliderSize(_roleID);
        this.m_isRota=fishSize[4];
    }
    resetPos(_posX,_posY)
    {
        this.node.x=_posX;
        this.node.y=_posY;
    }
    resetTargetPos(_targetPos:cc.Vec2)
    {
        this.m_targetPos=_targetPos;
        this.m_isMove=1;
        

        
        let tmpDir=utils.instance().getVecNormalize(new cc.Vec2(this.node.x,this.node.y),_targetPos);
        this.m_dirX=tmpDir.x;
        this.m_dirY=tmpDir.y;
       
    }
    clearRole()
    {
        this.m_uid=-1;
        this.m_roleID=-1;
    }
    getPos()
    {
        let dirX01=this.m_dirX*this.m_speed;
        let dirY01=this.m_dirY*this.m_speed;
        let pos={
            x:this.node.x,
            y:this.node.y,
            dirX:dirX01,
            dirY:dirY01
        }
        return pos;
    }
    getMoveState()
    {
        return this.m_isMove;
    }
    move()
    {
        if(this.m_isMove>=1)
        {
            this.node.x+=this.m_dirX*this.m_speed;
            this.node.y+=this.m_dirY*this.m_speed;
            let degre=0;
            let angle=Math.atan2(this.m_dirX,this.m_dirY);
            degre=angle*180/Math.PI;
            if(this.m_dirX>0)
            {
                
                this.m_fish.scaleX=1;
                degre-=90;
            }
            else
            {
                this.m_fish.scaleX=-1;
                degre=degre+90;
            } 
            if(this.m_isRota==0)
            {
              this.node.angle=-degre;
            }
           
            
            let len=utils.instance().distance(new cc.Vec2(this.node.x,this.node.y),this.m_targetPos);
            if(len<=5)
            {

                this.m_isMove=0;
                if(this.m_uid==tonyInfo.instance().m_playerUID)
                {

                
                    let tmpX=this.node.x;
                    let tmpY=this.node.y;
                    let isCollider=0;
                    if(tmpX<=115+50&&tmpX>=115-50)
                    {
                        isCollider=1;
                    }
                    if(isCollider==1)
                    {
                        if(tmpY<=768+150&&tmpY>=768)
                        {
                            isCollider=2;
                        }
                    }
                    
                    if(isCollider==2)
                    {
                        
                        eventManager.emit("exitSquare",1);//鱼被击杀
                    }
                }
            }
            
        }
    }
     update (dt) {
        this.move();

     }
}
