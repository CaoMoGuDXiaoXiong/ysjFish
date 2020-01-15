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
export default class mapCtrl extends cc.Component {

   
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private m_isTouch=false;
    start () {
        let camera=cc.find("Canvas/MainCamera");
        console.log("当前猪相机====",camera);
        this.touchCtrlFunc();


    }
    touchCtrlFunc()
    {
        let self=this;
        this.node.on(cc.Node.EventType.TOUCH_END,(msg)=>{
            self.m_isTouch=false;
            let touchPoint=msg.touch.getLocation();

            console.log("touchBEnd====",touchPoint);
        
        });
        this.node.on(cc.Node.EventType.TOUCH_START,(msg)=>{
            self.m_isTouch=true;
            let touchPoint=msg.touch.getLocation();
            console.log("touchBegan====",touchPoint);
           
           // fishManager.instance().getSelectFishID(touchPoint);
        })
        this.node.on(cc.Node.EventType.TOUCH_MOVE,(msg)=>{
            let touchPoint=msg.touch.getLocation();
            console.log("touchMove====",touchPoint);
            
        })
    }
    // update (dt) {}
}
