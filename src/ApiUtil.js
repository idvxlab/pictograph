/*
 * @Descripttion: 
 * @version: 
 * @Author: Siji Chen
 * @Date: 2022-07-05 21:08:42
 * @LastEditors: Pei Liu
 * @LastEditTime: 2021-04-11 11:09:53
 */
export default class ApiUtil {
    // static URL_IP = 'http://3q2365905g.zicp.vip:80';
    // static URL_IP = 'http://127.0.0.1:5000';
    // static URL_IP = 'http://10.11.50.48:5000';
    static URL_IP = 'https://202.120.165.126:8000';
    // static URL_IP = 'http://202.120.165.125:8000'; 
    static URL_ROOT = '/api/v1';
 
    static API_WORDTOVEC = ApiUtil.URL_IP + ApiUtil.URL_ROOT + '/word2vec'; 
    static API_FEATURES_EXTRACT = ApiUtil.URL_IP + ApiUtil.URL_ROOT + '/features'; 
    static API_COLOR_EXTEND = ApiUtil.URL_IP + ApiUtil.URL_ROOT + '/colorExtend'; 
    static API_SIMILAR_RANKING = ApiUtil.URL_IP + ApiUtil.URL_ROOT + '/similarRanking'; 
    static API_COLOR_SUGESSTION = ApiUtil.URL_IP + ApiUtil.URL_ROOT + '/colorSuggestion';
    // static API_COLOR_JUDGE = ApiUtil.URL_IP + ApiUtil.URL_ROOT + '/colorJudge';  
    
}