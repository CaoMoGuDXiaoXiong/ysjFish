import { PROTOCOL_SEND, PROTOCOL_RET } from "../net/protocal";
import { net } from "../net/net";
import { tonyInfo } from "../globle/tonyInfo";
import { btnCtrl } from "../globle/btnCtrl";
import { utils } from "../globle/utils";
import { preloadRes } from "../globle/preloadRes";

export class playerInfo {


    private m_playerInfoPanel=null;
    private m_gunList:fgui.GList=null;
    private m_rightPanel:fgui.GComponent=null;
    private m_infoPanel:fgui.GComponent=null;
    private m_ckpb=null;
    private lastIndex=0;
    private m_BtnArr={};
    private m_apLabel={};
    private m_cannonHP=0;
    private m_cannonDef=0;
    private m_cannonAct=0;
    private m_cannonActSpeed=0;
    private m_cannonType=0;
    private m_cannonTypeNum=0;
    private m_hpPoint=0;
    private m_defPoint=0;
    private m_actPoint=0;
    private m_actSpeedPoint=0;
    private m_panel:fgui.GComponent=null;
    private m_dbCom:dragonBones.ArmatureDisplay=null;
    private m_gunIcon=null;
    private m_totalHP=0;
    private m_totalDef=0;
    private m_totalAct=0;
    private m_totalActSpeed=0;
    public loadUIRes()
    {
        this.addListener();
        fgui.UIPackage.loadPackage("fgui/playerInfo",this.uiLoadCallBack.bind(this));
 

    }
    public addListener()
    {
        let self=this;
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK216, self.openPlayerInfoUI, self);//个人信息
        net.instance().getDataFromServer(PROTOCOL_RET.MSGID_STC_BACK217, self.playerAPCallBack, self);//玩家加点
        
    }
    public offListener()
    {
   
        let self=this;
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK216,self.openPlayerInfoUI,self);
        net.instance().offProtocal(PROTOCOL_RET.MSGID_STC_BACK217,self.playerAPCallBack,self);
    }
    clearUI()
    {
        this.offListener();
        if(this.m_panel)
        {
            this.m_panel.dispose();
            this.m_panel=null;
        }
    }
    public uiLoadCallBack()
    {
        
        let sData=
        {
            "action":PROTOCOL_SEND.MSGID_CTS_216GETPLAYERINFO
        }
        net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_216GETPLAYERINFO,sData);
        
    }
    playerAPCallBack(_event)
    {
        let code=_event.code;
        let hp=_event.hp;
        let def=_event.def;
        let act=_event.act;
        let actSpeed=_event.actSpeed;
        let leftPoint=_event.leftPoint;
        console.log("2017=======",_event);
        if(code==99)
        {
            
            
          
            tonyInfo.instance().m_leftPoint=leftPoint;
            tonyInfo.instance().showTopTips("加点失败");
            if(this.m_playerInfoPanel)
            {
                this.m_playerInfoPanel.dispose();
                this.m_playerInfoPanel=null;
            }
        }
        else
        {
            for(let item in this.m_apLabel)
            {
                this.m_apLabel[item].visible=false;
            }
            tonyInfo.instance().m_hp=hp;
            tonyInfo.instance().m_def=def;
            tonyInfo.instance().m_actPower=act;
            tonyInfo.instance().m_actSpeed=actSpeed;
            tonyInfo.instance().m_leftPoint=leftPoint;
            console.log("加点成功=========",hp,def,act,actSpeed,leftPoint)
            tonyInfo.instance().showTopTips("加点成功");
            this.updateUserInfo();
        }
    }
    public updateData(_type,_num1,_num2)
    {
        if(_type==0)
        {
            this.m_totalHP=_num1+_num2;
        }
        else if(_type==1)
        {
            this.m_totalDef=_num1+_num2;
        }
        else if(_type==2)
        {
            this.m_totalAct=_num1+_num2;
        }
        else if(_type==3)
        {
            this.m_totalActSpeed=_num1+_num2;
        }
    }
    public openPlayerInfoUI(_event)
    {
        let cannon=_event.cannon;
        let equipID=_event.equipID;
        let index=1;

       

        tonyInfo.instance().m_equipGunID=equipID;

        tonyInfo.instance().m_cannonArr=cannon;
        equipID=tonyInfo.instance().m_cannonID;

        let self=this;
        fgui.UIPackage.addPackage("fgui/playerInfo");
        let panel = fgui.UIPackage.createObject("playerInfo", "panel").asCom;
        panel.makeFullScreen();
        this.m_panel=panel;
     
        this.m_playerInfoPanel=panel;
        fgui.GRoot.inst.addChild(panel);

        let infoCom=panel.getChild("info").asCom;
        self.m_infoPanel=infoCom;
        let topCom=panel.getChild("top").asCom;

        let btnClose=topCom.getChild("btnClose").asButton;
        
        btnClose.onClick(()=>{
            let state=btnCtrl.instance().getBtnState();

            if(state<=0)
            {
                return ;
            }
            console.log("玩家加点测试========",tonyInfo.instance().m_leftPoint);
            self.m_playerInfoPanel=null;
           
            self.clearUI();
        },this);

        //UI信息开始--
        //体力
        let tili=topCom.getChild("tili").asCom.getChild("num").asTextField;
        tili.text=""+tonyInfo.instance().m_tili;

        //金币--
        let money=topCom.getChild("money").asCom.getChild("num").asTextField;
        money.text=""+tonyInfo.instance().m_playerMoney;
        //钻石
        let diamond=topCom.getChild("diamond").asCom.getChild("num").asTextField;
        diamond.text=""+tonyInfo.instance().m_playerDiamond;

        //等级
        let comLv=infoCom.getChild("comLv").asCom;
        let level=comLv.getChild("lv").asTextField;
        level.text="Lv"+tonyInfo.instance().m_gameLevel;
        let exp=comLv.getChild("exp").asProgress;
        exp.value=tonyInfo.instance().m_curGameExp;
        exp.max=tonyInfo.instance().m_nextLvExp;
        let expNum=comLv.getChild("num").asTextField;
        expNum.text=""+tonyInfo.instance().m_curGameExp+"/"+tonyInfo.instance().m_nextLvExp;
        //怒气值
        let angryCom=infoCom.getChild("angry").asCom;
        let numBar=angryCom.getChild("bar").asProgress;
        numBar.value=100;//tonyInfo.instance().m_angryPower;
        numBar.max=150;
        let angryNum=angryCom.getChild("num").asTextField;
        angryNum.text=""+tonyInfo.instance().m_angryPower+"/150";


        let headCom=infoCom.getChild("head").asCom;
        let btnChangeHI=headCom.getChild("btnHead").asButton;
        

        btnChangeHI.onClick(()=>{
            let state=btnCtrl.instance().getBtnState();
            if(state<=0)
            {
                return ;
            }
            self.clearUI();
            fgui.UIPackage.loadPackage("fgui/CHI",this.openChangeHIUI.bind(this));
            utils.instance().consoleLog("玩家切换头像");
        },this);
        //切换名字
        let btnChangeName=headCom.getChild("btnChangeName").asButton;

        btnChangeName.onClick(()=>{
            let state=btnCtrl.instance().getBtnState();
            if(state<=0)
            {
                return ;
            }
            fgui.UIPackage.loadPackage("fgui/common",this.openChangeNameUI.bind(this));
            self.clearUI();
            console.log("换名字");
        },this);
        //初始化玩家信息开始--
        let headIcon=btnChangeHI.getChild("icon").asLoader;
        let hiIndex=tonyInfo.instance().m_headIndex;
      
        let hitex=preloadRes.instance().getHeadIconByIndex(hiIndex);
        headIcon.texture=hitex;

        let name=headCom.getChild("name").asTextField;
        name.text=tonyInfo.instance().m_playerName;
        //初始化玩家信息结束--

        //炮台信息开始---
        let rightCom=panel.getChild("rightCom").asCom;
        self.m_rightPanel=rightCom;
        
        let gunIcon=rightCom.getChild("gunIcon").asLoader;
        let gunID=10001;
        let url="gun/paoA_ske";
        let tmpData=null;

        let quireID=equipID;
        let dbName02=preloadRes.instance().getGunNameByID(quireID);
        preloadRes.instance().loadGunDB(dbName02,()=>{
            console.log("加载成功==============");
            self.m_gunIcon=cc.instantiate(preloadRes.instance().m_gunIconPrefab);
            let tmpInfo=self.getGunIconInfo(quireID);

            self.m_gunIcon.x=tmpInfo.offX;
            self.m_gunIcon.y=tmpInfo.offY;
            self.m_gunIcon.scale=tmpInfo.scale;
            let dbRes=preloadRes.instance().getGunBDByName(dbName02);
            let tmpSke=dbRes.ske;
            let tmpTex=dbRes.txe;
            self.m_dbCom=self.m_gunIcon.getComponent("dragonBones.ArmatureDisplay");
            self.m_dbCom.dragonAsset=tmpSke;
            self.m_dbCom.dragonAtlasAsset=tmpTex;
            self.m_dbCom.armatureName=dbName02;
            self.m_dbCom.playAnimation("Pao",1);
            gunIcon.node.addChild(self.m_gunIcon);
            self.updateRGInfo(quireID)
            this.updateUserInfo();
        });
        let gunList=rightCom.getChild("gunList").asList;
        gunList.on(fgui.Event.CLICK_ITEM,self.gunItemFunc,this);
        self.m_gunList=gunList;
        gunList.removeChildrenToPool();
        let cannonArr=tonyInfo.instance().m_cannonArr;
        let index01=0;
        let lastIndex=0;
        console.log("创建炮01============================",cannonArr);
        for(let gun in cannonArr)
        {
            gunList.addItemFromPool();
            let item=<any>gunList.getChildAt(index01);
            let cannID=cannonArr[gun].cannonID;
            item.customData=cannID;
            let gunIcon=item.getChild("icon").asLoader;

            let gunItemPrefab=cc.instantiate(preloadRes.instance().m_gunIconPrefab);
            let tmpScale=0.6;
            let offsetX=0;
            let offsetY=0;
            if(cannID==10005)
            {
                tmpScale=0.45;
                offsetY=30;
            }
            else if(cannID==10003)
            {
                tmpScale=0.55;
                offsetY=10;
            }
            gunItemPrefab.scale=tmpScale;
            gunItemPrefab.x=18+offsetX;
            gunItemPrefab.y=-30+offsetY;
            gunIcon.node.addChild(gunItemPrefab);
            let name=item.getChild("name").asTextField;
            let itemName=preloadRes.instance().getPropNameByID(cannID);
            name.text=""+itemName;

            let dbName=preloadRes.instance().getGunNameByID(cannID);
            preloadRes.instance().loadGunDB(dbName,()=>{
                let dbRes=preloadRes.instance().getGunBDByName(dbName);
                let tmpSke=dbRes.ske;
                let tmpTex=dbRes.txe;
                let dbCom:dragonBones.ArmatureDisplay=gunItemPrefab.getComponent("dragonBones.ArmatureDisplay");
                dbCom.dragonAsset=tmpSke;
                dbCom.dragonAtlasAsset=tmpTex;
               dbCom.armatureName=dbName;
               dbCom.playAnimation("Pao",1);
            });
            if(cannID!=equipID)
            {
                item.getController("c1").selectedIndex=1;
                
            }
            else
            {
                lastIndex=index01;
            }
            index01++;
           console.log('当前侧炮的信息====',itemName,equipID,cannID,lastIndex);
        }

        //初始化UserInfo
        
        let uidCom=infoCom.getChild("uid").asCom;
        let uid=uidCom.getChild("num").asTextInput;
        uid.text=""+tonyInfo.instance().m_playerUID;
        let uidBtn01=uidCom.getChild("btnAdd").asButton;
        uidBtn01.visible=false;
        let uidBtn02=uidCom.getChild("btnMinus").asButton;
        uidBtn02.visible=false;
        let uidAP=uidCom.getChild("gunNum").asTextField;
        uidAP.visible=false;
        
        let hpLeft=this.m_infoPanel.getChild("hp").asCom;
        this.initAPBtn(hpLeft,10);
        let defCom=this.m_infoPanel.getChild("def").asCom;
        this.initAPBtn(defCom,11);
        let actCom=this.m_infoPanel.getChild("act").asCom;
        this.initAPBtn(actCom,12);
        let actSpeedCom=this.m_infoPanel.getChild("actSpeed").asCom;
        this.initAPBtn(actSpeedCom,13);

        let btnAPCtrl=infoCom.getChild("btnAP").asButton.getController("c1");
        let btnAddPoint=infoCom.getChild("btnAP").asButton;
        btnAddPoint.onClick(()=>{
            let state=btnCtrl.instance().getBtnState();
            if(state<=0)
            {
                return ;
            }
            let leftPoint01=tonyInfo.instance().m_leftPoint;
            if(leftPoint01<=0&&index%2!=0)
            {
                tonyInfo.instance().showTopTips("没有可用的点数")
                return ;
            }
            index++;
            if(index%2==0)
            {
                btnAPCtrl.selectedIndex=1;
                for(let item in this.m_BtnArr)
                {
                    this.m_BtnArr[item].visible=true;
                }
                for(let item in this.m_apLabel)
                {
                    this.m_apLabel[item].visible=true;
                }
                this.updateAPLabel();
            }
            else
            {
                btnAPCtrl.selectedIndex=0;
                for(let item in this.m_BtnArr)
                {
                    this.m_BtnArr[item].visible=false;
                }
                for(let item in this.m_apLabel)
                {
                    this.m_apLabel[item].visible=false;
                }
                let totalP=this.m_hpPoint+this.m_defPoint+this.m_actPoint+this.m_actSpeedPoint;
                this.m_hpPoint=0;
                this.m_defPoint=0;
                this.m_actPoint=0;
                this.m_actSpeedPoint=0;
                tonyInfo.instance().m_leftPoint+=totalP;
                let leftPoint=infoCom.getChild("left").asTextField;
                leftPoint.text="剩余点数："+tonyInfo.instance().m_leftPoint;
            }
        },this);
        let btnConfirm=infoCom.getChild("btnConfirm").asButton;
        btnConfirm.visible=false;
        this.m_BtnArr["30"]=btnConfirm;
        btnConfirm.onClick(this.btnFunc,this);
        btnConfirm.customData=30;
        // //剩余点数
        let leftPoint=infoCom.getChild("left").asTextField;
        leftPoint.text="剩余点数："+tonyInfo.instance().m_leftPoint;
        
    }
    public updateAPLabel(_type:number=0)
    {
        let num01=0;
        let num02=0;
        if(_type>0)
        {
            let index=""+_type;
            if(_type==10)
            {
                num01=this.m_totalHP+this.m_hpPoint*40;
                num02=tonyInfo.instance().m_hpPoint+this.m_hpPoint;
            }
            else if(_type==11)
            {
                num01=this.m_totalDef*100+(this.m_defPoint*0.8)*100;
                num01=num01/100;
                num02=tonyInfo.instance().m_defPoint+this.m_defPoint;
               
            }
            else if(_type==12)
            {
                num01=this.m_totalAct*100+(this.m_actPoint*1.2)*100;
                num01=num01/100;
                num02=tonyInfo.instance().m_actPoint+this.m_actPoint;
            }
            else if(_type==13)
            {
                num01=this.m_totalActSpeed*100+(this.m_actSpeedPoint*0.4)*100;
                num01=num01/100;
                num02=tonyInfo.instance().m_actSpeedPoint+this.m_actSpeedPoint;
            }
            
            this.m_apLabel[index].text="("+num01+"-->"+num02+")";
            
        }
        else
        {

        
            for(let item in this.m_apLabel)
            {
                console.log("测试更新Label=====",item);
                if(item=="10")
                {
                    num01=this.m_totalHP;
                    num02=tonyInfo.instance().m_hpPoint;
                // this.m_apLabel[item].text="("+this.m_totalHP+"->"+tonyInfo.instance().m_hpPoint+")";
                }
                else if(item=="11")
                {
                    num01=this.m_totalDef;
                    num02=tonyInfo.instance().m_defPoint;
                }
                else if(item=="12")
                {
                    num01=this.m_totalAct;
                    num02=tonyInfo.instance().m_actPoint;
                }
                else if(item=="13")
                {
                    num01=this.m_totalActSpeed;
                    num02=tonyInfo.instance().m_actSpeedPoint;
                }
                this.m_apLabel[item].text="("+num01+"-->"+num02+")";
            }
        }
        let leftPoint=this.m_infoPanel.getChild("left").asTextField;
        leftPoint.text="剩余点数："+tonyInfo.instance().m_leftPoint;
    }
    public initAPBtn(_com,_type)
    {
        let btn=_com.getChild("btnAdd").asButton;
        let btntnMinus=_com.getChild("btnMinus").asButton;
        btn.visible=false;
        btn.customData=_type;
        btntnMinus.customData=_type+10;
        btn.onClick(this.btnFunc,this);
        btntnMinus.onClick(this.btnFunc,this);
        btntnMinus.visible=false;
        btntnMinus.enabled=false;
        this.m_BtnArr[_type]=btn;
        this.m_BtnArr[_type+10]=btntnMinus;
        let apNum=_com.getChild("gunNum").asTextField;
        apNum.visible=false;
        this.m_apLabel[_type]=apNum;
        
    }
    public btnFunc(_target)
    {
        
        let target=_target.currentTarget;
        
        
        let obj02=target.$gobj;
        let btnType=obj02.customData;
        let leftPoint=tonyInfo.instance().m_leftPoint;
        console.log("玩家点击的类型=====",btnType);
        if(btnType<20)
        {
            if(leftPoint<=0)
            {
                tonyInfo.instance().showTopTips("没有可用的点数");
                return ;
            }
            tonyInfo.instance().m_leftPoint--;
        }
        else if(btnType!=30)
        {
            tonyInfo.instance().m_leftPoint++;
        }
        
        

        if(btnType==10)//玩家加点 气血
        {
            this.m_hpPoint++;
            if(this.m_hpPoint==1)
            {
                this.m_BtnArr[btnType+10].enabled=true;
            }
            this.updateAPLabel(10);
        }
        else if(btnType==11)//玩家加点 防御
        {
            this.m_defPoint++;
            if(this.m_defPoint==1)
            {
                this.m_BtnArr[btnType+10].enabled=true;
            }
            this.updateAPLabel(11);
        }
        else if(btnType==12)//玩家加点攻击
        {
            this.m_actPoint++;
            if(this.m_actPoint==1)
            {
                this.m_BtnArr[btnType+10].enabled=true;
            }
            this.updateAPLabel(12);
        }
        else if(btnType==13)//防御
        {
            this.m_actSpeedPoint++;
            if(this.m_actSpeedPoint==1)
            {
                this.m_BtnArr[btnType+10].enabled=true;
            }
            this.updateAPLabel(13);
        }
        else if(btnType==20)//玩家减点 气血
        {
            if(this.m_hpPoint>0)
            {
                this.m_hpPoint--;
                if(this.m_hpPoint<=0)
                {
                    this.m_BtnArr[btnType].enabled=false;
                }
                this.updateAPLabel(10);
            }
        }
        else if(btnType==21)//玩家减点防御
        {
            if(this.m_defPoint>0)
            {
                this.m_defPoint--;
                if(this.m_defPoint<=0)
                {
                    this.m_BtnArr[btnType].enabled=false;
                }
                this.updateAPLabel(11);
            }
        }
        else if(btnType==22)//玩家减点攻击
        {
            if(this.m_actPoint>0)
            {
                this.m_actPoint--;
                if(this.m_actPoint<=0)
                {
                    this.m_BtnArr[btnType].enabled=false;
                }
                this.updateAPLabel(12);
            }
        }
        else if(btnType==23)//攻击速度
        {
            if(this.m_actSpeedPoint>0)
            {
                this.m_actSpeedPoint--;
                if(this.m_actSpeedPoint<=0)
                {
                    this.m_BtnArr[btnType].enabled=false;
                }
                this.updateAPLabel(13);
            }
        }
        else if(btnType==30)//玩家加点完成 确定
        {
            let totalP=this.m_hpPoint+this.m_defPoint+this.m_actPoint+this.m_actSpeedPoint;
            if(totalP>=1)
            {
                
               
                let sData=
                {
                    "action":PROTOCOL_SEND.MSGID_CTS_217ADDPOINT,
                    "hp":this.m_hpPoint,
                    "def":this.m_defPoint,
                    "act":this.m_actPoint,
                    "actSpeed":this.m_actSpeedPoint
                
                }
                net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_217ADDPOINT,sData);
               
            }
            for(let item in this.m_BtnArr)
            {
                this.m_BtnArr[item].visible=false;
            }
           
            let btnAPCtrl=this.m_infoPanel.getChild("btnAP").asButton.getController("c1");
            btnAPCtrl.selectedIndex=0;
            console.log("玩家加点====");

        }
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
    
    public updateUserInfo()
    {
        let hpLeft=this.m_infoPanel.getChild("hp").asCom;
        let gunNum=hpLeft.getChild("num").asTextField;
        let totalN=tonyInfo.instance().m_hp+this.m_cannonHP;
        gunNum.text=Math.floor(totalN)+"";
        this.updateData(0,tonyInfo.instance().m_hp,this.m_cannonHP);

        let defLeft=this.m_infoPanel.getChild("def").asCom;
        gunNum=defLeft.getChild("num").asTextField;
        totalN=tonyInfo.instance().m_def+this.m_cannonDef;
        gunNum.text=""+Math.floor(totalN);
        this.updateData(1,tonyInfo.instance().m_def,this.m_cannonDef);
        let actLeft=this.m_infoPanel.getChild("act").asCom;
        gunNum=actLeft.getChild("num").asTextField;
        totalN=tonyInfo.instance().m_actPower+this.m_cannonAct;
        this.updateData(2,tonyInfo.instance().m_actPower,this.m_cannonAct);
        gunNum.text=""+Math.floor(totalN);
        let actSpeedLeft=this.m_infoPanel.getChild("actSpeed").asCom;
        totalN=tonyInfo.instance().m_actSpeed+this.m_cannonActSpeed;
        gunNum=actSpeedLeft.getChild("num").asTextField;
        this.updateData(3,tonyInfo.instance().m_actSpeed,this.m_cannonActSpeed);
        gunNum.text=""+Math.floor(totalN);

        let name=preloadRes.instance().getGunTypeName(this.m_cannonType,this.m_cannonTypeNum);

        let typeName=this.m_infoPanel.getChild("type").asTextField;
        typeName.text=""+name;
    }
    public updateRGInfo(_id)
    {
        let cannonData=tonyInfo.instance().m_cannonArr[_id];
        //HP
        let hpCom=this.m_rightPanel.getChild("hp").asTextField;
        hpCom.text="气血："+cannonData.hp;
        //def 
        let defTxt=this.m_rightPanel.getChild("def").asTextField;
        defTxt.text="防御："+cannonData.def;
        //攻击
        let actTxt=this.m_rightPanel.getChild("actN").asTextField;
        actTxt.text="攻击力："+cannonData.act;
        //攻击速度==
        let actSpeedTxt=this.m_rightPanel.getChild("speed").asTextField;
        actSpeedTxt.text="攻击速度："+cannonData.actSpeed;
        this.m_cannonHP=cannonData.hp;
        this.m_cannonDef=cannonData.def;
        this.m_cannonAct=cannonData.act;
        this.m_cannonActSpeed=cannonData.actSpeed;
        console.log("跑的属性======",cannonData);
        let type=cannonData.actType;
        let value=cannonData.actTypeNum;
        this.m_cannonType=type;
        this.m_cannonTypeNum=value;
        //属性
        let actType01=this.m_rightPanel.getChild("type").asTextField;
        let tmpTypeName=preloadRes.instance().getGunTypeName(type,value);

        actType01.text=tmpTypeName;
        

       

        //  let 
    }
    public gunItemFunc(event){
        let state=btnCtrl.instance().getBtnState();
        if(state<=0)
        {
            return ;
        }
        let self=this;
        let index=this.m_gunList.getChildIndex(event);
        if(index!=this.lastIndex)
        {
            let lastItem=<any>this.m_gunList.getChildAt(this.lastIndex);
            lastItem.getController("c1").selectedIndex=1;

            event.getController("c1").selectedIndex=0;

            this.lastIndex=index;
            let curData=event.customData;

            let dbName=preloadRes.instance().getGunNameByID(curData);
            preloadRes.instance().loadGunDB(dbName,()=>{
                let dbRes=preloadRes.instance().getGunBDByName(dbName);
                let tmpSke=dbRes.ske;
                let tmpTex=dbRes.txe;
                self.m_dbCom.dragonAsset=tmpSke;
                self.m_dbCom.dragonAtlasAsset=tmpTex;
                self.m_dbCom.armatureName=dbName;
                let gunInfo=self.getGunIconInfo(curData);
                self.m_gunIcon.scale=gunInfo.scale;
                self.m_gunIcon.x=gunInfo.offX;
                self.m_gunIcon.y=gunInfo.offY;
                
                self.updateRGInfo(curData)
                self.updateUserInfo();
                
            });
        }
        utils.instance().consoleLog("玩家选择头像01=======",index);

    }
    public openChangeHIUI()
    {
        let self=this;
        fgui.UIPackage.addPackage("fgui/CHI");
        let panel = fgui.UIPackage.createObject("CHI", "panelCom").asCom;
        panel.makeFullScreen();
      
        fgui.GRoot.inst.addChild(panel);

        let btnClose=panel.getChild("panel").asCom.getChild("btnClose").asButton;

        btnClose.onClick(()=>{
            let state=btnCtrl.instance().getBtnState();
            if(state<=0)
            {
                return ;
            }
            panel.dispose();
        },this);
        
        let lastIndex=0;
        lastIndex=tonyInfo.instance().m_headIndex-1;
        let hiList=panel.getChild("panel").asCom.getChild("itemList").asList;
        let hiItemFunc=(event)=>{
            let state=btnCtrl.instance().getBtnState();
            if(state<=0)
            {
                return ;
            }
            
            let index=hiList.getChildIndex(event);
            if(index!=lastIndex)
            {
                let lastItem=<any>hiList.getChildAt(lastIndex);
                lastItem.getController("c1").selectedIndex=0;

                event.getController("c1").selectedIndex=1;

                lastIndex=index;
            }

            
           
            utils.instance().consoleLog("玩家选择头像03=======",index);

        };
        hiList.on(fgui.Event.CLICK_ITEM,hiItemFunc,this);
        
        for(let i=0;i<6;i++)
        {
            let item=<any>hiList.addItemFromPool();
            if(i==lastIndex)
            {
                let ctr1=<fgui.Controller>item.getController("c1");
                ctr1.selectedIndex=1;
            }
            let tex=item.getChild("tex").asLoader;
            let hitex=preloadRes.instance().getHeadIconByIndex(i+1);

            tex.texture=hitex;

        }
        let btnConfirm=panel.getChild("panel").asCom.getChild("btnConfirm").asButton;
        btnConfirm.onClick(()=>{

            let state=btnCtrl.instance().getBtnState();
            if(state<=0)
            {
                return ;
            }
            if(lastIndex+1!=tonyInfo.instance().m_headIndex)
            {
                let sData=
                {
                    "action":PROTOCOL_SEND.MSGID_CTS_213CHANGEHI,
                    "hiIndex":lastIndex
                }
                console.log("发生切换头像请求=",lastIndex);
                net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_213CHANGEHI,sData);
                panel.dispose();
            }
            else
            {
                tonyInfo.instance().showTopTips("请选择和您现在不一样的头像");
            }
        },this);

    }
    openChangeNameUI()
    {
        let self=this;
        fgui.UIPackage.addPackage("fgui/common");
        let panel = fgui.UIPackage.createObject("common", "CNPanel").asCom;
        panel.makeFullScreen();
      
        fgui.GRoot.inst.addChild(panel);

        let btnClose=panel.getChild("panel").asCom.getChild("btnClose").asButton;
        btnClose.onClick(()=>{
            let state=btnCtrl.instance().getBtnState();
            if(state<=0)
            {
                return ;
            }
            panel.dispose();
        },this);

        let btnConfirm=panel.getChild("panel").asCom.getChild("btnConfirm").asButton;
        let nameTxt=panel.getChild("panel").asCom.getChild("name").asTextField;
        btnConfirm.onClick(()=>{
            let state=btnCtrl.instance().getBtnState();
            if(state<=0)
            {
                return ;
            }
            let str=nameTxt.text;
            let nameState=this.checkNameIsCKPB(str);
            if(nameState==0)
            {
                let sData=
                {
                    "action":PROTOCOL_SEND.MSGID_CTS_214CHANGEHI,
                    "name":str
                }
                net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_214CHANGEHI,sData);
                panel.dispose();
            }
            console.log("玩家修改姓名======",str);
        },this);
        if(!this.m_ckpb)
        {
            cc.loader.loadRes("config/ckpb",cc.JsonAsset,(err,data)=>{
                if(!err)
                {
                    this.m_ckpb=data.json;
                    utils.instance().consoleLog("加载敏感词汇成功");
                }
                else
                {
                    utils.instance().consoleLog("加载敏感词汇失败");
                }
            });
        }
    }
    checkNameIsCKPB(_name)
    {
        
       let len=this.m_ckpb.g_regexList.length;
       let state=0;
       for(let i=0;i<len;i++)
       {
           let tmpStr=this.m_ckpb.g_regexList[i];
           let result=_name.indexOf(tmpStr);
           if(result>=0)
           {
             tonyInfo.instance().showTopTips("包含敏感词汇");
             state=1;
             console.log("测试敏感吃完======",tmpStr,result,_name);
             break;
           }

       }
       return state;
    }
    // update (dt) {}
}
