import tensorflow as tf
from tensorflow.keras import Model
from tensorflow.keras.layers import Dense, Flatten, Conv2D, BatchNormalization, LeakyReLU, Reshape, Conv2DTranspose
import tensorflow_hub as hub

from pydarknet import Detector
from pydarknet import Image as darknetImg
from sklearn.cluster import KMeans
from pathlib import Path
from PIL import Image
from collections import Counter, defaultdict
import numpy as np
import sys

import re
from io import BytesIO
import base64

from imageio import imwrite
import os
import argparse

from preprocessing import *

#word2vec库
from mxnet import gluon
from mxnet import nd
from mxnet.contrib import text

# from PIL import Image
import matplotlib.pyplot as plt
#import cairosvg

#color库
import pandas as pd
import numpy as np
import scipy
from scipy import io
from scipy import special
import random
from random import choice
import scipy.interpolate
from scipy.interpolate import interp1d
import colorsys
import _pickle as cPickle
import datetime
from itertools import permutations
import numpy as np
import math
import cmath
import colormath
from colormath import color_diff_matrix
from colormath.color_objects import LabColor
from colormath.color_diff import delta_e_cie2000
from colormath.color_diff import delta_e_cie1976
from colormath.color_objects import LabColor, XYZColor, sRGBColor, LCHabColor, HSLColor
from colormath.color_conversions import convert_color
from matplotlib import pyplot as plt 
from scipy import interpolate
import datetime

#similiar库
import model_icons
import torch
import os
import shutil

from torchvision.datasets import ImageFolder
from torch.utils.data import DataLoader
from torchvision import transforms
from tqdm import tqdm
from matplotlib import pyplot as plt

#前后端数据连接
from flask import Flask, request
import json
from flask_cors import CORS, cross_origin
from flask import make_response, jsonify


############################################features全局############################################
gpu_available = tf.test.is_gpu_available()
print("GPU Available: ", gpu_available)

physical_devices = tf.config.experimental.list_physical_devices('GPU')
tf.config.experimental.set_memory_growth(physical_devices[0], True)
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'



OUTPUT_DIR = "./outputs"
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

# parser = argparse.ArgumentParser(description='feature_extraction')
# parser.add_argument('--device', type=str, default='GPU:0' if gpu_available else 'CPU:0',
# 					help='specific the device of computation eg. CPU:0, GPU:0, GPU:1, GPU:2, ... ')

# parser.add_argument('--imagepath', type=str, default='./model/0.png',
# 					help='path to the input image')

# args = parser.parse_args()

#############################################similar ranking 全局##########################################
# # set the device to either GPU or CPU
# device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# # load model, move to correct device and set in evaluation 
# model = model_icons.model
# model.load_state_dict(torch.load('model_icons.pth'))
# model = model.to(device)
# model.eval()

# # load dataset
# dataset_path = 'small_dataset'

# trf = transforms.Compose([
#     transforms.Lambda(lambda x: x.convert('L')),  # move PIL icon to B/W
#     transforms.Resize(size=(180, 180)),  # resize icon to be 180x180
#     transforms.ToTensor(),  # move read image to torch tensor
# ])

# GV_Barchart = ["stacked","horizontalrect","singlebar","grouped"]


############################################glove#######################################################################
#glove_6b50d = text.embedding.create(
#    'glove', pretrained_file_name='glove.6B.50d.txt')

glove_6b50d = cPickle.load(open("glove_6b50d.pkl","rb"))

# glove_6b50d = text.embedding.create('fasttext', pretrained_file_name='wiki.simple.vec', vocabulary=my_vocab)
# f = open(r"list_glove.txt")
f = open(r"list_fasttext.txt")
line = f.readline()
dataset = []
while line:
    # num = list(map(string,line.split()))
    dataset.append(line.split('\n')[0])
    line = f.readline()
f.close()
#print(dataset)

f = open(r"list_fasttext_outline.txt")
line = f.readline()
dataset_outline = []
dataset_outline_lower = []
while line:
    # num = list(map(string,line.split()))
    dataset_outline.append(line.split('\n')[0])
    dataset_outline_lower.append(line.split('\n')[0].lower())
    line = f.readline()
f.close()

# global imgTitle
# imgTitle = ''


#######color extend########
##读取模型
pkl_filename = "color_model.pkl"  

# Load from file
with open(pkl_filename, 'rb') as file:  
    model_color  = cPickle.load(file)

    
##读取hueJoint等概率
hueProb = np.load("hueProb.npy")
hueJoint = np.load("hueJoint.npy")
hueAdjacency = np.load("hueAdjacency.npy")

color_all = np.load("color_all.npy")
discriminability_pair = np.load("discriminability_pair.npy")
harmony_pair = np.load("harmony_pair.npy")




#一些全局变量

global maxDatapoints 
maxDatapoints  = 50000

global kulerX
kulerX = scipy.io.loadmat('kulerX.mat')

global fontNameDict
global fontNameKeys
with open('fontNameDict.json','r',encoding='utf8')as fp:
    fontNameDict = json.load(fp)
fontNameKeys = list(fontNameDict.keys())
print('fontNameKeys', type(fontNameKeys))

# color extraction functions
def iconOccurance(image, icon, thres=0.95):
    img_gray = cv2.cvtColor(np.float32(image), cv2.COLOR_RGB2GRAY)
    template = np.float32(icon)
    template = cv2.cvtColor(template, cv2.COLOR_RGB2GRAY)
    # Store width and height of template in w and h
    w, h = template.shape[::-1]

    # Perform match operations.
    res = cv2.matchTemplate(img_gray,template,cv2.TM_CCOEFF_NORMED)
       
    # Store the coordinates of matched area in a numpy array
    loc = np.where( res >= thres)
    return len(loc[0])


def rgb2hex(rgb):
    return '#%02x%02x%02x' % (int(rgb[0]), int(rgb[1]), int(rgb[2]))


def toRGB(rgbvals):
    return (int(rgbvals[0]), int(rgbvals[1]), int(rgbvals[2]))


def getColors(image, ncolors, thres=0):
    image = np.asarray(image)
    image = image.reshape((image.shape[0] * image.shape[1], image.shape[2]))

    clt = KMeans(n_clusters=ncolors)
    labels = clt.fit_predict(image)
    center_colors = clt.cluster_centers_
    
    counts = Counter(labels).most_common()
    all_counts = sum([count for (i,count) in counts])
    filtered_colors=[(i,count) for (i,count) in counts if count/all_counts>=thres]
    ordered_colors = [center_colors[i] for (i,count) in filtered_colors]
    rgb_colors = [each[:3] for each in ordered_colors]
    # proportions = [count/all_counts for (i,count) in filtered_colors]
    return rgb_colors

# DeepFont setup and functions
class DeepFont(tf.keras.Model):
	def __init__(self):
		super(DeepFont, self).__init__()
		
		self.batch_size = 128
		self.stride_size = 1
		self.num_classes = 150

		self.model = tf.keras.Sequential()

		self.model.add(tf.keras.layers.Reshape((96, 96, 1)))
		self.model.add(tf.keras.layers.Conv2D(trainable=False, filters=64, strides=(
		    2, 2), kernel_size=(3, 3), padding='same', name='conv_layer1', input_shape=(96, 96, 1)))
		self.model.add(tf.keras.layers.BatchNormalization())
		self.model.add(tf.keras.layers.MaxPooling2D(
		    pool_size=(2, 2), strides=None, padding='same'))

		self.model.add(tf.keras.layers.Conv2D(trainable=False, filters=128, strides=(
		    1, 1), kernel_size=(3, 3), padding='same', name='conv_layer2'))
		self.model.add(tf.keras.layers.BatchNormalization())
		self.model.add(tf.keras.layers.MaxPooling2D(
		    pool_size=(2, 2), strides=None, padding='same'))

		self.model.add(tf.keras.layers.Conv2D(256, kernel_size=(3), strides=(
		    self.stride_size), padding='same', activation='relu'))
		self.model.add(tf.keras.layers.Conv2D(512, kernel_size=(3, 3), strides=(
		    self.stride_size), padding='same', activation='relu'))
		self.model.add(tf.keras.layers.Conv2D(1024, kernel_size=(3, 3), strides=(
		    self.stride_size), padding='same', activation='relu'))
		self.model.add(tf.keras.layers.Conv2D(256, kernel_size=(3, 3), strides=(
		    self.stride_size), padding='same', activation='relu'))

		self.final_dense = tf.keras.layers.Dense(
		    self.num_classes, activation='softmax')

		self.optimizer = tf.keras.optimizers.Adam(learning_rate=0.002)

	def call(self, inputs):
		conv_layers = self.model(inputs)
		reduced_cols = tf.reduce_mean(conv_layers, 1)
		reduced_rows = tf.reduce_mean(reduced_cols, 1)
		# print(reduced_rows)
		result = self.final_dense(reduced_rows)
		print("Predictions", result)
		return result

	def best_match(self, predictions):
		# sums the columns of the logits shape is (150,)
		predictions = np.sum(predictions, axis=0)

		best_match = np.argsort(predictions, axis=0)
		best_match = np.array(best_match)
		best_match = best_match[-1:][0]

		with open('./df/150_fonts_backwards.json') as json_file:
			font_subset = json.load(json_file)

		return font_subset[str(best_match)]


def detect_font(model, image, bg):
	crops = []

	image = alter_image(image)
	image = resize_image(image, 96, bg)
	cropped_images = generate_crop(image, 96, 10)

	for c in cropped_images:
		crops.append(c)

    # prediction for a single image
	predictions = model.call(crops)
	best_match = model.best_match(predictions)
	print('predictions', predictions)
	print('best_match', best_match)

	return best_match


########################word2vec functions #########################
# # 使用余弦相似度来搜索近义词的算法。为了在求类比词时重用其中的求 k 近邻（ k -nearest neighbors）的逻辑，我们将这部分逻辑单独封装在knn函数中。
def knn(W, x, k):
    # 添加的1e-9是为了数值稳定性
    cos = nd.dot(W, x.reshape((-1,))) / (                                    #reshape(-1) 广播，复制该表size，使其可以点乘   nd.dot()点乘     
        (nd.sum(W * W, axis=1) + 1e-9).sqrt() * nd.sum(x * x).sqrt())
    topk = nd.topk(cos, k=k, ret_typ='indices').asnumpy().astype('int32')    #nd.asnumpy() mxnet ->numpy
    return topk, [cos[i].asscalar() for i in topk]

