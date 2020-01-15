import { utils } from "../globle/utils";

export class fntManager {
    private static ince:fntManager;
    

    //private m_fntPrefab:Array<cc.Prefab>=[];
    private m_fntPrefab={};
    private m_fntList:Array<cc.Node>= [];
    private m_fnt1:cc.Prefab=null;
    public static instance(): fntManager{
        if(this.ince == undefined){
            this.ince = new fntManager();
        }
        return this.ince;
    }
    public createFnt(_type:number=0,_num:number=0,_pos:cc.Vec2,_parent:cc.Node=null)
    {
       
        let parent=_parent;
        let self=this;


        if(!parent)
        {
            parent=cc.find("eftCenter");
        }
        console.log("创建字体02222======",_type);
        switch (_type)
        {
           
            case 1:
            {
                if(!this.m_fnt1)
                {
                    let url="prefab/fnt01"
                    console.log("创建字体02======",url);
                    cc.loader.loadRes(url,cc.Prefab,(err,data)=>{
                        if(!err)
                        {
                            self.m_fnt1=data;
                            self.fnt01(_pos,parent,_num);
                        }
                        else
                        {
                            utils.instance().consoleLog("加载文字失败01");
                        }
                    });
                }
                else
                {
                    this.fnt01(_pos,parent,_num);
                }
                
            }
            break;
            case 2:
            {

            }break;
        }
        // if(tmpPrefab)
        // {
        //     //let fnt=cc.instantiate(tmpPrefab);
            

        //     fnt.x=_pos.x;
        //     fnt.y=_pos.y;
        //     fnt.parent=parent;
        //     fnt.opacity=255;
        //     fnt.scale=0.6;
        //     let numChild=fnt.getChildByName("n");

        //     let label:cc.Label=numChild.getComponent("cc.Label");
        //     label.string="+"+_num;
        //     let actMoBy=cc.moveBy(0.18,0,80);
            

        //     let dealy=cc.delayTime(0.5);
        //     let fadeout=cc.fadeOut(0.5);

        //     let callBack=cc.callFunc(()=>{
        //         fnt.stopAllActions();
        //        // fnt.destroy();
        //        fnt.removeFromParent();
        //        self.m_fntList.push(fnt);
        //     },this);
        //     let seq=cc.sequence(actMoBy,dealy,fadeout,callBack);
        //     fnt.runAction(seq);
        // }
        // else
        // {
        //     utils.instance().consoleLog("当前字体不存在",_type);
        // }
    }
    fnt01(_pos,parent,_num)
    {
        console.log("创建字体01======",_num,_pos);
        let self=this;
        let fnt=this.m_fntList.pop();
        if(!fnt)
        {
            fnt=cc.instantiate(this.m_fnt1);

           
        }
        else
        {
            // utils.instance().consoleLog("创建数字FromCache");
        }
        fnt.x=_pos.x;
        fnt.y=_pos.y;
        fnt.parent=parent;
        fnt.opacity=255;
        let label:cc.Label=fnt.getComponent("cc.Label");
        label.string="+"+_num;
        let actMoBy=cc.moveBy(0.18,0,80);
        

        let dealy=cc.delayTime(0.5);
        let fadeout=cc.fadeOut(0.5);

        let callBack=cc.callFunc(()=>{
            fnt.stopAllActions();
           // fnt.destroy();
           fnt.removeFromParent();
           self.m_fntList.push(fnt);
        },this);
        let seq=cc.sequence(actMoBy,dealy,fadeout,callBack);
        fnt.runAction(seq);

        
    }
    public setFntPrefab(_prefabArr)
    {
        this.m_fntPrefab=_prefabArr;
    }
    
}