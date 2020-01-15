import { preloadRes } from "../globle/preloadRes";
import { utils } from "../globle/utils";
import { mathUtils } from "../globle/mathUtils";
import { btnCtrl } from "../globle/btnCtrl";
import { tonyInfo } from "../globle/tonyInfo";
import { PROTOCOL_RET, PROTOCOL_SEND } from "../net/protocal";
import { net } from "../net/net";

export class taskUI {
    private m_panel:fgui.GComponent=null;
    private m_taskList:fgui.GList=null;
    private m_taskResultArr={};
    private m_curTaskLv=1;
    private m_curTaskIndex=0;
    private m_mainPanel:fgui.GComponent=null;
    private m_btnDetailIndex=1;
    private m_getTaskState=0;
    private m_curTaskName="";
    private m_taskID=-1;
    public initTaskUI()
    {
       
        fgui.UIPackage.loadPackage("fgui/task",this.openTaskUI.bind(this));
    }
    openTaskUI()
    { 
        let self=this;
        fgui.UIPackage.addPackage("fgui/task");
        let panel = fgui.UIPackage.createObject("task", "panel").asCom;
        panel.makeFullScreen();
      
        fgui.GRoot.inst.addChild(panel);
        let content=panel.getChild("panel").asCom;
        this.m_mainPanel=panel;
        let btnClose=content.getChild("bg").asCom.getChild("btnClose").asButton;
       // let closeAct=panel.getTransition("t1");
        //console.log("测试任务UI=======",closeAct,panel);
        btnClose.onClick(()=>{
           self.clearPanel();

        },this);
        content.getChild("detail2").asCom.visible=false;
        content.getChild("detail3").asCom.visible=false;
        this.m_panel=content;
        //初始化配置信息开始--

        let taskJson=preloadRes.instance().getJsonData("task");
        let taskArr=taskJson.task;
        for(let i=0;i<taskArr.length;i++)
        {
            let lv=taskArr[i].Lv;

            let tmpLv=Math.floor(lv/100);
            if(!this.m_taskResultArr[tmpLv])
            {
                this.m_taskResultArr[tmpLv]=[];
            }
            this.m_taskResultArr[tmpLv].push(taskArr[i]);


            console.log("任务等级=====",lv);
        }


        console.log("测试JsonDatA=====",taskJson,this.m_taskResultArr);

        //初始化配置信息结束--

        //list Event开始--
        let list=this.m_panel.getChild("list").asList;
        list.on(fgui.Event.CLICK_ITEM,self.taskLvListFunc,this);

        let taskList=this.m_panel.getChild("taskList").asList;
        taskList.on(fgui.Event.CLICK_ITEM,self.taskContentFunc,this);
        //list Event结束--


        let starList=content.getChild("list").asList;
        starList.removeChildrenToPool();
        let openLevel=2;
        for(let i=0;i<8;i++)
        {
            starList.addItemFromPool();
            
            let item=<any>starList.getChildAt(i);
            item.customData=i+1;
            let list02=item.getChild("list").asList;
            list02.removeChildrenToPool();
            for(let j=0;j<i+1;j++)
            {
                list02.addItemFromPool();
            }
            if(i==0)
            {
                item.selected=true;
                
            }
            if(i>=openLevel)
            {
                item.enabled=false;
            }
            
        }
        this.updateTaskList();

        //详细按钮开始--

        let btnDetail=this.m_panel.getChild("btnDetail").asButton;
        btnDetail.customData=10;
        btnDetail.onClick(this.btnFunc,this);
        //详细按钮结束--
        //领取任务按钮开始

        let btnGetTask=this.m_panel.getChild("btnConfirm").asButton;

        btnGetTask.customData=11;
        btnGetTask.onClick(this.btnFunc,this);
        
    }
    btnFunc(_target)
    {
        
        let state=btnCtrl.instance().getBtnState();
        
        if(state<=0)
        {
            return ;
        }
        let target=_target.currentTarget;
        let self=this;

        let obj02=target.$gobj;
        let type=obj02.customData;

        if(type==10)//详细
        {
            if(this.m_btnDetailIndex<3)
            {
                this.m_btnDetailIndex++;
            }
            else
            {
                this.m_btnDetailIndex=1;
            }

            this.changeTaskDetail();
        }
        else if(type==11)//领取任务
        {
            this.openGetTaskUI();
           
        }
    }
    openGetTaskUI()
    {
        fgui.UIPackage.addPackage("fgui/common");
        let panel = fgui.UIPackage.createObject("common", "taskGetCom").asCom;
        panel.makeFullScreen();
      
      
        fgui.GRoot.inst.addChild(panel);

        let com=panel.getChild("com").asCom;

        let leftTxt=com.getChild("left").asTextField;
        leftTxt.text="太可怕了😱";
        let rightTex=com.getChild("right").asTextField;

        rightTex.text="轻松撂翻🤣";

        let btnCancel=com.getChild("btnCancel").asButton;

        btnCancel.onClick(()=>{
            panel.dispose();
        },this);
        let btnConfirm=com.getChild("btnGet").asButton;
        btnConfirm.onClick(()=>{

            
            let Sdata = {
                "action":PROTOCOL_SEND.MSGID_CTS_306GETTASK,
                "taskLv":this.m_curTaskLv,
                "taskIndex":this.m_curTaskIndex,
                "taskID":this.m_taskID
            }
            console.log("当前领取的任务=====",this.m_curTaskLv,this.m_curTaskIndex)
            net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_306GETTASK,Sdata);
            panel.dispose();
            this.m_mainPanel.dispose();

        },this);
        let titleTxt=com.getChild("title").asTextField;
        titleTxt.text=""+this.m_curTaskName;
        tonyInfo.instance().m_taskName=this.m_curTaskName;
    }   
    public changeTaskDetail(_type:number=0)
    {
        if(_type>0)
        {
            this.m_btnDetailIndex=_type;
        }
        let btnDetail=this.m_panel.getChild("btnDetail").asCom;
        let num=btnDetail.getChild("num").asTextField;
        num.text=""+this.m_btnDetailIndex+"/3";
        
        for(let i=0;i<3;i++)
        {
            let com=this.m_panel.getChild("detail"+(i+1)).asCom;
            com.visible=false;
            if((i+1)==this.m_btnDetailIndex)
            {
                com.visible=true;
            }
        }
    }
    clearPanel()
    {
        let self=this;
        let list=this.m_panel.getChild("list").asList;
        list.off(fgui.Event.CLICK_ITEM,self.taskLvListFunc,this)
       

        let taskList=this.m_panel.getChild("taskList").asList;
        taskList.off(fgui.Event.CLICK_ITEM,self.taskContentFunc,this);
        if(this.m_mainPanel)
        {
            this.m_mainPanel.dispose();
        }
    }
    updateTaskList(_lv:number=1)
    {
        let list=this.m_panel.getChild("taskList").asList;

        list.removeChildrenToPool();

        let taskLen=this.m_taskResultArr[_lv].length;

        for(let i=0;i<taskLen;i++)
        {
            list.addItemFromPool();

            let item=<any>list.getChildAt(i);
            item.customData=i;
            let taskName=this.m_taskResultArr[_lv][i].name;
            let nameTxt=item.getChild("name").asTextField;
            let stateTxt=item.getChild("state").asTextField;
            stateTxt.visible=false;
            nameTxt.text=""+taskName;
            if(i==0)
            {
                item.selected=true;
            }
        }
        this.updateTaskContent();
    }
    updateTaskContent()
    {
        let taskData=this.m_taskResultArr[this.m_curTaskLv][this.m_curTaskIndex];
        this.m_taskID=taskData.ID;

        let detail=this.m_panel.getChild("detail1").asCom;

        let taskName=detail.getChild("nameC").asTextField;
        this.m_curTaskName=taskData.name;
        taskName.text=""+taskData.name;
        let qyjTxt=detail.getChild("qyjC").asTextField;
        qyjTxt.text=""+taskData.qyj;
        let timeTxt=detail.getChild("timeC").asTextField;
        timeTxt.text=""+taskData.timeLimit+"分钟";
        let posTxt=detail.getChild("posC").asTextField;
        let tmpName=this.getPosName(taskData.pos);
        posTxt.text=""+tmpName;

        let rewardList=detail.getChild("reward").asList;

        rewardList.removeChildrenToPool();

        let rewardStr=taskData.reward;

        let rewardArr=mathUtils.instance().getAwardArr(rewardStr);

        let len=rewardArr.length/3;
        let itemID=888887;
        for(let i=0;i<len;i++)
        {
            rewardList.addItemFromPool();
            let item=<any>rewardList.getChildAt(i);

            let tmpType=rewardArr[i*3];

            if(tmpType=="D")
            {
                itemID=888888;
            }
            else if(tmpType=="P")
            {
                itemID=rewardArr[2+i*3];
            }
            let itemIcon=preloadRes.instance().getPropIconByID(itemID);
       
            let tex=<fgui.GLoader>item.getChild("icon").asLoader;
            tex.texture=itemIcon;
            let numtxt=<fgui.GTextField>item.getChild("num");
            numtxt.text="X"+rewardArr[1+i*3];

        }


        let detail2Com=this.m_panel.getChild("detail2").asCom;

        let dc2LvList=detail2Com.getChild("lvList").asList;

        dc2LvList.removeChildrenToPool();

        for(let i=0;i<this.m_curTaskLv;i++)
        {
            dc2LvList.addItemFromPool();
        }

        let winList=detail2Com.getChild("winList").asList;
        winList.removeChildrenToPool();

        winList.addItemFromPool();

        let item=<any>winList.getChildAt(0);

        let winData=taskData.winLimit;

        let type01=Math.floor(winData[0]/100);
        let num01=Math.floor(winData[0]%100);
        
        let name=preloadRes.instance().getFishNameByID(winData[1]);

        let itemTxt=item.getChild("num").asTextField;
        let strType=this.getType02(type01);
        itemTxt.text=""+strType+num01+"条"+name;
        console.log("测试玩家任务信息==========",type01,num01,winData,name);
        //失败条件--

        let failedList=detail2Com.getChild("failedList").asList;

        failedList.removeChildrenToPool();
        for(let i=0;i<2;i++)
        {
            failedList.addItemFromPool();
            let item01=<any>failedList.getChildAt(i);

            let txt=item01.getChild("num").asTextField;
            if(i==0)
            {
                txt.text="时间为零";
            }
            else if(i==1)
            {
                txt.text="战斗不能";
            }
            
        }
        //任务描述

        let detail3=this.m_panel.getChild("detail3").asCom;

        let ylCom=detail3.getChild("ylname").asTextField;
        ylCom.text=""+taskData.request;

        let descTxt=detail3.getChild("content").asTextField;
        descTxt.text=""+taskData.desc;



    }
    getType02(_type:number=0)
    {
        let type="击杀";
        if(_type==2)
        {
            type="收集";
        }
        else if(_type==3)
        {
            type="收集";
        }
        return type;

    }
    getPosName(_index:number=0)
    {
        let name="海村港口";
        if(_index==2)
        {
            name="海底秘境";
        }
        else if(_index==3)
        {
            name="迷踪圣地"
        }
        else if(_index==4)
        {
            name="岩狱炼域";
        }
        return name;
    }
    taskContentFunc(_event)
    {
        let curData=_event.customData;
        if(curData==this.m_curTaskIndex)
        {
            return ;
        }
        this.m_curTaskIndex=curData;
        
       

        console.log("玩家点击的任务列表########============",curData);
        this.updateTaskContent();
        this.changeTaskDetail(1);
    }
    taskLvListFunc(_event)
    {
        let curData=_event.customData;
        this.m_curTaskLv=curData;
        this.updateTaskList(curData);
        

        console.log("玩家点击的任务等级============",curData);
    }
}