def get_similar_tokens(query_token, k, embed):
    topk, cos = knn(embed.idx_to_vec,
                    embed.get_vecs_by_tokens([query_token]), k+1)
    for i, c in zip(topk[0:], cos[0:]):  # 除去输入词
        print('cosine sim=%.3f: %s' % (c, (embed.idx_to_token[i])))




######################color suggestion functions #################
# Converts RGB pixel array to XYZ format.
# Implementation derived from http://www.easyrgb.com/en/math.php
def rgb2xyz(rgb):
    def format(c):
        c = c / 255.
        if c > 0.04045: c = ((c + 0.055) / 1.055) ** 2.4
        else: c = c / 12.92
        return c * 100
    rgb = list(map(format, rgb))
    xyz = [None, None, None]
    xyz[0] = rgb[0] * 0.4124 + rgb[1] * 0.3576 + rgb[2] * 0.1805
    xyz[1] = rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722
    xyz[2] = rgb[0] * 0.0193 + rgb[1] * 0.1192 + rgb[2] * 0.9505
    return xyz

# Converts XYZ pixel array to LAB format.
# Implementation derived from http://www.easyrgb.com/en/math.php
def xyz2lab(xyz):
    def format(c):
        if c > 0.008856: c = c ** (1. / 3.)
        else: c = (7.787 * c) + (16. / 116.)
        return c
    xyz[0] = xyz[0] / 95.047
    xyz[1] = xyz[1] / 100.00
    xyz[2] = xyz[2] / 108.883
    xyz = list(map(format, xyz))
    lab = [None, None, None]
    lab[0] = (116. * xyz[1]) - 16.
    lab[1] = 500. * (xyz[0] - xyz[1])
    lab[2] = 200. * (xyz[1] - xyz[2])
    return lab

# Converts RGB pixel array into LAB format.
def rgb2lab(rgb):
    return xyz2lab(rgb2xyz(rgb))


# In[4]:


def lineFit(x, y):

    y1 = y.copy()#这里做一个深拷贝，不然的话reshape后的数组是会影响到原数组的
    y1 = y1.reshape(y1.shape[1],)
    
    SSreg = 0.0000
    SStot = np.var(y1)
    y_mean = np.mean(y1)
    z = np.polyfit(x,y1,1) #一次多项式拟合，相当于线性拟合
    p = np.poly1d(z)
    
    for i in range(1,len(x)+1):
        SSreg += np.power((p(i) - y_mean), 2)        
    SSreg /= len(x)
    R = SSreg/SStot
    R2 = np.power(R,2)
    
    if(np.isnan(R2) or np.isinf(R2)):
        R2 = 0
    
    return R2


# In[5]:


def getTwoColorHarmony(col, col2):
    #Input:
        #col、col：shape(3,1)
    l = col[0,0]
    a = col[1,0]
    b = col[2,0]
    
    l2 = col2[0,0]
    a2 = col2[1,0]
    b2 = col2[2,0]
    
    detaC = np.power((np.power(b - b2, 2)+ np.power((a - a2) / 1.46, 2)), 1/2)
    HC = 0.04 + 0.53 * np.tanh(0.8 - 0.045 * detaC)
    
    HLsum = 0.28 + 0.54 * np.tanh(-3.88 + 0.029 * (l + l2))
    HdetaL = 0.14 + 0.15 * np.tanh(-2 + 0.2 * np.abs(l - l2))
    HL = HLsum + HdetaL
    
    EC1 = 0.5 + 0.5 * np.tanh(-2 + 0.5 * a)
    HS1 = -0.08 - 0.14 * np.sin(b + 50/180 * np.pi) - 0.07 * np.sin(2 * b + 90/180 * np.pi)
    EY1 = (0.22 * l - 12.8)/10 * np.exp((90/180 * np.pi - b)/10 - np.exp((90/180 * np.pi - b)/10))
    HSY1 = EC1 * (HS1 + EY1)
    
    EC2 = 0.5 + 0.5 * np.tanh(-2 + 0.5 * a2)
    HS2 = -0.08 - 0.14 * np.sin(b2 + 50/180 * np.pi) - 0.07 * np.sin(2 * b2 + 90/180 * np.pi)
    EY2 = (0.22 * l2 - 12.8)/10 * np.exp((90/180 * np.pi - b2)/10 - np.exp((90/180 * np.pi - b2)/10))
    HSY2 = EC2 * (HS2 + EY2)
    
    HH = HSY1 + HSY2
    
    CH = HC + HL + HH
    
    if(np.isnan(CH) or np.isinf(CH)):
        CH = 0
    
    return CH


# In[6]:


def pca2(data):
#     PCA2: Perform PCA using SVD.
#     data - MxN matrix of input data
#     (M dimensions, N trials)
#     signals - MxN matrix of projected data
#     PC - each column is a PC
#     V - Mx1 matrix of variances

    M = data.shape[0]
    N = data.shape[1]

    #subtract off the mean for each dimension
    #axis = 1，对每行求均值,维度居然降了！
    mn = np.mean(data, axis = 1)
    mn = mn.reshape(len(mn), 1)
    
    #np.tile(A, (x,y)) x表示纵向复制的个数，y表示横向复制，横向复制时不会增加列，纵向复制会增加行
    #https://blog.csdn.net/yimingsilence/article/details/52924359
    data = data - np.tile(mn, (1, N))

    
    #construct the matrix Y
    Y = data.T / np.sqrt(N - 1)
    

    #SVD does it all
    u,S,PC = np.linalg.svd(Y)  #这里的PC和matlab 中svd返回的PC行列相反！
    PC = PC.T
    
    #calculate the variances
    #https://blog.csdn.net/porly/article/details/7872313
    #S = np.diag(S)
    S = S.reshape(len(S), 1)
    if(len(S) == 1):
        S = [S,0,0]
    if(len(S) ==2):
        S = np.append(S,0)
    
    V = S * S

    
    #project the original data
    signals = np.dot(PC.T,data)
      
    return signals, PC, V


# In[7]:


def getPlaneFeatures(X):
    
    X_copy = X.copy()
    signals, coeff, roots = pca2(X_copy.T)
  
    normal = coeff[:, 2:3]
 
    if(normal[0] < 0):
        normal = normal * -1
    if(np.sum(roots) == 0):
        pctExplained = np.zeros((1,3))
    else:
        pctExplained = roots.T / np.sum(roots)
        
    n = X.shape[0]
    p = X.shape[1]
    
    meanX = np.mean(X_copy, axis = 0)
    meanX = meanX.reshape(1, len(meanX))
    
    error = np.abs( np.dot((X_copy - np.tile(meanX, (n, 1))),normal) )
    sse = np.sum(np.power(error, 2))
    
    #matlab可能有这个机制可以转换
    normal = normal.reshape(-1)

    return normal, pctExplained, meanX, sse
    


# In[8]:


def rgb2hsv(rgb):
    hsv = np.zeros(rgb.shape) #对hsv进行初始化
    #处理未均一化的rgb数
    if(np.max(rgb) > 1.0):
        rgb /= 255

    for i in range(rgb.shape[1]):
        h, s, v = colorsys.rgb_to_hsv(rgb[0, i], rgb[1, i], rgb[2, i])
        hsv[0, i] = h
        hsv[1, i] = s
        hsv[2, i] = v

    return hsv


# In[9]:


def RGB2Lab(R, G, B):
    
#     function [L, a, b] = RGB2Lab(R, G, B)
#     RGB2Lab takes matrices corresponding to Red, Green, and Blue, and 
#     transforms them into CIELab.  This transform is based on ITU-R 
#     Recommendation  BT.709 using the D65 white point reference.
#     The error in transforming RGB -> Lab -> RGB is approximately
#     10^-5.  RGB values can be either between 0 and 1 or between 0 and 255.  
#     By Mark Ruzon from C code by Yossi Rubner, 23 September 1997.
#     Updated for MATLAB 5 28 January 1998.

#Input:
    #R、G、B, shape(1*5)
    if(G is None or B is None): #如果只输入了一个参数，说明rgb没有拆分成三个通道分别输入，在这里做拆分处理
        B = R[:, :, 2:3]
        G = R[:, :, 1:2]
        R = R[:, :, 0:1]
    
    if(np.max(R) > 1.0 or np.max(G) > 1.0 or np.max(B) > 1.0): #如果rgb值没有做归一化处理，这里将其映射到0~1范围内
        R = R/255
        G = G/255
        B = B/255
    
    M = R.shape[0] #M = 1
    N = R.shape[1] #N = 5
    s = R.shape[0] * R.shape[1] #s = 5
    
    #Set a threshold
    T = 0.008856
    
    RGB = np.concatenate((R.reshape(1, s), G.reshape(1, s), B.reshape(1, s)),axis = 0) #RGB shape(3 * 5)
    
    #RGB to XYZ
    MAT = np.array([0.412453, 0.357580, 0.180423, 0.212671, 0.715160, 0.072169, 0.019334, 0.119193, 0.950227]).reshape(3, 3)#MAT shape(3*3)

    XYZ = np.dot(MAT, RGB)#XYZ shape(3*5)

    
    X = XYZ[0:1,:] / 0.950456 #shape(1,5)
    Y = XYZ[1:2,:]
    Z = XYZ[2:3,:] / 1.088754 
    
    XT = X > T
    YT = Y > T
    ZT = Z > T
    
    fX =  XT * np.power(X, 1/3) + ~XT * (7.787 * X + 16/116)
    
    #Compute L
    Y3 = np.power(Y, 1/3)
    fY = YT * Y3 + ~YT * (903.3 * Y)
    L = YT * (116 * Y3 - 16.0) + ~YT *(903.3 * Y)
    
    fZ = ZT * np.power(Z, 1/3) + ~ZT * (7.787 * Z + 16/116)
    
    #Compute a and b
    a = 500 * (fX - fY)  #数值*矩阵时，.* 和 *无区别 https://blog.csdn.net/xiaotao_1/article/details/79026406
    b = 200 * (fY - fZ)
    
    L = L.reshape(M, N) #输出L、a、b：shape（1*5）
    a = a.reshape(M, N)
    b = b.reshape(M, N)

    #输出变量个数如果为1
#     if ((nargout == 1) | (nargout == 0))
#       L = cat(3,L,a,b);
#     end

    return L, a, b


# In[10]:


