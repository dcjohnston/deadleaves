###
# Author: Charles Frye
# receives two parameters, alpha and N
# and produces N samples from power-law
# distribution with parameter alpha-1
#
# prints \n-separated strings to StdOut
#
# Call from command line like:
#     python powRNG.py 0.1 10
#
# requires numpy, works with Python 2 or 3
###

import numpy as np
import sys

#get args from command line
alpha = float(sys.argv[1])
N = int(sys.argv[2])

#generate list of floats using powerlaw with minimum
scales = list(np.random.power(alpha,size=N))
mins = list(np.add(0.01,np.random.normal(0,0.005,size=N)))
#vAbs = np.vectorize(abs)
mins = map(abs,mins) #ensure no negatives
#mins = vAbs(mins) #ensure no negatives
scales = [max(scale,mini) for scale,mini in zip(scales,mins)]

#turn them into strings and print to StdOut
scaleStrs = '\n'.join([str(scale) for scale in scales])

print(scaleStrs)
