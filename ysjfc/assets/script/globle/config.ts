import { utils } from "./utils";
import { tonyInfo } from "./tonyInfo";
import { TaskType } from "./globle";

export class config {

    private static ince:config;
    private m_fishLineData=null;
    private m_fishLienVo=null;
    private m_fishColliderSize:any=null;
    private m_fishResArr:any=null;
    private m_dbNameArr:any=null;


    //道具配置表
    private static itemCfg:any;
    private static itemIDCfg:any;

    private static storeCfg:any;
    private static storeIDCfg:any;

    private static rankCfg:any;
    private static rankIDCfg:any;

    private static signCfg:any;
    private static signScoreCfg:any;
    private static goldFishCfg:any;
    private static arenaRankCfg:any;
    private static colorShellCfg:any;

    private static guideCfg:any;
    private static guideIDCfg:any;
    private static monthCardCfg:any;

    private static cannonSkillCfg:any;
    private static cannonCfg:any;

    private static fisheryCfg:any
private static activityCfg:any;
    public static instance(): config{
        if(this.ince == undefined){
            
            this.ince = new config();
            config.instance().setFishColliderSize();
        }
        return this.ince;
    }
    public loadFishLine()
    {
        let self=this;
        let fishLineState=utils.instance().getFishLineLoadState();
        if(fishLineState)
        {
            cc.loader.loadRes("fishline",(err,data)=>{
                self.m_fishLienVo=ML.getfishlinetxt(data.text);
                utils.instance().setFishLineLoadState(1);
            })
         }
    }
    public getFishLineVo():ML.FishLineVo
    {
        return this.m_fishLienVo;
    }
    public setFishColliderSize()
    {
        // 1 2 BoxSize 3 4 offset 5=IsRota
        this.m_fishColliderSize = {        
            [0] : [75,30,0,0,0],
            [1] : [52,30,0,0,0],
            [2] : [62,50,0,0,0],
            [3] : [74,38,0,0,0],
            [4] : [78,74,0,0,1],
            [5] : [60,40,0,0,0],
            [6] : [78,40,0,0,0],
            [7] : [56,60,0,0,1],
            [8] : [48,40,0,0,0],
            [9] : [128,110,0,0,0],
            [10] : [100,55,0,15,0],
            [11] : [80,80,0,0,1],
            [15] : [190,88,30,10,0],
            [16] : [200,100,0,0,0],
            
            [13] : [224,80,0,0,0],
            [17] : [298,122,0,0,0],
            [19] : [178,80,0,0,0],
            [25] : [220,55,0,0,0],
            [28] : [100,80,0,0,0],
            [29] : [175,85,0,15,0],
            [38] : [100,100,0,15,0],
            [101] : [110,112,0,0,0],
            [103] : [165,70,0,0,0],
            [108] : [300,120,0,0,0],
            [202] : [255,130,0,0,0],
            [301] : [80,80,0,0,0],
            [303] : [80,80,0,0,0],
            [302] : [135,120,0,0,0],
            [304] : [105,100,0,0,0],
            [201] : [150,150,0,0,0],
        }
    }
    public getFihsResID(_fishID)
    {
        let fishResID=0;
        this.m_fishResArr = {        
            [1] : 0,
            [2] : 1,
            [3] : 2,
            [4] : 3,
            [5] : 4,
            [6] : 5,
            [7] : 6,
            [8] : 7,
            [9] : 8,
            [10] :9,
            [11] :10,
            [12] :11,
            [13] :12,
            
            [14] :13,
            [15] :14,
            [16] :15, 
            [17] :16,
            [18] :17,
            [27] :28,
            [30] :101,
            [31] :103,
            [35] :108,
            [37] :202,
            [39] :15,
            [40] :16,
            [41]:17
        }
        fishResID=this.m_fishResArr[_fishID];
        if(!fishResID)
        {
            console.log("当前没有配置的鱼ID===",_fishID);
        }
        return fishResID;
    }
    public getDBRes(_id:number=0)
    {
        let dbName="";
        this.m_dbNameArr = {        
            [1] : "suoding",
            [2] : "jinbi",
            [3] : "yinbi",
            [4] : "act_gameEft_fishIsComing",
            [5] : "bulletFish",
            [6] : "hd00",
            [7] : "hd01",
            [8] : "xuanwo",
            [9] : "ge_boom_hint",
            [10] :"baofula",
            [11] :"goldBoom",
            [12] :"item1012001",
            [13] :"goldf",
            [14] :"ge_thunderLine",
            [15] :"ge_thunderLine_hit",
            [16] :"",
            [17] :"prop_1002",
            [18] :"kaca",
        }
        dbName=this.m_dbNameArr[_id];
        if(!dbName)
        {
          //  tonyInfo.instance().showTopTips("未找到龙骨动画"+_id);
        }
        return dbName;
    }
    public getFishColliderSize(_fishID)
    {
        let fishSize=this.m_fishColliderSize[_fishID];
        return fishSize;
    }