def getColorSpaces(rgb, hueMapping):
    #input:
        #rgb shape:(3*5)
        #hueMaping 样条插值
    

    #lab=colorspace('rgb->cielab',rgb')';
    lab = np.zeros((rgb.shape[0],rgb.shape[1])) 
    
    #rgb[0, :]切片下来后shape(5,), rgb[0:1, :]切片下来shape(1,5)
    #https://blog.csdn.net/qq_18433441/article/details/55805619
    lab[0:1, :], lab[1:2, :], lab[2:3, :] = RGB2Lab(rgb[0:1, :], rgb[1:2, :], rgb[2:3, :]) #对r、g、b三个通道分别处理,每个通道shape(1*5)
    lab = lab / np.tile(np.array([[100, 128, 128]]), (lab.shape[1], 1)).T #lab shape(3*5)
    
    hsv = rgb2hsv(rgb) #hsv shape(3*5)
    
    #HSV cartesian
    #remap hue
    
    hsvRemap = hsv.copy() #深拷贝！！不然会改变hsv数组
    hsvRemap[0:1,:] = hueMapping(hsvRemap[0:1,:]) #把hsv的第一行，h转换为角度，最终h = h * cos(h), s = s* -sin(h), v = v
    chsv = np.concatenate((hsvRemap[1:2,:] * np.cos( hsvRemap[0:1,:] * 360 * np.pi / 180), hsvRemap[1:2,:] * (-np.sin(hsvRemap[0:1,:]* 360 * np.pi / 180 )), hsvRemap[2:3,:]), axis=0)
    
    return hsv, lab, chsv

    


# In[11]:


def circ_vmpdf(alpha, thetahat = 1, kappa = 0):
    
#     [p alpha] = circ_vmpdf(alpha, w, p)
#       Computes the circular von Mises pdf with preferred direction thetahat 
#       and concentration kappa at each of the angles in alpha

#       The vmpdf is given by f(phi) =
#       (1/(2pi*I0(kappa))*exp(kappa*cos(phi-thetahat)

#       Input:
#         alpha     angles to evaluate pdf at, if empty alphas are chosen to
#                   100 uniformly spaced points around the circle
#         [thetahat preferred direction, default is 0]
#         [kappa    concentration parameter, default is 1]

#       Output:
#         p         von Mises pdf evaluated at alpha
#         alpha     angles at which pdf was evaluated


#       References:
#         Statistical analysis of circular data, Fisher

#     Circular Statistics Toolbox for Matlab

#     By Philipp Berens and Marc J. Velasco, 2009
#     velasco@ccs.fau.edu

# if no angles are supplied, 100 evenly spaced points around the circle are
# chosen
    alpha_copy = alpha.copy()
    
    if(alpha_copy is None):
        alpha_copy = np.linspace(0, 2 * np.pi, 101)
        alpha_copy = np.array(alpha_copy[0:100]).T
        
    alpha_copy.flatten()
        
    #evaluate pdf
    #besseli = special.iv 第一类贝塞尔修正函数
    ##https://blog.csdn.net/zhyhou_knight/article/details/104391431
    c = 1 / (2 * np.pi * special.iv(0, kappa))
    p = c * np.exp(kappa * np.cos(alpha_copy - thetahat))
    
    #print(type(alpha)) #np.ndarray
    
    return p
    


# In[12]:


def getBasicStats(x, addLog):

    if len(x) > 0:
        log_x = np.log(x + 0.000001)
        features = [np.mean(x), np.std(x,ddof=1), np.min(x), np.max(x), np.mean(log_x), np.std(log_x,ddof=1), np.min(log_x), np.max(log_x)]
    else:
        features =np.zeros(8,dtype = np.float) 
        
    features = np.array(features).reshape(1,len(features))
    
    isinf = np.isinf(features).astype(np.bool)
    isnan = np.isnan(features).astype(np.bool)
    features[isinf] = 0
    features[isnan] = 0

    
    return features


# In[13]:


def getHueProbFeatures(hsv,satValThresh):
    
    hues = []

    hsv1 = hsv[1:3,:].min(axis = 0)
    selectColors = hsv1
    selectColors[selectColors >= satValThresh] = True
    selectColors[selectColors < satValThresh] = False
    selectColors = selectColors.astype(np.bool)

    hsv2 = np.round(hsv * np.tile(np.array([[359, 100, 100]]).T, (1, hsv.shape[1]))) + 1

    visHues = hsv2[0, selectColors]
#     print(len(visHues))
    visHues = visHues.astype(np.int16)

    hueJointList = []
    
#     gloabl parameters
#     hueJoint = hueProbs[0,0]['hueJoint']

#     print(len(hueJoint))

    for h1 in range(len(visHues)):
        for h2 in range(h1, len(visHues)):
            visHues1 = visHues[h1] #这里与matlab取出的值是一样的，因为h1,h2是原来的-1
            visHues2 = visHues[h2]
            hueJointList.append(hueJoint[visHues2 - 1, visHues1 - 1])#那么这里做索引的时候下标就要-1了！！

    hueAdjList=[]
    
#     gloabl parameters
#     hueAdjacency = hueProbs[0, 0]['hueAdjacency']

    for h1 in range(len(visHues) - 1):
        visHues1 = visHues[h1] #这里与matlab取出的值是一样的，因为h1,h2是原来的-1
        visHues2 = visHues[h1 + 1]
        hueAdjList.append(hueAdjacency[visHues1 - 1, visHues2 - 1])#那么这里做索引的时候下标就要-1了！！

#     gloabl parameters
#     hueProb = hueProbs[0, 0]['hueProb']

    hueJointList = np.array(hueJointList)
    hueAdjList = np.array(hueAdjList)

    hueProbFeatures = getBasicStats(hueProb[visHues - 1],1)
    hueJointProbFeatures = getBasicStats(hueJointList, 1)
    hueAdjProbFeatures = getBasicStats(hueAdjList, 1) 
    
#     print('----shape')
#     print(len(hueProb))
#     print(len(hueJointList))
#     print(len(hueAdjList))
    
    alpha = np.linspace(0, 2 * np.pi, 361)
    alpha = np.array(alpha[0:360]).T
    pMix = 0.001 * np.ones(len(alpha))

    for j in range(len(visHues)):
        pMix += circ_vmpdf(alpha, visHues[j].T * 2 * np.pi, 2 * np.pi)
    

    pMix /= np.sum(pMix)

    if(len(visHues) != 0):
        entropy = -np.sum(pMix * np.log(pMix))
    else:
        #if no visible hues, set the entropy high
        entropy=5.9
    
    entropy = np.array(entropy).reshape(1, 1)
    
#     hueFeatures = [hueProbFeatures, hueJointProbFeatures, hueAdjProbFeatures, entropy]
    hueFeatures = np.concatenate((hueProbFeatures, hueJointProbFeatures, hueAdjProbFeatures, entropy), axis = 1)
    
    isinf = np.isinf(hueFeatures).astype(np.bool)
    isnan = np.isnan(hueFeatures).astype(np.bool)
    hueFeatures[isinf] = 0
    hueFeatures[isnan] = 0
    
    return hueFeatures #shape(1*25)


# In[14]:


def normalizeFiveColor(col):
    col_copy = col.copy()
    # print('col_copy',col_copy)
    # print('col_copy',col_copy[:,col_copy.shape[1]-1])
    # print('col_copy',col_copy[:,col_copy.shape[1]-1].shape)
    # col_add_u = col_copy[:,col_copy.shape[1]-1].reshape(3,1)
    # col_add = np.tile(col_add_u ,(1,5))
    # print('col_add',col_add)
   
    # # col_copy.append(col_copy[:,col_copy.shape[1]-1])
    # # col_copy_new = np.insert(col_copy, 0, values=col_add, axis=0)
    # col_copy = np.tile(col_copy ,(1,5))

    # print('col_copy',col_copy)


    bool1 = (col_copy[:,0] == col_copy[:,1]).all()
    bool2 = (col_copy[:,1] == col_copy[:,2]).all()
    bool3 = (col_copy[:,2] == col_copy[:,3]).all()
    # bool4 = (col_copy[:,3] == col_copy[:,4]).all()

    if(bool1 and bool2 and bool3):
        fiveCol = col_copy[:,0:5]
        return fiveCol

    try:
        tck, u = splprep(col_copy, k = 3, s = 0)
        fiveCol = splev(np.linspace(0, 1, 5), tck)
        fiveCol = np.array(fiveCol)
    except:
#         print(col_copy)
        fiveCol = col_copy[:,0:5]
    
        
    return fiveCol


# In[15]:


def createFeaturesFromData(data,maxFeatures):

    
    allFeatures={}
    featureNames={}

    ##size(A,1)取矩阵A的行数,size(A,2)取矩阵A的列数
    # if size(maxFeatures,1)==0
    #     numThemes=size(data,1);
    # else
    #     numThemes= min([maxFeatures size(data,1)]);
    # end
    
    numThemes = len(data) #shape(10743,5,3)
    
    size = data.shape[1] * data.shape[2]

#     global parameters
#     kulerX = scipy.io.loadmat('D:\\Project\\huawei\\Al\\colorCode\\data\\kulerX.mat')
    
 
    ##样条插值
    ##http://liao.cpython.org/scipy15/
    x = kulerX['x'].reshape(-1)
    y = np.arange(0, 361)/360
    mapping = interp1d(x, y, kind = 3)
    
    rgbs = np.zeros((numThemes, size))
    labs = np.zeros((numThemes, size))
    color = np.zeros((numThemes,15))
    sortedCol = np.zeros((numThemes, 15))
    
    diff = np.zeros((numThemes, 3*(4)))
    sortedDiff = np.zeros((numThemes, 3*(4)))
    
    means = np.zeros((numThemes, 3))
    stddevs = np.zeros((numThemes, 3))
    medians = np.zeros((numThemes, 3))
    mins = np.zeros((numThemes, 3))
    maxs = np.zeros((numThemes, 3))
    maxMinDiff = np.zeros((numThemes, 3))
    meanDiff = np.zeros((numThemes, 3))
    stdDiff = np.zeros((numThemes, 3))
    
    plane = np.zeros((numThemes, 7))
    
    CH = np.zeros((numThemes, 1))
    
    HueR2 = np.zeros((numThemes, 1))
    LightR2 = np.zeros((numThemes, 1))
    
