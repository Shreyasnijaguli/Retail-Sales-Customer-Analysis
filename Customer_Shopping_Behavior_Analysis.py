#!/usr/bin/env python
# coding: utf-8

# In[1]:


# Loading the dataset using pandas

import pandas as pd

df = pd.read_csv('customer_shopping_behavior.csv')


# In[2]:


df.head()


# In[3]:


df.info()


# In[4]:


# Summary statistics using .describe()
df.describe(include='all')


# In[5]:


# Checking if missing data or null values are present in the dataset

df.isnull().sum()


# In[6]:


# Imputing missing values in Review Rating column with the median rating of the product category

df['Review Rating'] = df.groupby('Category')['Review Rating'].transform(lambda x: x.fillna(x.median()))


# In[7]:


df.isnull().sum()


# In[8]:


# Renaming columns according to snake casing for better readability and documentation

df.columns = df.columns.str.lower()
df.columns = df.columns.str.replace(' ','_')
df = df.rename(columns={'purchase_amount_(usd)':'purchase_amount'})


# In[9]:


df.columns


# In[10]:


# create a new column age_group
labels = ['Young Adult', 'Adult', 'Middle-aged', 'Senior']
df['age_group'] = pd.qcut(df['age'], q=4, labels = labels)


# In[11]:


df[['age','age_group']].head(10)


# In[12]:


# create new column purchase_frequency_days

frequency_mapping = {
    'Fortnightly': 14,
    'Weekly': 7,
    'Monthly': 30,
    'Quarterly': 90,
    'Bi-Weekly': 14,
    'Annually': 365,
    'Every 3 Months': 90
}

df['purchase_frequency_days'] = df['frequency_of_purchases'].map(frequency_mapping)


# In[21]:


df[['purchase_frequency_days','frequency_of_purchases']].head(10)


# In[22]:


df[['discount_applied','promo_code_used']].head(10)


# In[23]:


(df['discount_applied'] == df['promo_code_used']).all()


# In[24]:


# Dropping promo code used column

df = df.drop('promo_code_used', axis=1)


# In[25]:


df.columns


df.to_csv('cleaned_customer_shopping_behavior.csv', index=False)
print('Cleaned data saved to cleaned_customer_shopping_behavior.csv')
