import { utils } from "../globle/utils";
import { config } from "./config";
import { tonyInfo } from "./tonyInfo";
import { soundManager } from "./soundManager";
import { mathUtils } from "./mathUtils";

export class preloadRes {
    private static ince:preloadRes;
    private m_fishResArr:Array<cc.AnimationClip>=[];
    public m_netResArr={};
    public m_fishLoadCnt=0;
    public m_fishProp:cc.Prefab=null;
    public m_gunIconPrefab:cc.Prefab=null;
    public m_rolePrefab:cc.Prefab=null;
    private m_fishLienVo=null;
    private m_topTipPrefab=null;
    public m_fishPrefab=null;
    public m_fishCfg=null;
    private m_headIcon:cc.SpriteAtlas=null;
    private m_commonLoadIsOver=0;//2
    private m_fishResCnt=31;
    private m_gunBase:cc.SpriteAtlas=null;
    private m_bullet:cc.SpriteAtlas=null;
    private m_commonProp:cc.SpriteAtlas=null;
    private m_gunIcon:cc.SpriteAtlas=null;
    
    private m_loadingCnt=10;
    private m_propJson=null;
    private m_gunDBSke={};
    private m_gunDBTex={};

    private m_jsonTotalCnt=3;
    private m_jsonCnt=0;
    private m_jsonLO=0;
    private m_cfg={};

    
    public static instance(): preloadRes{
        if(this.ince == undefined){
            this.ince = new preloadRes();
        }
        return this.ince;
    }
    public loadFisheryRes()
    {
        
        this.loadFishLine();
        this.loadFishRes();
        this.loadFishPrefab();
        //this.loadFishConfig();

    }
     /** 加载数量 == 29 */
    public loadFishRes()
    {
        let fishID=[1,2,3,4,5,7,8,9,10,11,12,13,14,15,16,25,28,29,103,104,108,201,202,203,301,302,303];
        //29
       
        let self=this;
        console.log("当前加载的鱼数量=====",this.m_fishLoadCnt);
        for(let i=0;i<fishID.length;i++)
        {
            let url="fish/fish_"+fishID[i];
            if(self.m_fishResArr["fish"+fishID[i]])
            {
                if(self.m_fishLoadCnt<self.m_fishResCnt)
                {
                    self.m_fishLoadCnt++;
                }
                continue;
            }
            cc.loader.loadRes(url,(err,data)=>{
                if(!err)
                {
                    
                    utils.instance().consoleLog("加载鱼01"+self.m_fishLoadCnt);
                    self.m_fishResArr["fish"+fishID[i]]=data;
                  
                    
                }
                else{
                   // tonyInfo.instance().showTopTips("加载鱼==失败="+fishID[i]);
                }
                self.m_fishLoadCnt++;
                
            });
        }
    }
    public loadRoleRes(_roleID,_callBack)
    {
        let self=this;
        let url="fish/fish_"+_roleID;
        cc.loader.loadRes(url,(err,data)=>{
            if(!err)
            {
       
                utils.instance().consoleLog("加载Role成功===");
                self.m_fishResArr["fish"+_roleID]=data;
                _callBack();
                
            }
            else{
               // tonyInfo.instance().showTopTips("加载鱼==失败="+fishID[i]);
            }
            
            
        });
    }

