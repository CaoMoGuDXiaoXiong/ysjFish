export class eventEmit {
    private static ince:eventEmit;
    

    private m_goldCnt=0;
    private m_eventArr=[];
    private m_eventMap={};
    public static instance(): eventEmit{
        if(this.ince == undefined){
            this.ince = new eventEmit();
           
        }
        return this.ince;
    }
    public emitEvent(_type:string,_data:any)
    {
        let tmpEvent:cc.Event.EventCustom=this.m_eventArr.pop();
        // let newEvent=new cc.Event.EventCustom("test",false);
        // newEvent.setUserData("哈哈哈")
        if(!tmpEvent)
        {
            tmpEvent=new cc.Event.EventCustom(_type,false);
            tmpEvent.setUserData(_data);

        }
        else
        {
            tmpEvent.setUserData(_data);
            tmpEvent.type=_type;
        }
        if(tmpEvent)
        {
            cc.director.dispatchEvent(tmpEvent);
            this.m_eventMap[_type]=tmpEvent;
        }
    }
    public clearEvent(_type:string)
    {
        let tmpEvent=this.m_eventMap[_type];

        this.m_eventArr.push(tmpEvent);
        delete this.m_eventMap[_type];
    }
    public clearAllEvent()
    {
        this.m_eventMap={};
        this.m_eventArr=[];
    }
}