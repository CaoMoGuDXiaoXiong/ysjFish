import { config } from "./config";
import { PROP_ID } from "./globle";
import { tonyInfo } from "./tonyInfo";

export class utils {
    private static ince:utils;
    private m_fishlineIsLoadover=10;
    private m_screenWidth=1136;
    private m_screenHeight=640;
    private m_designW=1136;
    private m_designH=640;
    private m_visibleSize:cc.Size=new cc.Size(0,0);
  
    private m_scaleX=1.0;
    private m_scaleY=1.0;
    public static instance(): utils{
        if(this.ince == undefined){
            this.ince = new utils();
        }
        return this.ince;
    }
    public consoleLog(message?: any, ...optionalParams: any[])
    {
        console.log(message,...optionalParams);
    }
    public setFishLineLoadState(_fishLineState)
    {
        this.m_fishlineIsLoadover=_fishLineState;
    }
    public getFishLineLoadState()
    {
        return this.m_fishlineIsLoadover;
    }
    public setWinSize(_winW,_winH)
    {
        this.m_screenWidth=_winW;
        this.m_screenHeight=_winH;
    }
    public setWinScaleX(_scaleX)
    {
        this.m_scaleX=_scaleX;
    }
    public getpDistance(_x1,_y1){
        let length01=Math.sqrt(_x1*_x1+_y1*_y1);

        return length01;
    }
    public getWinScaleX()
    {
        return this.m_scaleX;
    }
    public setWinScaleY(_scaleY)
    {
        this.m_scaleY=_scaleY;
    }
    public getWinScaleY()
    {
        return this.m_scaleY;
    }
    public setVisibleSize(_size:cc.Size)
    {
        this.m_visibleSize=_size
    }
    public getVisibleSize():cc.Size
    {
        return this.m_visibleSize;
    }
    public timeDown(time:number=0){
        let str = ""
        
        let hour = Math.floor(time/3600 )
        let min = Math.floor(time%3600/60) 
        let second = Math.floor(time%60)

        let hour_str = hour <= 0 ? "":hour+":"
        let min_str = min <= 9 ? "0"+min+":":min+":"
        let second_str = second <= 9 ? "0"+second:second
        
        str = ""+hour_str+min_str+second_str
        return str;
    }
    public getWorldPos(_pos:cc.Vec2)
    {
        // let _posX=_pos.x*this.m_scaleX;
        // let _posY=_pos.y*this.m_scaleY;
        let tmpPosX=_pos.x;
        let tmpPosY=_pos.y;
        tmpPosX=this.m_screenWidth/2+tmpPosX;
        tmpPosY=this.m_screenHeight/2+tmpPosY;
        let perX=tmpPosX/this.m_designW*this.m_screenWidth;
        let perY=tmpPosY/this.m_designH*this.m_screenHeight;



        

        return new cc.Vec2(perX,perY);
    }
    public getVecNormalize(_pos:cc.Vec2,_pos02:cc.Vec2):cc.Vec2
    {
        let dirNormlize=null;
        let dir=new cc.Vec2(_pos02.x-_pos.x,_pos02.y-_pos.y);
        dirNormlize=dir.normalize(dir);

        return dirNormlize;

    }
    public  distance(p1: cc.Vec2, p2:cc.Vec2): any {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }
    public strClamp(str:string,maxChars,suffix)
    {
        let r=[],c=0,p=0,i=0;
        while(i<str.length)
        {
            let pos=i;
            c=str.charCodeAt(i++);
            if(c==0xfe0f)
            {
                continue;
            }
            if(p)
            {
                let value=(0x10000+((p-0xD800)<<10)+(c-0xDC00));
                r.push({v:value,pos:pos});
                p=0;
            }
            else if(0xD800<=c&&c<=0xDBFF)
            {
                p=c;
            }
            else 
            {
                r.push({v:c,pos:pos});
            }
        }
        suffix=suffix==null?'...':suffix;
        maxChars*=2;
        let codeArr=r;
        let numChar=0;
        let index=0;

        for(let i=0;i<codeArr.length;++i)
        {
            let code=codeArr[i].v;
            let add=1;
            if(code>=128)
            {
                add=2;
            }
            if(numChar+add>maxChars)
            {
                break;
            }
            index=i;
            numChar+=add;
        }
        if(codeArr.length-1==index)
        {
            return str;
        }
        var more=suffix?1:0;

        return str.substring(0,codeArr[index-more].pos+1)+suffix;

    }