    public static GameConfig:any;  //得到的游戏服务器配置
    /**获取单个游戏配置数据 */
    // public static getGameItemConfig(keyVal:string|number):any{
    //     return this.GameConfig[keyVal][0];
    //     // let itemVo:any = null;
    //     // for(var key in this.GameConfig){
    //     //     if(key == keyVal){
    //     //         itemVo = this.GameConfig[key];
    //     //         break;
    //     //     }
    //     // }
    //     // return itemVo;
    // }

    public static allConfig:any={};  //来自服务器所有配置
    public static hadAddBtn:any = [];//存储的 技能按钮

    public static getfishinfo(fishid: number): any{
        
    }

    private static  mCannonConfig = null
    public static  getBatteryCfgData(){
        // if(this.mCannonConfig == null){
        //     let items = this.allConfig['CannonLevel'];//game.DbManager.instance().getjsdata("battery_new")['RECORDS'];//
        //     if(!items)
        //         return null
        //     this.mCannonConfig = []
        //     for(let i=0;i< items.length;i++){
              
        //         this.mCannonConfig.push({id:i+1,Multiple:items[i][0],Prop:items[i][1],Reward:items[i][2],Energy:items[i][3],IconType:items[i][4]});
        //     }
        // }
        
        return this.allConfig['CannonLevel']["RECORDS"];
    }
     /**兑换商城配置表 */
    private static  mExchangeConfig = null
    public static  getExchangeCfgData(){
        // if(this.mExchangeConfig == null){
        //     let items = this.allConfig['ExchangeRule'];//game.DbManager.instance().getjsdata("battery_new")['RECORDS'];//
        //     if(!items)
        //         return null
        //     this.mExchangeConfig = []
        //     for(let i=0;i< items.length;i++){
        //         this.mExchangeConfig.push({id:items[i][0],type:items[i][1],name:items[i][2],icon:items[i][3],mark:items[i][4],realcost:items[i][5],extraitem:items[i][6],item:items[i][7],cost:items[i][8]});
        //     }
        // }
        
        return this.allConfig['ExchangeRule']["RECORDS"];
    }
      /**通过ID获取兑换商城配置表  单个数据参数*/

