
export class eventManager {
    private static ince:eventManager;
    

    //private m_fntPrefab:Array<cc.Prefab>=[];
    private static m_node:cc.Node=new cc.Node("myEvent");
   
    public static instance(): eventManager{
        if(this.ince == undefined){
            this.ince = new eventManager();
            
        }
        return this.ince;
    }
    static emit(_type,_data)
    {
        this.m_node.emit(_type,_data);
    }
    static on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean)
    {
       console.log("监听测试==",type);
        this.m_node.on(type,callback:target);
    }
    static off(_type)
    {
        console.log("监删除监听==",_type);
        this.m_node.off(_type);
    }
}