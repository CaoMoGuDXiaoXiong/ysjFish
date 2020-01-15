import { sceneCtrl } from "../globle/sceneCtrl";
import { tonyInfo } from "../globle/tonyInfo";
import { preloadRes } from "../globle/preloadRes";

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
export default class loading extends cc.Component {
    private _view: fgui.GComponent;
    private mPanel: fgui.GComponent;
    private m_progressBar:fgui.GProgressBar;
    progressNum:number=-1;
    m_curTime:number=0;
    m_loadOver=0;

    @property(cc.Integer)
    m_loadType=0;

    onLoad () {

        fgui.addLoadHandler();
        fgui.GRoot.create();
        fgui.UIPackage.loadPackage("fgui/loading",this.onUILoaded.bind(this));


        
    }
    onUILoaded()
    {
        fgui.UIPackage.addPackage("fgui/loading");
        this._view = fgui.UIPackage.createObject("loading", "loading").asCom;
        this._view.makeFullScreen();
      
        fgui.GRoot.inst.addChild(this._view);
        this.m_progressBar=this._view.getChild("bar").asProgress;

        this.addListener();
        this.initUI();
    }
    start () {
        
       
        
    }
    addListener()
    {
       // tonyInfo.instance().m_loadingType=this.m_loadType;
        if(this.m_loadType==0)
        {
            preloadRes.instance().loadCommonHintBar();
        }
    }
    initUI()
    {
        
        let tmpType=tonyInfo.instance().m_loadingType;
        if(tmpType==2||tmpType==4)
        {
            preloadRes.instance().loadFisheryRes();
        }
        console.log("loadingType==================================",tmpType);
        this.progressNum=0;
        this.updateProgressPar();
        
    }
    updateProgressPar()
    {
        this.m_progressBar.value=this.progressNum;
    }

     update (dt) {
        this.m_curTime+=dt;

        if(this.progressNum>=0)
        {
            if(this.progressNum<100)
            {
                this.m_curTime=0;
                this.progressNum++;
                this.m_loadOver=1;
                this.updateProgressPar();
            }
            else
            {
                let type=tonyInfo.instance().m_loadingType;
                let isOver=preloadRes.instance().getLoadResState(type);
               
                if(this.m_loadOver==1&&isOver==1)
                {
                    console.log("loadingType02222222222==================================",type);
                    this.m_loadOver=2;
                    
                    if(type==2)
                    {
                        type=3;
                    }
                    else if(type==4)
                    {
                        type=5;
                    }
                    else 
                    {
                        type=0;
                    }
                    
                    sceneCtrl.instance().changeScene(type);
                }
            }
        }

     }
}