    public static  getExchangeItemById(id:number=200021){
        // if(this.mExchangeConfig == null){
        //     let items = this.getExchangeCfgData();//game.DbManager.instance().getjsdata("battery_new")['RECORDS'];//
        //     if(!items)
        //         return null
        //     this.mExchangeConfig = []
        //     for(let i=0;i< items.length;i++){
        //         this.mExchangeConfig.push({id:items[i][0],type:items[i][1],name:items[i][2],icon:items[i][3],mark:items[i][4],realcost:items[i][5],extraitem:items[i][6],item:items[i][7],cost:items[i][8]});
        //     }
        // }
        this.mExchangeConfig = this.allConfig['ExchangeRule']["RECORDS"];
        for(let i=0;i<this.mExchangeConfig.length;i++){
            if(parseInt(this.mExchangeConfig[i].ID) == id){
                return this.mExchangeConfig[i]
            }
        }
        return null
    }
     /**通过Type获取兑换商城配置表  数据参数*/
     public static  getExchangeItemByType(_type:number=0){
        // if(this.mExchangeConfig == null){
        //     let items = this.getExchangeCfgData();//game.DbManager.instance().getjsdata("battery_new")['RECORDS'];//
        //     if(!items)
        //         return null
        //     this.mExchangeConfig = []
        //     for(let i=0;i< items.length;i++){
        //         this.mExchangeConfig.push({id:items[i][0],type:items[i][1],name:items[i][2],icon:items[i][3],mark:items[i][4],realcost:items[i][5],extraitem:items[i][6],item:items[i][7],cost:items[i][8]});
        //     }
        // }
        this.mExchangeConfig = this.allConfig['ExchangeRule']["RECORDS"];
        let reData = []
        for(let i=0;i<this.mExchangeConfig.length;i++){
            if(parseInt(this.mExchangeConfig[i].Type) == _type){
                reData.push(this.mExchangeConfig[i])
            }
        }
        return reData
    }
    /**道具配置表 */
    public static getItemCfgData(){
        // let self = this
        // let mCannonConfig = []
        // if(self.itemCfg != undefined ){
        //     mCannonConfig = self.itemCfg
        // }else{
        //     let items = this.allConfig['Prop'];
        //     if(!items)
        //         return mCannonConfig
        //     for(let i = 0; i <items.length; i++){
        //         let item = items[i]
        //         mCannonConfig.push({PropID:item[0],Name:item[1],Type:item[2],Add:item[3],UseType:item[4], ContinuedTime:item[5], CoolTime:item[6], CallNumbe:item[7], Target:item[8], Probability:item[9], 
        //             IconID:item[10],Desc:item[11],Money:item[12],ChannelId:item[13],GetGold:item[14],AddFish:item[15],ShareCool:item[16]});
        //     }

        //     self.itemCfg = mCannonConfig
        // }
        return this.allConfig['Prop']["RECORDS"];
    }

    /**道具ID配置表 */
    public static getItemCfgDataByID( id?:number ){
        let self = this
        let mCannonConfig = {}
        if(self.itemIDCfg != undefined ){
            mCannonConfig = self.itemIDCfg
        }else{
            let items = self.getItemCfgData();
            if(!items)
                return mCannonConfig
            for(let i = 0; i <items.length; i++){
                let item = items[i]
                mCannonConfig[item.PropID] = item;
            }

            self.itemIDCfg = mCannonConfig
        }
        if(id && id != undefined){
            return mCannonConfig[id]
        }else{
            return mCannonConfig
        }
        
    }


    /**商店配置表 */
    public static getStoreCfgData(){
        // let self = this
        // let mCannonConfig = []
        // if(self.storeCfg != undefined ){
        //     mCannonConfig = self.storeCfg
        // }else{
        //     let items1 = this.allConfig['PurchaseRule'];
        //     let items2 = this.allConfig['ExchangeRule'];
            
        //     if(!items2 || !items1)
        //         return mCannonConfig
        //     for(let i = 0; i <items2.length; i++){
        //         let item = items2[i]
        //         mCannonConfig.push({ID:item[0],Type:item[1],Name:item[2],Icon:item[3],Mark:item[4], RealCost:item[5], ExtraItem:item[6], Item:item[7], Cost:item[8], Recommend:item[9], Valid:item[10]});
        //     }
        //     for(let i = 0; i <items1.length; i++){
        //         let item = items1[i]
        //         mCannonConfig.push({ID:item[0],Type:item[1],Name:item[2],Icon:item[3],Mark:item[4], RealCost:item[5], ExtraItem:item[6], Item:item[7], Cost:item[8], Recommend:item[9], Valid:item[10]});
        //     }
            

        //     self.storeCfg = mCannonConfig
        // }

        var a = this.allConfig['PurchaseRule']["RECORDS"];
        var b = this.allConfig['ExchangeRule']["RECORDS"];
        
        return a.concat(b)
    }

