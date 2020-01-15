
import { preloadRes } from "../globle/preloadRes";
import { tonyInfo } from "../globle/tonyInfo";
import { utils } from "../globle/utils";
import { fntManager } from "./fntManager";
import { soundManager } from "../globle/soundManager";

export class dropManager {
    private static ince:dropManager;
    
   // m_fntList:Array<cc.Node>= [];
    private m_dropItemPrefab:cc.Prefab=null;
    public m_coinTestPrefab:cc.Prefab=null;
    public m_coinPartical01:cc.Prefab=null;
    public m_coinPartical02:cc.Prefab=null;
    private m_goldExplotion:cc.Prefab=null;
    private m_sliverExplotion:cc.Prefab=null;
    private m_goldEdxplotionWave:cc.Prefab=null;
    private m_coinList:Array<cc.Node>=[];
    private m_goldCnt=0;
    public static instance(): dropManager{
        if(this.ince == undefined){
            this.ince = new dropManager();
        }
        return this.ince;
    }
    public setDropItemPrefab(_prefab)
    {
        this.m_dropItemPrefab=_prefab;
    }
    public  playGoldExplotion(_type:number=0,_x:number=0,_y:number=0)
    {
        let exploPrefab=null;
        let self=this;

        if(this.m_goldExplotion && this.m_sliverExplotion)
        {   
            if(_type == 0){
                exploPrefab=this.m_goldExplotion;
            }
            else{
                exploPrefab=this.m_sliverExplotion;
            }
            
            this.createGoldExplotion(_x,_y);
        }
        else
        {
            let url="prefabs/goldExplotion01";
            let url02="prefabs/actAni/goldExplotion/gewave";
            if(_type != 0){
                url="prefabs/sliverExplotion01";
            }
            
            
            cc.loader.loadRes(url,cc.Prefab,(err,data)=>{
                if(!err)
                {   
                    if(_type == 0){
                        self.m_goldExplotion=data;
                    }
                    else{
                        self.m_sliverExplotion = data
                    }
                    
                    cc.loader.loadRes(url02,cc.Prefab,(err,data)=>{
                        if(!err)
                        {
                            self.m_goldEdxplotionWave=data;
                            self.createGoldExplotion(_x,_y,_type);
                        }
                        
                    });
                }
                
            });
           
            
            exploPrefab=this.m_goldExplotion;
           
        }

    }
    public createGoldExplotion(_x:number=0,_y:number=0,_type:number = 0)
    {
        
        let goldExplotion = null
        if(_type == 0){
            goldExplotion=cc.instantiate(this.m_goldExplotion);
        }
        else{
            goldExplotion=cc.instantiate(this.m_sliverExplotion);
        }

        let geWave=cc.instantiate(this.m_goldEdxplotionWave);

        geWave.x=_x;
        geWave.y=_y;

        goldExplotion.x=_x;
        goldExplotion.y=_y;

        let parent=cc.find("eftCenter");

        goldExplotion.parent=parent;
        geWave.parent=parent;

    }
    //_type=0==掉落金币 1==掉落银币 2==掉落道具
    public addDrop(_type,_num,_startP:cc.Vec2,_endP:cc.Vec2,_propID:number=0,curPower:number=1)
    {
       // return ;
        if(_type==0)
        {
            this.dropMoney(_num,_startP,_endP,0,curPower);
        }
        else if(_type==1)
        {
            this.dropMoney(_num,_startP,_endP,1,curPower);
        }
        else if(_type==2)//掉落道具
        {
            this.dropItem(_propID,_num,_startP,_endP);
        }
    }
    public dropItem(_itemID:number,_num:number,_startP:cc.Vec2,_endP:cc.Vec2,_delayTime:number=0)
    {
        
        let itemPrefab=null;
        itemPrefab=preloadRes.instance().m_fishProp;
        
        
        let item=cc.instantiate(itemPrefab);
        if(_itemID>=199999)
        {
            console.log("测试道具02====",_itemID);
            let bubble:cc.Node=item.getChildByName("bubble");
            bubble.active=false;
        }
        item.x=_startP.x;
        item.y=_startP.y;
        
        item.parent= cc.find("eftCenter");//cc.director.getScene();
        let itemIcon:cc.Sprite=item.getChildByName("icon").getComponent("cc.Sprite");
        let itemFS=preloadRes.instance().getPropIconByID(_itemID);
        itemIcon.spriteFrame=itemFS;
        let itemNum:cc.Label=item.getChildByName("num").getComponent("cc.Label");
        let itemName=preloadRes.instance().getPropNameByID(_itemID);
        itemNum.string=""+itemName+"X"+_num;

        console.log("掉落务必======",_itemID,_num,itemName);
        item.setScale(0,0);

        let jumpTo=cc.jumpTo(1,new cc.Vec2(_startP.x-80,_startP.y),70,2);
        let bzArr=[];
        let point1=new cc.Vec2(0,-(_endP.y-_startP.y+80)/2);
        let point2=new cc.Vec2(0,-(_endP.y-_startP.y+80)/2);
        let point3=new cc.Vec2(_endP.x-_startP.x+80,_endP.y-_startP.y);
        bzArr.push(point1);
        bzArr.push(point2);
        bzArr.push(point3);
        let bezier=cc.bezierBy(0.6,bzArr);

        let scaleToAct01=cc.scaleTo(1,1.0);
        let spawn01=cc.spawn(scaleToAct01,jumpTo);
        let delay01=cc.delayTime(_delayTime);
        let callBack=cc.callFunc(()=>{
            item.stopAllActions();
            item.destroy();
            soundManager.instance().playEft("laugh01");
        },this);
        let seq=cc.sequence(delay01,spawn01,bezier,callBack);
        item.runAction(seq);

        let act02=cc.delayTime(1.0+_delayTime);
        let scale01=cc.scaleTo(0.3,1.2);

        let seq02=cc.sequence(act02,scale01);

        
        let act03=cc.delayTime(1.3+_delayTime);
        let scale03=cc.scaleTo(0.3,0.6);

        let seq03=cc.sequence(act03,scale03);

         item.runAction(seq02);
         item.runAction(seq03);
        
    }
    public dropMoney(_money:number=0,_startP:cc.Vec2,_endP:cc.Vec2,_coinType:number=0,curPower:number=1)
    {
        // let curPower=tonyInfo.instance().cannonlevel;
        //let dropCnt=Math.floor(_money/curPower);
        let dropCnt=_money;
        if(dropCnt>10)
        {
            dropCnt=10;
        }
        let eftParent=cc.find("eftCenter");
        let self=this;
        let posX=_startP.x;
        let posY=0;
        let winW=cc.winSize.width;
        if((dropCnt*70+_startP.x)>=winW-100)
        {
            posX=(winW-100)-dropCnt*70;
        }
        for(let i=0;i<dropCnt;i++)
        {
            let delayTime=cc.delayTime(0.1+(i*0.1));
            
            let callBack=cc.callFunc(()=>{
                posX+=70;
                posY=_startP.y;
                self.createCoin(_money,_startP,_endP,i,_coinType,posX,posY);
            },this);
            let seq=cc.sequence(delayTime,callBack);

            eftParent.runAction(seq);
            

        }
        
        fntManager.instance().createFnt(1,_money,_startP);
    }
    public createCoin(_money:number=0,_startP:cc.Vec2,_endP:cc.Vec2,_index,_coinType,_posX,_posY)
    {
        let posX=_posX;
        let posY=_posY;
        let self=this;
       
        //posX=posX+_index*40;
        // let angle=Math.random()*360;
        // let radius01=Math.PI/180*angle;
        // let R=50;
        // let offsetX=Math.cos(radius01)*R;
        // let offsetY=Math.sin(radius01)*R;

        // posX+=offsetX;
        // posY+=offsetY;

        


        // let eft=eftManager.instance().createEft(posX,posY,armatureName,aniName,1,"",null,0,0,aniIndex,0);
        let  eftParent=cc.find("eftTop");  


        

        let coinPartical01=null;
       

        if(_coinType==0)
        {
            coinPartical01=self.m_coinList.pop();
            if(!coinPartical01)
            {
                coinPartical01=cc.instantiate(this.m_coinPartical01);
            }
            soundManager.instance().playEft("getMoney1");

            
           
            coinPartical01.x=posX;
            coinPartical01.y=posY;
            coinPartical01.parent=eftParent;

            let act=cc.moveBy(0.2,0,100);
            let needTime=0;
            let per=500;

            let length=utils.instance().distance(new cc.Vec2(posX,posY),_endP);
            needTime=length/per;

            let act02=cc.moveBy(0.2,0,-100);
            let act03=cc.delayTime(1.0);
            let act04=cc.moveTo(needTime,_endP);
            let callBack=cc.callFunc(()=>{
                //soundManager.instance().playEft("getMoney1");
                coinPartical01.removeFromParent();
                self.m_coinList.push(coinPartical01);
               
            });
           // console.log("创建金币=====",needTime);
            let seq=cc.sequence(act,act02,act03,act04,callBack);
            coinPartical01.runAction(seq);
        }
        
      
    }
    
}