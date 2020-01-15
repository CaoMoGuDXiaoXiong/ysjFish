import { fishManager } from "./fishManager";
import { utils } from "../globle/utils";
import { preloadRes } from "../globle/preloadRes";

export class bulletManager {
    private static ince:bulletManager;
    private m_bulletPrefab:cc.Prefab=null;
    private m_cacheBulletList:Array<cc.Node>= [];
    private m_bulletArr:Array<cc.AnimationClip>=[];
    private m_allBulletList = {};
    private m_totalBulletNum=0;
    private m_lastMC=-1;
    private m_bulletParent:cc.Node=null;
    
    public static instance(): bulletManager{
        if(this.ince == undefined){
            this.ince = new bulletManager();
        }
        return this.ince;
    }
    
    public createBullet(_type:number,_bulletID:number=0,_bulletResID):cc.Node
    {
        let tmpBullet=this.m_cacheBulletList.pop();
        if(!tmpBullet)
        {
            tmpBullet=cc.instantiate(this.m_bulletPrefab);
        }
        else
        {
           // console.log("getBulletFromCache",this.m_cacheBulletList.length);
            //重置鱼信息
        }
        let spr:cc.Sprite=tmpBullet.getComponent("cc.Sprite");
        let tmpBulletSpr=preloadRes.instance().getBulletByID(_bulletResID);
        if(tmpBulletSpr)
        {
            spr.spriteFrame=tmpBulletSpr;
        }
        
        this.m_totalBulletNum++;
        this.m_allBulletList[this.m_totalBulletNum]=tmpBullet;
        return tmpBullet;

    }
    public setBulletPrefab(_prefab:cc.Prefab)
    {
        this.m_bulletPrefab=_prefab;
    }
    public resetBulletState(_id)
    {
        let i_str;
        let tmpBullet:cc.Node=null;
        for(i_str in this.m_allBulletList)
        {
            tmpBullet=this.m_allBulletList[i_str];
            
            if(tmpBullet)
            {
                if(tmpBullet.name!="")
                {
                    let bulletScript=tmpBullet.getComponent("bullet");
                    let state=bulletScript.getBulletState();
             
                    let targetID=bulletScript.m_targetID;
                    
                    targetID=parseInt(targetID);
                   // console.log("子弹的ID=======",targetID,_id);
                    if(targetID>=0)
                    {
                        if(targetID==_id)
                        {
                            console.log("停止子弹===",targetID,_id);
                            bulletScript.m_targetID=-1;
                        }
                    }
                }
                else
                {
                    delete this.m_allBulletList[i_str];
                }
            }
        }
    }
    public gameLoop(dt:number)
    {
        let i_str;
        let tmpBullet:cc.Node=null;
        for(i_str in this.m_allBulletList)
        {
            tmpBullet=this.m_allBulletList[i_str];
            
            if(tmpBullet)
            {
                if(tmpBullet.name!="")
                {
                    let bulletScript=tmpBullet.getComponent("bullet");
                    let state=bulletScript.getBulletState();
                    if(state==0)//是否被释放了
                    {
                        delete this.m_allBulletList[i_str];
                        this.m_cacheBulletList.push(tmpBullet);
                    }
                    else
                    {
                        
                        let bulletScript=tmpBullet.getComponent("bullet");
                        let x=tmpBullet.x;
                        let y=tmpBullet.y;
                        let targetID=bulletScript.m_targetID;
                        // console.log("====checkBulletIsCollider=======",targetID)
                        let isColliderArr= fishManager.instance().checkBulletIsCollider(x,y,targetID);
                        if(isColliderArr.length>0)
                        {
                            let isCollider=isColliderArr[0];
                            let colliderFish=isColliderArr[1];
                            if(isCollider==1)
                            {
                                bulletScript.onClilderFunc(colliderFish,tmpBullet);
                            }
                        }
                        


                    }
                }
                else
                {
                    delete this.m_allBulletList[i_str];
                }
            }
        }
    }
    public clearAllBullet()
    {
        let i_str;
        let tmpBullet:cc.Node=null;
        for (i_str in this.m_allBulletList) {
            tmpBullet = this.m_allBulletList[i_str];
            if(tmpBullet)
            {
                if(tmpBullet.name!="")
                {
                    let bulletScript=tmpBullet.getComponent("bullet");
                    bulletScript.setBulletState();
                    bulletScript.removeFromParentFunc();
                    tmpBullet.destroy();
                }
                

            }
            // if (fish && fish.parent) {
            //     fish.removeToParent();
            // }
        }
        this.m_allBulletList = [];
        let tmpSize=this.m_cacheBulletList.length;

        for(let i=0;i<tmpSize;i++)
        {
            let tmpBullet=this.m_cacheBulletList[i];
            tmpBullet.destroy();
        }
        this.m_cacheBulletList = [];
        
        utils.instance().consoleLog("清空子弹");
    }
    
  
}