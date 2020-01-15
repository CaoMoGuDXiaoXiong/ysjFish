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
export default class fishnet extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    private m_netState=0;
    start () {

    }
    public resetNet(_delay:number=0.2)
    {
        let self=this;
        self.m_netState=1;
        
        this.scheduleOnce(()=>{
            //self.m_netState=0;
            self.removeFromParentFunc();
        },_delay)


    }
    public removeFromParentFunc()
    {
        this.node.removeFromParent();
        
        
        this.m_netState=0;
    }
    public getNetState()
    {
        return this.m_netState;
    }
    // update (dt) {}
}
