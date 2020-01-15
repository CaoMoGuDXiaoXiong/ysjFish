import { btnCtrl } from "../globle/btnCtrl";
import { tonyInfo } from "../globle/tonyInfo";
import { PROTOCOL_SEND } from "../net/protocal";
import { net } from "../net/net";
import { preloadRes } from "../globle/preloadRes";

export class popLayer {
    private m_panel:fgui.GComponent=null;
    private m_type=0;
    initUI(_type:number=0,_content:string,_btnLeft,_btnRight,_title)
    {
        this.m_type=_type;
        fgui.UIPackage.addPackage("fgui/common");
        let panel = fgui.UIPackage.createObject("common", "taskGetCom").asCom;
        panel.makeFullScreen();
        this.m_panel=panel;
    
        fgui.GRoot.inst.addChild(panel);

        let com=panel.getChild("com").asCom;

        let leftTxt=com.getChild("left").asTextField;
        leftTxt.visible=false;
        let rightTex=com.getChild("right").asTextField;

        rightTex.visible=false;

        let btnCancel=com.getChild("btnCancel").asButton;
        let cancelTxt=btnCancel.getChild("n4").asTextField;
        cancelTxt.text=_btnLeft
       
        
        btnCancel.onClick(()=>{
            this.closePanel();
           
        },this);
        let btnConfirm=com.getChild("btnGet").asButton;
        let btnConfirmTxt=btnConfirm.getChild("n4").asTextField;
        btnConfirmTxt.text=_btnRight

        btnConfirm.onClick(this.btnCallBack,this);
        let titleTxt=com.getChild("title").asTextField;
        titleTxt.text=""+_title;

        let content=com.getChild("content").asTextField;
        content.text=_content;
    }
    closePanel()
    {
        tonyInfo.instance().m_exit=0;
        this.m_panel.dispose();
    }
   btnCallBack(_target)
    {
        let target=_target.currentTarget;
        let self=this;
        
        let obj02=target.$gobj;
        let type=obj02.customData;
        
        let state=btnCtrl.instance().getBtnState();
       
        
        if(state<=0)
        {
            return ;
        }
        type=this.m_type;
        
        if(type==1)//任务确认
        {
            
            let taskID=tonyInfo.instance().m_taskState;
            
            let taskData=preloadRes.instance().getTaskByID(taskID);

            let hallID=taskData.pos+20;


            let Sdata = {
                "action":PROTOCOL_SEND.MSGID_CTS_201LOGIN,
                "hallID":hallID,
                "taskID":taskID
            }
            net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_201LOGIN,Sdata);
            console.log("当前任务信息=======",taskData);
            this.closePanel();
        }
    }

}