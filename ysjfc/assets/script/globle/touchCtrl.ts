import { utils } from "./utils";
import { config } from "./config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class touchCtrl extends cc.Component {

    onLoad () {
        let self=this;

        this.node.on(cc.Node.EventType.TOUCH_END,(event)=>{
            //let pos=
            self.node.emit("touchEnd",event);
           // utils.instance().consoleLog("TouchEnd=======",event);
        });
        this.node.on(cc.Node.EventType.TOUCH_START,(event)=>{
            self.node.emit("touchBegan",event);
        });
        this.node.on(cc.Node.EventType.TOUCH_MOVE,(event)=>{
            self.node.emit("touchMove",event);
        })
    }

    start () {
        

    }

    // update (dt) {}
}
