import { fntManager } from "./fntManager";

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
export default class addFnt extends cc.Component {

    @property(cc.Prefab)
    m_fntPrefab:Array<cc.Prefab>=[];

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        fntManager.instance().setFntPrefab(this.m_fntPrefab);

    }

    // update (dt) {}
}