    /**商店ID配置表 */
    public static getStoreCfgDataByID( id?:number ){
        let self = this
        let mCannonConfig = {}
        if(self.storeIDCfg != undefined ){
            mCannonConfig = self.storeIDCfg
        }else{
            let items = self.getStoreCfgData();
            if(!items)
                return mCannonConfig
            for(let i = 0; i <items.length; i++){
                let item = items[i]
                mCannonConfig[item.ID] = item;
            }

            self.storeIDCfg = mCannonConfig
        }
        if(id && id != undefined){
            return mCannonConfig[id]
        }else{
            return mCannonConfig
        }
        
    }

    /**排行榜配置表 */
    public static getRankCfgData(){
        // let self = this
        // let mCannonConfig = []
        // if(self.rankCfg != undefined ){
        //     mCannonConfig = self.rankCfg
        // }else{
        //     let items = this.allConfig['Rank'];
        //     if(!items)
        //         return mCannonConfig
        //     for(let i = 0; i <items.length; i++){
        //         let item = items[i]
        //         mCannonConfig.push({ID:item[0],type:item[1],rank:item[2],reward:item[3],Ename:item[4], EDesc:item[5]});
        //     }

        //     self.rankCfg = mCannonConfig
        // }
        return this.allConfig['Rank']["RECORDS"];
    }

    /**排行榜ID配置表 */
    public static getRankCfgDataByID( id?:number ){
        let self = this
        let mCannonConfig = {}
        if(self.rankIDCfg != undefined ){
            mCannonConfig = self.rankIDCfg
        }else{
            let items = self.getRankCfgData();
            if(!items)
                return mCannonConfig
            for(let i = 0; i <items.length; i++){
                let item = items[i]
                mCannonConfig[item.ID] = item;
            }

            self.rankIDCfg = mCannonConfig
        }
        if(id && id != undefined){
            return mCannonConfig[id]
        }else{
            return mCannonConfig
        }
        
    }
    /**等级提升配置表 */
    private static  mLevelUpConfig = null
    public static  getLevelUpCfgData(level:number=1){
        // if(this.mLevelUpConfig == null){
        //     let items = this.allConfig['Exp'];//game.DbManager.instance().getjsdata("battery_new")['RECORDS'];//
        //     if(!items)
        //         return null
        //     this.mLevelUpConfig = []
        //     for(let i=0;i< items.length;i++){
        //         this.mLevelUpConfig.push({id:i+1,level:items[i][0],award:items[i][1],exp:items[i][2]});
        //     }
        // }

        this.mLevelUpConfig = this.allConfig['Exp']["RECORDS"];

        for(let i=0;i<this.mLevelUpConfig.length;i++){
            if(this.mLevelUpConfig[i].Level == level){
                return this.mLevelUpConfig[i]
            }
        }
        return this.mLevelUpConfig
    }

    /**签到配置表 */
    public static getSignCfgData(){
        let self = this
        // let mCannonConfig = []
        // if(self.signCfg != undefined ){
        //     mCannonConfig = self.signCfg
        // }else{
        //     let items = this.allConfig['DailySignInAward'];
        //     if(!items)
        //         return mCannonConfig
        //     for(let i = 0; i <items.length; i++){
        //         let item = items[i]
        //         mCannonConfig.push({ID:item[0],Days:item[1],Award:item[2],Integral:item[3],ReplenishSign:item[4]});
        //     }

        //     self.signCfg = mCannonConfig
        // }
        return this.allConfig['DailySignInAward']["RECORDS"];
    }

