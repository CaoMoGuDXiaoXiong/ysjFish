
export class rs {

    private static ince:rs;
    public m_cX=0;
    public m_cY=0;
    public m_width=0;
    public m_height=0;
    public static instance(): rs{
        if(this.ince == undefined){
            this.ince = new rs();
            
        }
        return this.ince;
    }
    public initRS(_windth,_height)
    {
        this.m_width=_windth;
        this.m_height=_height;
        this.m_cX=_windth/2;
        this.m_cY=_height/2;
        
    }
    

   
}