#     structureFeatures = np.zeros((numThemes, 75))
    
    flag = np.zeros((numThemes, 1))
    
    satValThresh = 0.2
    
    hueFeatures = getHueProbFeatures(np.random.rand(3, data.shape[1]),satValThresh)
    #注意是hueFeatures.shape[1], 而非len(hueFeatures),因为hueFeatures的shape为(1,25)
    hueProbFeatures = -99 * np.ones((numThemes, hueFeatures.shape[1]), dtype = np.float)
    
    
    #4个色彩空间
    for c in range(4):
        if(c == 0):
            name = 'chsv'
        elif(c == 1):
            name = 'lab'
        elif(c == 2):
            name = 'hsv'
        elif(c == 3):
            name = 'rgb'

        
        for i in range(numThemes): #data的每一行,(5*3)

            
            if(data.shape[2] == 1): #如果rgb是一维数组，比如直接是长度为15的list
                rgb = data.copy()
            else:
               #Color features 
                rgb = np.squeeze(data[i, :, :]).T #如果rgb不是以16进制出现，把每一行变成(3*5) r:-----;g:----;b:----
 
            numColors = np.sum(rgb[0, :] >= 0) #计算色盘数量
            
       
            rgb = rgb[:, 0:numColors] #正常情况下，处理之后与处理之前并无差别
            
            rgbs[i, 0 : (3 * numColors)] = np.squeeze(rgb[:].T).flatten().reshape(1, size) #将rgb数据按列展开为(1*15)的行向量，存入rgbs
            rgb_copy = rgb.copy() #这里传参时一定要做深拷贝！！！！不然rgb数组会被改变
            hsv, lab, chsv = getColorSpaces(rgb_copy,mapping)#此时的rgb为(3*5), hsv、lab、chsv:shape(3*5)
 
            labs[i, 0 : (3 * numColors)] = np.squeeze(lab[:].T).flatten().reshape(1, size)#将lab数据按列展开为(1*15)的行向量，存入labs
            if(name == 'chsv'):
                col = chsv.copy()
#                 print('----col-----')
#                 print(name)
#                 print(col)
    
                fiveCol = normalizeFiveColor(col)
     
            elif(name == 'lab'):
                col = lab.copy()
#                 print('----col-----')
#                 print(name)
#                 print(col)
#                 print('-----fiveCol----')
                fiveCol = normalizeFiveColor(col)
#                 print('---fiveCol')
#                 print(fiveCol)
            elif(name == 'hsv'):
                col = hsv.copy()
#                 print('----col-----')
#                 print(name)
#                 print(col)
#                 print('-----fiveCol----')
                fiveCol = normalizeFiveColor(col)
#                 print(fiveCol)
            elif(name == 'rgb'):
                col = rgb.copy()
#                 print('----col-----')
#                 print(name)
#                 print(col)
#                 print('-----fiveCol----')
                fiveCol = normalizeFiveColor(col)
#                 print(fiveCol)
#             print('--------------')
#             print(fiveCol)
#             print(col)

            color[i, 0 : 15] = np.squeeze(fiveCol[:].T).flatten().reshape(1, 15) #将颜色按列展开{color1},{color2}......{color5}

            if(name == 'hsv'): #如果是hsv空间，还要计算getHueProbFeatures
                hueProbFeatures[i:i+1,:] = getHueProbFeatures(hsv,satValThresh)

             
            diffs = np.zeros((3,4)) #三个通道，两两颜色之间的差异

            rgb_T = rgb.copy().T
            lab_new = np.zeros((rgb_T.shape))
            for j in range(1, numColors):
                
                #if this is hsv, then do the correct wraparound diff if
                #saturated and light enough
                
                #第一个通道的计算，分hsv和非hsv
#                 if(name == 'hsv'):
#                     minStaVal = np.min(np.concatenate((hsv[1:2,j-1:j+1],hsv[2:3,j-1:j+1]),axis =1))
#                     if(minStaVal >= satValThresh):
#                         pts = np.sort(np.concatenate((fiveCol[0:1,j:j+1],hsv[0:1,j-1:j]),axis =1), axis =1)
#                         print('---pts')
#                         print(pts)
#                         diffs[0:1,j-1:j] = np.min([pts[0,1] - pts[0,0], 1 - (pts[0,1] - pts[0,0])])
#                 else:

                diffs[0:1, j-1:j] = fiveCol[0:1, j:j+1] - fiveCol[0:1, j-1:j]
                
                #其他两个通道的计算
                diffs[1:2, j-1:j] = fiveCol[1:2, j:j+1] - fiveCol[1:2, j-1:j]
                diffs[2:3, j-1:j] = fiveCol[2:3, j:j+1] - fiveCol[2:3, j-1:j]
                lab_new[j] = rgb2lab(rgb_T[j]*255)
#             if(name == 'lab'):
#                 lab_new[0] = rgb2lab(rgb_T[0]*255) #shape(5,3)
#                 lab_new = lab_new.T
#                 try:
#                     structureFeatures[i:i+1, :] = nineColorFeature(lab_new, 'lab')
#                 except:
#                      structureFeatures[i:i+1, :] = np.zeros((1,75))
                            
               
            diff[i:i+1, 0:12] = np.concatenate((diffs[0:1,:], diffs[1:2,:], diffs[2:3,:]),axis = 1)#对于每个颜色主题，将三个通道的diff按行叠加{第一个通道}{第二个通道}{第三个通道}
            

            #对每个通道的diff分别做排序
            numDiffs = 4

            sortedDiff[i:i+1,0:numDiffs] = - np.sort(-diffs[0:1,:])
            sortedDiff[i:i+1,numDiffs:2*numDiffs] = - np.sort(-diffs[1:2,:])
            sortedDiff[i:i+1,2*numDiffs:3*numDiffs] = - np.sort(-diffs[1:2,:])
            
            meanDiff[i:i+1,0:1] = np.mean(diffs[0:1,:])
            meanDiff[i:i+1,1:2] = np.mean(diffs[1:2,:])
            meanDiff[i:i+1,2:3] = np.mean(diffs[2:3,:])
            
            stdDiff[i:i+1,0:1] = np.std(diffs[0:1,:],ddof = 1)
            stdDiff[i:i+1,1:2] = np.std(diffs[1:2,:],ddof = 1)
            stdDiff[i:i+1,2:3] = np.std(diffs[2:3,:],ddof = 1)
            
            #下面所有的处理，都是三个通道，每个通道各个颜色的统计值shape(10743*3) ---这里每个空间3*6 = 18个特征，4个空间共72个特征
            #注意求统计量后，shape由(3*5)变为(3,), 而非(3*1)
            col_copy = col.copy()
            means[i:i+1, :] = np.mean(col_copy.T,axis = 0)
            stddevs[i:i+1, :] = np.std(col_copy.T,axis = 0,ddof=1)#matlab和numpy求标准差算法不一样的，这里需要加参数doff=1
            medians[i:i+1, :] = np.median(col_copy.T,axis = 0)
            mins[i:i+1, :] = np.min(col_copy.T,axis = 0)
            maxs[i:i+1, :] = np.max(col_copy.T,axis = 0)
#             if(types == 'suggest'):
#                 maxMinDiff[i:i+1, :] = col_copy.T[-2:-1, :] - col_copy.T[-1:, :]
#             else:
            maxMinDiff[i:i+1, :] = maxs[i:i+1, :] - mins[i:i+1, :]
#             meanDiff[i:i+1, :] = np.mean(col_copy.T,axis = 0)
#             stdDiff[i:i+1, :] = np.std(col_copy.T,axis = 0,ddof=1)

             #http://www.mathworks.com/products/statistics/demos.html?file=/products
            #demos/shipping/stats/orthoregdemo.html
            
            plane[i:i+1,0:3], plane[i:i+1,3:6], planemean, plane[i:i+1,6:7] = getPlaneFeatures(col_copy.T)#---这里除hsv空间外，每个空间7个特征，3个空间共21个特征
            
            #sort colors
            B = np.sort(col[2:3, :])
            sortIdx = np.argsort(col[2:3, :])

#             for k in range(col.shape[0]):
#                 colk = col[k:k+1].flatten()
#                 col[k:k+1] = colk[sortIdx]
            
           # https://blog.csdn.net/qq_31816741/article/details/79343735
            sortedCol[i:i+1,0: 3 * 5] = fiveCol.flatten('F')
            
            if(name == 'lab'):
                for j in range(numColors):
                    for k in range(j+1, numColors):
           
                        CH[i:i+1,:] += getTwoColorHarmony(col[:, j:j+1], col[:, k:k+1])
            if(name == 'hsv'):
                HueR2[i:i+1,:] = lineFit(np.arange(1,numColors+1),col[0:1,:])
                LightR2[i:i+1,:] = lineFit(np.arange(1,numColors+1),col[2:3,:])
        
        #---旧方法：每个空间3*10 = 30个特征（4个空间共120个特征）----#
    #             if( np.std(diffs[0:1,:],ddof = 1) < 0.1):
    #                 flag[i:i+1,:] = 1
        
        allFeatures['Col'] = color  #旧方法的特征
        allFeatures['SortedCol'] = sortedCol #旧方法的特征

        allFeatures['Diff'] = diff #旧方法的特征
        allFeatures['SortedDiff'] = sortedDiff #旧方法的特征

        allFeatures[name,'Mean'] = means.copy()#一定要copy()啊！！！不然下次循环会改变这个的值，下面也一样
        allFeatures[name,'StdDev'] = stddevs.copy()        
        allFeatures[name,'Median'] = medians.copy()
        allFeatures[name,'Max'] = maxs.copy()
        allFeatures[name,'Min'] = mins.copy()
        allFeatures[name,'MaxMinDiff'] = maxMinDiff.copy()
#         allFeatures[name,'MeanDiff'] = meanDiff.copy()
#         allFeatures[name,'StdDiff'] = stdDiff.copy()
#         allFeaturesData = np.concatenate((allFeaturesData,means,stddevs,medians,maxs,mins,maxMinDiff),axis = 0)
        
        
        if(name != 'hsv'):
            allFeatures[name,'plane'] = plane.copy() #---除hsv空间外，每个空间7个特征（3个空间共21个特征）
        else:
            for i in range(hueProbFeatures.shape[1]):
#                 temp = hueProbFeatures[:,i]  #切片下来都是(10743,)
#                 print(temp.shape)
                temp = hueProbFeatures[:, i:i+1]
