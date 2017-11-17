import pandas as pd
import numpy as np

num_users = 10
num_items = 5
np.random.seed(42)
def generate_users(num_users, num_items):
    data = []
    for i in range(num_users):
        user = [np.random.randint(2) for _ in range(num_items)]
        data.append(user)
    return data

cols = ["item"+str(i) for i in range(num_items)]
rows = ["user"+str(i) for i in range(num_users)]
user_item_mat = pd.DataFrame(generate_users(num_users,num_items), columns=cols)
user_item_mat.index = rows

from scipy.linalg import svd

U, Sigma, VT = svd(user_item_mat)

VT = VT[:3,:]
pd.DataFrame(VT.T)

U = U[:,:3]
pd.DataFrame(U)

compare_item = 2
for item in range(num_items):
    if item != compare_item:
        print("Item %s & %s: "%(compare_item,item), np.dot(VT.T[compare_item],VT.T[item]))
        

compare_user = 6
for user in range(num_users):
    #if user != compare_user:
        print("User %s & %s: "%(compare_user,user), np.dot(U[compare_user],U[user]))
      
      

def get_recommends(itemID, VT, num_recom=2):
    recs = []
    for item in range(VT.T.shape[0]):
        if item != itemID:
            recs.append([item,np.dot(VT.T[itemID],VT.T[item])])
    final_rec = [i[0] for i in sorted(recs,key=lambda x: x[1],reverse=True)]
    return final_rec[:num_recom]

print(get_recommends(2,VT,num_recom=2))


def get_recommends_user(userID, U, df):
    userrecs = []
    for user in range(U.shape[0]):
        if user!= userID:
            userrecs.append([user,np.dot(U[userID],U[user])])
    final_rec = [i[0] for i in sorted(userrecs,key=lambda x: x[1],reverse=True)]
    comp_user = final_rec[0]
    print("User #%s's most similar user is User #%s "% (userID, comp_user))
    rec_likes = df.iloc[comp_user]
    current = df.iloc[userID]
    recs = []
    for i,item in enumerate(current):
        if item != rec_likes[i] and rec_likes[i]!=0:
            recs.append(i)
    return recs

user_to_rec = 3
print("Items for User %s to check out: "% user_to_rec, get_recommends_user(user_to_rec,U,user_item_mat))