    /** 加载数量 == 1 */
    public loadFishLine()
    {
        let self=this;
        console.log("加载+fishline02"+self.m_fishLoadCnt)
        let tmpML=ML;
        console.log("加载+fishline03"+self.m_fishLoadCnt)
        cc.loader.loadRes("fishline",(err,data)=>{
        
            console.log("加载+fishline01"+self.m_fishLoadCnt)
            self.m_fishLienVo=tmpML.getfishlinetxt(data.text);
            
            utils.instance().setFishLineLoadState(1);
            console.log("加载+fishline"+self.m_fishLoadCnt)
            self.m_fishLoadCnt++;
        });
    }
    //加载鱼配置文件
    public loadFishConfig()
    {
        let self=this;
        let url="config/fish"
        cc.loader.loadRes(url,cc.JsonAsset,(err,data)=>{
            if(!err)
            {
                self.m_fishCfg=data.json;
            }
            else
            {
                console.log("加载fishJson失败")
            }
            self.m_fishLoadCnt++;
            
        });
    }
    public getFishNameByID(_fishID)
    {
       
        let len =this.m_fishCfg.length;
        let name="测试";
        for(let i=0;i<len;i++)
        {
            let id=this.m_fishCfg[i].id;
            if(id==_fishID)
            {
                name=this.m_fishCfg[i].name;
                break;
            }
        }
        return name;
    }
    public loadFishPrefab()
    {
        let self=this;
        let url="prefab/fishPrefab"
        cc.loader.loadRes(url,cc.Prefab,(err,data)=>{
            if(!err)
            {
                utils.instance().consoleLog("fishPrefaLoadSuccess====="+self.m_fishLoadCnt);
                self.m_fishPrefab=data;
                // self.m_fishLoadCnt++;
            }
            else{
                tonyInfo.instance().showTopTips("=====fish/fishprefab==失败");
            }
            self.m_fishLoadCnt++;

        });
        url="bullet/batterybase";
        cc.loader.loadRes(url,cc.SpriteAtlas,(err,data)=>{
            if(!err)
            {
                self.m_gunBase=data;
            }
            else
            {
                utils.instance().consoleLog("加载gunBase失败");
            }
            self.m_fishLoadCnt++;
        });
        url="bullet/bullet";
        cc.loader.loadRes(url,cc.SpriteAtlas,(err,data)=>{
            if(!err)
            {
                self.m_bullet=data;
            }
            else
            {
                utils.instance().consoleLog("加载bullet失败");
            }
            self.m_fishLoadCnt++;
        });
       
    }
    public getGunBDByName(_name)
    {
        let tmpSke=null;
        let tmpTxe=null;

        if(this.m_gunDBSke[_name])
        {
            tmpSke=this.m_gunDBSke[_name];
        }
        if(this.m_gunDBTex[_name])
        {
            tmpTxe=this.m_gunDBTex[_name];
        }
        let db={
            ske:tmpSke,
            txe:tmpTxe
        };
        console.log("测试龙骨========",db);
        return db;
        
    }
    public loadGunDB(_name,_callBack)
    {
        console.log("加载龙骨文件=======",_name,this.m_gunDBSke);
        if(this.m_gunDBSke[_name])
        {
            _callBack();
            return ;
        }
        let url="gun/"+_name+"_ske";
        let self=this;
        cc.loader.loadRes(url,dragonBones.DragonBonesAsset,(err,data)=>{
            if(!err)
            {
                this.m_gunDBSke[_name]=data;
                url="gun/"+_name+"_tex";
                cc.loader.loadRes(url,dragonBones.DragonBonesAtlasAsset,(err,data)=>{
                    if(!err)
                    {
                        self.m_gunDBTex[_name]=data;
                        _callBack();
                        console.log("加载测试03=========");
                    }
                    else
                    {
                        utils.instance().consoleLog("加载龙骨贴图失败",_name);
                    }

                });
            }
            else
            {
                utils.instance().consoleLog("加载gunDB失败==",_name);
            }
        });
    }
    public getFishLineVo():ML.FishLineVo
    {
        return this.m_fishLienVo;
    }
    public getFishRes(_fishID:number=0)
    {
        return this.m_fishResArr["fish"+_fishID];
    }
    public loadCommonHintBar()
    {
        let url="prefab/hint";
        let self=this;
        //this.loadFishLine();
        cc.loader.loadRes(url,(err,data)=>{
            if(!err)
            {
                self.m_topTipPrefab=data;
                self.m_commonLoadIsOver++;
               
            }
            else{
              utils.instance().consoleLog("加载提示资源失败");
            }
            
        });
        url="common/headIcon"
        cc.loader.loadRes(url,cc.SpriteAtlas,(err,data)=>{
            if(!err)
            {
                self.m_commonLoadIsOver++;
                self.m_headIcon=data;
            }
        });
        url="common/prop"
        cc.loader.loadRes(url,cc.SpriteAtlas,(err,data)=>{
            if(!err)
            {
                self.m_commonLoadIsOver++;
                self.m_commonProp=data;
            }
        });
        this.loadSoundRes();
        let bgState=parseInt(localStorage.getItem("bgState"));
        let eftState=parseInt(localStorage.getItem("eftState"));
        if(!bgState)
        {
            bgState=0;
        }
        if(!eftState)
        {
            eftState=0;
        }
        url="prefab/fishProp";
        cc.loader.loadRes(url,cc.Prefab,(err,data)=>{
            if(!err)
            {
                self.m_commonLoadIsOver++;
                self.m_fishProp=data;
            }
        });
        url="config/prop";
        cc.loader.loadRes(url,cc.JsonAsset,(err,data)=>{
            if(!err)
            {
                self.m_commonLoadIsOver++;
                self.m_propJson=data.json;
            }
        });
        fgui.UIPackage.loadPackage("fgui/common",this.loadCommonUI.bind(this));
        soundManager.instance().resetSoundState(bgState,eftState);
        //加载gunIcon
        url="prefab/gunIcon";
        cc.loader.loadRes(url,cc.Prefab,(err,data)=>{
            if(!err)
            {
                self.m_commonLoadIsOver++;
                self.m_gunIconPrefab=data;
            }
            else
            {
                utils.instance().consoleLog("加载gunIcon失败");

            }
        });
        //加载RolePrefab
        url="prefab/role";
        cc.loader.loadRes(url,cc.Prefab,(err,data)=>{
            if(!err)
            {
                self.m_commonLoadIsOver++;
                self.m_rolePrefab=data;
            }
            else
            {
                utils.instance().consoleLog("加载RolePrefab失败");
            }
        });
        //加载炮台图片集
        url="common/gunIocn";
        cc.loader.loadRes(url,cc.SpriteAtlas,(err,data)=>{
            if(!err)
            {
                self.m_commonLoadIsOver++;
                self.m_gunIcon=data;
            }
            else
            {
                utils.instance().consoleLog("加载炮图片集失败");
            }
        });
        this.loadJsonData();
    }
    public loadCommonUI()
    {
        this.m_commonLoadIsOver++;
    }
    public loadSoundRes()
    {
        let url="sound";

        let self=this;

        cc.loader.loadResDir(url,(err,_data)=>{

            console.log("加载音乐=====",_data);
            soundManager.instance().setSoundSource(_data);
            this.m_commonLoadIsOver++;
        });
    }
    public getPropNameByID(_itemID)
    {
        let len=this.m_propJson.prop.length;
        let name=null;
        for(let i=0;i<len;i++)
        {
            let id=this.m_propJson.prop[i].ID;
            if(id==_itemID)
            {
                name=this.m_propJson.prop[i].name;
                break;
            }
        }
        return name;
    }
    public getPropDataByID(_itemID)
    {
        let len=this.m_propJson.prop.length;
        let data=null;
        for(let i=0;i<len;i++)
        {
            let id=this.m_propJson.prop[i].ID;
            if(id==_itemID)
            {
                data=this.m_propJson.prop[i];
                break;
            }
        }
        return data;
    }
    public getPropIconByID(_itemID)
    {
        let spr=null;
        spr=this.m_commonProp.getSpriteFrame("prop_"+_itemID);

        return spr;
    }
    public getSkillIconById(_itemID)
    {
        let spr=null;
        spr=this.m_commonProp.getSpriteFrame("skill_"+_itemID);

        return spr;
    }
    public getGunIcon(_id,_type:number=0)
    {
        let spr=null;
        let sprName="gun_"+_id;

        if(_type==1)//炮底座
        {
            sprName="base_"+_id;
        }
        else if(_type==2)
        {
            sprName="bullet_"+_id;
        }
        spr=this.m_gunIcon.getSpriteFrame(sprName);

        return spr;

        
    }
    public getPropIconByReward(_reward)
    {
        let reward=mathUtils.instance().getAwardArr(_reward);

        let type=reward[0];
        let id=reward[2];
        let num=reward[1];
        console.log("玩家升级奖励======",reward);
        if(type=="G")
        {
            id=888887;
        }
        else if(type=="D")
        {
            id=888888;
        }
        let spr=this.getPropIconByID(id);
        let data={
            id:id,
            num:num,
            tex:spr
        };
        return data;
    }
    public getGunBaseByID(_gunID)
    {
        let spr=null;
        spr=this.m_gunBase.getSpriteFrame("base_"+_gunID);

        return spr;
    }
    public getBulletByID(_bulletID)
    {
        let spr=null;
        spr=this.m_bullet.getSpriteFrame("bullet_"+_bulletID);
        return spr;
    }
    public getHeadIconByIndex(_index)
    {
        let spr=null;
        spr=this.m_headIcon.getSpriteFrame("headIcon"+_index);
        console.log("当前头像====",spr);

        return spr;
    }
    public getGunNameByID(_id)
    {
        let gunName="paoA";
        switch(_id)
        {
            case 10002:
            {
                gunName="paoB01";
            }break;
            case 10003:
            {
                gunName="paoC01";
            }break;
            case 10004:
            {
                gunName="paoD01";
            }break;
            case 10005:
            {
                gunName="paoE01";
            }break;
            case 10006:
            {
                gunName="paoF01";
            }break;
            case 10007:
            {
                gunName="paoVIPb";
            }break;
            case 10008:
            {
                gunName="paoVIPc";
            }break;
        }
        return gunName;
    }
    public getLoadResState(_type)
    {
        let state=0;

        if(_type!=2)//Lobby
        {
            if(this.m_commonLoadIsOver==this.m_loadingCnt&&this.m_jsonCnt>=this.m_jsonTotalCnt)
            {
                state=1;
            }
        }
        else if(_type==2)
        {
            if(this.m_fishLoadCnt>=this.m_fishResCnt)
            {
                state=1;
            }
            
        }
        return state;
    }
    public getGunTypeName(_type,_value,_type2:number=0)
    {
        let name="无属性";

        if(_type==1)
        {
            name="火属性：";
            
        }
        else if(_type==2)
        {
            name="水属性：";
        }
        else if(_type==3)
        {
            name="冰属性：";
        }
        else if(_type==4)
        {
            name="龙属性：";
        }
        if(_type2==0)
        {
            name=name+_value;
        }
        return name;
    }
    public loadJsonData()
    {
        if(this.m_jsonLO>=1)
        {
            utils.instance().consoleLog("不需要加载外部Json文件");
            return; 
        }
        let self=this;
        let url="config/skill";
        cc.loader.loadRes(url,cc.JsonAsset,(err,data)=>{
            if(!err)
            {
                self.m_jsonCnt++;
                self.m_cfg["skill"]=data.json;
                
            }
            else
            {
                utils.instance().consoleLog("加载SkillJson失败");
            }
        });
        url="config/task";
        cc.loader.loadRes(url,cc.JsonAsset,(err,data)=>{
            if(!err)
            {
                self.m_jsonCnt++;
                self.m_cfg["task"]=data.json;
                
            }
            else
            {
                utils.instance().consoleLog("加载TaskJson失败");
            }
        });
        url="config/fish";
        cc.loader.loadRes(url,cc.JsonAsset,(err,data)=>{
            if(!err)
            {
                self.m_jsonCnt++;
               
                self.m_fishCfg=data.json;
            }
            else
            {
                utils.instance().consoleLog("加载fish失败");
            }
        });
    }
    public getSkillDataByID(_id)
    {
        let tmpData=null;
        let data=null;
        data=this.m_cfg["skill"].skill;
        let len=data.length;
        for(let i=0;i<len;i++)
        {
            let id=data[i].ID;
            if(id==_id)
            {
                tmpData=data[i];
                break;
            }
        }
        return tmpData;
    }
    public getJsonData(_name)
    {
        let tmpData=null;
        tmpData=this.m_cfg[_name];
        return tmpData;
    }
    public getTaskByID(_id)
    {
        let taskData=this.m_cfg["task"].task;
        let tmpData=null;

        for(let i=0;i<taskData.length;i++)
        {
            let id=taskData[i].ID;

            if(id==_id)
            {
                tmpData=taskData[i];
                break;
            }
        }
        return tmpData;
    }
    public getTaskNameByID(_id)
    {
        let taskData=this.m_cfg["task"].task;
        let name=null;

        for(let i=0;i<taskData.length;i++)
        {
            let id=taskData[i].ID;

            if(id==_id)
            {
                name=taskData[i].name;
                break;
            }
        }
        return name;
    }
    public getTopTipPrefab()
    {

        return this.m_topTipPrefab;
    }






  
}