#                 print(temp == -99) #逻辑数组，可用来筛选temp数组
                temp[temp == -99] = np.max(temp) + 0.0001
                hueProbFeatures[:,i] = temp.reshape(1, len(temp))  
        
            allFeatures[name,'HueProb'] = hueProbFeatures.copy() #---hsv空间，hueProbFeatures共25个特征
        
        #-------旧方法：以上共120 + 21 + 25 = 166 个特征------ #
        
        #------新方法：删去旧方法中的color\sortedCol\diff\sortedDiff共3 * 4 * 4 = 48个特征，新增CH、 lightness and hue Grads 3个特征-----#
        #------新方法：（120 - 48） + 21 + 25 + 3 = 121 个特征-----#
        if(name == 'lab'):
            allFeatures[name, 'CH'] = CH.copy() #新方法中的CH特征
#             allFeatures[name, 'structureFeatures'] = structureFeatures.copy() #曲线结构特征
        if(name == 'hsv'):
            allFeatures[name,'HueR2'] = HueR2.copy() #新方法中的HueGD特征
            allFeatures[name,'LightR2'] = LightR2.copy() #新方法中的LightnessGD特征
    
    
    return allFeatures


# ## Color Suggestion

# In[16]:


# Copyright (c) 2017, JAMES MASON
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met:
#     * Redistributions of source code must retain the above copyright
#       notice, this list of conditions and the following disclaimer.
#     * Redistributions in binary form must reproduce the above copyright
#       notice, this list of conditions and the following disclaimer in the
#       documentation and/or other materials provided with the distribution.
#     * Neither the name of the author nor the
#       names of its contributors may be used to endorse or promote products
#       derived from this software without specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
# ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
# WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
# DISCLAIMED. IN NO EVENT SHALL JAMES MASON BE LIABLE FOR ANY
# DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
# (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
# LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
# ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
# (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
# SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

import numpy as np

# Converts RGB pixel array to XYZ format.
# Implementation derived from http://www.easyrgb.com/en/math.php
def rgb2xyz(rgb):
    def format(c):
        c = c / 255.
        if c > 0.04045: c = ((c + 0.055) / 1.055) ** 2.4
        else: c = c / 12.92
        return c * 100
    rgb = list(map(format, rgb))
    xyz = [None, None, None]
    xyz[0] = rgb[0] * 0.4124 + rgb[1] * 0.3576 + rgb[2] * 0.1805
    xyz[1] = rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722
    xyz[2] = rgb[0] * 0.0193 + rgb[1] * 0.1192 + rgb[2] * 0.9505
    return xyz

# Converts XYZ pixel array to LAB format.
# Implementation derived from http://www.easyrgb.com/en/math.php
def xyz2lab(xyz):
    def format(c):
        if c > 0.008856: c = c ** (1. / 3.)
        else: c = (7.787 * c) + (16. / 116.)
        return c
    xyz[0] = xyz[0] / 95.047
    xyz[1] = xyz[1] / 100.00
    xyz[2] = xyz[2] / 108.883
    xyz = list(map(format, xyz))
    lab = [None, None, None]
    lab[0] = (116. * xyz[1]) - 16.
    lab[1] = 500. * (xyz[0] - xyz[1])
    lab[2] = 200. * (xyz[1] - xyz[2])
    return lab

# Converts RGB pixel array into LAB format.
def rgb2lab(rgb):
    return xyz2lab(rgb2xyz(rgb))

# Returns CIEDE2000 comparison results of two LAB formatted colors.
# Translated from CIEDE2000 implementation in https://github.com/markusn/color-diff
def ciede2000(lab1, lab2):
    def degrees(n): return n * (180. / np.pi)
    def radians(n): return n * (np.pi / 180.)
    def hpf(x, y):
        if x == 0 and y == 0: return 0
        else:
            tmphp = degrees(np.arctan2(x, y))
            if tmphp >= 0: return tmphp
            else: return tmphp + 360.
        return None
    def dhpf(c1, c2, h1p, h2p):
        if c1 * c2 == 0: return 0
        elif np.abs(h2p - h1p) <= 180: return h2p - h1p
        elif h2p - h1p > 180: return (h2p - h1p) - 360.
        elif h2p - h1p < 180: return (h2p - h1p) + 360.
        else: return None
    def ahpf(c1, c2, h1p, h2p):
        if c1 * c2 == 0: return h1p + h2p
        elif np.abs(h1p - h2p) <= 180: return (h1p + h2p) / 2.
        elif np.abs(h1p - h2p) > 180 and h1p + h2p < 360: return (h1p + h2p + 360.) / 2.
        elif np.abs(h1p - h2p) > 180 and h1p + h2p >= 360: return (h1p + h2p - 360.) / 2.
        return None
    L1 = lab1[0]
    A1 = lab1[1]
    B1 = lab1[2]
    L2 = lab2[0]
    A2 = lab2[1]
    B2 = lab2[2]
    kL = 1
    kC = 1
    kH = 1
    C1 = np.sqrt((A1 ** 2.) + (B1 ** 2.))
    C2 = np.sqrt((A2 ** 2.) + (B2 ** 2.))
    aC1C2 = (C1 + C2) / 2.
    G = 0.5 * (1. - np.sqrt((aC1C2 ** 7.) / ((aC1C2 ** 7.) + (25. ** 7.))))
    a1P = (1. + G) * A1
    a2P = (1. + G) * A2
    c1P = np.sqrt((a1P ** 2.) + (B1 ** 2.))
    c2P = np.sqrt((a2P ** 2.) + (B2 ** 2.))
    h1P = hpf(B1, a1P)
    h2P = hpf(B2, a2P)
    dLP = L2 - L1
    dCP = c2P - c1P
    dhP = dhpf(C1, C2, h1P, h2P)
    dHP = 2. * np.sqrt(c1P * c2P) * np.sin(radians(dhP) / 2.)
    aL = (L1 + L2) / 2.
    aCP = (c1P + c2P) / 2.
    aHP = ahpf(C1, C2, h1P, h2P)
    T = 1. - 0.17 * np.cos(radians(aHP - 39)) + 0.24 * np.cos(radians(2. * aHP)) + 0.32 * np.cos(radians(3. * aHP + 6.)) - 0.2 * np.cos(radians(4. * aHP - 63.))
    dRO = 30. * np.exp(-1. * (((aHP - 275.) / 25.) ** 2.))
    rC = np.sqrt((aCP ** 7.) / ((aCP ** 7.) + (25. ** 7.)))
    sL = 1. + ((0.015 * ((aL - 50.) ** 2.)) / np.sqrt(20. + ((aL - 50.) ** 2.)))
    sC = 1. + 0.045 * aCP
    sH = 1. + 0.015 * aCP * T
    rT = -2. * rC * np.sin(radians(2. * dRO))
    return np.sqrt(((dLP / (sL * kL)) ** 2.) + ((dCP / (sC * kC)) ** 2.) + ((dHP / (sH * kH)) ** 2.) + rT * (dCP / (sC * kC)) * (dHP / (sH * kH)))


# In[17]:


import numpy as np
import matplotlib.pyplot as plt
from scipy import interpolate
from mpl_toolkits.mplot3d import Axes3D

def background(goal, rgb):
    goal_copy = np.squeeze(goal.copy()*255)
    rgb_copy = rgb.copy()
    
    l_g = np.zeros(goal_copy.shape[0])
    a_g = np.zeros(goal_copy.shape[0])
    b_g = np.zeros(goal_copy.shape[0])
    
    for i in range(goal_copy.shape[0]):
        l_g[i],a_g[i],b_g[i] = rgb2lab(goal_copy[i,:])
    
    l, a, b = rgb2lab(rgb_copy * 255)
    
    fq = interp1d(b_g, l_g, kind='quadratic')
    
    #如果background不在插值范围内，说明距离挺远的，直接返回True
    try:
        l_t = fq(b)
    except:
        return True
    
    deta = np.abs(l_t - l)
    
    if(deta > 20):
        return True
    else:
        return False


#template_folder和static_folder是前端代码文件夹
app = Flask(__name__)

#重要！解决跨域问题
# CORS(app, supports_credentials=True)
CORS(app, resources=r'/*')
# CORS(app, resources={r"/api/*": {"origins": "*"}})
headers = {
    'Cache-Control' : 'no-cache, no-store, must-revalidate',
    'Pragma' : 'no-cache' ,
    'Expires': '' ,
   # 'Access-Control-Allow-Origin' : 'http://localhost:3001',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
}

#api接口前缀
apiPrefix = '/api/v1/'

##################  features接口  ##################
@app.route('/')
@app.route(apiPrefix + 'features', methods=['POST', 'GET', 'OPTIONS','FETCH'])
@cross_origin(supports_credentials=True)

def main():
    #获取前端传输来的数据
    req_response = request.get_data(as_text=True)
    print('request.get_data(as_text=True)', request.get_data(as_text=True))
    req_response = json.loads(req_response)
    print('req_response',req_response)
    req_response_split = req_response.split(" ")
    print('len_split', len(req_response_split))

    image_data = req_response_split[0]
    global imgTitle
    imgTitle = req_response_split[1]
    print('imgTitle',imgTitle)

    # load VIF model
    vif_net = Detector(bytes("./yolo/cfg/yolov3.cfg", encoding="utf-8"), bytes("./yolo/weights/v5.weights", encoding="utf-8"), 0, bytes("./yolo/cfg/pictogram.data",encoding="utf-8"))

    # load DeepFont model
    df_model = DeepFont()
    df_model.load_weights('./df/checkpoints/weights_leaky_relu.h5', by_name=True)
    checkpoint = tf.train.Checkpoint(model = df_model)
    checkpoint.restore('./df/checkpoints/checkpoint9.index')
    
  
    # image_data = req_data


    decode_data = base64.urlsafe_b64decode(image_data.encode('UTF-8'))
    # print('decode_data',decode_data)
    nparr = np.frombuffer(decode_data, np.uint8)
    # print('nparr',nparr)
    im_cv = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    # print('im_cv',im_cv)
    im_rgb = cv2.cvtColor(im_cv, cv2.COLOR_BGR2RGB)
    image = Image.fromarray(im_rgb)

    # resize pictures
    im_resize = cv2.resize(im_cv, (160, 160))
    im_base64 = cv2.imencode('.png',im_resize)[1].tobytes()

    im_base64 = str(base64.b64encode(im_base64), encoding = "utf-8")  

    img_resize = {"picelement": "Resize",
                  "img": im_base64}

    all_pixels = image.size[0]*image.size[1]
    all_colors = image.getcolors(all_pixels)
    bg_color = max(all_colors)[1]
    # print("BG",bg_color)
    bg_feature = {"picelement":"Background",
                  "background":[rgb2hex(bg_color)]}
    
    
    # detect elements
    img_bgr = image.copy()
    img_bgr = np.asarray(img_bgr)[:,:,::-1]
    img_darknet = darknetImg(img_bgr)
    vif_results = vif_net.detect(img_darknet)

    img_vis_output = image.copy()
    crop_vis_image = ''

    img_icon_output = image.copy()
    crop_icon_image = ''

    img_font_output = image.copy()
    crop_font_image = ''

    img_text_output = image.copy()
    crop_text_image = ''

    sample_img = image.copy()

    font_bg = ''
    font_color = ''

    text_bg = ''
    text_color = ''

    icon_bg = ''
    icon_color = ''

    isVis = 'false'



    cat_dict=defaultdict(list)
    vis_cat = ["up","left","down","right","up-right","up-left","down-left","down-right"]

    print('vif_results:\n', vif_results)

    for i, (cat, score, bounds) in enumerate(vif_results):
        elem_cat = str(cat)
        x, y, w, h = bounds
        bbox = (int(x - w / 2),int(y - h / 2),int(x + w / 2),int(y + h / 2))
        # cat_dict[elem_cat].append(bbox)

        # crop_output = crop_image.crop(bbox)
        # crop_name = "{}_{}_{}.png".format(image_name,elem_cat,i)
        # crop_output.save(os.path.join(OUTPUT_DIR,crop_name))
        # crop_colors = getColors(crop_output,4,0.02)