    /**签到积分配置表 */
    public static getSignScoreCfgData(){
        // let self = this
        // let mCannonConfig = []
        // if(self.signScoreCfg != undefined ){
        //     mCannonConfig = self.signScoreCfg
        // }else{
        //     let items = this.allConfig['DailySignInScoreAward'];
        //     if(!items)
        //         return mCannonConfig
        //     for(let i = 0; i <items.length; i++){
        //         let item = items[i]
        //         mCannonConfig.push({ID:item[0],Score:item[1],Award:item[2]});
        //     }

        //     self.signScoreCfg = mCannonConfig
        // }
        return this.allConfig['DailySignInScoreAward']["RECORDS"];
    }

    /**黄金鱼配置表 */
    public static getGFCfgData(){
        // let self = this
        // let mCannonConfig = []
        // if(self.goldFishCfg != undefined ){
        //     mCannonConfig = self.goldFishCfg
        // }else{
        //     let items = this.allConfig['GoldFishAward'];
        //     if(!items)
        //         return mCannonConfig
        //     for(let i = 0; i <items.length; i++){
        //         let item = items[i]
        //         mCannonConfig.push({Level:item[0],Gold:item[1],Award:item[2]});
        //     }

        //     self.goldFishCfg = mCannonConfig
        // }
        return this.allConfig['GoldFishAward']["RECORDS"];
    }

    /**新手引导配置表 */
    public static getGuideCfgData(){
        // let self = this
        // let mCannonConfig = []
        // if(self.guideCfg != undefined ){
        //     mCannonConfig = self.guideCfg
        // }else{
        //     let items = this.allConfig['NoviceGuide'];
        //     if(!items)
        //         return mCannonConfig
        //     for(let i = 0; i <items.length; i++){
        //         let item = items[i]
        //         //StepID:步数,ReconnectStepID:连接步数,StepType:是否需要服务器,IsSkip:是否跳过,HasImage:是否有人,HasDialog:暂时没用,Mask:是否需要遮罩,DialogMsg:人对话内容,ReconnectRule:是否渔场内,Point:人坐标,IsFlip:是否需要手
        //         mCannonConfig.push({StepID:item[0],ReconnectStepID:item[1],StepType:item[2],IsSkip:item[3],HasImage:item[4],HasDialog:item[5],Mask:item[6],DialogMsg:item[7],ReconnectRule:item[8],Point:item[9],IsFlip:item[10]});
        //     }

        //     self.guideCfg = mCannonConfig
        // }
        return this.allConfig['NoviceGuide']["RECORDS"];
    }

    /**新手引导ID配置表 */
    public static getGuideCfgDataByID( id?:number ){
        let self = this
        let mCannonConfig = {}
        if(self.guideIDCfg != undefined ){
            mCannonConfig = self.guideIDCfg
        }else{
            let items = self.getGuideCfgData();
            if(!items)
                return mCannonConfig
            for(let i = 0; i <items.length; i++){
                let item = items[i]
                mCannonConfig[item.StepID] = item;
            }

            self.guideIDCfg = mCannonConfig
        }
        if(id && id != undefined){
            return mCannonConfig[id]
        }else{
            return mCannonConfig
        }
        
    }

    /**购买支付配置表 */
    public static getPurchaseCfgDatas(){

        return this.allConfig['PurchaseRule']['RECORDS'];
    }

    /**活动配置表 */
    public static getActivityCfgDatas(){
        // let self = this;
        // let mCannonConfig = {}

        // if(self.activityCfg != undefined ){
        //     mCannonConfig = self.activityCfg;
        // }else{
        //     let items = self.getGiftPacksCfgData();
        //     if(!items)
        //         return mCannonConfig
        //     for(let i = 0; i <items.length; i++)
        //     {
        //         let item = items[i];
        //         // mCannonConfig[item.Type] = item;
        //         let type = parseInt(item.Type);
        //         if(mCannonConfig[type] == undefined){
        //             mCannonConfig[type] = [];
        //         }
        //         mCannonConfig[type].push(item);
        //     }

        //     self.activityCfg = mCannonConfig;
        // }
        // if(id && id != undefined){
        //     return mCannonConfig[id]
        // }else{
        //     return mCannonConfig;
        // }

        return this.allConfig['ActShow']['RECORDS'];
        
    }
    
