export enum  globleData{ 


    //52.78.223.32
    serverIP = "ws://192.168.3.8:8002",//服务器地址
    sIP="ws://106.15.154.1",

    // gamePort1 = ":6100",
    // gamePort2 = ":6100",
    // gameArenaPort = ":6006",
    // guidePort = ":6301",
    // douyuPort = ":7000",

    // serverIP = "ws://192.168.0.8:6500",//服务器地址
    // sIP="ws://192.168.0.8",

    // gamePort1 = ":7100",
    // gamePort2 = ":7120",
    // gamePort3 = ":7140",
    // gamePort4 = ":7160",
    // gameArenaPort = ":7200",
    // guidePort = ":7300",
    // douyuPort = ":8000",

    guideMax = 66,
    partnerID= 10,//--10==官方渠道 11==小米渠道 12==应用宝 13==华为，14==vivo
    theID=1004,//1001=360 1002=sogo  1003=youkelai 1004=cpatg 

    payType=10,
    version="1.0.3",
    nextVersion="1.0.4",

}
 /**
 * 道具ID
 */
export enum PROP_ID {
    /** 炸弹 1007*/
    Bullet_Bomb = 1007,
    /** 暴雷 1008*/
    Bullet_BaoLei = 1008,
        /** 召唤 1015*/
    Skill_Call = 1015,

    /** 狂暴 1014*/
    Skill_Rampage = 1014,
    /** 锁定 1004*/
    Skill_Lock = 1004,

    /** 冰冻 1003*/
    Skill_Freeze = 1003,

    /** 金币 1001*/
    Gold = 1001,

    /** 钻石 1002*/
    Diamond = 1002,

    /** 黑洞 1016*/
    HeidongBoom = 1016,

    /** 闪电 1017*/
    Shandianyu = 1017,

    /** 竞技场子弹 10001 */
    apfirePower = 10001,

    /** 积分 2001 */
    apScore = 2001,

    //奖券
    lottery=1005,

    //刮刮卡
    guaguaka=1023,
     //S 炮体验卡
    S_Pao_Test=1027,

    //金额
    renMinBi=2000,

}
 /**
 * 技能ID
 */
export enum SkillTypeId{
    LockSkill = 0,
    FreezeSkill = 1,
    CallSkill = 2,
    RageSkill = 3,
    BombSkill = 4,
}
/**
 * 任务 type
 */

export enum TaskType{
    DayTask = 1,
    PropTask = 3,
    GetFishTask = 2,
    FishTask = 4,
    AchievementTask = 5
}
/**
 * 子弹 type
 */

export enum BulletType{
    BULLET_TYPE_NORMAL		    = 0x0,		//普通子弹
    BULLET_TYPE_SNOW			= 0x1,		//冰雪子弹
    BULLET_TYPE_FROZEN_SNOW	    = 0x2,		//冰冻状态下的冰雪子弹

}