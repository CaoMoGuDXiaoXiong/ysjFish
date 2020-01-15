import { utils } from "./utils";
import { net } from "../net/net";
import { PROTOCOL_RET, PROTOCOL_SEND } from "../net/protocal";
import { tonyInfo } from "./tonyInfo";
import { sceneCtrl } from "./sceneCtrl";
import { taskUI } from "../ui/taskUI";

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
export default class menuCallBack extends cc.Component {

   
    private m_isEnable=0;
    
    start () {

    }
    openTaskUI()
    {
        let taskState=tonyInfo.instance().m_taskState;
       
        if(taskState<=0)
        {
            let taskUI01=new taskUI();
            taskUI01.initTaskUI();
            
        }
        else
        {
            fgui.UIPackage.addPackage("fgui/common");
            let panel = fgui.UIPackage.createObject("common", "taskGetCom").asCom;
            panel.makeFullScreen();
        
        
            fgui.GRoot.inst.addChild(panel);

            let com=panel.getChild("com").asCom;

            let leftTxt=com.getChild("left").asTextField;
            leftTxt.visible=false;
            let rightTex=com.getChild("right").asTextField;

            rightTex.visible=false;

            let btnCancel=com.getChild("btnCancel").asButton;
            let cancelTxt=btnCancel.getChild("n4").asTextField;
            cancelTxt.text="放弃任务";
            cancelTxt.color=cc.color(255,0,0,255);
            
            btnCancel.onClick(()=>{
                
                panel.dispose();
                let Sdata = {
                    "action":PROTOCOL_SEND.MSGID_CTS_307GIVEUPTASK,
                    "state":1,
                    "taskID":tonyInfo.instance().m_taskState,
                    "id":tonyInfo.instance().m_taskIndex
                }
                net.instance().sendDataToServer(PROTOCOL_SEND.MSGID_CTS_307GIVEUPTASK,Sdata);
            },this);
            let btnConfirm=com.getChild("btnGet").asButton;
            let btnConfirmTxt=btnConfirm.getChild("n4").asTextField;
            btnConfirmTxt.text="继续任务";

            btnConfirm.onClick(()=>{
                panel.dispose();

            },this);
            let titleTxt=com.getChild("title").asTextField;
            titleTxt.text=""+tonyInfo.instance().m_taskName;

            let content=com.getChild("content").asTextField;
            content.text="有什么事儿吗？\n要取消已经接受的任务吗？取消任务，将不退回押金，请慎重选择!";
    
    }
    
   
   
    // update (dt) {}
}
