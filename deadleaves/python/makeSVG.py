# Takes in a list of filenames and 

import numpy as np
import sys
import os
import string
import svgutils.transform as sg
from collections import namedtuple

def main():
	"""handles command-line input, generates svg file of scaledEmojis,
	and then returns a filepath to stdout"""

	wd = os.getcwd()
	filenames,alpha,size,outDir = parseInput()

	N = getN(alpha)

	emojis = randEmojis(N=N,filenames=filenames)

	scaledEmojis = scaleEmojis(emojis,alpha=0.1,xmin=alpha/10,xLim=size[0],yLim=size[1])

	fig = sg.SVGFigure(str(size[0])+"px", str(size[1])+"px")

	fig.append(scaledEmojis)
	outFileID = randomID()

	outFilePath = os.path.join(wd,outDir,outFileID+'.svg')
	fig.save(outFilePath)

	print(outFilePath)

def parseInput():
	"""there are three keywords:
		-i: intensity, should be followed by float-able string
		-e: emojiFiles, should be followed by space-separated list of filepaths
		-o: options, should be followed by space-separated list of name,value pairs
			^this one is a gross hack, and I only implemented two options: size and outDir.
	"""
	args = sys.argv[1:]
	keywordDict = {'-i':[],'-o':[],'-e':[]}

	for arg in args:
		if arg in keywordDict:
			out = keywordDict[arg]
		else:
			out.append(arg)

	alpha = getAlpha(float(keywordDict['-i'][0]))
	filenames = keywordDict['-e']

	options = keywordDict['-o']

	try:
		sizeIndex = options.index('size')
		size = (int(options[sizeIndex+1]),int(options[sizeIndex+2]))
	except ValueError:
		size = (300,300)
	
	try:
		outIndex = options.index('out')
		outDir = options[outIndex+1]
	except ValueError:
		outDir = ''

	return filenames,alpha,size,outDir

def getInversePowerCDF(alpha,xmin):
	"""given alpha and xmin, returns an inverse CDF,
	or inverse cumulative density function"""
	def inversePowerCDF(p):
		return alpha*xmin*p**(-1/(alpha+1))
	return inversePowerCDF

def randomID(N=16):
	"""random ASCII alphanumeric string with 167 elements"""
	return ''.join(np.random.choice(list(string.ascii_letters+string.digits),(N)))

def randEmojis(N,filenames):
	"""returns N svg elements sourced from fileNames"""
	fNames = np.random.choice(filenames,N)
	return [sg.fromfile(fName) for fName in fNames]

def scaleEmojis(emojis,alpha=0.01,xmin=0.01,xLim=100,yLim=100):
	"""given a list of svg elements, produces a list of ready-to-append
	roots for svg images that have been scaled and translated appropriately"""
	ipCDF = getInversePowerCDF(alpha,xmin)
	
	emojiRoots = [emoji.getroot() for emoji in emojis]
	
	for emojiRoot in emojiRoots:
		scale = ipCDF(np.random.uniform())
		emojiRoot.moveto(0,0,scale=1)
		emojiRoot.moveto(0,0,scale=scale)
		#emojiRoot.moveto(200,200,scale=scale)
		locX = np.random.uniform(0,xLim)/scale; 
		locY = np.random.uniform(0,yLim)/scale;
		emojiRoot.moveto(locX,locY,scale=1)
		emojiRoot.rotate(angle=np.random.uniform(0,360))
		
	return emojiRoots

def getN(alpha):
	"""assumes each element has diameter equal to scale, which isn't really true,
	but the approximation actually works fairly well"""
	return (alpha**-1)*(10**3.6987)

def getAlpha(intensity):
	"""in case we decide to use a different scale for intensity"""
	return intensity

if __name__ == '__main__':
	main()