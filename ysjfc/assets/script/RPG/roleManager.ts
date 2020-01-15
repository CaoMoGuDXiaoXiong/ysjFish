import { preloadRes } from "../globle/preloadRes";
import { utils } from "../globle/utils";
import role from "./role";
import { config } from "../globle/config";

export class roleManager {
    private static ince:roleManager;
    private m_rolePrefab:cc.Prefab=null;
    private m_rolehPool:cc.NodePool=null;
    private m_roleParent=null;
    public static instance(): roleManager{
        if(this.ince == undefined){
            
            this.ince = new roleManager();
            
        }
        return this.ince;
    }
    public initFishManager(_prefab)
    {
        this.m_rolehPool=new cc.NodePool();
        this.m_roleParent=cc.find("fishCenter");
        let self=this;
        if(!_prefab)
        {   
            let url="prefab/role";
            cc.loader.loadRes(url,cc.Prefab,(err,data)=>{
                if(!err)
                {
                    self.m_rolePrefab=data;
                    utils.instance().consoleLog("加载角色信息成功===");
                }
            });
        }
        else
        {
            this.m_rolePrefab=_prefab;
        }
        
    }
    public initSquareRoom()
    {

    }
    public createRole(_uid,_roleID,_name,_title,_posX,_posY)
    {
        let poolSize= this.m_rolehPool == null ? 0 : this.m_rolehPool.size();
        let self=this;
        let fish=null;
        let tmpRole=null;
        if(poolSize<=0)
        {
            fish=cc.instantiate(this.m_rolePrefab);
        }
        else
        {
            fish=this.m_rolehPool.get();
           
        }
        if(fish)
        {
            tmpRole=fish.getChildByName("fish");
        }
        let name=fish.getChildByName("name");
        let nametxt=name.getComponent("cc.Label");
        nametxt.string=""+_name;

        let title01=fish.getChildByName("title");
        let title01txt=title01.getComponent("cc.Label");
        title01txt.string=""+_title;

        let resRoleID=_roleID;//config.instance().getFihsResID(_fishID);
        let fishClisp02:cc.AnimationClip=preloadRes.instance().getFishRes(resRoleID);
        if(!fishClisp02)
        {
        
            utils.instance().consoleLog("找不到鱼======"+resRoleID);
        }
        let animation:cc.Animation=tmpRole.getComponent("cc.Animation");
        console.log("当前MC数量======",animation.getClips());
        if(fishClisp02){
            animation.addClip(fishClisp02);
            animation.play("fish_"+resRoleID);
        }
        
        let fishSize=config.instance().getFishColliderSize(resRoleID);
        let boxSize:cc.BoxCollider=tmpRole.getComponent("cc.BoxCollider");
        boxSize.size=cc.size(fishSize[0],fishSize[1]);
        boxSize.offset.x=fishSize[2];
        boxSize.offset.y=fishSize[3];

        let trimArr=[103,10,15,28,0,108,7,4];
        let len01=trimArr.length;
        let isTrim=0;
        for(let i=0;i<len01;i++)
        {
            let tmpID=trimArr[i];
            if(tmpID==resRoleID)
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
        
        let spr:cc.Sprite=tmpRole.getComponent("cc.Sprite");
        spr.sizeMode=sprSizeMode;
        spr.trim=sprTrim;
        fish.parent=self.m_roleParent;
        let roleScript=fish.getComponent("role");
        
        roleScript.initRole(_uid,_roleID,_posX,_posY,tmpRole);

        //preloadRes.instance().loadRoleRes(resRoleID,roleFunc);

        return fish;
    }
}