     /**获得任务配置表 prop-3,getfish-2,day-1*/
    public static  mTaskConfig = []
    public static getTaskCfgData(tasktype:number=TaskType.DayTask){
        let self = this
        let taskConfig = []
        let year = 0
        let month = 0
        let day = 0
        if(self.mTaskConfig && self.mTaskConfig[tasktype] != null ){
            taskConfig = self.mTaskConfig[tasktype].data
            year = self.mTaskConfig[tasktype].year
            month = self.mTaskConfig[tasktype].month
            day = self.mTaskConfig[tasktype].day
        }
        else{
            let items = this.allConfig["taskType"+tasktype];
            if(!items || !items.data)
                return {data:taskConfig,year:year,month:month,day:day}

            year = items.year
            month = items.month
            day = items.day

            for(let i = 0; i <items.data.length; i++){
                let item = items.data[i]
                let plandata = ["0","0"]
                let taskTargetNum = []
                let taskTargetId = []
                let stateId = 0

                if(tasktype == TaskType.DayTask){
                    plandata = [item[5]]
                    taskTargetNum.push(parseInt(item[2]))
                }
                else if(tasktype == TaskType.GetFishTask){
                    plandata = [item[5]]
                    let itemdata = item[2].split(':')
                    taskTargetNum.push(parseInt(itemdata[1]))
                    taskTargetId.push(parseInt(itemdata[0]))
                }
                else if(tasktype == TaskType.PropTask){
                    plandata = item[5].split(':')
                    stateId = parseInt(plandata[1])-1
                    let itemdata1 = item[2].split('-')
                    for(let j=0;j<itemdata1.length;j++){
                        let itemdata2 = itemdata1[j].split(':')
                        taskTargetNum.push(parseInt(itemdata2[1]))
                        taskTargetId.push(parseInt(itemdata2[0]))
                    }
                    
                }         
                taskConfig.push({taskId:item[0],taskDsc:item[1],taskRule:item[2],taskAward:item[3],vitality:item[4],taskPlan:item[5],taskState:item[6],tasknum:parseInt(plandata[0])||0,taskTargetNum:taskTargetNum,taskTargetId:taskTargetId,stateId:stateId});
            }
           
            self.mTaskConfig[tasktype] = {data:taskConfig,year:year,month:month,day:day}
        }
        return {data:taskConfig,year:year,month:month,day:day}
    }


     /**任务活跃度配置表 */
    private static  mTaskVitalityConfig = null
    public static  getTaskVitalityCfgData(){
        if(this.mTaskVitalityConfig == null){
            let items = this.allConfig['DailyTaskScoreAward']["RECORDS"];
            if(!items)
                return null
            this.mTaskVitalityConfig = []
            for(let i in items){
                this.mTaskVitalityConfig.push({ID:parseInt(items[i].ID),Score:parseInt(items[i].Score),Award:items[i].Award,ChannelID:parseInt(items[i].ChannelID),State:1});
            }
        }
        
        return this.mTaskVitalityConfig
    }

    /** 竞技场排行榜配置表 */
    public static getArenaRankCfgData(){
        let self = this
        let mArenaConfig = []
        if(self.arenaRankCfg != undefined ){
            mArenaConfig = self.arenaRankCfg
        }else{
            let items = this.allConfig['APGameConfig']["RECORDS"];
            if(!items)
                return mArenaConfig

            for(let i = 0; i <items.length; i++){
                let item = items[i]
                if(i < 4){
                    mArenaConfig.push({rank:item.Rank,reward:item.Award});
                }else{
                    let rankl = utils.instance().getRewardStr(item.Rank)[0] //借用一下解析
                    for(i = Number(rankl.id); i <= Number(rankl.num); i++){
                        mArenaConfig.push({i,reward:item.Award});
                    }
                }
            }
            self.arenaRankCfg = mArenaConfig
        }
        return mArenaConfig
    }

