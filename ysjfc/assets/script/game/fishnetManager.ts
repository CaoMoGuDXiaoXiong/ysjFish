import { utils } from "../globle/utils";
import fish from "./fish";
import { preloadRes } from "../globle/preloadRes";
import { config } from "../globle/config";
export class fishnetManager {
    private static ince:fishnetManager;
    private m_fishnetPrefab:cc.Prefab=null;
    private m_cachefishnetList:Array<cc.Node>= [];
    private m_bulletArr:Array<cc.AnimationClip>=[];
    private m_allFishnetList = {};
    private m_totalFishnetNum=0;
    private m_lastMC=-1;
    private m_audioClipNet=null;
    private m_fishnetParent:cc.Node=null;

    private m_netAudioEft=null;

    
    public static instance(): fishnetManager{
        if(this.ince == undefined){
            this.ince = new fishnetManager();
        }
        return this.ince;
    }
    private curUisingDBType:number = null
    public createFishnet(_x:number,_y:number,_netDBId:number=0,_aniType:number=0):cc.Node
    {
        let self=this;
        let tmpfishnet=this.m_cachefishnetList.pop();
        
        if(!tmpfishnet)
        {
            tmpfishnet=cc.instantiate(this.m_fishnetPrefab);
        }
        else
        {
           // console.log("getFishnetFromCache==",this.m_cachefishnetList.length);
            //重置鱼信息
        }
        //tmpfishnet.scale=0.5;
        let fishnetScript=tmpfishnet.getComponent("fishnet");
        // console.log("======================"+_aniType)
        if(_aniType<=0)
        {
            let dbNode=tmpfishnet.getChildByName("db");
           
            if(!dbNode.active)
            {
                dbNode.active=true;
            }
            // dbNode.removeComponent("dragonBones.ArmatureDisplay");
            let fishNetDB:dragonBones.ArmatureDisplay=dbNode.getComponent("dragonBones.ArmatureDisplay");
            
            if(fishNetDB)
            {
                let dbName=this.getNetDbDataByID(_netDBId)
                fishNetDB.playAnimation("act_net_"+dbName,1);
                //this.playNet_Db(fishNetDB,_netDBId)
                
                // let angelArr=[45,90,135,180,225,270,315,360]
                // let index=Math.floor(Math.random()*7);
                // let angel=angelArr[index];
                // dbNode.angle=angel;
                // fishNetDB.playTimes=1;
                // let particalNode=tmpfishnet.getChildByName("partical");
                // let partical=particalNode.getComponent(cc.ParticleSystem);
                // partical
                // //partical.playOnLoad=true;
            }
        }
        else
        {
        //     let dbNode=tmpfishnet.getChildByName("db");
        //     if(dbNode.active)
        //     {
        //         dbNode.active=false;
        //     }
        //     let aniNode=tmpfishnet.getChildByName("ani");
        //     if(!aniNode.active)
        //     {
        //         aniNode.active=true;
        //     }
        //     let animation:cc.Animation=aniNode.getComponent("cc.Animation");
        //     let curClipArr=animation.getClips();
        //     animation.removeClip(curClipArr[0],true);
            
        //     let callBack = function(){
        //         let netClip:cc.AnimationClip=preloadRes.instance().m_netResArr[_aniType.toString()];
        //         if(netClip){
        //             animation.addClip(netClip);
        //             animation.play("act_net_"+_aniType,0);
        //         }
        //     }
           
        //     preloadRes.instance().getNetRes(_aniType.toString(),callBack)

        //     let angelArr=[45,90,135,180,225,270,315,360]
        //     let index=Math.floor(Math.random()*7);
        //     let angel=angelArr[index];
        //     aniNode.rotation=angel;

        //     let scale = Math.floor(Math.random()*0.15)+0.85
        //     aniNode.scale = scale
           
         }
        this.m_totalFishnetNum++;
        this.m_allFishnetList[this.m_totalFishnetNum]=tmpfishnet;
        tmpfishnet.x=_x;
        tmpfishnet.y=_y;
        tmpfishnet.parent=this.m_fishnetParent;
        
        
        fishnetScript.resetNet(0.5);

        // if(this.m_netAudioEft)
        // {
        //     cc.audioEngine.play(this.m_netAudioEft,false,1);
        // }
        // else
        // {
           
        //     cc.loader.loadRes("audio/02hit",cc.AudioClip,(err,data)=>{
        //         self.m_netAudioEft=data;
        //         cc.audioEngine.play(self.m_netAudioEft,false,1);
        //     });
  

        return tmpfishnet;

    }
    //播放龙骨动画
    public playNet_Db(fishNetDB:dragonBones.ArmatureDisplay=null,typeId:number = 0){
        if(fishNetDB){
            let netDbName = this.getNetDbDataByID(typeId)   
            fishNetDB.playAnimation("act_net_"+netDbName,1);
            
        //     fishNetDB.armatureName = "net_1004"
        //    let state =  fishNetDB.playAnimation("act_net_"+netDbName,1);
        //    state.stop()
        //    state.play()
        }
    }
    private netDbCfgData = null
    private getNetDbDataByID(id:number = 1001){
        let netName = "1004"
        switch(id){
            case 200012:
                    netName = "1004_a";
                    break;
            case 200011:
                    netName = "1004_b";
                    break;
            case 100031:
                    netName = "1004_c";
                    break;
            case 100011:
                    netName = "1004";
                    break;
            default :
                    break;
        }
        return netName
        
    }
    public setFishnetPrefab(_prefab:cc.Prefab,_parent:cc.Node,_audioClip:cc.AudioClip=null)
    {
        this.m_fishnetPrefab=_prefab;
        this.m_fishnetParent=_parent;
        this.m_audioClipNet=_audioClip;
    }
    public clearAllFishNet()
    {
        let i_str;
        let tmpfishnet:cc.Node=null;
        for (i_str in this.m_allFishnetList) {
            tmpfishnet = this.m_allFishnetList[i_str];
            if(fish)
            {
                if(tmpfishnet.name!="")
                {
                    let fishnetScript=tmpfishnet.getComponent("fishnet");
                    fishnetScript.removeFromParentFunc();
                    tmpfishnet.destroy();
                }
                
            }
        }
        let size=this.m_cachefishnetList.length;
        for(let i=0;i<size;i++)
        {
            let tmpNet=this.m_cachefishnetList[i];
            tmpNet.destroy();
        }
        this.m_allFishnetList = [];
        this.m_cachefishnetList = [];
        utils.instance().consoleLog("清空鱼网");
    }
    
    public gameLoop(dt:number)
    {
        let i_str;
        let tmpfishnet:cc.Node=null;
        for(i_str in this.m_allFishnetList)
        {
            tmpfishnet=this.m_allFishnetList[i_str];
            if(tmpfishnet)
            {
                if(tmpfishnet.name!="")
                {

                
                    let fishnetScript=tmpfishnet.getComponent("fishnet");
                    let state=fishnetScript.getNetState();
                    if(state==0)//是否被释放了
                    {
                        delete this.m_allFishnetList[i_str];
                        this.m_cachefishnetList.push(tmpfishnet);
                    }
                }
                else
                {
                    delete this.m_allFishnetList[i_str];
                }
            }
        }
    }
    
  
}