     /** 秒 --分秒 */
     public second3Time(time:number=0){
        let str = ""
        
      
        let min = Math.floor(time%3600/60) 
        let second = Math.floor(time%60)

        
        let min_str = min <= 9 ? "0"+min+":":min+":"
        let second_str = second <= 9 ? "0"+second:second
        
        str = ""+min_str+second_str
        return str;
    }
    /** 秒 --时分秒 */
    public second2Time(time:number=0){
        let str = ""
        
        let hour = Math.floor(time/3600 )
        let min = Math.floor(time%3600/60) 
        let second = Math.floor(time%60)

        let hour_str = hour <= 0 ? "":hour+":"
        let min_str = min <= 9 ? "0"+min+":":min+":"
        let second_str = second <= 9 ? "0"+second:second
        
        str = ""+hour_str+min_str+second_str
        return str;
    }
    /** 秒 --天时 */
    public second2Day(time:number=0){
        let str = ""
        
        let day = Math.floor(time/86400 )
        let hour = Math.floor(time%86400/3600 )
    
        let day_str = hour <= 0 ? "":day+"天"
        let hour_str = hour <= 9 ? "0"+hour+"时":hour+"时"
      
        str = ""+day_str+hour_str
        return str;
    }

     /**转换字符串   "x-y"——"x|y" */
    public changeAwardStr(awardStr:string, strSplit:string = '-'){
        //console.log("测试是否整个============"+awardStr);
        if(awardStr == null || awardStr == "" || typeof (awardStr) != "string")
            return ""
        let strarr = awardStr.split(strSplit)
        let redata = ""
        for(let i=0;i<strarr.length-1;i++){
            let temp = strarr[i]
            redata = redata + temp + '|'
        }
        redata = redata + strarr[strarr.length-1]
        return redata
    }

    /**获取 黑洞字符串解析  prop = "x|y" */
    public getHeidongStr(awardStr:string){
        //console.log("测试是否整个============"+awardStr);
        if(awardStr == null || awardStr == "" || typeof (awardStr) != "string")
            return []
        let strarr = awardStr.split('|')
        let redata = []
        redata.push({x:strarr[0],y:strarr[1]})
        return redata
    }

    /**获取 道具解析  prop = "1002:1|1001:2" */
    public getRewardStr(awardStr:string, strSplit:string = '|'){
        //console.log("测试是否整个============"+awardStr);
        if(awardStr == null || awardStr == "" || typeof (awardStr) != "string")
            return []
        let strarr = awardStr.split(strSplit)
        let redata = []
        for(let i=0;i<strarr.length;i++){
            let temp = strarr[i].split(':')
            redata.push({id:temp[0],num:temp[1]})
        }
        return redata
    }

    /**获取 道具解析  prop = "1001:1000:30-1003:1:30-1002:2:20" */
    public getRewardStr2(awardStr:string){
        //console.log("测试是否整个============"+awardStr);
        if(awardStr == null || awardStr == "" || typeof (awardStr) != "string")
            return []
        let strarr = awardStr.split('-')
        let redata = []
        for(let i=0;i<strarr.length;i++){
            let temp = strarr[i].split(':')
            redata.push({id:temp[0],num:temp[1],count:temp[1]})
        }
        return redata
    }

    /**获取 道具解析  prop = "1002:1|1001:2" */
    public getRewardStr3(awardStr:string){
        //console.log("测试是否整个============"+awardStr);
        if(awardStr == null || awardStr == "" || typeof (awardStr) != "string")
            return []
        let strarr = awardStr.split('|')
        let redata = []
        for(let i=0;i<strarr.length;i++){
            let temp = strarr[i].split(':')
            redata.push([Number(temp[0]),Number(temp[1])])
        }
        return redata
    }

    /** 获取奖励名称 */
    public getAwardName(_itemSymple: string,_itemID:number=1){
        let name = "";
        switch(_itemSymple){
            case "G":
                name = "金币";
                break;
            case "D":
                name = "钻石";
                break;
            case "L":
                name = "话费券";
                break;
            default:
                name=this.gamePropName(_itemID)
                break;
        }
        return name;
    }
    /**获取道具的名字 */
    public gamePropName(_id)
    {
        let propArr= config.getItemCfgData()
        if(!propArr)
            return ""
        for(let i in propArr){
            if(parseInt(propArr[i].PropID) == _id){
                return propArr[i].Name
            }
        }

        return "";
    }

