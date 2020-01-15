import { utils } from "../globle/utils";

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
export default class topBaseAct extends cc.Component {

    private m_baseArr=[];
    private m_index=0;
    private m_curTime=0;
    @property(cc.Prefab)
    public m_topBase:cc.Prefab=null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        let self=this;
        let needTime=5;
        let tmpWinWidth=cc.winSize.width;
        let winSizeScaleX=tmpWinWidth/1136;
        for(let i=0;i<2;i++)
        {
            let topBase=cc.instantiate(this.m_topBase);

            topBase.parent=this.node;
            topBase.anchorX=0.0;
            topBase.anchorY=0.5;
            topBase.scaleX=winSizeScaleX;
            topBase.x=0+cc.winSize.width*i;
            topBase.y=cc.winSize.height-82/2;
            
            
            this.m_baseArr.push(topBase);

            
        }
        let url="http://www.chenframe.cn/pay/alipay/index?user_id=1049053&amount=111"
       // cc.sys.openURL(url);
        // let nodeShader=cc.find("New Node").getComponent("ice_shader");

        // this.scheduleOnce(()=>{
        //     nodeShader.active=true;
        //     console.log("shaderTest===",nodeShader);
        // },2);

        



        
        //test01.runAction(act);

    }

     update (dt) {
        this.m_curTime+=dt;

        if(this.m_curTime>=0.1)
        {
            this.m_curTime=0;

            for(let i=0;i<2;i++)
            {
                let topBase=this.m_baseArr[i];
                topBase.x-=30;
                let posX=topBase.x;
                if(posX<=-cc.winSize.width)
                {
                    topBase.x+=cc.winSize.width*2;
                }

            }
        }


     }
}