#        cat_dict[elem_cat].append((bbox,crop_colors))
#        if elem_cat not in vis_cat:
#            img_output.paste(crop_colors[0],bbox)
        if elem_cat == "icon":
            crop_icon_image = img_icon_output.crop(bbox)
            crop_colors = getColors(crop_icon_image,4,0.02)
            img_icon_output.paste(toRGB(crop_colors[0]),bbox)
            icon_occur = iconOccurance(img_icon_output, crop_icon_image)
            # print(icon_occur)
            if icon_occur < 3:
                isVis = 'false'
            else:
                isVis = 'true'

            if(crop_colors[:1]):
                icon_bg = crop_colors[:1][0].tolist()
            if(crop_colors[1:2]):
                icon_color = crop_colors[1:2][0].tolist()
            #   img_output.paste(toRGB(crop_colors[0]),bbox)
            # cat_dict[elem_cat].append((bbox,crop_colors,icon_occur))
            
            
       
        # if elem_cat in vis_cat:
        #     print('hasVis')
        #     bbox = 50, 8, 142, 31
        #     # img_output.paste(toRGB(crop_colors[0]),bbox)
        #     # cat_dict['vis'].append((bbox,crop_colors))
        #     crop_vis_image = img_vis_output.crop(bbox)
        #     crop_colors = getColors(crop_vis_image,4,0.02)
        #     img_vis_output.paste(toRGB(crop_colors[0]),bbox)

        # if elem_cat not in vis_cat:
        #     img_output.paste(toRGB(crop_colors[0]),bbox)
        #     cat_dict[elem_cat].append((bbox,crop_colors))
        if elem_cat=="title":
            print('bbox', bbox)
            crop_font_image = img_font_output.crop(bbox)
            crop_colors = getColors(crop_font_image,4,0.02)
            # icon_bg, icon_color = crop_colors[:2]
            if(crop_colors[:1]):
                font_bg = crop_colors[:1][0].tolist()
            if(crop_colors[1:2]):
                font_color = crop_colors[-2:-1][0].tolist()
            # text_bg, text_color = crop_colors[:2]
            img_font_output.paste(toRGB(crop_colors[0]),bbox)
        
        if elem_cat=="textbox":
            
            crop_text_image = img_text_output.crop(bbox)
            crop_colors = getColors(crop_text_image,4,0.02)
            # icon_bg, icon_color = crop_colors[:2]
            if(crop_colors[:1]):
                text_bg = crop_colors[:1][0].tolist()
            if(crop_colors[1:2]):
                text_color = crop_colors[-2:-1][0].tolist()
            # text_bg, text_color = crop_colors[:2]
            img_text_output.paste(toRGB(crop_colors[0]),bbox)

    print(cat_dict)

    #vis图片存储
    # output_name = "VIS_{}.png".format(image_name)
    # output_path = os.path.join(OUTPUT_DIR,output_name)
    # img_output.save(output_path)

    #vis图片str
    if(crop_vis_image != ''):
        buffered = BytesIO()
        crop_vis_image.save(buffered, format="PNG")
        vis_str = base64.b64encode(buffered.getvalue()).decode()

        vis_colors = getColors(crop_vis_image,6,0.02)
        vis_colors = [rgb2hex(color) for color in vis_colors][1:]
        vis_feature = {"picelement":"Vis",
                    "fillcolor":vis_colors,
                    "strokecolor":"",
                    "img":vis_str}
    else:
        print('noVis')
        bbox = (95, 50, 180, 180)
        # bbox = (15, 117, 74, 148)
        # bbox = (50, 8, 142, 31)
        # img_output.paste(toRGB(crop_colors[0]),bbox)
        # cat_dict['vis'].append((bbox,crop_colors))
        crop_vis_image = img_vis_output.crop(bbox)
        # crop_colors = getColors(crop_vis_image,4,0.02)
        # img_vis_output.paste(toRGB(crop_colors[0]),bbox)

        buffered = BytesIO()
        crop_vis_image.save(buffered, format="PNG")
        vis_str = base64.b64encode(buffered.getvalue()).decode()

        vis_colors = getColors(img_vis_output,6,0.02)
        vis_colors = [rgb2hex(color) for color in vis_colors][1:]
        vis_feature = {"picelement":"Vis",
                    "fillcolor":vis_colors[:-2],
                    "strokecolor":"",
                    "img":vis_str}
        # vis_feature = {"picelement":"Vis",
        #             "fillcolor":'',
        #             "strokecolor":"",
        #             "img":''}



#    font_list = []
#    font_colors = []
#    font_crops = []
    text_feature={}
    icon_feature={}
#    for key,val in cat_dict.items():
#        if key not in vis_cat:
#            firstElem = val[0]
#            print(firstElem)
#
#            sample_crop = sample_img.crop(firstElem[0])
#            sample_name = "{}_{}.png".format(key,image_name)
#            sample_path = os.path.join(OUTPUT_DIR,sample_name)
#            sample_crop.save(sample_path)
#
#            text_bg, text_color = firstElem[1]
#            try:
#              text_font = detect_font(df_model,sample_crop,toRGB(text_bg))
#            except:
#              text_font = ""
#            font_list.append(text_font)
#            font_colors.append(rgb2hex(text_color))
#            font_crops.append(sample_path)
#
#    element_list = [{"picelement":"Background",
#                     "background":"#f6f6f5",},
#                    {"picelement":"Vis",
#                     "fillcolor":vis_colors,
#                     "strokecolor":"",
#                     "img":output_path},
#                    {"picelement":"Text",
#                     "font":font_list,
#                     "textcolor":font_colors,
#                     "img":font_crops}]
    # if 'textbox' in cat_dict.keys():
    # key = 'textbox'
    

    #elment图片存储
    # sample_name = "{}_{}.png".format(key,image_name)
    # sample_path = os.path.join(OUTPUT_DIR,sample_name)
    # sample_crop.save(sample_path)

    #element 图片str
    if(crop_font_image != ''):

        buffered_font = BytesIO()
        crop_font_image.save(buffered_font, format="PNG")
        element_str = base64.b64encode(buffered_font.getvalue()).decode()
        
        try:
            text_font = detect_font(df_model,crop_font_image,toRGB(font_bg))
            print('text_font', text_font)
        except:
            text_font = ""
        
        if(text_font == ""):
            text_font = choice(fontNameKeys)
        else:
            text_font_value = text_font.split('std')[0]
            find_flag = False
            for key, value in fontNameDict.items():
                print('fontNameKey', key, value)
                if(text_font_value == value):
                    text_font = key
                    find_flag = True
                    break
            if(find_flag == False):
                text_font = choice(fontNameKeys)

        text_feature = {"picelement":"Text",
                        "font":text_font.lower(),
                        #"textcolor":[rgb2hex(font_color)],
			"textcolor": ["#000"],
                        "img":element_str}
    elif(crop_text_image != ''):
        buffered_text = BytesIO()
        crop_text_image.save(buffered_text, format="PNG")
        element_str = base64.b64encode(buffered_text.getvalue()).decode()
        
        try:
            text_font = detect_font(df_model,crop_text_image,toRGB(text_bg))
            pritn(text_font)
        except:
            text_font = ""

        if(text_font == ""):
            text_font = choice(fontNameKeys)
        else:
            text_font_value = text_font.split('std')[0]
            find_flag = False
            for key, value in fontNameDict.items():
                print('fontNameKey', key, value)
                if(text_font_value == value):
                    text_font = key
                    find_flag = True
                    break
            if(find_flag == False):
                text_font = choice(fontNameKeys)

        text_feature = {"picelement":"Text",
                        "font":text_font.lower(),
                        #"textcolor":[rgb2hex(text_color)],
			"textcolor": ["#000"],
                        "img":element_str}
    else:
        text_font = choice(fontNameKeys)
        text_feature = {"picelement":"Text",
                        "font": text_font.lower(),
                        "textcolor":[],
                        "img":''}


    # if 'icon' in cat_dict.keys():
    #     key = 'icon'
    #     firstElem = cat_dict[key][0]
    #     sample_crop = sample_img.crop(firstElem[0])

    #     #icon图片存储
    #     # sample_name = "{}_{}.png".format(key,image_name)
    #     # sample_path = os.path.join(OUTPUT_DIR,sample_name)
    #     # sample_crop.save(sample_path)

    #     #icon 图片str
    #     sample_crop.save(buffered, format="PNG")
    #     icon_str = base64.b64encode(buffered.getvalue()).decode()


    #     icon_bg, icon_color = firstElem[1][:2]
    #     if firstElem[2] < 3:
    #       isVis = 'false'
    #     else:
    #       isVis = 'true'
    if(crop_icon_image != ''):
        buffered_icon = BytesIO()
        crop_icon_image.save(buffered_icon, format="PNG")
        icon_str = base64.b64encode(buffered_icon.getvalue()).decode()

        icon_colors = getColors(crop_icon_image,6,0.02)
        icon_colors = [rgb2hex(color) for color in icon_colors][1:]

        icon_feature = {"picelement":"icon",
                        "background":[rgb2hex(icon_bg)],
                        "color":[rgb2hex(icon_color)],
                        "img":icon_str,
                        "isVis":isVis}
    
    else:
        icon_feature = {"picelement":"icon",
                        "background":[],
                        "color":[],
                        "img":"",
                        "isVis": ""}
    # if icon_feature:
    element_list = [bg_feature, text_feature, icon_feature, vis_feature]
    # else:
    #     element_list = [bg_feature, text_feature, vis_feature]
        
    # print(element_list)
    # print('成功',element_list)

    response = {'data': element_list, 'resize_data': [img_resize]}
    response = make_response(jsonify(response))
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'OPTIONS,HEAD,GET,POST'
    response.headers['Access-Control-Allow-Headers'] = 'x-requested-with'
    response.headers['Content-Type'] = 'application/json'

    return response.data