    /** 道具解析  id:num|id:num*/
    public decodeLoop(str:string ="",splitStr:string = '|'){
        let arrStr = str.toString().split(splitStr)
        let redata = []
        for(let i=0;i<arrStr.length;i++){
            let data = arrStr[i].split(':')
            redata.push({id:parseInt(data[0]),num:parseInt(data[1])})
        }
        return redata
    }
    /** 传入一个时间 2018-08-09 返回 2018 08 09*/
    public getTimeBy_Symbol(_str,strSplit:string = '-')//
    {

        let strLen=_str.length;
        let resultArr:any=[];

        let tmpStr=""
        for(let i=0;i<strLen;i++)
        {
            
            if(_str[i]== strSplit)
            {
                resultArr.push(tmpStr)
                tmpStr=""
            }
            else
            {
                tmpStr+=_str[i];
            }
           
        }
        return resultArr;

    }
    /**获取faigui 资源图片 */
    public getFairyGuiImg(pkgname:string = null,itemname:string = null):fgui.GObject
    {
        let pkg = fgui.UIPackage.getByName(pkgname)
        if(pkg == null)
        {
            console.error("包不存在了",pkgname)
            return null
        }
        let item = fgui.UIPackage.createObject(pkgname,itemname)
        return item
    }
    /**服务器位置转客户端位置 */
    public  getServerToClient(posX:number,posY:number):cc.Vec2{
        //var frameSize=cc.view.getFrameSize();
        let clientW=cc.winSize.width;
        let clientH=cc.winSize.height;
        let ratioX = posX/1136 *clientW; 
        let ratioY = posY/640*clientH;
        let point=new cc.Vec2(ratioX,ratioY);
        return point;
    }
    public getFishScoreByID(_id:number,_type:number=0)
    {
        let score = 0;
        let fishCfg =   config.getFishCfgDataByID(_id)
        if(fishCfg){
            score = parseInt(fishCfg["Score"])
        }
        return score;
    }