    /**彩贝配置表 */
    public static getColorShellData(){
        // let self = this
        // let mColorShellConfig = []
        // if(self.colorShellCfg != undefined ){
        //     mColorShellConfig = self.colorShellCfg
        // }else{
        //     let items = this.allConfig['Shell'];
        //     if(!items)
        //         return mColorShellConfig
        //     for(let i = 0; i <items.length; i++){
        //         let item = items[i]
        //         mColorShellConfig.push({ID:item[0],Times:item[1],Diamond:item[2],Award:item[3]});
        //     }

        //     self.colorShellCfg = mColorShellConfig
        // }
        return this.allConfig['Shell']["RECORDS"];
    }

    /**新手七天大礼配置表 */
    private static  mSDSignConfig = null
    public static  getSDSignCfgData(){
        // if(this.mSDSignConfig == null){
        //     let items = this.allConfig['DailyLoginAward'];
        //     if(!items)
        //         return null
        //     this.mSDSignConfig = []
        //     for(let i=0;i< items.length;i++){
        //         this.mSDSignConfig.push({id:i,Days:items[i][0],Award:items[i][1]});
        //     }
        // }
        
        return this.allConfig['DailyLoginAward']["RECORDS"];
    }

    /** 礼包配置表 */
    public static getGiftPacksCfgDatas(){
        // let self = this
        // let mMonthCardConfig = []
        // if(self.monthCardCfg != undefined ){
        //     mMonthCardConfig = self.monthCardCfg
        // }else{
        //     let items = this.allConfig['GiftPacks'];
        //     if(!items)
        //         return mMonthCardConfig
                
        //     mMonthCardConfig = items[0];
        //     self.monthCardCfg = mMonthCardConfig;
            
        // }
        
        return this.allConfig['GiftPacks']["RECORDS"];
    }

      /**炮台配置表 */
    private static m_allBatteryCfg = null
    public static getAllBatteryCfgData(){
        // let self = this
        // if(!this.m_allBatteryCfg){
        //     this.m_allBatteryCfg = []

        //     let items = this.allConfig['Cannon'];
        //     if(!items)
        //         return this.m_allBatteryCfg
        //     for(let i = 0; i <items.length; i++){
        //         let item = items[i]
        //         this.m_allBatteryCfg.push({CannonID:item[0],Type:item[1],SkillID:item[2],IconID:item[3],Name:item[4], Description :item[5]});
        //     }

        // }
        return this.allConfig['Cannon']["RECORDS"];
    }

       /**炮台技能配置表ByID */
    public static getBatteryCfgByID( id?:number ){
        let self = this
        let mCannonConfig = {}
        if(self.cannonCfg != undefined ){
            mCannonConfig = self.cannonCfg
        }else{
            let items = this.allConfig['Cannon']["RECORDS"];
            if(!items)
                return mCannonConfig
            for(let i = 0; i <items.length; i++){
                let item = items[i]
                mCannonConfig[item.CannonID] = item;
            }

            self.cannonCfg = mCannonConfig
        }
        if(id && id != undefined){
            return mCannonConfig[id]
        }else{
            return mCannonConfig
        }
    }

     /**炮台技能配置表 */
     private static m_batterySkillCfg = null
     public static getBatterySkillCfgData(){
       // let self = this
       // if(!this.m_batterySkillCfg){
       //     this.m_batterySkillCfg = []

       //     let items = this.allConfig['CannonSkill'];
       //     if(!items)
       //         return this.m_batterySkillCfg
       //     for(let i = 0; i <items.length; i++){
       //         let item = items[i]
       //         this.m_batterySkillCfg.push({SkillID:item[0],Type:item[1],Value:item[2],Probability:item[3],ExProbability :item[4]});
       //     }

       // }
       return this.allConfig['CannonSkill']["RECORDS"];
   }

