import request from "@/services/axios/commonRequest/index";
// import QS from "qs"; //数据序列化


// 获取直播源
export function getObspush(user_id){
    return request({
        url:"/streamer/obspush/",
        method:'get',
        params:{
            user_id:user_id
        }
    })
}

// 获取直播信息
export function getLives(user_id){
    return request({
        url:"/streamer/information/",
        method:'get',
        params:{
            user_id:user_id
        }
    })
}

// 修改直播状态
export function alterLives(user_id,status){
    return request({
        url:"/streamer/livestate/",
        method:'put',
        params:{
            user_id:user_id
        },
        data:{
            "status":status
        }
    })
}

// 修改主播信息
export function alterStreamer(user_id,live_name,cover_image,avatar,username){
    return request({
        url:"/streamer/inforupdate/",
        method:'put',
        params:{
            user_id:user_id
        },
        data:{
            "live_name":live_name,
            "cover_image":cover_image,
            "avatar":avatar,
            "username":username
        }
    })
}