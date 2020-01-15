export class soundManager {
    private static ince:soundManager;
    private m_audioClipArr={};
    private m_bgState=1;
    private m_eftState=0;
    private m_curBgName:cc.AudioClip=null;
    public static instance(): soundManager{
        if(this.ince == undefined){
            this.ince = new soundManager();
        }
        return this.ince;
    }
    public resetSoundState(_bgState:number=0,_eftSate:number=0)
    {
        this.m_bgState=_bgState;
        this.m_eftState=_eftSate;
    }
    public resetBgState(_state:number=0)
    {
        this.m_bgState=_state;
        localStorage.setItem("bgState",""+this.m_bgState)
        if(_state==0)
        {

        
            if(this.m_curBgName)
            {
                this.playBg(this.m_curBgName,true);
            }
        }
        else
        {
            cc.audioEngine.stopMusic();
        }
    }
    public resetEftState(_state:number=0)
    {
        this.m_eftState=_state;
        localStorage.setItem("eftState",""+this.m_eftState)
    }
    public getBgState()
    {
        return this.m_bgState;//>=1 关闭音效
    }
    public getEftState()
    {
        return this.m_eftState;
    }
    public setSoundSource(_sourceArr)
    {
        let len=_sourceArr.length;
        for(let i=0;i<len;i++)
        {
            let name=_sourceArr[i]._name;
            this.m_audioClipArr[name]=_sourceArr[i];
        }
        console.log("加载音乐资源成功====",this.m_audioClipArr);
    }
    public playBg(_name,_isLoop:boolean=true)
    {
        this.m_curBgName=_name;
        if(this.m_bgState>=1)
        {
            return ;
        }
        
        let clip=this.m_audioClipArr[_name];
        cc.audioEngine.playMusic(clip,_isLoop);
    }
    public stopBg()
    {
        cc.audioEngine.stopMusic();
    }
    public playEft(_name,_isLoop:boolean=false)
    {
        if(this.m_eftState>=1)
        {
            return ;
        }
        let clip=this.m_audioClipArr[_name];
        

        cc.audioEngine.playEffect(clip,_isLoop);
    }
}