   /**炮台技能配置表ByID */
   public static getBatterySkillCfgByID( id?:number ){
        let self = this
        let mCannonConfig = {}
        if(self.cannonSkillCfg != undefined ){
            mCannonConfig = self.cannonSkillCfg
        }else{
            let items = this.allConfig['CannonSkill']["RECORDS"];
            if(!items)
                return mCannonConfig
            for(let i = 0; i <items.length; i++){
                let item = items[i]
                mCannonConfig[item.SkillID] = item;
            }

            self.cannonSkillCfg = mCannonConfig
        }
        if(id && id != undefined){
            return mCannonConfig[id]
        }else{
            return mCannonConfig
        }
   }
    /**渔场关卡配置表 */
    public static getFisheryCfgByGameType(id:number =1 ){
        let self = this
        
        if(!self.fisheryCfg){
            self.fisheryCfg = this.allConfig['Fishery']["RECORDS"];
        }
        if(self.fisheryCfg){
            for(let i in self.fisheryCfg){
                if(parseInt(self.fisheryCfg[i].GameType) == id){
                    return self.fisheryCfg[i]
                }
            }
        }

        return null
   }

    /**vip配置表 */
    public static getVipCfgData(){
        return this.allConfig['Vip']["RECORDS"];
    }
    
    /**vip ID 配置表 */
    private static vipIDCfg = null
    public static getVipCfgDataByID( id?:number ){
        let self = this
        let mCannonConfig = {}
        if(self.vipIDCfg != undefined ){
            mCannonConfig = self.vipIDCfg
        }else{
            let items = self.getVipCfgData();
            if(!items)
                return mCannonConfig
            for(let i = 0; i <items.length; i++){
                let item = items[i]
                mCannonConfig[item.VipLevel] = item;
            }

            self.vipIDCfg = mCannonConfig
        }
        if(id != undefined){
            return mCannonConfig[id]
        }else{
            return mCannonConfig
        }
        
    }
     /**鱼配置表 */
     public static getFishCfgData(){
        return this.allConfig['AboutFish']["RECORDS"];
    }
    public static getFishCfgDataByID(_id:number = 0){
        let fishData = this.getFishCfgData()
        if(!fishData)
            return null
        
       for(let i in fishData){
           if(parseInt(fishData[i]["FishID"]) == _id){
               return fishData[i]
           }
       }
       return null
    }
    public static getRewardFromGiftPack(_id)
    {
        let data=this.allConfig["GiftPacks"]["RECORDS"];
        let len=data.length;
        let item="";
        for(let i=0;i<len;i++)
        {
            let goodsID=parseInt(data[i].GiftID);
            if(_id==goodsID)
            {
                console.log("道具数据===========",data[i]);
                item=data[i].GetItem;
                break;
            }
        }
        return item;
    }
    public static getRewardByGoodsID(_id)
    {
        let data=this.allConfig["PurchaseRule"]["RECORDS"];
        let len=data.length;
        let item="";
        let extraItem = ""
        for(let i=0;i<len;i++)
        {
            let goodsID=parseInt(data[i].ID);
            if(_id==goodsID)
            {
                item=data[i].Item;
                if(data[i].ExtraItem && data[i].ExtraItem != ""){
                    extraItem ="|"+data[i].ExtraItem
                }
                break;
            }
        }
        return item + extraItem;
    }
    public static getRewardByGoodsRealCost(_id)
    {
        let data=this.allConfig["PurchaseRule"]["RECORDS"];
        let len=data.length;
        let item="";
        for(let i=0;i<len;i++)
        {
            let goodsID=parseInt(data[i].ID);
            if(_id==goodsID)
            {
                item=data[i].RealCost;
                break;
            }
        }
        return item;
    }
  
}