    public getTimeDownStr(_minute,_second,_type:number=0)
    {
        let secondStr="";
        let minuteStr="";
        let endStr="";
        let minute=_minute;
        let second=_second;
       if(second<10)
        {
            secondStr="0"+second;
        }
        else
        {
            secondStr=""+second;
        }
        if(minute>=0)
        {
            if(_type==1)
            {
                if(minute<10)
                {
                    minuteStr="0"+minute;
                }
                else
                {
                    minuteStr=""+minute;
                }
            }
            else
            {
                minuteStr=""+minute;
            }
            
        }
        if(minuteStr!="")
        {
            endStr=minuteStr+":"+secondStr;
        }
        else
        {
            endStr=""+secondStr;
        }
        return endStr;
    }
     //震屏
     public m_shake(nodeBg:cc.Node,_type:number = 3){
        if(!nodeBg || _type < 5)
            return
        
        let tx=16;
        let ty=12;
        let time = 0.015
        let times = Math.min(_type,10)
        
        // tonyInfo.instance().showTopTips("==========当前 震动 幅度==========="+tx+"========="+ty)
        nodeBg.stopAllActions()
        nodeBg.x = cc.winSize.width/2;
        nodeBg.y = cc.winSize.height/2;
        let posX=nodeBg.x;
        let posY=nodeBg.y;
        
        let len = Math.sqrt(tx*tx+ty*ty)
        let v0 = cc.v2(posX,posY)
        let v1 = cc.v2(v0.x-tx,v0.y+ty)
        let v2 = cc.v2(v1.x,v1.y+len)
        let v3 = cc.v2(v2.x+tx,v2.y+ty)
        let v4 = cc.v2(v3.x+tx,v3.y-ty)
        let v5 = cc.v2(v4.x,v4.y-len)

        let act_delay1 = cc.delayTime(time*5)

        let act0 = cc.moveTo(time,v0)
        let act1 = cc.moveTo(time,v1)
        let act2 = cc.moveTo(time,v2)
        let act3 = cc.moveTo(time,v3)
        let act4 = cc.moveTo(time,v4)
        let act5 = cc.moveTo(time,v5)
       
        let seq = cc.sequence(act1,act2,act3,act4,act5,act0).repeat(times)

        nodeBg.runAction(seq)
    }
    /**通过cannonlevel 获取 炮台皮肤ID */
    public getGunSkinAniByCannonLevel(level:number=1)
    {
        let cfg_data = config.getBatteryCfgData()
        let skinId = 1
        if(cfg_data){
            for(let i=0;i<cfg_data.length;i++){
                if(parseInt(cfg_data[i].Multiple) == level){
                    skinId = parseInt(cfg_data[i].SkinID)
                }
            }
        }
        return this.getAniNameByGunSkinID(skinId)

    }
    //炮台ID === 炮台动画名
    private getAniNameByGunSkinID(id:number = 1){
        let aniName = "Pao"
        switch(id){
            case 1:
                    aniName = "Pao";
                    break;
            case 2:
                    aniName = "paoA02";
                    break;
            case 3:
                    aniName = "paoA03";
                    break;
            case 4:
                    aniName = "paoA04";
                    break;
            case 5:
                    aniName = "paoA05";
                    break;
            default:
                break;
        }
        return aniName
    }
    /**通过cannonlevel 获取 炮台皮肤ID */
    public getCostEnergyByCannonLevel(level:number=1)
    {
        let cfg_data = config.getBatteryCfgData()
        if(cfg_data){
            for(let i=0;i<cfg_data.length;i++){
                if(parseInt(cfg_data[i].Multiple) == level){
                    return parseInt(cfg_data[i].Energy)
                }
            }
        }
        return 1

    }
     /**通过cannonId 获取 炮台技能*/
     public getGunSkillIdByCannonID(id:number=1)
     {
         let cfg_data = config.getAllBatteryCfgData()
         if(cfg_data){
             for(let i=0;i<cfg_data.length;i++){
                 if(parseInt(cfg_data[i].CannonID) == id){
                     return parseInt(cfg_data[i].SkillID)
                 }
             }
         }
         return 0
 
     }
     /**点到直线的距离==*/
     public getDistanceByLine(pos1:cc.Vec2 = null,pos2:cc.Vec2 = null,pos3:cc.Vec2 = null)
     {
         if(!pos1 || !pos2 || !pos3)
            return 0

         if(pos2.x-pos1.x == 0){
            return Math.abs(pos3.x - pos1.x)
         }
         let set_a = (pos1.y-pos2.y)/(pos2.x-pos1.x)
         let set_b = 1
         let set_c = -pos1.y - set_a*(pos1.x)

         let sqrt_num = Math.sqrt(set_a*set_a + set_b*set_b)
         let abs_num = Math.abs(set_a*(pos3.x) + set_b*(pos3.y) + set_c)
         return abs_num/sqrt_num
 
     }
      /**点到点的距离==*/
      public getDistanceByPoint(pos1:cc.Vec2 = null,pos2:cc.Vec2 = null)
      {
          if(!pos1 || !pos2)
             return 0
 
          let set_x = (pos1.x - pos2.x)
          let set_y = (pos1.y - pos2.y)
 
          let sqrt_num = Math.sqrt(set_x*set_x + set_y*set_y)
         
          return sqrt_num
  
      }
      /**通过skillId 获取 技能data*/
      public getGunSkillBySkillID(id:number=1)
      {
          let cfg_data = config.getBatterySkillCfgData()
          if(cfg_data){
              for(let i=0;i<cfg_data.length;i++){
                  if(parseInt(cfg_data[i].SkillID) == id){
                      return cfg_data[i]
                  }
              }
          }
          return null
  
      }
      /**数组乱序 拍序*/
      public getMixedArr(totleNum:number=10,arr:any= null)
      {
          if(!arr || arr.length <= 0){
              return arr
          }

          for(let i=0;i<totleNum;i++){
              let randomNum1 = Math.floor(Math.random()*(arr.length -1))
              let randomNum2 = Math.floor(Math.random()*(arr.length -1))
              if(randomNum1 == randomNum2){
                 randomNum2 = Math.floor(Math.random()*(arr.length -1))
              }
              if(randomNum1 == randomNum2){
                randomNum1 = Math.floor(Math.random()*(arr.length -1))
              }
              if(randomNum1 != randomNum2){
                if(arr[randomNum1] && arr[randomNum2]){
                    let temp = arr[randomNum1]
                    arr[randomNum1] = arr[randomNum2]
                    arr[randomNum2] = temp
                }
              }
              
          }

          return arr
  
      }
      /**获取字符串字节长度*/
      public getStrRealLength(str:string = "")
      {
         if(!str || str.length == 0){
             return 0
         }
         let count = 0
         for(let i=0;i<str.length;i++){
            let len =  str[i].charCodeAt(0)
             if(len > 127){
                 count +=2;
             }
             else{
                 count +=1
             }
         }
         return count
  
      }

      /**超过 100000000 显示 亿 */
      public getSetStrNum(_num:number = 0,_maxNum:number = 100000000,_limitStr:string = "亿",_limitNum:number = 4)
      {
        let tmpStr=""+_num;
        if(_num>=_maxNum)
        {   
            let curNum = Number(_num/_maxNum)
            let count = curNum.toFixed(_limitNum)
            let countArr = count.toString().split('')
            let len = countArr.length
            if(countArr[len - 1] && countArr[len - 1] == "0"){
                _limitNum --;
                if(countArr[len - 2] && countArr[len - 2] == "0") {
                    _limitNum --;
                    if(countArr[len - 3] && countArr[len - 3] == "0") {
                        _limitNum --;
                        if(countArr[len - 4] && countArr[len - 4] == "0") {
                            _limitNum --;
                        }
                    }

                }
            }
            count =curNum.toFixed(_limitNum)
            tmpStr=count+_limitStr;

        }

        return tmpStr
      }
   
  
  
}