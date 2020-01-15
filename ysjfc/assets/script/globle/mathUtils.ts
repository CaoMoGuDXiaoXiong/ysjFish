export class mathUtils {
    private static ince:mathUtils;
    private m_fishlineIsLoadover=0;
    public static instance(): mathUtils{
        if(this.ince == undefined){
            this.ince = new mathUtils();
        }
        return this.ince;
    }
    
    public degree(p1: cc.Vec2, p2: cc.Vec2):any {
        let DEG_TO_RAD = Math.PI/180;
        let RAD_TO_DEG = 180/Math.PI;
        var degree: number;
       // Math.atan2()
        let angle:number = Math.atan2((p2.y-p1.y), (p2.x-p1.x));
        degree = angle*RAD_TO_DEG;
        var sin = Math.sin(degree * DEG_TO_RAD);
        var cos = Math.cos(degree * DEG_TO_RAD);
        return {degree:degree, sin:sin, cos:cos}
    }
    public getAwardArr(awardStr:string){
        //console.log("测试是否整个============"+awardStr);

        let strLen=awardStr.length;
        let awardArr:any=[];
        let awardArrResult:any=[];
        let tmpStr=""
       
        if(awardStr!="")
        {
            for(let i=0;i<strLen;i++)
            {
                
                if(awardStr[i]==",")
                {
                    awardArr.push(tmpStr)
                    tmpStr=""
                }
                else
                {
                    tmpStr+=awardStr[i];
                }
                //console.log("当前数字========="+awardStr[i]);
            }
            awardArr.push(tmpStr)
            tmpStr=""

            let arrLen=awardArr.length;

            for(let i=0;i<arrLen;i++)
            {
                let firstLetter=awardArr[i][0];
                awardArrResult.push(firstLetter);

                if(firstLetter=="P")
                {
                    tmpStr=""
                    let itemID=-1;
                    let itemCnt=0;

                    let tmpLen02=awardArr[i].length;
                    for(let j=1;j<tmpLen02;j++)
                    {
                        if(awardArr[i][j]=="-")
                        {
                            
                            itemID=parseInt(tmpStr);
                            //console.log("测试是否错==========="+tmpStr+"==="+itemID);
                            tmpStr=""
                        }
                        else
                        {
                            tmpStr+=awardArr[i][j];
                        }
                    
                        //console.log("当前数组数据============="+awardArr[i][j]+"========"+itemID);
                    }
                    itemCnt=parseInt(tmpStr);
                    
                    awardArrResult.push(itemCnt);
                    awardArrResult.push(itemID);
                
                }
                else
                {
                    let tmpLen=awardArr[i].length;
                    let cnt=parseInt(awardArr[i].substring(1,tmpLen))
                    awardArrResult.push(cnt);
                    awardArrResult.push(0);
                
                }
                
            }
        }
        return awardArrResult;

    }
    
  
}