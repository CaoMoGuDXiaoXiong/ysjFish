
import { rs } from "./rs";

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
export default class gameResolution extends cc.Component {
     @property(cc.Integer)
     public m_type:number=0;
    onLoad()
    {
        var desionW=1136;
        var desionH=640;
    //     let colliderMag=cc.director.getCollisionManager();
    //     colliderMag.enabled=true;
    //    colliderMag.enabledDebugDraw=true;
        var frameSize=cc.view.getFrameSize();
        


        let cus=cc.find("Canvas").getComponent(cc.Canvas);
        let curDR=new cc.Vec2(1136,640);

        let rw=frameSize.width;
        let rh=frameSize.height;

        let finalW=rw;

        let finalH=rh;
        
        if((rw/rh)>(curDR.x/curDR.y))
        {
            finalH=curDR.y;
            finalW=finalH*rw/rh;
        }
        else
        {
            finalW=curDR.x;
            finalH=rh/rw*finalW;
            

            //cus.node.emit('resize');
        }
     
        cus.designResolution=cc.size(finalW,finalH);
        cus.node.width=finalW;
        cus.node.height=finalH;
        let secne=cc.director.getScene();
        rs.instance().initRS(finalW,finalH);

        // secne.scaleX=0.7;
        // secne.scaleY=0.7;
    }

    // update (dt) {}
}
