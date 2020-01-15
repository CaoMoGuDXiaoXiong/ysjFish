import { tonyInfo } from "./tonyInfo";

export class sceneCtrl {
    private static ince:sceneCtrl;

    public static instance(): sceneCtrl{
        if(this.ince == undefined){
            this.ince = new sceneCtrl();
        }
        return this.ince;
    }
    public changeScene(_type:number=0)
    {
        tonyInfo.instance().m_loadingType=_type;
        if(_type==0)
        {
            cc.director.preloadScene("login",()=>{
                console.log("加载login成功");
                cc.director.loadScene("login",()=>{
    
                    
                });
            });
        }
        else if(_type==1)
        {
            cc.director.preloadScene("lobby",()=>{
                console.log("加载lobby成功");
                cc.director.loadScene("lobby",()=>{
    
                    
                });
            });
        }
        else if(_type==2)//gameLoading
        {
            cc.director.preloadScene("gameLoading",()=>{
                console.log("加载gameLoadingg成功");
                cc.director.loadScene("gameLoading",()=>{
    
                    
                });
            });
        }
        else if(_type==3)//gameScene
        {
            cc.director.preloadScene("game",()=>{
                console.log("加载gameScene成功");
                cc.director.loadScene("game",()=>{
    
                    
                });
            });
        }
        else if(_type==4)//广场
        {
            cc.director.preloadScene("gameLoading",()=>{
                console.log("加载gameLoadingg成功");
                cc.director.loadScene("gameLoading",()=>{
    
                    
                });
            });
            
        }
        else if(_type==5)
        {
            cc.director.preloadScene("square",()=>{
                console.log("加载square成功");
                cc.director.loadScene("square",()=>{
    
                    
                });
            });
        }
        
    }
}