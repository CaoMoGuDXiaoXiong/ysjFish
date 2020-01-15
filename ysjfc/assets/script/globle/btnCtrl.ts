
export class btnCtrl {
    private static ince:btnCtrl;
    private m_btnState=0;
    private m_btnInterval=0.5;
    public static instance(): btnCtrl{
        if(this.ince == undefined){
            this.ince = new btnCtrl();
        }
        return this.ince;
    }
    public getBtnState(_type:number=0)
    {
        if(this.m_btnInterval>0)
        {
            this.m_btnState=0;//点击事件吞噬
        }
        else
        {
            this.m_btnInterval=0.5;
            if(_type==1)
            {
                this.m_btnInterval=0.1;
            }
            this.m_btnState=1;//可以点击
        }
        return this.m_btnState;
    }
    public loop(dt)
    {
        if(this.m_btnInterval>=0)
        {
            this.m_btnInterval-=dt;
        }
    }
  
}