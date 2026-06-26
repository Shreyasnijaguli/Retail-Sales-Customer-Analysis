#!/usr/bin/env python
# coding: utf-8

# In[ ]:


#Importing necessary libraries:

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

#Supressing warnings:

import warnings
warnings.filterwarnings('ignore')


# In[ ]:


#reading data from csv file:

sales_df = pd.read_csv('superstore_final_dataset.csv')


# In[ ]:


#checking the head of the data:

sales_df.head()


# In[ ]:


#Checking the shape of the data:

sales_df.shape


# In[ ]:


#Checking the summary of the data:

sales_df.info()


# In[ ]:


#Changing the data type of 'Order_Date' and 'Ship_Date' to datetime type:

sales_df['Order_Date'] = pd.to_datetime(sales_df['Order_Date'],format = "%d/%m/%Y")
sales_df['Ship_Date'] = pd.to_datetime(sales_df['Ship_Date'], format = "%d/%m/%Y")


# ### Date column has been correctly parsed and formatted.

# In[ ]:


#Checking if the datatype is properly changed:

sales_df.info()


# In[ ]:


#Checking the null values:

sales_df.isnull().sum()


# ### Only the Postal_Code has null values. Let's drop these rows as they are less in numbers.

# In[ ]:


#Dropping rows with null values:

sales_df = sales_df[~(sales_df['Postal_Code'].isnull())]


# In[ ]:


#Checking the data after dropping rows:

sales_df.shape


# In[ ]:


#Checking the dtypes:

sales_df.dtypes


# In[ ]:


#Converting the dtype of Postal_Code from float64 to int64:

sales_df['Postal_Code'] = sales_df['Postal_Code'].astype('int64')


# In[ ]:


#Checking the statistical summary of the data:

sales_df.describe()


# In[ ]:


#checking the duplicate records:

duplicate = sales_df[sales_df.iloc[:,1:].duplicated(keep=False)]
duplicate


# In[ ]:


#Dropping the duplicate records:

sales_df = sales_df.iloc[:,1:].drop_duplicates()


# In[ ]:


sales_df.shape


# ### There was one duplicated record.

# In[ ]:


#Checking the head of the data:

sales_df.head()


# In[ ]:


#list of all column names:

cols = list(sales_df.columns)

#Checking values count of each column:

for col in cols:
    print(col)
    print('')
    print(sales_df[col].value_counts())
    print('')


# ### It seems there are no irrelevant values present in the dataset.

# In[ ]:


#Checking For each entry in dataset if ship date >= order date:

sales_df[sales_df['Ship_Date'] < sales_df['Order_Date']]


# ### There are no records which have Ship date before the Order date.

# In[ ]:


sales_df.reset_index(drop = True,inplace = True)


# In[ ]:


#Exporting the cleaned dataset to csv:

sales_df.to_csv('superstore_sales_cleaned.csv',index=False)


# In[ ]:





# In[ ]:




