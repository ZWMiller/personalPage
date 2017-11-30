import numpy as np

size = 10000000
a = np.array([i for i in range(size)])
print(type(a))
b = [i for i in range(size)]
print(type(b))
c = tuple(i for i in range(size))
print(type(c))

%%timeit
sm = np.sum(a)

%%timeit
sm=0
for x in b:
    sm+=x

%%timeit
sm=0
for x in c:
    sm+=x

%%timeit
a+0.5

%%timeit
[x+0.5 for x in b]

%%timeit
[x+0.5 for x in c]

%%timeit
[x+0.5 for x in a]

%%timeit
list((x+0.5 for x in b))

%%timeit 
sm=0
sm+=a[10]

%%timeit 
sm=0
sm+=b[10]

%%timeit 
sm=0
sm+=c[10]

%%timeit
x = [1,2,3,4,5,6,7,8,9,10]

%%timeit
x = (1,2,3,4,5,6,7,8,9,10)

%%timeit
x = [1, 2, 3, 4, 5, 6, 7, ..., 997, 998, 999, 1000]

%%timeit
x = (1, 2, 3, 4, 5, 6, 7, ..., 997, 998, 999, 1000)

def x2(x):
    return x**2
        
%%timeit 
test = a[x2(a)>0.3]

%%timeit 
test2 = [x for x in b if x2(x) > 0.3]

np.sum(np.array(test) - np.array(test2) != 0)

%%timeit 
gen = (x+0.5 for x in b)
q = [x for x in gen]
