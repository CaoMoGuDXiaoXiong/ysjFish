import { net } from "../net/net";
import { PROTOCOL_RET, PROTOCOL_SEND } from "../net/protocal";
import { tonyInfo } from "../globle/tonyInfo";
import { preloadRes } from "../globle/preloadRes";

export class gunInfo {
    private m_panel:fgui.GComponent=null;
    private m_skillList:fgui.GList=null;
    public initGunInfoUI()
    {
        this.addListener();
        fgui.UIPackage.loadPackage("fgui/firegun",this.openGunUI.bind(this));
    }
    public addListener()
    {
        
        let self=this;
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK218, self.initUIFunc, self);//获得当前装备的炮的详细信息
        
        
    }
    public offListener()
    {
   
        let self=this;
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK218,self.initUIFunc,self);

    }
    public initUIFunc(_event)
    {
        console.log("2018炮台信息=========",_event);
        let cannon=_event.cannon;

        let hp=cannon.hp;
        let def=cannon.def;
        let act=cannon.act;
        let actSpeed=cannon.actSpeed;
        let type=cannon.actType;
        let typeNum=cannon.actTypeNum;

        let level=cannon.level;
        let stage=cannon.stage;
        let skillArr=_event.skillArr;
        if(this.m_panel)
        {
            let hpTxt=this.m_panel.getChild("hp").asTextField;
            
            hpTxt.text=""+hp;
            let defTxt=this.m_panel.getChild("def").asTextField;
            defTxt.text=""+def;
            let actTxt=this.m_panel.getChild("act").asTextField;
            actTxt.text=""+act;
            let actSpeedTxt=this.m_panel.getChild("actSpeed").asTextField;
            actSpeedTxt.text=""+actSpeed;
            let typeName=this.m_panel.getChild("typeName").asTextField;
            let tnStr=preloadRes.instance().getGunTypeName(type,0,1);
            typeName.text=tnStr;
            let actTypeTxt=this.m_panel.getChild("type").asTextField;
            if(type==0)
            {
                actTypeTxt.visible=false;
            }
            else
            {
                actTypeTxt.text=""+typeNum;
            }
            //初始化技能

            this.m_skillList=this.m_panel.getChild("skillList").asList;
            this.m_skillList.removeChildrenToPool();
            let tmpIndex=0;
            let tmpSkillData=preloadRes.instance().getJsonData("skill");
            this.m_skillList.on(fgui.Event.CLICK_ITEM,this.skillListFunc,this);
            for(let index in skillArr)
            {
                this.m_skillList.addItemFromPool();
                let item=<any>this.m_skillList.getChildAt(tmpIndex);
               
                
                item.customData=skillArr[index];

               
                if(tmpIndex==0)
                {
                    this.updateSkillPanel(skillArr[index],item);
                }
                tmpIndex++;
            }

            
        }
        

    }
    skillListFunc(_event)
    {
        let index=this.m_skillList.getChildIndex(_event);
        
        let curData=_event.customData;
        this.updateSkillPanel(curData,_event);
        
    }
    public updateSkillPanel(_skillData,_item)
    {
        let skillID=_skillData.skillID;
        let level=_skillData.skillLevel;
        _item.selected=true;
        let tmpData=preloadRes.instance().getSkillDataByID(skillID);

        let tex=preloadRes.instance().getSkillIconById(skillID);

        let icon=_item.getChild("icon").asLoader;
        icon.texture=tex;
        let type=tmpData.type;
        let name=tmpData.skillName;
        let tmpDesc=tmpData.desc;
        let skillName="主动技能："+name;
        let consumeNum=tmpData.useConsume;
        if(type==0)
        {
            skillName="被动技能："+name;
        }
        if(skillID==1002)
        {
           
            let tmpDesc02=tmpDesc.replace("@","50%");
            tmpDesc=tmpDesc02;
            console.log("测试替换字符串======",tmpDesc02);
        }
        let skillNameTxt=this.m_panel.getChild("name").asTextField;
        skillNameTxt.text=""+skillName;

        let desc=this.m_panel.getChild("desc").asTextField;

        desc.text=""+tmpDesc;
        let consumeTxt=this.m_panel.getChild("consume").asTextField;
        consumeTxt.text="消耗："+consumeNum+"愤怒";
        //等级
        let levelTxt=this.m_panel.getChild("level").asTextField;

        levelTxt.text="技能等级："+level;

               
       
        
    }
    openGunUI()
    {
        let self=this;
        fgui.UIPackage.addPackage("fgui/firegun");
        let panel = fgui.UIPackage.createObject("firegun", "panel").asCom;
        panel.makeFullScreen();
      
        fgui.GRoot.inst.addChild(panel);
        let icon=panel.getChild("panel").asCom.getChild("icon").asCom;
        let btnClose=panel.getChild("panel").asCom.getChild("bg").asCom.getChild("btnClose").asButton;
        btnClose.onClick(()=>{
            panel.dispose();
            self.offListener();
        },this);
        this.m_panel=panel.getChild("panel").asCom.getChild("right").asCom;
        
        let gunCom=icon.getChild("icon").asLoader;
        let gunBase=icon.getChild("base").asLoader;

        let quireID=tonyInfo.instance().m_cannonID;
        //quireID=10004;
        gunCom.texture=preloadRes.instance().getGunIcon(quireID,0);
        gunBase.texture=preloadRes.instance().getGunIcon(quireID,1);
        let offPos=this.getGunoffPos(quireID);

        gunCom.x+=offPos.gunX;
        gunCom.y+=offPos.gunY;
        gunBase.x+=offPos.baseX;
        gunBase.y+=offPos.baseY;
        gunCom.setScale(offPos.gunScale,offPos.gunScale);
        
        let sData=
        {
            "action":PROTOCOL_SEND.MSGID_CTS_218GETGUNINFO
        }
        net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_218GETGUNINFO,sData);

        // let dbName02=preloadRes.instance().getGunNameByID(quireID);
        // preloadRes.instance().loadGunDB(dbName02,()=>{
           
        //     let gunIcon=cc.instantiate(preloadRes.instance().m_gunIconPrefab);
            
        //     let tmpInfo=self.getGunIconInfo(quireID);
        //     gunIcon.x=tmpInfo.offX;
        //     gunIcon.y=tmpInfo.offY;
        //     gunIcon.scale=tmpInfo.scale;
        //     //console.log("测试龙骨02=======",tmpInfo,dbName02,gunIcon);
        //     let dbRes=preloadRes.instance().getGunBDByName(dbName02);
        //     let tmpSke=dbRes.ske;
        //     let tmpTex=dbRes.txe;
        //     let dbCom=gunIcon.getComponent("dragonBones.ArmatureDisplay");
        //     dbCom.dragonAsset=tmpSke;
        //     dbCom.dragonAtlasAsset=tmpTex;
        //     dbCom.armatureName=dbName02;
        //    dbCom.playAnimation("Pao",1);
        //     gunCom.node.addChild(gunIcon);
        // });
    }
    public getGunoffPos(_id)
    {
        let gunPosX=0;
        let gunPosY=0;
        let basePosX=0;
        let basePosY=0;
        let scale=1.0;
        let scaleBase=1.0;
        
        if(_id==10001)
        {
            gunPosX=-5;
            gunPosY=90;
            basePosX=0;
            basePosY=60;
        }
        else if(_id==10002)
        {
            gunPosX=-5;
            gunPosY=95;
            basePosX=0;
            basePosY=60;
        }
        else if(_id==10003)
        {
            gunPosX=-5;
            gunPosY=85;
            basePosX=0;
            basePosY=40;
            scale=0.8;
        }
        else if(_id==10004)
        {
            gunPosX=-5;
            gunPosY=85;
            basePosX=0;
            basePosY=40;
            scale=0.8;
        }
        let pos=
        {
            gunX:gunPosX,
            gunY:gunPosY,
            baseX:basePosX,
            baseY:basePosY,
            gunScale:scale,
            baseScale:scaleBase
        }

        return pos;
    }
    public getGunIconInfo(_id)
    {
        let tmpScale=1;
        let offsetX=15;
        let offsetY=-50;
        if(_id==10005)
        {
            tmpScale=0.7;
            offsetY=0;
        }
        else if(_id==10003)
        {
            tmpScale=1;
            offsetY=-35;
        }
        let data={
            scale:tmpScale,
            offX:offsetX,
            offY:offsetY
        };

        return data;
    }
}