@app.route('/')
@app.route(apiPrefix + 'word2vec', methods=['POST', 'GET', 'OPTIONS'])
@cross_origin(supports_credentials=True)

# 通过预训练词向量实例embed来搜索近义词
def get_similar_icon_glove():
	query_token_list = request.get_data(as_text=True)#获取前端传输来的数据
	# query_token_list = ["acceleration", "3", "4", "5", "6"]
	query_token_list = eval(query_token_list)
	query_token_title = imgTitle
	print('query_token_title',query_token_title)
	k=50
	outline_list = ['TIM截图20200608145656.png']
	res_data = {}
	score_dict = {}
	for i in range(len(query_token_list)):
		# print(query_token_list[i])
		query_name = query_token_list[i]
		query_token = query_token_list[i].lower().split(' ')[0].split('_')[0]	# query_token = 'airplane'
		embed = glove_6b50d
		vecs_query = embed.get_vecs_by_tokens(query_token)
		if(query_token_title in outline_list):
			vecs = embed.get_vecs_by_tokens(dataset_outline_lower)
		else:
			vecs = embed.get_vecs_by_tokens(dataset)
		topk, cos = knn(vecs,vecs_query,k)
		print('------------%s----glove--------' % query_token)
		get_similar_tokens(query_token, 10, embed)
		nearest = []
		score = []
		for i, c in zip(topk[0:], cos[0:]):
			#img=Image.open('E:/IDVX/Pictograph/crowler/all/' + str(dataset[i]) + '.png')   #'d:/dog.png'
			#plt.figure(str(dataset[i]) + "-" + str(i) + "-" + str(c))
			#plt.imshow(img)
			#plt.show()
			# print('cosine sim=%.3f: %s' % (c, (dataset[i])))
			# res_data.append(dataset[i])
			if(query_token_title in outline_list):
				nearest.append(dataset_outline[i] + "_outline")
			else:
				nearest.append(dataset[i])
			score.append(np.float(c))
		
		res_data[query_name] = nearest
		score_dict[query_name] = score


	print('成功-word2vec',res_data)
	# print('score', score_dict)

	re = {'data': res_data, 'score': score_dict}
	response = make_response(jsonify(re))
	response.headers['Access-Control-Allow-Origin'] = '*'
	response.headers['Access-Control-Allow-Methods'] = 'OPTIONS,HEAD,GET,POST'
	response.headers['Access-Control-Allow-Headers'] = 'x-requested-with'
	response.headers['Content-Type'] = 'application/json'

	return response.data

##################  colorExtend接口  ##################
@app.route('/')
@app.route(apiPrefix + 'colorExtend', methods=['POST', 'GET', 'OPTIONS','FETCH'])
@cross_origin(supports_credentials=True)
def colorExtend():

    ### import datetime
    start = datetime.datetime.now()

    #获取前端传输来的数据
    req_data = request.get_data(as_text=True)
    req_data = json.loads(req_data)
    print('req_data1111',req_data)

    FeildsData = req_data["FieldsData"]
    CatogoriesData = req_data["categoriesData"]
    SeriesData = req_data["seriesData"]
    colorset = req_data["colorset"]
    
    # print('req_data1111',req_data["AllData"])
    # print('req_data1111',req_data["colorset"])

    # temp1_data = colorset.replace("[", "")
    # temp2_data = temp1_data.replace("]", "")
    # temp3_data = temp2_data.split(",")
    # temp4_data = list(map(int, temp3_data))
    # temp5_data = np.array(temp4_data)
    # temp6_data = temp5_data.reshape((int(len(temp4_data) / 3), 3))

    

    test1_1 = np.array([colorset])/255


    test1_1copy = test1_1.copy()[0,:].T

    #定义差异度threshold - k 和插入位置 - c

    #8色以上就15了
    t = 15
    # c = test1_1copy.shape[1]
    a = 0.5
    pred6 = []
    targets3 = []
    cc = test1_1copy.shape[1]
    cc2 = cc + 1

    for c in range(len(test1_1copy)+1):
        test1_hsv = rgb2hsv(test1_1copy)

        hsv2 = np.round(test1_hsv * np.tile(np.array([[359, 100, 100]]).T, (1, test1_hsv.shape[1]))) + 1

        visHues = hsv2[0,:]
        visHues = visHues.astype(np.int16)  

        numColor = len(visHues)
        pJoint = np.zeros(360)
        pAdj1 = np.zeros(360)
        pAdj2 = np.zeros(360)

        print('numColor', numColor)

        if(c == 0):
            for k in range(1, numColor):
                for j in range(360):
                    ck = visHues[k]        
                    pJoint[j] += hueJoint[ck-1, j]
            for i in range(360):
                ci = visHues[0]
                pAdj1[i] = hueAdjacency[ci-1,i]
            p = (1-a) / 2 * hueProb.squeeze() + a * pAdj1  +  (1 - a)/2 * pJoint / (numColor - 1)

        elif(c == numColor):
            for k in range(0, numColor -1):
                for j in range(360):
                    ck = visHues[k]
                    pJoint[j] += hueJoint[ck-1, j]
            for j in range(360):
                cj = visHues[numColor -1]
                pAdj2[j] = hueAdjacency[cj-1,j]       
            p = (1-a) / 2 * hueProb.squeeze() + a * pAdj2  +  (1 - a)/2 * pJoint / (numColor - 1)

        elif(numColor  > 2):
            for k in range(numColor):
                if(k != c or k!= (c-1)):
                    for j in range(360):
                        ck = visHues[k]
                        pJoint[j] += hueJoint[ck-1, j]
            for i in range(360):
                ci = visHues[c-1]
                pAdj1[i] = hueAdjacency[ci-1,i]
            for j in range(360):
                cj = visHues[c]
                pAdj2[j] = hueAdjacency[cj-1,j]
            p = (1-a) / 2 * hueProb.squeeze() + a * (pAdj1 + pAdj2)/2  +  (1 - a)/2 * pJoint / (numColor - 2)   
    

        H = []

        for i in range(30):
        #         for j in range(15):
        # #         for j in range(15):
            h = np.random.randint(0, 360)
            u = np.random.uniform(0,np.max(p))
        #             if(u <= p[h]):
            H.append(h)
 
        sMean = np.mean(test1_hsv[1,:])
        sStd = np.std(test1_hsv[1,:],ddof = 1)

        vMean = np.mean(test1_hsv[2,:])
        vStd = np.std(test1_hsv[2,:],ddof = 1)

        hsv = []
        rgb = []
        hsvs = []
        targets = []

        for i in range(len(H)):
            hi = H[i]/360
            si = np.random.normal(sMean,sStd)
            vi = np.random.normal(vMean,vStd)
    #         print(hi)
    #         print(si)
    #         print(vi)
            if(si>1):
                si = 1
            if(vi>1):
                vi = 1
            if(si <= 0):
                si = 0
            if(vi <= 0):
                vi = 0
            if(np.std(np.array([hi,si,vi]),ddof=1) > 0.5 or np.mean(np.array([hi,si,vi])) < 0.1):
                continue
                
            rgb1 = colorsys.hsv_to_rgb(hi, si, vi)

            lab1 = rgb2lab(np.array(rgb1)*255)

            count = 0
            goal = np.insert(test1_1, cc, np.array(rgb1), 1)

            for k in range(numColor):
                rgb2 = test1_1copy[:,k]
                lab2 = rgb2lab(rgb2*255)
                if(ciede2000(lab1, lab2)> t):
                    count+=1

            if(count == numColor):
                targets.append(goal)


        targets = np.array(targets)
        targets = np.squeeze(targets)
        targets2 = targets * 255

        #suggestion color排序
        # allFeatures3 = createFeaturesFromData(targets,maxDatapoints)

        # v3 = pd.Series(allFeatures3)

        # values3= v3.values


        # allFeaturesData3 = np.array(values3[0])


        # for  i in range(1, len(values3)):
        #     #axis = 1 行不变列变化，axis=0行变列不变
        #     allFeaturesData3 = np.concatenate((allFeaturesData3, values3[i]), axis = 1)

        # pred4 = model_color.predict(allFeaturesData3.astype(np.float64))
 

    end = datetime.datetime.now()
    print(end-start)





    # m = len(pred4)
    # n = targets.shape[0]

    suggestion_data = [np.array([0.5451, 0.34118, 0.88630]), np.array([0.29020, 0.56471, 0.88630])]
    # suggestion_data = [np.array([65 / 255, 117 / 255, 5 / 255]), np.array([0.29020, 0.56471, 0.88630])]

    # if(len(pred4) != 0):
    # colorNum = targets.shape[1]
    # predSort = np.argsort(-pred4)
    # pred5 = np.round(pred4,5)

    # for i in predSort:
    for i in range(targets.shape[0]):
        suggestion_data.append(targets[i][cc])
    print('sugesstion_data', suggestion_data)
    
    suggestion_data =  np.array(suggestion_data) * 255
    suggestion_data = suggestion_data.astype(np.int32)


    res_data = dict()

    res_data[FeildsData] = 'rgb('+str(colorset[0][0])+','+str(colorset[0][1])+','+str(colorset[0][2])+')'

    for index, Catogories in enumerate(CatogoriesData):
        
        if(index < len(colorset)):
            res_data[Catogories] = 'rgb('+str(colorset[index][0])+','+str(colorset[index][1])+','+str(colorset[index][2])+')'
        else:
            print('index',index)
            print('len(colorset)',len(colorset))
            print(suggestion_data[0][1])
            print(suggestion_data[0][2])
            res_data[Catogories] = 'rgb('+str(suggestion_data[index-len(colorset)][0])+','+str(suggestion_data[index-len(colorset)][1])+','+str(suggestion_data[index-len(colorset)][2])+')'

    for index, Series in enumerate(SeriesData):
        
        if(index < len(colorset)):
            res_data[Series] = 'rgb('+str(colorset[index][0])+','+str(colorset[index][1])+','+str(colorset[index][2])+')'
        else:
            res_data[Series] = 'rgb('+str(suggestion_data[index-len(colorset)][0])+','+str(suggestion_data[index-len(colorset)][1])+','+str(suggestion_data[index-len(colorset)][2])+')'
    
    print("res_data",res_data)
            
    print('成功',res_data)

    re = {'data': res_data}
    response = make_response(jsonify(re))
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3001'
    response.headers['Access-Control-Allow-Methods'] = 'OPTIONS,HEAD,GET,POST'
    response.headers['Access-Control-Allow-Headers'] = 'x-requested-with'
    response.headers['Content-Type'] = 'application/json'



    return response.data


