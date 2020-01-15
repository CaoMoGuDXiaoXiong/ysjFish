import { eventManager } from "../globle/eventManager";

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
export default class pointCS extends cc.Component {

 
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

        let colliderMag=cc.director.getCollisionManager();
        colliderMag.enabled=true;
        console.log("我是传送点===========================");
    }
    onCollisionEnter(other, self)
    {
        console.log("碰撞02========",other,self);
        eventManager.emit("exitSquare",1);//鱼被击杀
    }
    onCollisionExit(other,self)
    {
        console.log("碰撞03========",other,self);
    }

    // update (dt) {}
}
