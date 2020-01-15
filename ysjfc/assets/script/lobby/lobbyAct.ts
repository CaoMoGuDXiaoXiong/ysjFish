import { rs } from "../globle/rs";

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
export default class lobbyAct extends cc.Component {

    

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    }

    start () {

        this.titleAct();
    }
    titleAct()
    {
        let time01=8;
        let title01=cc.find("classical");
        let fish01=title01.getChildByName("fish");
        let posY=title01.position.y;
        let tmpWidth=rs.instance().m_width;
        let tmpHeight=rs.instance().m_height;
        let cX=rs.instance().m_cX;
        let cY=rs.instance().m_cY;

        
        
        let moveTo=cc.moveTo(time01,new cc.Vec2(tmpWidth,posY));
        let callBack01=cc.callFunc(()=>{
            fish01.scaleX=-1;
        })
        let callBack02=cc.callFunc(()=>{
            fish01.scaleX=1;
        })

        let moveTo01=cc.moveTo(time01,new cc.Vec2(0,posY));

        let seq=cc.sequence(moveTo,callBack01,moveTo01,callBack02);

        this.node.runAction(cc.repeatForever(seq));
    }
    // update (dt) {}
}