##################  colorSugesstion接口  ##################
@app.route('/')
@app.route(apiPrefix + 'colorSuggestion', methods=['POST', 'GET', 'OPTIONS','FETCH'])
@cross_origin(supports_credentials=True)
def colorSuggestion():

    ### import datetime
    start = datetime.datetime.now()

    #获取前端传输来的数据
    req_data = request.get_data(as_text=True)

    temp1_data = req_data.replace("[", "")
    temp2_data = temp1_data.replace("]", "")
    temp3_data = temp2_data.split(",")
    temp4_data = list(map(int, temp3_data))
    temp5_data = np.array(temp4_data)
    temp6_data = temp5_data.reshape((int(len(temp4_data) / 3), 3))

    

    test1_1 = np.array([temp6_data])/255


    test1_1copy = test1_1.copy()[0,:].T

    #定义差异度threshold - k 和插入位置 - c

    #8色以上就15了
    t = 15
    # c = test1_1copy.shape[1]
    a = 0.5
    pred6 = []
    targets3 = []
    cc = test1_1copy.shape[1]
    cc2 = cc + 1

    for c in range(len(test1_1copy)+1):
        test1_hsv = rgb2hsv(test1_1copy)

        hsv2 = np.round(test1_hsv * np.tile(np.array([[359, 100, 100]]).T, (1, test1_hsv.shape[1]))) + 1

        visHues = hsv2[0,:]
        visHues = visHues.astype(np.int16)  

        numColor = len(visHues)
        pJoint = np.zeros(360)
        pAdj1 = np.zeros(360)
        pAdj2 = np.zeros(360)


        if(c == 0):
            for k in range(1, numColor):
                for j in range(360):
                    ck = visHues[k]        
                    pJoint[j] += hueJoint[ck-1, j]
            for i in range(360):
                ci = visHues[0]
                pAdj1[i] = hueAdjacency[ci-1,i]
            p = (1-a) / 2 * hueProb.squeeze() + a * pAdj1  +  (1 - a)/2 * pJoint / (numColor - 1)

        elif(c == numColor):
            for k in range(0, numColor -1):
                for j in range(360):
                    ck = visHues[k]
                    pJoint[j] += hueJoint[ck-1, j]
            for j in range(360):
                cj = visHues[numColor -1]
                pAdj2[j] = hueAdjacency[cj-1,j]       
            p = (1-a) / 2 * hueProb.squeeze() + a * pAdj2  +  (1 - a)/2 * pJoint / (numColor - 1)

        else:
            for k in range(numColor):
                if(k != c or k!= (c-1)):
                    for j in range(360):
                        ck = visHues[k]
                        pJoint[j] += hueJoint[ck-1, j]
            for i in range(360):
                ci = visHues[c-1]
                pAdj1[i] = hueAdjacency[ci-1,i]
            for j in range(360):
                cj = visHues[c]
                pAdj2[j] = hueAdjacency[cj-1,j]
            p = (1-a) / 2 * hueProb.squeeze() + a * (pAdj1 + pAdj2)/2  +  (1 - a)/2 * pJoint / (numColor - 2)   
    

        H = []

        for i in range(30):
        #         for j in range(15):
        # #         for j in range(15):
            h = np.random.randint(0, 360)
            u = np.random.uniform(0,np.max(p))
        #             if(u <= p[h]):
            H.append(h)
 
        sMean = np.mean(test1_hsv[1,:])
        sStd = np.std(test1_hsv[1,:],ddof = 1)

        vMean = np.mean(test1_hsv[2,:])
        vStd = np.std(test1_hsv[2,:],ddof = 1)

        hsv = []
        rgb = []
        hsvs = []
        targets = []

        for i in range(len(H)):
            hi = H[i]/360
            si = np.random.normal(sMean,sStd)
            vi = np.random.normal(vMean,vStd)
    #         print(hi)
    #         print(si)
    #         print(vi)
            if(si>1):
                si = 1
            if(vi>1):
                vi = 1
            if(si <= 0):
                si = 0
            if(vi <= 0):
                vi = 0
            if(np.std(np.array([hi,si,vi]),ddof=1) > 0.5 or np.mean(np.array([hi,si,vi])) < 0.1):
                continue
                
            rgb1 = colorsys.hsv_to_rgb(hi, si, vi)

            lab1 = rgb2lab(np.array(rgb1)*255)

            count = 0
            goal = np.insert(test1_1, cc, np.array(rgb1), 1)

            for k in range(numColor):
                rgb2 = test1_1copy[:,k]
                lab2 = rgb2lab(rgb2*255)
                if(ciede2000(lab1, lab2)> t):
                    count+=1

            if(count == numColor):
                targets.append(goal)


        targets = np.array(targets)
        targets = np.squeeze(targets)
        targets2 = targets * 255
        allFeatures3 = createFeaturesFromData(targets,maxDatapoints)

        v3 = pd.Series(allFeatures3)

        values3= v3.values


        allFeaturesData3 = np.array(values3[0])


        for  i in range(1, len(values3)):
            #axis = 1 行不变列变化，axis=0行变列不变
            allFeaturesData3 = np.concatenate((allFeaturesData3, values3[i]), axis = 1)

        pred4 = model_color.predict(allFeaturesData3.astype(np.float64))
        #     predSort = np.argsort(-pred4)
        #     best = predSort[0]

    end = datetime.datetime.now()
    





    m = len(pred4)
    n = targets.shape[0]

    res_data = []
        
    if(len(pred4) != 0):
        colorNum = targets.shape[1]
        predSort = np.argsort(-pred4)
        pred5 = np.round(pred4,5)

        for i in predSort:
            res_data.append(targets[i][cc])
    
    res_data =  np.array(res_data) * 255
    res_data = res_data.astype(np.int32)
            
    print('成功',res_data)

    re = {'data': res_data.tolist()}
    response = make_response(jsonify(re))
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'OPTIONS,HEAD,GET,POST'
    response.headers['Access-Control-Allow-Headers'] = 'x-requested-with'



    return response.data


##################  similar ranking 接口  ##################  

# @app.route('/')
# @app.route(apiPrefix + 'similarRanking', methods=['POST', 'GET', 'OPTIONS'])
# @cross_origin(supports_credentials=True)
# def similarRanking():
#      query_token_list = request.get_data(as_text=True)#获取前端传输来的数据
#      print(query_token_list)
#      dataset = ImageFolder(dataset_path, transform=trf)
#      loader = DataLoader(dataset,
#                         batch_size=16, num_workers=0,
#                         drop_last=False, shuffle=False)

#      url_set = []

#      for i in range(len(dataset)):
#         url_set.append(dataset.imgs[i][0])

#      reference_name = 'small_dataset\\upload\\test.png'  # airport generate
     


#      with torch.no_grad():  # avoid memory usage to store gradients
#         all_icons_f = []  # store here the features
#         all_icons = []  # store here the input images
#         for icons, _ in tqdm(loader):
#             # move icons to the correct device
#             icons = icons.to(device)
#             # get icon features
#             icons_f = model(icons)

#             # store the features and images
#             for icon_f, icon in zip(icons_f, icons):
#                 all_icons_f.append(icon_f)
#                 # WARN: with a large number of images you might run out of RAM
#                 all_icons.append(icon)

#         # move stored features and icons from list to torch tensor
#         all_icons_f = torch.stack(all_icons_f)
#         all_icons = torch.stack(all_icons)

    
#      x = all_icons_f
  
#      n = x.size(0)
#      dist = torch.pow(x, 2).sum(dim=1, keepdim=True).expand(n, n)
#      dist = dist + dist.t()
#      dist.addmm_(1, -2, x, x.t())
#      all_icons_dist = dist.clamp(min=1e-12).sqrt()  # numerical stability
#     # return dist

#     # make diagonal a big number
#      all_icons_dist[range(len(all_icons_dist)), range(len(all_icons_dist))] = 9999


#     # plot all the images
#     # reference_ix = 0
#      n_close_elems = len(dataset)
#      out_folder = 'similar_icons'



#      print(reference_name)
#     #  print(icon_type)

#      reference_ix = url_set.index(reference_name)
#      k=n_close_elems
#      dist=all_icons_dist
#      images=all_icons
#      folder=out_folder

#      reference = images[reference_ix]

#      targetPath = 'similar_icons_img'

#      min_dist, min_idx = torch.topk(dist[reference_ix], k=k, largest=False)

#      all_ranking = []
#     # plot closer images to the reference
#      for i in range(k):
#         dist, idx = min_dist[i], min_idx[i]
#         icon = images[idx]
#         url = url_set[idx]
#         if( i < k-1):
#             all_ranking.append(url.split('.')[0].split('\\')[-1])	

#      index_ranking =all_ranking[:]


#      similar_ranking = []
#      charttype = 'barchart'
#      if(charttype == 'barchart'):
#         for i in range(len(index_ranking)):
#             s = index_ranking[i]
#             if s in GV_Barchart:
#                 similar_ranking.append(s)
#                 all_ranking.remove(s)
#         similar_ranking.extend(all_ranking)


#      print('成功',similar_ranking)

#      re = {'data': similar_ranking}
#      response = make_response(jsonify(re))
#      response.headers['Access-Control-Allow-Origin'] = '*'
#      response.headers['Access-Control-Allow-Methods'] = 'OPTIONS,HEAD,GET,POST'
#      response.headers['Access-Control-Allow-Headers'] = 'x-requested-with'
#      return response.data

if __name__ == '__main__':
	# main()
    app.run(host='0.0.0.0', port=5000, debug=True)
