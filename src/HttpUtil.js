/*
 * @Descripttion: 
 * @version: 
 * @Author: Pei Liu
 * @Date: 2020-12-28 13:21:45
 * @LastEditors: Pei Liu
 * @LastEditTime: 2021-03-03 14:46:55
 */
// export default class HttpUtil{
//     static get(url){  //这里定义的get函数，只需要指定访问api即可
//         return new Promise((resolve,reject)=>{
//             fetch(url)
//                 .then(response=>{
//                     if(response.ok){
//                         return response.json();
//                     }else{
//                         throw new Error(response.status + " : "+response.statusText);
//                     }
//                 })
//                 .then(result=>resolve(result))
//                 .catch(error=>{
//                     reject(error);
//                 })
//         });
//     }

import axios from "axios";

 
//     static post(url, data){  //而post函数，不仅指定api，还需要从前端传递参数信息过来
//         console.log('url',url)
//         return new Promise((resolve,reject)=>{ 
//             fetch(url,{ 
//                 method: 'POST',
//                 headers:{
//                     'Access-Control-Allow-Origin': '*',
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json',
//                 },
//                 mode: 'no-cors',
//                 cache: 'default',
//                 body: JSON.stringify(data),
//             })
//             .then(response=>response.json())
//             .catch(err => console.error(err))
//             .then(result=>resolve(result))
//             .catch(error=>{
//                 reject(error);
//             })
//         })
//     }
 
// }
import { connect } from 'react-redux';
import * as canvasActions from '@/actions/canvasAction';
import { cardColor, textColor,colormap,textfont, iconcolor, featuresList} from '@/selectors/canvas';



export default class HttpUtil{
    static get(url){  //我们定义的get函数，只需要指定访问api即可
        return new Promise((resolve,reject)=>{
            fetch(url)
                .then(response=>{
                    if(response.ok){
                        return response.json();
                    }else{
                        throw new Error(response.status + " : "+response.statusText);
                    }
                })
                .then(result=>resolve(result))
                .catch(error=>{
                    reject(error);
                })
        });
    }
 
    static post(url, data){  //而post函数，不仅指定api，还需要从前端传递参数信息过来
        // console.log('json_data', JSON.stringify(data))
        return new Promise((resolve,reject)=>{
            fetch(url,{ 
                method: 'POST',
                headers:{
                    'Access-Control-Allow-Origin': '*',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    // 'responseType': 'application/json'
                    // 'refer': 'http://10.11.50.48',
                    // 'host': '10.11.50.48'
                },
                mode: 'cors',
                credentials: 'include',
                // mode: 'no-cors',
                // cache: 'default',
                body:  JSON.stringify(data),
            })
                .then(response=>response.json())
                .catch(err => console.error(err))
                .then(result=>{
                    resolve(result);
                })
                .catch(error=>{
                    reject(error);
                })
        })
    }
 
}

