export enum PROTOCOL_SEND{   //发送协议ID

    
    // MSGID_CLIENT_TO_HALL_GET_BAG_LIST	  = 10005,//获取背包信息 {}
    MSGID_CTS_100LOGIN=100,//玩家注册账号
    MSGID_CTS_101LOGIN=101,//玩家登录
    MSGID_CTS_201LOGIN=201,//玩家进入游戏
    MSGID_CTS_202TSREADY=202,//玩家进入渔场后告诉服务器 可以刷鱼了
    
    MSGID_CTS_204GETTABLEINFO=204,//请求桌子信息
    MSGID_CTS_205FIRE=205,//玩家开火
    MSGID_CTS_206BULLETCOLLIDER=206,//子弹碰撞到鱼
    MSGID_CTS_207EXITFROMROOM=207,//玩家从渔场退出

    MSGID_CTS_213CHANGEHI=213,//切换头像
    MSGID_CTS_214CHANGEHI=214,//切换名字
    MSGID_CTS_215GETBAGINFO=215,//请求背包数据
    MSGID_CTS_216GETPLAYERINFO=216,//请求个人信息数据
    MSGID_CTS_217ADDPOINT=217,//玩家加点
    MSGID_CTS_218GETGUNINFO=218,//请求炮台信息
    MSGID_CTS_219USEITEM=219,//使用道具
    MSGID_CTS_221USESKILL=221,//使用技能
    MSGID_CTS_223LOCKCHANGET=223,//锁定切换目标
    MSGID_CTS_300ENTERSQUARE=300,//请求进入广场房间
    MSGID_CTS_301GETPINFO=301,//已经初始化UI请求广场内玩家信息
    MSGID_CTS_302PLAYERMOVE=302,//玩家移动
    MSGID_CTS_303SRUSERLEVEL=303,//玩家离开
    MSGID_CTS_304GETUSERINFO=304,//玩家不存在，新创建玩家，请求玩家信息
    MSGID_CTS_305CHATMSG=305,//发送世界聊天信息
    MSGID_CTS_306GETTASK=306,//领取任务
    MSGID_CTS_307GIVEUPTASK=307,//放弃任务
    MSGID_CTS_308GETNST=308,//请求有没有未开始的任务


    MSGID_CTS_310EXITSQUARE=310,//玩家退出广场
    


    
    //1001= <2000 被动技能  >=2000 主动技能

}

export enum  PROTOCOL_RET{ //接受协议ID

    MSGID_STC_99=99,//错误信息
    MSGID_STC_88=88,//属性变化
    MSGID_STC_BACK100=2000,//玩家登录返回
    MSGID_STC_BACK201=2001,//玩家进入游戏返回
    MSGID_STC_2003=2003,//刷新一条鱼
    MSGID_STC_2010=2010,//其他玩家加入
    MSGID_STC_2011=2011,//玩家离开
    MSGID_STC_2012=2012,//鱼被击杀
    MSGID_STC_BACK213=2013,//切换头像返回
    MSGID_STC_BACK214=2014,//切换名字返回
    MSGID_STC_BACK215=2015,//背包信息返回
    MSGID_STC_BACK216=2016,//个人信息数据返回
    MSGID_STC_BACK217=2017,//玩家加点返回
    MSGID_STC_BACK218=2018,//炮台信息返回
    MSGID_STC_BACK219=2019,//使用道具返回
    MSGID_STC_IETMEND2020=2020,//道具结束
    MSGID_STC_BACK221=2021,//使用技能返回
    MSGID_STC_SKILLEND2022=2022,//使用技能结束
    MSGID_STC_BACK2023=2023,//锁定切换目标返回s

    MSGID_STC_BACK300=3000,//进入广场房间返回
    MSGID_STC_BACK301=3001,//获得广场内所有可显示的玩家信息
    MSGID_STC_BACK302=3002,//玩家移动广播给其他所有玩家
    MSGID_STC_BACK303=3003,//广场玩家离开
    MSGID_STC_BACK304=3004,//获得玩家信息
    MSGID_STC_BACK305=3005,//世界聊天信息
    MSGID_STC_BACK306=3006,//领取任务返回
    MSGID_STC_BACK307=3007,//放弃任务
    MSGID_STC_BACK308=3008,//过得有没有未开始的任务

    MSGID_STC_BACK310=3010,//玩家退出广场返回


    MSGID_STC_BACK204=2004,//玩家进入游戏后获得桌子信息
    MSGID_STC_BACK205=2005,//玩家子弹广播
    MSGID_STC_BACK206=2006,//子弹碰撞到鱼 更新鱼数据


}